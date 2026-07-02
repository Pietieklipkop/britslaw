# Merge Field Reference — LegalForge

> **Version:** 1.0.0-draft
> **Date:** 2026-06-30

---

## Overview

Merge fields are placeholder tokens embedded in clause `legal_text` by law firm template authors. When a contract is generated, the server-side substitution engine replaces all tokens with the actual values collected from the user during the wizard.

**Syntax:** `{{scope.fieldName}}`

---

## 1. Party Merge Fields

Party fields use the role key defined in `template_party_definitions.role_key` as the scope.

### Standard Party Fields

| Token                          | Description                 | Example Output                      |
| ------------------------------ | --------------------------- | ----------------------------------- |
| `{{buyer.fullName}}`           | Full name of the buyer      | "John Smith"                        |
| `{{buyer.idNumber}}`           | SA ID number                | "8001015800085"                     |
| `{{buyer.companyName}}`        | Company name (if entity)    | "Smith Enterprises (Pty) Ltd"       |
| `{{buyer.registrationNumber}}` | Company registration number | "2010/123456/07"                    |
| `{{buyer.email}}`              | Email address               | "john@example.com"                  |
| `{{buyer.phone}}`              | Phone number                | "+27 82 123 4567"                   |
| `{{buyer.address}}`            | Full physical address       | "12 Oak Street, Stellenbosch, 7600" |

> **Replace `buyer` with any party role key**, e.g., `seller`, `landlord`, `tenant`, `director`, `shareholder`.

### Multiple Party Fields

When `allows_multiple = true` for a party role, use an index:

| Token                         | Description                            |
| ----------------------------- | -------------------------------------- |
| `{{shareholder[0].fullName}}` | First shareholder's name               |
| `{{shareholder[1].fullName}}` | Second shareholder's name              |
| `{{shareholder.count}}`       | Total number of parties with this role |

---

## 2. Contract Fields

General contract-level values.

| Token                       | Description               | Example Output      |
| --------------------------- | ------------------------- | ------------------- |
| `{{contract.date}}`         | Contract creation date    | "30 June 2026"      |
| `{{contract.id}}`           | Contract reference ID     | "LF-2026-00094"     |
| `{{contract.templateName}}` | Name of the template used | "Offer to Purchase" |

---

## 3. Common Contract-Specific Fields

These are collected during the wizard via dedicated input fields (not party fields). Each template defines which of these it uses.

### Property / Offer to Purchase

| Token                           | Description                | Example Output                             |
| ------------------------------- | -------------------------- | ------------------------------------------ |
| `{{property.address}}`          | Property physical address  | "15 Main Road, Paarl, 7646"                |
| `{{property.erfNumber}}`        | Erf/stand number           | "Erf 1234, Paarl"                          |
| `{{property.extent}}`           | Property size              | "842 m²"                                   |
| `{{purchase.price}}`            | Purchase price (formatted) | "R 3,500,000.00"                           |
| `{{purchase.priceWords}}`       | Purchase price in words    | "Three Million Five Hundred Thousand Rand" |
| `{{purchase.deposit}}`          | Deposit amount             | "R 350,000.00"                             |
| `{{purchase.depositDueDate}}`   | Date deposit is due        | "15 July 2026"                             |
| `{{purchase.balance}}`          | Balance payable            | "R 3,150,000.00"                           |
| `{{purchase.occupationDate}}`   | Occupation date            | "1 August 2026"                            |
| `{{purchase.registrationDate}}` | Transfer registration date | "31 August 2026"                           |
| `{{finance.amount}}`            | Loan amount applied for    | "R 3,150,000.00"                           |
| `{{finance.daysToApproval}}`    | Days to obtain finance     | "30"                                       |
| `{{finance.expiryDate}}`        | Finance condition expiry   | "30 July 2026"                             |

### Lease Agreement

