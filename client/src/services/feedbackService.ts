import { supabase } from '../lib/supabase';

export interface Feedback {
  id: string;
  user_id: string | null;
  email: string | null;
  body: string;
  created_at: string;
}

export interface SubmitFeedbackParams {
  body: string;
  email?: string;
}

export const feedbackService = {
  /**
   * Submit feedback to the database
   * @param params - Feedback submission parameters
   * @returns Success/error response
   */
  async submitFeedback(params: SubmitFeedbackParams) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id || null,
          email: params.email || null,
          body: params.body,
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting feedback:', error);
        return { error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Exception submitting feedback:', err);
      return { error: err as Error };
    }
  },

  /**
   * Get all feedback (admin only)
   * @returns List of all feedback submissions
   */
  async getAllFeedback() {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Exception fetching feedback:', err);
      return { data: null, error: err as Error };
    }
  },

  /**
   * Get user's own feedback
   * @returns List of current user's feedback submissions
   */
  async getMyFeedback() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { data: null, error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user feedback:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Exception fetching user feedback:', err);
      return { data: null, error: err as Error };
    }
  },
};
