
import React from 'react';
import { useRecommendations } from '@/hooks/useRecommendations';
import ProductCard, { Product } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Users, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface RecommendationsProps {
  className?: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({ className }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'hybrid' | 'content_based' | 'collaborative'>('hybrid');
  
  const { 
    recommendations, 
    loading, 
    error, 
    refetch 
  } = useRecommendations(activeTab, 8);

  // Fetch product details for recommendations
  useEffect(() => {
    const fetchProducts = async () => {
      if (recommendations.length === 0) return;

      const productIds = recommendations.map(r => r.product_id);
      
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (data) {
          // Sort products by recommendation score
          const sortedProducts = data
            .map(product => ({
              ...product,
              recommendationScore: recommendations.find(r => r.product_id === product.id)?.score || 0,
              recommendationReasons: recommendations.find(r => r.product_id === product.id)?.reasons || []
            }))
            .sort((a, b) => b.recommendationScore - a.recommendationScore);

          setProducts(sortedProducts);
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      }
    };

    fetchProducts();
  }, [recommendations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading recommendations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading recommendations: {error}</p>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8 bg-orange-50 rounded-lg">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-amber-600" />
        <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
        <p className="text-gray-600">
          Start browsing and interacting with products to get personalized recommendations!
        </p>
      </div>
    );
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'hybrid':
        return <Zap className="h-4 w-4" />;
      case 'content_based':
        return <TrendingUp className="h-4 w-4" />;
      case 'collaborative':
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTabDescription = (tab: string) => {
    switch (tab) {
      case 'hybrid':
        return 'Best of both worlds - combines your preferences with similar users';
      case 'content_based':
        return 'Based on your past interactions and preferences';
      case 'collaborative':
        return 'Based on users with similar tastes';
      default:
        return '';
    }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium text-amber-800">Recommended for You</h2>
          <Button 
            onClick={refetch} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="hybrid" className="flex items-center gap-2">
            {getTabIcon('hybrid')}
            Hybrid
          </TabsTrigger>
          <TabsTrigger value="content_based" className="flex items-center gap-2">
            {getTabIcon('content_based')}
            Content-Based
          </TabsTrigger>
          <TabsTrigger value="collaborative" className="flex items-center gap-2">
            {getTabIcon('collaborative')}
            Collaborative
          </TabsTrigger>
        </TabsList>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {getTabDescription(activeTab)}
          </p>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => {
                const recommendation = recommendations.find(r => r.product_id === product.id);
                return (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} />
                    
                    {/* Recommendation Score Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {Math.round((recommendation?.score || 0) * 100)}% match
                      </Badge>
                    </div>
                    
                    {/* Recommendation Reasons */}
                    {recommendation?.reasons && recommendation.reasons.length > 0 && (
                      <div className="mt-2 p-2 bg-orange-50 rounded text-xs">
                        <p className="font-medium text-amber-800 mb-1">Why recommended:</p>
                        <ul className="text-amber-700 space-y-1">
                          {recommendation.reasons.slice(0, 2).map((reason, index) => (
                            <li key={index}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No recommendations available for this type.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recommendations;
