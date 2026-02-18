import { useState } from 'react';
import { Mail, Send, Github, Linkedin, Zap, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function ContactPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("https://formspree.io/f/mqaevekb", { // This is a placeholder, User should ideally use their own ID
                method: "POST",
                body: JSON.stringify({
                    ...data,
                    _subject: `New CodeVault Contact from ${data.name}`,
                    _replyto: data.email,
                    to: "jaggureddy0307@gmail.com"
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setSent(true);
                toast({
                    title: "Message Sent",
                    description: "The architect will receive your intel shortly.",
                });
            } else {
                throw new Error("Failed to transmit");
            }
        } catch (error) {
            toast({
                title: "Transmission Failed",
                description: "The grid is currently unstable. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const developerInfo = {
        name: "R Jagadishwar Reddy",
        email: "jaggureddy0307@gmail.com",
        github: "https://github.com/jaggureddy11",
        linkedin: "https://www.linkedin.com/in/jaggureddy/"
    };

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32 pb-20 px-4 bg-white dark:bg-black font-sans">
                <div className="text-center space-y-10 max-w-xl mx-auto border-4 border-black dark:border-white p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-full opacity-5 pointer-events-none">
                        <div className="h-full w-full stripe-bg" />
                    </div>
                    <div className="bg-black dark:bg-white w-24 h-24 flex items-center justify-center mx-auto mb-8 transition-transform hover:rotate-12">
                        <Zap className="h-12 w-12 text-white dark:text-black" />
                    </div>
                    <h1 className="text-6xl font-black italic uppercase tracking-tighter">SUCCESS.</h1>
                    <p className="text-sm font-bold uppercase italic opacity-60 leading-relaxed">
                        Message Transmitted to Developer Core. Thanks for the intel.
                    </p>
                    <Button onClick={() => setSent(false)} className="adidas-button w-full h-16 text-xl">
                        Send Another Packet
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-32 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase italic tracking-widest leading-none">
                        <Zap className="h-3 w-3" />
                        Direct Access
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none uppercase">
                        Connect with <br /><span className="underline decoration-8 underline-offset-8">the Dev.</span>
                    </h1>
                    <p className="text-xl font-bold max-w-2xl mx-auto uppercase italic opacity-60">
                        CodeVault is built by developers, for developers. Reach out directly to the architect.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Dev Info Column */}
                    <div className="space-y-12">
                        <div className="border-8 border-black dark:border-white p-12 bg-neutral-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-full opacity-10 pointer-events-none">
                                <div className="h-full w-full stripe-bg invert" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Lead Developer</p>
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-8">{developerInfo.name}</h2>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <Mail className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <a href={`mailto:${developerInfo.email}`} className="text-xl font-bold uppercase italic hover:underline">{developerInfo.email}</a>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <Linkedin className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <a href={developerInfo.linkedin} target="_blank" rel="noreferrer" className="text-xl font-bold uppercase italic hover:underline inline-flex items-center gap-2">
                                        LinkedIn <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <Github className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <a href={developerInfo.github} target="_blank" rel="noreferrer" className="text-xl font-bold uppercase italic hover:underline inline-flex items-center gap-2">
                                        GitHub <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="p-12 border-4 border-black dark:border-white space-y-6">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Project Agenda</h3>
                            <p className="text-sm font-bold uppercase opacity-60 leading-relaxed italic">
                                CodeVault is an evolving platform. We are committed to semantic versioning and transparent development.
                                Bug reports and feature requests are the backbone of our grid.
                            </p>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="bg-white dark:bg-black p-12 border-4 border-black dark:border-white">
                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            <div className="space-y-2 group">
                                <label htmlFor="name" className="text-[10px] font-black uppercase italic tracking-widest opacity-50">Identity Protocol</label>
                                <input id="name" name="name" required className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-xl font-black italic tracking-tighter focus:outline-none focus:border-red-600 transition-colors" placeholder="Enter Name" />
                            </div>
                            <div className="space-y-2 group">
                                <label htmlFor="email" className="text-[10px] font-black uppercase italic tracking-widest opacity-50">Email Endpoint</label>
                                <input id="email" name="email" type="email" required className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-xl font-black italic tracking-tighter focus:outline-none focus:border-red-600 transition-colors" placeholder="user@domain.com" />
                            </div>
                            <div className="space-y-2 group">
                                <label htmlFor="message" className="text-[10px] font-black uppercase italic tracking-widest opacity-50">Data Payload</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-black dark:border-white p-6 text-xl font-black italic uppercase tracking-tighter focus:outline-none focus:border-red-600 transition-colors min-h-[160px]"
                                    placeholder="Transmit your thoughts..."
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="adidas-button w-full h-24 text-3xl">
                                {loading ? (
                                    <Loader2 className="h-10 w-10 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="h-8 w-8 stroke-[3px]" />
                                        Transmit Data
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
