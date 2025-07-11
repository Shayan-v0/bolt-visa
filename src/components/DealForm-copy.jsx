import React, { useState, useEffect, useMemo } from 'react';
import { useDeals } from '@/hooks/useDeals';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { countries } from '@/data/countries';
import { FileText, User, MapPin, CreditCard, Wallet, Search } from 'lucide-react';

const DealForm = ({ isOpen, onClose, deal = null }) => {
  const { addDeal, updateDeal } = useDeals();
  const [formData, setFormData] = useState({
    dealType: 'main',
    firstName: '',
    lastName: '',
    passportNumber: '',
    nationality: '',
    phoneNumber: '',
    applyFrom: '',
    applyFor: '',
    totalAmount: '',
    paidAmount: '',
    remainingPayment: '',
    currency: 'PKR',
    paymentMethod: 'online',
    installments: {
      first: { amount: '', paid: false, paymentMethod: 'online' },
      second: { amount: '', paid: false, paymentMethod: 'online' },
      third: { amount: '', paid: false, paymentMethod: 'online' },
      fourth: { amount: '', paid: false, paymentMethod: 'online' }
    },
    bonusType: '',
    promoCode: '',
    status: 'pending'
  });

  useEffect(() => {
    if (deal) {
      setFormData(prev => ({
        ...prev,
        ...deal,
        totalAmount: deal.totalAmount || '',
        paidAmount: deal.paidAmount || '',
        remainingPayment: deal.remainingPayment || '',
        installments: deal.installments || {
          first: { amount: '', paid: false, paymentMethod: 'online' },
          second: { amount: '', paid: false, paymentMethod: 'online' },
          third: { amount: '', paid: false, paymentMethod: 'online' },
          fourth: { amount: '', paid: false, paymentMethod: 'online' }
        }
      }));
    } else {
      setFormData({
        dealType: 'main',
        firstName: '',
        lastName: '',
        passportNumber: '',
        nationality: '',
        phoneNumber: '',
        applyFrom: '',
        applyFor: '',
        totalAmount: '',
        paidAmount: '',
        remainingPayment: '',
        currency: 'PKR',
        paymentMethod: 'online',
        installments: {
          first: { amount: '', paid: false, paymentMethod: 'online' },
          second: { amount: '', paid: false, paymentMethod: 'online' },
          third: { amount: '', paid: false, paymentMethod: 'online' },
          fourth: { amount: '', paid: false, paymentMethod: 'online' }
        },
        bonusType: '',
        promoCode: '',
        status: 'pending'
      });
    }
  }, [deal, isOpen]);

  useEffect(() => {
    const totalPaid = Object.values(formData.installments).reduce((sum, inst) => {
      return inst.paid && inst.amount ? sum + parseFloat(inst.amount) : sum;
    }, 0);
    const remaining = parseFloat(formData.totalAmount || 0) - totalPaid;
    setFormData(prev => ({
      ...prev,
      paidAmount: totalPaid > 0 ? totalPaid.toString() : '',
      remainingPayment: remaining > 0 || parseFloat(formData.totalAmount || 0) > 0 ? remaining.toString() : ''
    }));
  }, [formData.installments, formData.totalAmount]);


  const dealTypes = [
    { value: 'main', label: 'Main Deal (2000 PKR Reward)', reward: 2000 },
    { value: 'reference', label: 'Reference Deal (1000 PKR Reward)', reward: 1000 }
  ];

  const currencies = [
    { value: 'PKR', label: 'Pakistani Rupee (PKR)', symbol: '₨' },
    { value: 'AED', label: 'UAE Dirham (AED)', symbol: 'د.إ' },
    { value: 'USD', label: 'US Dollar (USD)', symbol: '$' }
  ];

  const paymentMethods = [
    { value: 'online', label: 'Online Transfer' },
    { value: 'cash', label: 'Cash Payment' },
    { value: 'payment_link', label: 'Payment Link' },
    { value: 'money_exchange', label: 'Money Exchange' },
    { value: 'cryptocurrency', label: 'Cryptocurrency' }
  ];

  const bonusTypes = [
    'Performance Bonus',
    'Monthly Target Bonus',
    'Special Achievement',
    'Team Bonus',
    'Holiday Bonus'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let totalPaidFromInstallments = 0;
    Object.values(formData.installments).forEach(inst => {
      if (inst.paid && inst.amount) {
        totalPaidFromInstallments += parseFloat(inst.amount);
      }
    });
    
    const remaining = parseFloat(formData.totalAmount || 0) - totalPaidFromInstallments;
    const finalData = {
      ...formData,
      paidAmount: totalPaidFromInstallments > 0 ? totalPaidFromInstallments.toString() : '',
      remainingPayment: remaining > 0 || parseFloat(formData.totalAmount || 0) > 0 ? remaining.toString() : ''
    };
    
    if (deal) {
      const result = updateDeal(deal.id, finalData);
      if (result.success) {
        toast({
          title: "Deal updated!",
          description: "Your deal has been successfully updated.",
        });
        onClose();
      }
    } else {
      const result = addDeal(finalData);
      if (result.success) {
        const reward = formData.dealType === 'main' ? 2000 : 1000;
        toast({
          title: "Deal submitted successfully!",
          description: `Case ID: ${result.caseId} | Reward: ${reward} PKR for approved deal.`,
        });
        onClose();
      }
    }
  };

  const handleAmountChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      let totalPaid = 0;
      Object.values(updated.installments).forEach(inst => {
        if (inst.paid && inst.amount) {
          totalPaid += parseFloat(inst.amount);
        }
      });
      updated.paidAmount = totalPaid > 0 ? totalPaid.toString() : '';
      const remaining = (parseFloat(updated.totalAmount || 0) - totalPaid);
      updated.remainingPayment = remaining > 0 || parseFloat(updated.totalAmount || 0) > 0 ? remaining.toString() : '';
      return updated;
    });
  };

  const handleInstallmentChange = (installmentKey, field, value) => {
    setFormData(prev => {
      const newInstallments = {
        ...prev.installments,
        [installmentKey]: {
          ...prev.installments[installmentKey],
          [field]: field === 'paid' ? value : value
        }
      };
      let totalPaid = 0;
      Object.values(newInstallments).forEach(inst => {
        if (inst.paid && inst.amount) {
          totalPaid += parseFloat(inst.amount);
        }
      });
      const remaining = (parseFloat(prev.totalAmount || 0) - totalPaid);
      return {
        ...prev,
        installments: newInstallments,
        paidAmount: totalPaid > 0 ? totalPaid.toString() : '',
        remainingPayment: remaining > 0 || parseFloat(prev.totalAmount || 0) > 0 ? remaining.toString() : ''
      };
    });
  };

  const selectedCurrency = currencies.find(c => c.value === formData.currency);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-purple-500/20 text-white max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5 text-purple-400" />
            {deal ? 'Edit Deal' : 'Add New Deal'}
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            {deal ? 'Update deal information' : 'Submit a new visa application deal'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Deal Type & Reward</Label>
              <Select value={formData.dealType} onValueChange={(value) => setFormData(prev => ({ ...prev, dealType: value }))}>
                <SelectTrigger className="glass-effect border-purple-500/20 text-white">
                  <SelectValue placeholder="Select deal type" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-purple-500/20">
                  {dealTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-white">Overall Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                <SelectTrigger className="glass-effect border-purple-500/20 text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-purple-500/20">
                  {paymentMethods.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center mb-3">
              <User className="mr-2 h-5 w-5 text-purple-400" />
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="First Name" id="firstName" value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} placeholder="Client's first name" required />
              <InputGroup label="Last Name" id="lastName" value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} placeholder="Client's last name" required />
              <InputGroup label="Passport Number" id="passportNumber" value={formData.passportNumber} onChange={(e) => setFormData(prev => ({ ...prev, passportNumber: e.target.value }))} placeholder="Passport number" required />
              <InputGroup label="Phone Number" id="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))} placeholder="+92 300 1234567" required />
              <SelectGroupWithSearch label="Nationality" id="nationality" value={formData.nationality} onValueChange={(value) => setFormData(prev => ({ ...prev, nationality: value }))} placeholder="Select nationality" options={countries.map(c => ({value: c.name, label: c.name}))} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white flex items-center mb-3">
              <MapPin className="mr-2 h-5 w-5 text-purple-400" />
              Application Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectGroupWithSearch label="Apply From" id="applyFrom" value={formData.applyFrom} onValueChange={(value) => setFormData(prev => ({ ...prev, applyFrom: value }))} placeholder="Select country" options={countries.map(c => ({value: c.name, label: c.name}))} />
              <SelectGroupWithSearch label="Apply For (Destination)" id="applyFor" value={formData.applyFor} onValueChange={(value) => setFormData(prev => ({ ...prev, applyFor: value }))} placeholder="Select destination" options={countries.map(c => ({value: c.name, label: c.name}))} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white flex items-center mb-3">
              <CreditCard className="mr-2 h-5 w-5 text-purple-400" />
              Financials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectGroupComp label="Currency" id="currency" value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))} placeholder="Select currency" options={currencies} />
              <InputGroup label={`Total Amount (${selectedCurrency?.symbol})`} id="totalAmount" type="number" value={formData.totalAmount} onChange={(e) => handleAmountChange('totalAmount', e.target.value)} placeholder="" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <InputGroup label={`Paid Amount (${selectedCurrency?.symbol})`} id="paidAmount" type="number" value={formData.paidAmount} readOnly className="bg-purple-500/10" placeholder="" />
              <InputGroup label={`Remaining (${selectedCurrency?.symbol})`} id="remainingPayment" type="number" value={formData.remainingPayment} readOnly className="bg-purple-500/10" placeholder="" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center mb-3">
              <Wallet className="mr-2 h-5 w-5 text-purple-400" />
              Installments (Optional)
            </h3>
            {Object.entries(formData.installments).map(([key, inst], index) => (
              <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 border border-purple-500/20 rounded-lg">
                <InputGroup label={`${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Installment Amount`} id={`${key}Amount`} type="number" value={inst.amount || ''} onChange={(e) => handleInstallmentChange(key, 'amount', e.target.value)} placeholder="" />
                <SelectGroupComp label="Payment Method" id={`${key}PaymentMethod`} value={inst.paymentMethod} onValueChange={(value) => handleInstallmentChange(key, 'paymentMethod', value)} placeholder="Method" options={paymentMethods} />
                <div className="flex items-end">
                   <Button type="button" variant={inst.paid ? "secondary" : "outline"} onClick={() => handleInstallmentChange(key, 'paid', !inst.paid)} className="w-full">
                    {inst.paid ? 'Paid' : 'Mark as Paid'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectGroupComp label="Bonus Type (Optional)" id="bonusType" value={formData.bonusType} onValueChange={(value) => setFormData(prev => ({ ...prev, bonusType: value }))} placeholder="Select bonus type" options={bonusTypes.map(b => ({value: b, label: b}))} />
            <InputGroup label="Promo Code (Optional)" id="promoCode" value={formData.promoCode} onChange={(e) => setFormData(prev => ({ ...prev, promoCode: e.target.value }))} placeholder="Enter promo code" />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-purple-500/20 text-white hover:bg-purple-500/10">Cancel</Button>
            <Button type="submit" className="bolt-gradient hover:scale-105 transition-transform">{deal ? 'Update' : 'Submit'} Deal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const InputGroup = ({ label, id, ...props }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-white">{label}</Label>
    <Input id={id} className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300" {...props} />
  </div>
);

const SelectGroupComp = ({ label, id, value, onValueChange, placeholder, options }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-white">{label}</Label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className="glass-effect border-purple-500/20 text-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="glass-effect border-purple-500/20 max-h-60">
        <SelectGroup>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

const SelectGroupWithSearch = ({ label, id, value, onValueChange, placeholder, options }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="glass-effect border-purple-500/20 text-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="glass-effect border-purple-500/20 max-h-72">
          <div className="p-2 sticky top-0 bg-[hsl(var(--popover))] z-10">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300" />
              <Input
                type="text"
                placeholder="Search..."
                className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300 pl-8 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
          </div>
          <SelectGroup className="overflow-y-auto max-h-[calc(18rem-3rem)]">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-center text-purple-300 text-sm">No countries found.</div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};


export default DealForm;    