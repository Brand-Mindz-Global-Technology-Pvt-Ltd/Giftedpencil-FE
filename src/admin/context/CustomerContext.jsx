// CustomerContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import api from '../api/axios.js';

const API_BASE = '/api/admin/customers';
const ITEMS_PER_PAGE = 10;

export const STATUS = { ACTIVE: 'Active', INACTIVE: 'Inactive', BLOCKED: 'Blocked' };
export const FILTERS = { ALL: 'All', ACTIVE: 'Active', INACTIVE: 'Inactive', BLOCKED: 'Blocked' };

export const SEARCH_FIELDS = [
  { label: 'All fields', value: 'search', placeholder: 'Search name, email, phone, ID…' },
  { label: 'Name', value: 'name', placeholder: 'Search by name…' },
  { label: 'Email', value: 'email', placeholder: 'Search by email…' },
  { label: 'Phone', value: 'phone', placeholder: 'Search by phone number…' },
  { label: 'Customer ID', value: 'customerId', placeholder: 'Exact customer ID (e.g. 1001 or CUST-1001)…' },
];

const DEFAULT_SORT = { field: null, order: 'desc' };

const CustomerContext = createContext(undefined);

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }) => {
  // State
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [committedSearch, setCommitted] = useState('');
  const [searchField, setSearchField] = useState('search');
  const [filter, setFilter] = useState(FILTERS.ALL);

  // Status edit drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [form, setForm] = useState({ status: 'Active' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Customer details modal / view
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const [exportLoading, setExportLoading] = useState({ csv: false, excel: false });
  const [sort, setSort] = useState(DEFAULT_SORT);

  const currentFieldMeta = SEARCH_FIELDS.find((f) => f.value === searchField);

  // Build query parameters
  const buildParams = useCallback((page) => {
    const p = new URLSearchParams({ page: String(page), limit: String(ITEMS_PER_PAGE) });
    if (filter !== FILTERS.ALL) p.set('status', filter);
    if (committedSearch.trim()) {
      if (searchField === 'search') {
        p.set('search', committedSearch.trim());
      } else {
        p.set(searchField, committedSearch.trim());
      }
    }
    if (sort.field) {
      p.set('sortBy', sort.field);
      p.set('sortOrder', sort.order);
    }
    return p;
  }, [filter, committedSearch, searchField, sort]);

  // Fetch customers list
  const fetchCustomers = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`${API_BASE}?${buildParams(page)}`);
      const data = res.data ?? {};
      const list = Array.isArray(data.data) ? data.data : (Array.isArray(data.customers) ? data.customers : []);
      const pg = data.pagination ?? {};

      setCustomers(list);
      setCurrentPage(pg.page ?? page);
      setTotalPages(pg.totalPages ?? 1);
      setTotalCount(pg.total ?? list.length);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  }, [buildParams]);

  // Refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCustomers(currentPage);
    setRefreshing(false);
  }, [fetchCustomers, currentPage]);

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

  // Search
  const commitSearch = useCallback(() => {
    setCommitted(searchInput.trim());
  }, [searchInput]);

  const handleSearchKey = useCallback((e) => {
    if (e.key === 'Enter') commitSearch();
  }, [commitSearch]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    setCommitted('');
  }, []);

  const handleFieldChange = useCallback((value) => {
    setSearchField(value);
    setSearchInput('');
    setCommitted('');
  }, []);

  const handleFilterChange = useCallback((value) => {
    setFilter(value);
    setSearchInput('');
    setCommitted('');
  }, []);

  // Pagination
  const handlePageChange = useCallback(
    (page) => {
      if (page < 1 || page > totalPages || page === currentPage) return;
      setCurrentPage(page);
      fetchCustomers(page);
    },
    [totalPages, currentPage, fetchCustomers]
  );

  // Status Edit Drawer
  const openEditDrawer = useCallback((customer) => {
    setCurrentCustomer(customer);
    setForm({ status: customer.status || 'Active' });
    setSubmitError(null);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // View Customer Details
  const openViewModal = useCallback(async (customer) => {
    const id = customer.id || customer._id || customer.customerId;
    setSelectedCustomer(customer);
    setViewModalOpen(true);
    setLoadingDetails(true);
    setDetailsError(null);

    try {
      const res = await api.get(`${API_BASE}/${id}`);
      const detailed = res.data?.data || res.data?.customer || res.data;
      setSelectedCustomer(detailed);
    } catch (err) {
      setDetailsError(err.response?.data?.message || err.message || 'Failed to load customer details');
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  const closeViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelectedCustomer(null);
    setDetailsError(null);
  }, []);

  // Submit status update form
  const submitForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (!currentCustomer) return;
      setSubmitting(true);
      setSubmitError(null);
      try {
        const id = currentCustomer.id || currentCustomer._id || currentCustomer.customerId;
        const res = await api.patch(`${API_BASE}/${id}/status`, { status: form.status });
        const updated = res.data?.customer ?? res.data?.data ?? res.data;

        setCustomers((prev) =>
          prev.map((c) =>
            (c.id === currentCustomer.id || c._id === currentCustomer._id)
              ? { ...c, ...updated, status: form.status }
              : c
          )
        );

        if (selectedCustomer && (selectedCustomer.id === currentCustomer.id || selectedCustomer._id === currentCustomer._id)) {
          setSelectedCustomer((prev) => ({ ...prev, ...updated, status: form.status }));
        }

        setDrawerOpen(false);
      } catch (err) {
        setSubmitError(err.response?.data?.message || err.message || 'Status update failed');
      } finally {
        setSubmitting(false);
      }
    },
    [currentCustomer, form, selectedCustomer]
  );

  // Export
  const triggerExport = useCallback(
    async (type = 'csv') => {
      setExportLoading((prev) => ({ ...prev, [type]: true }));
      try {
        const params = buildParams(1);
        params.delete('page');
        params.delete('limit');

        const res = await api.get(`${API_BASE}/export?${params}`, {
          responseType: 'blob',
        });
        const url = URL.createObjectURL(res.data);
        const a = Object.assign(document.createElement('a'), {
          href: url,
          download: `customers_${new Date().toISOString().slice(0, 10)}.csv`,
        });
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Export failed');
      } finally {
        setExportLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    [buildParams]
  );

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
  const skeletonCount = customers.length || ITEMS_PER_PAGE;

  const value = {
    // State
    customers,
    loading,
    isFirstLoad,
    error,
    refreshing,
    currentPage,
    totalPages,
    totalCount,
    searchInput,
    committedSearch,
    searchField,
    filter,
    drawerOpen,
    currentCustomer,
    form,
    submitting,
    submitError,
    viewModalOpen,
    selectedCustomer,
    loadingDetails,
    detailsError,
    exportLoading,
    sort,
    currentFieldMeta,
    pageNumbers,
    startRow,
    endRow,
    skeletonCount,

    setSearchInput,
    setForm,
    setCurrentPage,

    fetchCustomers,
    handleRefresh,
    handleSort,
    clearSort,
    commitSearch,
    handleSearchKey,
    clearSearch,
    handleFieldChange,
    handleFilterChange,
    handlePageChange,
    openEditDrawer,
    closeDrawer,
    openViewModal,
    closeViewModal,
    submitForm,
    triggerExport,
  };

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
};
