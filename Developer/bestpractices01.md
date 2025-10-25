# [spezi01] Constitution — API-First Supabase AI Law Tutor
This constitution defines principles, constraints, and governance for a persistent, API-first Supabase-backed AI application that acts as a law tutor for law students. It sets expectations for contract-first development, stable versioned APIs, developer experience (OpenAPI + SDKs), student privacy, reproducible data handling, and operational safety.

## Purpose
To build, operate, and evolve a persistent, auditable AI assistant that tutors law students: answers questions, explains legal concepts with citations, supports case-reading skills, and helps draft study notes — while preserving student privacy and complying with applicable legal and ethical standards.

## Core Principles

### 0. API-First (Contract-First) — Required
Design and ship behavior as explicit, versioned API contracts (OpenAPI/GraphQL schema) before implementing server or client code. APIs are the source-of-truth: design endpoints, request/response schemas, auth scopes, error codes, and rate limits in OpenAPI and store those specs in the repository.

API-first outcomes:
- Clear client/workflow expectations and early mockable contracts for frontend, mobile, instructor tools, and third-party integrators.
- Automatic SDK generation and contract tests in CI to prevent breaking changes.
- Fast reviews of behavioral changes via OpenAPI diffs and mock servers.

---

### 1. Student-First, Safety-First
All product decisions must prioritize student safety and academic integrity. The system must clearly state limitations, avoid giving advice that could be relied on for real-world legal decisions, and provide citations and provenance for legal claims.

### 2. Privacy & Compliance (Non-Negotiable)
Design for minimal data retention and least privilege. Personal data is protected by encryption at rest and in transit. Respect institutional privacy policies (e.g., FERPA where applicable), student consent, and jurisdictional data residency requirements. Record only what is necessary for tutoring, analytics, and debugging.

### 3. Accuracy, Traceability & Citations
Provide sources and citations when producing legal statements. Store prompts, embeddings, retrieved documents, and model outputs for auditability. Distinguish opinion from statute/case law and include jurisdiction and authority level metadata.

### 4. Human-in-the-Loop & Transparency
Maintain an explicit human escalation path. When the system is uncertain (low retrieval score, conflicting authorities, or hallucination risk), it must flag uncertainty and recommend supervisor review. Users must be shown when content is AI-generated and given an easy way to report errors.

### 5. Reproducibility & Persistence
Persist all tutoring sessions, document references, and embedding indices in Supabase Postgres and Storage so that conversations and evidence can be reproduced later for teaching, grading appeals, or audits.

### 6. Test-First and Contracted APIs
Define data contracts and tests (unit, integration, contract tests) before implementing new storage schemas or public endpoints. Changes to stored schemas or retrieval behavior must include migration plans and test coverage.

### 7. Simplicity & Auditability
Prefer simple, observable designs. Structured logs, deterministic storage of prompts/outputs, and open audit trails are required.

## System Contract (Inputs / Outputs / Error Modes)
- Inputs: authenticated student or instructor requests (text), uploaded documents (PDFs), annotations, instructor-provided rubrics.
- Outputs: AI responses with rationale, citations, confidence score, and provenance links (document id, slice, retrieval score); structured feedback for grading assistance.
- Error modes: unavailable retrieval data, out-of-jurisdiction queries, low-confidence responses, PII exposure detected — each must return a standardized error code and recommended action.

API contract expectations:
- All public API surfaces must have OpenAPI (v3.x) specs stored in `/api/openapi/` in the repo.
- Every operation must document: path, method, parameters, request/response schemas, authentication scopes, expected error codes, and typical rate limits.
- Responses must include a standardized metadata block: { request_id, model_metadata, provenance: [ { document_id, chunk_index, score } ], confidence }.

Example stable REST endpoints (versioned):
- POST /v1/sessions → create tutoring session (returns session_id)
- POST /v1/sessions/:session_id/messages → append a user message; returns message id and queued model job
- GET /v1/sessions/:session_id/messages → paginated list of messages with provenance
- POST /v1/documents → upload document (returns document id and indexing job)
- GET /v1/documents/:id → document metadata and indexing status
- POST /v1/embeddings → (admin) regenerate embeddings for a document or chunk
- POST /v1/webhooks → register webhook (for async events like indexing_complete)
- GET /v1/health → system health and model versions

Async patterns:
- Operations that take time (indexing, embedding, long model generations) must return 202 Accepted with a job resource and webhook/callback support.

Idempotency & pagination:
- Write endpoints that may be retried (uploads, message deliveries) must accept an idempotency_key header.
- List endpoints must be cursor-based and include per-page metadata (next_cursor, has_more).

## Data Model & Persistence (Supabase-specific)
All persistent data must be stored in Supabase (Postgres + Storage). Example core tables and purpose:

- users (id, role [student/instructor/admin], institution_id, consent_flags, last_active)
- student_profiles (user_id, anonymized_id, enrolled_programs)
- sessions (id, user_id, started_at, ended_at, metadata)
- messages (id, session_id, sender role, prompt_text, model_response_id, timestamp)
- model_responses (id, model_name, response_text, tokens_used, confidence, provenance_json)
- documents (id, owner_id, title, storage_path, sha256, jurisdiction, uploaded_at)
- embeddings (id, document_id, chunk_index, vector, created_at)
- retrieval_logs (id, session_id, query, retrieved_doc_ids, scores)
- audit_log (id, actor_id, action, details, timestamp)

Persistence rules:
- Never store raw uploaded documents in plaintext outside of Supabase Storage.
- Store only necessary PII, with clear retention TTLs and a deletion API supporting right-to-be-forgotten workflows where applicable.
- All embeddings and retrieval indices must be reproducible from stored documents and code. Store model version and embedding model metadata with each embedding.

