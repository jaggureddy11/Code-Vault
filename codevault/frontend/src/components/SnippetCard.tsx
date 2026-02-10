import { Snippet } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Copy, Trash2, Calendar, ArrowUpRight, Heart, Loader2, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useSnippets } from '@/hooks/useSnippets';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'NOW';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}M AGO`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}H AGO`;
    return date.toLocaleDateString();
}

interface SnippetCardProps {
    snippet: Snippet;
    onDelete?: (id: string) => void;
    isExploreMode?: boolean;
}

export default function SnippetCard({ snippet, onDelete, isExploreMode }: SnippetCardProps) {
    const { toast } = useToast();
    const { user } = useAuth();
    const { toggleFavorite } = useSnippets();
    const [isUpdating, setIsUpdating] = useState(false);

    const isOwner = user?.id === snippet.user_id;

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOwner) return;

        setIsUpdating(true);
        try {
            await toggleFavorite({ id: snippet.id, is_favorite: !snippet.is_favorite });
            toast({
                title: !snippet.is_favorite ? 'Added to Favorites' : 'Removed from Favorites',
                description: `Snippet "${snippet.title}" has been updated.`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update favorite status.',
                variant: 'destructive',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const copyToClipboard = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(snippet.code);
        toast({
            title: 'Copied',
            description: 'Code copied to clipboard.',
        });
    };

    return (
        <Card className="rounded-none bg-white dark:bg-black border border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white transition-all duration-300 group flex flex-col h-full overflow-hidden">
            <CardHeader className="pb-4 relative pt-10 px-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 text-[8px] font-bold italic tracking-widest uppercase">
                        {snippet.language}
                    </div>
                    {!isOwner && (
                        <div className="flex items-center gap-1 text-[8px] font-black italic text-red-600 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 border border-red-200 dark:border-red-900/50">
                            <User className="h-2 w-2" /> View Only
                        </div>
                    )}
                </div>

                <CardTitle className="text-2xl font-black italic tracking-tight line-clamp-1 mb-2 uppercase">
                    {snippet.title}
                </CardTitle>

                {snippet.description && (
                    <CardDescription className="line-clamp-2 text-[10px] font-medium opacity-60 italic leading-tight">
                        {snippet.description}
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent className="flex-1 px-8 pb-6">
                <div className="bg-neutral-50 dark:bg-neutral-900 p-6 max-h-40 overflow-hidden relative border border-transparent group-hover:border-black/5 dark:group-hover:border-white/5 transition-all">
                    <pre className="text-xs font-mono leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity overflow-hidden whitespace-pre-wrap">
                        {snippet.code.slice(0, 500)}
                    </pre>
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-50 dark:from-neutral-900 to-transparent"></div>
                </div>

                {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-6">
                        {snippet.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="text-[8px] font-bold italic tracking-widest bg-neutral-100 dark:bg-neutral-800 px-2 py-1 uppercase"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="px-8 py-6 border-t border-black/5 dark:border-white/5 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-950/50">
                <div className="flex items-center gap-4 text-[8px] font-bold opacity-40 uppercase italic tracking-widest">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {formatRelativeTime(snippet.updated_at)}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isOwner && !isExploreMode && (
                        <button
                            onClick={handleToggleFavorite}
                            disabled={isUpdating}
                            className={cn(
                                "hover:scale-110 transition-transform",
                                snippet.is_favorite ? "text-red-500" : "text-neutral-400"
                            )}
                        >
                            {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Heart className={cn("h-4 w-4", snippet.is_favorite && "fill-current")} />
                            )}
                        </button>
                    )}
                    <button onClick={copyToClipboard} className="hover:scale-110 transition-transform" title="Copy code">
                        <Copy className="h-4 w-4" />
                    </button>
                    <Link to={`/snippet/${snippet.id}`} className="group/link flex items-center gap-1 text-[10px] font-black italic uppercase tracking-widest hover:underline">
                        Open <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                    {isOwner && !isExploreMode && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete?.(snippet.id);
                            }}
                            className="text-neutral-400 hover:text-red-500 hover:scale-110 transition-transform"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
