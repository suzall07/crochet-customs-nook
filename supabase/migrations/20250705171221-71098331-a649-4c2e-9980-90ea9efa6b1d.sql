
-- Create table for user interactions (views, purchases, ratings)
CREATE TABLE public.user_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id BIGINT REFERENCES public.products(id) NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'purchase', 'cart_add', 'like')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for product features (for content-based filtering)
CREATE TABLE public.product_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id BIGINT REFERENCES public.products(id) NOT NULL,
  feature_name TEXT NOT NULL,
  feature_value TEXT NOT NULL,
  weight DECIMAL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user preferences
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  category TEXT NOT NULL,
  preference_score DECIMAL NOT NULL DEFAULT 0.0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category)
);

-- Create table for recommendations cache
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id BIGINT REFERENCES public.products(id) NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('content_based', 'collaborative', 'hybrid')),
  score DECIMAL NOT NULL,
  reasons JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours')
);

-- Create table for sentiment analysis results
CREATE TABLE public.sentiment_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id BIGINT REFERENCES public.product_reviews(id) NOT NULL,
  sentiment_score DECIMAL NOT NULL, -- -1 to 1 (negative to positive)
  sentiment_label TEXT NOT NULL CHECK (sentiment_label IN ('positive', 'negative', 'neutral')),
  confidence DECIMAL NOT NULL DEFAULT 0.0,
  keywords JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentiment_analysis ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_interactions
CREATE POLICY "Users can view their own interactions" ON public.user_interactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own interactions" ON public.user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own interactions" ON public.user_interactions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for product_features (public read, admin write)
CREATE POLICY "Everyone can view product features" ON public.product_features
  FOR SELECT USING (true);
CREATE POLICY "Admin can manage product features" ON public.product_features
  FOR ALL USING (is_admin((auth.jwt() ->> 'email'::text)));

-- RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for recommendations
CREATE POLICY "Users can view their own recommendations" ON public.recommendations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage recommendations" ON public.recommendations
  FOR ALL USING (true);

-- RLS policies for sentiment_analysis (public read for transparency)
CREATE POLICY "Everyone can view sentiment analysis" ON public.sentiment_analysis
  FOR SELECT USING (true);
CREATE POLICY "System can manage sentiment analysis" ON public.sentiment_analysis
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_user_interactions_user_id ON public.user_interactions(user_id);
CREATE INDEX idx_user_interactions_product_id ON public.user_interactions(product_id);
CREATE INDEX idx_product_features_product_id ON public.product_features(product_id);
CREATE INDEX idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX idx_recommendations_expires_at ON public.recommendations(expires_at);
CREATE INDEX idx_sentiment_analysis_review_id ON public.sentiment_analysis(review_id);

-- Insert sample product features for existing products
INSERT INTO public.product_features (product_id, feature_name, feature_value, weight) VALUES
(1, 'material', 'yarn', 1.0),
(1, 'color_family', 'warm', 0.8),
(1, 'size', 'large', 0.6),
(1, 'difficulty', 'intermediate', 0.4),
(2, 'material', 'yarn', 1.0),
(2, 'color_family', 'neutral', 0.8),
(2, 'size', 'small', 0.6),
(2, 'difficulty', 'beginner', 0.4),
(3, 'material', 'yarn', 1.0),
(3, 'color_family', 'neutral', 0.8),
(3, 'size', 'medium', 0.6),
(3, 'difficulty', 'intermediate', 0.4);
