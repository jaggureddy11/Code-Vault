import { useState, useEffect, useRef } from 'react';
import { Search, Star, Eye, TrendingUp, Clock, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLearning } from '@/hooks/useLearning';
import { Video } from '@/types';
import { fetchJson, getApiBaseUrl } from '@/lib/utils';

const SUGGESTED_VIDEOS: Video[] = [
    {
        id: 'eIrMbAQSU34',
        title: 'Java Full Course for Beginners',
        thumbnail: 'https://img.youtube.com/vi/eIrMbAQSU34/maxresdefault.jpg',
        channel: 'Programming with Mosh',
        duration: '2:30:47',
        views: '13M',
        likes: '450K',
        description: '',
        category: 'Backend'
    },
    {
        id: '_uQrJ0TkZlc',
        title: 'Python Full Course for Beginners',
        thumbnail: 'https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg',
        channel: 'Programming with Mosh',
        duration: '6:14:07',
        views: '46M',
        likes: '1.2M',
        description: '',
        category: 'Data Science'
    },
    {
        id: 'Ez8F0nW6S-w',
        title: 'Complete Git and GitHub Tutorial',
        thumbnail: 'https://img.youtube.com/vi/Ez8F0nW6S-w/maxresdefault.jpg',
        channel: 'Apna College',
        duration: '1:14:17',
        views: '6.4M',
        likes: '280K',
        description: '',
        category: 'DevOps'
    },
    {
        id: '7S_tz1z_5bA',
        title: 'SQL Course for Beginners [Full Course]',
        thumbnail: 'https://img.youtube.com/vi/7S_tz1z_5bA/maxresdefault.jpg',
        channel: 'Programming with Mosh',
        duration: '3:10:19',
        views: '14M',
        likes: '500K',
        description: '',
        category: 'Database'
    },
    {
        id: 'exmSJpJvIPs',
        title: 'Docker Tutorial for beginners - One Shot',
        thumbnail: 'https://img.youtube.com/vi/exmSJpJvIPs/maxresdefault.jpg',
        channel: 'Apna College',
        duration: '2:06:05',
        views: '1M',
        likes: '85K',
        description: '',
        category: 'Cloud'
    },
    {
        id: 'pkYVOmU3MgA',
        title: 'DSA in Python - Full Course',
        thumbnail: 'https://img.youtube.com/vi/pkYVOmU3MgA/maxresdefault.jpg',
        channel: 'freeCodeCamp.org',
        duration: '12:30:49',
        views: '3.1M',
        likes: '150K',
        description: '',
        category: 'Algorithms'
    }
];

