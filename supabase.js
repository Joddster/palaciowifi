// Supabase client configuration
// This file reads environment variables from Vercel

// For Vercel deployment, these will be automatically available from environment variables
const SUPABASE_URL = (import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '';
const SUPABASE_ANON_KEY = (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || '';

// Initialize Supabase client (if credentials are available)
let supabaseClient = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  // Dynamically import Supabase only if we have credentials
  import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
    .then(({ createClient }) => {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('Supabase initialized successfully');
    })
    .catch(error => {
      console.warn('Failed to initialize Supabase:', error);
    });
}

// Export a function to get the Supabase client
export const getSupabase = () => {
  if (!supabaseClient) {
    console.warn('Supabase client not initialized. Check your environment variables.');
  }
  return supabaseClient;
};

// Newsletter subscription function
export const subscribeToNewsletter = async (formData) => {
  const supabase = getSupabase();
  
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        subscribed_at: formData.subscribedAt
      }]);

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw error;
  }
};

