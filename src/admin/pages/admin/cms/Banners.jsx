import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import {
  ImagePlus,
  CloudUpload,
  Crop,
  ArrowRight,
  Eye,
  EyeOff,
  Edit2,
  Search,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
} from "lucide-react";
import { useBanner } from "../../../context/BannerContext";
import { getCroppedImg } from "../../../utils/imageCrop";

export default function Banners() {
  const {
    banners,
    loading,
    error,
    pagination,
    loadBanners,
    addBanner,
    editBanner,
    toggleStatus,
  } = useBanner();

  /* ================= FILTERS & SEARCH ================= */
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  /* ================= MODAL STATE ================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Cropper / File State
  const [imageSrc, setImageSrc] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [finalPreview, setFinalPreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(2500 / 750);
  const [croppedPixels, setCroppedPixels] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ================= PREVIEW MODAL STATE ================= */
  const [previewBanner, setPreviewBanner] = useState(null);

  const showNotification = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 4000);
  };

  /* ================= HANDLE FILTERING ================= */
  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (activeFilter === "active") params.is_active = true;
    if (activeFilter === "inactive") params.is_active = false;
    loadBanners(params);
  };

  const handleFilterChange = (val) => {
    setActiveFilter(val);
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (val === "active") params.is_active = true;
    if (val === "inactive") params.is_active = false;
    loadBanners(params);
  };

  /* ================= FILE UPLOAD & CROP ================= */
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedPixels(pixels);
  }, []);

  const applyCrop = async () => {
    if (!imageSrc || !croppedPixels) return;

    try {
      const file = await getCroppedImg(imageSrc, croppedPixels);
      setFinalImage(file);
      setFinalPreview(URL.createObjectURL(file));
    } catch (err) {
      console.error("Crop error:", err);
      showNotification("error", "Failed to crop image. Please try again.");
    }
  };

  /* ================= OPEN CREATE / EDIT MODAL ================= */
  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle("");
    setSubtitle("");
    setCtaText("");
    setCtaLink("");
    setSortOrder(0);
    setIsActive(true);
    setImageSrc(null);
    setFinalImage(null);
    setFinalPreview(null);
    setExistingImageUrl("");
    setModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBanner(b);
    setTitle(b.title || "");
    setSubtitle(b.subtitle || "");
    setCtaText(b.cta_text || "");
    setCtaLink(b.cta_link || "");
    setSortOrder(b.sort_order || 0);
    setIsActive(Boolean(b.is_active));
    setImageSrc(null);
    setFinalImage(null);
    setFinalPreview(null);
    setExistingImageUrl(b.image || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBanner(null);
    setImageSrc(null);
    setFinalImage(null);
    setFinalPreview(null);
    setExistingImageUrl("");
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  /* ================= SUBMIT BANNER ================= */
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!editingBanner && !finalImage && !existingImageUrl) {
      showNotification("error", "Please upload and crop an image for the banner.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      if (finalImage) {
        formData.append("image", finalImage);
      }
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("cta_text", ctaText);
      formData.append("cta_link", ctaLink);
      formData.append("sort_order", sortOrder);
      formData.append("is_active", isActive ? 1 : 0);

      if (editingBanner) {
        await editBanner(editingBanner.id, formData);
        showNotification("success", "Banner updated successfully.");
      } else {
        await addBanner(formData);
        showNotification("success", "Banner created successfully.");
      }
      closeModal();
    } catch (err) {
      console.error("Submit error:", err);
      showNotification("error", err?.response?.data?.message || err.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= TOGGLE ACTIVE STATUS ================= */
  const handleToggleStatus = async (banner) => {
    const nextStatus = !banner.is_active;
    try {
      await toggleStatus(banner.id, nextStatus);
      showNotification(
        "success",
        `Banner "${banner.title || banner.id}" ${nextStatus ? "activated" : "deactivated"}.`
      );
    } catch (err) {
      console.error("Status toggle error:", err);
      showNotification("error", "Failed to update status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Banner Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage promotional hero banners and marketing messages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadBanners()}
            className="flex items-center gap-1.5 px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
            title="Refresh list"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <ImagePlus size={18} />
            Add New Banner
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {feedback.message && (
        <div
          className={`flex items-center gap-2 p-3 mb-4 rounded-lg text-sm ${
            feedback.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {feedback.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, subtitle, or CTA text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Status:</span>
          <select
            value={activeFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Banners</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* BANNERS TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-gray-600 font-semibold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">Banner Image</th>
              <th className="px-4 py-3">Title & Subtitle</th>
              <th className="px-4 py-3">CTA Button</th>
              <th className="px-4 py-3 text-center">Sort Order</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <RefreshCw className="animate-spin text-blue-600" size={20} />
                    <span>Loading banners...</span>
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-red-500 font-medium">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && banners.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-400">
                  <p className="text-base font-medium">No banners found</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">
                    Get started by creating your first promotional hero banner
                  </p>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
                  >
                    <ImagePlus size={16} />
                    Add New Banner
                  </button>
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              banners.map((b, index) => (
                <tr key={b.id || index} className="hover:bg-gray-50/70 transition">
                  <td className="px-4 py-3 text-center text-gray-400 font-mono text-xs">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      onClick={() => setPreviewBanner(b)}
                      className="cursor-pointer group relative w-36 h-14 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center"
                    >
                      <img
                        src={b.image}
                        alt={b.title || "Banner"}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x100?text=Banner+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium">
                        Preview
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{b.title || "—"}</div>
                    {b.subtitle && (
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{b.subtitle}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {b.cta_text ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        <span>{b.cta_text}</span>
                        {b.cta_link && <ExternalLink size={12} className="text-blue-500" />}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm text-gray-700">
                    {b.sort_order ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(b)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                        b.is_active
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={b.is_active ? "Click to deactivate" : "Click to activate"}
                    >
                      {b.is_active ? (
                        <>
                          <Eye size={13} /> Active
                        </>
                      ) : (
                        <>
                          <EyeOff size={13} /> Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                        title="Edit Banner"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION INFO */}
      {pagination && pagination.total > 0 && (
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <span>Total Banners: {pagination.total}</span>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT BANNER ================= */}
      {modalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingBanner ? "Edit Banner" : "Create New Banner"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure banner media, promotional titles, CTA links, and display order
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* IMAGE UPLOAD & CROPPER SECTION */}
              <div className="border rounded-xl p-4 bg-gray-50/50">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Banner Image <span className="text-red-500">*</span>
                </label>

                {/* Case 1: No new image picked & no crop in progress */}
                {!imageSrc && !finalImage && (
                  <div>
                    {existingImageUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative w-full max-h-48 rounded-lg overflow-hidden border bg-gray-100">
                          <img
                            src={existingImageUrl}
                            alt="Current Banner"
                            className="w-full h-auto object-cover max-h-48"
                          />
                        </div>
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition">
                          <CloudUpload size={16} />
                          Replace Banner Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={onFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 bg-white transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onFileChange}
                          className="hidden"
                        />
                        <CloudUpload className="mx-auto text-blue-500 mb-2" size={32} />
                        <p className="text-sm font-medium text-gray-700">
                          Click to select a banner image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, WEBP, GIF or AVIF up to 5MB
                        </p>
                      </label>
                    )}
                  </div>
                )}

                {/* Case 2: New image picked, cropping in progress */}
                {imageSrc && !finalImage && (
                  <div className="space-y-4">
                    <div className="relative w-full h-[320px] bg-gray-900 rounded-xl overflow-hidden">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 items-center">
                      <div className="md:col-span-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Zoom</span>
                          <span>{zoom.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={3}
                          step={0.1}
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">
                          Aspect Ratio
                        </label>
                        <select
                          value={aspect}
                          onChange={(e) => setAspect(Number(e.target.value))}
                          className="w-full border rounded-lg px-3 py-1.5 text-sm bg-white"
                        >
                          <option value={2500 / 750}>2500 × 750 (Hero Banner)</option>
                          <option value={16 / 9}>16 : 9 (Widescreen)</option>
                          <option value={4 / 3}>4 : 3 (Standard)</option>
                          <option value={1}>1 : 1 (Square)</option>
                        </select>
                      </div>

                      <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setImageSrc(null)}
                          className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={applyCrop}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                        >
                          Apply Crop <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Case 3: Final cropped preview */}
                {finalImage && (
                  <div>
                    <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img
                        src={finalPreview}
                        alt="Cropped Preview"
                        className="w-full h-auto object-cover max-h-56"
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFinalImage(null);
                          setFinalPreview(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Crop size={14} /> Adjust Crop
                      </button>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium text-blue-700 hover:bg-blue-50 cursor-pointer transition">
                        <CloudUpload size={14} /> Choose Different Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* FORM FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Personalized Wooden Pens"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Crafted with passion, customized for you"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Now"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    CTA Link URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /shop or https://..."
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active (visible to visitors)
                    </span>
                  </label>
                </div>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm transition ${
                    submitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <CloudUpload size={18} />
                  {submitting ? "Saving..." : editingBanner ? "Save Changes" : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL: PREVIEW BANNER ================= */}
      {previewBanner && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                Banner Preview: {previewBanner.title || "Untitled"}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewBanner(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={previewBanner.image}
                  alt={previewBanner.title || "Banner Preview"}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-600">Title:</span>{" "}
                  <span className="text-gray-900">{previewBanner.title || "—"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Subtitle:</span>{" "}
                  <span className="text-gray-900">{previewBanner.subtitle || "—"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">CTA:</span>{" "}
                  <span className="text-gray-900">
                    {previewBanner.cta_text ? `${previewBanner.cta_text} (${previewBanner.cta_link || "No Link"})` : "—"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Sort Order:</span>{" "}
                  <span className="text-gray-900">{previewBanner.sort_order ?? 0}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewBanner(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