API-first mapping:
- Each DB table must have a corresponding API resource (collection/resource) with clear CRUD contract.
- Use Supabase Row-Level Security (RLS) to enforce per-API-scope access; map API scopes to RLS policies.
- Store OpenAPI schemas for request/response shapes alongside DB schema migrations to keep contracts synchronized.

## Security & Access Control
- Use JWT-based authentication and Supabase Row Level Security (RLS) to ensure users only access their own data unless explicitly permitted.
- Encrypt sensitive columns (PII) using application-level encryption keys stored in a secrets manager.
- Use strong RBAC: instructor roles may access student-submitted materials only with consent or institutional policy.
- Audit all privileged actions and store audit logs in an append-only table.

API gateway and access patterns:
- Front the APIs with an API gateway or reverse proxy that handles authentication, rate limiting, API key management, and CORS.
- Define OAuth2 / JWT token flows for integration partners; document scopes for /v1/sessions.read, /v1/sessions.write, /v1/documents.upload, etc.
- Implement per-client rate limits and usage quotas.

## Model & Data Governance
- Record model metadata (provider, model id, temperature, embeddings model) with every response.
- Maintain a catalog of training and reference sources used for retrieval; prefer authoritative sources (case law, statutes, recognized treatises).
- Implement a review pipeline for adding proprietary or scraped datasets; document provenance and rights for each dataset.

API governance:
- API versioning policy: MAJOR versions for breaking changes; MINOR for additive non-breaking changes. Document deprecation windows for retired endpoints.
- OpenAPI diffs must be part of PR checks; regressions in public contracts must fail CI unless explicitly approved with a migration plan.

## Safety & Academic Integrity
- Implement detection for academic dishonesty patterns (e.g., request to write an exam answer) and either refuse or escalate.
- Provide instructors with tools to detect over-reliance: e.g., similarity of student submissions to model outputs, timestamped session logs, and opt-in analytics.

## Testing & Quality Gates
- Mandatory tests before merging:
	- Unit tests for storage and RLS rules.
	- Integration tests for Supabase flows (auth, storage, functions).
	- Contract tests verifying message/response shapes and provenance fields.
	- Retrieval accuracy smoke tests against canonical legal corpora.
- Red-team periodic reviews for hallucination and adversarial prompts.

API-first testing additions:
- OpenAPI linting and validation in CI (spectral or similar).
- Contract tests that mock the API surface and validate server responses against the OpenAPI spec.
- Generated SDK smoke tests: CI should generate the client SDK and run a few basic end-to-end calls against a staging mock server.
- API load/latency tests for common educational workloads.

## Observability & Monitoring
- Structured logs (JSON) for all prompts/responses (avoid logging full PII); store per-request metadata and tracing ids.
- Metrics to track: average retrieval score, percent of low-confidence responses, latency, token usage, and privacy incidents.
- Alerting: on spike in low-confidence outputs, degraded retrieval performance, or suspicious data access patterns.

API-centric observability:
- Track per-endpoint metrics: requests/sec, 4xx/5xx rates, average latency, throttled requests, and auth failures.
- Expose an internal API for metrics and traces to support automated dashboards and incident responders.
- Keep an audit trail of API key issuance and scope changes.

## Backups & Disaster Recovery
- Nightly backups of Postgres and Storage with a documented recovery SLA.
- Test restore at least quarterly to validate recoverability.

## Deployment & Change Management
- Changes to the data schema require: migration script, compatibility tests, rollback plan, and documentation.
- Version public facing behavior (model versions, retrieval ranker) and provide migration notes when behavior changes could alter tutoring outputs.

## Governance & Amendments
- This constitution supersedes ad-hoc practices. Amendments require:
	- A documented rationale and migration plan.
	- Approval by the governance group (product owner, a legal-education advisor, privacy officer, and an engineer).
	- Communication plan to affected users (instructors, institutions, students).

## Transparency & Disclaimers
- All student-facing UIs must include a concise AI-disclaimer: the assistant is an educational aid, not a substitute for legal advice. Include link to full Terms and Privacy.

## Minimal Implementation Checklist (contract)
- Inputs: authenticated requests with user_id, session_id.
- Stored artifacts: prompt, response, model metadata, retrieval provenance, timestamps.
- Exposed API: /sessions, /messages, /responses, /documents, /embeddings, each with clear schemas and error codes.

## Edge Cases & Mitigations (short list)
- Empty or malformed uploads: reject with error and guidance.
- Jurisdiction mismatch: flag and avoid definitive legal conclusions.
- PII leakage in documents: run PII detection and redact or require instructor sign-off before indexing.

## Next Steps (practical)
1. Publish this constitution in `/.specify/memory/constitution.md` (this file).
2. Create a minimal Supabase schema and seed scripts that follow the Data Model section.
3. Add CI tests (RLS checks, integration tests) and a README that documents developer workflows.
4. Create an OpenAPI v3 spec for the /v1 API and add CI contract tests and SDK generation jobs.
5. Introduce an API gateway (or proxy config) in staging to enforce auth and rate limits.

## Governance Metadata
**Version**: 1.0.0 | **Ratified**: 2025-10-25 | **Last Amended**: 2025-10-25

---
If you want, I can now (A) create the minimal Supabase schema and sample seed scripts, (B) add CI tests for the RLS rules, or (C) open a short README and checklist for onboarding instructors and privacy reviewers. Tell me which next step to do and I'll proceed.
