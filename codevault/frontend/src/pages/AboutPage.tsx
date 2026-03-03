import { Code2, Compass, Youtube, StickyNote, ArrowUpRight, Globe, Terminal, Bot, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-neutral-900 text-white py-28 px-8 md:px-16 border-b-8 border-black mb-24">
                    <div className="relative z-10 max-w-4xl space-y-10">
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase animate-fade-in-up stagger-1">
                            CodeVault is built <br />
                            by developers,<br />
                            <span className="underline decoration-8 animated-gradient-text px-2">for developers</span>.
                        </h1>

                        <p className="text-lg font-medium max-w-2xl opacity-70">
                            CodeVault is an AI-powered workspace for storing, organizing, and
                            reusing code snippets — designed to reduce context switching and
                            accelerate development.
                        </p>
                    </div>
                </section>

                {/* Core Agenda */}
                <section className="mb-32 space-y-20">
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase border-l-8 border-black dark:border-white pl-8 animate-fade-in-up">
                        The agenda<br />is simple.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">

                        {/* Vault Engine */}
                        <div className="space-y-5 p-6 border-2 border-transparent hover:border-black/5 dark:hover:border-white/5 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-3xl hover-lift animate-fade-in-up stagger-1 cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center rounded-2xl shadow-md">
                                    <Code2 className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    The Vault
                                </h4>
                            </div>
                            <p className="text-sm font-medium tracking-tight opacity-80 leading-relaxed max-w-xl">
                                Your personal high-security archive for code snippets. Store, tag, and organize
                                your most valuable logic in a beautiful, searchable interface with AI-powered categorization.
                            </p>
                        </div>

                        {/* Explore Hub */}
                        <div className="space-y-5 p-6 border-2 border-transparent hover:border-black/5 dark:hover:border-white/5 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-3xl hover-lift animate-fade-in-up stagger-2 cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center rounded-2xl shadow-md">
                                    <Globe className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    Explore Hub
                                </h4>
                            </div>
                            <p className="text-sm font-medium tracking-tight opacity-80 leading-relaxed max-w-xl">
                                Step out of your local vault and into the community. Discover trending snippets,
                                learn from fellow developers, and clone the best logic directly into your collection.
                            </p>
                        </div>

                        {/* Favorites */}
                        <div className="space-y-5 p-6 border-2 border-transparent hover:border-black/5 dark:hover:border-white/5 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-3xl hover-lift animate-fade-in-up stagger-3 cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center rounded-2xl shadow-md">
                                    <Heart className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    Favorites
                                </h4>
                            </div>
                            <p className="text-sm font-medium tracking-tight opacity-80 leading-relaxed max-w-xl">
                                Keep your mission-critical logic one click away. Curate your most-loved
                                snippets into a prioritized collection for instant access during high-stakes dev work.
                            </p>
                        </div>

                        {/* Project Explorer */}
                        <div className="space-y-5 p-6 border-2 border-transparent hover:border-black/5 dark:hover:border-white/5 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-3xl hover-lift animate-fade-in-up stagger-4 cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center rounded-2xl shadow-md">
                                    <Compass className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    Project Explorer
                                </h4>
                            </div>
                            <p className="text-sm font-medium tracking-tight opacity-80 leading-relaxed max-w-xl">
                                Stay inspired by the open-source world. Discover starred GitHub repositories,
                                explore new architectures, and keep pulse on the technologies shaping the future.
                            </p>
                        </div>

                        {/* Learning Zone */}
                        <div className="space-y-5 p-6 border-2 border-transparent hover:border-black/5 dark:hover:border-white/5 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-3xl hover-lift animate-fade-in-up stagger-5 cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center rounded-2xl shadow-md">
                                    <Youtube className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    Learning Zone
                                </h4>
                            </div>
                            <p className="text-sm font-medium tracking-tight opacity-80 leading-relaxed max-w-xl">
                                Master new skills with integrated tutorials. Watch, code, and learn in a
                                unified environment designed to maximize retention and minimize distraction.
                            </p>
                        </div>

                        {/* Smart Notes */}
                        <div className="space-y-5 p-6 border-2 border-transparent hover:border-black/5 dark:hover:border-white/5 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-3xl hover-lift animate-fade-in-up stagger-6 cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center rounded-2xl shadow-md">
                                    <StickyNote className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    Smart Notes
                                </h4>
                            </div>
                            <p className="text-sm font-medium tracking-tight opacity-80 leading-relaxed max-w-xl">
                                Documentation is part of the code. Attach technical context, architectural
                                decisions, and personal study notes directly to your projects and snippets.
                            </p>
                        </div>

                        {/* Live Compiler */}
                        <div className="space-y-5 p-6 border-2 border-transparent hover:border-black/5 dark:hover:border-white/5 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-3xl hover-lift animate-fade-in-up stagger-7 cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center rounded-2xl shadow-md">
                                    <Terminal className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    Live Compiler
                                </h4>
                            </div>
                            <p className="text-sm font-medium tracking-tight opacity-80 leading-relaxed max-w-xl">
                                Execute code in real-time without leaving your browser. Our integrated multi-language
                                compiler supports Python, JS, C++, and more, allowing for instant logic validation.
                            </p>
                        </div>

                        {/* AI Assistant */}
                        <div className="space-y-5 p-6 border-2 border-transparent hover:border-black/5 dark:hover:border-white/5 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-3xl hover-lift animate-fade-in-up stagger-8 cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center rounded-2xl shadow-md">
                                    <Bot className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    AI Assistant
                                </h4>
                            </div>
                            <p className="text-sm font-medium tracking-tight opacity-80 leading-relaxed max-w-xl">
                                Meet your personal elite tutor. Built with advanced LLMs, our AI assistant
                                analyzes code, explains complex logic, and helps you debug in real-time via chat.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-neutral-100 dark:bg-neutral-900 p-16 border-l-8 border-black dark:border-white animate-fade-in-up stagger-8">
                    <div className="space-y-8 max-w-3xl">
                        <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                            Start your vault today.
                        </h3>
                        <p className="text-base font-medium opacity-60">
                            Own your code. Reduce friction. Build faster with CodeVault.
                        </p>
                        <Link to="/signup">
                            <Button className="h-16 px-10 text-xl bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 inline-flex gap-4">
                                Begin <ArrowUpRight className="h-5 w-5 stroke-[3px]" />
                            </Button>
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}
