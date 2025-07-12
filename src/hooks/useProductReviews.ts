
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ProductReview {
  id: number;
  product_id: number;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: {
    email: string | null;
  };
}

export const useProductReviews = (productId: number) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          id,
          product_id,
          user_id,
          rating,
          comment,
          created_at,
          profiles (
            email
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      setTotalReviews(data?.length || 0);
      
      if (data && data.length > 0) {
        const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setAverageRating(Math.round(avgRating * 10) / 10);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (rating: number, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please log in to leave a review",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          comment: comment.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your review has been added",
      });

      fetchReviews();
      return true;
    } catch (error: any) {
      console.error('Error adding review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add review",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateReview = async (reviewId: number, rating: number, comment: string) => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .update({
          rating,
          comment: comment.trim() || null,
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your review has been updated",
      });

      fetchReviews();
      return true;
    } catch (error: any) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update review",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your review has been deleted",
      });

      fetchReviews();
      return true;
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return {
    reviews,
    loading,
    averageRating,
    totalReviews,
    addReview,
    updateReview,
    deleteReview,
    refetch: fetchReviews,
  };
};
