// eslint-disable-next-line @typescript-eslint/no-var-requires

//this file have funtion to parse the uploaded data

const pdfMod = require("pdf-parse-fork");
import { Document } from "@langchain/core/documents";
import mammoth from "mammoth";
import OfficeParser from "officeparser";
import Tesseract from "tesseract.js";

/* Main loader - Entry point for your ingestion service */
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

      case "docx":
        return await loadDocx(file, filename);

      case "pptx":
        return await loadPptx(file, filename);

      case "png":
      case "jpg":
      case "jpeg":
        return await loadImage(file, filename);

      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  } catch (error: any) {
    console.error(`[documentLoader] Error in ${filename}:`, error.message);
    throw error;
  }
}

/* PDF Loader - Handles both Class and Function imports */
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

/* TXT Loader */
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

/* DOCX Loader */
async function loadDocx(fileBuffer: Buffer, filename: string): Promise<Document[]>{
  try{
    const result = await mammoth.extractRawText({buffer: fileBuffer});
    const text = result.value;

    if(!text.trim()) throw new Error("DOCX extraction return no text content.");

    return[
      new Document({
        pageContent: text,
        metadata: {
          source: filename,
        }
      })
    ];
  }catch(error: any){
    console.log(`[documentLoader] Error loading DOCX: ${error.message}`);
    throw error;
  }
}

/* Helper to recursively extract text from the PPTX AST Object */
function extractTextFromAST(node: any): string {
    if (!node) return "";
    if (typeof node === "string") return node;

    let extracted = "";
    if (Array.isArray(node)) {
        node.forEach(item => { extracted += extractTextFromAST(item) + " "; });
    } else if (typeof node === "object") {
        // If the node has a direct 'text' property, grab it and stop drilling to avoid duplicates
        if (node.text && typeof node.text === "string") {
            extracted += node.text + "\n";
        } else {
            // Otherwise, keep searching its inner properties
            Object.values(node).forEach(val => {
                extracted += extractTextFromAST(val) + " ";
            });
        }
    }
    return extracted.trim();
}

/* PPTX Loader */
async function loadPptx(fileBuffer: Buffer, filename: string): Promise<Document[]> {
  try {
    const result = await OfficeParser.parseOffice(fileBuffer, { outputErrorToConsole: true });
    
    // Extract clean text from the AST object or string
    let text = "";
    if (typeof result === "string") {
        // If it successfully returned a plain string
        text = result;
    } else {
        // If it returned the JSON AST object, parse it cleanly
        text = extractTextFromAST(result);
    }

    console.log("\n====== PPTX CLEAN TEXT X-RAY ======");
    console.log(text.substring(0, 500) + "... (truncated)");
    console.log("===================================\n");

    if (!text || !text.trim()) throw new Error("PPTX extraction returned no text content.");

    return [
      new Document({
        pageContent: text,
        metadata: { source: filename }
      })
    ];
  } catch (error: any) {
    throw new Error(`Failed to process PPTX: ${error.message}`);
  }
}

/**Image OCR Loader */
async function loadImage(fileBuffer: Buffer, filename: string): Promise<Document[]>{
  try{
    console.log(`[documentLoader] Running local OCR on ${filename}... This might take a few seconds.`)

    const result = await Tesseract.recognize(fileBuffer, 'eng');
    const text = result.data.text;

    if(!text || !text.trim()) throw new Error("OCR found no readable text in the image.");

    return[
      new Document({
        pageContent: text, 
        metadata: {
          source: filename
        }
      })
    ];
  }catch(error : any){
    throw new Error(`Failed to process image: ${error.message}`);
  }
}