import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { XCircle } from 'lucide-react';

const RejectDealDialog = ({ deal, isOpen, onClose, rejectionReason, setRejectionReason, onConfirmReject }) => {
  if (!deal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <XCircle className="mr-2 h-5 w-5 text-red-400" />
            Reject Deal: {deal.caseId}
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            Provide a reason for rejecting this deal. This action cannot be undone easily.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="rejectionReason" className="text-white">Rejection Reason</Label>
            <Input
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Incomplete documentation, invalid information"
              className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300 mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-purple-500/20 text-white hover:bg-purple-500/10"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirmReject(deal._id)}
            disabled={!rejectionReason.trim()}
          >
            Confirm Rejection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDealDialog;