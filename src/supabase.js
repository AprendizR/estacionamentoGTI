import {createClient} from "@supabase/supabase-js";

//buscando as chaves no .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

//fazendo a conexão ao supabase
export const supabase = createClient(supabaseUrl, supabaseKey);