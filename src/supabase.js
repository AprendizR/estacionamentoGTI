import { createClient } from "@supabase/supabase-js";
//Buscando as chaves no .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
//Fazendo a conexão ao supabase
export const supabase = createClient(supabaseUrl, supabaseKey)