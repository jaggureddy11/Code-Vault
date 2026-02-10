import { useState, useEffect, useRef } from 'react';
import { Search, Github, Star, GitFork, ExternalLink, TrendingUp, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    owner: {
        avatar_url: string;
        login: string;
    };
}

export default function ProjectExplorer() {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState('javascript');
    const contentRef = useRef<HTMLDivElement>(null);

    const scrollToContent = () => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchTrendingRepos = async (query = '', lang = 'javascript') => {
        setLoading(true);
        try {
            const q = query ? `${query}+language:${lang}` : `language:${lang}`;
            const response = await fetch(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=12`);
            const data = await response.json();
            setRepos(data.items || []);
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrendingRepos('', language);
    }, [language]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTrendingRepos(searchQuery, language);
    };

    const languages = [
        { name: 'JavaScript', value: 'javascript' },
        { name: 'TypeScript', value: 'typescript' },
        { name: 'Python', value: 'python' },
        { name: 'React', value: 'react' },
        { name: 'Go', value: 'go' },
        { name: 'Rust', value: 'rust' },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Adidas-Style Hero - High Impact */}
                <div className="relative overflow-hidden bg-black text-white px-4 sm:px-8 py-10 sm:py-20 mb-10 sm:mb-20 border-b-8 border-white/20">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
                        <div className="flex-1 space-y-4 sm:space-y-8 text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-black text-black dark:text-white text-[10px] font-black uppercase italic tracking-widest leading-none">
                                <Github className="h-3.5 w-3.5" />
                                GitHub Explorer
                            </div>
                            <h1 className="text-4xl sm:text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] uppercase">
                                Explore <br />Open <br /><span className="underline decoration-8 underline-offset-8 text-emerald-500">Source.</span>
                            </h1>
                            <p className="text-lg sm:text-xl font-bold uppercase italic max-w-xl leading-tight opacity-70">
                                Discover popular open source projects from around the world.
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

                {/* Search & Filter Bar */}
                <div className="mb-16 space-y-12" ref={contentRef}>
                    <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                        <Input
                            placeholder="Search for projects..."
                            className="h-20 pl-16 rounded-none border-b-4 border-black dark:border-white bg-transparent text-xl font-bold italic tracking-widest focus:ring-0 placeholder:opacity-40"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-14 px-8 rounded-none bg-black dark:bg-white text-white dark:text-black font-black italic uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            {loading ? "..." : "Search"}
                        </Button>
                    </form>

                    <div className="border-y-2 border-black/10 dark:border-white/10 py-4 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center space-x-1 shrink-0">
                            {languages.map((lang) => (
                                <Button
                                    key={lang.value}
                                    variant={language === lang.value ? "default" : "ghost"}
                                    className={cn(
                                        "h-12 px-8 rounded-none font-black italic uppercase tracking-widest transition-all text-xs",
                                        language === lang.value ? "bg-black text-white dark:bg-white dark:text-black" : "hover:underline opacity-60"
                                    )}
                                    onClick={() => setLanguage(lang.value)}
                                >
                                    {lang.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Brand Tagline */}
                <div className="flex items-center gap-2 sm:gap-4 mb-10 sm:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                    <div className="text-[8px] sm:text-[10px] font-black italic uppercase tracking-[0.3em] sm:tracking-[0.5em] opacity-60">
                        master your <span className="text-emerald-500">craft.</span>
                    </div>
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                </div>

                {/* Repos Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {repos.map((repo) => (
                            <Card key={repo.id} className="rounded-none bg-white dark:bg-black border border-black/10 dark:border-white/10 transition-all duration-300 group hover:border-black dark:hover:border-white hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)] flex flex-col">
                                <CardHeader className="pb-6 relative pt-10 px-8">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="bg-black dark:bg-white p-2 rounded-none">
                                            <Github className="h-5 w-5 text-white dark:text-black" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black uppercase italic tracking-[0.3em] opacity-50">
                                                {repo.language?.toUpperCase() || 'UNKNOWN'}
                                            </span>
                                            <CardTitle className="text-xl font-black uppercase italic tracking-tight line-clamp-1">
                                                {repo.name}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    <CardDescription className="line-clamp-2 text-[10px] font-bold uppercase italic opacity-60 leading-tight h-8">
                                        {repo.description || 'No description available for this project.'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 px-8 pb-6">
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase italic tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4" />
                                            {(repo.stargazers_count / 1000).toFixed(1)}K Stars
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <GitFork className="h-4 w-4" />
                                            {(repo.forks_count / 1000).toFixed(1)}K Forks
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0 flex justify-between items-center text-[8px] font-black uppercase italic tracking-widest border-t border-black/5 dark:border-white/5 py-4 px-8 bg-neutral-50/50 dark:bg-neutral-950/50 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <button className="hover:scale-110 transition-transform text-red-500 mr-2">
                                            <Heart className="h-4 w-4 fill-red-500" />
                                        </button>
                                        <img src={repo.owner.avatar_url} className="w-6 h-6 rounded-none border border-black/10 dark:border-white/10 grayscale group-hover:grayscale-0 transition-all" alt="" />
                                        <span className="font-black opacity-60">{repo.owner.login}</span>
                                    </div>
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 hover:underline decoration-2"
                                    >
                                        View on GitHub
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {repos.length === 0 && !loading && (
                    <div className="py-40 text-center border-4 border-dashed border-black/10 dark:border-white/10">
                        <TrendingUp className="h-16 w-16 mx-auto opacity-10 mb-6" />
                        <h3 className="text-4xl font-black italic uppercase">Discovering Projects...</h3>
                        <p className="text-[10px] font-black uppercase opacity-40 mt-2 italic tracking-[0.5em]">System ready for global search</p>
                    </div>
                )}
            </div>
        </div>
    );
}
