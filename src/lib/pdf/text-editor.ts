import { loadPyMuPDF } from './pymupdf-loader';

/**
 * PDF Text Editor Service
 * Purani file ko bina chhede, naya feature add karne ke liye
 */
export async function editPdfText(file: File, searchText: string, replaceText: string): Promise<Blob> {
  // 1. Purane loader se PyMuPDF instance mangwao
  const pymu = await loadPyMuPDF();
  const pyodide = pymu.pyodide;

  const arrayBuffer = await file.arrayBuffer();
  const pdfData = new Uint8Array(arrayBuffer);

  // Unique file names taaki koi error na aaye
  const uid = `${Date.now()}`;
  const inputPath = `/edit_in_${uid}.pdf`;

  pyodide.FS.writeFile(inputPath, pdfData);

  // 2. Asli Editing Logic (Python code)
  const result = await pyodide.runPythonAsync(`
import pymupdf
import base64

doc = pymupdf.open("${inputPath}")
search = "${searchText}"
replace = "${replaceText}"

for page in doc:
    # Text dhundho
    instances = page.search_for(search)
    for inst in instances:
        # Purana text white color se mitao
        page.add_redact_annot(inst, fill=(1, 1, 1))
        page.apply_redactions()
        # Naya text likho
        page.insert_text(inst.tl, replace, fontsize=11, fontname="helv", color=(0,0,0))

pdf_bytes = doc.tobytes(garbage=4, deflate=True)
doc.close()
base64.b64encode(pdf_bytes).decode('ascii')
`);

  // 3. Safai (Cleanup)
  try { pyodide.FS.unlink(inputPath); } catch (e) {}

  // 4. Base64 ko wapas PDF Blob mein badlo
  const binary = atob(result);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: 'application/pdf' });
}
