import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { Starfield } from '@/components/Starfield';
import { CursorHologram } from '@/components/CursorHologram';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      localStorage.setItem('showTour', 'true');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500); // 1.5 seconds cool transition
    } catch (err: any) {
      if (err.message && err.message.includes('Database error saving new user')) {
        setError('Registration failed: This username is likely already taken.');
      } else if (err.message && err.message.toLowerCase().includes('rate limit')) {
        setError('Too many sign up attempts. Please wait a moment and try again.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-black overflow-hidden font-sans relative">
      <div className="hidden lg:block">
        <Starfield />
      </div>

      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-black dark:bg-white relative overflow-hidden items-center justify-center p-24">
        <div className="relative z-10 flex flex-col items-center text-center space-y-16">
          <CursorHologram />

          <div className="space-y-6 max-w-xl">
            <h1 className="text-5xl font-black italic tracking-tighter text-white dark:text-black uppercase leading-[0.9]">
              Initiate <br />
              <span className="text-red-600 underline decoration-8 underline-offset-[12px]">CodeVault.</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 dark:text-black/40 italic">
              Encrypt your knowledge. Join the high-performance engineering grid.
            </p>
          </div>
        </div>

      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md space-y-12 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase italic tracking-widest leading-none">
              <ShieldCheck className="h-3 w-3" />
              Sign Up
            </div>
            <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase leading-none">
              Create Account
            </h2>

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
                className="adidas-button w-full h-16 sm:h-20 text-xl sm:text-2xl relative overflow-hidden transition-all duration-500"
                disabled={loading || isSuccess}
              >
                {loading && !isSuccess ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Authenticating...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 mr-2 text-green-400" />
                    Access Granted
                  </>
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


      </div>

      {/* Screen Transition Overlay */}
      <div
        className={`fixed inset-0 bg-black z-50 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-center items-center ${isSuccess ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="text-white text-3xl md:text-5xl font-black italic tracking-tighter uppercase animate-pulse">
          Entering <span className="text-red-600 underline decoration-8 underline-offset-[12px]">CodeVault</span>
        </div>
        <div className="w-64 h-2 bg-white/20 mt-12 rounded-full overflow-hidden relative">
          <div className={`absolute left-0 top-0 h-full bg-red-600 transition-all duration-[1500ms] ease-out ${isSuccess ? 'w-full' : 'w-0'}`} />
        </div>
      </div>
    </div>
  );
}
