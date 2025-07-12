import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';
import { useProductReviews, ProductReview } from '@/hooks/useProductReviews';
import { supabase } from '@/integrations/supabase/client';

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const {
    reviews,
    loading,
    averageRating,
    totalReviews,
    addReview,
    updateReview,
    deleteReview,
  } = useProductReviews(productId);

  const [showReviewForm, setShowReviewForm] = useState(false);  
  const [userReview, setUserReview] = useState<ProductReview | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserReview = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      
      if (user) {
        const existingReview = reviews.find(review => review.user_id === user.id);
        setUserReview(existingReview || null);
      } else {
        setUserReview(null);
      }
    };

    checkUserReview();
  }, [reviews]);

  const handleAddReview = async (rating: number, comment: string) => {
    const success = await addReview(rating, comment);
    if (success) {
      setShowReviewForm(false);
    }
    return success;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  const distribution = getRatingDistribution();
  const otherReviews = reviews.filter(review => review.user_id !== userReview?.user_id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            {isLoggedIn && !userReview && !showReviewForm && (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-black hover:bg-gray-800 text-white"
              >
                Write a Review
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {totalReviews > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating Summary */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <StarRating rating={averageRating} size="lg" />
                  <p className="text-sm text-gray-600 mt-2">
                    Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = distribution[rating as keyof typeof distribution];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-8">{rating}</span>
                      <StarRating rating={1} size="sm" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No reviews yet</p>
              <p className="text-sm text-gray-400">Be the first to review this product!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          onSubmit={handleAddReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* User's Review */}
      {userReview && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Review</h3>
          <ReviewItem
            review={userReview}
            onUpdate={updateReview}
            onDelete={deleteReview}
          />
          <Separator />
        </div>
      )}

      {/* Other Reviews */}
      {otherReviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {userReview ? 'Other Reviews' : 'Reviews'} ({otherReviews.length})
          </h3>
          <div className="space-y-4">
            {otherReviews.map(review => (
              <ReviewItem
                key={review.id}
                review={review}
                onUpdate={updateReview}
                onDelete={deleteReview}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
