import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import qrImage from "@/assets/image.png";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  bidAmount: number;
  bidId: number;
  onConfirm: () => void;
  isLoading?: boolean;
}

const PaymentModal = ({
  open,
  onClose,
  bidAmount,
  bidId,
  onConfirm,
  isLoading = false,
}: PaymentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Confirmation Required</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          {/* QR Code Image */}
          <div className="bg-muted rounded-lg p-8 flex items-center justify-center w-64 h-64 border-2 border-dashed border-border">
            <img src={qrImage} alt="Scan to pay" className="w-full h-full object-contain" />
          </div>

          {/* Payment Details */}
          <div className="w-full space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bid ID:</span>
              <span className="font-medium">{bidId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">₹{bidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode:</span>
              <span className="font-medium">UPI / Digital</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg text-center">
            <p>Please scan the QR code above with your phone to complete the payment.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Processing..." : "Payment Confirmed"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
