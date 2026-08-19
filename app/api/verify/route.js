import { NextResponse } from 'next/server';
import crypto from 'crypto';
import * as chain from '@/lib/chain';

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

/**
 * POST /api/verify
 * Verifies uploaded file against stored docId hash via chain seam
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const docId = formData.get('docId');
    const file = formData.get('file');

    if (!docId || typeof docId !== 'string' || !docId.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please select or provide a valid registered Document ID.' },
        { status: 400 }
      );
    }

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'Please upload a file to check for verification.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum allowed limit of 20MB.' },
        { status: 400 }
      );
    }

    // Read bytes & compute SHA-256 hash of verification target file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const computedHash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Call Chain Seam for verification lookup
    const verificationResult = await chain.verifyHash(docId.trim(), computedHash);

    if (verificationResult.notFound) {
      return NextResponse.json(
        {
          success: true,
          notFound: true,
          match: false,
          docId,
          computedHash,
          storedHash: null,
          error: `No registered document found matching docId "${docId}". Please check the ID and try again.`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        notFound: false,
        match: verificationResult.match,
        docId,
        storedHash: verificationResult.storedHash,
        computedHash,
        filename: verificationResult.filename || file.name,
        adapterMode: verificationResult.adapterMode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying document:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error during document verification.' },
      { status: 500 }
    );
  }
}
