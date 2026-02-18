import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useProfile } from '@/hooks/useProfile';
import {
    Code2, Compass, Youtube, User,
    HelpCircle, MessageSquare, Heart, LogOut,
    Sun, Moon, Menu, X, Sparkles, Zap, Activity, Globe,
    StickyNote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { avatarUrl } = useProfile();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleThemeToggle = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        // Halfway through the animation, switch the theme
        setTimeout(() => {
            toggleTheme();
        }, 400); // Wait for cover
        // Ending the animation
        setTimeout(() => {
            setIsTransitioning(false);
        }, 1000); // Full duration
    };

    const navLinks = [
        { name: 'Vault', path: '/', icon: Code2 },
        { name: 'Explore', path: '/explore', icon: Globe },
        { name: 'Favorites', path: '/favorites', icon: Heart },
        { name: 'Projects', path: '/projects', icon: Compass },
        { name: 'Learn', path: '/learn', icon: Youtube },
        { name: 'Notes', path: '/notes', icon: StickyNote },
    ];

    const footerLinks = [
        { name: 'About', path: '/about', icon: HelpCircle },
        { name: 'Contact', path: '/contact', icon: MessageSquare },
        { name: 'Support', path: '/support', icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-foreground transition-colors duration-500 font-sans">
            {/* Athletic Header */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-4 sm:px-6 lg:px-8",
                    isScrolled ? "bg-white/95 dark:bg-black/95 backdrop-blur-md border-b-2 border-black dark:border-white py-3" : "bg-transparent py-6"
                )}
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo Area */}
                    <NavLink to="/" className="z-[110]">
                        <Logo />
                    </NavLink>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => cn(
                                    "relative px-6 py-2 text-xs font-black uppercase italic tracking-widest transition-all duration-300 overflow-hidden",
                                    isActive ? "text-white bg-black dark:text-black dark:bg-white" : "text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="relative z-10 flex items-center gap-2">
                                            <link.icon className="h-3.5 w-3.5" />
                                            {link.name}
                                        </span>
                                        {isActive && (
                                            <div className="absolute top-0 left-0 w-1 h-full bg-white dark:bg-black opacity-20" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center gap-3 z-[110]">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleThemeToggle}
                            className="rounded-none border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black w-10 h-10"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        <div className="hidden sm:block h-10 w-[2px] bg-black/10 dark:bg-white/10 mx-1" />

                        <div className="hidden sm:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-none border-2 border-black dark:border-white w-10 h-10 overflow-hidden">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-5 w-5 text-black dark:text-white" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-72 mt-2 rounded-none bg-white dark:bg-black border-4 border-black dark:border-white p-0 shadow-none overflow-hidden" align="end">
                                    <DropdownMenuLabel className="flex flex-col p-8 bg-black text-white dark:bg-white dark:text-black relative overflow-hidden">
                                        <span className="text-2xl font-black italic tracking-tighter uppercase">{user?.user_metadata?.username || user?.email?.split('@')[0]}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">{user?.email}</span>
                                    </DropdownMenuLabel>
                                    <div className="p-2 space-y-1">
                                        <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-none p-5 text-[10px] font-black uppercase italic tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer gap-4">
                                            <User className="h-4 w-4" /> View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/support')} className="rounded-none p-5 text-[10px] font-black uppercase italic tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer gap-4">
                                            <Sparkles className="h-4 w-4" /> Support Us
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10 mx-4" />
                                        <DropdownMenuItem onClick={signOut} className="rounded-none p-5 text-[10px] font-black uppercase italic tracking-widest bg-red-600 text-white hover:bg-red-700 cursor-pointer gap-4">
                                            <LogOut className="h-4 w-4" /> Logout
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Mobile Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden rounded-none border-2 border-black dark:border-white w-10 h-10"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-[90] bg-white dark:bg-black lg:hidden transition-all duration-500 flex flex-col pt-32 px-8 overflow-y-auto",
                    mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                )}
            >
                <div className="space-y-12">
                    <div className="h-px bg-black/10 dark:bg-white/10 w-full" />
                    <nav className="flex flex-col gap-3 sm:gap-4">
                        {[...navLinks, { name: 'Profile', path: '/profile', icon: User }].map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-6 sm:gap-8 p-6 sm:p-8 text-2xl sm:text-4xl font-black uppercase italic tracking-tighter transition-all border-4",
                                    isActive ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" : "border-black/5 dark:border-white/5"
                                )}
                            >
                                <>
                                    <link.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                                    {link.name}
                                </>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="grid grid-cols-1 gap-4">
                        {footerLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className="flex items-center gap-6 p-6 border-2 border-black/10 dark:border-white/10 text-xl font-black uppercase italic tracking-widest"
                            >
                                <link.icon className="h-6 w-6" />
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="mt-10 sm:mt-20 mb-8 sm:mb-12">
                    <Button onClick={signOut} className="adidas-button w-full h-16 sm:h-24 text-xl sm:text-2xl bg-red-600 text-white border-none">
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 min-h-screen">
                {children}
            </main>

            {/* Performance Footer */}
            <footer className="bg-neutral-100 dark:bg-neutral-900 py-16 sm:py-32 border-t-8 border-black dark:border-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-20 mb-12 sm:mb-20">
                        <div className="col-span-1 md:col-span-2 space-y-6 sm:space-y-10">
                            <Logo className="gap-4 sm:gap-6 scale-100 sm:scale-125 origin-left" />
                            <p className="text-lg sm:text-xl font-black max-w-sm leading-[1.1] uppercase italic">
                                BUILT BY<br />DEVELOPERS,<br />FOR DEVELOPERS.
                            </p>
                        </div>

                        <div className="space-y-10">
                            <h4 className="text-xs font-bold uppercase tracking-[0.3em] opacity-40 italic">Navigation</h4>
                            <ul className="space-y-6">
                                {navLinks.map((link) => (
                                    <li key={link.path}>
                                        <NavLink to={link.path} className="text-2xl font-black uppercase italic tracking-tighter hover:underline decoration-4 underline-offset-8 transition-all">{link.name}</NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-10">
                            <h4 className="text-xs font-bold uppercase tracking-[0.3em] opacity-40 italic">Support</h4>
                            <ul className="space-y-6">
                                {footerLinks.map((link) => (
                                    <li key={link.path}>
                                        <NavLink to={link.path} className="text-2xl font-black uppercase italic tracking-tighter hover:underline decoration-4 underline-offset-8 transition-all">{link.name}</NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-black/10 dark:border-white/10 flex flex-col lg:flex-row justify-between items-center gap-12">
                        <div className="flex items-center gap-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
                                © {new Date().getFullYear()} CodeVault
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 italic">
                            <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors uppercase">Privacy Policy</span>
                            <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors uppercase">Terms of Service</span>
                            <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors uppercase">Legal Info</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Speed Line Transition Overlay */}
            <div className={cn(
                "fixed inset-0 z-[9999] pointer-events-none flex flex-col",
                isTransitioning ? "opacity-100" : "opacity-0 transition-opacity delay-700 duration-0"
            )}>
                <div className={cn(
                    "flex-1 bg-black w-full transform transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]",
                    isTransitioning ? "translate-x-0" : "-translate-x-full"
                )} />
                <div className={cn(
                    "flex-1 bg-white w-full transform transition-transform duration-500 delay-75 ease-[cubic-bezier(0.87,0,0.13,1)]",
                    isTransitioning ? "translate-x-0" : "translate-x-full"
                )} />
                <div className={cn(
                    "flex-1 bg-black w-full transform transition-transform duration-500 delay-150 ease-[cubic-bezier(0.87,0,0.13,1)]",
                    isTransitioning ? "translate-x-0" : "-translate-x-full"
                )} />
            </div>
        </div>
    );
}
