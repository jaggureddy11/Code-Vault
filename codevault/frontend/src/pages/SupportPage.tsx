import { Heart, Coffee, Shield, Zap, Info, Sparkles, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
    const tiers = [
        { name: 'SEEDLING_UNIT', price: '$2', description: 'Just a small token of appreciation for the grid.', benefits: ['Supporter Badge', 'Priority Support'] },
        { name: 'DEVELOPER_PRO', price: '$10', description: 'Helping us cover critical infrastructure costs.', benefits: ['Pro Features Access', 'Early Beta Access', 'Custom Themes'] },
        { name: 'BELIEVER_CORE', price: '$50+', description: 'Absolute trust in the future of CodeVault.', benefits: ['1-on-1 Setup Call', 'Custom UI Requests', 'Direct Slack Access'] },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-32 space-y-8">
                    <div className="bg-red-600 w-24 h-24 flex items-center justify-center mx-auto mb-10 transition-transform hover:scale-110">
                        <Heart className="h-12 w-12 text-white fill-white" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase italic tracking-widest leading-none">
                        <Zap className="h-3 w-3" />
                        GLOBAL_SUPPORT_NETWORK
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none uppercase">
                        FUEL_THE_<br /><span className="underline decoration-8 underline-offset-8">INNOVATION.</span>
                    </h1>
                    <p className="text-xl font-bold max-w-2xl mx-auto uppercase italic opacity-60">
                        CODEVAULT IS BUILT BY DEVELOPERS, FOR DEVELOPERS. YOUR SUPPORT KEEPS THE VAULT SECURE AND INDEPENDENT.
                    </p>
                </div>

                {/* Tiers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black dark:border-white mb-32 bg-black dark:bg-white">
                    {tiers.map((tier, i) => (
                        <div key={i} className={`bg-white dark:bg-black p-12 border-r-4 md:last:border-r-0 border-black dark:border-white flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors relative ${i === 1 ? 'z-10 bg-neutral-50 dark:bg-neutral-900' : ''}`}>
                            {i === 1 && (
                                <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
                            )}
                            <div className="space-y-6 mb-12">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">{tier.name}</h3>
                                <div className="text-6xl font-black italic tracking-tighter uppercase leading-none">
                                    {tier.price}<span className="text-[10px] opacity-40">/MO</span>
                                </div>
                                <p className="text-sm font-bold uppercase opacity-60 italic leading-relaxed">{tier.description}</p>
                            </div>

                            <div className="space-y-4 flex-1">
                                {tier.benefits.map((benefit, j) => (
                                    <div key={j} className="flex items-center gap-4">
                                        <Activity className="h-4 w-4 opacity-30" />
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <Button className={`adidas-button w-full h-16 text-xl mt-12 ${i === 1 ? 'bg-red-600 text-white hover:bg-red-700 border-none' : ''}`}>
                                INITIALIZE_ {tier.name.split('_')[0]}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Free Support Options */}
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="border-4 border-black dark:border-white p-16 relative overflow-hidden text-center bg-black text-white dark:bg-white dark:text-black">
                        <div className="absolute top-0 right-0 w-64 h-full opacity-10 pointer-events-none">
                            <div className="h-full w-full stripe-bg invert dark:invert-0" />
                        </div>

                        <div className="relative z-10 space-y-10">
                            <div className="flex justify-center gap-4">
                                {[Shield, Coffee, Info].map((Icon, i) => (
                                    <div key={i} className="w-16 h-16 border-2 border-white/20 dark:border-black/20 flex items-center justify-center">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                ))}
                            </div>
                            <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4">OTHER_WAYS_TO_HELP</h2>
                            <p className="text-lg font-bold uppercase italic opacity-60 max-w-2xl mx-auto">
                                DOCUMENTATION, COMMUNITY ASSISTANCE, AND SPREADING THE PROTOCOL ARE EQUALLY VALUABLE. JOIN THE UNIT.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6 pt-4">
                                <Button className="adidas-button bg-white text-black hover:bg-neutral-200 h-16 px-10 text-xl dark:bg-black dark:text-white dark:hover:bg-neutral-800 border-none">
                                    <Heart className="h-6 w-6 mr-2" /> SPONSOR_GITHUB
                                </Button>
                                <Button className="adidas-button bg-red-600 text-white hover:bg-red-700 h-16 px-10 text-xl border-none">
                                    <Sparkles className="h-6 w-6 mr-2" /> LEAVE_INTEL_REVIEW
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] italic opacity-40">
                        <Activity className="h-4 w-4 animate-pulse text-red-600" />
                        PERFORMANCE_ENGINE_v2.5 // GRID_STATUS: OPTIMAL
                    </div>
                </div>
            </div>
        </div>
    );
}
