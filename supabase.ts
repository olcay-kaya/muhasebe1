
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eyydzkasifhslcksdkgq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eWR6a2FzaWZoc2xja3Nka2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NTAxODQsImV4cCI6MjA4MjIyNjE4NH0.5mBp0Xr8p6xg3DXEiVLfzSMv94CK5sa7HE46Po7trpw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
