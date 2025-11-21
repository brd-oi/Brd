import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://njhgmdvzebnhusuverzp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qaGdtZHZ6ZWJuaHVzdXZlcnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTAwODMsImV4cCI6MjA3OTIyNjA4M30.2c0wWcv2BfWiLJZc-oQl9h31-P2LDKvRty6zDntP8d0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// For React:
// import { supabase } from "@/integrations/supabase/client";
// For React Native:
// import { supabase } from "@/src/integrations/supabase/client";
