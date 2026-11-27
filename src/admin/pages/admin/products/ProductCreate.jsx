import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { resolveProductImage } from "../../../../utils/productImages";
import {
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  IndianRupee,
  Package
} from "lucide-react";
import { BiSolidCartDownload } from "react-icons/bi";

// Image upload constraints
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB per file

export default function ProductCreate({ productId, onClose, onSuccess }) {
  const navigate = useNavigate();
  const isEdit = Boolean(productId);
  const fileInputRef = useRef(null);

  // Core Form State
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Optional Fields
  const [oldPrice, setOldPrice] = useState("");
  const [edition, setEdition] = useState("");
  const [features, setFeatures] = useState([]);
  const [images, setImages] = useState([]);

  // System & Metadata State
  const [slug, setSlug] = useState("");
  const [productDisplayId, setProductDisplayId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});

  const adminId = JSON.parse(localStorage.getItem("admin"))?.id;

  // Auto-generate clean slug from product name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Fetch product data when editing
  useEffect(() => {
    if (isEdit && productId) {
      loadProduct();
    } else {
      // For new product, fetch next product ID sequence
      fetchNextId();
    }
  }, [isEdit, productId]);

  const fetchNextId = async () => {
    try {
      const res = await api.get("/products/categories");
      if (res.data?.productId) {
        setProductDisplayId(res.data.productId);
      }
    } catch (err) {
      console.warn("Could not fetch next product ID:", err);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${productId}`);
      const p = res.data?.data;
      if (!p) return;

      setProductDisplayId(p.productId || `PROD-${String(p.id).padStart(4, "0")}`);
      setProductName(p.name || "");
      setSlug(p.slug || "");
      setDescription(p.description || "");
      setPrice(p.price != null ? String(p.price) : "");
      setStock(p.stock != null ? String(p.stock) : (p.stock_quantity != null ? String(p.stock_quantity) : ""));
      setOldPrice(p.oldPrice != null && Number(p.oldPrice) > 0 ? String(p.oldPrice) : (p.original_price != null && Number(p.original_price) > 0 ? String(p.original_price) : ""));
      setEdition(p.subtitle || p.edition || "");

      // Features
      if (Array.isArray(p.features) && p.features.length > 0) {
        setFeatures(p.features);
      } else {
        setFeatures([]);
      }

      // Images
      const imgList = (p.images && p.images.length > 0) ? p.images : (p.image ? [p.image] : []);
      setImages(
        imgList.filter(Boolean).map((imgUrl) => ({
          preview: resolveProductImage(imgUrl),
          url: imgUrl,
        }))
      );
    } catch (err) {
      console.error("Fetch product error:", err);
      alert("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  // Feature item handlers
  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Multiple image upload handler
  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > 8) {
      alert("Maximum 8 images allowed per product.");
      return;
    }

    const validNewEntries = [];
    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
        alert(`"${file.name}" is not a supported format. Please upload JPEG, PNG, WEBP, GIF, or AVIF images.`);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        alert(`"${file.name}" exceeds the 5MB size limit. Please upload a smaller image.`);
        continue;
      }

      validNewEntries.push({
        file,
        preview: URL.createObjectURL(file),
        url: null, // Marks as a new file needing upload
      });
    }

    if (validNewEntries.length > 0) {
      setImages((prev) => [...prev, ...validNewEntries]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    const target = images[index];
    if (target?.preview && target.preview.startsWith("blob:")) {
      URL.revokeObjectURL(target.preview);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      navigate(`/admin/products?id=${adminId || ""}`);
    }
  };

  // Form submission with strict validation on required fields only
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (submitting) return;

    const newErrors = {};

    // 1. Required: Product Name
    if (!productName || !productName.trim()) {
      newErrors.name = "Product Name is required";
    }

    // 2. Required: Product Description
    if (!description || !description.trim()) {
      newErrors.description = "Product Description is required";
    }

    // 3. Required: Product Price
    const numericPrice = parseFloat(price);
    if (price === "" || isNaN(numericPrice) || numericPrice <= 0) {
      newErrors.price = "A valid price greater than 0 is required";
    }

    // 4. Required: Stock
    const numericStock = parseInt(stock, 10);
    if (stock === "" || isNaN(numericStock) || numericStock < 0) {
      newErrors.stock = "A valid stock quantity (0 or more) is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      // Clean features: remove empty trimmed strings
      const cleanedFeatures = features
        .map((f) => (typeof f === "string" ? f.trim() : ""))
        .filter(Boolean);

      // 1. Separate new files needing upload from existing preserved URLs
      const filesToUpload = images.filter((img) => img.file).map((img) => img.file);
      let uploadedUrls = [];

      if (filesToUpload.length > 0) {
        const formData = new FormData();
        filesToUpload.forEach((file) => {
          formData.append("images", file);
        });

        const uploadRes = await api.post("/products/upload-images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadRes.data?.data?.urls) {
          uploadedUrls = uploadRes.data.data.urls;
        } else if (uploadRes.data?.data?.url) {
          uploadedUrls = [uploadRes.data.data.url];
        }
      }

      // 2. Map final image URLs preserving existing URLs & newly uploaded paths in order
      let uploadCursor = 0;
      const finalImageUrls = images
        .map((img) => {
          if (img.url) {
            return img.url; // Existing saved image preserved!
          }
          return uploadedUrls[uploadCursor++];
        })
        .filter(Boolean);

      // Parse optional oldPrice
      const numericOldPrice = oldPrice && !isNaN(parseFloat(oldPrice)) && parseFloat(oldPrice) > 0
        ? parseFloat(oldPrice)
        : null;

      const payload = {
        name: productName.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        price: numericPrice,
        stock: numericStock,
        stock_quantity: numericStock,
        // Optional fields: null when empty
        oldPrice: numericOldPrice,
        original_price: numericOldPrice,
        edition: edition.trim() || null,
        subtitle: edition.trim() || null,
        features: cleanedFeatures,
        images: finalImageUrls,
        image: finalImageUrls.length > 0 ? finalImageUrls[0] : null,
      };

      if (isEdit) {
        await api.put(`/products/${productId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      if (typeof onSuccess === "function") {
        onSuccess();
      }

      handleClose();
    } catch (err) {
      console.error("Save product failed:", err);
      const msg = err.response?.data?.message || err.message || "Failed to save product.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12 bg-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#162A78] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading product information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* ================= MODAL / PAGE HEADER ================= */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#162A78]/10 text-[#162A78]">
            <BiSolidCartDownload size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-gray-500">
              The Gifted Pencil • Store Catalog Management
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* ================= FORM BODY ================= */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* ================= SECTION 1: REQUIRED BASIC DETAILS ================= */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <BookOpen size={18} className="text-[#162A78]" />
                <h3>Product Overview</h3>
              </div>
              <span className="text-xs text-red-500 font-medium">* Required fields</span>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => {
                  const val = e.target.value;
                  setProductName(val);
                  if (!isEdit) {
                    setSlug(generateSlug(val));
                  }
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                placeholder="e.g. Daily Gratitude Journal - Linen Edition"
                className={`w-full h-11 px-4 text-sm rounded-xl border transition-all outline-none ${
                  errors.name
                    ? "border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#162A78] focus:ring-2 focus:ring-[#162A78]/20"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={13} /> {errors.name}
                </p>
              )}
              {slug && (
                <p className="text-xs text-gray-400 mt-1">
                  Storefront URL identifier: <span className="text-[#162A78] font-mono font-medium">{slug}</span>
                </p>
              )}
            </div>

            {/* Edition / Journal Details (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Edition / Journal Details <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <span className="text-xs text-gray-400">Displayed in product overview badge</span>
              </div>
              <input
                type="text"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="e.g. First Edition • Premium Hardbound Journal"
                className="w-full h-11 px-4 text-sm rounded-xl border border-gray-200 focus:border-[#162A78] focus:ring-2 focus:ring-[#162A78]/20 transition-all outline-none"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors({ ...errors, description: undefined });
                  }
                }}
                placeholder="Describe the journal, paper quality, purpose, craftsmanship and writing experience..."
                className={`w-full p-4 text-sm rounded-xl border transition-all outline-none resize-y ${
                  errors.description
                    ? "border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#162A78] focus:ring-2 focus:ring-[#162A78]/20"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={13} /> {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* ================= SECTION 2: PRICING & INVENTORY ================= */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <IndianRupee size={18} className="text-[#162A78]" />
                <h3>Pricing & Inventory</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Product Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price) {
                        setErrors({ ...errors, price: undefined });
                      }
                    }}
                    placeholder="299.00"
                    className={`w-full h-11 pl-8 pr-3 text-sm rounded-xl border transition-all outline-none ${
                      errors.price
                        ? "border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-[#162A78] focus:ring-2 focus:ring-[#162A78]/20"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.price}
                  </p>
                )}
              </div>

              {/* Old Price (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Old Price (₹) <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="399.00"
                    className="w-full h-11 pl-8 pr-3 text-sm rounded-xl border border-gray-200 focus:border-[#162A78] focus:ring-2 focus:ring-[#162A78]/20 transition-all outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Strikethrough comparison price</p>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Stock Units <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => {
                      setStock(e.target.value);
                      if (errors.stock) {
                        setErrors({ ...errors, stock: undefined });
                      }
                    }}
                    placeholder="100"
                    className={`w-full h-11 pl-9 pr-3 text-sm rounded-xl border transition-all outline-none ${
                      errors.stock
                        ? "border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-[#162A78] focus:ring-2 focus:ring-[#162A78]/20"
                    }`}
                  />
                </div>
                {errors.stock ? (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.stock}
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Available inventory quantity
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================= SECTION 3: FEATURES (OPTIONAL DYNAMIC LIST) ================= */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Sparkles size={18} className="text-[#162A78]" />
                <h3>Product Features <span className="text-gray-400 font-normal lowercase">(optional)</span></h3>
              </div>
              <button
                type="button"
                onClick={handleAddFeature}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162A78]/10 text-[#162A78] text-xs font-semibold hover:bg-[#162A78]/20 transition-all"
              >
                <Plus size={14} /> Add Feature
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Highlight craftsmanship, paper thickness, binding style, or unique properties. Leave empty if no specific bullets are needed.
            </p>

            {features.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center text-xs text-gray-400 bg-gray-50/50">
                No features added yet. Click &quot;Add Feature&quot; to include bullet points on the customer product page.
              </div>
            ) : (
              <div className="space-y-3">
                {features.map((feat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 w-6 text-center">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="e.g. 160 GSM premium cream paper engineered to prevent ink bleed"
                      className="flex-1 h-10 px-3.5 text-sm rounded-xl border border-gray-200 focus:border-[#162A78] focus:ring-2 focus:ring-[#162A78]/20 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove feature"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= SECTION 4: PRODUCT IMAGES (OPTIONAL MULTIPLE) ================= */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <ImageIcon size={18} className="text-[#162A78]" />
                <h3>Product Images <span className="text-gray-400 font-normal lowercase">(optional)</span></h3>
              </div>
              <span className="text-xs text-gray-400">{images.length} / 8 uploaded</span>
            </div>

            <p className="text-xs text-gray-500">
              Upload high-resolution product photos. The first image serves as the main storefront cover.
            </p>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFiles}
              className="hidden"
            />

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm"
                >
                  <img
                    src={img.preview || resolveProductImage(img.url)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#162A78]/90 text-white text-[10px] font-semibold">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    title="Remove image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              {/* Upload trigger button */}
              {images.length < 8 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#162A78] hover:bg-blue-50/20 transition-all text-gray-500 hover:text-[#162A78]"
                >
                  <Upload size={20} />
                  <span className="text-xs font-semibold">Upload Images</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* ================= ACTION BAR ================= */}
        <div className="max-w-4xl mx-auto pt-2 pb-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="h-11 px-6 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="h-11 px-8 rounded-xl bg-[#162A78] text-white text-sm font-semibold shadow hover:bg-[#1e3494] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 size={17} />
                {isEdit ? "Update Product" : "Save Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
