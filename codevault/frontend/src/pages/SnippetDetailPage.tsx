import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSnippets } from '@/hooks/useSnippets';
import { Activity, ShieldCheck } from 'lucide-react';
import SnippetForm from '@/components/SnippetForm';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { CreateSnippetInput, Snippet } from '@/types';
import { getErrorMessage } from '@/lib/utils';

export default function SnippetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateSnippet } = useSnippets();
  const { toast } = useToast();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSnippet() {
      if (!id || !user) return;
      try {
        const { data, error } = await supabase
          .from('snippets')
          .select('*, snippet_tags(tag_id, tags(*))')
          .eq('id', id)
          .single();

        if (error) throw error;
        const normalized = {
          ...data,
          tags: data?.snippet_tags?.map((st: any) => st?.tags).filter(Boolean) ?? [],
        };
        setSnippet(normalized as Snippet);
      } catch (error: unknown) {
        toast({
          title: 'Error',
          description: getErrorMessage(error, 'Failed to access snippet.'),
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    fetchSnippet();
  }, [id, user, navigate, toast]);

  const handleUpdate = async (data: CreateSnippetInput) => {
    if (!id) return;
    try {
      await updateSnippet({ id, ...data });
      toast({
        title: 'Success',
        description: 'Changes saved successfully.',
      });
      navigate('/');
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to update snippet.'),
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
        <div className="relative">
          <div className="h-32 w-32 border-4 border-black dark:border-white animate-spin flex items-center justify-center">
            <div className="h-full w-full flex gap-1 p-2">
              <div className="h-full w-1/3 bg-black dark:bg-white opacity-20" />
              <div className="h-full w-1/3 bg-black dark:bg-white opacity-40" />
              <div className="h-full w-1/3 bg-black dark:bg-white opacity-60" />
            </div>
          </div>
        </div>
        <p className="mt-12 text-sm font-bold text-black dark:text-white uppercase italic tracking-[0.5em] animate-pulse">
          Retrieving Record...
        </p>
      </div>
    );
  }

  if (!snippet) return null;

  const isOwner = user?.id === snippet.user_id;

  const initialFormData = {
    ...snippet,
    tags: snippet.tags?.map((t) => t.name) || [],
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
    toast({
      title: 'Copied',
      description: 'Code copied to clipboard.',
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-500 pb-32 pt-32 bg-white dark:bg-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="border-t-8 border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 p-8 md:p-16">
          <div className="relative overflow-hidden mb-16 border-b-2 border-black/10 dark:border-white/10 pb-12">
            <div className="absolute top-0 right-0 w-32 h-64 opacity-5 pointer-events-none">
              <div className="h-full w-full stripe-bg" />
            </div>

            <div className="inline-flex items-center gap-3 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase italic tracking-widest leading-none mb-8">
              <Activity className="h-3.5 w-3.5" />
              {isOwner ? 'Edit Snippet' : 'View Only Mode'}
            </div>

            <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] mb-8">
              {isOwner ? 'Update Your Code' : 'Global Reference'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white dark:bg-black border border-black/5 dark:border-white/5 p-6 space-y-2">
                <span className="text-[10px] font-bold uppercase opacity-40 italic tracking-widest">Reference ID</span>
                <p className="font-mono text-xs opacity-80">{snippet.id}</p>
              </div>
              <div className="bg-white dark:bg-black border border-black/5 dark:border-white/5 p-6 space-y-2">
                <span className="text-[10px] font-bold uppercase opacity-40 italic tracking-widest">Security Status</span>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <p className="font-bold italic uppercase">{isOwner ? 'Optimal Ready' : 'Verified Read Only'}</p>
                </div>
              </div>
            </div>
          </div>

          {!isOwner ? (
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter">{snippet.title}</h3>
                </div>
                <p className="text-lg opacity-60 font-medium italic">{snippet.description}</p>
                <div className="flex gap-2">
                  {snippet.tags?.map((tag: any) => (
                    <span key={tag.name} className="bg-neutral-200 dark:bg-neutral-800 px-3 py-1 text-[10px] font-bold uppercase italic tracking-widest">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative group bg-neutral-100 dark:bg-neutral-800 p-8 border border-black/5 dark:border-white/5">
                <button
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-[10px] font-bold uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all z-10"
                >
                  Copy Snippet
                </button>
                <pre className="text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap pt-8">
                  {snippet.code}
                </pre>
              </div>

              <div className="pt-12 border-t border-black/10 dark:border-white/10">
                <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase italic tracking-widest hover:underline decoration-2 underline-offset-4">
                  ← Back to Library
                </button>
              </div>
            </div>
          ) : (
            <SnippetForm
              initialData={initialFormData}
              onSubmit={handleUpdate}
              onCancel={() => navigate('/')}
            />
          )}
        </div>
      </main>
    </div>
  );
}
