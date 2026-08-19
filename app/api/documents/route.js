import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as chain from '@/lib/chain';

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

/**
 * GET /api/documents
 * List all registered documents sorted newest first
 */
export async function GET() {
  try {
    const documents = await chain.listAllDocuments();
    return NextResponse.json({ success: true, documents }, { status: 200 });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to list documents' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/documents
 * Register a new document:
 * 1. Read uploaded file buffer
 * 2. Compute SHA-256 hash
 * 3. Generate docId (UUID)
 * 4. Write to chain seam: chain.registerHash(docId, hash)
 * 5. Return docId, filename, hash, registeredAt
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'No valid file selected for registration.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum allowed demo limit of 20MB.' },
        { status: 400 }
      );
    }

    // Read file bytes into memory buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compute SHA-256 hash
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Generate unique docId UUID
    const docId = `doc-${uuidv4()}`;

    // Register via chain seam
    const result = await chain.registerHash(docId, hash, {
      filename: file.name || 'document.pdf',
      fileSize: file.size,
    });

    return NextResponse.json(
      {
        success: true,
        docId: result.docId,
        filename: file.name || 'document.pdf',
        hash: result.hash,
        registeredAt: result.registeredAt,
        fileSize: file.size,
        adapterMode: result.adapterMode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering document:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error during document registration.' },
      { status: 500 }
    );
  }
}
