import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Initialize Supabase admin client (Service Role Key)
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Email, password, and username are required.' });
        }

        // 1. Check if the username is already taken using the service role key to bypass RLS
        const { data: existingProfiles, error: checkError } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .limit(1);

        if (checkError) {
            console.error('Error checking profiles:', checkError);
            return res.status(500).json({ error: 'Database error checking username.' });
        }

        if (existingProfiles && existingProfiles.length > 0) {
            return res.status(409).json({ error: 'This username is already taken.' });
        }

        // 2. Create the user using the admin API which bypasses normal rate limits and allows auto-confirm
        const { data: authData, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                username
            }
        });

        if (createError) {
            console.error('Error creating user via admin api:', createError);
            return res.status(400).json({ error: createError.message });
        }

        return res.status(200).json({ success: true, user: authData.user });

    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Internal server error during signup.' });
    }
});

export default router;
