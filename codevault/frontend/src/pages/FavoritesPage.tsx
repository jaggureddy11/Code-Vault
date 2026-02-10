import { useState, useEffect } from 'react';
import { Search, Heart, Cloud, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { useSnippets } from '@/hooks/useSnippets';
import SnippetCard from '@/components/SnippetCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Snippet } from '@/types';
import { SkeletonCard } from '@/components/ui/loading';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

export default function FavoritesPage() {
    const {
        snippets,
        isLoading,
        deleteSnippet,
        setSearchFilters,
        searchFilters,
        error: syncError
    } = useSnippets();

    // Filter only favorites
    const favoriteSnippets = snippets.filter(s => s.is_favorite);

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
        }
    ]);

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
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-black text-white px-4 sm:px-8 py-10 sm:py-20 mb-10 sm:mb-20 border-b-8 border-white/20">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
                        <div className="flex-1 space-y-4 sm:space-y-8 text-left">
                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-bold italic tracking-widest leading-none border border-white/20">
                                    <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                                    Favorites
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
                            <h1 className="text-4xl sm:text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] uppercase">
                                Elite <br />Pinned <br /><span className="underline decoration-8 underline-offset-8 text-pink-500">Favorites.</span>
                            </h1>
                            <p className="text-lg sm:text-xl font-bold italic max-w-xl leading-tight opacity-70">
                                Curated high-performance code snippets for rapid deployment.
                            </p>
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
                            placeholder="Search favorites..."
                            className="h-20 pl-16 pr-32 rounded-none border-b-4 border-black dark:border-white bg-transparent text-xl font-bold italic tracking-widest focus:ring-0 placeholder:opacity-40"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                        <Button
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-14 px-8 rounded-none bg-black dark:bg-white text-white dark:text-black font-black italic uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            Search
                        </Button>
                    </div>
                </div>

                {/* Brand Tagline */}
                <div className="flex items-center gap-2 sm:gap-4 mb-10 sm:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                    <div className="text-[8px] sm:text-[10px] font-black italic uppercase tracking-[0.3em] sm:tracking-[0.5em] opacity-60">
                        master your <span className="text-pink-500">craft.</span>
                    </div>
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                </div>

                {/* Snippets Grid */}
                {isLoading && favoriteSnippets.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : favoriteSnippets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {favoriteSnippets.map((snippet: Snippet) => (
                            <SnippetCard
                                key={snippet.id}
                                snippet={snippet}
                                onDelete={handleDeleteSnippet}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center border-4 border-dashed border-black/10 dark:border-white/10">
                        <Heart className="h-20 w-20 mx-auto opacity-10 mb-8" />
                        <h3 className="text-5xl font-black italic uppercase mb-4">No Favorites</h3>
                        <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.5em] mb-12">Zero pinned assets in your elite collection</p>
                        <Button
                            variant="outline"
                            className="h-16 px-12 rounded-none border-4 border-black dark:border-white font-black uppercase italic tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                            onClick={() => window.location.href = '/'}
                        >
                            Return To Vault
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
