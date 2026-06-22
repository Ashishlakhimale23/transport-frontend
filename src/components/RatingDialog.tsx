import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { api } from "@/lib/axioapi";

interface RatingDialogProps {
  driverId: number;
  contractId: number;
  driverName: string;
  onSuccess?: () => void;
}

export const RatingDialog = ({
  driverId,
  contractId,
  driverName,
  onSuccess,
}: RatingDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/api/users/submit-rating", {
        ratedUserId: driverId,
        contractId: contractId,
        value: rating,
        comment: comment || null,
      });

      toast({
        title: "Rating Submitted",
        description: `You have rated ${driverName} ${rating} out of 5 stars.`,
        variant: "default",
      });

      setIsOpen(false);
      setRating(0);
      setComment("");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Submission Failed",
        description:
          error.response?.data?.error ||
          "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-50">
          <Star className="w-4 h-4 mr-2" />
          Rate Driver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {driverName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              ✓ Share your experience with this driver to help other contractors
              make informed decisions.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2 justify-center py-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      value <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {rating === 0 ? "Select a rating" : `You rated ${rating} out of 5`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share details about your experience with this driver..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/500 characters
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitRating} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
