import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/RiggleLogo.png";
import cameraIcon from "../assets/images/camera-icon.svg";
import styles from "./MainScreen.module.css";
import AddBrandScreen from "./AddBrandScreen";

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "brands", label: "Brands", icon: "🏷️" },
  { id: "beat", label: "Beat", icon: "📍" },
];

const INITIAL_BRANDS = [
  { id: 1, name: "Chilzz Beverage", color: "#E8652E" },
  { id: 2, name: "Cloud 9", color: "#1a1a2e" },
  { id: 3, name: "Fitgo", color: "#1a1a2e" },
  { id: 4, name: "Pepsico", color: "#E8652E" },
  { id: 5, name: "Rock IT", color: "#1a1a2e" },
  { id: 6, name: "Silvasa", color: "#E8652E" },
  { id: 7, name: "Top Brand Ghee", color: "#E8652E" },
  { id: 8, name: "Vigo Multimedia", color: "#E8652E" },
];

function MainScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("brands");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState(null);
  const [brandCity, setBrandCity] = useState("");
  const brandLogoRef = useRef(null);

  const filteredBrands = INITIAL_BRANDS.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
              setShowAddBrand(false);
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
                  onClick={() => setActiveTab(item.id)}>
                  <span className={styles.sidebarIcon}>{item.icon}</span>
                  <span className={styles.sidebarLabel}>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={styles.content}>
          {showProfile ? (
            <AddBrandScreen onBack={() => setShowProfile(false)} />
          ) : showAddBrand ? (
            <div className={styles.addBrandWrap}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setShowAddBrand(false)}>
                ← Back
              </button>
              <div className={styles.addBrandCard}>
                <h2 className={styles.addBrandTitle}>
                  Let's Set Up Your Brand
                </h2>
                <p className={styles.addBrandSubtitle}>
                  Share your brand details with us
                </p>

                <div className={styles.addBrandForm}>
                  <div className={styles.addBrandField}>
                    <label className={styles.addBrandLabel}>
                      What is your brand name?{" "}
                      <span className={styles.addBrandRequired}>*</span>
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Enter your brand name"
                      className={styles.addBrandInput}
                    />
                  </div>

                  <div className={styles.addBrandField}>
                    <label className={styles.addBrandLabel}>
                      Your brand deserves to have uploaded your logo here!
                    </label>
                    <div className={styles.addBrandLogoRow}>
                      <button
                        type="button"
                        className={styles.addBrandCameraBtn}
                        onClick={() => brandLogoRef.current?.click()}>
                        <img src={cameraIcon} alt="Pick image" />
                      </button>
                      <span className={styles.addBrandLogoDivider} />
                      <button
                        type="button"
                        className={styles.addBrandUploadBtn}
                        onClick={() => brandLogoRef.current?.click()}>
                        Upload
                      </button>
                      <input
                        ref={brandLogoRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          setBrandLogo(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                    <p className={styles.addBrandFileName}>
                      {brandLogo ? brandLogo.name : "No image selected"}
                    </p>
                  </div>

                  <div className={styles.addBrandField}>
                    <label className={styles.addBrandLabel}>
                      Which ones do you operate in?{" "}
                      <span className={styles.addBrandRequired}>*</span>
                    </label>
                    <select
                      value={brandCity}
                      onChange={(e) => setBrandCity(e.target.value)}
                      className={styles.addBrandSelect}>
                      <option value="" disabled>
                        Select city
                      </option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Pune">Pune</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Lucknow">Lucknow</option>
                      <option value="Indore">Indore</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Chandigarh">Chandigarh</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.addBrandHelp}>
                <span className={styles.addBrandHelpLabel}>
                  Managing multiple brands?
                </span>
                <span className={styles.addBrandHelpDesc}>
                  Don't worry, we can add you with one and we can handle add
                  other.
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                  <span className={styles.searchIcon}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search brands"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                <div className={styles.toolbarRight}>
                  <button
                    type="button"
                    className={styles.addBrandBtn}
                    onClick={() => {
                      setShowAddBrand(true);
                      setShowProfile(false);
                    }}>
                    Add New Brand
                  </button>
                  <button
                    type="button"
                    className={styles.filterBtn}
                    aria-label="More options">
                    ☰
                  </button>
                </div>
              </div>

              {/* Brand Cards Grid */}
              <div className={styles.brandGrid}>
                {filteredBrands.map((brand) => (
                  <div key={brand.id} className={styles.brandCard}>
                    <div className={styles.brandCardTop}>
                      <div
                        className={styles.brandLogo}
                        style={{ backgroundColor: brand.color }}>
                        <img
                          src={logo}
                          alt={brand.name}
                          className={styles.brandLogoImg}
                        />
                      </div>
                      <span className={styles.brandName}>{brand.name}</span>
                      <button
                        type="button"
                        className={styles.editBtn}
                        aria-label={`Edit ${brand.name}`}>
                        ✏️
                      </button>
                    </div>
                    <div className={styles.brandCardBottom}>
                      <span
                        className={styles.brandLink}
                        onClick={() =>
                          navigate(`/dashboard/brand/${brand.id}/products`)
                        }
                        role="button"
                        tabIndex={0}>
                        <span className={styles.brandLinkIcon}>📦</span> Product
                      </span>
                      <span className={styles.brandLink}>
                        <span className={styles.brandLinkIcon}>📄</span> Rate
                      </span>
                      <span className={styles.brandLink}>
                        <span className={styles.brandLinkIcon}>🌐</span> Network
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default MainScreen;