| Token                        | Description                   | Example Output              |
| ---------------------------- | ----------------------------- | --------------------------- |
| `{{lease.commencementDate}}` | Lease start date              | "1 July 2026"               |
| `{{lease.terminationDate}}`  | Lease end date                | "30 June 2027"              |
| `{{lease.monthlyRental}}`    | Monthly rental amount         | "R 12,500.00"               |
| `{{lease.deposit}}`          | Rental deposit                | "R 25,000.00"               |
| `{{lease.escalationRate}}`   | Annual escalation %           | "6%"                        |
| `{{lease.noticePeriod}}`     | Notice period for termination | "30 days"                   |
| `{{lease.allowedUse}}`       | Permitted use of property     | "Residential purposes only" |

### Service Agreement

| Token                      | Description                 | Example Output                    |
| -------------------------- | --------------------------- | --------------------------------- |
| `{{service.description}}`  | Description of services     | "Web development and maintenance" |
| `{{service.startDate}}`    | Service commencement date   | "1 July 2026"                     |
| `{{service.endDate}}`      | Service end date (if fixed) | "31 December 2026"                |
| `{{service.fee}}`          | Service fee                 | "R 25,000.00 per month"           |
| `{{service.paymentTerms}}` | Payment terms               | "30 days from invoice"            |
| `{{service.noticePeriod}}` | Cancellation notice         | "30 days written notice"          |

### Shareholders Agreement

| Token                                       | Description                          | Example Output             |
| ------------------------------------------- | ------------------------------------ | -------------------------- |
| `{{company.name}}`                          | Company name                         | "AcmeCo (Pty) Ltd"         |
| `{{company.registrationNumber}}`            | Company reg number                   | "2020/987654/07"           |
| `{{company.registeredAddress}}`             | Registered address                   | "100 Tech Park, Cape Town" |
| `{{shareholder[0].sharesHeld}}`             | Number of shares (first shareholder) | "500"                      |
| `{{shareholder[0].shareholdingPercentage}}` | Percentage (first shareholder)       | "50%"                      |
| `{{shareholders.totalShares}}`              | Total shares in issue                | "1,000"                    |

---

## 4. Firm / Platform Fields

| Token                         | Description             | Example Output                |
| ----------------------------- | ----------------------- | ----------------------------- |
| `{{firm.name}}`               | Law firm name           | "Smith & Partners Attorneys"  |
| `{{firm.registrationNumber}}` | Firm reg number         | "1998/001234/21"              |
| `{{firm.address}}`            | Firm address            | "10 Legal Street, Cape Town"  |
| `{{firm.phone}}`              | Firm phone              | "+27 21 555 0100"             |
| `{{firm.email}}`              | Firm contact email      | "info@smithandpartners.co.za" |
| `{{firm.attorney}}`           | Primary attorney's name | "Adv. J. Smith"               |

---

## 5. Substitution Engine Behaviour

- **Found, value present:** Replace token with the value.
- **Found, value empty:** Replace with `[MISSING: fieldName]` highlighted in red in the PDF. Flag in the review screen.
- **Token not found in map:** Leave as-is and log a warning to the audit trail.
- **Multiple instances of same token:** All instances are replaced.

### Implementation (TypeScript)

```typescript
function substituteFields(
	text: string,
	values: Record<string, string>
): { output: string; missingFields: string[] } {
	const missingFields: string[] = [];
	const output = text.replace(/\{\{([\w.\[\]]+)\}\}/g, (match, key) => {
		if (key in values && values[key]) {
			return values[key];
		}
		missingFields.push(key);
		return `[MISSING: ${key}]`;
	});
	return { output, missingFields };
}
```

---

## 6. Adding New Fields to a Template

1. The firm admin uses the **Legal Text** editor in the Template Builder.
2. Type `{{` to trigger the merge field autocomplete dropdown.
3. Available tokens are sourced from:
   - The party definitions for this template.
   - The pre-defined common contract fields (above).
4. Custom fields not in the list can be typed manually.
5. During the wizard, any token referenced in any clause that isn't a party field will generate a corresponding input field for the user to fill in.
