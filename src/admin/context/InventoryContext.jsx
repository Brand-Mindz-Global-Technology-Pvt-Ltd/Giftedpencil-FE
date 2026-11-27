import React, { createContext, useContext, useEffect, useCallback, useState, useMemo } from 'react';
import { inventoryApi } from '../api/Inventoryapi.js';

const InventoryContext = createContext(null);
const LIMIT = 8;

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    inStockCount: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    lowStockThreshold: 5,
  });

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [committedSearch, setCommittedSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sort, setSort] = useState({ field: 'recently_updated', order: 'desc' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Stock Update Modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatingStock, setUpdatingStock] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: LIMIT,
      };

      if (committedSearch.trim()) {
        params.search = committedSearch.trim();
      }

      if (filterCategory) {
        params.category = filterCategory;
      }

      if (filterStatus && filterStatus !== 'all') {
        params.status = filterStatus;
      }

      if (sort.field) {
        params.sortBy = sort.field;
        params.sortOrder = sort.order;
      }

      const res = await inventoryApi.getInventory(params);
      const resData = res.data ?? {};
      const list = Array.isArray(resData.data)
        ? resData.data
        : (Array.isArray(resData.inventory) ? resData.inventory : []);

      const pg = resData.pagination ?? {};

      setData(list);
      setCurrentPage(pg.page ?? page);
      setTotalPages(pg.totalPages ?? 1);
      setTotalProducts(pg.total ?? list.length);

      if (resData.metrics) {
        setMetrics(resData.metrics);
      }
    } catch (err) {
      console.error('Inventory fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch inventory items');
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  }, [committedSearch, filterCategory, filterStatus, sort]);

  /* ---------------- FETCH CATEGORIES ---------------- */
  const fetchCategories = useCallback(async () => {
    try {
      const res = await inventoryApi.getCategories();
      const catList = Array.isArray(res.data?.categories)
        ? res.data.categories
        : (Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []));
      setCategories(catList);
    } catch (err) {
      console.error('Category fetch error:', err);
    }
  }, []);

  /* ---------------- REFRESH ---------------- */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts(currentPage);
    setRefreshing(false);
  }, [fetchProducts, currentPage]);

  /* ---------------- SEARCH ACTIONS ---------------- */
  const commitSearch = useCallback(() => {
    setCommittedSearch(searchTerm.trim());
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearchKey = useCallback((e) => {
    if (e.key === 'Enter') commitSearch();
  }, [commitSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setCommittedSearch('');
    setCurrentPage(1);
  }, []);

  /* ---------------- FILTER & SORT ---------------- */
  const handleStatusFilterChange = useCallback((status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  }, []);

  const handleCategoryFilterChange = useCallback((cat) => {
    setFilterCategory(cat);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  }, []);

  const clearSort = useCallback(() => {
    setSort({ field: 'recently_updated', order: 'desc' });
    setCurrentPage(1);
  }, []);

  /* ---------------- PAGINATION ---------------- */
  const handlePageChange = useCallback((page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    fetchProducts(page);
  }, [totalPages, currentPage, fetchProducts]);

  /* ---------------- STOCK UPDATE ACTIONS ---------------- */
  const openUpdateModal = useCallback((product) => {
    setSelectedProduct(product);
    setUpdateError(null);
    setUpdateModalOpen(true);
  }, []);

  const closeUpdateModal = useCallback(() => {
    setUpdateModalOpen(false);
    setSelectedProduct(null);
    setUpdateError(null);
  }, []);

  const updateStock = useCallback(async (productId, newStock) => {
    setUpdatingStock(true);
    setUpdateError(null);
    try {
      const res = await inventoryApi.updateStock(productId, newStock);
      const updated = res.data?.product || res.data?.data;

      // Update in local data
      setData((prev) =>
        prev.map((item) => ((item.id === productId || item._id === productId) ? { ...item, ...updated } : item))
      );

      // Refresh metrics silently
      fetchProducts(currentPage);

      closeUpdateModal();
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update stock';
      setUpdateError(msg);
      throw new Error(msg);
    } finally {
      setUpdatingStock(false);
    }
  }, [currentPage, fetchProducts, closeUpdateModal]);

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    fetchProducts(1);
  }, [committedSearch, filterCategory, filterStatus, sort]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Page numbers calculation
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }, [totalPages, currentPage]);

  const startRow = totalProducts === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const endRow = Math.min(currentPage * LIMIT, totalProducts);

  const value = {
    data,
    categories,
    loading,
    isFirstLoad,
    refreshing,
    error,
    metrics,
    searchTerm,
    committedSearch,
    filterCategory,
    filterStatus,
    sort,
    currentPage,
    totalPages,
    totalProducts,
    updateModalOpen,
    selectedProduct,
    updatingStock,
    updateError,
    pageNumbers,
    startRow,
    endRow,

    setSearchTerm,
    setFilterCategory,
    setFilterStatus,
    setCurrentPage,
    commitSearch,
    handleSearchKey,
    clearSearch,
    handleStatusFilterChange,
    handleCategoryFilterChange,
    handleSort,
    clearSort,
    handlePageChange,
    handleRefresh,
    openUpdateModal,
    closeUpdateModal,
    updateStock,
    fetchProducts,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};
