import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/images/RiggleLogo.png";
import styles from "./ProductScreen.module.css";
import AddBrandScreen from "./AddBrandScreen";

const BRAND_PRODUCTS = {
  1: [
    { id: 1, name: "Chilzz Booster 200Ml", mrp: 10 },
    { id: 2, name: "Chilzz Cola 200Ml", mrp: 10 },
    { id: 3, name: "Chilzz Jeera 200Ml", mrp: 10 },
    { id: 4, name: "Chilzz Lemon 200Ml", mrp: 10 },
    { id: 5, name: "Chilzz Orange 200Ml", mrp: 10 },
  ],
  2: [
    { id: 1, name: "Cloud 9 Energy 250Ml", mrp: 20 },
    { id: 2, name: "Cloud 9 Storm 500Ml", mrp: 35 },
  ],
  3: [
    { id: 1, name: "Fitgo Mango 200Ml", mrp: 15 },
    { id: 2, name: "Fitgo Apple 200Ml", mrp: 15 },
  ],
  4: [
    { id: 1, name: "Pepsi 250Ml", mrp: 20 },
    { id: 2, name: "Pepsi 500Ml", mrp: 35 },
    { id: 3, name: "Mountain Dew 250Ml", mrp: 20 },
  ],
  5: [{ id: 1, name: "Rock IT Cola 200Ml", mrp: 10 }],
  6: [
    { id: 1, name: "Silvasa Water 500Ml", mrp: 10 },
    { id: 2, name: "Silvasa Water 1L", mrp: 20 },
  ],
  7: [
    { id: 1, name: "Top Brand Ghee 500g", mrp: 250 },
    { id: 2, name: "Top Brand Ghee 1Kg", mrp: 480 },
  ],
  8: [{ id: 1, name: "Vigo Cable 5M", mrp: 120 }],
};

const BRAND_NAMES = {
  1: "Chilzz Beverage",
  2: "Cloud 9",
  3: "Fitgo",
  4: "Pepsico",
  5: "Rock IT",
  6: "Silvasa",
  7: "Top Brand Ghee",
  8: "Vigo Multimedia",
};

const MRP_OPTIONS = ["All", "5", "10", "15", "20", "35", "50"];
const BASE_UNIT_OPTIONS = ["All", "Ml", "L", "g", "Kg"];
const MOQ_OPTIONS = ["All", "1", "5", "10", "20"];

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "brands", label: "Brands", icon: "🏷️" },
  { id: "beat", label: "Beat", icon: "📍" },
];

