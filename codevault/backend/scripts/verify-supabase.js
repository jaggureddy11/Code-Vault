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

async function verify() {
    console.log('🚀 Verifying Supabase connection and schema...');

    const tables = ['snippets', 'tags', 'snippet_tags', 'profiles'];
    let allOk = true;

    for (const table of tables) {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (error) {
            console.error(`❌ Table "${table}" check failed:`, error.message);
            allOk = false;
        } else {
            console.log(`✅ Table "${table}" exists and is accessible.`);
        }
    }

    if (allOk) {
        console.log('\n✨ All systems nominal. Vault is successfully synced with Supabase.');
    } else {
        console.log('\n⚠️ Some tables are missing. Please run the SQL in PRODUCTION_SCHEMA.sql in your Supabase SQL Editor.');
    }
}

verify();
