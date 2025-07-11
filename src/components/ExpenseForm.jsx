import React, { useState, useEffect } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Upload, X, DollarSign } from 'lucide-react';

const ExpenseForm = ({ isOpen, onClose, expense = null, onSave, isFixedExpense = false }) => {
  const { addExpense, updateExpense } = useExpenses();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    receipt: null,
    currency: 'AED',
    type: '',
    isRecurring: false,
  });
  const [receiptPreview, setReceiptPreview] = useState(null);

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || '',
        description: expense.description || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        receipt: expense.receipt || null,
        currency: expense.currency || 'AED',
        type: expense.type || '',
        isRecurring: expense.isRecurring || false,
      });
      setReceiptPreview(expense.receipt || null);
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        receipt: null,
        currency: 'AED',
        type: '',
        isRecurring: false,
      });
      setReceiptPreview(null);
    }
  }, [expense, isOpen]);

  const categories = [
    'Travel',
    'Meals',
    'Office Supplies',
    'Software',
    'Training',
    'Marketing',
    'Equipment',
    'Utilities',
    'Maintenance',
    'Other'
  ];

  const fixedExpenseCategories = [
    { value: 'office_rent', label: 'Office Rent' },
    { value: 'staff_salary', label: 'Staff Salary' },
  ];

  const currencies = [
    { value: 'PKR', label: 'Pakistani Rupee (PKR)' },
    { value: 'AED', label: 'UAE Dirham (AED)' },
    { value: 'USD', label: 'US Dollar (USD)' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (isFixedExpense) {
      dataToSave.category = 'Fixed Expenses';
      dataToSave.isRecurring = true;
    }
    
    let result;
    if (expense && expense.id) {
      result = updateExpense(expense.id, dataToSave);
      if (result.success) {
        toast({ title: "Expense updated!", description: "Expense details have been successfully updated." });
      }
    } else {
      result = addExpense(dataToSave);
      if (result.success) {
        toast({ title: "Expense added!", description: "New expense has been successfully added." });
      }
    }
    
    if (result.success) {
      onClose();
    } else {
      toast({ title: "Error", description: result.error || "Failed to save expense.", variant: "destructive" });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setFormData(prev => ({ ...prev, receipt: dataUrl }));
        setReceiptPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setFormData(prev => ({ ...prev, receipt: null }));
    setReceiptPreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-purple-500/20 text-white max-w-md max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-purple-400" />
            {expense?.id ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            {expense?.id ? 'Update expense details' : 'Submit a new expense record'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Expense title"
              className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
              required
              disabled={isFixedExpense && expense?.type}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-white">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger className="glass-effect border-purple-500/20 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-purple-500/20">
                  {currencies.map(curr => (
                    <SelectItem key={curr.value} value={curr.value}>{curr.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="text-white">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="glass-effect border-purple-500/20 text-white"
              required
            />
          </div>

          {isFixedExpense ? (
             <div className="space-y-2">
              <Label htmlFor="expenseType" className="text-white">Expense Type</Label>
               <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value, title: fixedExpenseCategories.find(cat => cat.value === value)?.label || '' }))}
                disabled={!!expense?.type}
               >
                <SelectTrigger className="glass-effect border-purple-500/20 text-white">
                  <SelectValue placeholder="Select fixed expense type" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-purple-500/20">
                  {fixedExpenseCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                   <SelectItem value="travel">Travel Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, type: value.toLowerCase().replace(/\s+/g, '_') }))}>
                <SelectTrigger className="glass-effect border-purple-500/20 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-purple-500/20">
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Expense description (optional)"
              className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
            />
          </div>

          {!isFixedExpense && (
            <div className="space-y-2">
              <Label className="text-white">Receipt (Optional)</Label>
              {receiptPreview ? (
                <div className="relative">
                  <img 
                    src={receiptPreview} 
                    alt="Receipt preview" 
                    className="w-full h-32 object-cover rounded-lg border border-purple-500/20"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={removeReceipt}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-purple-500/20 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-purple-300 mb-2" />
                  <p className="text-purple-300 text-sm mb-2">Upload receipt image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('receipt-upload').click()}
                    className="border-purple-500/20 text-white hover:bg-purple-500/10"
                  >
                    Choose File
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-purple-500/20 text-white hover:bg-purple-500/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bolt-gradient hover:scale-105 transition-transform"
            >
              {expense?.id ? 'Update' : 'Submit'} Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm;