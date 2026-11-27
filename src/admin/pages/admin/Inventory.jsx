import React, { useState } from 'react';
import {
  Search,
  RefreshCw,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  XOctagon,
  Edit3,
  X,
  Plus,
  Minus,
  AlertCircle
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext.jsx';
import { resolveProductImage } from '../../../utils/productImages';

const statusBadge = (status) => {
  switch (status) {
    case 'in_stock':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'low_stock':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'out_of_stock':
      return 'bg-red-100 text-red-800 border border-red-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};

const statusIcon = (status) => {
  switch (status) {
    case 'in_stock':
      return <CheckCircle2 size={13} className="text-emerald-600 inline mr-1" />;
    case 'low_stock':
      return <AlertTriangle size={13} className="text-amber-600 inline mr-1" />;
    case 'out_of_stock':
      return <XOctagon size={13} className="text-red-600 inline mr-1" />;
    default:
      return null;
  }
};

const Shimmer = ({ w = 'w-full', h = 'h-3', rounded = 'rounded' }) => (
  <div
    className={`${w} ${h} ${rounded} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] animate-shimmer`}
  />
);

const TableSkeleton = ({ rows = 5 }) => (
  Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Shimmer w="w-12" h="h-12" rounded="rounded-lg" />
          <div className="space-y-1.5 flex-1">
            <Shimmer w="w-3/4" h="h-4" />
            <Shimmer w="w-1/4" h="h-3" />
          </div>
        </div>
      </td>
      <td className="p-4 text-center">
        <Shimmer w="w-20" h="h-5" rounded="rounded-full" />
      </td>
      <td className="p-4 text-center">
        <Shimmer w="w-16" h="h-4" />
      </td>
      <td className="p-4 text-center">
        <Shimmer w="w-12" h="h-5" />
      </td>
      <td className="p-4 text-center">
        <Shimmer w="w-20" h="h-6" rounded="rounded-full" />
      </td>
      <td className="p-4 text-right">
        <Shimmer w="w-24" h="h-8" rounded="rounded-lg" />
      </td>
    </tr>
  ))
);

export default function Inventory() {
  const {
    data,
    categories,
    loading,
    refreshing,
    error,
    metrics,
    searchTerm,
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
    commitSearch,
    handleSearchKey,
    clearSearch,
    handleStatusFilterChange,
    handleCategoryFilterChange,
    handleSort,
    handlePageChange,
    handleRefresh,
    openUpdateModal,
    closeUpdateModal,
    updateStock,
  } = useInventory();

  // Local state for stock update form
  const [newStockVal, setNewStockVal] = useState(0);
  const [validationError, setValidationError] = useState(null);

  // When modal opens, initialize stock quantity
  const handleOpenModal = (product) => {
    setNewStockVal(product.stock ?? product.stock_quantity ?? 0);
    setValidationError(null);
    openUpdateModal(product);
  };

  const handleStockInputChange = (e) => {
    const val = e.target.value;
    setValidationError(null);
    if (val === '') {
      setNewStockVal('');
      return;
    }
    const num = Number(val);
    if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
      setValidationError('Stock must be a non-negative whole integer');
    }
    setNewStockVal(val);
  };

  const adjustStock = (delta) => {
    setValidationError(null);
    const current = Number(newStockVal) || 0;
    const next = Math.max(0, current + delta);
    setNewStockVal(next);
  };

  const handleUpdateStockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (newStockVal === '' || isNaN(Number(newStockVal)) || Number(newStockVal) < 0 || !Number.isInteger(Number(newStockVal))) {
      setValidationError('Please enter a valid non-negative integer (e.g. 0, 5, 25)');
      return;
    }

    try {
      await updateStock(selectedProduct.id || selectedProduct._id, Number(newStockVal));
    } catch {
      // updateError is managed in context
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-6 sm:py-8 rounded-md">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* ── HEADER ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Boxes className="text-blue-600" size={24} />
              Inventory Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {loading ? (
                <span className="inline-block w-28 h-3 rounded bg-gray-200 animate-shimmer align-middle" />
              ) : (
                `${totalProducts} total product${totalProducts !== 1 ? 's' : ''} in catalog`
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-gray-300
                         bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
            >
              <RefreshCw size={15} className={refreshing || loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* ── TOP METRIC CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => handleStatusFilterChange('all')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-xs text-gray-500 font-medium">Total Products</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalProducts}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">All catalog items</div>
          </div>

          <div
            onClick={() => handleStatusFilterChange('in_stock')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterStatus === 'in_stock'
                ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 size={13} /> In Stock
            </div>
            <div className="text-2xl font-bold text-emerald-900 mt-1">{metrics.inStockCount}</div>
            <div className="text-[11px] text-emerald-600/70 mt-0.5">Stock &gt; 5 units</div>
          </div>

          <div
            onClick={() => handleStatusFilterChange('low_stock')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterStatus === 'low_stock'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <AlertTriangle size={13} /> Low Stock
            </div>
            <div className="text-2xl font-bold text-amber-900 mt-1">{metrics.lowStockCount}</div>
            <div className="text-[11px] text-amber-600/70 mt-0.5">1 – 5 units remaining</div>
          </div>

          <div
            onClick={() => handleStatusFilterChange('out_of_stock')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterStatus === 'out_of_stock'
                ? 'border-red-500 bg-red-50/40 ring-1 ring-red-500'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-xs text-red-600 font-medium flex items-center gap-1">
              <XOctagon size={13} /> Out of Stock
            </div>
            <div className="text-2xl font-bold text-red-900 mt-1">{metrics.outOfStockCount}</div>
            <div className="text-[11px] text-red-600/70 mt-0.5">0 units available</div>
          </div>
        </div>

        {/* ── SEARCH + FILTERS ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 min-w-0">
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by product name, slug, or ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKey}
                className="h-10 w-full border border-gray-300 pl-9 pr-9 text-sm rounded-l-lg
                           focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={15} />
                </button>
              )}
            </div>

            <button
              onClick={commitSearch}
              className="h-10 px-4 shrink-0 rounded-r-lg border border-l-0 border-gray-300
                         bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>

          <div className="flex gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <select
              value={filterCategory}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none bg-white cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c._id || c.slug} value={c.slug || c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none bg-white cursor-pointer"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock (&gt; 5)</option>
              <option value="low_stock">Low Stock (≤ 5)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>

            <select
              value={sort.field}
              onChange={(e) => handleSort(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none bg-white cursor-pointer"
            >
              <option value="recently_updated">Recently Updated</option>
              <option value="name">Product Name</option>
              <option value="stock">Stock Quantity</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

        {/* ── ERROR BANNER ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span><b>Failed to load inventory:</b> {error}</span>
            </div>
            <button
              onClick={() => handleRefresh()}
              className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── INVENTORY TABLE (DESKTOP) ── */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 text-center">Category</th>
                  <th className="px-4 py-3 text-center">Price</th>
                  <th className="px-4 py-3 text-center">Current Stock</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton rows={5} />
                ) : data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id || item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveProductImage(item.image)}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border bg-gray-50 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = resolveProductImage('product-1.png');
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate max-w-sm">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-400 font-mono mt-0.5">
                              {item.productId || `ID: ${item.id}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          {item.category || 'General'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center font-medium text-gray-900">
                        ₹{Number(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className={`text-base font-bold ${item.stock === 0 ? 'text-red-600' : (item.stock <= 5 ? 'text-amber-600' : 'text-gray-900')}`}>
                          {item.stock ?? item.stock_quantity ?? 0}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge(item.stockStatus)}`}>
                          {statusIcon(item.stockStatus)}
                          {item.stockStatusLabel || (item.stock === 0 ? 'Out of Stock' : (item.stock <= 5 ? 'Low Stock' : 'In Stock'))}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                        >
                          <Edit3 size={13} /> Update Stock
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-gray-400">
                      {searchTerm ? `No products found matching "${searchTerm}"` : 'No products found in inventory.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="md:hidden divide-y">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 space-y-3 animate-pulse">
                  <div className="flex gap-3">
                    <Shimmer w="w-14" h="h-14" rounded="rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Shimmer w="w-3/4" h="h-4" />
                      <Shimmer w="w-1/3" h="h-3" />
                    </div>
                  </div>
                  <Shimmer w="w-full" h="h-8" rounded="rounded-lg" />
                </div>
              ))
            ) : data.length > 0 ? (
              data.map((item) => (
                <div key={item.id || item._id} className="p-4 space-y-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <img
                      src={resolveProductImage(item.image)}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover border bg-gray-50 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = resolveProductImage('product-1.png');
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm truncate">{item.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {item.productId || `ID: ${item.id}`} • {item.category || 'General'}
                      </div>
                      <div className="text-xs font-semibold text-gray-900 mt-1">
                        ₹{Number(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t text-xs">
                    <div>
                      <span className="text-gray-400">Stock: </span>
                      <span className="font-bold text-gray-900 text-sm">
                        {item.stock ?? item.stock_quantity ?? 0} units
                      </span>
                    </div>

                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(item.stockStatus)}`}>
                      {statusIcon(item.stockStatus)}
                      {item.stockStatusLabel || (item.stock === 0 ? 'Out of Stock' : (item.stock <= 5 ? 'Low Stock' : 'In Stock'))}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenModal(item)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit3 size={13} /> Update Stock Quantity
                  </button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-400 text-sm">
                {searchTerm ? `No results for "${searchTerm}"` : 'No products found.'}
              </div>
            )}
          </div>
        </div>

        {/* ── PAGINATION ── */}
        {!loading && (
          <div className="border rounded-xl px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left order-2 sm:order-1">
              {totalProducts === 0 ? (
                <span className="text-gray-400">No results</span>
              ) : (
                <>
                  <span className="font-medium text-gray-900">Page {currentPage}</span>
                  <span className="mx-1.5 text-gray-300">•</span>
                  Showing <span className="font-medium text-gray-900">{startRow}</span>
                  {' – '}
                  <span className="font-medium text-gray-900">{endRow}</span>
                  {' of '}
                  <span className="font-medium text-gray-900">{totalProducts}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-md border text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                title="First page"
              >
                «
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs sm:text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              <div className="hidden md:flex items-center gap-1">
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => handlePageChange(n)}
                    className={`w-8 h-8 rounded-md border text-sm font-medium transition-colors ${
                      currentPage === n ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <div className="md:hidden px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-md border">
                {currentPage} / {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs sm:text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-md border text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                title="Last page"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── UPDATE STOCK MODAL ── */}
      {updateModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeUpdateModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeSlideIn">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Edit3 size={16} className="text-blue-600" />
                Update Product Stock
              </h2>
              <button
                onClick={closeUpdateModal}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateStockSubmit} className="p-6 space-y-4">
              {/* Product preview */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border">
                <img
                  src={resolveProductImage(selectedProduct.image)}
                  alt={selectedProduct.name}
                  className="w-12 h-12 rounded-lg object-cover border bg-white shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-gray-900 truncate">{selectedProduct.name}</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                    {selectedProduct.productId || `ID: ${selectedProduct.id}`}
                  </div>
                  <div className="text-[11px] text-blue-600 font-medium">
                    Current Stock: <b>{selectedProduct.stock ?? selectedProduct.stock_quantity ?? 0}</b> units
                  </div>
                </div>
              </div>

              {/* Stock Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  New Stock Quantity <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustStock(-1)}
                    className="p-2.5 rounded-lg border bg-gray-50 hover:bg-gray-100 text-gray-700"
                    title="Decrease by 1"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newStockVal}
                    onChange={handleStockInputChange}
                    className="flex-1 text-center font-bold text-lg border-2 border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                    placeholder="0"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => adjustStock(1)}
                    className="p-2.5 rounded-lg border bg-gray-50 hover:bg-gray-100 text-gray-700"
                    title="Increase by 1"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Quick adjustment buttons */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-gray-400 mr-1">Quick:</span>
                  {[+5, +10, +25, +50].map((delta) => (
                    <button
                      key={delta}
                      type="button"
                      onClick={() => adjustStock(delta)}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      +{delta}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewStockVal(0)}
                    className="ml-auto px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    Set 0 (Out of stock)
                  </button>
                </div>
              </div>

              {/* Validation / Context Error */}
              {validationError && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {updateError && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{updateError}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="flex-1 py-2 text-xs sm:text-sm border rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStock || Boolean(validationError)}
                  className="flex-1 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-1.5 font-medium"
                >
                  {updatingStock ? <RefreshCw size={14} className="animate-spin" /> : null}
                  Save Stock Quantity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 400% 100%;
          animation: shimmer 3.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
