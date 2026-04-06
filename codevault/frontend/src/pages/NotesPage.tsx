import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
    Plus, Trash2, Edit3, Save, X,
    FileText, Loader2, Shield, Check,
    Menu, Layout, StickyNote, Eye, EyeOff,
    Maximize2, Minimize2, Copy, CheckCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import PdfPreviewer from '@/components/PdfPreviewer';

interface Note {
    id: string;
    title: string;
    content: string | null;
    pdf_url: string | null;
    pdf_name: string | null;
    created_at: string;
    updated_at: string;
}

export default function NotesPage() {
    const { user } = useAuth();
    const location = useLocation();
    const { toast } = useToast();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    // UI state
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [noteContent, setNoteContent] = useState('');
    const [isNotepadMode, setIsNotepadMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [showSidebar, setShowSidebar] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [copied, setCopied] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // PERSISTENCE: Check URL or LocalStorage on mount
    useEffect(() => {
        if (user) {
            fetchNotes();
        }

        // AGENTIC: Check for pending note search
        const checkAgentic = () => {
            const pendingActionStr = localStorage.getItem('codevault_pending_action');
            if (pendingActionStr) {
                try {
                    const action = JSON.parse(pendingActionStr);
                    if (action.type === 'SEARCH_NOTES' && action.payload.query) {
                        setSearchQuery(action.payload.query);
                        localStorage.removeItem('codevault_pending_action');
                        toast({ title: "Note Filtered", description: `Searching your notes for: "${action.payload.query}"` });
                    }
                } catch (e) { console.error("Agentic notes error", e); }
            }
        };

        checkAgentic();
        window.addEventListener('codevault_agentic_action', checkAgentic);
        return () => window.removeEventListener('codevault_agentic_action', checkAgentic);
    }, [user, location]);

    const fetchNotes = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setNotes(data || []);

            // Restore last selected note from localStorage
            const savedId = localStorage.getItem(`codevault_last_pdf_${user?.id}`);
            if (savedId && data) {
                const found = data.find(n => n.id === savedId);
                if (found) {
                    setSelectedNote(found);
                    setNewTitle(found.title);
                    setNoteContent(found.content || '');
                    setIsNotepadMode(!!found.content && !found.pdf_url);
                }
            }
        } catch (error: any) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectNote = (note: Note) => {
        if (!user) return;
        setSelectedNote(note);
        setPdfFile(null);
        setNoteContent(note.content || '');
        setIsNotepadMode(!!note.content && !note.pdf_url);
        setIsRenaming(false);
        setNewTitle(note.title);
        setShowPreview(false);
        // Persist selection
        if (note.id !== 'temp') {
            localStorage.setItem(`codevault_last_pdf_${user?.id}`, note.id);
        }
        // Auto-hide sidebar on mobile
        if (window.innerWidth < 768) setShowSidebar(false);
    };

    const handleStartNew = () => {
        setSelectedNote(null);
        setPdfFile(null);
        setIsNotepadMode(false);
        setNoteContent('');
        setIsRenaming(false);
        fileInputRef.current?.click();
    };

    const handleStartNotepad = () => {
        setSelectedNote(null);
        setPdfFile(null);
        setIsNotepadMode(true);
        setNoteContent('');
        setIsRenaming(false);
        setNewTitle('Untitled Note');
        // Auto-hide sidebar on mobile
        if (window.innerWidth < 768) setShowSidebar(false);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf') {
                toast({ title: 'Invalid format', description: 'Please select a PDF file.', variant: 'destructive' });
                return;
            }
            setPdfFile(file);
            const tempTitle = file.name.replace('.pdf', '');
            setNewTitle(tempTitle);
            setIsNotepadMode(false);
            setNoteContent('');
            setSelectedNote({
                id: 'temp',
                title: tempTitle,
                content: '',
                pdf_url: URL.createObjectURL(file),
                pdf_name: file.name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            } as Note);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        if (!pdfFile && !isNotepadMode && (!selectedNote || selectedNote.id === 'temp')) {
            toast({ title: 'No content to save', variant: 'destructive' });
            return;
        }

        try {
            setSaving(true);
            let finalPdfUrl = selectedNote?.pdf_url || null;
            let finalPdfName = selectedNote?.pdf_name || null;

            if (pdfFile) {
                const timestamp = Date.now();
                // eslint-disable-next-line no-control-regex
                const safeName = pdfFile.name.replace(/[^\x00-\x7F]/g, "");
                const fileName = `${user?.id}/${timestamp}-${safeName}`;

                const { error: uploadError } = await supabase.storage
                    .from('notes_attachments')
                    .upload(fileName, pdfFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('notes_attachments')
                    .getPublicUrl(fileName);

                finalPdfUrl = publicUrl;
                finalPdfName = pdfFile.name;
            }

            const payload = {
                title: newTitle || (isNotepadMode ? 'Untitled Note' : (finalPdfName?.replace('.pdf', '') || 'Untitled')),
                content: isNotepadMode ? noteContent : '',
                pdf_url: finalPdfUrl,
                pdf_name: finalPdfName,
                user_id: user?.id,
                updated_at: new Date().toISOString(),
            };

            const { data, error: dbError } = await supabase.from('notes').insert([payload]).select();
            if (dbError) throw dbError;

            toast({ title: 'Asset Secured' });
            setPdfFile(null);
            setIsRenaming(false);
            setIsNotepadMode(false);

            if (data && data[0]) {
                localStorage.setItem(`codevault_last_pdf_${user?.id}`, data[0].id);
            }

            fetchNotes();
        } catch (error: any) {
            toast({ title: 'Secure failed', description: error.message, variant: 'destructive', duration: 5000 });
        } finally {
            setSaving(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(noteContent);
        setCopied(true);
        toast({ title: "Copied to Clipboard" });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUpdateNote = async () => {
        if (!selectedNote || selectedNote.id === 'temp' || !user) return;

        try {
            setSaving(true);
            const updatePayload = {
                title: newTitle,
                content: isNotepadMode ? noteContent : (selectedNote.content || ''),
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('notes')
                .update(updatePayload)
                .eq('id', selectedNote.id)
                .eq('user_id', user.id);

            if (error) throw error;

            // Optimistic sync: Update the note in the local list immediately
            setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, ...updatePayload } : n));

            toast({ title: 'Note Synced to Database' });
            setIsRenaming(false);
            fetchNotes(); // Final background sync
            setSelectedNote({ ...selectedNote, ...updatePayload });
        } catch (error: any) {
            toast({ title: 'Sync failed', description: error.message, variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user || !confirm('Are you sure you want to delete this document?')) return;
        try {
            await supabase.from('notes').delete().eq('id', id).eq('user_id', user.id);
            if (selectedNote?.id === id) {
                setSelectedNote(null);
                localStorage.removeItem(`codevault_last_pdf_${user?.id}`);
            }
            fetchNotes();
            toast({ title: 'Document removed' });
        } catch (error: any) {
            toast({ title: 'Delete failed', variant: 'destructive' });
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pt-20 sm:pt-24 min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col font-sans overflow-hidden">
            {/* Header Area */}
            <div className="h-14 sm:h-16 border-b-2 border-black dark:border-white px-4 sm:px-6 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 sticky top-[64px] sm:top-[72px] z-30">
                <div className="flex items-center gap-3 sm:gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="h-9 w-9 border-2 border-black dark:border-white rounded-none"
                    >
                        <Menu className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 hidden sm:block text-blue-600" />
                        <h1 className="text-sm sm:text-xl font-black uppercase italic tracking-tighter">Notes</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    {(pdfFile || (isNotepadMode && !selectedNote)) && (
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="h-9 sm:h-10 rounded-none bg-blue-600 text-white font-black uppercase px-4 sm:px-6 hover:bg-blue-700 transition-colors text-[10px] sm:text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                        >
                            {saving ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" /> : <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />}
                            Secure
                        </Button>
                    )}
                    {selectedNote && selectedNote.id !== 'temp' && isNotepadMode && (
                        <Button
                            onClick={handleUpdateNote}
                            disabled={saving}
                            className="h-9 sm:h-10 rounded-none bg-black text-white dark:bg-white dark:text-black font-black uppercase italic px-4 sm:px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] text-[10px] sm:text-xs"
                        >
                            {saving ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" /> : <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />}
                            Update
                        </Button>
                    )}
                    <Button onClick={handleStartNew} className="h-9 sm:h-10 rounded-none bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white font-black uppercase italic px-4 sm:px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] text-[10px] sm:text-xs">
                        <Plus className="mr-2 h-4 w-4" /> New
                    </Button>
                    <Button onClick={handleStartNotepad} className="h-9 sm:h-10 rounded-none bg-black text-white dark:bg-white dark:text-black font-black uppercase italic px-4 sm:px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] text-[10px] sm:text-xs">
                        <StickyNote className="mr-2 h-4 w-4" /> Notepad
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Mobile Drawer Overlay */}
                {showSidebar && window.innerWidth < 768 && (
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSidebar(false)} />
                )}

                {/* Inventory Drawer */}
                <div className={cn(
                    "absolute md:relative h-full w-72 sm:w-80 border-r-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 shrink-0 transition-transform duration-300 z-50 flex flex-col",
                    showSidebar ? "translate-x-0" : "-translate-x-full md:hidden"
                )}>
                    <div className="p-4 border-b-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                            <Layout className="h-3 w-3" /> Notes
                        </p>
                        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)} className="h-6 w-6 md:hidden">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-4 border-b border-black/10 dark:border-white/10">
                        <Input
                            placeholder="Find Document..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 rounded-none border-2 border-black dark:border-white text-xs font-bold"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-4 space-y-4">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-black/5 dark:bg-white/5 animate-pulse" />)}
                            </div>
                        ) : filteredNotes.length === 0 ? (
                            <div className="p-10 text-center opacity-20 italic font-black uppercase text-[10px] tracking-widest">
                                Notes is Empty
                            </div>
                        ) : filteredNotes.map(note => (
                            <div
                                key={note.id}
                                onClick={() => handleSelectNote(note)}
                                className={cn(
                                    "p-5 border-b border-black/5 dark:border-white/5 cursor-pointer hover:bg-white dark:hover:bg-black transition-all flex justify-between items-center group",
                                    selectedNote?.id === note.id ? "bg-white dark:bg-black border-l-8 border-l-black dark:border-l-white" : ""
                                )}
                            >
                                <div className="flex-1 min-w-0">
                                    {isRenaming && selectedNote?.id === note.id ? (
                                        <div className="flex items-center gap-1 pr-4">
                                            <Input
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleUpdateNote();
                                                    if (e.key === 'Escape') setIsRenaming(false);
                                                }}
                                                className="h-7 rounded-none border-2 border-black dark:border-white text-[10px] sm:text-xs font-black uppercase italic p-1 bg-white dark:bg-black"
                                                autoFocus
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-[11px] sm:text-xs font-black uppercase truncate pr-4">{note.title}</h3>
                                            <p className="text-[9px] font-bold uppercase opacity-30 mt-1">{new Date(note.updated_at).toLocaleDateString()}</p>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {isRenaming && selectedNote?.id === note.id ? (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 text-green-600"
                                            onClick={(e) => { e.stopPropagation(); handleUpdateNote(); }}
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Edit3
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectNote(note);
                                                setTimeout(() => setIsRenaming(true), 10);
                                            }}
                                            className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-125"
                                        />
                                    )}
                                    <Trash2
                                        onClick={(e) => handleDelete(note.id, e)}
                                        className="h-4 w-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-125"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display Stage */}
                <div className="flex-1 bg-neutral-100 dark:bg-neutral-950 p-2 sm:p-6 flex flex-col overflow-hidden">
                    {selectedNote ? (
                        <div className="flex-1 flex flex-col border-2 border-black dark:border-white bg-white dark:bg-black shadow-[15px_15px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                            {/* Document Toolbar */}
                            <div className="h-11 border-b-2 border-black dark:border-white flex items-center justify-between px-3 bg-neutral-50 dark:bg-neutral-900 shrink-0">
                                <div className="flex items-center gap-2 flex-1 max-w-2xl overflow-hidden">
                                    {isRenaming ? (
                                        <div className="flex items-center gap-1 w-full">
                                            <Input
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (selectedNote.id === 'temp' ? setIsRenaming(false) : handleUpdateNote())}
                                                className="h-8 rounded-none border-2 border-black dark:border-white text-[10px] sm:text-xs font-black uppercase italic"
                                                autoFocus
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-green-600"
                                                disabled={saving}
                                                onClick={selectedNote.id === 'temp' ? () => setIsRenaming(false) : handleUpdateNote}
                                            >
                                                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-4 w-4" />}
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600" onClick={() => { setIsRenaming(false); setNewTitle(selectedNote.title); }}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 group cursor-pointer overflow-hidden" onClick={() => setIsRenaming(true)}>
                                            <span className="text-[10px] sm:text-xs font-black uppercase italic truncate">{selectedNote.title}</span>
                                            <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="hidden sm:flex items-center gap-4 text-[9px] font-black uppercase opacity-20 mr-2">
                                        <span>{selectedNote.pdf_name || 'NOTEPAD'}</span>
                                    </div>
                                    {isNotepadMode && (
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleCopy}
                                                className="h-8 w-8 border-2 border-black dark:border-white rounded-none"
                                                title="Copy to Clipboard"
                                            >
                                                {copied ? <CheckCheck className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setShowPreview(!showPreview)}
                                                className="h-8 w-8 border-2 border-black dark:border-white rounded-none"
                                                title={showPreview ? "Edit Mode" : "Preview Mode"}
                                            >
                                                {showPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-hidden flex flex-col relative">
                                {isNotepadMode ? (
                                    <div className="flex-1 flex overflow-hidden">
                                        <div className={cn("flex-1 flex flex-col transition-all duration-300", showPreview ? "hidden md:flex" : "flex")}>
                                            <Textarea
                                                value={noteContent}
                                                onChange={(e) => setNoteContent(e.target.value)}
                                                placeholder="Start typing your notes here... (Markdown supported)"
                                                className="flex-1 rounded-none border-0 focus-visible:ring-0 resize-none p-6 text-base font-medium leading-relaxed bg-white dark:bg-black text-black dark:text-white selection:bg-yellow-200 dark:selection:bg-yellow-900"
                                            />
                                            <div className="h-8 border-t-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 px-4 flex items-center justify-between text-[10px] font-black uppercase opacity-40">
                                                <div className="flex gap-4">
                                                    <span>Words: {noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0}</span>
                                                    <span>Chars: {noteContent.length}</span>
                                                </div>
                                                <span className="flex items-center gap-1"><Shield className="h-2 w-2" /> Encrypted Content</span>
                                            </div>
                                        </div>
                                        {showPreview && (
                                            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50 dark:bg-neutral-900 border-l-2 border-black dark:border-white prose dark:prose-invert prose-sm max-w-none">
                                                <ReactMarkdown>{noteContent || "*No content to preview*"}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <PdfPreviewer file={selectedNote.pdf_url} />
                                )}
                            </div>
                        </div>
                    ) : isNotepadMode ? (
                        <div className="flex-1 flex flex-col border-2 border-black dark:border-white bg-white dark:bg-black shadow-[15px_15px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="h-11 border-b-2 border-black dark:border-white flex items-center justify-between px-3 bg-neutral-50 dark:bg-neutral-900 shrink-0">
                                <div className="flex items-center gap-2 flex-1 max-w-2xl overflow-hidden">
                                    <div className="flex items-center gap-1 w-full">
                                        <Input
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Enter Title..."
                                            className="h-8 rounded-none border-2 border-black dark:border-white text-[10px] sm:text-xs font-black uppercase italic"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="h-8 w-8 border-2 border-black dark:border-white rounded-none"
                                        title={showPreview ? "Edit Mode" : "Preview Mode"}
                                    >
                                        {showPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden flex flex-col relative">
                                <div className="flex-1 flex overflow-hidden">
                                    <div className={cn("flex-1 flex flex-col transition-all duration-300", showPreview ? "hidden md:flex" : "flex")}>
                                        <Textarea
                                            value={noteContent}
                                            onChange={(e) => setNoteContent(e.target.value)}
                                            placeholder="Write something legendary... (Markdown supported)"
                                            className="flex-1 rounded-none border-0 focus-visible:ring-0 resize-none p-6 text-base font-medium leading-relaxed bg-white dark:bg-black text-black dark:text-white"
                                        />
                                        <div className="h-8 border-t-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 px-4 flex items-center justify-between text-[10px] font-black uppercase opacity-40">
                                            <div className="flex gap-4">
                                                <span>Words: {noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0}</span>
                                                <span>Chars: {noteContent.length}</span>
                                            </div>
                                            <span>Draft Mode</span>
                                        </div>
                                    </div>
                                    {showPreview && (
                                        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50 dark:bg-neutral-900 border-l-2 border-black dark:border-white prose dark:prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>{noteContent || "*Drafting...*"}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 border-4 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-center p-6">
                            <div className="h-20 w-20 sm:h-24 sm:w-24 bg-neutral-200 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-6 sm:mb-10">
                                <FileText className="h-10 w-10 opacity-20" />
                            </div>
                            <h2 className="text-3xl sm:text-6xl font-black uppercase italic tracking-tighter mb-4 leading-none text-black/10 dark:text-white/10">Notes</h2>
                            <p className="text-xs sm:text-lg font-bold opacity-30 max-w-sm mb-8 sm:mb-12 uppercase italic leading-tight">Add a PDF or use Notepad to store and study</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onClick={handleStartNew}
                                    className="h-16 sm:h-20 px-8 sm:px-16 rounded-none bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white font-black uppercase italic text-lg sm:text-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[4px] active:shadow-none transition-all"
                                >
                                    Upload PDF
                                </Button>
                                <Button
                                    onClick={handleStartNotepad}
                                    className="h-16 sm:h-20 px-8 sm:px-16 rounded-none bg-black text-white dark:bg-white dark:text-black font-black uppercase italic text-lg sm:text-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[4px] active:shadow-none transition-all"
                                >
                                    Use Notepad
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <input type="file" ref={fileInputRef} onChange={onFileChange} accept="application/pdf" className="hidden" />

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f0f0f0; border-left: 2px solid black; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: black; border: 2px solid black; }
                .dark .custom-scrollbar::-webkit-scrollbar-track { background: #111; border-left: 2px solid white; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: white; border: 2px solid white; }
                
                .prose pre { background: #000 !important; border: 2px solid #555; border-radius: 0; }
                .prose code { color: #f82; }
                .dark .prose code { color: #fd0; }
            `}} />
        </div>
    );
}
