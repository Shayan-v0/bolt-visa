import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, User, MapPin, CreditCard, Calendar, CheckCircle, XCircle, Clock, Percent, Tag, Wallet } from 'lucide-react';
import ReceiptGenerator from '@/components/ReceiptGenerator';
import { useAuth } from '@/hooks/useAuth.jsx';

const DetailItem = ({ icon, label, value, valueClass = "text-white" }) => (
  <div className="flex items-start py-2">
    <div className="flex-shrink-0 w-6 mr-3 text-purple-400">{icon}</div>
    <div>
      <p className="text-xs text-purple-300">{label}</p>
      <p className={`text-sm font-medium ${valueClass}`}>{value || 'N/A'}</p>
    </div>
  </div>
);

const InstallmentDetail = ({ installment, number }) => {
  if (!installment || !installment.amount) return null;
  return (
    <div className="border-t border-purple-500/10 pt-3 mt-3">
      <p className="text-sm font-semibold text-purple-300 mb-1">{number} Installment:</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <DetailItem icon={<CreditCard size={16} />} label="Amount" value={`${parseFloat(installment.amount).toLocaleString()} ${installment.currency || ''}`} />
        <DetailItem icon={installment.paid ? <CheckCircle size={16} /> : <Clock size={16} />} label="Status" value={installment.paid ? 'Paid' : 'Pending'} valueClass={installment.paid ? "text-green-400" : "text-yellow-400"} />
        {installment.paymentMethod && <DetailItem icon={<Wallet size={16} />} label="Method" value={installment.paymentMethod} />}
        {installment.paidDate && <DetailItem icon={<Calendar size={16} />} label="Paid Date" value={new Date(installment.paidDate).toLocaleDateString()} />}
      </div>
    </div>
  );
};


