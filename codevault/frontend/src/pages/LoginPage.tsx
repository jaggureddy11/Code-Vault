import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Zap, Activity, ArrowRight, Loader2, CheckCircle2, Mail, Lock } from 'lucide-react';
import { Starfield } from '@/components/Starfield';
import { CursorHologram } from '@/components/CursorHologram';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500); // 1.5 seconds cool transition
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
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
              Enter the <br />
              <span className="text-red-600 underline decoration-8 underline-offset-[12px]">CodeVault.</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 dark:text-black/40 italic">
              Retrieve archived logic. Access your secure engineering grid.
            </p>
          </div>
        </div>

      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative bg-white dark:bg-black overflow-hidden">
        {/* Geometric Dot Grid Canvas */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        {/* Sharp Brutalist Card */}
        <div className="w-full max-w-[460px] relative z-10 bg-white dark:bg-black p-8 sm:p-10 border-2 border-black dark:border-white rounded-none">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase italic tracking-widest leading-none">
              <Zap className="h-3 w-3" />
              Sign In
            </div>
            <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase leading-none">
              Welcome Back
            </h2>
            <p className="text-sm font-medium opacity-60">
              Enter your credentials to access your library.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-600 text-white p-6 font-bold italic text-xs border-l-8 border-red-900">
                Error: {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label htmlFor="email" className="block text-[10px] font-black text-black/60 dark:text-white/60 uppercase tracking-[0.2em] mb-1.5 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                  Email Address
                </label>
                <div className="relative flex items-center bg-transparent border-2 border-black/20 dark:border-white/20 group-focus-within:border-black dark:group-focus-within:border-white transition-colors duration-200 overflow-hidden rounded-none">
                  <div className="pl-3 pr-2 text-black/40 dark:text-white/40 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200">
                    <Mail className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent py-3 sm:py-3.5 text-base font-medium text-black dark:text-white focus:outline-none placeholder:text-black/20 dark:placeholder:text-white/20"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-[10px] font-black text-black/60 dark:text-white/60 uppercase tracking-[0.2em] mb-1.5 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                  Password
                </label>
                <div className="relative flex items-center bg-transparent border-2 border-black/20 dark:border-white/20 group-focus-within:border-black dark:group-focus-within:border-white transition-colors duration-200 overflow-hidden rounded-none">
                  <div className="pl-3 pr-2 text-black/40 dark:text-white/40 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200">
                    <Lock className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent py-3 sm:py-3.5 text-base font-medium text-black dark:text-white focus:outline-none placeholder:text-black/20 dark:placeholder:text-white/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                className="w-full h-12 sm:h-14 text-sm sm:text-[15px] font-black uppercase tracking-[0.15em] bg-black text-white dark:bg-white dark:text-black rounded-none transition-colors duration-200 hover:bg-black/80 dark:hover:bg-white/80 group border-none shadow-none"
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
                    Sign In <ArrowRight className="h-6 w-6 stroke-[3px] group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </Button>

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-[1px] bg-black/10 dark:bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Or continue with</span>
                <div className="flex-1 h-[1px] bg-black/10 dark:bg-white/10" />
              </div>

              <Button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await signInWithGoogle();
                    setIsSuccess(true);
                    setTimeout(() => navigate('/'), 1500);
                  } catch (err: any) {
                    setError(err.message || 'Google Auth failed');
                    setLoading(false);
                  }
                }}
                variant="outline"
                className="mx-auto w-12 h-12 rounded-none sm:w-full sm:h-14 border-2 border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white transition-colors duration-200 font-bold uppercase tracking-widest italic flex items-center justify-center sm:gap-3 p-0 sm:px-4 bg-transparent shadow-none hover:shadow-none"
                disabled={loading || isSuccess}
              >
                <svg className="h-8 w-8 sm:h-5 sm:w-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                <span className="hidden sm:inline">Google Account</span>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold italic tracking-widest pt-8 border-t border-black/10 dark:border-white/10 uppercase">
              <Link to="/signup" className="hover:text-red-600 transition-colors decoration-2 underline-offset-4 hover:underline">
                Create Account
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
