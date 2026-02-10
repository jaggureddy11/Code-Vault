import { useState, useEffect } from 'react';
import { Search, Globe } from 'lucide-react';
import { useSnippets } from '@/hooks/useSnippets';
import SnippetCard from '@/components/SnippetCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Snippet } from '@/types';
import { SkeletonCard } from '@/components/ui/loading';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useRef } from 'react';

export default function ExplorePage() {
    const {
        exploreSnippets,
        isLoading,
        setSearchFilters,
        searchFilters,
    } = useSnippets();

    const searchInputRef = useRef<HTMLInputElement>(null);
    const [localSearch, setLocalSearch] = useState(searchFilters.query || '');

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchFilters(prev => ({ ...prev, query: localSearch }));
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, setSearchFilters]);

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

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-black text-white px-8 py-20 mb-20 border-b-8 border-white/20">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-8 text-left">
                            <div className="flex items-center gap-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold italic tracking-widest leading-none">
                                    <Globe className="h-3.5 w-3.5" />
                                    Community
                                </div>
                            </div>
                            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] uppercase">
                                Explore <br />Global <br /><span className="underline decoration-8 underline-offset-8 text-blue-600">Knowledge.</span>
                            </h1>
                            <p className="text-xl font-bold italic max-w-xl leading-tight opacity-70">
                                Discover high-performance code snippets shared by the engineering community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-16">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                        <Input
                            ref={searchInputRef}
                            placeholder="Search community snippets..."
                            className="h-20 pl-16 rounded-none border-b-4 border-black dark:border-white bg-transparent text-xl font-bold italic tracking-widest focus:ring-0 placeholder:opacity-40"
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
                <div className="flex items-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                    <div className="text-[10px] font-black italic uppercase tracking-[0.5em] opacity-60">
                        master your <span className="text-blue-600">craft.</span>
                    </div>
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                </div>

                {/* Snippets Grid */}
                {isLoading && exploreSnippets.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : exploreSnippets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {exploreSnippets.map((snippet: Snippet) => (
                            <SnippetCard
                                key={snippet.id}
                                snippet={snippet}
                                isExploreMode={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center border-4 border-dashed border-black/10 dark:border-white/10">
                        <Globe className="h-20 w-20 mx-auto opacity-10 mb-8" />
                        <h3 className="text-5xl font-black italic uppercase mb-4">No Public Assets</h3>
                        <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.5em]">The community library is currently empty</p>
                    </div>
                )}
            </div>
        </div >
    );
}
