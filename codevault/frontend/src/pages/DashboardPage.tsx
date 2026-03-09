import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Search, Code2, CheckCircle2, Cloud, AlertCircle, Heart, Globe, ChevronDown, Compass } from 'lucide-react';
import { useSnippets } from '@/hooks/useSnippets';
import SnippetCard from '@/components/SnippetCard';
import SnippetForm from '@/components/SnippetForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { CreateSnippetInput, Snippet } from '@/types';
import { SkeletonCard } from '@/components/ui/loading';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const {
        snippets,
        isLoading,
        createSnippet,
        deleteSnippet,
        setSearchFilters,
        searchFilters,
        error: syncError
    } = useSnippets();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'SYNCED' | 'SYNCING' | 'OFFLINE' | 'ERROR'>('SYNCED');
    const { toast } = useToast();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const scrollToContent = () => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Local search state for smoothness
    const [localSearch, setLocalSearch] = useState(searchFilters.query || '');

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchFilters(prev => ({ ...prev, query: localSearch }));
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, setSearchFilters]);

    // Sync status logic
    useEffect(() => {
        if (isLoading) {
            setSyncStatus('SYNCING');
        } else if (syncError) {
            setSyncStatus('ERROR');
        } else {
            setSyncStatus('SYNCED');
        }
    }, [isLoading, syncError]);

    // Clear search on unmount
    useEffect(() => {
        return () => setSearchFilters({});
    }, [setSearchFilters]);



    // Keyboard shortcuts
    useEffect(() => {
        const draft = localStorage.getItem('snippet_draft');
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                // Only open if there's actual unsaved data
                if (parsed.title || parsed.code || parsed.description) {
                    setIsCreateModalOpen(true);
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, [])

    useKeyboardShortcuts([
        {
            key: 'k',
            ctrlKey: true,
            description: 'Focus Search',
            action: () => searchInputRef.current?.focus(),
        },
        {
            key: '/',
            description: 'Focus Search',
            action: () => searchInputRef.current?.focus(),
        },
        {
            key: 'n',
            ctrlKey: true,
            description: 'New Snippet',
            action: () => setIsCreateModalOpen(true),
        }
    ]);

    const handleCreateSnippet = async (data: CreateSnippetInput) => {
        setIsSubmitting(true);
        try {
            await createSnippet(data);
            setIsCreateModalOpen(false);
            toast({
                title: 'Success',
                description: 'Snippet vault updated successfully.',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to sync with vault.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSnippet = async (id: string) => {
        if (!confirm('Are you sure you want to delete this snippet? This action is permanent.')) return;

        try {
            await deleteSnippet(id);
            toast({
                title: 'Deleted',
                description: 'Snippet removed from vault.',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: 'Failed to remove snippet.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-black text-white px-4 sm:px-8 py-10 sm:py-20 mb-8 sm:mb-20 border-b-8 border-white/20">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-12">
                        <div className="flex-1 space-y-4 sm:space-y-8 text-left">
                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 dark:bg-black/10 text-[10px] font-bold italic tracking-widest leading-none">
                                    My Collection
                                </div>
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-1 text-[8px] font-black uppercase italic tracking-widest border-2",
                                    syncStatus === 'SYNCED' ? "border-emerald-500 text-emerald-500" :
                                        syncStatus === 'SYNCING' ? "border-blue-500 text-blue-500 animate-pulse" :
                                            "border-red-500 text-red-500"
                                )}>
                                    {syncStatus === 'SYNCED' ? <CheckCircle2 className="h-3 w-3" /> :
                                        syncStatus === 'SYNCING' ? <Cloud className="h-3 w-3" /> :
                                            <AlertCircle className="h-3 w-3" />}
                                    {syncStatus}
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-6xl md:text-9xl font-black italic tracking-tighter leading-none sm:leading-[0.8] uppercase">
                                Your <br className="hidden sm:block" />Code <br /><span className="underline decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8 text-red-600">Vault.</span>
                            </h1>
                            <p className="text-sm sm:text-xl font-bold italic max-w-xl leading-tight opacity-70">
                                High performance management for your elite code snippets.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 w-full md:w-auto">
                            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="adidas-button h-16 sm:h-24 px-8 sm:px-12 text-lg sm:text-2xl group overflow-hidden relative">
                                        <div className="flex items-center gap-4 relative z-10 text-white">
                                            <Plus className="h-6 w-6 sm:h-8 sm:w-8 group-hover:rotate-90 transition-transform duration-300" />
                                            <span>New Snippet</span>
                                        </div>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-none w-screen h-screen overflow-y-auto rounded-none border-0 border-t-8 border-black dark:border-white p-0 bg-white dark:bg-black">
                                    <div className="p-6 sm:p-12">
                                        <DialogHeader className="mb-8 sm:mb-12">
                                            <DialogTitle className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter">
                                                New <span className="text-red-600">Snippet</span>
                                            </DialogTitle>
                                        </DialogHeader>
                                        <SnippetForm
                                            onSubmit={handleCreateSnippet}
                                            onCancel={() => setIsCreateModalOpen(false)}
                                            isLoading={isSubmitting}
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Scroll Down Arrow */}
                <div className="flex justify-center mb-12 -mt-12 relative z-20">
                    <button
                        onClick={scrollToContent}
                        className="animate-bounce bg-white dark:bg-black border-2 border-black dark:border-white p-2 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 transition-all"
                    >
                        <ChevronDown className="h-6 w-6" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-16" ref={contentRef}>
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                        <Input
                            ref={searchInputRef}
                            placeholder="Search snippets..."
                            className="h-16 sm:h-20 pl-12 sm:pl-16 pr-24 sm:pr-32 rounded-none border-b-4 border-black dark:border-white bg-transparent text-base sm:text-xl font-bold italic tracking-widest focus:ring-0 placeholder:opacity-40"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                        <Button
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-12 sm:h-14 px-4 sm:px-8 rounded-none bg-black dark:bg-white text-white dark:text-black font-black italic uppercase tracking-widest text-[10px] sm:text-xs hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            Search
                        </Button>
                    </div>
                </div>

                {/* Brand Tagline */}
                <div className="flex items-center gap-2 sm:gap-4 mb-10 sm:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                    <div className="text-[8px] sm:text-[10px] font-black italic uppercase tracking-[0.3em] sm:tracking-[0.5em] opacity-60">
                        master your <span className="text-red-600">craft.</span>
                    </div>
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                </div>

                {/* Snippets Grid */}
                {isLoading && snippets.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : snippets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {snippets.map((snippet: Snippet) => (
                            <SnippetCard
                                key={snippet.id}
                                snippet={snippet}
                                onDelete={handleDeleteSnippet}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center border-4 border-dashed border-black/10 dark:border-white/10">
                        <div className="h-20 w-20 mx-auto opacity-10 mb-8 flex items-center justify-center">
                            <Search className="h-full w-full" />
                        </div>
                        <h3 className="text-5xl font-black italic uppercase mb-4">Vault Empty</h3>
                        <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.5em] mb-12">System awaiting deployment</p>
                        <Button
                            variant="outline"
                            className="h-16 px-12 rounded-none border-4 border-black dark:border-white font-black uppercase italic tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Deploy First Snippet
                        </Button>
                    </div>
                )}

                {/* Mobile-Only Navigation Buttons (Explore, Favorites & Projects) */}
                <div className="lg:hidden grid grid-cols-3 gap-3 mt-12 pt-8 border-t-2 border-black/5 dark:border-white/5 pb-8">
                    <NavLink
                        to="/explore"
                        className="flex flex-col items-center justify-center p-4 border-2 border-black dark:border-white bg-blue-600 text-white hover:scale-[1.02] active:scale-95 transition-all text-center group"
                    >
                        <Globe className="h-5 w-5 mb-2 group-hover:rotate-12 transition-transform" />
                        <span className="text-[8px] font-black uppercase italic tracking-widest leading-none">Explore</span>
                    </NavLink>
                    <NavLink
                        to="/favorites"
                        className="flex flex-col items-center justify-center p-4 border-2 border-black dark:border-white bg-pink-500 text-white hover:scale-[1.02] active:scale-95 transition-all text-center group"
                    >
                        <Heart className="h-5 w-5 mb-2 fill-white group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase italic tracking-widest leading-none">Favorites</span>
                    </NavLink>
                    <NavLink
                        to="/projects"
                        className="flex flex-col items-center justify-center p-4 border-2 border-black dark:border-white bg-emerald-500 text-white hover:scale-[1.02] active:scale-95 transition-all text-center group"
                    >
                        <Compass className="h-5 w-5 mb-2 group-hover:spin-slow transition-transform" />
                        <span className="text-[8px] font-black uppercase italic tracking-widest leading-none">Projects</span>
                    </NavLink>
                </div>
            </div>
        </div >
    );
}
