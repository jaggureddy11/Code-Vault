import { useState } from 'react';
import { Mail, Send, Github, Linkedin, Zap, ExternalLink, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
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
                        MESSAGE_TRANSMITTED_TO_DEVELOPER_CORE. THANKS FOR THE INTEL.
                    </p>
                    <Button onClick={() => setSent(false)} className="adidas-button w-full h-16 text-xl">
                        SEND_ANOTHER_PACKET
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
                        DIRECT_ACCESS
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none uppercase">
                        CONNECT_WITH_<br /><span className="underline decoration-8 underline-offset-8">THE_DEV.</span>
                    </h1>
                    <p className="text-xl font-bold max-w-2xl mx-auto uppercase italic opacity-60">
                        CODEVAULT IS BUILT BY DEVELOPERS, FOR DEVELOPERS. REACH OUT DIRECTLY TO THE ARCHITECT.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Dev Info Column */}
                    <div className="space-y-12">
                        <div className="border-8 border-black dark:border-white p-12 bg-neutral-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-full opacity-10 pointer-events-none">
                                <div className="h-full w-full stripe-bg invert" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">LEAD_DEVELOPER</p>
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-8">{developerInfo.name}</h2>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <Mail className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <a href={`mailto:${developerInfo.email}`} className="text-xl font-bold uppercase italic hover:underline">{developerInfo.email}</a>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <Linkedin className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <a href={developerInfo.linkedin} target="_blank" rel="noreferrer" className="text-xl font-bold uppercase italic hover:underline inline-flex items-center gap-2">
                                        LINKEDIN <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <Github className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <a href={developerInfo.github} target="_blank" rel="noreferrer" className="text-xl font-bold uppercase italic hover:underline inline-flex items-center gap-2">
                                        GITHUB <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="p-12 border-4 border-black dark:border-white space-y-6">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">PROJECT_AGENDA</h3>
                            <p className="text-sm font-bold uppercase opacity-60 leading-relaxed italic">
                                CODEVAULT IS AN EVOLVING PLATFORM. WE ARE COMMITTED TO SEMANTIC VERSIONING AND TRANSPARENT DEVELOPMENT.
                                BUG REPORTS AND FEATURE REQUESTS ARE THE BACKBONE OF OUR GRID.
                            </p>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="bg-white dark:bg-black p-12 border-4 border-black dark:border-white">
                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            <div className="space-y-2 group">
                                <label htmlFor="name" className="text-[10px] font-black uppercase italic tracking-widest opacity-50">IDENTITY_PROTOCOL</label>
                                <input id="name" required className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-xl font-black italic uppercase tracking-tighter focus:outline-none focus:border-red-600 transition-colors" placeholder="ENTER_NAME" />
                            </div>
                            <div className="space-y-2 group">
                                <label htmlFor="email" className="text-[10px] font-black uppercase italic tracking-widest opacity-50">EMAIL_ENDPOINT</label>
                                <input id="email" type="email" required className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-xl font-black italic uppercase tracking-tighter focus:outline-none focus:border-red-600 transition-colors" placeholder="USER@DOMAIN.COM" />
                            </div>
                            <div className="space-y-2 group">
                                <label htmlFor="message" className="text-[10px] font-black uppercase italic tracking-widest opacity-50">DATA_PAYLOAD</label>
                                <textarea
                                    id="message"
                                    required
                                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-black dark:border-white p-6 text-xl font-black italic uppercase tracking-tighter focus:outline-none focus:border-red-600 transition-colors min-h-[160px]"
                                    placeholder="TRANSMIT_YOUR_THOUGHTS..."
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="adidas-button w-full h-24 text-3xl">
                                {loading ? (
                                    <Activity className="h-10 w-10 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="h-8 w-8 stroke-[3px]" />
                                        TRANSMIT_DATA
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
