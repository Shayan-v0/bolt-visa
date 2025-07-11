import React, { useState, useEffect, useMemo } from 'react';
import { useDeals } from '@/hooks/useDeals';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { countries } from '@/data/countries';
import { Plus, FileText, User, MapPin, CreditCard, Wallet, Search, Minus, X, Maximize2 } from 'lucide-react';
import { capitalizeWords } from '../utils';

const DealForm = ({ isOpen, onClose, deal = null }) => {
  const { addDeal, updateDeal } = useDeals();
  const [formData, setFormData] = useState({
    type: "single",
    dealType: 'main',
    applyFrom: '',
    clientInfo: [{
      firstName: '',
      lastName: '',
      passportNumber: '',
      nationality: '',
      phoneNumber: '',
    }],
    destination: '',
    // remainingPayment: '',
    payment: {
      currency: 'PKR',
      totalAmount: 0,

      paidAmount: 0,
      // "remainingAmount": 50,
      overallPaymentMethod: "Online", //Online Transfer, Payment Link, Cash Payment, Money Exchange, Cryptocurrency

      installments: [
        { amount: 0, isPaid: false, paymentMethod: 'Online Transfer', picture: '', file: null, incentive: '' },
        { amount: 0, isPaid: false, paymentMethod: 'Online Transfer', picture: '', file: null, reward: '' },
        { amount: 0, isPaid: false, paymentMethod: 'Online Transfer', picture: '', file: null, reward: '' },
        { amount: 0, isPaid: false, paymentMethod: 'Online Transfer', picture: '', file: null, reward: '' }
      ]
    },

  });




  useEffect(() => {
    console.log('formData.dealType ', formData.dealType)
    if (formData.dealType == 'Family Deal') {
      setFormData((prev) => ({ ...prev, type: 'multiple' }))
    }
    else {
      setFormData((prev) => ({ ...prev, type: 'single' }))
    }
  }, [formData.dealType])


  useEffect(() => {
    if (deal) {
      setFormData({ ...deal, applyFrom: capitalizeWords(deal.applyFrom), destination: capitalizeWords(deal.destination) })
    }
  }, [deal])

  useEffect(() => {
    const totalPaid = formData?.payment.installments.reduce((sum, inst) => {
      return inst.isPaid && inst.amount ? sum + parseFloat(inst.amount) : sum;
    }, 0);

    const remaining = parseFloat(formData?.payment.totalAmount || 0) - totalPaid;

    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        paidAmount: totalPaid > 0 ? totalPaid.toString() : 0,
      },
      // remainingPayment:
      //   remaining > 0 || parseFloat(formData?.payment.totalAmount || 0) > 0
      //     ? remaining.toString()
      //     : '',
    }));
  }, [formData.payment.installments, formData.payment.totalAmount]);



  const dealTypes = [
    { value: 'Main Deal', label: 'Main Deal', reward: 2000 },
    { value: 'Sub Deal', label: 'Reference Deal', reward: 1000 },
    { value: 'Family Deal', label: 'Family Deal', reward: 1000 }
  ];


  const currencies = [
    { value: 'PKR', label: 'Pakistani Rupee (PKR)', symbol: '₨' },
    { value: 'AED', label: 'UAE Dirham (AED)', symbol: 'د.إ' },
    { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
    { value: 'Crypto', label: 'Crypto Currency', symbol: 'C' }
  ];

  const paymentMethods = [
    { value: "Online Transfer", label: 'Online Transfer' },
    { value: "Payment Link", label: 'Payment Link' },
    { value: "Cash Payment", label: 'Cash Payment' },
    { value: "Money Exchange", label: 'Money Exchange' },
    { value: "Cryptocurrency", label: 'Cryptocurrency' }
  ];







  const bonusTypes = [
    'Performance Bonus',
    'Monthly Target Bonus',
    'Special Achievement',
    'Team Bonus',
    'Holiday Bonus'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    let totalPaidFromInstallments = 0;
    Object.values(formData.payment.installments).forEach(inst => {
      if (inst.isPaid && inst.amount) {
        totalPaidFromInstallments += parseFloat(inst.amount);
      }
    });

    const remaining = parseFloat(formData.payment.totalAmount || 0) - totalPaidFromInstallments;

    const finalData = {
      ...formData,
      payment: {
        ...formData.payment,
        paidAmount: totalPaidFromInstallments > 0 ? totalPaidFromInstallments.toString() : 0,
      },
      // remainingPayment:
      //   remaining > 0 || parseFloat(formData.payment.totalAmount || 0) > 0
      //     ? remaining.toString()
      //     : ''
    };
    const updatedFields = {
      applyFrom: formData.applyFrom,
      clientInfo: formData.clientInfo,
      dealType: formData.dealType,
      destination: formData.destination,
      payment: {
        installments: formData.payment.installments,
      },
      status: formData.status
    }
    if (deal) {

      const editable = true
      console.log('updatedFields ', updatedFields)
      const result = await updateDeal(deal._id, updatedFields, editable);
      if (result.success) {
        toast({
          title: "Deal updated!",
          description: "Your deal has been successfully updated.",
        });
        onClose();
      }
      else if (!result.success) {
        toast({
          title: "Deal not updated updated!",
          description: result.error,
        });
        onClose();
      }
    } else {
      const result = await addDeal(finalData);
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
      const updatedPayment = {
        ...prev.payment,
        [field]: value,
      };

      let totalPaid = 0;
      updatedPayment.installments.forEach(inst => {
        if (inst.isPaid && inst.amount) {
          totalPaid += parseFloat(inst.amount);
        }
      });

      updatedPayment.paidAmount = totalPaid > 0 ? totalPaid.toString() : 0;
      const remaining = parseFloat(updatedPayment.totalAmount || 0) - totalPaid;

      return {
        ...prev,
        payment: updatedPayment,
        // remainingPayment:
        //   remaining > 0 || parseFloat(updatedPayment.totalAmount || 0) > 0
        //     ? remaining.toString()
        //     : '',
      };
    });
  };




  // new files


  const handleInstallmentChange = (index, field, value) => {
    setFormData(prev => {
      const updated = { ...prev };
      updated.payment.installments[index] = {
        ...updated.payment.installments[index],
        [field]: value
      };
      return { ...updated };
    });
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => {
        const updated = { ...prev };
        updated.payment.installments[index].picture = imageUrl; // blob for preview
        updated.payment.installments[index].file = file;         // actual file for upload
        return { ...updated };
      });
    }
  };

  const removeImage = (index, e) => {
    e.stopPropagation();
    setFormData(prev => {
      const updated = { ...prev };
      updated.payment.installments[index].picture = '';
      updated.payment.installments[index].file = null;
      return { ...updated };
    });
    const fileInput = document.getElementById(`fileInput-${index}`);
    if (fileInput) fileInput.value = '';
  };



  // old codes



  const handleInputChange = (eOrValue, index, field) => {
    const value = typeof eOrValue === 'string' ? eOrValue : eOrValue.target.value;

    setFormData(prev => ({
      ...prev,
      clientInfo: prev.clientInfo.map((user, i) =>
        i === index ? { ...user, [field]: value } : user
      )
    }));
  };
  const handleAddNewClient = () => {
    setFormData(prev => ({
      ...prev,
      clientInfo: [
        ...prev.clientInfo,
        {
          firstName: '',
          lastName: '',
          passportNumber: '',
          nationality: '',
          phoneNumber: '',
        }
      ]
    }));
  }
  const handleRemoveClient = (index) => {
    let copyArray = [...formData.clientInfo]
    copyArray.splice(index, 1)
    setFormData(prev => ({
      ...prev,
      clientInfo: copyArray
    }))
  }


  const selectedCurrency = currencies.find(c => c.value === formData?.payment.currency);
  console.log('deal ', deal)
  console.log('formData ', formData)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-purple-500/20 text-white max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple-400" />
              {deal ? 'Edit Deal' : 'Add New Deal'}
            </DialogTitle>
            <DialogDescription className="text-purple-300">
              {deal ? 'Update deal information' : 'Submit a new visa application deal'}
            </DialogDescription>
          </DialogHeader>
          {formData.dealType == 'Family Deal' &&
            <DialogTitle className="text-white text-xl flex items-center">
              <User className="mr-2 h-5 w-5 text-purple-400" />
              Total Members: {formData?.clientInfo?.length}
            </DialogTitle>
          }
        </div>

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
              <Label htmlFor="overallPaymentMethod" className="text-white">Overall Payment Method</Label>
              <Select value={formData?.payment.overallPaymentMethod} onValueChange={(value) => setFormData(prev => ({
                ...prev,
                payment: {
                  ...prev.payment,
                  overallPaymentMethod: value
                }
              }))}>
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
            {formData?.clientInfo?.map((clientInfo, index) => {
              return (
                <>
                  <h3 className={`text-lg font-semibold text-white flex items-center mb-3 ${index > 0 ? 'mt-8' : ''}`}>
                    <User className="mr-2 h-5 w-5 text-purple-400" />
                    Client Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="First Name" id="firstName" value={clientInfo.firstName} onChange={(e) => handleInputChange(e, index, 'firstName')} placeholder="Client's first name" required />
                    <InputGroup label="Last Name" id="lastName" value={clientInfo.lastName} onChange={(e) => handleInputChange(e, index, 'lastName')} placeholder="Client's last name" required />
                    <InputGroup label="Passport Number" id="passportNumber" value={clientInfo.passportNumber} onChange={(e) => handleInputChange(e, index, 'passportNumber')} placeholder="Passport number" required />
                    <InputGroup label="Phone Number" id="phoneNumber" value={clientInfo.phoneNumber} onChange={(e) => handleInputChange(e, index, 'phoneNumber')} placeholder="+92 300 1234567" required />
                    <SelectGroupWithSearch label="Nationality" id="nationality" value={clientInfo.nationality} onValueChange={(value) => handleInputChange(value, index, 'nationality')} placeholder="Select nationality" options={countries.map(c => ({ value: c.name, label: c.name }))} />
                    <div className={`grid grid-cols-1 mt-8 md:${index > 0 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>

                      {formData.dealType == 'Family Deal' && <Button
                        onClick={() => { handleAddNewClient() }}
                        className=" hover:scale-105 transition-transform w-full sm:w-auto flex-shrink-0"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Member
                      </Button>
                      }
                      {index > 0 && <Button
                        onClick={() => { handleRemoveClient(index) }}
                        className=" hover:scale-105 transition-transform w-full sm:w-auto flex-shrink-0"
                      >
                        <Minus className="mr-2 h-4 w-4" />
                        Remove Member
                      </Button>
                      }
                    </div>
                  </div>

                </>
              )
            })}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white flex items-center mb-3">
              <MapPin className="mr-2 h-5 w-5 text-purple-400" />
              Application Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectGroupWithSearch label="Apply From" id="applyFrom" value={formData.applyFrom} onValueChange={(value) => setFormData(prev => ({ ...prev, applyFrom: value }))} placeholder="Select country" options={countries.map(c => ({ value: c.name, label: c.name }))} />
              <SelectGroupWithSearch label="Apply For (Destination)" id="destination" value={formData.destination} onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))} placeholder="Select destination" options={countries.map(c => ({ value: c.name, label: c.name }))} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white flex items-center mb-3">
              <CreditCard className="mr-2 h-5 w-5 text-purple-400" />
              Financials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectGroupComp label="Currency" id="currency" value={formData?.payment.currency} onValueChange={(value) => setFormData(prev => ({
                ...prev,
                payment: {
                  ...prev.payment,
                  currency: value
                }
              }))} placeholder="Select currency" options={currencies} />
              <InputGroup label={`Total Amount (${selectedCurrency?.symbol})`} id="totalAmount" type="number" value={formData?.payment.totalAmount} onChange={(e) => handleAmountChange('totalAmount', e.target.value)} placeholder="" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <InputGroup label={`Paid Amount (${selectedCurrency?.symbol})`} id="paidAmount" type="number" value={formData?.payment.paidAmount} readOnly className="bg-purple-500/10" placeholder="" />
              {/* <InputGroup label={`Remaining (${selectedCurrency?.symbol})`} id="remainingPayment" type="number" value={formData.remainingPayment} readOnly className="bg-purple-500/10" placeholder="" /> */}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white flex items-center mb-3">
              <Wallet className="mr-2 h-5 w-5 text-purple-400" />
              Installments (Optional)
            </h3>
            {formData?.payment.installments.map((inst, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 border border-purple-500/20 rounded-lg"
              >
                <InputGroup
                  label={`${index + 1}${index === 0
                    ? 'st'
                    : index === 1
                      ? 'nd'
                      : index === 2
                        ? 'rd'
                        : 'th'
                    } Installment Amount`}
                  id={`installment-${index}-amount`}
                  type="number"
                  value={inst.amount || ''}
                  onChange={e =>
                    handleInstallmentChange(index, 'amount', e.target.value)
                  }
                />

                <SelectGroupComp
                  label="Payment Method"
                  id={`installment-${index}-method`}
                  value={inst.paymentMethod}
                  onValueChange={value =>
                    handleInstallmentChange(index, 'paymentMethod', value)
                  }
                  placeholder="Method"
                  options={paymentMethods}
                />

                <div className="flex items-end gap-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      id={`fileInput-${index}`}
                      onChange={e => handleFileChange(index, e)}
                      className="hidden"
                    />

                    {!inst.picture && (
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById(`fileInput-${index}`).click()
                        }
                        className="w-10 h-10 flex items-center justify-center border border-dashed border-gray-400 rounded hover:border-gray-600 transition-colors"
                        title="Upload image"
                      >
                        <Plus className="text-gray-500" size={20} />
                      </button>
                    )}

                    {inst.picture && (
                      <div className="relative w-16 h-16 group rounded overflow-hidden border cursor-pointer">
                        <img
                          src={inst.picture}
                          alt={`Installment ${index + 1} Proof`}
                          className="w-full h-full object-cover"
                        />

                        <button
                          onClick={e => removeImage(index, e)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 transition-all z-10"
                          title="Remove"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant={inst.isPaid ? 'secondary' : 'outline'}
                    onClick={() =>
                      handleInstallmentChange(index, 'isPaid', !inst.isPaid)
                    }
                    className="w-full"
                  >
                    {inst.isPaid ? 'Paid' : 'Mark as Paid'}
                  </Button>
                </div>

                {/* incentives */}






              </div>
            ))}

            {/* incentives */}
            <hr className='border-purple-500 mb-4' />
            {deal && formData?.payment.installments.map((inst, index) => (
              <div
                key={index}
                className={`${inst.isPaid && 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 border border-purple-500/20 rounded-lg'}`}
              >
                {inst.isPaid &&
                  <>

                    <Label className="text-white">Installment {index + 1}</Label>


                    <InputGroup
                      label={`${index === 0
                        ? 'Incentive'
                        : index === 1
                          ? 'Reward'
                          : index === 2
                            ? 'Reward'
                            : 'Reward'
                        }`}
                      id={`installment-${index}-amount`}
                      type="number"
                      value={index === 0 ? inst.incentive : inst.reward}
                      onChange={e =>
                        handleInstallmentChange(index, index === 0 ? 'incentive' : 'reward', e.target.value)
                      }
                    />

                    <div className="flex items-end gap-2">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          id={`fileInput-${index}`}
                          onChange={e => handleFileChange(index, e)}
                          className="hidden"
                        />

                        {!inst.picture && (
                          <button
                            type="button"
                            onClick={() =>
                              document.getElementById(`fileInput-${index}`).click()
                            }
                            className="w-10 h-10 flex items-center justify-center border border-dashed border-gray-400 rounded hover:border-gray-600 transition-colors"
                            title="Upload image"
                          >
                            <Plus className="text-gray-500" size={20} />
                          </button>
                        )}

                        {inst.picture && (
                          <div className="relative w-16 h-16 group rounded overflow-hidden border cursor-pointer">
                            <img
                              src={inst.picture}
                              alt={`Installment ${index + 1} Proof`}
                              className="w-full h-full object-cover"
                            />

                            <button
                              onClick={e => removeImage(index, e)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 transition-all z-10"
                              title="Remove"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant={inst.isPaid ? 'secondary' : 'outline'}
                        onClick={() =>
                          handleInstallmentChange(index, 'isPaid', !inst.isPaid)
                        }
                        className="w-full"
                      >
                        {inst.isPaid ? 'Paid' : 'Mark as Paid'}
                      </Button>
                    </div>
                  </>
                }








              </div>
            ))}
            {deal && <div

              className={`${'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 border border-purple-500/20 rounded-lg items-center'}`}
            >
              {
                <>

                  <Label className="text-white">User / Agent Name : {deal.createdBy.fullName}</Label>
                  <Label className="text-white">User / Agent Employee Id : {deal.createdBy.empId}</Label>


                  <InputGroup
                    label={`Case Id`}
                    id={``}
                    type="text"
                    value={''}
                  // onChange={e =>
                  //   handleInstallmentChange(index, index === 0 ? 'incentive' : 'reward', e.target.value)
                  // }
                  />


                </>
              }








            </div>}
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
      <SelectContent className="glass-effect border-purple-500/20 max-h-60 ">
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