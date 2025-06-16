import { createClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from '../config';

if (!supabaseAnonKey || !supabaseUrl) {
  throw new Error('Missing Supabase service key or URL');
}

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
