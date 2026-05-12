import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const extractResumeText = async (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  // Handle PDF files
  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    const result = await parser.getText();
    await parser.destroy();

    return result.text;
  }

  // Handle DOCX files
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  throw new Error("Unsupported file type. Only PDF and DOCX are allowed.");
};

export default extractResumeText;
