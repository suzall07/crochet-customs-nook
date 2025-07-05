
import { useState, useEffect } from 'react';
import { recommendationService, Recommendation } from '@/services/recommendationService';
import { supabase } from '@/integrations/supabase/client';

export const useRecommendations = (type: 'content_based' | 'collaborative' | 'hybrid' = 'hybrid', limit: number = 10) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRecommendations([]);
        return;
      }

      // Try to get cached recommendations first
      let recs = await recommendationService.getCachedRecommendations(user.id);
      
      if (recs.length === 0) {
        // Generate new recommendations
        switch (type) {
          case 'content_based':
            recs = await recommendationService.getContentBasedRecommendations(user.id, limit);
            break;
          case 'collaborative':
            recs = await recommendationService.getCollaborativeRecommendations(user.id, limit);
            break;
          case 'hybrid':
          default:
            recs = await recommendationService.getHybridRecommendations(user.id, limit);
            break;
        }

        // Cache the recommendations
        if (recs.length > 0) {
          await recommendationService.cacheRecommendations(user.id, recs);
        }
      }

      setRecommendations(recs);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [type, limit]);

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations
  };
};

export const useInteractionTracking = () => {
  const trackInteraction = async (
    productId: number, 
    interactionType: 'view' | 'purchase' | 'cart_add' | 'like', 
    rating?: number
  ) => {
    try {
      await recommendationService.trackInteraction(productId, interactionType, rating);
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  return { trackInteraction };
};
