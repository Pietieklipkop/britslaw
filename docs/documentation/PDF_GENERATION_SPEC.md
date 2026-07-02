# PDF Generation — Technical Specification

> **Version:** 1.0.0-draft
> **Date:** 2026-06-30

---

## 1. Overview

When a user completes the contract wizard and clicks "Generate My Contract", the server produces a professionally formatted PDF. The PDF is stored in Cloudflare R2 and a signed download URL is returned to the client.

---

## 2. Constraints

- **Runtime:** Cloudflare Workers (V8 isolate). No Node.js APIs available.
- **No Puppeteer/Chromium:** Cannot run headless browsers in Workers.
- **No native file system:** Must work entirely in memory.
- **Solution:** Use a pure-JavaScript PDF library compatible with the V8 Workers runtime.

---

## 3. PDF Library Options

| Library                   | Workers Compatible | Output Quality | Ease of Use |
| ------------------------- | ------------------ | -------------- | ----------- |
| **`jsPDF`**               | ✅ Yes             | Medium         | Easy        |
| **`pdf-lib`**             | ✅ Yes             | High           | Medium      |
| **`@react-pdf/renderer`** | ❌ No (Node only)  | High           | Easy        |
| **Puppeteer**             | ❌ No              | Very High      | Medium      |

**Recommendation:** `pdf-lib` for V1. It produces high-quality PDFs, runs in V8 environments, and supports embedding fonts, images (for law firm logo), and fine-grained layout control.

**Alternative (V2):** Use a Cloudflare Worker as a proxy to a Puppeteer-based microservice hosted on Cloud Run. This enables HTML-to-PDF rendering with full CSS support — producing near-print-quality output.

---

## 4. PDF Document Structure

```
Page 1: Cover Page
  ┌──────────────────────────────────┐
  │  [Firm Logo]                     │
  │                                  │
  │  OFFER TO PURCHASE               │
  │  (Agreement of Sale)             │
  │                                  │
  │  Prepared for:                   │
  │  John Smith (Buyer)              │
  │  Jane Doe (Seller)               │
  │                                  │
  │  Date: 30 June 2026              │
  │  Reference: LF-2026-00094        │
  │                                  │
  │  Smith & Partners Attorneys      │
  │  Tel: +27 21 555 0100            │
  │  info@smithandpartners.co.za     │
  └──────────────────────────────────┘

Pages 2+: Contract Body
  ┌──────────────────────────────────┐
  │ [Header: Firm name | Contract ref]│
  │                                  │
  │  1. PROPERTY DESCRIPTION         │
  │  ─────────────────────────────   │
  │  The property situated at 15     │
  │  Main Road, Paarl, Erf 1234,     │
  │  measuring 842 m²...             │
  │                                  │
  │  2. PURCHASE PRICE               │
  │  ─────────────────────────────   │
  │  The purchase price is           │
  │  R 3,500,000 (Three Million...   │
  │                                  │
  │ [Footer: Page N of N | LegalForge│
  └──────────────────────────────────┘

Last Page: Signature Block
  ┌──────────────────────────────────┐
  │  SIGNATURES                      │
  │                                  │
  │  BUYER:                          │
  │  Name: ______________________    │
  │  Signature: _________________    │
  │  Date: ______________________    │
  │  Witness: ___________________    │
  │                                  │
  │  SELLER:                         │
  │  [same fields]                   │
  └──────────────────────────────────┘
```

---

## 5. Generation Service

