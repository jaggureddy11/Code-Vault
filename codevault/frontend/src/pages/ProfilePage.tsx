import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Save, Activity } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

const EMOJIS = ['🧑‍💻', '🚀', '🐱', '🐶', '🦄', '🤖', '👾', '🔥', '✨', '🍕', '🎮', '🎸', '🎨', '🎵', '💡', '🌟', '❤️', '😀', '😁', '😂', '🤣', '🥲', '🥹', '🥰', '😍', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '😎', '🤓', '🥳', '🤩', '🥳'];

export default function ProfilePage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [emoji, setEmoji] = useState('😀');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        async function getProfile() {
            if (!user) return;

            const saved = localStorage.getItem(`profile_emoji_${user.id}`);
            if (saved) setEmoji(saved);

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data) {
                    setUsername(data.username || '');
                }
            } catch (err: unknown) {
                console.error('Error loading profile:', getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        }

        getProfile();
    }, [user]);

    const handleEmojiSelect = (selected: string) => {
        setEmoji(selected);
        if (user) {
            localStorage.setItem(`profile_emoji_${user.id}`, selected);
        }
        setShowEmojiPicker(false);
        toast({ title: 'Emoji updated', description: 'Your profile emoji has been saved.' });
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setUpdating(true);
        try {
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                username,
                updated_at: new Date().toISOString(),
            });

            if (error) throw error;

            await supabase.auth.updateUser({ data: { username } });
            queryClient.invalidateQueries({ queryKey: ['profile', user.id] });

            toast({ title: 'Saved', description: 'Your profile has been updated.' });
        } catch (err: unknown) {
            toast({
                title: 'Update failed',
                description: getErrorMessage(err),
                variant: 'destructive',
            });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <Activity className="h-12 w-12 animate-spin text-black dark:text-white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-10 text-black dark:text-white">
                    My profile
                </h1>

                <div className="border-2 border-black dark:border-white p-8 space-y-8">
                    <div className="flex flex-col items-center gap-4 relative">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="relative w-28 h-28 rounded-none border-2 border-black dark:border-white overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center group"
                        >
                            <div className="text-6xl">{emoji}</div>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold text-sm tracking-widest uppercase">Change</span>
                            </div>
                        </button>

                        {showEmojiPicker && (
                            <div className="absolute top-32 z-10 p-4 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] w-72">
                                <div className="grid grid-cols-4 gap-2">
                                    {EMOJIS.map((e) => (
                                        <button
                                            key={e}
                                            type="button"
                                            onClick={() => handleEmojiSelect(e)}
                                            className="text-3xl hover:bg-neutral-100 dark:hover:bg-neutral-900 p-2 rounded transition-colors"
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    className="mt-4 w-full text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100 border-t-2 border-dashed border-black/20 dark:border-white/20 pt-4"
                                    onClick={() => setShowEmojiPicker(false)}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-black/60 dark:text-white/60 italic">Click to choose an emoji</p>
                    </div>

                    <form onSubmit={updateProfile} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Username</label>
                            <input
                                id="username"
                                className="w-full bg-transparent border-b-2 border-black dark:border-white py-3 text-lg font-medium focus:outline-none focus:border-red-600"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Full name</label>
                            <input
                                id="fullName"
                                className="w-full bg-transparent border-b-2 border-black dark:border-white py-3 text-lg font-medium focus:outline-none focus:border-red-600"
                                placeholder="Full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Email</label>
                            <p className="py-3 text-lg opacity-70 border-b border-black/10 dark:border-white/10">{user?.email}</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={updating}
                            className="w-full h-12 rounded-none border-2 border-black dark:border-white font-bold uppercase"
                        >
                            {updating ? <Activity className="h-5 w-5 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Save</>}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
