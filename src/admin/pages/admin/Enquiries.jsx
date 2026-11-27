// Enquiries.jsx
import React, { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Tag,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useContacts, STATUS_OPTIONS } from '../../context/ContactContext';

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
      <Shimmer w="w-28" />
    </td>
    <td className="px-4 py-3">
      <Shimmer w="w-36" />
    </td>
    <td className="px-4 py-3">
      <Shimmer w="w-24" />
    </td>
    <td className="px-4 py-3">
      <Shimmer w="w-48" />
    </td>
    <td className="px-4 py-3">
      <Shimmer w="w-20" />
    </td>
    <td className="px-4 py-3">
      <Shimmer w="w-16" h="h-5" rounded="rounded-full" />
    </td>
    <td className="px-4 py-3 flex justify-end gap-2">
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

// ─── Status badge helper ──────────────────────────────────────────────────────
const statusBadge = (s) => {
  const norm = String(s || '').toLowerCase();
  switch (norm) {
    case 'new':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'in_progress':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'resolved':
      return 'bg-green-100 text-green-700 border border-green-200';
    case 'archived':
      return 'bg-gray-100 text-gray-700 border border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const statusIcon = (s) => {
  const norm = String(s || '').toLowerCase();
  switch (norm) {
    case 'new':
      return <AlertCircle size={13} className="text-blue-600 inline mr-1" />;
    case 'in_progress':
      return <Clock size={13} className="text-amber-600 inline mr-1" />;
    case 'resolved':
      return <CheckCircle2 size={13} className="text-green-600 inline mr-1" />;
    case 'archived':
      return <Archive size={13} className="text-gray-500 inline mr-1" />;
    default:
      return null;
  }
};

export default function Enquiries() {
  const {
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
  } = useContacts();

  // Local state for modal status form
  const [modalStatus, setModalStatus] = useState('new');
  const [modalNotes, setModalNotes] = useState('');
  const [modalFeedback, setModalFeedback] = useState(null);

  // Sync modal form when selectedContact loads
  useEffect(() => {
    if (selectedContact) {
      setModalStatus(selectedContact.status || 'new');
      setModalNotes(selectedContact.adminNotes || '');
      setModalFeedback(null);
    }
  }, [selectedContact]);

  // Initial load & filter change
  useEffect(() => {
    setCurrentPage(1);
    fetchContacts(1);
  }, [statusFilter, committedSearch, sort]);

  const handleModalStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedContact) return;
    setModalFeedback(null);
    try {
      await updateStatus(selectedContact.id || selectedContact._id, modalStatus, modalNotes);
      setModalFeedback({ type: 'success', text: 'Enquiry status updated successfully.' });
    } catch (err) {
      setModalFeedback({ type: 'error', text: err.message || 'Failed to update enquiry status.' });
    }
  };

  const handleQuickResolve = async () => {
    if (!selectedContact) return;
    setModalFeedback(null);
    try {
      await updateStatus(selectedContact.id || selectedContact._id, 'resolved', modalNotes);
      setModalStatus('resolved');
      setModalFeedback({ type: 'success', text: 'Enquiry marked as Resolved.' });
    } catch (err) {
      setModalFeedback({ type: 'error', text: err.message || 'Failed to update status.' });
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-6 sm:py-8 rounded-md">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* ── HEADER ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="text-blue-600" size={24} />
              Contact Enquiries
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 transition-all duration-300">
              {loading ? (
                <span className="inline-block w-28 h-3 rounded bg-gray-200 animate-shimmer align-middle" />
              ) : (
                `${totalCount} total customer submission${totalCount !== 1 ? 's' : ''}`
              )}
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
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

        {/* ── SEARCH + STATUS FILTERS ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 min-w-0">
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by customer name, email, phone, or message…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKey}
                className="h-10 w-full border border-gray-300 pl-9 pr-9 text-sm rounded-l-lg
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
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none bg-white cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={sort.field}
              onChange={(e) => handleSort(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none bg-white cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Customer Name</option>
            </select>
          </div>
        </div>

        {/* ── Active search chip ── */}
        {committedSearch && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-400">Searching for</span>
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

        {/* ── ERROR BANNER ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span><b>Failed to load enquiries:</b> {error}</span>
            </div>
            <button
              onClick={() => fetchContacts(currentPage)}
              className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── TABLE (DESKTOP) ── */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Topic / Subject</th>
                  <th className="px-4 py-3">Message Preview</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading
                  ? Array.from({ length: skeletonCount }).map((_, i) => (
                      <SkeletonRow key={`sk-${i}`} opacity={isFirstLoad ? 1 : 1 - i * 0.06} />
                    ))
                  : contacts.length > 0
                  ? contacts.map((c, i) => (
                      <tr
                        key={c.id || c._id}
                        className="hover:bg-gray-50 transition-all duration-200"
                        style={{
                          animation: `fadeSlideIn 0.25s ease both`,
                          animationDelay: `${i * 30}ms`,
                        }}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{c.name}</div>
                          {c.phone && <div className="text-xs text-gray-400">{c.phone}</div>}
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs truncate max-w-[180px]" title={c.email}>
                          {c.email}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-semibold text-gray-800">{c.enquiryType || 'General Enquiry'}</div>
                          {c.subject && <div className="text-xs text-gray-500 truncate max-w-xs">{c.subject}</div>}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          <p className="line-clamp-2 max-w-sm">{c.message}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(c.status)}`}>
                            {statusIcon(c.status)}
                            {c.statusLabel || c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => openViewModal(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                            title="View Enquiry Details"
                          >
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}

                {!loading && contacts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-gray-400">
                      {committedSearch
                        ? `No contact enquiries found matching "${committedSearch}"`
                        : 'No contact enquiries received yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="md:hidden divide-y">
            {loading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <SkeletonCard key={`msk-${i}`} opacity={isFirstLoad ? 1 : 1 - i * 0.06} />
                ))
              : contacts.length > 0
              ? contacts.map((c, i) => (
                  <div
                    key={c.id || c._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                    style={{
                      animation: 'fadeSlideIn 0.25s ease both',
                      animationDelay: `${i * 30}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{c.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{c.email}</div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(c.status)}`}>
                        {c.statusLabel || c.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg mb-3">
                      <div className="font-semibold text-gray-800 mb-0.5">{c.enquiryType || 'General Enquiry'}</div>
                      <p className="line-clamp-2 text-gray-600">{c.message}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => openViewModal(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        <Eye size={13} /> View Details
                      </button>
                    </div>
                  </div>
                ))
              : null}

            {!loading && contacts.length === 0 && (
              <div className="py-20 text-center text-gray-400">
                {committedSearch
                  ? `No results for "${committedSearch}"`
                  : 'No contact enquiries found.'}
              </div>
            )}
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

      {/* ── ENQUIRY DETAILS MODAL ── */}
      {viewModalOpen && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeViewModal}
          />
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            style={{ animation: 'fadeSlideIn 0.25s ease both' }}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {selectedContact.name?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{selectedContact.name}</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusBadge(selectedContact.status)}`}>
                      {selectedContact.statusLabel || selectedContact.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Calendar size={13} />
                    Submitted on {new Date(selectedContact.createdAt).toLocaleString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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
            <div className="p-6 overflow-y-auto space-y-5">
              {loadingDetails ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw size={24} className="animate-spin text-blue-600 mx-auto" />
                  <p className="text-sm text-gray-500">Loading complete enquiry record…</p>
                </div>
              ) : detailsError ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{detailsError}</span>
                </div>
              ) : (
                <>
                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border bg-gray-50/50">
                      <div className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                        <Mail size={13} className="text-blue-600" /> Email
                      </div>
                      <div className="text-xs font-semibold text-gray-900 break-all">{selectedContact.email}</div>
                    </div>

                    <div className="p-3.5 rounded-xl border bg-gray-50/50">
                      <div className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                        <Phone size={13} className="text-blue-600" /> Phone
                      </div>
                      <div className="text-xs font-semibold text-gray-900">{selectedContact.phone || 'Not provided'}</div>
                    </div>

                    <div className="p-3.5 rounded-xl border bg-gray-50/50">
                      <div className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                        <Tag size={13} className="text-blue-600" /> Enquiry Type
                      </div>
                      <div className="text-xs font-semibold text-gray-900">{selectedContact.enquiryType || 'General Enquiry'}</div>
                    </div>
                  </div>

                  {/* Subject (if present) */}
                  {selectedContact.subject && (
                    <div className="p-3.5 rounded-xl border bg-gray-50/50">
                      <div className="text-xs text-gray-400 font-medium mb-1">Subject</div>
                      <div className="text-sm font-semibold text-gray-900">{selectedContact.subject}</div>
                    </div>
                  )}

                  {/* Message Body */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                      <FileText size={14} className="text-blue-600" /> Customer Message
                    </h3>
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed font-sans">
                      {selectedContact.message}
                    </div>
                  </div>

                  {/* Status & Admin Notes Form */}
                  <form onSubmit={handleModalStatusSubmit} className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Status & Admin Notes
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Enquiry Status
                        </label>
                        <select
                          value={modalStatus}
                          onChange={(e) => setModalStatus(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        >
                          <option value="new">New (Unread)</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleQuickResolve}
                          disabled={updatingStatus || selectedContact.status === 'resolved'}
                          className="w-full py-2 px-3 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={14} /> Quick Mark as Resolved
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Admin Internal Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Internal follow-up notes or resolution summary…"
                        value={modalNotes}
                        onChange={(e) => setModalNotes(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                      />
                    </div>

                    {modalFeedback && (
                      <div
                        className={`p-2.5 rounded-lg text-xs ${
                          modalFeedback.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {modalFeedback.text}
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={updatingStatus}
                        className="px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        {updatingStatus ? <RefreshCw size={13} className="animate-spin" /> : null}
                        Save Status & Notes
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
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
      `}</style>
    </div>
  );
}
