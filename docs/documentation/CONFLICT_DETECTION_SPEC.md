# Conflict Detection Engine — Technical Specification

> **Version:** 1.0.0-draft
> **Date:** 2026-06-30

---

## 1. Overview

The Conflict Detection Engine evaluates clause selections in real time during the contract wizard. When a user selects a clause, the engine checks it against all previously selected clauses in the same contract for any declared conflict rules.

---

## 2. Conflict Types

| Type             | Identifier     | Behaviour                                                                                                         |
| ---------------- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Incompatible** | `incompatible` | Hard block. User must resolve before proceeding. The new clause is NOT applied until the user explicitly chooses. |
| **Warning**      | `warning`      | Soft caution. User is informed but can proceed with both clauses if they choose.                                  |

---

## 3. Data Model

```sql
-- clause_conflicts table
CREATE TABLE clause_conflicts (
  id TEXT PRIMARY KEY,
  clause_id_a TEXT NOT NULL REFERENCES clauses(id),
  clause_id_b TEXT NOT NULL REFERENCES clauses(id),
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('incompatible', 'warning')),
  explanation TEXT NOT NULL,  -- shown to the end user in plain English
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Constraint:** `(clause_id_a, clause_id_b)` is unique and the relationship is **bidirectional** — a conflict between A and B covers both "A selected after B" and "B selected after A". Application code normalises to always store `clause_id_a < clause_id_b` (lexicographically) to prevent duplicate entries.

---

## 4. Detection Algorithm

### Step 1: On clause selection (client triggers API call)

```
POST /api/contracts/:contractId/clauses
Body: { sectionId: "sec_xxx", clauseId: "cls_yyy" }
```

### Step 2: Server-side conflict check

```typescript
async function checkConflicts(
	db: DB,
	contractId: string,
	newClauseId: string
): Promise<ConflictResult[]> {
	// 1. Get all currently selected clause IDs for this contract
	const selectedClauses = await db
		.select({ clauseId: contractClauseSelections.clauseId })
		.from(contractClauseSelections)
		.where(eq(contractClauseSelections.contractId, contractId));

	const selectedIds = selectedClauses.map((s) => s.clauseId);

	if (selectedIds.length === 0) return [];

	// 2. Query for conflicts between newClauseId and any selectedId
	const conflicts = await db
		.select({
			conflictId: clauseConflicts.id,
			conflictType: clauseConflicts.conflictType,
			explanation: clauseConflicts.explanation,
			clauseIdA: clauseConflicts.clauseIdA,
			clauseIdB: clauseConflicts.clauseIdB
		})
		.from(clauseConflicts)
		.where(
			and(
				or(eq(clauseConflicts.clauseIdA, newClauseId), eq(clauseConflicts.clauseIdB, newClauseId)),
				or(
					inArray(clauseConflicts.clauseIdA, selectedIds),
					inArray(clauseConflicts.clauseIdB, selectedIds)
				)
			)
		);

	return conflicts.map((c) => ({
		conflictType: c.conflictType,
		explanation: c.explanation,
		conflictingClauseId: c.clauseIdA === newClauseId ? c.clauseIdB : c.clauseIdA
	}));
}
```

### Step 3: API Response

```typescript
// If no conflicts:
return { status: 'ok', conflicts: [] };

// If warning conflicts only:
return { status: 'warning', conflicts: [...] };
// → Frontend shows warning modal, user can proceed

// If any incompatible conflicts:
return { status: 'conflict', conflicts: [...] };
// → Frontend shows conflict modal, user MUST resolve
```

### Step 4: Resolution

**User chooses "Keep new clause (remove old)":**

```
DELETE from contract_clause_selections WHERE contract_id = :id AND clause_id = :oldClauseId
INSERT into contract_clause_selections (contract_id, section_id, clause_id) VALUES (...)
```

**User chooses "Keep old clause":**

```
No DB change — selection is discarded.
```

---

## 5. Conflict Graph Storage Convention

To avoid duplicate conflict rules (A→B and B→A stored separately), the system enforces:

```
if (clauseIdA > clauseIdB) swap(clauseIdA, clauseIdB)
```

This ensures `clause_id_a` is always lexicographically smaller than `clause_id_b`. The uniqueness constraint `UNIQUE(clause_id_a, clause_id_b)` then prevents duplicates.

---

## 6. Edge Cases

| Scenario                                                         | Handling                                                                |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| User selects the same clause again                               | No-op — same clause already selected, skip conflict check               |
| User changes a clause after conflict resolution                  | Re-run conflict check with newly selected clause                        |
| Conflict rule deleted after contract started                     | No conflict triggered (stale rules don't affect existing contracts)     |
| Template updated/re-published mid-wizard                         | Contract is locked to its `template_version` — clause IDs remain stable |
| Circular conflicts (A conflicts B, B conflicts C, A conflicts C) | Each pair is evaluated independently — no circular evaluation needed    |

---

## 7. Frontend Integration

```typescript
// On clause card click (in wizard)
async function handleClauseSelect(sectionId: string, clauseId: string) {
	const response = await fetch(`/api/contracts/${contractId}/clauses`, {
		method: 'POST',
		body: JSON.stringify({ sectionId, clauseId })
	});
	const result = await response.json();

	if (result.status === 'ok') {
		// Update UI — mark clause as selected
		updateSelection(sectionId, clauseId);
	} else if (result.status === 'warning') {
		// Show non-blocking warning toast/callout
		showConflictWarning(result.conflicts, { blocking: false, pendingClauseId: clauseId });
	} else if (result.status === 'conflict') {
		// Show blocking conflict modal
		showConflictModal(result.conflicts, { pendingClauseId: clauseId, sectionId });
	}
}
```

---

## 8. Conflict Detection Performance

- Typical contract: ≤ 15 sections, ≤ 15 selected clauses at any point.
- Conflict table: sparse, typically O(n²) rules where n = clauses per template (usually < 50 clauses total).
- All conflict checks are a single indexed SQL query — expected sub-millisecond on D1.
- No caching needed for V1. Revisit if templates grow to 200+ clauses.
