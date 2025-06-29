import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://dyxbvfnaxnumgggpjpqc.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eGJ2Zm5heG51bWdnZ3BqcHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTA0MzksImV4cCI6MjA2NjMyNjQzOX0.xFH1tMHYP6aMKkVOhcmogpQzOQP7-WgKr6vzEcnboaw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
