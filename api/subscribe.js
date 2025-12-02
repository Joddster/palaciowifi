// Vercel Serverless Function for Newsletter Subscription
// This runs on the server and has access to environment variables

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get environment variables (available on Vercel serverless functions)
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  // Check if Supabase is configured
  if (!supabaseUrl || !supabaseKey) {
    console.log('Newsletter signup (no database):', req.body);
    return res.status(200).json({ 
      success: true, 
      message: 'Subscription received (database not configured)',
      saved: false
    });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get form data
    const { firstName, lastName, phone, email, subscribedAt } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        success: false 
      });
    }

    // Insert into database
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        email: email,
        subscribed_at: subscribedAt || new Date().toISOString()
      }])
      .select();

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === '23505') {
        return res.status(200).json({ 
          success: true, 
          message: 'Email already subscribed',
          saved: false,
          duplicate: true
        });
      }
      
      throw error;
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Subscription saved successfully',
      saved: true,
      data 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
}

