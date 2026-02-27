# 10 — NullByte Academy: Defensive Case Studies

> *"History doesn't repeat itself in security — but it rhymes, loudly, with the same vulnerability classes wearing different clothes."*

---

## 1. Purpose and Method

Case studies are where abstract principles meet concrete reality. This document presents five architectural case studies drawn from the history of publicly disclosed vulnerabilities. Each study is analyzed not for its exploitation mechanics — those details are available in published advisories — but for the design decisions that created the vulnerability, the detection opportunities that were missed, and the architectural lessons that generalize to other systems.

The goal is pattern recognition. A practitioner who understands *why* a class of vulnerability appeared in a real system can recognize the preconditions for the same class in a new system, before a researcher does.

Every case study follows the same structure: system context, the design assumption that failed, what the failure looked like architecturally, what detection opportunities existed, and what architectural changes would have prevented it.

---

## 2. Case Study A: The Trusted Length Field

**Vulnerability Class**: Heap Buffer Overflow via Integer Arithmetic
**System Type**: Network protocol parser, server-side
**Disclosure Status**: Fully patched, publicly documented class

### Design Context

A server accepted binary protocol messages containing a length-prefixed payload. The length field was a 16-bit unsigned integer. The server allocated a buffer based on this value, then copied the payload into it.

```
Protocol Message Layout:

  ┌───────────────────────────────────────────────────┐
  │  Type (1B) │ Flags (1B) │ Length (2B) │ Payload   │
  └───────────────────────────────────────────────────┘
                                │              │
                                └──── used to allocate buffer
                                      of this size for payload copy
```

### The Assumption That Failed

The server trusted the client-supplied length field without validation. A crafted message with length = 0 caused `malloc(0)` to return a valid (minimal) pointer. The server then copied the actual payload — however large — into a buffer sized for zero bytes.

Separately, a version of the parser added a fixed overhead to the length before allocation: `malloc(length + HEADER_SIZE)`. If `length` was close to `UINT16_MAX`, the addition could overflow to a small value, again producing an undersized allocation followed by an oversized copy.

### Detection Opportunities Missed

- No bounds check on the length field against a defined protocol maximum
- No use of sanitizers in CI that would have caught the heap overflow in testing
- No fuzzing of the protocol parser with boundary values (0, 1, MAX-1, MAX)

### Architectural Remedy

```
Secure Length Handling Pattern:

  Receive length field
        │
  ┌─────▼──────────────────────────────────────────┐
  │ 1. Reject length == 0 (or handle explicitly)   │
  │ 2. Reject length > PROTOCOL_MAX_PAYLOAD        │
  │ 3. If adding overhead: check for overflow FIRST│
  │    if (length > SIZE_MAX - OVERHEAD) → reject  │
  │ 4. Allocate: malloc(length + OVERHEAD)         │
  │ 5. Copy exactly length bytes, no more          │
  └────────────────────────────────────────────────┘
```

**Generalizable lesson**: Any value supplied by an untrusted party that influences memory allocation size must be validated for zero, maximum, and arithmetic overflow before use. This is a precondition check, not a runtime check — it belongs at the boundary, before any state changes occur.

---

## 3. Case Study B: The Forgotten State

**Vulnerability Class**: Use-After-Free
**System Type**: Browser rendering engine
**Disclosure Status**: Fully patched, publicly documented class

### Design Context

A rendering engine maintained a tree of DOM node objects. Event handlers could be registered on nodes and could modify the DOM during dispatch — including by removing the node currently being processed.

### The Assumption That Failed

The event dispatch loop held a pointer to the current node. If an event handler removed that node from the DOM and triggered garbage collection, the engine freed the memory. The dispatch loop's pointer was now dangling — pointing to freed memory that could be reallocated for a different purpose.

```
Event Dispatch Timeline:

  t=0: Loop holds pointer to NodeA
  t=1: Event fires, calls handler
  t=2: Handler removes NodeA from DOM
  t=3: GC runs, frees NodeA's memory
  t=4: Allocator reuses memory for ObjectX
  t=5: Loop resumes, reads NodeA fields
       ↓
       Reads ObjectX fields through NodeA pointer
       → Type confusion / memory corruption
```

### Detection Opportunities Missed

