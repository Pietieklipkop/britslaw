# ERD.md — LegalForge Entity Relationship Diagram

> **Version:** 1.0.0-draft
> **Date:** 2026-06-30
> **Status:** Planning Phase

---

## 1. Overview

The database is a Cloudflare D1 (SQLite) instance managed with Drizzle ORM. All tenant-scoped tables include a `tenant_id` foreign key for row-level isolation. Better Auth manages the `users`, `sessions`, `accounts`, and `verifications` tables.

---

## 2. Entity Relationship Diagram

```mermaid
erDiagram

    %% ─── AUTH (Better Auth managed) ───────────────────────────────
    users {
        text id PK
        text email UK
        text name
        text role "platform_admin | firm_admin | firm_editor | end_user"
        text tenant_id FK
        boolean email_verified
        timestamp created_at
        timestamp updated_at
    }

    sessions {
        text id PK
        text user_id FK
        text token UK
        timestamp expires_at
        timestamp created_at
    }

    accounts {
        text id PK
        text user_id FK
        text account_id
        text provider_id
        text access_token
        text refresh_token
        timestamp access_token_expires_at
        timestamp created_at
    }

    %% ─── TENANTS ───────────────────────────────────────────────────
    tenants {
        text id PK
        text name
        text slug UK "subdomain"
        text logo_url
        text primary_colour
        text contact_email
        text contact_phone
        text address
        text plan "starter | professional | enterprise"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    %% ─── TEMPLATES ─────────────────────────────────────────────────
    contract_templates {
        text id PK
        text tenant_id FK
        text name
        text description
        text jurisdiction
        text language
        integer estimated_minutes
        text cover_image_url
        text status "draft | published | archived"
        integer version
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }

    template_party_definitions {
        text id PK
        text template_id FK
        text role_key "buyer | seller | landlord | tenant | director"
        text display_name
        text description
        boolean allows_multiple
        integer sort_order
    }

    template_sections {
        text id PK
        text template_id FK
        text title
        text description
        integer sort_order
        boolean is_required
    }

    %% ─── CLAUSES ───────────────────────────────────────────────────
    clauses {
        text id PK
        text section_id FK
        text tenant_id FK
        text title
        text explanation
        text examples
        text legal_text
        boolean is_default
        integer sort_order
        timestamp created_at
        timestamp updated_at
    }

    clause_conflicts {
        text id PK
        text clause_id_a FK
        text clause_id_b FK
        text conflict_type "incompatible | warning"
        text explanation
        timestamp created_at
    }

    %% ─── CONTRACTS (End User) ──────────────────────────────────────
    contracts {
        text id PK
        text tenant_id FK
        text user_id FK
        text template_id FK
        integer template_version
        text status "draft | in_progress | review | generated | archived"
        integer current_step "section sort_order"
        text pdf_url
        timestamp pdf_generated_at
        timestamp created_at
        timestamp updated_at
    }

    contract_parties {
        text id PK
        text contract_id FK
        text party_definition_id FK
        text full_name
        text id_number
        text company_name
        text registration_number
        text email
        text phone
        text address
        integer instance_index "for multiple parties of same role"
    }

    contract_clause_selections {
        text id PK
        text contract_id FK
        text section_id FK
        text clause_id FK
        timestamp selected_at
    }

    contract_field_values {
        text id PK
        text contract_id FK
        text field_key "merge field key"
        text field_value
    }

    %% ─── AUDIT LOG ─────────────────────────────────────────────────
    audit_log {
        text id PK
        text tenant_id FK
        text user_id FK
        text entity_type "contract | template | clause | user"
        text entity_id
        text action "created | updated | deleted | generated | published"
        text metadata "JSON blob"
        timestamp created_at
    }

    %% ─── RELATIONSHIPS ─────────────────────────────────────────────

    tenants ||--o{ users : "has"
    tenants ||--o{ contract_templates : "owns"
    tenants ||--o{ contracts : "scoped_to"
    tenants ||--o{ audit_log : "scoped_to"
    tenants ||--o{ clauses : "owns"

    users ||--o{ sessions : "has"
    users ||--o{ accounts : "has"
    users ||--o{ contracts : "creates"
    users ||--o{ audit_log : "generates"

    contract_templates ||--o{ template_party_definitions : "defines"
    contract_templates ||--o{ template_sections : "has"
    contract_templates ||--o{ contracts : "used_in"

    template_sections ||--o{ clauses : "offers"

    clauses ||--o{ clause_conflicts : "conflict_a"
    clauses ||--o{ clause_conflicts : "conflict_b"
    clauses ||--o{ contract_clause_selections : "selected_in"

    contracts ||--o{ contract_parties : "involves"
    contracts ||--o{ contract_clause_selections : "tracks"
    contracts ||--o{ contract_field_values : "stores"
```

