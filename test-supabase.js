// Simple test to debug Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kisewkjogomsstgvqggc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpc2V3a2pvZ29tc3N0Z3ZxZ2djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzkzODIsImV4cCI6MjA3MjkxNTM4Mn0.pyoxO368d_1lDbimZcRiGfmjDs34mXk7h-ZaQPKiUqo'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testInsert() {
  console.log('Testing Supabase connection...')
  
  // Test with minimal data
  const { data, error } = await supabase
    .from('leads')
    .insert({
      email: 'test@example.com',
      source_page: 'home',
      source_url: 'http://localhost:5173/'
    })
    .select()
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success:', data)
  }
}

testInsert()