export default function LearningZone() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [searchResults, setSearchResults] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const scrollToContent = () => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const { recentlyViewed, saveVideoSession, deleteRecentlyViewed, isDeletingRecent } = useLearning();

    // Restore session on load ONLY if user has a history
    useEffect(() => {
        if (!selectedVideo && recentlyViewed.length > 0) {
            setSelectedVideo(recentlyViewed[0]);
        }
    }, [recentlyViewed, selectedVideo]);

    const handleVideoSelect = (video: Video) => {
        setSelectedVideo(video);
        saveVideoSession(video);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setHasSearched(true);

        try {
            const base = getApiBaseUrl();
            const url = `${base}/api/youtube/search?q=${encodeURIComponent(searchQuery)}`;
            const data = await fetchJson<Video[]>(url, { timeoutMs: 15000 });
            setSearchResults(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.error('Search error:', error);
            // Fallback to simulation if backend fails (e.g. key missing)
            const queryLower = searchQuery.toLowerCase();
            const filtered = SUGGESTED_VIDEOS.filter(v =>
                v.title.toLowerCase().includes(queryLower) ||
                v.category?.toLowerCase().includes(queryLower) ||
                v.channel.toLowerCase().includes(queryLower)
            );

            if (filtered.length === 0) {
                setSearchResults([{
                    id: 'SqcY0GlETPk',
                    title: `${searchQuery.toUpperCase()} | TOP VIEWED MASTERCLASS 2025`,
                    thumbnail: 'https://i.ytimg.com/vi/SqcY0GlETPk/maxresdefault.jpg',
                    channel: 'Global Tech Academy',
                    duration: '8:24:00',
                    views: '15M',
                    likes: '950K',
                    description: ''
                }]);
            } else {
                setSearchResults(filtered);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">

                {/* Hero Section */}
                <div className="relative mb-20 overflow-hidden bg-black text-white px-8 py-20 border-b-8 border-white/20">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-8 text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black text-[10px] font-bold italic tracking-widest uppercase">
                                <TrendingUp className="h-3 w-3" />
                                Featured Courses
                            </div>

                            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] uppercase">
                                Level <br />Up your <br /><span className="underline decoration-8 underline-offset-8 text-amber-500">Craft.</span>
                            </h1>
                            <p className="text-xl font-bold italic max-w-xl leading-tight opacity-70">
                                Deep-dive engineering tutorials and performance masterclasses.
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

                {/* Search Bar Section */}
                <div className="mb-16" ref={contentRef}>
                    <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                        <Input
                            placeholder="Search for tutorials (e.g. React, Python)"
                            className="h-20 pl-16 rounded-none border-b-4 border-black dark:border-white bg-transparent text-xl font-bold italic tracking-widest placeholder:opacity-40 focus:ring-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-14 px-8 rounded-none bg-black dark:bg-white text-white dark:text-black font-black italic uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            {isLoading ? "..." : "Search"}
                        </Button>
                    </form>
                </div>

                {/* Brand Tagline */}
                <div className="flex items-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                    <div className="text-[10px] font-black italic uppercase tracking-[0.5em] opacity-60">
                        master your <span className="text-amber-500">craft.</span>
                    </div>
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                </div>

                {/* Main Selected Player */}
                {selectedVideo && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-4 border-black dark:border-white mb-20 bg-white dark:bg-black">
                        <div className="lg:col-span-8 aspect-video bg-black relative">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
                                title="Video Player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <div className="lg:col-span-4 p-8 flex flex-col justify-between border-t-4 lg:border-t-0 lg:border-l-4 border-black dark:border-white">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 fill-black dark:fill-white text-black dark:text-white" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Course Details</span>
                                </div>
                                <h2 className="text-4xl font-black italic leading-tight uppercase tracking-tight">
                                    {selectedVideo.title}
                                </h2>
                            </div>

                            <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase opacity-50">VIEWS</span>
                                    <p className="font-black text-xl italic">{selectedVideo.views}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase opacity-50">LIKES</span>
                                    <p className="font-black text-xl italic">{selectedVideo.likes}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <span className="text-[10px] font-black uppercase opacity-50">INSTRUCTOR</span>
                                    <p className="font-black text-xl italic underline">{selectedVideo.channel}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Results Display */}
                {hasSearched && (
                    <div className="mb-20">
                        <div className="flex items-center justify-between mb-8 border-b-2 border-black dark:border-white pb-4">
                            <h2 className="text-3xl font-black italic">Best results for "{searchQuery}"</h2>
                            <Button variant="ghost" onClick={() => setHasSearched(false)} className="font-bold underline text-xs">Clear</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {searchResults.map((video) => (
                                <div
                                    key={video.id}
                                    onClick={() => handleVideoSelect(video)}
                                    className="group cursor-pointer bg-white dark:bg-black border border-black dark:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all"
                                >
                                    <div className="aspect-video relative overflow-hidden bg-neutral-200">
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute bottom-2 right-2 bg-black text-white text-[10px] font-black p-1">
                                            {video.duration}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold italic line-clamp-2 mb-2 group-hover:underline">{video.title}</h3>
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase opacity-60">
                                            <span>{video.channel}</span>
                                            <span className="flex items-center gap-1 font-black text-black dark:text-white uppercase"><Eye className="h-3 w-3" /> {video.views} VIEWS</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recently Viewed Section */}
                {recentlyViewed.length > 0 && (
                    <div className="mb-20">
                        <div className="flex items-center gap-3 mb-10">
                            <Clock className="h-8 w-8 text-black dark:text-white" />
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter">Recently Viewed</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {recentlyViewed.slice(0, 4).map((video) => (
                                <div
                                    key={video.id}
                                    className="group relative border-2 border-black dark:border-white overflow-hidden bg-white dark:bg-black p-2"
                                >
                                    <div
                                        onClick={() => handleVideoSelect(video)}
                                        className="cursor-pointer"
                                    >
                                        <img src={video.thumbnail} alt={video.title} className="aspect-video object-cover mb-2 grayscale group-hover:grayscale-0 transition-all" />
                                        <h3 className="text-[10px] font-black uppercase italic line-clamp-1">{video.title}</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); deleteRecentlyViewed(video.id); }}
                                        disabled={isDeletingRecent}
                                        className="absolute top-2 right-2 p-1.5 bg-black/80 dark:bg-white/80 text-white dark:text-black hover:opacity-90 disabled:opacity-50"
                                        title="Remove from recently viewed"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-20">
                    <div className="flex items-center justify-between mb-10 border-b-2 border-black dark:border-white pb-4">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="h-8 w-8" />
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Recommended for you</h2>
                        </div>
                        <p className="text-[10px] font-black uppercase opacity-60 tracking-widest italic">Personalized Grid</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {SUGGESTED_VIDEOS.map((video) => (
                            <div
                                key={video.id}
                                onClick={() => handleVideoSelect(video)}
                                className="group cursor-pointer border-2 border-black dark:border-white bg-white dark:bg-black transition-all hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
                            >
                                <div className="aspect-video relative overflow-hidden bg-neutral-200">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110" />
                                    <div className="absolute bottom-3 right-3 bg-black text-white text-[10px] font-black px-2 py-1 italic">
                                        {video.duration}
                                    </div>
                                    <div className="absolute top-3 left-3 bg-white text-black text-[8px] font-black px-2 py-0.5 italic uppercase border border-black transform -rotate-2">
                                        {video.category}
                                    </div>
                                </div>
                                <div className="p-8 space-y-4">
                                    <h3 className="text-2xl font-black italic uppercase leading-none line-clamp-2 min-h-[3rem] group-hover:underline">
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5 text-[10px] font-bold uppercase opacity-60 italic">
                                        <div className="flex flex-col">
                                            <span className="text-black dark:text-white underline">{video.channel}</span>
                                            <span>Instructor</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="flex items-center gap-1 font-black text-black dark:text-white uppercase"><Eye className="h-3 w-3" /> {video.views}</span>
                                            <span>Total Views</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
}
