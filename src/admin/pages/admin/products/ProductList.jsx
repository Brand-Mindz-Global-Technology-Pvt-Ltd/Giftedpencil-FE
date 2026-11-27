
import { useEffect, useState, useRef } from "react";
import api from "../../../api/axios";
import { resolveProductImage } from "../../../../utils/productImages";
import { Search, ShoppingBasket, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Upload, ChevronDown, Plus, RefreshCw, CheckCircle2, Power, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCreate from "../products/ProductCreate.jsx";
import BulkUploadModal from "./Bulkuploadmodal.jsx";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("admin"))?.id;
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive"

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // ✅ NEW STATE FOR BULK UPLOAD MODAL
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');

      const formatted = (res.data?.data || []).map((cat) => ({
        label: cat.name,
        value: cat.slug,
      }));

      setCategories(formatted);
    } catch (err) {
      console.error("Category fetch failed", err);
    }
  };

  useEffect(() => {
    if (category) {
      fetchSubCategories(category);
    } else {
      setSubCategories([]);
    }
  }, [category]);

  const fetchSubCategories = async (categorySlug) => {
    try {
      const res = await api.get(
        `/products/categories/${categorySlug}/subcategories`
      );

      const formatted = (res.data?.data || []).map((sub) => ({
        label: sub.name,
        value: sub.slug,
      }));

      setSubCategories(formatted);
    } catch (err) {
      console.error("Subcategory fetch failed", err);
      setSubCategories([]);
    }
  };

  // FETCH PRODUCTS (SAFE)
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get('/products/product-list', {
        params: {
          page,
          limit: 8,
          category,
          subCategory,
          search,
          status: statusFilter !== "all" ? statusFilter : undefined,
        },
      });

      setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch failed", err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category, subCategory, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [category, subCategory, search, statusFilter]);


  // ACTIVATE / DEACTIVATE PRODUCT
  const handleToggleStatus = async (product) => {
    const productId = product.id || product._id;
    const isActivating = !product.is_active;
    const confirmText = isActivating
      ? `Activate "${product.name}"? This product will become visible on the customer storefront.`
      : `Deactivate "${product.name}"? This product will be hidden from the customer storefront.`;

    if (!window.confirm(confirmText)) return;

    try {
      await api.patch(`/products/${productId}/status`, {
        is_active: isActivating,
      });
      fetchProducts();
      if (selectedProduct && (selectedProduct.id === productId || selectedProduct._id === productId)) {
        setSelectedProduct((prev) => ({
          ...prev,
          is_active: isActivating,
        }));
      }
    } catch (err) {
      console.error("Status toggle failed:", err);
      const msg = err.response?.data?.message || err.message || "Failed to update product status.";
      alert(msg);
    }
  };

  const handleDelete = async (productId) => {
    const target = products.find((p) => (p.id || p._id) === productId);
    if (target) {
      handleToggleStatus(target);
    } else {
      if (!window.confirm("Are you sure you want to deactivate this product?")) return;
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts();
      } catch (err) {
        console.error("Delete failed", err);
        alert("Delete failed");
      }
    }
  };

  // ✅ HANDLE BULK UPLOAD
  const handleBulkUpload = (data) => {
    console.log("Bulk upload data:", data);
    fetchProducts();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="space-y-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex flex-col gap-4">

            {/* STATUS FILTER TABS */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100/90 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === "all"
                    ? "bg-white text-[#162A78] shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All Products
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === "active"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("inactive")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === "inactive"
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Inactive
              </button>
            </div>

            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 flex-1">
                <div className="flex flex-col w-full sm:flex-1 lg:max-w-xs">
                  <label className="text-xs font-medium text-gray-500 mb-1.5">
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      placeholder="Search products..."
                      onChange={(e) => setSearch(e.target.value)}
                      className="
              w-full h-11
              pl-9 pr-3
              text-sm
              rounded-xl
              border border-gray-300
              bg-white
              focus:outline-none
              focus:ring-2 focus:ring-[#162A78]/20
              focus:border-[#162A78]
              transition-all
            "
                    />
                  </div>
                </div>

                {/* CATEGORY & SUB CATEGORY - Grid on mobile */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:items-end gap-3 sm:gap-4">

                  {/* CATEGORY */}
                  <div className="flex flex-col w-full sm:w-44 xl:w-48">
                    <label className="text-xs font-medium text-gray-500 mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="
              w-full h-11 px-3 text-sm
              rounded-xl
              border border-gray-300
              bg-white
              focus:outline-none
              focus:ring-2 focus:ring-[#162A78]/20
              focus:border-[#162A78]
              transition-all
            "
                    >
                      <option value="">All Categories</option>
                      {categories.map((c, i) => (
                        <option key={i} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* SUB CATEGORY */}
                  <div className="flex flex-col w-full sm:w-44 xl:w-48">
                    <label className="text-xs font-medium text-gray-500 mb-1.5">
                      Sub Category
                    </label>
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="
              w-full h-11 px-3 text-sm
              rounded-xl
              border border-gray-300
              bg-white
              focus:outline-none
              focus:ring-2 focus:ring-[#162A78]/20
              focus:border-[#162A78]
              transition-all
            "
                    >
                      <option value="">All Sub Categories</option>
                      {subCategories.map((s, i) => (
                        <option key={i} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* STATUS */}
                  <div className="flex flex-col w-full sm:w-36 xl:w-40">
                    <label className="text-xs font-medium text-gray-500 mb-1.5">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="
              w-full h-11 px-3 text-sm
              rounded-xl
              border border-gray-300
              bg-white
              focus:outline-none
              focus:ring-2 focus:ring-[#162A78]/20
              focus:border-[#162A78]
              transition-all
            "
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* ================= RIGHT ACTION SECTION ================= */}
              <div className="flex items-center gap-2 flex-shrink-0 self-stretch sm:self-auto">
                <div className="relative w-full sm:w-auto" ref={menuRef}>
                  <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="
            w-full sm:w-auto
            flex items-center justify-center gap-2
            h-11 px-6
            rounded-xl
            bg-[#162A78]
            text-white text-sm font-semibold
            shadow-sm
            hover:bg-[#1e3494]
            hover:shadow-md
            active:scale-[0.97]
            transition-all duration-200
            flex-shrink-0
            whitespace-nowrap
          "
                  >
                    Add Product
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${openMenu ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {openMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40 lg:hidden bg-black/5"
                        onClick={() => setOpenMenu(false)}
                      />

                      <div
                        className="
                absolute right-0 left-0 xs:left-auto mt-2 
                w-full xs:w-64
                bg-white
                rounded-xl
                shadow-xl
                border border-gray-100
                overflow-hidden
                z-50
              "
                      >
                        <button
                          onClick={() => {
                            navigate(`/admin/products/new?id=${id}`);
                            setOpenMenu(false);
                          }}
                          className="
                  w-full flex items-center gap-3
                  px-4 py-3.5 text-sm font-medium text-gray-700
                  hover:bg-blue-50
                  active:bg-blue-100
                  transition-colors
                  text-left
                "
                        >
                          <Plus size={16} className="text-[#162A78] flex-shrink-0" />
                          Add Product
                        </button>

                        <div className="border-t border-gray-100"></div>

                        <button
                          onClick={() => {
                            setIsBulkModalOpen(true);
                            setOpenMenu(false);
                          }}
                          className="
                  w-full flex items-center gap-3
                  px-4 py-3.5 text-sm font-medium text-gray-700
                  cursor-pointer
                  hover:bg-green-50
                  active:bg-green-100
                  transition-colors
                  text-left
                "
                        >
                          <Upload size={16} className="text-green-600 flex-shrink-0" />
                          Bulk Upload
                        </button>
                      </div>
                    </>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>

        <div className="bg-white rounded-xl p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw size={32} className="animate-spin text-[#162A78]" />
                <p className="text-gray-500 text-sm">Loading products...</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p.id || p._id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setActiveImage(p.images?.[0] || p.image);
                    setOpenViewModal(true);
                  }}
                  className={`group relative rounded-2xl border shadow-sm
                 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer ${
                   !p.is_active ? "border-amber-200/90 bg-gray-50/50" : "border-gray-100 bg-white"
                 }`}
                >
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-50">
                    <img
                      src={resolveProductImage(p.images?.[0] || p.image)}
                      alt={p.name}
                      onError={(e) => { e.currentTarget.src = resolveProductImage('product-1.png'); }}
                      className={`w-full h-full object-cover transition-transform duration-300
                     group-hover:scale-105 ${!p.is_active ? "opacity-75" : ""}`}
                    />

                    <div className="absolute top-3 right-3 flex flex-col gap-2
                        opacity-0 group-hover:opacity-100 transition z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(p.id || p._id);
                          setOpenModal(true);
                        }}
                        className="p-2 bg-white rounded-full shadow hover:bg-blue-50 text-blue-600"
                        title="Edit Product"
                      >
                        <Pencil size={15} />
                      </button>

                      {p.is_active ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(p);
                          }}
                          className="p-2 bg-white rounded-full shadow hover:bg-amber-50 text-amber-600"
                          title="Deactivate Product"
                        >
                          <Power size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(p);
                          }}
                          className="p-2 bg-white rounded-full shadow hover:bg-emerald-50 text-emerald-600"
                          title="Activate Product"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                    </div>

                    {/* STATUS & STOCK BADGES */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                          p.is_active
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-800/90 text-white backdrop-blur-sm"
                        }`}
                      >
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shadow-sm ${
                          p.stock > 0
                            ? "bg-white/90 text-green-700 backdrop-blur-sm"
                            : "bg-white/90 text-red-700 backdrop-blur-sm"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3
                        className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2 min-h-[2.5rem] leading-snug"
                        title={p.name}
                      >
                        {p.name}
                      </h3>
                      <p className="text-xs text-gray-500">{p.brand}</p>
                    </div>

                    <div className="text-xs text-gray-500">
                      {p.category}
                      {p.subCategory && <span> • {p.subCategory}</span>}
                    </div>

                    {/* PRICE */}
                    <div className="flex items-center gap-2">
                      <span className="text-[#162A78] font-semibold text-sm sm:text-base">
                        ₹ {formatPrice(p.price)}
                      </span>

                      {p.oldPrice && (
                        <span className="text-xs line-through text-gray-400">
                          ₹ {formatPrice(p.oldPrice)}
                        </span>
                      )}
                    </div>

                    {/* META */}
                    <div className="flex items-center justify-between text-xs text-gray-600
                        border-t pt-3">
                      <span>
                        Sold <b>{p.sales ?? 0}</b>
                      </span>

                      <span
                        className={`font-semibold ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </span>
                    </div>

                    {/* STATUS ACTION ROW */}
                    <div className="flex items-center justify-between border-t pt-2.5 mt-2">
                      <span className={`text-[11px] font-medium ${p.is_active ? "text-emerald-700" : "text-gray-500"}`}>
                        {p.is_active ? "● Active in Store" : "○ Inactive (Hidden)"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(p);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          p.is_active
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        }`}
                      >
                        {p.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </div>

                    {/* RATING */}
                    <div className="text-yellow-400 text-sm leading-none">
                      {"★".repeat(p.rating || 5)}
                      <span className="text-gray-400 ml-1">
                        ({p.rating || 5})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
              No products found
            </div>
          )}

          {/* ✅ VIEW MODAL (from old code) */}
          {openViewModal && selectedProduct && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">

              <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden relative">

                {/* CLOSE */}
                <button
                  onClick={() => setOpenViewModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black"
                >
                  ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">

                  {/* LEFT IMAGE */}
                  <div className="bg-gray-50 p-6">

                    {/* MAIN IMAGE */}
                    <img
                      src={resolveProductImage(activeImage || selectedProduct.images?.[0] || selectedProduct.image)}
                      className="w-full h-64 object-contain rounded-lg"
                    />

                    {/* THUMBNAILS */}
                    <div className="flex justify-center gap-3 mt-4">
                      {(selectedProduct.images?.length > 0 ? selectedProduct.images : [selectedProduct.image]).filter(Boolean).slice(0, 4).map((img, index) => (
                        <img
                          key={index}
                          src={resolveProductImage(img)}
                          onClick={() => setActiveImage(img)}
                          className={`w-16 h-16 object-cover rounded-lg cursor-pointer border
                    ${(activeImage || selectedProduct.images?.[0] || selectedProduct.image) === img
                              ? "border-[#162A78]"
                              : "border-gray-300"
                            }`}
                        />
                      ))}
                    </div>

                  </div>

                  {/* RIGHT DETAILS */}
                  <div className="p-6 space-y-3">

                    <h2 className="text-xl font-semibold">
                      {selectedProduct.name}
                    </h2>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase ${
                          selectedProduct.is_active
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-gray-200 text-gray-800 border border-gray-300"
                        }`}
                      >
                        {selectedProduct.is_active ? "Status: Active" : "Status: Inactive"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {selectedProduct.is_active ? "Visible in customer store" : "Hidden from customer store"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      Brand: {selectedProduct.brand}
                    </p>

                    <div className="text-xs text-gray-500 space-y-1">

                      <div>
                        <span className="font-semibold">Category:</span>{" "}
                        {selectedProduct.category}
                      </div>

                      {selectedProduct.subCategory && (
                        <div>
                          <span className="font-semibold">Sub-Category:</span>{" "}
                          {selectedProduct.subCategory}
                        </div>
                      )}

                    </div>

                    <div className="text-lg font-bold text-[#162A78]">
                      ₹ {formatPrice(selectedProduct.price)}
                    </div>

                    <div className="text-sm">
                      Stock:
                      <span className={`ml-1 font-semibold ${selectedProduct.stock > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                        {selectedProduct.stock}
                      </span>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="text-sm text-gray-600 max-h-32 overflow-y-auto border rounded-lg p-2">
                      {selectedProduct.description}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">

                      <button
                        onClick={() => {
                          setEditingId(selectedProduct._id || selectedProduct.id);
                          setOpenViewModal(false);
                          setOpenModal(true);
                        }}
                        className="flex-1 h-10 rounded-lg bg-[#162A78] text-white hover:opacity-90 font-medium text-sm"
                      >
                        Edit Product
                      </button>

                      {selectedProduct.is_active ? (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(selectedProduct)}
                          className="flex-1 h-10 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium text-sm transition-colors"
                        >
                          Deactivate Product
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(selectedProduct)}
                          className="flex-1 h-10 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-sm transition-colors"
                        >
                          Activate Product
                        </button>
                      )}

                      <button
                        onClick={() => setOpenViewModal(false)}
                        className="h-10 px-4 rounded-lg border font-medium text-sm hover:bg-gray-50"
                      >
                        Close
                      </button>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGINATION ================= */}
          {!loading && products.length > 0 && (
            <div className="flex items-center justify-center sm:justify-end gap-3 p-3 text-xs sm:text-sm">
              {/* PREVIOUS */}
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="
          h-8 w-8
          flex items-center justify-center
          rounded-full border
          text-gray-600
          hover:bg-[#162A78] hover:text-white
          transition
          disabled:opacity-40 disabled:cursor-not-allowed
        "
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* PAGE INFO */}
              <span className="text-gray-700 whitespace-nowrap">
                Page <b>{page}</b> of <b>{totalPages}</b>
              </span>

              {/* NEXT */}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="
          h-8 w-8
          flex items-center justify-center
          rounded-full border
          text-gray-600
          hover:bg-[#162A78] hover:text-white
          transition
          disabled:opacity-40 disabled:cursor-not-allowed
        "
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ================= EDIT DRAWER ================= */}
      {openModal && (
        <>
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => {
              setOpenModal(false);
              setEditingId(null);
            }}
          />

          {/* RIGHT DRAWER */}
          <div
            className="
              fixed top-0 right-2 h-full
              w-full sm:w-[420px] md:w-[680px] lg:w-[980px]
              bg-white z-50 shadow-2xl
              rounded-l-2xl
            "
          >
            <ProductCreate
              productId={editingId}
              onClose={() => {
                setOpenModal(false);
                setEditingId(null);
              }}
              onSuccess={() => {
                setOpenModal(false);
                setEditingId(null);
                fetchProducts();
              }}
            />

          </div>
        </>
      )}

      {/* ================= BULK UPLOAD MODAL ================= */}
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onUpload={handleBulkUpload}
      />
    </>
  );
}

function Input({ label, value, onChange, select, options = [] }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>

      {select ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full border rounded px-4 py-2"
        >
          <option value="">Select</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={onChange}
          className="w-full border rounded px-4 py-2"
        />
      )}
    </div>
  );
}
