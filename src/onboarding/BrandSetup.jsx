import { useRef, useState } from "react";
import cameraIcon from "../assets/images/camera-icon.svg";
import PageLayout from "./PageLayout";
import styles from "./BrandSetup.module.css";

const LOCAL_CITIES = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Indore",
  "Kolkata",
  "Chandigarh",
];

function BrandSetup({ onBack, onNext }) {
  const [formData, setFormData] = useState({
    brandName: "",
    brandLogo: null,
    targetAudience: "",
  });
  const logoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoPick = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      brandLogo: selectedFile,
    }));
  };

  const isFormValid =
    formData.brandName.trim() !== "" && formData.targetAudience.trim() !== "";

  const handleArrowNext = () => {
    if (!isFormValid) {
      return;
    }

    onNext(formData);
  };

  return (
    <PageLayout
      onBack={onBack}
      onArrowClick={handleArrowNext}
      isArrowDisabled={!isFormValid}
      arrowAriaLabel="Go to supply chain step">
      <section className={styles.brandSetupWrap}>
        <section className={styles.brandSetupCard}>
          <h2 className={styles.cardTitle}>Let's Set Up Your Brand</h2>
          <p className={styles.cardDescription}>
            Share your brand details with us
          </p>

          <div className={styles.formContainer}>
            <div className={styles.fieldGroup}>
              <label htmlFor="brandName" className={styles.fieldLabel}>
                What is your brand name?{" "}
                <span className={styles.required}>*</span>
              </label>
              <input
                id="brandName"
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Enter your brand name"
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Your brand deserves to have uploaded your logo here!
              </label>
              <div className={styles.logoUploadRow}>
                <button
                  type="button"
                  className={styles.logoPickerIconButton}
                  onClick={() => logoInputRef.current?.click()}
                  aria-label="Pick logo image">
                  <img src={cameraIcon} alt="Pick image" />
                </button>
                <span className={styles.logoUploadDivider} aria-hidden="true" />
                <button
                  type="button"
                  className={styles.logoUploadButton}
                  onClick={() => logoInputRef.current?.click()}>
                  Upload
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoPick}
                  className={styles.hiddenFileInput}
                />
              </div>
              <p className={styles.logoFileName}>
                {formData.brandLogo
                  ? formData.brandLogo.name
                  : "No image selected"}
              </p>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="targetAudience" className={styles.fieldLabel}>
                Which ones do you operate in?{" "}
                <span className={styles.required}>*</span>
              </label>
              <select
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className={styles.fieldSelect}>
                <option value="" disabled>
                  Select city
                </option>
                {LOCAL_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <p className={styles.helpText}>
          <span className={styles.helpLabel}>Managing multiple brands?</span>
          <span className={styles.helpDescription}>
            Don't worry, we can add you with one and we can handle add other.
          </span>
        </p>
      </section>
    </PageLayout>
  );
}

export default BrandSetup;
