import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://lyycfsrhazmumpthzqtm.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_ks1RYC2RT0uy4iP98WJcxA_WIO95F4X';

export const getSupabaseConfig = () => {
  const url = localStorage.getItem('supabase_url') || DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem('supabase_key') || DEFAULT_SUPABASE_KEY;
  return { url, key };
};

export const setSupabaseConfig = (url, key) => {
  localStorage.setItem('supabase_url', url);
  localStorage.setItem('supabase_key', key);
};

const config = getSupabaseConfig();
export const supabase = createClient(config.url, config.key);