```typescript
// src/lib/server/pdf/generator.ts

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Contract, Tenant } from '../db/schema';

export interface GenerationInput {
	contract: Contract;
	tenant: Tenant;
	parties: ContractParty[];
	sections: Array<{
		title: string;
		selectedClause: { legalText: string };
	}>;
	fieldValues: Record<string, string>;
}

export async function generateContractPDF(input: GenerationInput): Promise<Uint8Array> {
	const pdf = await PDFDocument.create();
	const timesRoman = await pdf.embedFont(StandardFonts.TimesRoman);
	const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
	const helveticaBold = await pdf.embedFont(StandardFonts.HelveticaBold);

	// Embed firm logo if available
	let firmLogo: PDFImage | null = null;
	if (input.tenant.logoUrl) {
		const logoBytes = await fetchAsBytes(input.tenant.logoUrl);
		firmLogo = await pdf.embedPng(logoBytes); // or embedJpg
	}

	// Cover page
	addCoverPage(pdf, input, helveticaBold, helvetica, firmLogo);

	// Body pages (one or more)
	addBodyPages(pdf, input, timesRoman, helveticaBold, helvetica);

	// Signature page
	addSignaturePage(pdf, input.parties, helveticaBold, helvetica);

	return await pdf.save();
}

function substituteFields(text: string, values: Record<string, string>): string {
	return text.replace(/\{\{([\w.\[\]]+)\}\}/g, (_, key) => values[key] ?? `[${key}]`);
}
```

---

## 6. Storage & Retrieval

### Upload to R2

```typescript
// After PDF bytes are generated:
const key = `${tenantId}/contracts/${contractId}/contract.pdf`;

await env.R2_BUCKET.put(key, pdfBytes, {
	httpMetadata: { contentType: 'application/pdf' }
});

// Update contract record with PDF reference key
await db
	.update(contracts)
	.set({ pdfUrl: key, pdfGeneratedAt: new Date() })
	.where(eq(contracts.id, contractId));
```

### Signed URL for Download

```typescript
// /api/contracts/:id/download
export async function GET({ params, locals, platform }) {
	const contract = await db.query.contracts.findFirst({
		where: and(
			eq(contracts.id, params.id),
			eq(contracts.userId, locals.user!.id) // ownership check
		)
	});

	if (!contract?.pdfUrl) throw error(404, 'PDF not yet generated');

	// Generate signed URL valid for 1 hour
	const signedUrl = await platform.env.R2_BUCKET.createSignedUrl(contract.pdfUrl, {
		expiresIn: 3600
	});

	return json({ url: signedUrl });
}
```

---

## 7. Generation Job API Endpoint

```
POST /api/contracts/:contractId/generate
Auth: End User (must own contract)
```

**Steps:**

1. Validate contract belongs to user and is in `review` status.
2. Load all contract data (parties, clause selections, field values).
3. Run merge field substitution on all selected clause legal texts.
4. Check for missing required fields — return 400 if any.
5. Call `generateContractPDF()`.
6. Upload PDF to R2 at `/{tenantId}/contracts/{contractId}/contract.pdf`.
7. Update `contracts.status = 'generated'` and `contracts.pdf_url`.
8. Send confirmation email via Resend.
9. Return `{ success: true, downloadUrl: '...' }`.

**Estimated duration:** 3–8 seconds. Consider returning `202 Accepted` and polling for completion, or use SvelteKit streaming.

---

## 8. Font Embedding

For proper legal document typography:

- **Body text:** Times Roman (embedded via pdf-lib's StandardFonts — no separate file needed)
- **Headings / Labels:** Helvetica Bold (StandardFonts)
- **Clause numbers:** Helvetica

For V2 (custom fonts): Embed Inter TTF and Georgia TTF as base64 in the Worker bundle. File size impact: ~200KB each.

---

## 9. Accessibility of Generated PDFs

V1 goal: Visually accessible (high contrast, readable fonts, clear structure).
V2 goal: Tagged PDF for screen reader support.

---

## 10. V2: Puppeteer-Based HTML-to-PDF

For production-quality PDFs in V2:

1. Build a separate microservice using Puppeteer on Cloud Run.
2. Pass the contract data as JSON.
3. Microservice renders an HTML template (with full CSS, custom fonts, logos) to PDF via Chromium.
4. Returns PDF bytes.
5. Worker uploads to R2.

This unlocks: custom fonts, complex layouts, column spanning, headers/footers via CSS `@page`, background images, and near-print-quality output.
