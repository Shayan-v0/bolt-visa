import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDeals } from '@/hooks/useDeals';
import { toast } from '@/components/ui/use-toast';
import { Search } from 'lucide-react';
import DealForm from '@/components/DealForm';
import SearchAndFilter from '@/components/SearchAndFilter';
import DealCelebration from '@/components/DealCelebration';
import UserDashboardSummary from '@/components/UserDashboardSummary';
import PerformanceFilter from '@/components/PerformanceFilter';
import DealCard from '@/components/deal_list_components/DealCard';
import DealDetailModal from '@/components/deal_list_components/DealDetailModal';
import RejectDealDialog from '@/components/deal_list_components/RejectDealDialog';
import Pagination from '@/components/Pagination';
import { Card, CardContent } from '@/components/ui/card';


const DealList = ({ deals: initialDealsProp, isAdmin }) => {
  const { user } = useAuth();
  const { 
    deals: allDeals, 
    deleteDeal, 
    approveDeal, 
    rejectDeal, 
    updateDeal, 
    refreshDeals,
    page,
    limit,
    pages,
    total,
    loadPage
  } = useDeals(isAdmin);

  const [dealsToDisplay, setDealsToDisplay] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [celebrationDeal, setCelebrationDeal] = useState(null);
  const [performanceFilters, setPerformanceFilters] = useState({ period: 'all', date: null });



  useEffect(() => {
    const currentDeals = isAdmin ? (allDeals || []) : (allDeals || []).filter(d => d.userId === user?.id);
    setDealsToDisplay(currentDeals);
  }, [allDeals, isAdmin, user]);


  const handleReapply = (deal) => {
    updateDeal(deal.id, { ...deal, status: 'reapply', previousStatus: deal.status });
    toast({ title: "Case Marked for Reapplication", description: `Case ID: ${deal.caseId} is now marked for reapplication.` });
  };

  const handleAppeal = (deal) => {
    updateDeal(deal.id, { ...deal, status: 'appeal', previousStatus: deal.status });
    toast({ title: "Case Appeal Initiated", description: `Case ID: ${deal.caseId} appeal has been initiated.` });
  };

  const filteredDeals = useMemo(() => {
    let filtered = dealsToDisplay;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(deal =>
        Object.values(deal).some(val =>
          String(val).toLowerCase().includes(term)
        )
      );
    }

    if (filters.status) {
      filtered = filtered.filter(deal => deal.status === filters.status);
    }
    if (filters.dealType) {
      filtered = filtered.filter(deal => deal.dealType === filters.dealType);
    }
    if (filters.currency) {
      filtered = filtered.filter(deal => deal.currency === filters.currency);
    }
    if (filters.hasRemainingPayment) {
      const hasRemaining = filters.hasRemainingPayment === 'true';
      filtered = filtered.filter(deal => {
        const remaining = parseFloat(deal.remainingPayment || 0);
        return hasRemaining ? remaining > 0 : remaining <= 0;
      });
    }

    if (performanceFilters.period !== 'all') {
      const now = new Date();
      let startDate, endDate;

      switch (performanceFilters.period) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setHours(23, 59, 59, 999));
          break;
        case 'weekly':
          const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
          const lastDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
          endDate = new Date(lastDayOfWeek.setHours(23, 59, 59, 999));
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        case 'custom':
          if (performanceFilters.date) {
            const customDate = new Date(performanceFilters.date);
            startDate = new Date(customDate.setHours(0, 0, 0, 0));
            endDate = new Date(customDate.setHours(23, 59, 59, 999));
          }
          break;
        default:
          break;
      }

      if (startDate && endDate) {
        filtered = filtered.filter(deal => {
          const dealDate = new Date(deal.createdAt);
          return dealDate >= startDate && dealDate <= endDate;
        });
      }
    }
    return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [dealsToDisplay, searchTerm, filters, performanceFilters]);


  const handleApprove = async (deal) => {
    const result = await approveDeal(deal._id);
    if (result.success) {
      toast({ title: "Deal approved!", description: "The deal has been approved successfully." });
      setCelebrationDeal(deal);
      // No need to call refreshDeals() - Redux will update automatically
    }
  };

  const handleFinalReject = async (id) => {
    const result = await rejectDeal(id, rejectionReason);
    if (result.success) {
      toast({ title: "Deal rejected", description: "The deal has been rejected." });
      setShowRejectDialog(null);
      setRejectionReason('');
      // No need to call refreshDeals() - Redux will update automatically
    }
  };

  const handleDelete = (id) => {
    const result = deleteDeal(id);
    if (result.success) {
      toast({ title: "Deal deleted", description: "The deal has been deleted successfully." });
      // No need to call refreshDeals() - Redux will update automatically
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
  };

  const handlePageChange = (newPage) => {
    loadPage(newPage, limit);
  };

  const handleItemsPerPageChange = (newLimit) => {
    loadPage(1, newLimit);
  };

  return (
    <div className="space-y-6">
      {!isAdmin && <UserDashboardSummary deals={dealsToDisplay} />}

      <SearchAndFilter
        onSearch={setSearchTerm}
        onFilter={setFilters}
        deals={dealsToDisplay}
      />

      {!isAdmin && <PerformanceFilter onFilterChange={setPerformanceFilters} />}

      {filteredDeals.length === 0 ? (
        <Card className="visa-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-purple-400/50 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No deals match your criteria</h3>
            <p className="text-purple-300 text-center">
              Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              isAdmin={isAdmin}
              onSelect={setSelectedDeal}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={setShowRejectDialog}
              onReapply={handleReapply}
              onAppeal={handleAppeal}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pages}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          isOpen={!!selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      )}

      {editingDeal && (
        <DealForm
          isOpen={!!editingDeal}
          onClose={() => setEditingDeal(null)}
          deal={editingDeal}
        />
      )}

      {showRejectDialog && (
        <RejectDealDialog
          deal={showRejectDialog}
          isOpen={!!showRejectDialog}
          onClose={() => setShowRejectDialog(null)}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onConfirmReject={handleFinalReject}
        />
      )}

      {celebrationDeal && (
        <DealCelebration deal={celebrationDeal} onClose={() => setCelebrationDeal(null)} />
      )}
    </div>
  );
};

export default DealList;