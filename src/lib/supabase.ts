import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqyqmhgannypuracasdu.supabase.co';
// Yahan wo lambi wali key (eyJ...) paste karo
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeXFtaGdhbm55cHVyYWNhc2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzkwMDYsImV4cCI6MjA4NDc1NTAwNn0.8dlJNPu6jjQt4vcQiaWfypFuB8fSBpv0F3yI1VkMQE4'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);