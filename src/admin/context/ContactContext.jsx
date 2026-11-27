// ContactContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import api from '../api/axios.js';

const API_BASE = '/api/admin/contacts';
const ITEMS_PER_PAGE = 10;

export const CONTACT_STATUSES = {
  ALL: 'all',
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  ARCHIVED: 'archived',
};

export const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Archived', value: 'archived' },
];

const DEFAULT_SORT = { field: 'newest', order: 'desc' };

const ContactContext = createContext(undefined);

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Search & Filter
  const [searchInput, setSearchInput] = useState('');
  const [committedSearch, setCommittedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState(DEFAULT_SORT);

  // Details Modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Status Update
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState(null);

  // Query builder
  const buildParams = useCallback((page) => {
    const p = new URLSearchParams({ page: String(page), limit: String(ITEMS_PER_PAGE) });
    if (statusFilter && statusFilter !== 'all') {
      p.set('status', statusFilter);
    }
    if (committedSearch.trim()) {
      p.set('search', committedSearch.trim());
    }
    if (sort.field) {
      p.set('sortBy', sort.field);
      p.set('sortOrder', sort.order);
    }
    return p;
  }, [statusFilter, committedSearch, sort]);

  // Fetch enquiries list
  const fetchContacts = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`${API_BASE}?${buildParams(page)}`);
      const data = res.data ?? {};
      const list = Array.isArray(data.data) ? data.data : (Array.isArray(data.contacts) ? data.contacts : []);
      const pg = data.pagination ?? {};

      setContacts(list);
      setCurrentPage(pg.page ?? page);
      setTotalPages(pg.totalPages ?? 1);
      setTotalCount(pg.total ?? list.length);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch contact enquiries');
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  }, [buildParams]);

  // Refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContacts(currentPage);
    setRefreshing(false);
  }, [fetchContacts, currentPage]);

  // Sort
  const handleSort = useCallback((field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  }, []);

  const clearSort = useCallback(() => {
    setSort(DEFAULT_SORT);
    setCurrentPage(1);
  }, []);

  // Search actions
  const commitSearch = useCallback(() => {
    setCommittedSearch(searchInput.trim());
    setCurrentPage(1);
  }, [searchInput]);

  const handleSearchKey = useCallback((e) => {
    if (e.key === 'Enter') commitSearch();
  }, [commitSearch]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    setCommittedSearch('');
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  // Pagination
  const handlePageChange = useCallback((page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    fetchContacts(page);
  }, [totalPages, currentPage, fetchContacts]);

  // View Details Modal
  const openViewModal = useCallback(async (contact) => {
    setSelectedContact(contact);
    setViewModalOpen(true);
    setLoadingDetails(true);
    setDetailsError(null);

    try {
      const res = await api.get(`${API_BASE}/${contact.id || contact._id}`);
      const detailed = res.data?.data || res.data?.contact || res.data;
      setSelectedContact(detailed);
    } catch (err) {
      setDetailsError(err.response?.data?.message || err.message || 'Failed to load enquiry details');
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  const closeViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelectedContact(null);
    setDetailsError(null);
    setStatusUpdateError(null);
  }, []);

  // Update Status
  const updateStatus = useCallback(async (contactId, newStatus, adminNotes) => {
    setUpdatingStatus(true);
    setStatusUpdateError(null);
    try {
      const payload = { status: newStatus };
      if (adminNotes !== undefined) {
        payload.adminNotes = adminNotes;
      }

      const res = await api.patch(`${API_BASE}/${contactId}/status`, payload);
      const updated = res.data?.contact || res.data?.data;

      // Update in contacts list
      setContacts((prev) =>
        prev.map((c) => ((c.id === contactId || c._id === contactId) ? { ...c, ...updated } : c))
      );

      // Update in selected contact if open
      if (selectedContact && (selectedContact.id === contactId || selectedContact._id === contactId)) {
        setSelectedContact((prev) => ({ ...prev, ...updated }));
      }

      return updated;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to update enquiry status';
      setStatusUpdateError(errMsg);
      throw new Error(errMsg);
    } finally {
      setUpdatingStatus(false);
    }
  }, [selectedContact]);

  // Page numbers calculation
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }, [totalPages, currentPage]);

  const startRow = totalCount === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRow = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);
  const skeletonCount = contacts.length || ITEMS_PER_PAGE;

  const value = {
    contacts,
    loading,
    isFirstLoad,
    error,
    refreshing,
    currentPage,
    totalPages,
    totalCount,
    searchInput,
    committedSearch,
    statusFilter,
    sort,
    viewModalOpen,
    selectedContact,
    loadingDetails,
    detailsError,
    updatingStatus,
    statusUpdateError,
    pageNumbers,
    startRow,
    endRow,
    skeletonCount,

    setSearchInput,
    setCurrentPage,
    fetchContacts,
    handleRefresh,
    handleSort,
    clearSort,
    commitSearch,
    handleSearchKey,
    clearSearch,
    handleStatusFilterChange,
    handlePageChange,
    openViewModal,
    closeViewModal,
    updateStatus,
  };

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
};
