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
import { CheckCircle } from "lucide-react";
import { api } from "@/lib/axioapi";

interface DeliveryConfirmationModalProps {
  contractId: number;
  onSuccess?: () => void;
}

export const DeliveryConfirmationModal = ({
  contractId,
  onSuccess,
}: DeliveryConfirmationModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [deliverableNotes, setDeliverableNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelivery = async () => {
    try {
      setIsLoading(true);
      const response = await api.put(
        `/api/contracts/${contractId}/confirm-delivery`,
        {
          deliverableNotes,
        }
      );

      toast({
        title: "Delivery Confirmed",
        description:
          "Delivery has been confirmed and admin has been notified via email.",
        variant: "default",
      });

      setIsOpen(false);
      setDeliverableNotes("");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      toast({
        title: "Confirmation Failed",
        description:
          error.response?.data?.error ||
          "Failed to confirm delivery. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Confirm Delivery
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Delivery</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ✓ Confirm that the goods have been successfully delivered to the
              contractor. An email notification will be sent to the admin with
              payment details.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Delivery Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about the delivery (e.g., condition of goods, special instructions completed, etc.)"
              value={deliverableNotes}
              onChange={(e) => setDeliverableNotes(e.target.value)}
              className="resize-none"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Max 500 characters
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
            <Button
              onClick={handleConfirmDelivery}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Confirming..." : "Confirm Delivery"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
