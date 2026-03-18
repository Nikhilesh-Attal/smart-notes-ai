// Load pdf-parse and normalize API across CJS / ESM builds
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParseMod = require("pdf-parse");

import { Document } from "@langchain/core/documents";

/**
 * Convert Node Buffer → ArrayBuffer safely
 */
function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength
  ) as ArrayBuffer;
}

/**
 * Dynamically resolve pdf-parse API
 */
async function parsePdfDynamic(fileBuffer: Buffer): Promise<any> {

  // Case 1: pdf-parse exports a function
  if (typeof pdfParseMod === "function") {
    return await pdfParseMod(fileBuffer);
  }

  // Case 2: ESM default export
  if (pdfParseMod && typeof pdfParseMod.default === "function") {
    return await pdfParseMod.default(fileBuffer);
  }

  // Case 3: Some builds expose a parser class
  const Parser =
    pdfParseMod?.PDFParse ||
    pdfParseMod?.default?.PDFParse;

  if (typeof Parser === "function") {
    const parser: any = new Parser();

    if (typeof parser.parse === "function") {
      try {
        return await parser.parse(fileBuffer);
      } catch {
        return await parser.parse(toArrayBuffer(fileBuffer));
      }
    }

    if (typeof parser.parseBuffer === "function") {
      return await parser.parseBuffer(fileBuffer);
    }

    if (typeof Parser.parse === "function") {
      return await Parser.parse(fileBuffer);
    }
  }

  // Case 4: exotic interop builds
  if (
    pdfParseMod?.default?.default &&
    typeof pdfParseMod.default.default === "function"
  ) {
    return await pdfParseMod.default.default(fileBuffer);
  }

  const t = typeof pdfParseMod;
  const keys =
    pdfParseMod && typeof pdfParseMod === "object"
      ? Object.keys(pdfParseMod).join(",")
      : "";

  throw new Error(`Unable to resolve pdf-parse API (typeof=${t}; keys=${keys})`);
}

/**
 * Main loader
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
        return await loadPDF(file);

      case "txt":
        return await loadTextFile(file);

      default:
        throw new Error(
          `Unsupported file type: ${fileExtension}. Supported types: PDF, TXT`
        );
    }

  } catch (error: any) {
    console.error(
      `[documentLoader] Error processing ${filename}:`,
      error.message
    );
    throw error;
  }
}

/**
 * PDF Loader
 */
async function loadPDF(fileBuffer: Buffer): Promise<Document[]> {
  try {

    const data = await parsePdfDynamic(fileBuffer);

    const text =
      data?.text ||
      data?.plainText ||
      data?.content ||
      "";

    if (!text || text.trim().length === 0) {
      throw new Error("PDF appears to be empty or contains no extractable text");
    }

    return [
      new Document({
        pageContent: text,
        metadata: {
          type: "pdf",
          totalPages: data?.numpages || null
        }
      })
    ];

  } catch (error: any) {

    console.error(
      "[documentLoader] PDF processing error:",
      error.message
    );

    throw new Error(`Failed to process PDF: ${error.message}`);
  }
}

/**
 * TXT Loader
 */
async function loadTextFile(fileBuffer: Buffer): Promise<Document[]> {

  const text = fileBuffer.toString("utf-8");

  if (!text || text.trim().length === 0) {
    throw new Error("Text file appears to be empty");
  }

  return [
    new Document({
      pageContent: text,
      metadata: {
        type: "text"
      }
    })
  ];
}