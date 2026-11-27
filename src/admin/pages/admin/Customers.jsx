// Customers.jsx
import React, { useEffect } from 'react';
import {
  Search,
  Download,
  Edit2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  ShoppingBag,
  Calendar,
  CreditCard,
  User,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCustomers, STATUS, FILTERS, SEARCH_FIELDS } from '../../context/CustomerContext';

// ─── Shimmer pulse line ───────────────────────────────────────────────────────
const Shimmer = ({ w = 'w-full', h = 'h-3', rounded = 'rounded' }) => (
  <div
    className={`${w} ${h} ${rounded} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] animate-shimmer`}
  />
);

// ─── Skeleton row (desktop) ───────────────────────────────────────────────────
const SkeletonRow = ({ opacity = 1 }) => (
  <tr style={{ opacity }} className="transition-opacity duration-300">
    <td className="px-4 py-3">
      <Shimmer w="w-20" />
    </td>
    <td className="px-4 py-3">
      <Shimmer w="w-32" />
    </td>
    <td className="px-4 py-3">
      <Shimmer w="w-40" />
    </td>
    <td className="px-4 py-3">
      <Shimmer w="w-16" />
    </td>
    <td className="px-4 py-3">
      <Shimmer w="w-20" />
    </td>
    <td className="px-4 py-3">
      <Shimmer w="w-16" h="h-5" rounded="rounded-full" />
    </td>
    <td className="px-4 py-3 flex justify-end gap-2">
      <Shimmer w="w-6" h="h-6" rounded="rounded" />
      <Shimmer w="w-6" h="h-6" rounded="rounded" />
    </td>
  </tr>
);

// ─── Skeleton card (mobile) ───────────────────────────────────────────────────
const SkeletonCard = ({ opacity = 1 }) => (
  <div className="p-4 border-b" style={{ opacity, transition: 'opacity 0.3s' }}>
    <div className="flex justify-between mb-3">
      <div className="space-y-2">
        <Shimmer w="w-28" h="h-3.5" />
        <Shimmer w="w-20" h="h-2.5" />
      </div>
      <Shimmer w="w-14" h="h-5" rounded="rounded-full" />
    </div>
    <Shimmer w="w-48" h="h-3" />
    <div className="mt-3">
      <Shimmer w="w-full" h="h-8" rounded="rounded-lg" />
    </div>
  </div>
);