function ProductScreen() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mrpFilter, setMrpFilter] = useState("All");
  const [baseUnitFilter, setBaseUnitFilter] = useState("All");
  const [baseQtyFilter, setBaseQtyFilter] = useState("");
  const [moqFilter, setMoqFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("brands");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [productForm, setProductForm] = useState({
    productName: "",
    mrp: "",
    baseUnit: "",
    baseQty: "",
    moq: "",
    hsnCode: "",
    gst: "",
  });
  const [productImage, setProductImage] = useState(null);
  const productImageRef = useRef(null);

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const brandName = BRAND_NAMES[brandId] || "Unknown Brand";
  const products = BRAND_PRODUCTS[brandId] || [];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesMrp = mrpFilter === "All" || p.mrp === Number(mrpFilter);
    return matchesSearch && matchesMrp;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setMrpFilter("All");
    setBaseUnitFilter("All");
    setBaseQtyFilter("");
    setMoqFilter("All");
  };

  return (
    <div className={styles.shell}>
      {/* Top Header */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <img src={logo} alt="Riggle" className={styles.topBarLogo} />
          <button
            type="button"
            className={styles.hamburgerBtn}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar">
            <span className={styles.hamburgerIcon}>☰</span>
          </button>
          <span className={styles.companyName}>70K Waterworks Pvt Ltd.</span>
        </div>
        <div className={styles.topBarRight}>
          <div
            className={styles.userAvatar}
            onClick={() => {
              setShowProfile(true);
              setShowAddProduct(false);
            }}
            role="button"
            tabIndex={0}>
            VR
          </div>
        </div>
      </header>

      <div className={styles.body}>
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className={styles.sidebar}>
            <nav className={styles.sidebarNav}>
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.sidebarItem} ${activeTab === item.id ? styles.sidebarItemActive : ""}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === "brands") navigate("/dashboard");
                  }}>
                  <span className={styles.sidebarIcon}>{item.icon}</span>
                  <span className={styles.sidebarLabel}>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <div className={styles.mainContent}>
          {showProfile ? (
            <div style={{ padding: "24px 32px" }}>
              <AddBrandScreen onBack={() => setShowProfile(false)} />
            </div>
          ) : showAddProduct ? (
            <div className={styles.addProductCard}>
              <div className={styles.addProductHeader}>
                <div>
                  <h2 className={styles.addProductTitle}>Add New Product</h2>
                  <button
                    type="button"
                    className={styles.addProductBackLink}
                    onClick={() => setShowAddProduct(false)}>
                    ← Back to Products
                  </button>
                </div>
              </div>

              {/* Product Image */}
              <div className={styles.productImageSection}>
                <p className={styles.productImageHint}>
                  (Upload product image)
                </p>
                <div
                  className={styles.productImagePreview}
                  onClick={() => productImageRef.current?.click()}
                  role="button"
                  tabIndex={0}>
                  {productImage ? (
                    <img
                      src={URL.createObjectURL(productImage)}
                      alt="Product"
                      className={styles.productImageImg}
                    />
                  ) : (
                    <span className={styles.productImagePlaceholder}>🖼️</span>
                  )}
                </div>
                <input
                  ref={productImageRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setProductImage(e.target.files?.[0] || null)}
                />
              </div>

              {/* Product Name & MRP */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    <span className={styles.formRequired}>*</span> Product Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={productForm.productName}
                    onChange={handleProductFormChange}
                    placeholder="Enter product name"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    <span className={styles.formRequired}>*</span> MRP (₹)
                  </label>
                  <input
                    type="text"
                    name="mrp"
                    value={productForm.mrp}
                    onChange={handleProductFormChange}
                    placeholder="Enter MRP"
                    className={styles.formInput}
                  />
                </div>
              </div>

              {/* Base Unit & Base Qty */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    <span className={styles.formRequired}>*</span> Base Unit
                  </label>
                  <select
                    name="baseUnit"
                    value={productForm.baseUnit}
                    onChange={handleProductFormChange}
                    className={styles.formSelect}>
                    <option value="">Select</option>
                    <option value="Ml">Ml</option>
                    <option value="L">L</option>
                    <option value="g">g</option>
                    <option value="Kg">Kg</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    <span className={styles.formRequired}>*</span> Base Quantity
                  </label>
                  <input
                    type="text"
                    name="baseQty"
                    value={productForm.baseQty}
                    onChange={handleProductFormChange}
                    placeholder="Enter quantity"
                    className={styles.formInput}
                  />
                </div>
              </div>

              {/* MOQ & HSN Code */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>MOQ</label>
                  <input
                    type="text"
                    name="moq"
                    value={productForm.moq}
                    onChange={handleProductFormChange}
                    placeholder="Min order qty"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>HSN Code</label>
                  <input
                    type="text"
                    name="hsnCode"
                    value={productForm.hsnCode}
                    onChange={handleProductFormChange}
                    placeholder="Enter HSN code"
                    className={styles.formInput}
                  />
                </div>
              </div>

              {/* GST */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>GST (%)</label>
                  <input
                    type="text"
                    name="gst"
                    value={productForm.gst}
                    onChange={handleProductFormChange}
                    placeholder="Enter GST %"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formField} />
              </div>

              <button type="button" className={styles.saveProductBtn}>
                Save Product
              </button>
            </div>
          ) : (
            <>
              {/* Brand Header */}
              <div className={styles.brandHeader}>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => navigate("/dashboard")}
                  aria-label="Go back">
                  ←
                </button>
                <div className={styles.brandLogoWrap}>
                  <img
                    src={logo}
                    alt={brandName}
                    className={styles.brandLogoImg}
                  />
                </div>
                <h2 className={styles.brandTitle}>{brandName}</h2>
                <div className={styles.brandHeaderRight}>
                  <button
                    type="button"
                    className={styles.addProductBtn}
                    onClick={() => {
                      setShowAddProduct(true);
                      setShowProfile(false);
                    }}>
                    Add New Product
                  </button>
                  <button
                    type="button"
                    className={styles.filterToggleBtn}
                    aria-label="More options">
                    ☰
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className={styles.filterBar}>
                <div className={styles.searchWrap}>
                  <span className={styles.searchIcon}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search e.g."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                <select
                  className={styles.filterSelect}
                  value={mrpFilter}
                  onChange={(e) => setMrpFilter(e.target.value)}>
                  <option value="All">MRP</option>
                  {MRP_OPTIONS.filter((o) => o !== "All").map((o) => (
                    <option key={o} value={o}>
                      ₹ {o}
                    </option>
                  ))}
                </select>
                <select
                  className={styles.filterSelect}
                  value={baseUnitFilter}
                  onChange={(e) => setBaseUnitFilter(e.target.value)}>
                  <option value="All">Base Unit</option>
                  {BASE_UNIT_OPTIONS.filter((o) => o !== "All").map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <select
                  className={styles.filterSelect}
                  value={baseQtyFilter}
                  onChange={(e) => setBaseQtyFilter(e.target.value)}>
                  <option value="">Base quantity</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                </select>
                <select
                  className={styles.filterSelect}
                  value={moqFilter}
                  onChange={(e) => setMoqFilter(e.target.value)}>
                  <option value="All">MOQ</option>
                  {MOQ_OPTIONS.filter((o) => o !== "All").map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>

              {/* Product Cards Grid */}
              <div className={styles.productGrid}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.productCardTop}>
                      <div className={styles.productLogo}>
                        <img
                          src={logo}
                          alt=""
                          className={styles.productLogoImg}
                        />
                      </div>
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>
                          {product.name}
                        </span>
                        <span className={styles.productMrp}>
                          MRP : ₹ {product.mrp}
                        </span>
                      </div>
                    </div>
                    <div className={styles.productCardBottom}>
                      <button
                        type="button"
                        className={styles.productEditBtn}
                        aria-label="Edit product">
                        ✏️
                      </button>
                      <span className={styles.productStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
