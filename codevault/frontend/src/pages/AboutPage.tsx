import { Code2, Folder, Youtube, FileText, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-neutral-900 text-white py-28 px-8 md:px-16 border-b-8 border-black mb-24">
                    <div className="relative z-10 max-w-4xl space-y-10">
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase">
                            CodeVault is built <br />
                            by developers,<br />
                            <span className="underline decoration-8">for developers</span>.
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
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase border-l-8 border-black dark:border-white pl-8">
                        The agenda<br />is simple.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">

                        {/* Vault Engine */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center">
                                    <Code2 className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    Vault Engine
                                </h4>
                            </div>
                            <p className="text-base font-medium opacity-70 leading-relaxed max-w-xl">
                                Store and retrieve code snippets instantly. CodeVault uses AI to
                                automatically tag and categorize your snippets, making reuse
                                effortless across languages inside a powerful editor.
                            </p>
                        </div>

                        {/* Project Explorer */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center">
                                    <Folder className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    Project Explorer
                                </h4>
                            </div>
                            <p className="text-base font-medium opacity-70 leading-relaxed max-w-xl">
                                Organize snippets, assets, and documentation into structured
                                project modules. Keep your architecture clean, searchable, and
                                securely managed.
                            </p>
                        </div>

                        {/* Learning Zone */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center">
                                    <Youtube className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    Learning Zone
                                </h4>
                            </div>
                            <p className="text-base font-medium opacity-70 leading-relaxed max-w-xl">
                                Learn without breaking flow. Discover relevant tutorials directly
                                inside CodeVault and move seamlessly from learning to
                                implementation.
                            </p>
                        </div>

                        {/* Document Vault */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black dark:bg-white flex items-center justify-center">
                                    <FileText className="h-7 w-7 text-white dark:text-black" />
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tight">
                                    Document Vault
                                </h4>
                            </div>
                            <p className="text-base font-medium opacity-70 leading-relaxed max-w-xl">
                                Upload PDFs, write notes, and attach documentation alongside your
                                code. Keep technical context, decisions, and references in one
                                place.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-neutral-100 dark:bg-neutral-900 p-16 border-l-8 border-black dark:border-white">
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
