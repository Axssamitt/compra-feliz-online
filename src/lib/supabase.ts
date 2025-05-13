
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://apyttlilctcvzkiojfht.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFweXR0bGlsY3RjdnpraW9qZmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDY0ODYsImV4cCI6MjA2MjU4MjQ4Nn0.570abMn54ts7PS35Ua1JrOcTBvbpW2Ue5yqRC7dn_eg';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
