// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://apyttlilctcvzkiojfht.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFweXR0bGlsY3RjdnpraW9qZmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDY0ODYsImV4cCI6MjA2MjU4MjQ4Nn0.570abMn54ts7PS35Ua1JrOcTBvbpW2Ue5yqRC7dn_eg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);