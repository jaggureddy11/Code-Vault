import { Heart, Zap, Star, MessageSquare, Send, User, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface Review {
    id: string;
    rating: number;
    content: string;
    created_at: string;
    profiles?: {
        username: string;
        avatar_url: string;
    };
}

export default function SupportPage() {
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [fetching, setFetching] = useState(true);
    const [showHearts, setShowHearts] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    id,
                    rating,
                    content,
                    created_at,
                    profiles:user_id (
                        username,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map the data to handle cases where profiles might be returned as an array
            const formattedReviews = (data as any[]).map(r => ({
                ...r,
                profiles: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
            }));

            setReviews(formattedReviews);
        } catch (error: any) {
            console.error('Error fetching reviews:', error.message);
        } finally {
            setFetching(false);
        }
    };

    const handleRating = (score: number) => {
        setRating(score);
        if (score === 5) {
            setShowHearts(true);
            setTimeout(() => setShowHearts(false), 3000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Authentication required",
                    description: "Please log in to submit a review.",
                    variant: "destructive",
                });
                return;
            }

            const { error } = await supabase
                .from('reviews')
                .insert([
                    {
                        user_id: user.id,
                        rating,
                        content: review
                    }
                ]);

            if (error) throw error;

            setSubmitted(true);
            setRating(0);
            setReview('');
            fetchReviews(); // Refresh list

            toast({
                title: "Review submitted",
                description: "Thank you for your feedback!",
            });
        } catch (error: any) {
            toast({
                title: "Error submitting review",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden">
            {/* Heart Blast Animation */}
            {showHearts && (
                <div className="fixed inset-0 pointer-events-none z-[100]">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-heart-blast"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
                                '--tx': `${(Math.random() - 0.5) * 400}px`,
                                '--ty': `${(Math.random() - 0.5) * 400}px`,
                                animationDelay: `${Math.random() * 0.5}s`
                            } as any}
                        >
                            <Heart className="text-red-600 fill-red-600 w-8 h-8 opacity-0 animate-heart-fade" />
                        </div>
                    ))}
                </div>
            )}
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-24 space-y-8">
                    <div className="bg-black dark:bg-white w-20 h-20 flex items-center justify-center mx-auto mb-10 transition-transform hover:scale-110">
                        <Heart className="h-10 w-10 text-white dark:text-black fill-current" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase italic tracking-widest leading-none">
                        <Zap className="h-3 w-3" />
                        COMMUNITY SUPPORT
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
                        SUPPORT THE<br /><span className="underline decoration-8 underline-offset-8 text-red-600">MISSION.</span>
                    </h1>
                    <p className="text-xl font-bold uppercase italic opacity-60">
                        CODEVAULT IS BUILT BY DEVELOPERS, FOR DEVELOPERS. YOUR FEEDBACK AND SUPPORT KEEP US AGILE.
                    </p>
                </div>

                {/* Rating & Review Section */}
                <div className="border-8 border-black dark:border-white p-12 mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-full opacity-5 pointer-events-none">
                        <div className="h-full w-full stripe-bg" />
                    </div>

                    {submitted ? (
                        <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                            <h3 className="text-4xl font-black italic uppercase italic tracking-tighter">REVIEW_RECEIVED.</h3>
                            <p className="text-sm font-bold uppercase opacity-60 mt-4">THANKS FOR STRENGTHENING THE GRID.</p>
                            <Button onClick={() => setSubmitted(false)} className="adidas-button mt-8 h-16 px-10 text-xl">
                                WRITE ANOTHER
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter inline-flex items-center gap-3">
                                    <Star className="h-6 w-6 fill-red-600 text-red-600" /> RATE EXPERIENCE
                                </h3>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            disabled={loading}
                                            onClick={() => handleRating(num)}
                                            className={`w-12 h-12 md:w-16 md:h-16 border-4 border-black dark:border-white text-2xl font-black transition-all ${rating >= num ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter inline-flex items-center gap-3">
                                    <MessageSquare className="h-6 w-6" /> WRITE A REVIEW
                                </h3>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    disabled={loading}
                                    placeholder="HOW CAN WE IMPROVE THE PROTOCOL?"
                                    className="w-full h-40 bg-neutral-50 dark:bg-neutral-900 border-4 border-black dark:border-white p-6 text-xl font-black italic uppercase tracking-tighter focus:outline-none focus:border-red-600 transition-colors"
                                />
                            </div>

                            <Button type="submit" disabled={!rating || !review || loading} className="adidas-button w-full h-24 text-3xl">
                                {loading ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="h-8 w-8 stroke-[3px]" /> SUBMIT REVIEW
                                    </>
                                )}
                            </Button>
                        </form>
                    )}
                </div>

                {/* Display Reviews Section */}
                <div className="mb-20 space-y-10">
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase border-b-8 border-black dark:border-white pb-4">
                        REVIEWS
                    </h2>

                    {fetching ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin opacity-20" />
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8">
                            {reviews.map((item) => (
                                <div key={item.id} className="border-4 border-black dark:border-white p-8 space-y-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-none border-2 border-black dark:border-white overflow-hidden">
                                                {item.profiles?.avatar_url ? (
                                                    <img src={item.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="h-6 w-6 opacity-30" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black italic uppercase tracking-tighter">{item.profiles?.username || 'ANONYMOUS_DEV'}</p>
                                                <div className="flex items-center gap-2 opacity-40 text-[10px] font-black italic">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(item.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < item.rating ? 'fill-red-600 text-red-600' : 'opacity-10'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-lg font-bold uppercase italic opacity-80 leading-tight">
                                        "{item.content}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-4 border-dashed border-neutral-200 dark:border-neutral-800">
                            <p className="text-sm font-black italic uppercase opacity-30">NO INTEL RECORDS FOUND. BE THE FIRST TO REVIEW.</p>
                        </div>
                    )}
                </div>

                {/* GitHub Donation / Support Link */}
                <div className="bg-black text-white dark:bg-white dark:text-black p-12 text-center space-y-8">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">EXTERNAL SUPPORT</h3>
                    <p className="font-bold uppercase opacity-60 italic">SUPPORT THE PROJECT BY STARRING THE REPO:</p>
                    <div className="flex justify-center gap-6">
                        <a href="https://github.com/jaggureddy11/Code-Vault" target="_blank" rel="noreferrer">
                            <Button className="adidas-button bg-red-600 text-white hover:bg-red-700 h-16 px-10 text-xl border-none">
                                <Star className="h-6 w-6 mr-3 fill-current" /> STAR THE REPO
                            </Button>
                        </a>
                    </div>
                </div>

                <div className="mt-20 text-center text-[10px] font-black uppercase tracking-[0.5em] italic opacity-40">
                    CODEVAULT - BUILT BY DEVELOPERS FOR DEVELOPERS
                </div>
            </div>
        </div>
    );
}
