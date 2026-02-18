import { Zap, Shield, Code2, ArrowUpRight, Cpu } from 'lucide-react';
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
                            THE_MISSION
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
                    <div className="space-y-12">
                        <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                            THE_AGENDA:<br />ELIMINATE_FRICTION.
                        </h2>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center shrink-0">
                                    <Cpu className="h-6 w-6 text-white dark:text-black" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black italic uppercase italic">AI_POWERED_CATEGORIZATION</h4>
                                    <p className="text-sm font-bold uppercase opacity-60 italic leading-relaxed">INSTANTLY ORGANIZE YOUR SNIPPETS USING GEN-AI TECHNOLOGY FOR SMARTER SEARCH AND RETRIEVAL.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center shrink-0">
                                    <Shield className="h-6 w-6 text-white dark:text-black" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black italic uppercase italic">SECURE_STORAGE</h4>
                                    <p className="text-sm font-bold uppercase opacity-60 italic leading-relaxed">YOUR CODE IS YOUR INTELLECTUAL PROPERTY. PROTECTED BY SUPABASE ROW-LEVEL SECURITY AND ENCRYPTED CONNECTIONS.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center shrink-0">
                                    <Code2 className="h-6 w-6 text-white dark:text-black" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black italic uppercase italic">MULTI_LANG_SUPPORT</h4>
                                    <p className="text-sm font-bold uppercase opacity-60 italic leading-relaxed">FROM PYTHON TO RUST, WE SUPPORT 100+ LANGUAGES WITH FULL SYNTAX HIGHLIGHTING AND MONACO EDITOR SUPPORT.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative border-4 border-black dark:border-white p-4">
                        <img
                            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"
                            className="w-full grayscale brightness-75 transition-all hover:grayscale-0"
                            alt="Code Interface"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-black dark:bg-white text-white dark:text-black px-10 py-6 font-black italic uppercase tracking-tighter text-2xl">
                            v1.0.LAUNCH
                        </div>
                    </div>
                </div>

                {/* Final Call to Action */}
                <div className="bg-neutral-100 dark:bg-neutral-900 p-16 border-l-8 border-black dark:border-white text-center md:text-left">
                    <div className="space-y-8 max-w-4xl">
                        <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">START_YOUR_VAULT_TODAY.</h3>
                        <p className="text-lg font-bold uppercase italic opacity-60">OWN YOUR CODE. SPEED UP YOUR BUILD. JOIN THE GLOBAL GRID OF PRODUCTIVE DEVELOPERS.</p>
                        <Link to="/signup">
                            <Button className="adidas-button h-20 px-12 text-2xl bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 border-none inline-flex gap-4">
                                INITIALIZE_ACCOUNT <ArrowUpRight className="h-6 w-6 stroke-[3px]" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
