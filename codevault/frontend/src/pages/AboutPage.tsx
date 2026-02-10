import { Github, Shield, Zap, Code2, Users, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    const stats = [
        { label: 'ACTIVE_DEVELOPERS', value: '10K+', icon: Users },
        { label: 'SNIPPETS_SECURED', value: '1.2M+', icon: Code2 },
        { label: 'TOTAL_UPTIME', value: '99.9%', icon: Zap },
    ];

    const values = [
        { title: 'PRIVACY_PROTOCOL', text: 'All data packets are encrypted end-to-end. We do not compromise on security.', icon: Shield },
        { title: 'OPEN_GRID_SPIRIT', text: 'We contribute back to the global grid and maintain the integrity of our code.', icon: Github },
        { title: 'LIGHT_SPEED_SYNC', text: 'Zero-latency retrieval and real-time execution across the entire network.', icon: Zap },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black py-32 px-8 md:px-16 border-b-8 border-black dark:border-white mb-20">
                    <div className="absolute top-0 right-0 w-32 h-full opacity-10 pointer-events-none">
                        <div className="h-full w-full stripe-bg invert dark:invert-0" />
                    </div>

                    <div className="relative z-10 max-w-4xl space-y-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-black text-black dark:text-white text-[10px] font-black uppercase italic tracking-widest leading-none">
                            <Zap className="h-3 w-3" />
                            THE_MANIFESTO
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] uppercase">
                            POWERING <br />THE FUTURE OF <br /><span className="underline decoration-8 underline-offset-8">LOGIC.</span>
                        </h1>
                        <p className="text-xl font-bold max-w-2xl leading-tight uppercase opacity-70 italic">
                            CODEVAULT ISN'T JUST A REPOSITORY. IT'S A HIGH-PERFORMANCE KNOWLEDGE ENGINE BUILT FOR THE NEXT GENERATION OF SYSTEMS ARCHITECTS.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button className="adidas-button h-20 px-12 text-2xl">
                                JOIN_THE_GUILD <ArrowUpRight className="h-6 w-6 stroke-[3px]" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black dark:border-white mb-32 bg-black dark:bg-white">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-black p-12 border-r-4 md:last:border-r-0 border-black dark:border-white space-y-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                            <div className="flex items-center gap-4">
                                <stat.icon className="h-6 w-6 opacity-30" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{stat.label}</span>
                            </div>
                            <p className="text-7xl font-black italic tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Values Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32 px-4 md:px-0">
                    <div className="space-y-12">
                        <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
                            BUILT_ON_<br />TRANSPARENCY_ &<br /> PRIVACY_PROTOCOL.
                        </h2>
                        <div className="space-y-10">
                            {values.map((val, i) => (
                                <div key={i} className="flex gap-8 group">
                                    <div className="mt-1">
                                        <div className="w-16 h-16 bg-black dark:bg-white flex items-center justify-center group-hover:rotate-12 transition-transform">
                                            <val.icon className="h-8 w-8 text-white dark:text-black" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-black italic uppercase tracking-tight">{val.title}</h4>
                                        <p className="text-sm font-bold uppercase opacity-60 leading-relaxed italic">{val.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-32 h-full opacity-5 pointer-events-none">
                            <div className="h-full w-full stripe-bg" />
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                            className="w-full grayscale border-[12px] border-black dark:border-white"
                            alt="Performance Team"
                        />
                        <div className="absolute -bottom-8 -right-8 bg-black dark:bg-white text-white dark:text-black p-8 font-black italic uppercase tracking-tighter text-3xl">
                            EST_2025
                        </div>
                    </div>
                </div>

                {/* Team Section Placeholder / Call to Action */}
                <div className="bg-neutral-100 dark:bg-neutral-900 p-20 border-l-8 border-black dark:border-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none">
                        <div className="h-full w-full stripe-bg" />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <h3 className="text-5xl font-black italic uppercase tracking-tighter">READY_TO_UPGRADE?</h3>
                        <p className="max-w-xl text-lg font-bold uppercase italic opacity-60">GAIN ACCESS TO THE FULL SUITE OF PERFORMANCE TOOLS AND SECURE YOUR KNOWLEDGE VAULT ON THE GLOBAL GRID.</p>
                        <Button className="adidas-button h-20 px-12 text-2xl bg-red-600 text-white border-none hover:bg-red-700">
                            START_UPGRADE_NOW
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
