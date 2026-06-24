import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in backend/.env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureDemoUser() {
    console.log('🚀 Checking/creating demo user...');

    const email = 'demo@codevault.app';
    const password = 'demo123';
    const username = 'demo';

    // Check if user exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('❌ Error listing users:', listError.message);
        process.exit(1);
    }

    const demoUser = users.find(u => u.email === email);

    if (demoUser) {
        console.log(`✅ Demo user already exists with ID: ${demoUser.id}`);
        
        // Ensure profile exists
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', demoUser.id)
            .single();

        if (profileError && profileError.code === 'PGRST116') {
            console.log('⚠️ Profile missing. Creating profile...');
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({ id: demoUser.id, username });
            if (insertError) {
                console.error('❌ Failed to insert profile:', insertError.message);
            } else {
                console.log('✅ Profile created successfully.');
            }
        } else if (profile) {
            console.log(`✅ Profile exists with username: ${profile.username}`);
        }
    } else {
        console.log('⚠️ Demo user not found. Creating...');
        const { data: authData, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                username
            }
        });

        if (createError) {
            console.error('❌ Failed to create demo user:', createError.message);
        } else {
            console.log(`✅ Demo user created successfully with ID: ${authData.user.id}`);
        }
    }
}

ensureDemoUser();
