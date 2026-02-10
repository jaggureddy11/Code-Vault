import { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, Github, Twitter, Linkedin, Activity, CheckCircle, Zap } from 'lucide-react';
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

    const contactInfo = [
        { icon: Mail, label: 'EMAIL_ENDPOINT', value: 'HELLO@CODEVAULT.PRO' },
        { icon: MessageSquare, label: 'SUPPORT_COMMUNITY', value: 'DISCORD_GLOBAL' },
        { icon: MapPin, label: 'OFFICE_NODE', value: 'SAN_FRANCISCO, CA' },
    ];

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32 pb-20 px-4 bg-white dark:bg-black font-sans">
                <div className="text-center space-y-10 max-w-xl mx-auto border-4 border-black dark:border-white p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-full opacity-5 pointer-events-none">
                        <div className="h-full w-full stripe-bg" />
                    </div>
                    <div className="bg-black dark:bg-white w-24 h-24 flex items-center justify-center mx-auto mb-8 transition-transform hover:rotate-12">
                        <CheckCircle className="h-12 w-12 text-white dark:text-black" />
                    </div>
                    <h1 className="text-6xl font-black italic uppercase italic tracking-tighter">MESSAGE_TRANSMITTED.</h1>
                    <p className="text-sm font-bold uppercase italic opacity-60 leading-relaxed">
                        THANKS FOR REACHING OUT. OUR TEAM WILL SYNCHRONIZE WITH YOUR REQUEST WITHIN 24 VAULT CYCLES.
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
                        COMMUNICATION_LINK
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none uppercase">
                        GET_IN_<br /><span className="underline decoration-8 underline-offset-8">TOUCH.</span>
                    </h1>
                    <p className="text-xl font-bold max-w-2xl mx-auto uppercase italic opacity-60">
                        FOUND A BUG? HAVE A SUGGESTION? OR JUST WANT TO SAY HI? WE'RE LISTENING TO THE GRID.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {contactInfo.map((info, i) => (
                                <div key={i} className="border-4 border-black dark:border-white p-8 space-y-6 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group">
                                    <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center group-hover:rotate-12 transition-transform">
                                        <info.icon className="h-6 w-6 text-white dark:text-black" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{info.label}</p>
                                        <p className="text-lg font-black italic uppercase tracking-tighter">{info.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-8">
                            <h3 className="text-2xl font-black italic uppercase tracking-tight">FOLLOW_THE_DEVELOPMENT</h3>
                            <div className="flex gap-4">
                                {[Github, Twitter, Linkedin].map((Icon, i) => (
                                    <button key={i} className="h-16 w-16 border-2 border-black dark:border-white flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                        <Icon className="h-6 w-6" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-12 bg-neutral-900 text-white border-l-8 border-red-600 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-full opacity-5 pointer-events-none">
                                <div className="h-full w-full stripe-bg invert" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4 italic">ENTERPRISE_INQUIRIES</p>
                            <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-6">LOOKING FOR CUSTOM VAULT SOLUTIONS FOR YOUR TEAM?</h4>
                            <Button className="adidas-button h-16 px-10 text-xl bg-white text-black hover:bg-neutral-200 border-none">
                                BOOK_A_DEMO
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-black p-12 lg:p-16 border-4 border-black dark:border-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-full opacity-5 pointer-events-none">
                            <div className="h-full w-full stripe-bg" />
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase italic tracking-widest leading-none mb-12">
                            SUPPORT_OPEN_24/7
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group">
                                    <label htmlFor="name" className="text-[10px] font-black uppercase italic tracking-widest opacity-50 group-focus-within:opacity-100 transition-opacity">NAME_PROTOCOL</label>
                                    <input id="name" required className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-xl font-black italic uppercase tracking-tighter focus:outline-none focus:border-red-600 transition-colors" placeholder="IDENTITY" />
                                </div>
                                <div className="space-y-2 group">
                                    <label htmlFor="email" className="text-[10px] font-black uppercase italic tracking-widest opacity-50 group-focus-within:opacity-100 transition-opacity">EMAIL_ENDPOINT</label>
                                    <input id="email" type="email" required className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-xl font-black italic uppercase tracking-tighter focus:outline-none focus:border-red-600 transition-colors" placeholder="USER@DOMAIN.COM" />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label htmlFor="subject" className="text-[10px] font-black uppercase italic tracking-widest opacity-50 group-focus-within:opacity-100 transition-opacity">SUBJECT_HEADER</label>
                                <input id="subject" required className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-xl font-black italic uppercase tracking-tighter focus:outline-none focus:border-red-600 transition-colors" placeholder="REPORT_TYPE" />
                            </div>

                            <div className="space-y-2 group">
                                <label htmlFor="message" className="text-[10px] font-black uppercase italic tracking-widest opacity-50 group-focus-within:opacity-100 transition-opacity">DATA_PAYLOAD (MESSAGE)</label>
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
