import { Zap, Code2, ArrowUpRight, Folder, Youtube, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-neutral-900 text-white py-32 px-8 md:px-16 border-b-8 border-black mb-20">
                    <div className="absolute top-0 right-0 w-32 h-full opacity-10 pointer-events-none">
                        <div className="h-full w-full stripe-bg invert" />
                    </div>

                    <div className="relative z-10 max-w-4xl space-y-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black text-[10px] font-black uppercase italic tracking-widest leading-none">
                            <Zap className="h-3 w-3" />
                            THE MISSION
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.8] uppercase">
                            CODEVAULT IS <br />BUILT BY <br /><span className="underline decoration-8 underline-offset-8">DEVELOPERS</span>,<br /> FOR DEVELOPERS.
                        </h1>
                        <p className="text-xl font-bold max-w-2xl leading-tight uppercase opacity-70 italic">
                            CODEVAULT IS A HIGH-PERFORMANCE, AI-POWERED CODE SNIPPET LIBRARY DESIGNED TO ELIMINATE REDUNDANT SEARCHES AND ACCELERATE DEVELOPMENT WORKFLOWS.
                        </p>
                    </div>
                </div>

                {/* Core Agenda Section */}
                <div className="mb-32">
                    <div className="space-y-16">
                        <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase border-l-8 border-black dark:border-white pl-8">
                            THE AGENDA:<br />ELIMINATE FRICTION.
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            {/* CodeVault */}
                            <div className="space-y-6 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-black dark:bg-white flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12">
                                        <Code2 className="h-8 w-8 text-white dark:text-black" />
                                    </div>
                                    <h4 className="text-3xl font-black italic uppercase italic tracking-tighter">VAULT ENGINE</h4>
                                </div>
                                <p className="text-lg font-bold uppercase opacity-60 italic leading-snug">
                                    CODEVAULT IS THE CORE OF OUR GRID. IT'S A HIGH-PERFORMANCE LIBRARY THAT USES GOOGLE'S GEN-AI TO AUTOMATICALLY CATEGORIZE AND TAG YOUR CODE SNIPPETS. NO MORE SCROLLING THROUGH ENDLESS FILES—INSTANTLY RETRIEVE LOGIC PACKETS ACROSS 100+ LANGUAGES WITH FULL SYNTAX HIGHLIGHTING AND MONACO EDITOR SUPPORT.
                                </p>
                            </div>

                            {/* Projects */}
                            <div className="space-y-6 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-black dark:bg-white flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12">
                                        <Folder className="h-8 w-8 text-white dark:text-black" />
                                    </div>
                                    <h4 className="text-3xl font-black italic uppercase italic tracking-tighter">PROJECT EXPLORER</h4>
                                </div>
                                <p className="text-lg font-bold uppercase opacity-60 italic leading-snug">
                                    ORGANIZE YOUR ARCHITECTURE BY SYSTEM ARCHETYPES. OUR PROJECT EXPLORER ALLOWS YOU TO GROUP RELATED SNIPPETS, ASSETS, AND DOCUMENTATION INTO STANDALONE MODULES. MANAGE YOUR ENTIRE STACK'S INTELLECTUAL PROPERTY IN ONE CENTRALIZED HUB, PROTECTED BY SUPABASE ROW-LEVEL SECURITY.
                                </p>
                            </div>

                            {/* Learn */}
                            <div className="space-y-6 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-black dark:bg-white flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12">
                                        <Youtube className="h-8 w-8 text-white dark:text-black" />
                                    </div>
                                    <h4 className="text-3xl font-black italic uppercase italic tracking-tighter">LEARNING ZONE</h4>
                                </div>
                                <p className="text-lg font-bold uppercase opacity-60 italic leading-snug">
                                    STAY OPTIMIZED WITH OUR INTEGRATED LEARNING ZONE. SEARCH AND SYNC TUTORIALS DIRECTLY FROM YOUTUBE WITHOUT LEAVING THE VAULT. WE AUTOMATICALLY TRACK YOUR RECENTLY VIEWED INTEL, CREATING A SEAMLESS KNOWLEDGE TRANSITION FROM WATCHING TO IMPLEMENTING CODE IN REAL-TIME.
                                </p>
                            </div>

                            {/* Notes */}
                            <div className="space-y-6 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-black dark:bg-white flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12">
                                        <FileText className="h-8 w-8 text-white dark:text-black" />
                                    </div>
                                    <h4 className="text-3xl font-black italic uppercase italic tracking-tighter">DOCUMENT VAULT</h4>
                                </div>
                                <p className="text-lg font-bold uppercase opacity-60 italic leading-snug">
                                    BEYOND CODE, WE SECURE YOUR DOCUMENTATION. THE DOCUMENT VAULT FEATURES FULL PDF UPLOAD SUPPORT AND A PERSISTENT TEXT EDITOR. ATTACH SPECIFICATIONS, DIAGRAMS, AND INTERNAL REVIEWS DIRECTLY TO YOUR WORKSPACE, ENSURING THAT THE CONTEXT OF YOUR CODE IS NEVER LOST ON THE GRID.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Call to Action */}
                <div className="bg-neutral-100 dark:bg-neutral-900 p-16 border-l-8 border-black dark:border-white text-center md:text-left">
                    <div className="space-y-8 max-w-4xl">
                        <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">START YOUR VAULT TODAY.</h3>
                        <p className="text-lg font-bold uppercase italic opacity-60">OWN YOUR CODE. SPEED UP YOUR BUILD. JOIN THE GLOBAL GRID OF PRODUCTIVE DEVELOPERS.</p>
                        <Link to="/signup">
                            <Button className="adidas-button h-20 px-12 text-2xl bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 border-none inline-flex gap-4">
                                BEGIN  <ArrowUpRight className="h-6 w-6 stroke-[3px]" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
