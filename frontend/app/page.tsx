'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ YOUR EXACT BACKEND URL - HARDCODED
const API_URL = 'https://nexus-tools-3.onrender.com';

// --- TYPES ---
type ToolMode = 
  | 'img-to-pdf' | 'pdf-merger' | 'pdf-splitter' | 'pdf-rotator'
  | 'transcoder' | 'resizer' | 'metadata-wiper'
  | 'extract-audio' | 'video-to-gif'
  | 'docx-to-pdf' | 'md-to-pdf'
  | 'lock-pdf' | 'pdf-text' 
  | 'watermark' | 'pdf-meta'
  | 'csv-excel' | 'zip-creator'
  | 'epub-text' | 'code-pdf' | 'file-hash'
  | 'compress-pdf' | 'pdf-to-word' | 'pdf-to-ppt' | 'pdf-to-excel'
  | 'word-to-pdf' | 'ppt-to-pdf' | 'excel-to-pdf'
  | 'pdf-to-jpg' | 'html-to-pdf' | 'pdf-to-pdfa'
  | 'repair-pdf' | 'page-numbers' | 'ocr-pdf'
  | 'compare-pdf' | 'redact-pdf' | 'crop-pdf'
  | 'unlock-pdf' | 'organize-pdf';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export default function MultiTool() {
  const [activeTool, setActiveTool] = useState<ToolMode>('img-to-pdf');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const navGroups: { title: string; icon: string; tools: { mode: ToolMode; label: string; icon: string }[] }[] = [
    { title: 'PDF essentials', icon: '◫', tools: [
      { mode: 'pdf-merger', label: 'Merge PDF', icon: '⊕' }, { mode: 'pdf-splitter', label: 'Split PDF', icon: '✂' },
      { mode: 'compress-pdf', label: 'Compress PDF', icon: '⇣' }, { mode: 'pdf-rotator', label: 'Rotate pages', icon: '↻' },
      { mode: 'organize-pdf', label: 'Organize pages', icon: '▦' },
    ]},
    { title: 'Convert', icon: '⇄', tools: [
      { mode: 'pdf-to-word', label: 'PDF to Word', icon: 'W' }, { mode: 'pdf-to-ppt', label: 'PDF to PowerPoint', icon: 'P' },
      { mode: 'pdf-to-excel', label: 'PDF to Excel', icon: 'X' }, { mode: 'pdf-to-jpg', label: 'PDF to image', icon: 'J' },
      { mode: 'word-to-pdf', label: 'Word to PDF', icon: 'W' }, { mode: 'ppt-to-pdf', label: 'PowerPoint to PDF', icon: 'P' },
      { mode: 'excel-to-pdf', label: 'Excel to PDF', icon: 'X' }, { mode: 'img-to-pdf', label: 'Images to PDF', icon: 'I' },
      { mode: 'html-to-pdf', label: 'Webpage to PDF', icon: 'H' },
    ]},
    { title: 'Protect & review', icon: '◇', tools: [
      { mode: 'lock-pdf', label: 'Protect PDF', icon: '●' }, { mode: 'unlock-pdf', label: 'Unlock PDF', icon: '○' },
      { mode: 'watermark', label: 'Watermark', icon: 'W' }, { mode: 'redact-pdf', label: 'Redact', icon: 'R' },
      { mode: 'compare-pdf', label: 'Compare PDFs', icon: '≠' }, { mode: 'pdf-meta', label: 'Edit metadata', icon: 'i' },
    ]},
    { title: 'Advanced PDF', icon: '⌁', tools: [
      { mode: 'page-numbers', label: 'Page numbers', icon: '#' }, { mode: 'ocr-pdf', label: 'OCR document', icon: 'O' },
      { mode: 'crop-pdf', label: 'Crop pages', icon: '⌗' }, { mode: 'repair-pdf', label: 'Repair PDF', icon: '+' },
      { mode: 'pdf-text', label: 'Extract text', icon: 'T' },
    ]},
    { title: 'Images & media', icon: '◉', tools: [
      { mode: 'transcoder', label: 'Convert image', icon: 'I' }, { mode: 'resizer', label: 'Resize image', icon: '↔' },
      { mode: 'metadata-wiper', label: 'Remove EXIF', icon: '×' }, { mode: 'extract-audio', label: 'Extract audio', icon: 'A' },
      { mode: 'video-to-gif', label: 'Video to GIF', icon: 'G' },
    ]},
    { title: 'Documents & data', icon: '▤', tools: [
      { mode: 'csv-excel', label: 'Spreadsheet converter', icon: 'S' }, { mode: 'zip-creator', label: 'Create ZIP', icon: 'Z' },
      { mode: 'docx-to-pdf', label: 'DOCX to PDF', icon: 'D' }, { mode: 'md-to-pdf', label: 'Markdown to PDF', icon: 'M' },
    ]},
  ];

  const visibleGroups = navGroups.map(group => ({
    ...group,
    tools: group.tools.filter(tool => tool.label.toLowerCase().includes(query.toLowerCase())),
  })).filter(group => group.tools.length > 0);

  const activeLabel = navGroups.flatMap(group => group.tools).find(tool => tool.mode === activeTool)?.label ?? 'Nexus Tools';

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const navigate = (mode: ToolMode) => {
    setActiveTool(mode);
    setMobileNavOpen(false);
  };

  return (
    <div className="app-shell">

      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-[9999]"
          >
            <div className={`px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl min-w-[300px] ${
              toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50' :
              toast.type === 'error' ? 'bg-rose-500/20 border-rose-500/50' :
              'bg-blue-500/20 border-blue-500/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  toast.type === 'success' ? 'bg-emerald-400' :
                  toast.type === 'error' ? 'bg-rose-400' :
                  'bg-blue-400'
                } animate-pulse`}></div>
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.aside 
        animate={{ width: sidebarCollapsed ? 84 : 292 }}
        className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}
      >
        <div className="brand-block">
          <motion.div 
            animate={{ scale: sidebarCollapsed ? 0.8 : 1 }}
            className="brand-row"
          >
            <div className="brand-mark">
              <svg viewBox="0 0 28 28" aria-hidden="true">
                <path d="M5 7.5h8.5L9.7 14H23l-9 8v-6.5H5l5-8Z" fill="currentColor" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1>Nexus</h1>
                <p>File workspace</p>
              </div>
            )}
          </motion.div>
        </div>

        {!sidebarCollapsed && (
          <div className="nav-search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a tool" aria-label="Find a tool" />
            <kbd>/</kbd>
          </div>
        )}

        <div className="nav-scroll">
          {visibleGroups.map(group => (
            <NavGroup key={group.title} title={group.title} icon={group.icon} collapsed={sidebarCollapsed}>
              {group.tools.map(tool => (
                <NavButton key={tool.mode} label={tool.label} icon={tool.icon} active={activeTool === tool.mode} onClick={() => navigate(tool.mode)} collapsed={sidebarCollapsed} />
              ))}
            </NavGroup>
          ))}
          {!sidebarCollapsed && visibleGroups.length === 0 && <p className="no-results">No tools match “{query}”.</p>}
        </div>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="collapse-button"
          aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <svg className={sidebarCollapsed ? 'rotate-180' : ''} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </motion.aside>

      {mobileNavOpen && <button className="nav-backdrop" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}

      <main className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <button className="menu-button" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
              <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
            <div><span>Workspace</span><strong>{activeLabel}</strong></div>
          </div>
          <div className="privacy-chip"><span /> Files are processed securely</div>
        </header>
        <div className="workspace-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTool === 'img-to-pdf' && <ImgToPdfTool showToast={showToast} />}
              {activeTool === 'pdf-merger' && <PdfMergerTool showToast={showToast} />}
              {activeTool === 'pdf-splitter' && <PdfSplitterTool showToast={showToast} />}
              {activeTool === 'compress-pdf' && <CompressPdfTool showToast={showToast} />}
              {activeTool === 'pdf-rotator' && <PdfRotatorTool showToast={showToast} />}
              {activeTool === 'organize-pdf' && <OrganizePdfTool showToast={showToast} />}
              {activeTool === 'pdf-to-word' && <PdfToWordTool showToast={showToast} />}
              {activeTool === 'pdf-to-ppt' && <PdfToPptTool showToast={showToast} />}
              {activeTool === 'pdf-to-excel' && <PdfToExcelTool showToast={showToast} />}
              {activeTool === 'pdf-to-jpg' && <PdfToJpgTool showToast={showToast} />}
              {activeTool === 'word-to-pdf' && <WordToPdfTool showToast={showToast} />}
              {activeTool === 'ppt-to-pdf' && <PptToPdfTool showToast={showToast} />}
              {activeTool === 'excel-to-pdf' && <ExcelToPdfTool showToast={showToast} />}
              {activeTool === 'html-to-pdf' && <HtmlToPdfTool showToast={showToast} />}
              {activeTool === 'lock-pdf' && <LockPdfTool showToast={showToast} />}
              {activeTool === 'unlock-pdf' && <UnlockPdfTool showToast={showToast} />}
              {activeTool === 'watermark' && <WatermarkTool showToast={showToast} />}
              {activeTool === 'redact-pdf' && <RedactPdfTool showToast={showToast} />}
              {activeTool === 'page-numbers' && <PageNumbersTool showToast={showToast} />}
              {activeTool === 'ocr-pdf' && <OcrPdfTool showToast={showToast} />}
              {activeTool === 'compare-pdf' && <ComparePdfTool showToast={showToast} />}
              {activeTool === 'crop-pdf' && <CropPdfTool showToast={showToast} />}
              {activeTool === 'repair-pdf' && <RepairPdfTool showToast={showToast} />}
              {activeTool === 'pdf-text' && <PdfTextTool showToast={showToast} />}
              {activeTool === 'pdf-meta' && <PdfMetaTool showToast={showToast} />}
              {activeTool === 'transcoder' && <TranscoderTool showToast={showToast} />}
              {activeTool === 'resizer' && <ImageResizerTool showToast={showToast} />}
              {activeTool === 'metadata-wiper' && <MetadataWiperTool showToast={showToast} />}
              {activeTool === 'extract-audio' && <ExtractAudioTool showToast={showToast} />}
              {activeTool === 'video-to-gif' && <VideoToGifTool showToast={showToast} />}
              {activeTool === 'csv-excel' && <SpreadsheetTool showToast={showToast} />}
              {activeTool === 'docx-to-pdf' && <DocxToPdfTool showToast={showToast} />}
              {activeTool === 'md-to-pdf' && <MdToPdfTool showToast={showToast} />}
              {activeTool === 'zip-creator' && <ZipCreatorTool showToast={showToast} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- NAVIGATION COMPONENTS ---
const NavGroup = ({ title, icon, children, collapsed }: any) => (
  <div className="nav-group">
    {!collapsed && (
      <div className="nav-group-title">
        <span>{icon}</span>
        <h3>{title}</h3>
      </div>
    )}
    {collapsed && (
      <div className="nav-group-collapsed">
        <span>{icon}</span>
      </div>
    )}
    <div className="nav-group-links">{children}</div>
  </div>
);

const NavButton = ({ label, icon, active, onClick, collapsed }: any) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`nav-button ${active ? 'nav-button-active' : ''}`}
    title={collapsed ? label : undefined}
  >
    <div className="nav-button-inner">
      <span className="nav-icon">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </div>
  </motion.button>
);

