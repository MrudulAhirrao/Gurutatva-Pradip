import { createClient } from '@supabase/supabase-js';

// Use your Supabase URL and anon key
const supabaseUrl = 'https://jvieiwxqntcrksfucglb.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aWVpd3hxbnRjcmtzZnVjZ2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MDg0ODUsImV4cCI6MjA1MjI4NDQ4NX0.VRmXfSAPY2968vXAm9N7JNsefukKONXizp3AkrXpWwg'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
