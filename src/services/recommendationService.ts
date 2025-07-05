
import { supabase } from '@/integrations/supabase/client';

export interface UserInteraction {
  id: string;
  user_id: string;
  product_id: number;
  interaction_type: 'view' | 'purchase' | 'cart_add' | 'like';
  rating?: number;
  created_at: string;
}

export interface ProductFeature {
  id: string;
  product_id: number;
  feature_name: string;
  feature_value: string;
  weight: number;
}

export interface Recommendation {
  product_id: number;
  score: number;
  type: 'content_based' | 'collaborative' | 'hybrid';
  reasons: string[];
}

export interface SentimentResult {
  sentiment_score: number;
  sentiment_label: 'positive' | 'negative' | 'neutral';
  confidence: number;
  keywords: string[];
}

class RecommendationService {
  // Track user interactions
  async trackInteraction(productId: number, interactionType: 'view' | 'purchase' | 'cart_add' | 'like', rating?: number) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('User not authenticated, skipping interaction tracking');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_interactions' as any)
        .insert({
          user_id: user.id,
          product_id: productId,
          interaction_type: interactionType,
          rating
        });

      if (error) {
        console.error('Error tracking interaction:', error);
      }
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  // Content-based filtering
  async getContentBasedRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
    try {
      // Get user's interaction history
      const { data: interactions } = await supabase
        .from('user_interactions' as any)
        .select('product_id, interaction_type, rating')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!interactions || interactions.length === 0) {
        return [];
      }

      // Get features for interacted products
      const interactedProductIds = [...new Set(interactions.map((i: any) => i.product_id))];
      
      const { data: userProductFeatures } = await supabase
        .from('product_features' as any)
        .select('*')
        .in('product_id', interactedProductIds);

      // Calculate user preferences based on features
      const featurePreferences: Record<string, Record<string, number>> = {};
      
      userProductFeatures?.forEach((feature: any) => {
        if (!featurePreferences[feature.feature_name]) {
          featurePreferences[feature.feature_name] = {};
        }
        
        const interactionScore = this.calculateInteractionScore(
          interactions.filter((i: any) => i.product_id === feature.product_id)
        );
        
        featurePreferences[feature.feature_name][feature.feature_value] = 
          (featurePreferences[feature.feature_name][feature.feature_value] || 0) + 
          interactionScore * feature.weight;
      });

      // Get all product features
      const { data: allFeatures } = await supabase
        .from('product_features' as any)
        .select('*');

      // Calculate similarity scores for all products
      const productScores: Record<number, { score: number; reasons: string[] }> = {};
      
      allFeatures?.forEach((feature: any) => {
        if (interactedProductIds.includes(feature.product_id)) return;
        
        if (!productScores[feature.product_id]) {
          productScores[feature.product_id] = { score: 0, reasons: [] };
        }
        
        const userPref = featurePreferences[feature.feature_name]?.[feature.feature_value] || 0;
        if (userPref > 0) {
          productScores[feature.product_id].score += userPref * feature.weight;
          productScores[feature.product_id].reasons.push(
            `Similar ${feature.feature_name}: ${feature.feature_value}`
          );
        }
      });

