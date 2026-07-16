import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gfzhfmsxteyvwzvhnzsc.supabase.co";
const supabaseKey = "sb_publishable_HFaftyaHIV-YaXbefrUE4Q_mYdLwOgG";

export const supabase = createClient(supabaseUrl, supabaseKey);
