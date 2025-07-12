
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2 } from 'lucide-react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { ProductReview } from '@/hooks/useProductReviews';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface ReviewItemProps {
  review: ProductReview;
  onUpdate: (reviewId: number, rating: number, comment: string) => Promise<boolean>;
  onDelete: (reviewId: number) => Promise<boolean>;
}

const ReviewItem = ({ review, onUpdate, onDelete }: ReviewItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [authorName, setAuthorName] = useState('Anonymous User');

  useEffect(() => {
    const checkOwnership = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsOwner(user?.id === review.user_id);
    };
    
    checkOwnership();
    
    // Extract name from email or use default
    if (review.profiles?.email) {
      const emailName = review.profiles.email.split('@')[0];
      const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      setAuthorName(displayName);
    }
  }, [review.user_id, review.profiles?.email]);

  const handleUpdate = async (rating: number, comment: string) => {
    const success = await onUpdate(review.id, rating, comment);
    if (success) {
      setIsEditing(false);
    }
    return success;
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      await onDelete(review.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isEditing) {
    return (
      <ReviewForm
        existingReview={review}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <StarRating rating={review.rating} size="sm" />
                <span className="font-medium text-gray-900">{authorName}</span>
                <span className="text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </span>
              </div>
            </div>
            
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {review.comment && (
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewItem;
