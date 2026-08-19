import { NextResponse } from 'next/server';
import { INITIAL_DOCUMENTS } from '@/lib/seed';

/**
 * GET /api/samples?docId=...&tampered=true|false
 * Allows downloading original authentic sample document files or slightly altered tampered versions
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const docId = searchParams.get('docId') || INITIAL_DOCUMENTS[0].docId;
  const isTampered = searchParams.get('tampered') === 'true';

  const doc = INITIAL_DOCUMENTS.find(d => d.docId === docId) || INITIAL_DOCUMENTS[0];

  let content = doc.sampleContent;
  let filename = doc.filename;

  if (isTampered) {
    // Alter 1 line of the legal document text to create a cryptographic hash mismatch
    content = content.replace(
      /Rent: \$12,500\.00 USD/g,
      'Rent: $1,250.00 USD [UNAUTHORIZED MODIFICATION]'
    ).replace(
      /Clear Title/g,
      'REVOKED Title [TAMPERED ENTRY]'
    ).replace(
      /5 Years/g,
      '1 Year [ALTERED TERM]'
    );

    filename = `TAMPERED_${filename}`;
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