- AddressSanitizer and MemorySanitizer would have detected the UAF access in testing
- Fuzzing the DOM mutation API during event dispatch would have triggered the condition
- Code review of the event dispatch loop could have identified the missing reference count increment

### Architectural Remedy

The solution is reference counting or ownership semantics: if the dispatch loop holds a pointer to a node, it should hold a reference that prevents the node from being freed while the pointer is live. Modern rendering engines implement this through smart pointer types (e.g., `Ref<Node>` rather than `Node*`) that automatically increment the reference count.

**Generalizable lesson**: Any architectural pattern where a pointer to an object is held across a context where that object could be deallocated is a UAF waiting to happen. The fix is not a bounds check — it is an ownership model that makes the problematic pattern structurally impossible.

---

## 4. Case Study C: The Implicit Trust Boundary

**Vulnerability Class**: Server-Side Request Forgery (SSRF)
**System Type**: Cloud-hosted web application
**Disclosure Status**: Fully patched, publicly documented class

### Design Context

A web application allowed users to provide a URL from which the server would fetch content (a webhook validator, image fetcher, or similar feature). The server made HTTP requests on the user's behalf.

### The Assumption That Failed

The feature was designed for external URLs. The implementation did not account for the fact that the server had network access to internal infrastructure — cloud metadata endpoints, internal APIs, and adjacent services — that the external user did not.

```
Intended Architecture:          Actual Architecture:

  [User] → [App Server]          [User] → [App Server]
                │                               │
                │ fetch URL                     │ fetch URL (any URL)
                ▼                               ├──► external.example.com
          external.example.com                 ├──► 169.254.169.254 (metadata)
                                               ├──► internal-api.corp
                                               └──► adjacent services
```

### Architectural Remedy

- Allowlist of permitted external URL schemes and domains, not a blocklist of internal ranges
- Resolve DNS before fetching and validate the resolved IP against a blocklist of private ranges (RFC 1918, loopback, link-local)
- Fetch using a dedicated outbound-only service account with no internal network access
- Block redirects or re-validate post-redirect destination

**Generalizable lesson**: Trust boundaries in cloud environments are not automatic. The network topology available to a server-side component is not the same as the network topology available to the user. Any feature that allows user-supplied URLs to drive server-side network requests must be designed with that discrepancy explicitly in mind.

---

## 5. Case Study D: The Cryptographic Shortcut

**Vulnerability Class**: Broken Authentication — Predictable Token Generation
**System Type**: Session management in web application
**Disclosure Status**: Fully patched, publicly documented class

### The Assumption That Failed

A session token was generated by hashing the concatenation of the user ID, a timestamp, and a server-side secret. The secret was insufficiently random (derived from the application start time). The timestamp was guessable within a small range. An attacker who could observe the approximate session creation time could enumerate a manageable token space.

```
Flawed Token Generation:

  token = MD5( user_id + timestamp + "secret_abc123" )
               │             │          │
               known     ±few seconds  low-entropy secret
               to user   window
                   └──────────────────────────────┘
                       attackable search space
```

### Architectural Remedy

Session tokens must be generated from a cryptographically secure random number generator (CSPRNG) with sufficient entropy — 128 bits minimum. Token generation should not incorporate any predictable or observable inputs. The secret, if used, must be generated from a CSPRNG and stored securely.

**Generalizable lesson**: Session tokens, nonces, and any other values that must be unpredictable to an adversary must be derived entirely from a CSPRNG. Hashing predictable values does not produce unpredictable output.

---

## 6. Cross-Cutting Lessons

Across all five case studies, three patterns appear repeatedly:

**Boundary validation is non-negotiable.** Every case involves data crossing a trust boundary — client to server, user to cloud, network to process — without sufficient validation at that boundary. The fix in every case involves moving validation to the boundary.

**The defensive ecosystem works, when used.** Memory sanitizers, fuzzers, and code review would have caught three of the five vulnerabilities before deployment. These tools exist. They must be integrated into development practice, not used as occasional auditing tools.

**Design-level fixes outlast patch-level fixes.** In every case, the patch that shipped was a control — an additional check, a validation rule. The architectural fix — ownership semantics, explicit trust boundary enforcement, CSPRNG by design — would have made the vulnerability class structurally impossible. Patches fix vulnerabilities. Architecture eliminates vulnerability classes.

---

*Document version: 1.0 | NullByte Academy Curriculum Committee*
