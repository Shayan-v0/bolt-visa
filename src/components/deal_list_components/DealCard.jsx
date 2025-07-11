import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Check, X, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.jsx';

const DealCard = ({ deal, onSelect, onEdit, onDelete, onApprove, onReject, onReapply, onAppeal }) => {
  const { isAdmin } = useAuth();


  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reapply': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'appeal': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDealTypeColor = (type) => {
    return type === 'main' ? 'bg-purple-500/20 text-purple-300' : 'bg-pink-500/20 text-pink-300';
  };

  const totalInstallments = Object.keys(deal.installments || {}).filter(key => deal.installments[key]?.amount && parseFloat(deal.installments[key]?.amount) > 0).length;
  const paidInstallments = Object.values(deal.installments || {}).filter(inst => inst.paid && inst.amount && parseFloat(inst.amount) > 0).length;


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="visa-card h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white text-base sm:text-lg mb-1 truncate max-w-[150px] sm:max-w-xs">
                {deal.firstName} {deal.lastName}
              </CardTitle>
              <CardDescription className="text-purple-300 text-xs truncate max-w-[150px] sm:max-w-xs">
                ID: {deal.applicationNumber} | {deal.applyFor}
              </CardDescription>
            </div>
            <Badge className={`${getStatusColor(deal.status)} self-start text-xxs sm:text-xs px-1.5 sm:px-2.5 py-0.5`}>{deal.status}</Badge>
          </div>
          {isAdmin && deal.clientInfo.length >= 0 && (
            <p className="text-xs text-purple-400 mt-1 truncate max-w-[150px] sm:max-w-xs">Consultant: {deal.clientInfo[0]?.firstName + deal.clientInfo[0]?.lastName}</p>
          )}
        </CardHeader>

        <CardContent className="flex-grow space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Passport:</span>
            <span className="text-white font-medium truncate max-w-[100px] sm:max-w-[150px]">{deal?.clientInfo.length > 0 ? deal?.clientInfo[0]?.passportNumber : ''}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Nationality:</span>
            <span className="text-white font-medium truncate max-w-[100px] sm:max-w-[150px]">{deal?.clientInfo.length > 0 ? deal?.clientInfo[0]?.nationality : ''}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Deal Type:</span>
            <Badge variant="outline" className={`${getDealTypeColor(deal.dealType)} border-none text-xxs sm:text-xs px-1.5 sm:px-2`}>{deal.dealType}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Total:</span>
            <span className="text-white font-semibold sm:text-base">
              {parseFloat(deal.payment?.totalAmount || 0).toLocaleString()} {deal.payment?.currency}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Paid:</span>
            <span className="text-green-400 font-semibold">
              {parseFloat(deal.payment?.paidAmount || 0).toLocaleString()} {deal.payment?.currency}
            </span>
          </div>
          {parseFloat(deal.remainingPayment || 0) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-purple-300">Remaining:</span>
              <span className="text-orange-400 font-semibold">
                {parseFloat(deal.remainingPayment || 0).toLocaleString()} {deal.currency}
              </span>
            </div>
          )}
          {/* {totalInstallments > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-purple-300">Installments:</span>
              <span className="text-white">{paidInstallments}/{totalInstallments} Paid</span>
            </div>
          )} */}

        </CardContent>

        <div className="p-2 sm:p-4 border-t border-purple-500/20">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(deal)}
              className="col-span-full border-purple-500/20 text-white hover:bg-purple-500/10 text-xs sm:text-sm h-8 sm:h-9"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> View
            </Button>

            {isAdmin && deal.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove(deal)}
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onReject(deal)}
                  className="text-xs sm:text-sm h-8 sm:h-9"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Reject
                </Button>
              </>
            )}

            {(!isAdmin || deal.status === 'pending' || deal.status === 'rejected') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(deal)}
                className="border-purple-500/20 text-white hover:bg-purple-500/10 text-xs sm:text-sm h-8 sm:h-9"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Edit
              </Button>
            )}

            {!isAdmin && (deal.status === 'rejected' || deal.status === 'appeal') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReapply(deal)}
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-xs sm:text-sm h-8 sm:h-9"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Reapply
              </Button>
            )}
            {!isAdmin && deal.status === 'rejected' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAppeal(deal)}
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 text-xs sm:text-sm h-8 sm:h-9"
              >
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Appeal
              </Button>
            )}
            {isAdmin && deal.status !== 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(deal._id)}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs sm:text-sm h-8 sm:h-9"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DealCard;