      // Sort and return top recommendations
      return Object.entries(productScores)
        .sort(([, a], [, b]) => b.score - a.score)
        .slice(0, limit)
        .map(([productId, data]) => ({
          product_id: parseInt(productId),
          score: data.score,
          type: 'content_based' as const,
          reasons: data.reasons
        }));

    } catch (error) {
      console.error('Error getting content-based recommendations:', error);
      return [];
    }
  }

  // Collaborative filtering
  async getCollaborativeRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
    try {
      // Get user's interactions
      const { data: userInteractions } = await supabase
        .from('user_interactions' as any)
        .select('product_id, interaction_type, rating')
        .eq('user_id', userId);

      if (!userInteractions || userInteractions.length === 0) {
        return [];
      }

      const userProductIds = new Set(userInteractions.map((i: any) => i.product_id));

      // Find similar users based on common interactions
      const { data: allInteractions } = await supabase
        .from('user_interactions' as any)
        .select('user_id, product_id, interaction_type, rating')
        .in('product_id', Array.from(userProductIds))
        .neq('user_id', userId);

      // Calculate user similarity
      const userSimilarity: Record<string, { score: number; commonProducts: number[] }> = {};
      
      allInteractions?.forEach((interaction: any) => {
        if (!userSimilarity[interaction.user_id]) {
          userSimilarity[interaction.user_id] = { score: 0, commonProducts: [] };
        }
        
        if (userProductIds.has(interaction.product_id)) {
          userSimilarity[interaction.user_id].score += 1;
          userSimilarity[interaction.user_id].commonProducts.push(interaction.product_id);
        }
      });

      // Get recommendations from similar users
      const similarUsers = Object.entries(userSimilarity)
        .filter(([, data]) => data.score >= 2) // At least 2 common products
        .sort(([, a], [, b]) => b.score - a.score)
        .slice(0, 5); // Top 5 similar users

      if (similarUsers.length === 0) {
        return [];
      }

      const { data: similarUserInteractions } = await supabase
        .from('user_interactions' as any)
        .select('product_id, interaction_type, rating, user_id')
        .in('user_id', similarUsers.map(([userId]) => userId));

      // Calculate product scores based on similar users
      const productScores: Record<number, { score: number; reasons: string[] }> = {};
      
      similarUserInteractions?.forEach((interaction: any) => {
        if (userProductIds.has(interaction.product_id)) return;
        
        if (!productScores[interaction.product_id]) {
          productScores[interaction.product_id] = { score: 0, reasons: [] };
        }
        
        const userSim = userSimilarity[interaction.user_id]?.score || 0;
        const interactionScore = this.calculateInteractionScore([interaction]);
        
        productScores[interaction.product_id].score += userSim * interactionScore;
        productScores[interaction.product_id].reasons.push(
          `Liked by similar users (${userSim} common products)`
        );
      });

      return Object.entries(productScores)
        .sort(([, a], [, b]) => b.score - a.score)
        .slice(0, limit)
        .map(([productId, data]) => ({
          product_id: parseInt(productId),
          score: data.score,
          type: 'collaborative' as const,
          reasons: [...new Set(data.reasons)]
        }));

    } catch (error) {
      console.error('Error getting collaborative recommendations:', error);
      return [];
    }
  }

  // Sentiment analysis
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      // Simple sentiment analysis using keyword matching
      const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'beautiful', 'wonderful', 'fantastic', 'good', 'nice', 'quality', 'recommend'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'poor', 'disappointing', 'waste', 'worst', 'cheap', 'flimsy'];
      
      const words = text.toLowerCase().split(/\W+/);
      let positiveScore = 0;
      let negativeScore = 0;
      const foundKeywords: string[] = [];

      words.forEach(word => {
        if (positiveWords.includes(word)) {
          positiveScore++;
          foundKeywords.push(word);
        } else if (negativeWords.includes(word)) {
          negativeScore++;
          foundKeywords.push(word);
        }
      });

      const totalScore = positiveScore + negativeScore;
      let sentimentScore = 0;
      let sentimentLabel: 'positive' | 'negative' | 'neutral' = 'neutral';
      let confidence = 0;

      if (totalScore > 0) {
        sentimentScore = (positiveScore - negativeScore) / Math.max(totalScore, 1);
        
        if (sentimentScore > 0.2) {
          sentimentLabel = 'positive';
        } else if (sentimentScore < -0.2) {
          sentimentLabel = 'negative';
        }
        
        confidence = Math.abs(sentimentScore);
      }

      return {
        sentiment_score: sentimentScore,
        sentiment_label: sentimentLabel,
        confidence,
        keywords: foundKeywords
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        sentiment_score: 0,
        sentiment_label: 'neutral',
        confidence: 0,
        keywords: []
      };
    }
  }

  // Save sentiment analysis to database
  async saveSentimentAnalysis(reviewId: number, sentimentResult: SentimentResult) {
    try {
      const { error } = await supabase
        .from('sentiment_analysis' as any)
        .insert({
          review_id: reviewId,
          sentiment_score: sentimentResult.sentiment_score,
          sentiment_label: sentimentResult.sentiment_label,
          confidence: sentimentResult.confidence,
          keywords: sentimentResult.keywords
        });

      if (error) {
        console.error('Error saving sentiment analysis:', error);
      }
    } catch (error) {
      console.error('Error saving sentiment analysis:', error);
    }
  }

  // Get hybrid recommendations (combines content-based and collaborative)
  async getHybridRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
    try {
      const [contentBased, collaborative] = await Promise.all([
        this.getContentBasedRecommendations(userId, limit),
        this.getCollaborativeRecommendations(userId, limit)
      ]);

      // Combine and weight the recommendations
      const combinedScores: Record<number, { score: number; reasons: string[]; types: string[] }> = {};

      // Weight content-based recommendations (60%)
      contentBased.forEach(rec => {
        combinedScores[rec.product_id] = {
          score: rec.score * 0.6,
          reasons: rec.reasons,
          types: ['content-based']
        };
      });

      // Weight collaborative recommendations (40%)
      collaborative.forEach(rec => {
        if (combinedScores[rec.product_id]) {
          combinedScores[rec.product_id].score += rec.score * 0.4;
          combinedScores[rec.product_id].reasons.push(...rec.reasons);
          combinedScores[rec.product_id].types.push('collaborative');
        } else {
          combinedScores[rec.product_id] = {
            score: rec.score * 0.4,
            reasons: rec.reasons,
            types: ['collaborative']
          };
        }
      });

      return Object.entries(combinedScores)
        .sort(([, a], [, b]) => b.score - a.score)
        .slice(0, limit)
        .map(([productId, data]) => ({
          product_id: parseInt(productId),
          score: data.score,
          type: 'hybrid' as const,
          reasons: [...new Set(data.reasons)]
        }));

    } catch (error) {
      console.error('Error getting hybrid recommendations:', error);
      return [];
    }
  }

  // Helper method to calculate interaction score
  private calculateInteractionScore(interactions: any[]): number {
    let score = 0;
    interactions.forEach(interaction => {
      switch (interaction.interaction_type) {
        case 'view':
          score += 1;
          break;
        case 'cart_add':
          score += 2;
          break;
        case 'like':
          score += 3;
          break;
        case 'purchase':
          score += 5;
          break;
      }
      
      if (interaction.rating) {
        score += interaction.rating;
      }
    });
    
    return score;
  }

  // Cache recommendations
  async cacheRecommendations(userId: string, recommendations: Recommendation[]) {
    try {
      // Clear existing cache for user
      await supabase
        .from('recommendations' as any)
        .delete()
        .eq('user_id', userId);

      // Insert new recommendations
      const recommendationsToInsert = recommendations.map(rec => ({
        user_id: userId,
        product_id: rec.product_id,
        recommendation_type: rec.type,
        score: rec.score,
        reasons: rec.reasons
      }));

      const { error } = await supabase
        .from('recommendations' as any)
        .insert(recommendationsToInsert);

      if (error) {
        console.error('Error caching recommendations:', error);
      }
    } catch (error) {
      console.error('Error caching recommendations:', error);
    }
  }

  // Get cached recommendations
  async getCachedRecommendations(userId: string): Promise<Recommendation[]> {
    try {
      const { data: cachedRecs } = await supabase
        .from('recommendations' as any)
        .select('*')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .order('score', { ascending: false });

      if (!cachedRecs || cachedRecs.length === 0) {
        return [];
      }

      return cachedRecs.map((rec: any) => ({
        product_id: rec.product_id,
        score: rec.score,
        type: rec.recommendation_type as 'content_based' | 'collaborative' | 'hybrid',
        reasons: rec.reasons || []
      }));
    } catch (error) {
      console.error('Error getting cached recommendations:', error);
      return [];
    }
  }
}

export const recommendationService = new RecommendationService();
