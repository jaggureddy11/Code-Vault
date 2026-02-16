import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
    ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
    Maximize, Minimize, Loader2, AlertCircle, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewerProps {
    file: File | string | null;
}

export default function PdfPreviewer({ file }: PdfPreviewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<HTMLDivElement>(null);

    // Dynamic width for mobile stability
    const [containerWidth, setContainerWidth] = useState<number>(0);

    useEffect(() => {
        const updateWidth = () => {
            if (viewerRef.current) {
                setContainerWidth(viewerRef.current.clientWidth);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    // Keyboard & Touchpad Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                setPageNumber(p => Math.min(p + 1, numPages));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                setPageNumber(p => Math.max(p - 1, 1));
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setScale(s => Math.min(Math.max(s + delta, 0.4), 4.0));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        const viewer = viewerRef.current;
        if (viewer) {
            viewer.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (viewer) {
                viewer.removeEventListener('wheel', handleWheel);
            }
        };
    }, [numPages]);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    useEffect(() => {
        const handleFSChange = () => setIsFullScreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => document.removeEventListener('fullscreenchange', handleFSChange);
    }, []);

    if (!file) return null;

    return (
        <div
            ref={containerRef}
            className={cn(
                "flex flex-col bg-neutral-100 dark:bg-neutral-900 w-full h-full overflow-hidden transition-all",
                isFullScreen ? "fixed inset-0 z-[500]" : "relative border-2 border-black dark:border-white"
            )}
        >
            {/* Toolbar - Mobile friendly with wrap or scrolling if needed */}
            <div className="flex items-center justify-between px-2 sm:px-4 h-14 sm:h-12 bg-white dark:bg-black border-b-2 border-black dark:border-white shrink-0">
                <div className="flex items-center gap-1 sm:gap-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPageNumber(p => Math.max(p - 1, 1))} disabled={pageNumber <= 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-center min-w-[60px]">P. {pageNumber} / {numPages || '?'}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPageNumber(p => Math.min(p + 1, numPages))} disabled={pageNumber >= numPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex" onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-[9px] sm:text-[10px] font-black w-8 sm:w-10 text-center">{Math.round(scale * 100)}%</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex" onClick={() => setScale(s => Math.min(s + 0.2, 4.0))}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFullScreen}>
                        {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                    {typeof file === 'string' && (
                        <a href={file} download target="_blank" rel="noreferrer" className="flex items-center justify-center h-8 w-8 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <Download className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </div>

            <div
                ref={viewerRef}
                className="flex-1 overflow-auto flex justify-center p-2 sm:p-4 bg-neutral-200 dark:bg-neutral-900 custom-scrollbar relative"
            >
                <div className="min-w-fit flex items-start justify-center">
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex flex-col items-center justify-center p-20">
                                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">Processing Asset...</p>
                            </div>
                        }
                        error={
                            <div className="flex flex-col items-center justify-center p-10 text-center max-w-sm mx-auto">
                                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                                <p className="text-sm font-bold mb-6">Device view compatibility error.</p>
                                {typeof file === 'string' && (
                                    <a href={file} target="_blank" rel="noreferrer" className="w-full">
                                        <Button className="w-full bg-black dark:bg-white text-white dark:text-black rounded-none h-12 font-black uppercase">
                                            Open PDF directly
                                        </Button>
                                    </a>
                                )}
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            className="shadow-2xl border border-black/10 transition-transform duration-200"
                            renderTextLayer={true}
                            renderAnnotationLayer={false}
                            width={containerWidth ? containerWidth * 0.95 : undefined}
                        />
                    </Document>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
                /* Fix for mobile text selection overlay */
                .react-pdf__Page__textContent {
                    pointer-events: none;
                }
            `}} />
        </div>
    );
}
