import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Edit, Trash2, Eye, Check, X, Receipt, DollarSign } from 'lucide-react';
import ExpenseForm from '@/components/ExpenseForm';
import { useExpenses } from '@/hooks/useExpenses';

const ExpenseList = ({ expenses, isAdmin, onEdit, title = "Expenses" }) => {
  const { deleteExpense, approveExpense, rejectExpense } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const handleApprove = (id) => {
    const result = approveExpense(id);
    if (result.success) {
      toast({ title: "Expense approved!", description: "The expense has been approved." });
    }
  };

  const handleFinalReject = (id) => {
    const result = rejectExpense(id, rejectionReason);
    if (result.success) {
      toast({ title: "Expense rejected", description: "The expense has been rejected." });
      setShowRejectDialog(null);
      setRejectionReason('');
    }
  };

  const handleDelete = (id) => {
    const result = deleteExpense(id);
    if (result.success) {
      toast({ title: "Expense deleted", description: "The expense has been deleted." });
    }
  };

  if (expenses.length === 0) {
    return (
      <Card className="visa-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Receipt className="h-12 w-12 text-purple-400/50 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No {title.toLowerCase()} found</h3>
          <p className="text-purple-300 text-center">
            {isAdmin ? `No ${title.toLowerCase()} have been submitted yet.` : `You haven't submitted any ${title.toLowerCase()} yet.`}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      {expenses.map((expense, index) => (
        <motion.div
          key={expense.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="visa-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <CardTitle className="text-white text-base sm:text-lg">{expense.title}</CardTitle>
                  <p className="text-purple-300 text-xs sm:text-sm mt-1">
                    {isAdmin && expense.userName && `${expense.userName} • `}
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2 self-start sm:self-center">
                  <Badge className={getStatusColor(expense.status)}>
                    {expense.status}
                  </Badge>
                  <span className="text-lg sm:text-xl font-bold text-white">
                    {parseFloat(expense.amount).toLocaleString()} {expense.currency}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {expense.description && (
                <p className="text-purple-200 mb-4 text-sm">{expense.description}</p>
              )}
              
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex space-x-2 mb-2 sm:mb-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExpense(expense)}
                    className="border-purple-500/20 text-white hover:bg-purple-500/10"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  {(!isAdmin || expense.status === 'pending') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(expense)}
                      className="border-purple-500/20 text-white hover:bg-purple-500/10"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  
                   <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                </div>

                {isAdmin && expense.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(expense.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowRejectDialog(expense)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {selectedExpense && (
        <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
          <DialogContent className="glass-effect border-purple-500/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                 <DollarSign className="mr-2 h-5 w-5 text-purple-400" />
                {selectedExpense.title}
              </DialogTitle>
              <DialogDescription className="text-purple-300">
                Expense details and receipt
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-300 text-xs">Amount</Label>
                  <p className="text-white font-semibold">{parseFloat(selectedExpense.amount).toLocaleString()} {selectedExpense.currency}</p>
                </div>
                <div>
                  <Label className="text-purple-300 text-xs">Category</Label>
                  <p className="text-white">{selectedExpense.category}</p>
                </div>
                <div>
                  <Label className="text-purple-300 text-xs">Date</Label>
                  <p className="text-white">{new Date(selectedExpense.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-purple-300 text-xs">Status</Label>
                  <Badge className={`${getStatusColor(selectedExpense.status)} mt-1`}>
                    {selectedExpense.status}
                  </Badge>
                </div>
              </div>
              
              {selectedExpense.description && (
                <div>
                  <Label className="text-purple-300 text-xs">Description</Label>
                  <p className="text-white text-sm">{selectedExpense.description}</p>
                </div>
              )}
              
              {selectedExpense.receipt && (
                <div>
                  <Label className="text-purple-300 text-xs">Receipt</Label>
                  <img 
                    src={selectedExpense.receipt} 
                    alt="Receipt" 
                    className="w-full rounded-lg border border-purple-500/20 mt-1"
                  />
                </div>
              )}
              
              {selectedExpense.rejectionReason && (
                <div>
                  <Label className="text-purple-300 text-xs">Rejection Reason</Label>
                  <p className="text-red-400 text-sm">{selectedExpense.rejectionReason}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showRejectDialog && (
        <Dialog open={!!showRejectDialog} onOpenChange={() => setShowRejectDialog(null)}>
          <DialogContent className="glass-effect border-purple-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Reject Expense</DialogTitle>
              <DialogDescription className="text-purple-300">
                Please provide a reason for rejecting this expense.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason" className="text-white">Rejection Reason</Label>
                <Input
                  id="reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection"
                  className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectDialog(null)}
                  className="border-purple-500/20 text-white hover:bg-purple-500/10"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleFinalReject(showRejectDialog.id)}
                  disabled={!rejectionReason.trim()}
                >
                  Reject Expense
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ExpenseList;