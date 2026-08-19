import crypto from 'crypto';

// Pre-computed content & hashes for default sample documents
export const SAMPLE_TEXT_1 = `COMMERCIAL LEASE AGREEMENT
Tenant: Apex Legal Corp
Landlord: CyberTower Holdings LLC
Property: Suite 402, 100 Financial Center Blvd, San Francisco CA
Term: 36 Months commencing Oct 1, 2026
Monthly Rent: $12,500.00 USD
Security Deposit: $25,000.00 USD
Governing Law: State of California
Signed & Executed on August 15, 2026.`;

export const SAMPLE_TEXT_2 = `GOVERNMENT LAND TITLE DEED
Registration ID: DEED-8829-CA-2026
Grantor: California Department of Public Lands
Grantee: Metro Infrastructure Trust
Parcel Description: Lot 4, Block B, Bayview Industrial District
Assessor Parcel Number (APN): 492-108-004-9
Status: Clear Title - Verified Immutable Record
Date of Registration: July 12, 2026.`;

export const SAMPLE_TEXT_3 = `MUTUAL NON-DISCLOSURE AGREEMENT (NDA)
Parties: Quantum Dynamics Inc. & eVault Systems Ltd.
Purpose: Evaluation of Blockchain Cryptographic Seam Specifications
Confidentiality Period: 5 Years from Effective Date
Standard of Care: Strict Professional Secrecy
Effective Date: January 10, 2026.`;

function calculateSha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export const INITIAL_DOCUMENTS = [
  {
    docId: 'doc-8f4b2a9e-10a4-4e2a-8b1c-99f8d7e6c5a4',
    filename: 'Commercial_Lease_Agreement_2026.pdf',
    hash: calculateSha256(SAMPLE_TEXT_1),
    registeredAt: new Date('2026-08-15T14:30:00Z'),
    fileSize: Buffer.byteLength(SAMPLE_TEXT_1),
    sampleContent: SAMPLE_TEXT_1,
  },
  {
    docId: 'doc-3c7d9e1f-4b5a-6c7d-8e9f-0a1b2c3d4e5f',
    filename: 'Land_Title_Deed_Ref_8829.pdf',
    hash: calculateSha256(SAMPLE_TEXT_2),
    registeredAt: new Date('2026-07-12T09:15:00Z'),
    fileSize: Buffer.byteLength(SAMPLE_TEXT_2),
    sampleContent: SAMPLE_TEXT_2,
  },
  {
    docId: 'doc-9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d',
    filename: 'Non_Disclosure_Agreement_v2.docx',
    hash: calculateSha256(SAMPLE_TEXT_3),
    registeredAt: new Date('2026-01-10T11:00:00Z'),
    fileSize: Buffer.byteLength(SAMPLE_TEXT_3),
    sampleContent: SAMPLE_TEXT_3,
  },
];