// ─── Sort icon ────────────────────────────────────────────────────────────────
const SortIcon = ({ field, sort }) => {
  if (sort.field !== field)
    return <ArrowUpDown size={13} className="text-gray-400 ml-1 inline-block" />;
  return sort.order === 'asc' ? (
    <ArrowUp size={13} className="text-blue-600 ml-1 inline-block" />
  ) : (
    <ArrowDown size={13} className="text-blue-600 ml-1 inline-block" />
  );
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const statusBadge = (s) => {
  const norm = String(s || '').toLowerCase();
  if (norm === 'active') return 'bg-green-100 text-green-700 border border-green-200';
  if (norm === 'blocked' || norm === 'suspended') return 'bg-red-100 text-red-700 border border-red-200';
  return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
};

// ─── inject shimmer keyframe once ────────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('shimmer-style')) {
  const style = document.createElement('style');
  style.id = 'shimmer-style';
  style.textContent = `
    @keyframes shimmer {
      0%   { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }
    .animate-shimmer {
      animation: shimmer 3.4s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

export default function Customers() {
  const {
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
  } = useCustomers();

  // Initial load and filter/search changes
  useEffect(() => {
    setCurrentPage(1);
    fetchCustomers(1);
  }, [filter, committedSearch, searchField, sort]);

  // ─── Sortable TH ─────────────────────────────────────────────────────────
  const SortableTh = ({ field, label }) => (
    <th
      className="px-4 py-3 cursor-pointer select-none group whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-0.5 group-hover:text-blue-600 transition-colors">
        {label}
        <SortIcon field={field} sort={sort} />
      </span>
    </th>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-6 sm:py-8 rounded-md">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* ── HEADER ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">Customers</h1>
            <p className="text-xs sm:text-sm text-gray-500 transition-all duration-300">
              {loading ? (
                <span className="inline-block w-28 h-3 rounded bg-gray-200 animate-shimmer align-middle" />
              ) : (
                `${totalCount} total registered customers`
              )}
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex w-full sm:w-auto">
              <button
                onClick={() => triggerExport('csv')}
                disabled={exportLoading.csv}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border
                           bg-white px-3.5 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100
                           transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {exportLoading.csv ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                Export CSV
              </button>
            </div>
          </div>
        </header>

        {/* ── SEARCH + FILTERS ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 min-w-0">
            <select
              value={searchField}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="shrink-0 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50
                         px-2 py-1.5 text-xs sm:text-sm text-gray-600 outline-none
                         hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {SEARCH_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder={currentFieldMeta?.placeholder ?? 'Search…'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKey}
                className="h-10 w-full border border-gray-300 pl-9 pr-9 text-sm rounded-none
                           focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
              />
              {searchInput && (
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

          <div className="flex gap-2 shrink-0">
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none bg-white"
            >
              <option>{FILTERS.ALL}</option>
              <option>{STATUS.ACTIVE}</option>
              <option>{STATUS.INACTIVE}</option>
              <option>{STATUS.BLOCKED}</option>
            </select>

            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-3 h-10 rounded-lg border border-gray-300
                         bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing || loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* ── Active search chip ── */}
        {committedSearch && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-400">Searching</span>
            <span className="font-medium text-gray-800">{currentFieldMeta?.label}</span>
            <span className="text-gray-400">for</span>
            <span
              className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200
                             text-blue-700 rounded-full px-3 py-0.5 text-xs font-medium"
            >
              "{committedSearch}"
              <button onClick={clearSearch} className="hover:text-blue-900">
                <X size={12} />
              </button>
            </span>
            <span className="text-gray-400 text-xs">
              — {totalCount} result{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* ── Active sort chip ── */}
        {sort.field && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-400">Sorted by</span>
            <span
              className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200
                             text-blue-700 rounded-full px-3 py-0.5 text-xs font-medium"
            >
              {sort.field === 'customerId'
                ? 'Customer ID'
                : sort.field === 'name'
                ? 'Name'
                : sort.field === 'total_orders'
                ? 'Orders Count'
                : sort.field === 'total_spent'
                ? 'Total Spent'
                : sort.field}
              {sort.order === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
              <button onClick={clearSort} className="hover:text-blue-900">
                <X size={12} />
              </button>
            </span>
          </div>
        )}

        {/* ── ERROR BANNER ── */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm
                          flex items-center justify-between"
          >
            <div>
              <span className="font-semibold">Failed to load customers: </span>
              {error}
            </div>
            <button
              onClick={() => fetchCustomers(currentPage)}
              className="ml-4 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700
                         rounded-md transition-colors whitespace-nowrap"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── TABLE ── */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          {/* ── Desktop ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-600 font-medium">
                <tr>
                  <SortableTh field="customerId" label="Customer ID" />
                  <SortableTh field="name" label="Customer Name" />
                  <th className="px-4 py-3">Contact</th>
                  <SortableTh field="total_orders" label="Orders" />
                  <SortableTh field="total_spent" label="Total Spent" />
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading
                  ? Array.from({ length: skeletonCount }).map((_, i) => (
                      <SkeletonRow key={`sk-${i}`} opacity={isFirstLoad ? 1 : 1 - i * 0.06} />
                    ))
                  : customers.length > 0
                  ? customers.map((c, i) => (
                      <tr
                        key={c.id || c._id}
                        className="hover:bg-gray-50 transition-all duration-200"
                        style={{
                          animation: `fadeSlideIn 0.25s ease both`,
                          animationDelay: `${i * 30}ms`,
                        }}
                      >
                        <td className="px-4 py-3 text-gray-600 font-medium text-xs font-mono">
                          {c.customerId}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 truncate max-w-[180px]" title={c.name}>{c.name}</div>
                          <div className="text-xs text-gray-400">
                            Joined {new Date(c.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-700 truncate max-w-[200px]" title={c.email}>{c.email}</div>
                          <div className="text-xs text-gray-400">{c.phone || '—'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {c.totalOrders} order{c.totalOrders !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          ₹{Number(c.totalSpent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(
                              c.status
                            )}`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openViewModal(c)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Customer Profile & Orders"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => openEditDrawer(c)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              title="Edit Status"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
                {!loading && customers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-gray-400">
                      {committedSearch
                        ? `No customers found matching "${committedSearch}"`
                        : 'No customers found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile ── */}
          <div className="md:hidden">
            {/* Sort pills */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b bg-gray-50 overflow-x-auto">
              <span className="text-xs text-gray-500 shrink-0">Sort by:</span>
              {[
                { field: 'customerId', label: 'ID' },
                { field: 'name', label: 'Name' },
                { field: 'total_orders', label: 'Orders' },
                { field: 'total_spent', label: 'Spent' },
              ].map(({ field, label }) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                              text-xs font-medium border transition-colors whitespace-nowrap
                              ${
                                sort.field === field
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                              }`}
                >
                  {label}
                  {sort.field === field ? (
                    sort.order === 'asc' ? (
                      <ArrowUp size={11} />
                    ) : (
                      <ArrowDown size={11} />
                    )
                  ) : (
                    <ArrowUpDown size={11} className="text-gray-400" />
                  )}
                </button>
              ))}
              {sort.field && (
                <button
                  onClick={clearSort}
                  className="ml-auto text-xs text-gray-400 hover:text-gray-600 underline shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="divide-y">
              {loading
                ? Array.from({ length: skeletonCount }).map((_, i) => (
                    <SkeletonCard key={`msk-${i}`} opacity={isFirstLoad ? 1 : 1 - i * 0.06} />
                  ))
                : customers.length > 0
                ? customers.map((c, i) => (
                    <div
                      key={c.id || c._id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                      style={{
                        animation: 'fadeSlideIn 0.25s ease both',
                        animationDelay: `${i * 30}ms`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{c.name}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">
                            {c.customerId}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${statusBadge(
                            c.status
                          )}`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1 mb-3">
                        <div className="truncate"><span className="text-gray-400">Email:</span> {c.email}</div>
                        <div><span className="text-gray-400">Phone:</span> {c.phone || '—'}</div>
                        <div className="flex items-center justify-between pt-1">
                          <span>Orders: <b>{c.totalOrders}</b></span>
                          <span>Spent: <b>₹{Number(c.totalSpent || 0).toLocaleString('en-IN')}</b></span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openViewModal(c)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs
                                   font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={14} /> View Details
                        </button>
                        <button
                          onClick={() => openEditDrawer(c)}
                          className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit2 size={14} /> Status
                        </button>
                      </div>
                    </div>
                  ))
                : null}
              {!loading && customers.length === 0 && (
                <div className="py-20 text-center text-gray-400">
                  {committedSearch
                    ? `No results for "${committedSearch}"`
                    : 'No customers found.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── PAGINATION ── */}
        {!loading && (
          <div
            className="border rounded-xl px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-sm"
            style={{ animation: 'fadeSlideIn 0.3s ease both' }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left order-2 sm:order-1">
                {totalCount === 0 ? (
                  <span className="text-gray-400">No results</span>
                ) : (
                  <>
                    <span className="font-medium text-gray-900">Page {currentPage}</span>
                    <span className="mx-1.5 text-gray-300">•</span>
                    Showing <span className="font-medium text-gray-900">{startRow}</span>
                    {' – '}
                    <span className="font-medium text-gray-900">{endRow}</span>
                    {' of '}
                    <span className="font-medium text-gray-900">{totalCount}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-md border text-sm
                             font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  title="First page"
                >
                  «
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs sm:text-sm font-medium
                             disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
                        currentPage === n
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-50 text-gray-700'
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
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs sm:text-sm font-medium
                             disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-md border text-sm
                             font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  title="Last page"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CUSTOMER DETAILS VIEW MODAL ── */}
      {viewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeViewModal}
          />
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            style={{ animation: 'fadeSlideIn 0.25s ease both' }}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {selectedCustomer.name?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h2>
                    <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                      {selectedCustomer.customerId}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusBadge(selectedCustomer.status)}`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Customer registered on {new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <button
                onClick={closeViewModal}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {loadingDetails ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw size={28} className="animate-spin text-blue-600 mx-auto" />
                  <p className="text-sm text-gray-500">Loading complete customer record…</p>
                </div>
              ) : detailsError ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{detailsError}</span>
                </div>
              ) : (
                <>
                  {/* Basic Profile & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border bg-gray-50/50 flex items-start gap-3">
                      <Mail size={18} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-400 font-medium">Email Address</div>
                        <div className="text-sm font-semibold text-gray-900 break-all">{selectedCustomer.email || '—'}</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border bg-gray-50/50 flex items-start gap-3">
                      <Phone size={18} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-400 font-medium">Phone Number</div>
                        <div className="text-sm font-semibold text-gray-900">{selectedCustomer.phone || '—'}</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border bg-gray-50/50 flex items-start gap-3">
                      <User size={18} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-400 font-medium">Gender & Notifications</div>
                        <div className="text-sm font-semibold text-gray-900 capitalize">
                          {selectedCustomer.gender || 'Not specified'}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Newsletter: {selectedCustomer.newsletterSubscribed ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary Metric Cards */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                      Order Summary & Spending
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40">
                        <div className="text-xs text-blue-600 font-medium">Total Orders</div>
                        <div className="text-xl font-bold text-blue-900 mt-1">
                          {selectedCustomer.stats?.totalOrders ?? selectedCustomer.totalOrders ?? 0}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl border border-green-100 bg-green-50/40">
                        <div className="text-xs text-green-600 font-medium">Delivered Orders</div>
                        <div className="text-xl font-bold text-green-900 mt-1">
                          {selectedCustomer.stats?.completedOrders ?? 0}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40">
                        <div className="text-xs text-amber-600 font-medium">In Progress</div>
                        <div className="text-xl font-bold text-amber-900 mt-1">
                          {selectedCustomer.stats?.pendingOrders ?? 0}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40">
                        <div className="text-xs text-purple-600 font-medium">Total Spent</div>
                        <div className="text-xl font-bold text-purple-900 mt-1">
                          ₹{Number(selectedCustomer.stats?.totalSpent ?? selectedCustomer.totalSpent ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Saved Addresses */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Saved Delivery Addresses ({selectedCustomer.addresses?.length || 0})
                      </h3>
                    </div>

                    {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedCustomer.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`p-4 rounded-xl border text-sm ${
                              addr.isDefault ? 'border-blue-300 bg-blue-50/20' : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                                <MapPin size={15} className="text-blue-600" />
                                {addr.tag || 'Address'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] font-bold uppercase bg-blue-600 text-white px-2 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-gray-700 space-y-0.5">
                              <div>{addr.houseDetails}</div>
                              {addr.streetArea && <div>{addr.streetArea}</div>}
                              {addr.landmark && <div className="text-gray-500 text-xs">Landmark: {addr.landmark}</div>}
                              <div>
                                {addr.city}, {addr.state} - <span className="font-mono">{addr.pincode}</span>
                              </div>
                              <div className="text-xs text-gray-500 pt-1">
                                Recipient: {addr.customerName} ({addr.phone})
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-sm text-gray-400">
                        No saved delivery addresses found for this customer.
                      </div>
                    )}
                  </div>

                  {/* Recent Order History */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                      Order History ({selectedCustomer.recentOrders?.length || 0})
                    </h3>

                    {selectedCustomer.recentOrders && selectedCustomer.recentOrders.length > 0 ? (
                      <div className="border rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-gray-50 border-b text-gray-600 font-medium">
                            <tr>
                              <th className="px-3 py-2.5">Order Ref</th>
                              <th className="px-3 py-2.5">Date</th>
                              <th className="px-3 py-2.5">Total Amount</th>
                              <th className="px-3 py-2.5">Order Status</th>
                              <th className="px-3 py-2.5">Payment</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedCustomer.recentOrders.map((ord) => (
                              <tr key={ord.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-mono font-medium text-gray-900">
                                  {ord.orderReference}
                                </td>
                                <td className="px-3 py-2 text-gray-500">
                                  {new Date(ord.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-2 font-semibold text-gray-900">
                                  ₹{Number(ord.totalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusBadge(ord.orderStatus)}`}>
                                    {ord.orderStatus}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-gray-600">
                                  {ord.paymentMethod} • <span className="capitalize">{ord.paymentStatus}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-sm text-gray-400">
                        No orders placed yet by this customer.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  closeViewModal();
                  openEditDrawer(selectedCustomer);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit2 size={14} /> Edit Status
              </button>

              <button
                type="button"
                onClick={closeViewModal}
                className="px-4 py-2 text-xs sm:text-sm border rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT STATUS DRAWER ── */}
      {drawerOpen && currentCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <div
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            style={{ animation: 'slideInRight 0.25s ease both' }}
          >
            <div className="p-4 sm:p-6 border-b flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Edit Customer Status</h2>
              <button
                onClick={closeDrawer}
                className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                <X size={18} className="text-gray-700" />
              </button>
            </div>

            <form className="flex-1 flex flex-col overflow-hidden" onSubmit={submitForm}>
              <div className="p-4 sm:p-6 flex-1 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentCustomer.customerId}
                    className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 text-gray-600 cursor-not-allowed font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentCustomer.name}
                    className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentCustomer.email}
                    className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-black mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    required
                    className="w-full border-2 border-blue-300 rounded-lg p-2.5 text-sm bg-white outline-none
                               focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Changes are saved to the customer account record</p>
                </div>
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-xs">
                    {submitError}
                  </div>
                )}
                <div className="pt-2 border-t text-xs text-gray-500 space-y-1">
                  <div>
                    <span className="font-semibold">Registered: </span>
                    {new Date(currentCustomer.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Last Updated: </span>
                    {new Date(currentCustomer.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t flex gap-3 bg-gray-50">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex-1 py-2.5 text-sm border rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || form.status === currentCustomer.status}
                  className="flex-1 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {submitting ? 'Updating…' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Global keyframes ── */}
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
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0);    }
        }
      `}</style>
    </div>
  );
}
