import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth.jsx';
import {
  fetchApplications,
  deleteApplication,
  addApplication,
  updateApplicationStatus,
  editApplication,
  setPage,
  setLimit,
  clearError
} from '../store/applicationsSlice';

export const useDeals = (isAdminView = false) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { data: deals, loading, error, page, limit, pages, total } = useSelector(state => state.applications);

  const refreshDeals = useCallback(() => {
    console.log('useDeals: refreshDeals called');
    dispatch(fetchApplications({ page: 1, limit: 10 }));
  }, [dispatch]);

  const loadPage = useCallback((pageNumber, pageLimit = 10) => {
    dispatch(fetchApplications({ page: pageNumber, limit: pageLimit }));
  }, [dispatch]);



  const generateCaseId = (applyFor) => {
    if (!applyFor) return `UNDEF${Date.now().toString().slice(-5)}`;
    const countryCode = applyFor.toUpperCase().substring(0, 3);
    const existingCases = safeDeals.filter(deal => deal.caseId?.startsWith(countryCode));
    const nextNumber = existingCases.length + 1;
    return `${countryCode}${nextNumber.toString().padStart(3, '0')}`;
  };

  const addDeal = async (dealData) => {
    if (!user) return { success: false, error: "User not authenticated" };

    const caseId = generateCaseId(dealData.applyFor);
    try {
      const result = await dispatch(addApplication(dealData)).unwrap();
      if (result.success) {
        return { success: true, caseId };
      } else {
        return { success: false };
      }
    } catch (err) {
      console.log('err ', err);
      return { success: false, error: err.message };
    }
  };

  const updateUserEarningsOnApproval = (dealUserId, dealType) => {
    const users = JSON.parse(localStorage.getItem('bolt_visa_users') || '[]');
    const userIndex = users.findIndex(u => u.id === dealUserId);

    if (userIndex !== -1) {
      const reward = dealType === 'main' ? 2000 : 1000;
      users[userIndex].totalEarnings = (users[userIndex].totalEarnings || 0) + reward;

      if (dealType === 'Main Deal') {
        users[userIndex].mainDeals = (users[userIndex].mainDeals || 0) + 1;
      } else {
        users[userIndex].referenceDeals = (users[userIndex].referenceDeals || 0) + 1;
      }

      localStorage.setItem('bolt_visa_users', JSON.stringify(users));

      if (user && user.id === dealUserId) {
        const currentUserSession = JSON.parse(localStorage.getItem('bolt_visa_user'));
        if (currentUserSession) {
          currentUserSession.totalEarnings = users[userIndex].totalEarnings;
          currentUserSession.mainDeals = users[userIndex].mainDeals;
          currentUserSession.referenceDeals = users[userIndex].referenceDeals;
          localStorage.setItem('bolt_visa_user', JSON.stringify(currentUserSession));
        }
      }
    }
  };

  const updateDeal = async (id, updates, editable = false) => {
    try {
      if (editable) {
        const result = await dispatch(editApplication({ id, updates })).unwrap();
        return { success: result.success };
      } else {
        await dispatch(updateApplicationStatus({ 
          applicationId: id, 
          status: updates.status, 
          caseId: "" 
        })).unwrap();
        return { success: true };
      }
    } catch (err) {
      console.log('err', err);
      return { success: false, error: err.message };
    }
  };

  const deleteDeal = async (id) => {
    try {
      const response = await dispatch(deleteApplication(id)).unwrap();
      return response?.success;
    } catch (err) {
      console.log('err', err);
      return false;
    }
  };

  const approveDeal = async (id) => {
    const dealToApprove = safeDeals.find(d => d._id === id);
    if (dealToApprove) {
      if (dealToApprove.status !== 'approved') {
        updateUserEarningsOnApproval(dealToApprove.userId, dealToApprove.dealType);
      }
      return updateDeal(id, { status: 'approved', approvedAt: new Date().toISOString() });
    }
    return { success: false, error: "Deal not found for approval." };
  };

  const rejectDeal = async (id, reason) => {
    return updateDeal(id, { status: 'rejected', rejectedAt: new Date().toISOString(), rejectionReason: reason });
  };

  // Ensure deals is always an array
  let safeDeals = Array.isArray(deals) ? deals : [];
  
  // Fallback to localStorage if no data from API
  if (safeDeals.length === 0 && !loading) {
    const fallbackDeals = JSON.parse(localStorage.getItem('bolt_visa_deals') || '[]');
    safeDeals = Array.isArray(fallbackDeals) ? fallbackDeals : [];
  }
  
  const filteredDeals = isAdminView 
    ? safeDeals 
    : safeDeals.filter(deal => deal.userId === user?.id);

  return {
    deals: filteredDeals,
    loading,
    error,
    page,
    limit,
    pages,
    total,
    addDeal,
    updateDeal,
    deleteDeal,
    approveDeal,
    rejectDeal,
    refreshDeals,
    loadPage,
    setPage: (newPage) => dispatch(setPage(newPage)),
    setLimit: (newLimit) => dispatch(setLimit(newLimit)),
    clearError: () => dispatch(clearError())
  };
};