const DealDetailModal = ({ deal, isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  if (!deal) return null;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved': return { icon: <CheckCircle className="text-green-400" />, text: "Approved", color: "text-green-400" };
      case 'rejected': return { icon: <XCircle className="text-red-400" />, text: "Rejected", color: "text-red-400" };
      case 'pending': return { icon: <Clock className="text-yellow-400" />, text: "Pending", color: "text-yellow-400" };
      case 'reapply': return { icon: <Clock className="text-blue-400" />, text: "Reapplication", color: "text-blue-400" };
      case 'appeal': return { icon: <Clock className="text-orange-400" />, text: "Under Appeal", color: "text-orange-400" };
      default: return { icon: <FileText />, text: status, color: "text-white" };
    }
  };

  const statusInfo = getStatusInfo(deal.status);
  console.log('deal ', deal)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-purple-500/20 text-white max-w-lg w-[90vw] sm:w-full max-h-[90vh]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl text-white flex items-center">
            <FileText className="mr-3 h-7 w-7 text-purple-400" />
            Deal Details
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            Case ID: {deal.caseId}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-150px)] pr-4">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/15">
              <DetailItem icon={statusInfo.icon} label="Status" value={statusInfo.text} valueClass={statusInfo.color} />
              <DetailItem icon={<Calendar size={18} />} label="Created At" value={new Date(deal.createdAt).toLocaleString()} />
              {isAdmin && deal.userName && <DetailItem icon={<User size={18} />} label="Consultant" value={deal.userName} />}
            </div>

            {deal?.clientInfo.map((value, index) => {
              return (
                <Section title="Client Information" icon={<User size={20} />}>
                  <DetailItem icon={<User size={18} />} label="Full Name" value={`${value.firstName} ${value.lastName}`} />
                  <DetailItem icon={<FileText size={18} />} label="Passport No." value={value.passportNumber} />
                  <DetailItem icon={<MapPin size={18} />} label="Nationality" value={value.nationality} />
                  <DetailItem icon={<CreditCard size={18} />} label="Phone Number" value={value.phoneNumber} />
                </Section>
              )
            })
            }

            <Section title="Application Details" icon={<MapPin size={20} />}>
              <DetailItem icon={<MapPin size={18} />} label="Apply From" value={deal.applyFrom} />
              <DetailItem icon={<MapPin size={18} />} label="Apply For (Destination)" value={deal.destination} />
              <DetailItem icon={<Tag size={18} />} label="Deal Type" value={deal.dealType} />
            </Section>

            <Section title="Financials" icon={<CreditCard size={20} />}>
              <DetailItem icon={<CreditCard size={18} />} label="Total Amount" value={`${parseFloat(deal?.payment.totalAmount || 0).toLocaleString()} ${deal.payment.currency}`} />
              <DetailItem icon={<CheckCircle size={18} />} label="Paid Amount" value={`${parseFloat(deal?.payment.paidAmount || 0).toLocaleString()} ${deal.payment.currency}`} valueClass="text-green-400" />
              <DetailItem icon={<Clock size={18} />} label="Remaining Payment" value={`${parseFloat(deal?.payment.remainingPayment || 0).toLocaleString()} ${deal.payment.currency}`} valueClass={parseFloat(deal.remainingPayment || 0) > 0 ? "text-orange-400" : "text-green-400"} />
              <DetailItem icon={<Wallet size={18} />} label="Overall Payment Method" value={deal?.payment.overallPaymentMethod} />

              {deal.installments && Object.keys(deal.installments).length > 0 && (
                <div className="mt-3">
                  <h4 className="text-md font-semibold text-purple-200 mb-2">Installment Details:</h4>
                  {Object.entries(deal.installments).map(([key, inst], index) => (
                    <InstallmentDetail
                      key={key}
                      installment={inst}
                      number={`${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}`}
                    />
                  ))}
                </div>
              )}

            </Section>
            <Section title="Application Timeline" icon={<Clock size={20} />}>
              <ul className="space-y-2 pl-2 border-l-2 border-purple-500/30">
                {/* Submitted */}
                <li className="relative pl-4">
                  <span className="absolute -left-[9px] top-1 h-3 w-3 rounded-full bg-purple-400"></span>
                  <p className="text-sm text-white font-medium">Submitted</p>
                  <p className="text-xs text-purple-300">
                    {new Date(deal.createdAt).toLocaleString()}
                  </p>
                </li>

                {/* Approved */}
                {deal.status === 'approved' && (
                  <li className="relative pl-4">
                    <span className="absolute -left-[9px] top-1 h-3 w-3 rounded-full bg-green-400"></span>
                    <p className="text-sm text-white font-medium">Approved</p>
                    <p className="text-xs text-purple-300">Now in approved stage</p>
                  </li>
                )}

                {/* Rejected */}
                {deal.status === 'rejected' && (
                  <li className="relative pl-4">
                    <span className="absolute -left-[9px] top-1 h-3 w-3 rounded-full bg-red-400"></span>
                    <p className="text-sm text-white font-medium">Rejected</p>
                    {deal.rejectedAt && (
                      <p className="text-xs text-purple-300">{new Date(deal.rejectedAt).toLocaleString()}</p>
                    )}
                  </li>
                )}

                {/* Reapply */}
                {deal.status === 'reapply' && (
                  <li className="relative pl-4">
                    <span className="absolute -left-[9px] top-1 h-3 w-3 rounded-full bg-blue-400"></span>
                    <p className="text-sm text-white font-medium">Marked for Reapplication</p>
                  </li>
                )}

                {/* Appeal */}
                {deal.status === 'appeal' && (
                  <li className="relative pl-4">
                    <span className="absolute -left-[9px] top-1 h-3 w-3 rounded-full bg-orange-400"></span>
                    <p className="text-sm text-white font-medium">Under Appeal</p>
                  </li>
                )}
              </ul>
            </Section>


            {(deal.bonusType || deal.promoCode) && (
              <Section title="Bonuses & Promotions" icon={<Percent size={20} />}>
                {deal.bonusType && <DetailItem icon={<Percent size={18} />} label="Bonus Type" value={deal.bonusType} />}
                {deal.promoCode && <DetailItem icon={<Tag size={18} />} label="Promo Code" value={deal.promoCode} />}
              </Section>
            )}

            {deal.rejectionReason && (
              <Section title="Rejection Details" icon={<XCircle size={20} />}>
                <DetailItem icon={<XCircle size={18} />} label="Rejection Reason" value={deal.rejectionReason} valueClass="text-red-400" />
                {deal.rejectedAt && <DetailItem icon={<Calendar size={18} />} label="Rejected At" value={new Date(deal.rejectedAt).toLocaleString()} />}
              </Section>
            )}
            {isAdmin && <div className="pt-4 flex justify-end"><ReceiptGenerator deal={deal} /></div>}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="py-3 border-b border-purple-500/10 last:border-b-0">
    <h3 className="text-lg font-semibold text-white flex items-center mb-2">
      {icon && React.cloneElement(icon, { className: "mr-2 text-purple-400" })}
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
      {children}
    </div>
  </div>
);

export default DealDetailModal;