// --- SHARED UI COMPONENTS ---
const ToolLayout = ({ title, desc, icon, children }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
  >
    <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
        {icon}
      </div>
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-slate-400">{desc}</p>
      </div>
    </div>
    <div className="space-y-6">{children}</div>
  </motion.div>
);

const FileUpload = ({ multiple, accept, onChange, files }: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onChange({ target: { files: droppedFiles } });
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${
        isDragging 
          ? 'border-blue-500 bg-blue-500/10 scale-105' 
          : 'border-white/20 hover:border-white/40 hover:bg-white/5'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
        <p className="text-sm text-slate-400">
          {multiple ? 'Multiple files supported' : 'Single file only'}
        </p>
        {files && files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((f: File, i: number) => (
              <div key={i} className="text-sm text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg inline-block mr-2">
                {f.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, loading, label, disabled, icon }: any) => (
  <motion.button
    onClick={onClick}
    disabled={disabled || loading}
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all shadow-lg relative overflow-hidden ${
      disabled || loading 
        ? 'bg-slate-700 cursor-not-allowed' 
        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/50'
    }`}
  >
    {loading && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>
    )}
    <div className="relative flex items-center justify-center gap-2">
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="text-xl">{icon}</span>}
          <span>{label}</span>
        </>
      )}
    </div>
  </motion.button>
);

const Input = ({ type = 'text', placeholder, value, onChange, icon }: any) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
        {icon}
      </div>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all ${
        icon ? 'pl-12' : ''
      }`}
    />
  </div>
);

const Select = ({ value, onChange, options, icon }: any) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none z-10">
        {icon}
      </div>
    )}
    <select
      value={value}
      onChange={onChange}
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer ${
        icon ? 'pl-12' : ''
      }`}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900">
          {opt.label}
        </option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

// --- HELPER ---
const triggerDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// ==========================================
// TOOL IMPLEMENTATIONS - ALL USING STRING CONCATENATION
// ==========================================

function ImgToPdfTool({ showToast }: any) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setL] = useState(false);

  const run = async () => {
    setL(true);
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    try {
      const res = await fetch(API_URL + '/api/img-to-pdf', { method: 'POST', body: fd });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.detail || 'The processing service could not convert this image.');
      }
      triggerDownload(await res.blob(), 'images.pdf');
      showToast('PDF created successfully! 🎉', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to create PDF', 'error');
    } finally { setL(false); }
  };

  return (
    <ToolLayout title="Images to PDF" desc="Convert multiple images into a single PDF document" icon="🖼️">
      <FileUpload 
        multiple 
        accept="image/*" 
        onChange={(e: any) => setFiles(Array.from(e.target.files||[]))}
        files={files}
      />
      <ActionButton onClick={run} loading={loading} disabled={!files.length} label="Create PDF" icon="✨" />
    </ToolLayout>
  );
}

function PdfMergerTool({ showToast }: any) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setL] = useState(false);

  const run = async () => {
    setL(true);
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    try {
      const res = await fetch(API_URL + '/api/merge-pdfs', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'merged.pdf');
      showToast('PDFs merged successfully! 🎉', 'success');
    } catch { showToast('Merge failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Merge PDFs" desc="Combine multiple PDF files into one" icon="🔗">
      <FileUpload 
        multiple 
        accept="application/pdf" 
        onChange={(e: any) => setFiles(Array.from(e.target.files||[]))}
        files={files}
      />
      <ActionButton onClick={run} loading={loading} disabled={files.length < 2} label="Merge Documents" icon="✨" />
    </ToolLayout>
  );
}

function PdfSplitterTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('start_page', start.toString());
    fd.append('end_page', end.toString());
    try {
      const res = await fetch(API_URL + '/api/split-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'split.pdf');
      showToast('PDF split successfully! ✂️', 'success');
    } catch { showToast('Split failed - check page numbers', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Split PDF" desc="Extract specific pages from your document" icon="✂️">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Start Page</label>
          <Input type="number" value={start} onChange={(e: any) => setStart(parseInt(e.target.value))} icon="📄" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">End Page</label>
          <Input type="number" value={end} onChange={(e: any) => setEnd(parseInt(e.target.value))} icon="📄" />
        </div>
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Split PDF" icon="✂️" />
    </ToolLayout>
  );
}

function CompressPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [quality, setQuality] = useState('medium');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('quality', quality);
    try {
      const res = await fetch(API_URL + '/api/compress-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'compressed.pdf');
      showToast('PDF compressed! 📦', 'success');
    } catch { showToast('Compression failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Compress PDF" desc="Reduce file size while maintaining quality" icon="📦">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <Select
        value={quality}
        onChange={(e: any) => setQuality(e.target.value)}
        icon="⚙️"
        options={[
          { value: 'low', label: 'Low Quality (Max Compression)' },
          { value: 'medium', label: 'Medium Quality (Recommended)' },
          { value: 'high', label: 'High Quality (Min Compression)' }
        ]}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Compress" icon="📦" />
    </ToolLayout>
  );
}

function PdfRotatorTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [rot, setRot] = useState(90);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('rotation', rot.toString());
    try {
      const res = await fetch(API_URL + '/api/rotate-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'rotated.pdf');
      showToast('PDF rotated! 🔄', 'success');
    } catch { showToast('Rotation failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Rotate PDF" desc="Change the orientation of all pages" icon="🔄">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <div className="grid grid-cols-3 gap-4">
        {[90, 180, 270].map(r => (
          <motion.button
            key={r}
            onClick={() => setRot(r)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-6 rounded-xl font-bold transition-all ${
              rot === r 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="text-3xl mb-2">🔄</div>
            <div>{r}°</div>
          </motion.button>
        ))}
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Rotate PDF" icon="🔄" />
    </ToolLayout>
  );
}

function OrganizePdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [pageOrder, setPageOrder] = useState('');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file || !pageOrder) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('page_order', pageOrder);
    try {
      const res = await fetch(API_URL + '/api/organize-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'organized.pdf');
      showToast('PDF reorganized! 📋', 'success');
    } catch { showToast('Organization failed - check format', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Organize PDF" desc="Reorder, delete, or duplicate pages" icon="📋">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <Input 
        placeholder="e.g., 1,3,2,4-7" 
        value={pageOrder} 
        onChange={(e: any) => setPageOrder(e.target.value)}
        icon="🔢"
      />
      <div className="text-sm text-slate-400 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="font-medium mb-2">Examples:</p>
        <p>• <code className="text-blue-400">1,3,2</code> - Reorder first 3 pages</p>
        <p>• <code className="text-blue-400">1-5,10</code> - Pages 1-5 and page 10</p>
        <p>• <code className="text-blue-400">1,1,2</code> - Duplicate page 1</p>
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file || !pageOrder} label="Reorganize" icon="📋" />
    </ToolLayout>
  );
}

// PDF CONVERSION TOOLS
function PdfToWordTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/pdf-to-word', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'document.docx');
      showToast('Converted to Word! 📝', 'success');
    } catch { showToast('Conversion failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="PDF to Word" desc="Convert PDF to editable DOCX format" icon="📝">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Convert to Word" icon="📝" />
    </ToolLayout>
  );
}

function PdfToPptTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/pdf-to-ppt', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'presentation.pptx');
      showToast('Converted to PowerPoint! 📊', 'success');
    } catch { showToast('Conversion failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="PDF to PowerPoint" desc="Convert PDF pages to editable slides" icon="📊">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Convert to PPT" icon="📊" />
    </ToolLayout>
  );
}

function PdfToExcelTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/pdf-to-excel', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'data.xlsx');
      showToast('Extracted to Excel! 📈', 'success');
    } catch { showToast('Extraction failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="PDF to Excel" desc="Extract tables from PDF to spreadsheet" icon="📈">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Extract Tables" icon="📈" />
    </ToolLayout>
  );
}

function PdfToJpgTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/pdf-to-jpg', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'images.zip');
      showToast('Images extracted! 🖼️', 'success');
    } catch { showToast('Extraction failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="PDF to JPG" desc="Convert each page to JPG images (ZIP file)" icon="🖼️">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Extract Images" icon="🖼️" />
    </ToolLayout>
  );
}

function WordToPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/word-to-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'document.pdf');
      showToast('Converted to PDF! 📄', 'success');
    } catch { showToast('Conversion failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Word to PDF" desc="Convert DOC/DOCX files to PDF" icon="📝">
      <FileUpload 
        accept=".doc,.docx" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Convert to PDF" icon="📄" />
    </ToolLayout>
  );
}

function PptToPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/ppt-to-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'slides.pdf');
      showToast('Converted to PDF! 📄', 'success');
    } catch { showToast('Conversion failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="PowerPoint to PDF" desc="Convert PPT/PPTX presentations to PDF" icon="📊">
      <FileUpload 
        accept=".ppt,.pptx" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Convert to PDF" icon="📄" />
    </ToolLayout>
  );
}

function ExcelToPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/excel-to-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'spreadsheet.pdf');
      showToast('Converted to PDF! 📄', 'success');
    } catch { showToast('Conversion failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Excel to PDF" desc="Convert XLS/XLSX spreadsheets to PDF" icon="📈">
      <FileUpload 
        accept=".xls,.xlsx" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Convert to PDF" icon="📄" />
    </ToolLayout>
  );
}

function HtmlToPdfTool({ showToast }: any) {
  const [url, setUrl] = useState('');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!url) return;
    setL(true);
    try {
      const res = await fetch(API_URL + '/api/html-to-pdf', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'webpage.pdf');
      showToast('Web page captured! 🌐', 'success');
    } catch { showToast('Capture failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="HTML to PDF" desc="Convert web pages to PDF documents" icon="🌐">
      <Input 
        type="url" 
        placeholder="https://example.com" 
        value={url} 
        onChange={(e: any) => setUrl(e.target.value)}
        icon="🌐"
      />
      <ActionButton onClick={run} loading={loading} disabled={!url} label="Capture Page" icon="📄" />
    </ToolLayout>
  );
}

// SECURITY TOOLS
function LockPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [pass, setPass] = useState('');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file || !pass) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('password', pass);
    try {
      const res = await fetch(API_URL + '/api/lock-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'protected.pdf');
      showToast('PDF locked! 🔐', 'success');
    } catch { showToast('Lock failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Lock PDF" desc="Protect your PDF with a password" icon="🔐">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <Input 
        type="password" 
        placeholder="Enter password" 
        value={pass} 
        onChange={(e: any) => setPass(e.target.value)}
        icon="🔑"
      />
      <ActionButton onClick={run} loading={loading} disabled={!file || !pass} label="Lock PDF" icon="🔐" />
    </ToolLayout>
  );
}

function UnlockPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [pass, setPass] = useState('');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file || !pass) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('password', pass);
    try {
      const res = await fetch(API_URL + '/api/unlock-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'unlocked.pdf');
      showToast('PDF unlocked! 🔓', 'success');
    } catch { showToast('Unlock failed - wrong password?', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Unlock PDF" desc="Remove password protection from PDF" icon="🔓">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <Input 
        type="password" 
        placeholder="Enter current password" 
        value={pass} 
        onChange={(e: any) => setPass(e.target.value)}
        icon="🔑"
      />
      <ActionButton onClick={run} loading={loading} disabled={!file || !pass} label="Unlock PDF" icon="🔓" />
    </ToolLayout>
  );
}

function WatermarkTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('text', text);
    try {
      const res = await fetch(API_URL + '/api/watermark-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'watermarked.pdf');
      showToast('Watermark applied! 💧', 'success');
    } catch { showToast('Watermark failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Add Watermark" desc="Stamp your documents with custom text" icon="💧">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <Input 
        placeholder="Watermark text (e.g., DRAFT)" 
        value={text} 
        onChange={(e: any) => setText(e.target.value)}
        icon="✍️"
      />
      <ActionButton onClick={run} loading={loading} disabled={!file || !text} label="Apply Watermark" icon="💧" />
    </ToolLayout>
  );
}

function RedactPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [text, setText] = useState('');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file || !text) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('text_to_redact', text);
    try {
      const res = await fetch(API_URL + '/api/redact-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'redacted.pdf');
      showToast('Text redacted! 🖍️', 'success');
    } catch { showToast('Redaction failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Redact PDF" desc="Permanently remove sensitive information" icon="🖍️">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <Input 
        placeholder="Text to redact" 
        value={text} 
        onChange={(e: any) => setText(e.target.value)}
        icon="🔍"
      />
      <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
        ⚠️ Redaction is permanent and cannot be undone
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file || !text} label="Redact Text" icon="🖍️" />
    </ToolLayout>
  );
}

// ADVANCED TOOLS
function PageNumbersTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [position, setPosition] = useState('bottom-center');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('position', position);
    try {
      const res = await fetch(API_URL + '/api/add-page-numbers', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'numbered.pdf');
      showToast('Page numbers added! 🔢', 'success');
    } catch { showToast('Failed to add numbers', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Add Page Numbers" desc="Insert page numbers into your PDF" icon="🔢">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <Select
        value={position}
        onChange={(e: any) => setPosition(e.target.value)}
        icon="📍"
        options={[
          { value: 'top-left', label: 'Top Left' },
          { value: 'top-center', label: 'Top Center' },
          { value: 'top-right', label: 'Top Right' },
          { value: 'bottom-left', label: 'Bottom Left' },
          { value: 'bottom-center', label: 'Bottom Center' },
          { value: 'bottom-right', label: 'Bottom Right' }
        ]}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Add Numbers" icon="🔢" />
    </ToolLayout>
  );
}

function OcrPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/ocr-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'searchable.pdf');
      showToast('OCR completed! 👁️', 'success');
    } catch { showToast('OCR failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="OCR PDF" desc="Make scanned PDFs searchable with text recognition" icon="👁️">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <div className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        ⚠️ OCR processing may take several minutes for large documents
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Run OCR" icon="👁️" />
    </ToolLayout>
  );
}

function ComparePdfTool({ showToast }: any) {
  const [file1, setFile1] = useState<File|null>(null);
  const [file2, setFile2] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file1 || !file2) return;
    setL(true);
    const fd = new FormData();
    fd.append('file1', file1);
    fd.append('file2', file2);
    try {
      const res = await fetch(API_URL + '/api/compare-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'comparison.pdf');
      showToast('Comparison complete! ⚖️', 'success');
    } catch { showToast('Comparison failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Compare PDFs" desc="Highlight differences between two documents" icon="⚖️">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Original Document</label>
          <FileUpload 
            accept="application/pdf" 
            onChange={(e: any) => setFile1(e.target.files?.[0]||null)}
            files={file1 ? [file1] : []}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Modified Document</label>
          <FileUpload 
            accept="application/pdf" 
            onChange={(e: any) => setFile2(e.target.files?.[0]||null)}
            files={file2 ? [file2] : []}
          />
        </div>
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file1 || !file2} label="Compare Documents" icon="⚖️" />
    </ToolLayout>
  );
}

function CropPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [margin, setMargin] = useState(50);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('margin', margin.toString());
    try {
      const res = await fetch(API_URL + '/api/crop-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'cropped.pdf');
      showToast('PDF cropped! ✂️', 'success');
    } catch { showToast('Crop failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Crop PDF" desc="Remove margins from all pages" icon="✂️">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <div>
        <label className="block text-sm font-medium mb-2 text-slate-300">Crop Margin: {margin}pt</label>
        <input 
          type="range" 
          min="0" 
          max="200" 
          value={margin} 
          onChange={(e) => setMargin(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Crop Pages" icon="✂️" />
    </ToolLayout>
  );
}

function RepairPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/repair-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'repaired.pdf');
      showToast('PDF repaired! 🔧', 'success');
    } catch { showToast('Repair failed - file may be too damaged', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Repair PDF" desc="Attempt to fix corrupted PDF files" icon="🔧">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <div className="text-sm text-slate-400 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        ℹ️ Repair success depends on damage severity
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Repair Document" icon="🔧" />
    </ToolLayout>
  );
}

function PdfTextTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/extract-text', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'content.txt');
      showToast('Text extracted! 📑', 'success');
    } catch { showToast('Extraction failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Extract Text" desc="Pull all text content from PDF" icon="📑">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Extract Text" icon="📑" />
    </ToolLayout>
  );
}

function PdfMetaTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('author', author);
    try {
      const res = await fetch(API_URL + '/api/edit-pdf-metadata', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'tagged.pdf');
      showToast('Metadata updated! 🏷️', 'success');
    } catch { showToast('Update failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Edit Metadata" desc="Modify PDF properties and information" icon="🏷️">
      <FileUpload 
        accept="application/pdf" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <Input placeholder="Document title" value={title} onChange={(e: any) => setTitle(e.target.value)} icon="📝" />
      <Input placeholder="Author name" value={author} onChange={(e: any) => setAuthor(e.target.value)} icon="👤" />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Update Metadata" icon="🏷️" />
    </ToolLayout>
  );
}

// IMAGE TOOLS
function TranscoderTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [fmt, setFmt] = useState('PNG');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('target_format', fmt);
    try {
      const res = await fetch(API_URL + '/api/convert-format', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'converted.' + fmt.toLowerCase());
      showToast('Image converted! 🎨', 'success');
    } catch { showToast('Conversion failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Image Converter" desc="Convert between different image formats" icon="🔄">
      <FileUpload 
        accept="image/*" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <Select
        value={fmt}
        onChange={(e: any) => setFmt(e.target.value)}
        icon="🎨"
        options={[
          { value: 'PNG', label: 'PNG' },
          { value: 'JPEG', label: 'JPEG' },
          { value: 'WEBP', label: 'WEBP' },
          { value: 'GIF', label: 'GIF' },
          { value: 'ICO', label: 'ICO' }
        ]}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Convert Image" icon="🔄" />
    </ToolLayout>
  );
}

function ImageResizerTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('width', w.toString());
    fd.append('height', h.toString());
    try {
      const res = await fetch(API_URL + '/api/resize-image', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'resized.png');
      showToast('Image resized! 📐', 'success');
    } catch { showToast('Resize failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Image Resizer" desc="Change dimensions of your images" icon="📐">
      <FileUpload 
        accept="image/*" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Width (px)</label>
          <Input type="number" value={w} onChange={(e: any) => setW(parseInt(e.target.value))} icon="↔️" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Height (px)</label>
          <Input type="number" value={h} onChange={(e: any) => setH(parseInt(e.target.value))} icon="↕️" />
        </div>
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Resize Image" icon="📐" />
    </ToolLayout>
  );
}

function MetadataWiperTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/clean-metadata', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'clean.png');
      showToast('Metadata removed! 🧹', 'success');
    } catch { showToast('Cleaning failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Clean EXIF Data" desc="Remove GPS and camera metadata from images" icon="🧹">
      <FileUpload 
        accept="image/*" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <div className="text-sm text-slate-400 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        🔒 Removes location, camera info, and other EXIF data
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Clean Metadata" icon="🧹" />
    </ToolLayout>
  );
}

// MEDIA TOOLS
function ExtractAudioTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/extract-audio', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'audio.mp3');
      showToast('Audio extracted! 🎵', 'success');
    } catch { showToast('Extraction failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Video to Audio" desc="Extract MP3 audio from video files" icon="🎵">
      <FileUpload 
        accept="video/mp4" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Extract MP3" icon="🎵" />
    </ToolLayout>
  );
}

function VideoToGifTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(5);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('start_time', start.toString());
    fd.append('end_time', end.toString());
    try {
      const res = await fetch(API_URL + '/api/video-to-gif', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'animation.gif');
      showToast('GIF created! 🎞️', 'success');
    } catch { showToast('Creation failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Video to GIF" desc="Create animated GIFs from video clips" icon="🎞️">
      <FileUpload 
        accept="video/mp4" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Start (seconds)</label>
          <Input type="number" min="0" value={start} onChange={(e: any) => setStart(parseInt(e.target.value))} icon="▶️" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">End (seconds)</label>
          <Input type="number" min="1" value={end} onChange={(e: any) => setEnd(parseInt(e.target.value))} icon="⏸️" />
        </div>
      </div>
      <div className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        ⚠️ Keep duration under 10 seconds for best results
      </div>
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Create GIF" icon="🎞️" />
    </ToolLayout>
  );
}

// OFFICE TOOLS
function SpreadsheetTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [mode, setMode] = useState<'csv-to-excel' | 'excel-to-csv'>('csv-to-excel');
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const endpoint = mode === 'csv-to-excel' ? '/api/csv-to-excel' : '/api/excel-to-csv';
      const ext = mode === 'csv-to-excel' ? 'data.xlsx' : 'data.csv';
      
      const res = await fetch(API_URL + endpoint, { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), ext);
      showToast('Converted successfully! 📊', 'success');
    } catch { showToast('Conversion failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Spreadsheet Converter" desc="Convert between CSV and Excel formats" icon="📊">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.button
          onClick={() => setMode('csv-to-excel')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-6 rounded-xl font-bold transition-all ${
            mode === 'csv-to-excel'
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          CSV → Excel
        </motion.button>
        <motion.button
          onClick={() => setMode('excel-to-csv')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-6 rounded-xl font-bold transition-all ${
            mode === 'excel-to-csv'
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          Excel → CSV
        </motion.button>
      </div>
      <FileUpload 
        accept={mode === 'csv-to-excel' ? ".csv" : ".xlsx, .xls"} 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Convert" icon="📊" />
    </ToolLayout>
  );
}

function DocxToPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/docx-to-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'document.pdf');
      showToast('Converted to PDF! 📄', 'success');
    } catch { showToast('Conversion failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="DOCX to PDF" desc="Convert Word documents to PDF format" icon="📝">
      <FileUpload 
        accept=".docx" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Convert to PDF" icon="📄" />
    </ToolLayout>
  );
}

function MdToPdfTool({ showToast }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!file) return;
    setL(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/md-to-pdf', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'markdown.pdf');
      showToast('Converted to PDF! 📄', 'success');
    } catch { showToast('Conversion failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Markdown to PDF" desc="Convert Markdown files to formatted PDF" icon="📝">
      <FileUpload 
        accept=".md" 
        onChange={(e: any) => setFile(e.target.files?.[0]||null)}
        files={file ? [file] : []}
      />
      <ActionButton onClick={run} loading={loading} disabled={!file} label="Convert to PDF" icon="📄" />
    </ToolLayout>
  );
}

function ZipCreatorTool({ showToast }: any) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setL] = useState(false);

  const run = async () => {
    if(!files.length) return;
    setL(true);
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    try {
      const res = await fetch(API_URL + '/api/create-zip', { method: 'POST', body: fd });
      if(!res.ok) throw new Error();
      triggerDownload(await res.blob(), 'archive.zip');
      showToast('ZIP created! 📦', 'success');
    } catch { showToast('Creation failed', 'error'); } finally { setL(false); }
  };

  return (
    <ToolLayout title="Create ZIP Archive" desc="Compress multiple files into one archive" icon="📦">
      <FileUpload 
        multiple 
        onChange={(e: any) => setFiles(Array.from(e.target.files||[]))}
        files={files}
      />
      <ActionButton onClick={run} loading={loading} disabled={!files.length} label="Create ZIP" icon="📦" />
    </ToolLayout>
  );
}
