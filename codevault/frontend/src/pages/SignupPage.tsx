import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Code2, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3) {
      return setError('Username must be at least 3 characters');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      await signUp(email, password, username);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-black overflow-hidden font-sans">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-black dark:bg-white relative overflow-hidden items-center justify-center p-24">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full stripe-bg invert dark:invert-0" />
        </div>

        <div className="relative z-10 space-y-12">
          <div className="flex items-center gap-6">
            <div className="bg-white dark:bg-black p-5">
              <Code2 className="h-16 w-16 text-black dark:text-white" />
            </div>
            <h1 className="text-8xl font-black italic tracking-tighter text-white dark:text-black uppercase leading-none">
              JOIN<br />VAULT
            </h1>
          </div>

          <div className="space-y-6 max-w-xl">
            <div className="h-2 w-32 flex gap-2">
              <div className="h-full w-1/3 bg-white dark:bg-black" />
              <div className="h-full w-1/3 bg-white dark:bg-black" />
              <div className="h-full w-1/3 bg-white dark:bg-black" />
            </div>
            <p className="text-4xl font-black italic tracking-tight text-white dark:text-black uppercase leading-tight">
              Build your personal <span className="underline decoration-8 underline-offset-[12px]">knowledge.</span>
            </p>
          </div>
        </div>

        {/* Floating Accents */}
        <div className="absolute bottom-20 right-20 flex gap-4 rotate-90">
          <span className="text-[10px] font-bold tracking-widest text-white/40 dark:text-black/40">Open Source Community</span>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md space-y-12 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase italic tracking-widest leading-none">
              <ShieldCheck className="h-3 w-3" />
              New Registration
            </div>
            <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
              Create Account
            </h2>
            <p className="text-sm font-medium opacity-60">
              Start your journey towards organized engineering.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-600 text-white p-6 font-bold italic text-xs border-l-8 border-red-900">
                Error: {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2 group">
                <label htmlFor="email" className="block text-xs font-bold opacity-60 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-2xl font-black italic tracking-tighter focus:outline-none focus:border-red-600 transition-colors placeholder:opacity-10"
                  placeholder="user@example.com"
                />
              </div>

              <div className="space-y-2 group">
                <label htmlFor="username" className="block text-xs font-bold opacity-60 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-2xl font-black italic tracking-tighter focus:outline-none focus:border-red-600 transition-colors placeholder:opacity-10"
                  placeholder="technical_ninja"
                />
              </div>

              <div className="space-y-2 group">
                <label htmlFor="password" className="block text-xs font-bold opacity-60 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">
                  Choose Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-2xl font-black italic tracking-tighter focus:outline-none focus:border-red-600 transition-colors placeholder:opacity-10"
                  placeholder="Min. 6 characters"
                />
              </div>

              <div className="space-y-2 group">
                <label htmlFor="confirmPassword" className="block text-xs font-bold opacity-60 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-2xl font-black italic tracking-tighter focus:outline-none focus:border-red-600 transition-colors placeholder:opacity-10"
                  placeholder="Repeat your password"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="adidas-button w-full h-20 text-2xl"
                disabled={loading}
              >
                {loading ? (
                  <Activity className="h-8 w-8 animate-spin" />
                ) : (
                  <>
                    Sign Up <ArrowRight className="h-6 w-6 stroke-[3px]" />
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold italic tracking-widest pt-8 border-t border-black/10 dark:border-white/10 uppercase">
              <Link to="/login" className="hover:text-red-600 transition-colors decoration-2 underline-offset-4 hover:underline">
                Already have an account? Sign in
              </Link>
              <span className="opacity-40 tracking-normal">CodeVault © {new Date().getFullYear()}</span>
            </div>
          </form>
        </div>

        {/* Background Stripes for mobile */}
        <div className="lg:hidden absolute top-0 right-0 w-32 h-64 opacity-5 pointer-events-none">
          <div className="h-full w-full stripe-bg" />
        </div>
      </div>
    </div>
  );
}
