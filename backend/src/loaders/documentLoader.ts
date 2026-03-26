// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfMod = require("pdf-parse-fork");
import { Document } from "@langchain/core/documents";

/**
 * Main loader - Entry point for your ingestion service
 */
export async function documentLoader(
  file: Buffer,
  filename: string
): Promise<Document[]> {
  console.log(`[documentLoader] Processing file: ${filename}`);
  const fileExtension = filename.split(".").pop()?.toLowerCase();

  try {
    switch (fileExtension) {
      case "pdf":
        // Pass both file and filename
        return await loadPDF(file, filename);

      case "txt":
        // Pass both file and filename
        return await loadTextFile(file, filename);

      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  } catch (error: any) {
    console.error(`[documentLoader] Error in ${filename}:`, error.message);
    throw error;
  }
}

/**
 * PDF Loader - Handles both Class and Function imports
 */
async function loadPDF(fileBuffer: Buffer, filename: string): Promise<Document[]> {
  try {
    let Target = pdfMod;
    if (pdfMod.default) Target = pdfMod.default;
    if (pdfMod.PDFParse) Target = pdfMod.PDFParse;

    let data: any;

    try {
      // Attempt 1: Call as a function
      data = await Target(fileBuffer, {});
    } catch (err: any) {
      // Attempt 2: If it's a class, use 'new'
      if (err.message.includes("cannot be invoked without 'new'")) {
        const instance = new Target(fileBuffer, {});
        data = (typeof instance.parse === 'function') 
          ? await instance.parse(fileBuffer) 
          : await instance;
      } else {
        throw err;
      }
    }

    const text = data?.text || data?.content || "";
    if (!text.trim()) throw new Error("PDF extraction returned no text content.");

    return [
      new Document({
        pageContent: text,
        metadata: {
          source: filename, // Fixed: filename is now in scope
          totalPages: data?.numpages || 0,
        }
      })
    ];
  } catch (error: any) {
    throw new Error(`Failed to process PDF: ${error.message}`);
  }
}

/**
 * TXT Loader
 */
async function loadTextFile(fileBuffer: Buffer, filename: string): Promise<Document[]> {
  const text = fileBuffer.toString("utf-8");
  if (!text.trim()) throw new Error("Text file is empty.");

  return [
    new Document({
      pageContent: text,
      metadata: { 
        source: filename // Fixed: filename is now in scope
      }
    })
  ];
}