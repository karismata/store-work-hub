import { createClient } from '@supabase/supabase-js';

export const OFFICIAL_SUPABASE_URL = 'https://lyycfsrhazmumpthzqtm.supabase.co';
export const OFFICIAL_SUPABASE_KEY = 'sb_publishable_ks1RYC2RT0uy4iP98WJcxA_WIO95F4X';

export const getSupabaseConfig = () => {
  const url = localStorage.getItem('supabase_url');
  const key = localStorage.getItem('supabase_key');
  
  // Always default to official cloud DB if not set
  if (!url || !key) {
    localStorage.setItem('supabase_url', OFFICIAL_SUPABASE_URL);
    localStorage.setItem('supabase_key', OFFICIAL_SUPABASE_KEY);
    return { url: OFFICIAL_SUPABASE_URL, key: OFFICIAL_SUPABASE_KEY };
  }
  return { url, key };
};

export const setSupabaseConfig = (url, key) => {
  localStorage.setItem('supabase_url', url);
  localStorage.setItem('supabase_key', key);
};

export const resetSupabaseConfigToDefault = () => {
  localStorage.setItem('supabase_url', OFFICIAL_SUPABASE_URL);
  localStorage.setItem('supabase_key', OFFICIAL_SUPABASE_KEY);
};

const config = getSupabaseConfig();
export const supabase = createClient(config.url, config.key);
