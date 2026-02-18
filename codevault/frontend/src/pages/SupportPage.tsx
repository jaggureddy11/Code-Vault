import { Heart, Zap, Star, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SupportPage() {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleRating = (score: number) => setRating(score);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-24 space-y-8">
                    <div className="bg-black dark:bg-white w-20 h-20 flex items-center justify-center mx-auto mb-10 transition-transform hover:scale-110">
                        <Heart className="h-10 w-10 text-white dark:text-black fill-current" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase italic tracking-widest leading-none">
                        <Zap className="h-3 w-3" />
                        COMMUNITY_SUPPORT
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
                        SUPPORT_THE_<br /><span className="underline decoration-8 underline-offset-8 text-red-600">MISSION.</span>
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
                                WRITE_ANOTHER
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter inline-flex items-center gap-3">
                                    <Star className="h-6 w-6 fill-red-600 text-red-600" /> RATE_EXPERIENCE
                                </h3>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => handleRating(num)}
                                            className={`w-16 h-16 border-4 border-black dark:border-white text-2xl font-black transition-all ${rating >= num ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter inline-flex items-center gap-3">
                                    <MessageSquare className="h-6 w-6" /> DATA_INTEL (REVIEW)
                                </h3>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="HOW CAN WE IMPROVE THE PROTOCOL?"
                                    className="w-full h-40 bg-neutral-50 dark:bg-neutral-900 border-4 border-black dark:border-white p-6 text-xl font-black italic uppercase tracking-tighter focus:outline-none focus:border-red-600 transition-colors"
                                />
                            </div>

                            <Button type="submit" disabled={!rating || !review} className="adidas-button w-full h-24 text-3xl">
                                <Send className="h-8 w-8 stroke-[3px]" /> TRANSMIT_REVIEW
                            </Button>
                        </form>
                    )}
                </div>

                {/* GitHub Donation / Support Link */}
                <div className="bg-black text-white dark:bg-white dark:text-black p-12 text-center space-y-8">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">EXTERNAL_SUPPORT</h3>
                    <p className="font-bold uppercase opacity-60 italic">IF YOU'D LIKE TO DONATE TO THE INFRASTRUCTURE COSTS:</p>
                    <div className="flex justify-center gap-6">
                        <a href="https://github.com/sponsors/jaggureddy11" target="_blank" rel="noreferrer">
                            <Button className="adidas-button bg-red-600 text-white hover:bg-red-700 h-16 px-10 text-xl border-none">
                                SPONSOR_ON_GITHUB
                            </Button>
                        </a>
                    </div>
                </div>

                <div className="mt-20 text-center text-[10px] font-black uppercase tracking-[0.5em] italic opacity-40">
                    CODEVAULT // BUILT_BY_DEVELOPERS_FOR_DEVELOPERS
                </div>
            </div>
        </div>
    );
}
