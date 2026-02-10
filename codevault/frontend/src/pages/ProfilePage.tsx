import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { User, Save, Camera, Activity } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { useQueryClient } from '@tanstack/react-query';

const AVATAR_BUCKET = 'avatars';
const AVATAR_PATH = (userId: string) => `${userId}/avatar`;

export default function ProfilePage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const { avatarUrl } = useProfile();

    useEffect(() => {
        async function getProfile() {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, full_name, avatar_url')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data) {
                    setUsername(data.username || '');
                    setFullName(data.full_name || '');
                }
            } catch (err: unknown) {
                console.error('Error loading profile:', getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        }

        getProfile();
    }, [user]);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        if (!file.type.startsWith('image/')) {
            toast({ title: 'Invalid file', description: 'Please choose an image (JPG, PNG, etc.).', variant: 'destructive' });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast({ title: 'File too large', description: 'Image must be under 2 MB.', variant: 'destructive' });
            return;
        }

        setUploadingAvatar(true);
        e.target.value = '';
        try {
            const path = AVATAR_PATH(user.id);
            const { error: uploadError } = await supabase.storage
                .from(AVATAR_BUCKET)
                .upload(path, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
            const publicUrl = urlData.publicUrl;

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
                .eq('id', user.id);

            if (updateError) throw updateError;

            queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
            toast({ title: 'Photo updated', description: 'Your profile picture has been updated.' });
        } catch (err: unknown) {
            toast({
                title: 'Upload failed',
                description: getErrorMessage(err, 'Could not upload image. Ensure the avatars bucket exists in Supabase.'),
                variant: 'destructive',
            });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setUpdating(true);
        try {
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                username,
                full_name: fullName || null,
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
                    <div className="flex flex-col items-center gap-4">
                        <button
                            type="button"
                            onClick={handleAvatarClick}
                            disabled={uploadingAvatar}
                            className="relative w-28 h-28 rounded-none border-2 border-black dark:border-white overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center group"
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-14 w-14 text-black dark:text-white" />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {uploadingAvatar ? (
                                    <Activity className="h-8 w-8 animate-spin text-white" />
                                ) : (
                                    <Camera className="h-8 w-8 text-white" />
                                )}
                            </div>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                            aria-label="Upload profile photo"
                        />
                        <p className="text-xs text-black/60 dark:text-white/60 italic">Click to upload photo</p>
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