---

## 3. Table Descriptions

### `tenants`

Each row represents a law firm (or company) subscribing to LegalForge. The `slug` drives subdomain routing. `primary_colour` is used for white-labelling the UI and PDF letterhead.

### `users`

Better Auth-managed user records, extended with `role` and `tenant_id`. The `role` field determines access:

- `platform_admin` — no tenant restriction.
- `firm_admin`, `firm_editor` — scoped to their `tenant_id`.
- `end_user` — scoped to their `tenant_id`.

### `contract_templates`

A template defines the structure of a contract. `version` increments on each publish. In-progress contracts lock to the `template_version` at the time they started.

### `template_party_definitions`

Defines the named parties for a template (e.g., "Buyer", "Seller"). `allows_multiple` enables, for example, multiple shareholders in an agreement.

### `template_sections`

Ordered sections within a template (e.g., "1. Purchase Price", "2. Occupation Date"). `sort_order` controls wizard step order.

### `clauses`

The actual clause text for each section. `is_default` marks the clause pre-selected when the wizard loads a step. `legal_text` is the formal wording; `explanation` is the plain-language guide; `examples` are real-world scenario illustrations.

### `clause_conflicts`

A conflict pair between two clauses. `conflict_type`:

- `incompatible` — selecting both is legally invalid; user must choose one.
- `warning` — selecting both is unusual and the user should be cautioned, but it's not blocked.

### `contracts`

An end user's contract in progress. `status` tracks lifecycle. `current_step` stores which section the user is on for resume-on-reload. `pdf_url` is a signed Cloudflare R2 URL once generated.

### `contract_parties`

The actual party data collected from the user during wizard Step 1. `instance_index` allows multiple parties of the same `role_key` (e.g., three shareholders).

### `contract_clause_selections`

Stores which clause was selected for each section of a specific contract. One row per `(contract_id, section_id)`. On change, the old row is replaced.

### `contract_field_values`

Stores additional free-form field values collected during the wizard (amounts, dates, addresses not tied to parties) for merge field substitution.

### `audit_log`

Immutable event log. `metadata` is a JSON blob with diff details or additional context.

---

## 4. Key Indexes

```sql
-- Tenant isolation (on every tenant-scoped table)
CREATE INDEX idx_contracts_tenant ON contracts(tenant_id);
CREATE INDEX idx_templates_tenant ON contract_templates(tenant_id);
CREATE INDEX idx_clauses_tenant ON clauses(tenant_id);

-- Common queries
CREATE INDEX idx_contracts_user ON contracts(user_id);
CREATE INDEX idx_contracts_status ON contracts(tenant_id, status);
CREATE INDEX idx_sections_template ON template_sections(template_id, sort_order);
CREATE INDEX idx_clauses_section ON clauses(section_id, sort_order);
CREATE INDEX idx_conflicts_clause_a ON clause_conflicts(clause_id_a);
CREATE INDEX idx_conflicts_clause_b ON clause_conflicts(clause_id_b);
CREATE INDEX idx_selections_contract ON contract_clause_selections(contract_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
```

---

## 5. Conflict Detection Query

When a user selects `clause_id = X` in the wizard, the system checks:

```sql
SELECT
    cc.*,
    c.title AS conflicting_clause_title,
    c.explanation AS conflicting_clause_explanation
FROM clause_conflicts cc
JOIN clauses c ON (
    (cc.clause_id_a = :selectedClauseId AND c.id = cc.clause_id_b)
    OR
    (cc.clause_id_b = :selectedClauseId AND c.id = cc.clause_id_a)
)
WHERE (cc.clause_id_a = :selectedClauseId OR cc.clause_id_b = :selectedClauseId)
  AND c.id IN (
      -- previously selected clauses for this contract
      SELECT clause_id FROM contract_clause_selections
      WHERE contract_id = :contractId
  );
```

---

## 6. Merge Field Substitution

Merge fields in `clauses.legal_text` follow the `{{scope.fieldName}}` pattern:

| Token                        | Resolved From                                                           |
| ---------------------------- | ----------------------------------------------------------------------- |
| `{{buyer.fullName}}`         | `contract_parties.full_name` where `role_key = 'buyer'`                 |
| `{{seller.idNumber}}`        | `contract_parties.id_number` where `role_key = 'seller'`                |
| `{{contract.purchasePrice}}` | `contract_field_values.field_value` where `field_key = 'purchasePrice'` |
| `{{contract.date}}`          | `contracts.created_at` (formatted)                                      |
| `{{firm.name}}`              | `tenants.name`                                                          |

The merge field substitution engine runs server-side at PDF generation time, replacing all tokens with resolved values or flagging missing values.
