import { EvidenceItem } from "./types";

// This string contains the synthesized facts from the provided PDF/OCR data
// It serves as the knowledge base for the AI model.
export const DEFAULT_CASE_CONTEXT = `
CASE BACKGROUND:
This is a civil contract dispute case (Case No. 2025 Yue 0307 Min Chu 63735) between:
Plaintiff: Shenzhen Tilswall Innovation Technology Co., Ltd. (Buyer/Cross-border Seller)
Defendant: Dongguan Ruijiang Intelligent Technology Co., Ltd. (Manufacturer/Supplier)

FACTS:
1. On March 23, 2024, Plaintiff ordered 2000 units of UK-spec Hot Glue Guns (Model RJ805) from Defendant (PO2403210004). Total value: 42,871 RMB.
2. Defendant delivered goods on April 16, 2024.
3. Plaintiff shipped goods to Amazon UK via logistics provider.
4. In July 2024, UK Trading Standards (Thurrock Council) seized the goods (Container CMAU6778107).
5. Testing by Cass Industries Ltd (Report CI10773c_LVD) found:
   - Mains plug fuse did not conform to BS 1362 (weight 1.5g vs expected >2.1g, dimensions incorrect, no sand filler).
   - Labeling issues (warnings not at start of manual).
   - Failed Safety Regulations 2016.
6. Goods were refused entry and ordered destroyed. Destruction Certificate WE00294 issued on 26/11/2024.
7. Plaintiff claims total loss: 208,387.61 RMB (Goods value, logistics, destruction costs, profit loss).

PLAINTIFF'S ARGUMENT:
- Defendant delivered defective goods (non-compliant fuse) causing seizure and destruction.
- Fundamental breach of contract.
- Demands compensation for all direct and indirect losses.

DEFENDANT'S DEFENSE (from Civil Reply):
- The UK report was a "sampling check" of 1 unit; implies not all were defective.
- The defect (fuse) is a minor accessory issue, not a whole product failure.
- Plaintiff failed to mitigate losses (did not arrange return/repair, just destruction).
- Disputes the calculation of logistics and profit losses as unproven or excessive.
- Defendant claims the fuse supplier provided certificates, suggesting they were misled or it was a batch issue.

EVIDENCE LIST:
1. Purchase Order PO2403210004.
2. Commercial Invoices & Logistics Invoices (Amazon Global Logistics).
3. UK Trading Standards Emails (Olga Saninoiu) confirming seizure and destruction order.
4. Cass Industries Test Report (Failed).
5. Certificate of Destruction.
6. Chat logs (WeChat) showing communication about the issue.
7. Defendant's "Civil Reply" document.
`;

export const DEFAULT_EVIDENCE: EvidenceItem[] = [
  { id: '1', name: 'Civil Complaint.pdf', type: 'Legal', summary: 'Plaintiff claims 208k RMB damages due to defective glue guns seized in UK.' },
  { id: '2', name: 'PO2403210004.pdf', type: 'Contract', summary: 'Purchase order for 2000 units of RJ805 Glue Gun.' },
  { id: '3', name: 'Test Report CI10773c.pdf', type: 'Technical', summary: 'Cass Industries report: FAIL. Fuse link non-compliant with BS1362.' },
  { id: '4', name: 'TS Emails.pdf', type: 'Communication', summary: 'Thurrock Council notifying goods must be destroyed due to safety issues.' },
  { id: '5', name: 'Destruction Cert.pdf', type: 'Legal', summary: 'Certificate WE00294 confirming destruction of 4 pallets.' },
  { id: '6', name: 'Civil Defense.pdf', type: 'Legal', summary: 'Defendant argues failure to mitigate losses and disputes profit loss calculation.' },
];
