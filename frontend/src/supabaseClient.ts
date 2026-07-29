import { createClient } from '@supabase/supabase-js'

// Substitua com as suas chaves do painel do Supabase (Project Settings -> API)
const supabaseUrl = 'https://ytcnmqaojipmgnztbdvq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Y25tcWFvamlwbWduenRiZHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NTEwNzcsImV4cCI6MjEwMDIyNzA3N30.OIuvaG3PQD73_1kue9LJA7bTj7OYb2WjjM0MNdpzgmQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)