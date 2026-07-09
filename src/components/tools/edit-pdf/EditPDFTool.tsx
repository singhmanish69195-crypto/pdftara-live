'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FileUploader } from '../FileUploader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
// Naya function import kiya hai text edit karne ke liye
import { editPdfText } from '@/lib/pdf/text-editor';

export interface EditPDFToolProps {
  className?: string;
}

export function EditPDFTool({ className = '' }: EditPDFToolProps) {
  const t = useTranslations('common');
  const tTools = useTranslations('tools.editPdf');
  
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // Advanced Edit States
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleFilesSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setError(null);
      setPdfUrl(URL.createObjectURL(selectedFile));
    }
  }, []);

  // --- Advanced Text Replace Function (Sejda Style) ---
  const handleAdvancedReplace = async () => {
    if (!file || !searchText) return;
    
    try {
      setIsProcessing(true);
      setError(null);

      // WASM Engine ko call karna
      const updatedPdfBlob = await editPdfText(file, searchText, replaceText);
      
      // Naya file object banana taaki editor update ho jaye
      const updatedFile = new File([updatedPdfBlob], file.name, { type: 'application/pdf' });
      
      // Purana URL saaf karo aur naya set karo
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      
      const newUrl = URL.createObjectURL(updatedPdfBlob);
      setFile(updatedFile);
      setPdfUrl(newUrl);
      setIsEditorReady(false); // Reload the iframe
      
      console.log(`[PDFTara] Replaced "${searchText}" with "${replaceText}"`);
    } catch (err) {
      console.error(err);
      setError("Text replacement failed. Make sure WASM assets are loaded.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleIframeLoad = useCallback(() => {
    setTimeout(() => {
      setIsEditorReady(true);
      
      try {
        const iframe = iframeRef.current;
        if (iframe?.contentDocument) {
          const doc = iframe.contentDocument;

          const downloadBtn = doc.getElementById('download');
          const secondaryDownloadBtn = doc.getElementById('secondaryDownload');
          if (downloadBtn) downloadBtn.style.display = 'none';
          if (secondaryDownloadBtn) secondaryDownloadBtn.style.display = 'none';
          
          const customToolbar = doc.querySelector('.CustomToolbar');
          if (customToolbar) {
            const buttons = customToolbar.querySelectorAll('li, button');
            buttons.forEach((btn: Element) => {
              const text = btn.textContent?.trim();
              if (text === '保存' || text === 'Save') {
                (btn as HTMLElement).style.display = 'none';
              }
            });
          }

          const patchScript = doc.createElement('script');
          patchScript.textContent = `
            (function() {
              console.log('[PDFTara Patch] Initializing annotation patches...');

              let undoStack = [];
              let redoStack = [];
              let lastStateStr = '';
              let isDoingUndoRedo = false;

              const toolNameTranslations = {
                'cloud': '云线', 'rectangle': '矩形', 'circle': '圆形',
                'arrow': '箭头', 'freehand': '自由绘制', 'freeText': '文字',
                'freeHighlight': '自由高亮', 'note': '注解', 'signature': '签名', 'stamp': '盖章'
              };

              const initInterval = setInterval(() => {
                const ext = window.pdfjsAnnotationExtensionInstance;
                if (ext) {
                  clearInterval(initInterval);
                  setupCloudFix();
                  setupColorPickerAndStroke();
                  setupUndoRedoAndAuthorPatch();
                }
              }, 200);

              function setupCloudFix() {
                document.addEventListener('dblclick', function(e) {
                  const ext = window.pdfjsAnnotationExtensionInstance;
                  if (ext?.activeAnnotation?.name === 'cloud') {
                    const konvaContent = document.querySelector('.konvajs-content');
                    if (konvaContent) {
                      const dblEvent = new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window, clientX: e.clientX, clientY: e.clientY });
                      konvaContent.dispatchEvent(dblEvent);
                    }
                  }
                }, true);
              }

              function setupColorPickerAndStroke() {
                const hlColorPicker = document.getElementById('editorHighlightColorPicker');
                if (hlColorPicker && !hlColorPicker.querySelector('.pdftara-custom-hl-picker')) {
                  const picker = document.createElement('input');
                  picker.type = 'color';
                  picker.className = 'pdftara-custom-hl-picker';
                  picker.style.cssText = 'width:24px; height:24px; border-radius:50%; cursor:pointer; margin-left:8px;';
                  picker.oninput = (e) => {
                    const ext = window.pdfjsAnnotationExtensionInstance;
                    if (ext?.selectedAnnotation) ext.updateAnnotationStyle(ext.selectedAnnotation, { color: e.target.value });
                  };
                  hlColorPicker.appendChild(picker);
                }
              }

              function setupUndoRedoAndAuthorPatch() {
                setInterval(() => {
                  const ext = window.pdfjsAnnotationExtensionInstance;
                  if (!ext) return;
                  const store = ext.getAnnotationStore();
                  if (store?.annotations) {
                    store.annotations.forEach(ann => {
                      if (ann.author === '不具名用户') ann.author = (toolNameTranslations[ann.name] || '标注') + ' (PDFTara User)';
                    });
                  }
                  const currentState = JSON.stringify(store);
                  if (currentState !== lastStateStr && !isDoingUndoRedo) {
                    undoStack.push(currentState); redoStack = [];
                    updateUndoRedoButtonsState();
                    lastStateStr = currentState;
                  }
                }, 500);
                injectUndoRedoButtons();
              }

              function loadState(stateStr) {
                const ext = window.pdfjsAnnotationExtensionInstance;
                if (!ext) return;
                isDoingUndoRedo = true;
                try {
                  const stateObj = JSON.parse(stateStr);
                  ext.resetPdfjsAnnotationStorage?.();
                  ext.initAnnotations?.(stateObj);
                  ext.reDrawAnnotation?.();
                } finally { setTimeout(() => { isDoingUndoRedo = false; }, 100); }
              }

              function injectUndoRedoButtons() {
                const toolbar = document.querySelector('.CustomToolbar');
                if (toolbar && !toolbar.querySelector('.pdftara-undo-btn')) {
                  const container = document.createElement('div');
                  container.style.display = 'inline-flex';
                  container.innerHTML = \`
                    <button class="pdftara-undo-btn toolbarButton" style="margin-right:5px; opacity:0.5">↩ Undo</button>
                    <button class="pdftara-redo-btn toolbarButton" style="margin-right:15px; opacity:0.5">↪ Redo</button>
                  \`;
                  toolbar.prepend(container);
                  container.querySelector('.pdftara-undo-btn').onclick = () => { if(undoStack.length > 1) { redoStack.push(undoStack.pop()); loadState(undoStack[undoStack.length-1]); } };
                  container.querySelector('.pdftara-redo-btn').onclick = () => { if(redoStack.length > 0) { const s = redoStack.pop(); undoStack.push(s); loadState(s); } };
                }
              }

              function updateUndoRedoButtonsState() {
                const u = document.querySelector('.pdftara-undo-btn');
                const r = document.querySelector('.pdftara-redo-btn');
                if(u) u.style.opacity = undoStack.length > 1 ? '1' : '0.5';
                if(r) r.style.opacity = redoStack.length > 0 ? '1' : '0.5';
              }
            })();
          `;
          doc.body.appendChild(patchScript);
        }
      } catch (e) { console.warn(e); }
    }, 1000);
  }, [pdfUrl]);

  const handleClear = useCallback(() => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(null); setPdfUrl(null); setError(null); setIsEditorReady(false);
  }, [pdfUrl]);

  return (
    <div className={`space-y-6 ${className}`.trim()}>
      {!file && (
        <FileUploader
          accept={['application/pdf', '.pdf']}
          multiple={false}
          onFilesSelected={handleFilesSelected}
          onError={handleUploadError}
          label={tTools('uploadLabel')}
          description={tTools('uploadDescription')}
        />
      )}

      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {file && pdfUrl && (
        <div className="space-y-4">
          <Card variant="outlined" className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1048576).toFixed(2)} MB</p>
                </div>
              </div>

              {/* Advanced Editor Controls (Sejda Style) */}
              <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-lg border">
                <input 
                  type="text" 
                  placeholder="Find text (e.g. libri)" 
                  className="px-2 py-1 text-xs border rounded w-32"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <span className="text-gray-400">➜</span>
                <input 
                  type="text" 
                  placeholder="Replace with (e.g. man)" 
                  className="px-2 py-1 text-xs border rounded w-32"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                />
                <Button 
                  size="sm" 
                  variant="primary" 
                  disabled={isProcessing || !searchText}
                  onClick={handleAdvancedReplace}
                >
                  {isProcessing ? 'Processing...' : 'Replace All'}
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>
            </div>
          </Card>

          <div className="relative border border-gray-200 rounded-md overflow-hidden bg-gray-100 shadow-inner">
            <iframe
              ref={iframeRef}
              key={pdfUrl} // Key change ensures iframe reloads on new PDF
              src={`/pdfjs-annotation-viewer/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`}
              className="w-full h-[750px] border-0"
              title="PDF Editor"
              onLoad={handleIframeLoad}
            />
            {!isEditorReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            )}
            {isProcessing && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <Card className="p-6 text-center">
                   <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                   <p className="font-bold">PyMuPDF WASM is editing your PDF...</p>
                   <p className="text-xs text-gray-500">Please wait while we modify the text layer.</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPDFTool;
