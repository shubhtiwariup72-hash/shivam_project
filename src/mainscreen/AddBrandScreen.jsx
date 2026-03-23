import { useRef, useState } from "react";
import logo from "../assets/images/RiggleLogo.png";
import styles from "./AddBrandScreen.module.css";

const BUSINESS_PROOF_OPTIONS = [
  "Choose",
  "Aadhaar",
  "Voter ID",
  "Passport",
  "Driving License",
];

function AddBrandScreen({ onBack }) {
  const logoInputRef = useRef(null);
  const gstDocRef = useRef(null);
  const panDocRef = useRef(null);
  const qrImageRef = useRef(null);

  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    businessName: "",
    gstNumber: "",
    email: "",
    businessProof: "Choose",
    panNumber: "",
    addressLine: "",
    building: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [businessLogo, setBusinessLogo] = useState(null);
  const [gstCertificate, setGstCertificate] = useState(null);
  const [panDocument, setPanDocument] = useState(null);
  const [qrImage, setQrImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0] || null;
    setBusinessLogo(file);
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Business Info</h2>
          <button type="button" className={styles.backLink} onClick={onBack}>
            ← Back to Brands
          </button>
        </div>
        <button
          type="button"
          className={styles.editBtn}
          onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* Logo Upload */}
      <div className={styles.logoSection}>
        <p className={styles.logoHint}>(Upload your business logo here)</p>
        <div
          className={styles.logoPreview}
          onClick={() => logoInputRef.current?.click()}
          role="button"
          tabIndex={0}>
          {businessLogo ? (
            <img
              src={URL.createObjectURL(businessLogo)}
              alt="Business logo"
              className={styles.logoImage}
            />
          ) : (
            <img src={logo} alt="Riggle" className={styles.logoImage} />
          )}
        </div>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleLogoUpload}
        />
      </div>

      {/* Business Name & GST */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <span className={styles.required}>*</span> Business name
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="70K Waterworks Pvt Ltd."
            className={styles.fieldInput}
            readOnly={!isEditing}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <span className={styles.required}>*</span> GST number
          </label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="27AABCZ2370A1ZN"
            className={styles.fieldInput}
            readOnly={!isEditing}
          />
        </div>
      </div>

      {/* Email */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>
          Enter Email(s) for sending Order Reports
        </label>
        <textarea
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="product@riggleapp.in"
          className={styles.fieldTextarea}
          readOnly={!isEditing}
        />
      </div>

      {/* Business Proof & GST Certificate */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Business Proof</label>
          <select
            name="businessProof"
            value={formData.businessProof}
            onChange={handleChange}
            className={styles.fieldSelect}
            disabled={!isEditing}>
            {BUSINESS_PROOF_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>GST Certificate</label>
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => gstDocRef.current?.click()}
            disabled={!isEditing}>
            ⭱ Upload Document
          </button>
          {gstCertificate && (
            <span className={styles.fileName}>{gstCertificate.name}</span>
          )}
          <input
            ref={gstDocRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setGstCertificate(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      {/* PAN Number & PAN Document */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>PAN Number</label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            placeholder="Enter PAN num..."
            className={styles.fieldInput}
            readOnly={!isEditing}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>PAN Document</label>
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => panDocRef.current?.click()}
            disabled={!isEditing}>
            ⭱ Upload Document
          </button>
          {panDocument && (
            <span className={styles.fileName}>{panDocument.name}</span>
          )}
          <input
            ref={panDocRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setPanDocument(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      {/* Payment QR */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Payment QR</label>
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => qrImageRef.current?.click()}
            disabled={!isEditing}>
            ⭱ Upload QR Image
          </button>
          <input
            ref={qrImageRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setQrImage(e.target.files?.[0] || null)}
          />
        </div>
        <div className={styles.fieldGroup}>
          {qrImage && (
            <img
              src={URL.createObjectURL(qrImage)}
              alt="Payment QR"
              className={styles.qrPreview}
            />
          )}
        </div>
      </div>

      {/* Address */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <span className={styles.required}>*</span> Address Line
          </label>
          <input
            type="text"
            name="addressLine"
            value={formData.addressLine}
            onChange={handleChange}
            placeholder="Prabhadevi"
            className={styles.fieldInput}
            readOnly={!isEditing}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <span className={styles.required}>*</span> Building/Suite
          </label>
          <input
            type="text"
            name="building"
            value={formData.building}
            onChange={handleChange}
            placeholder="LBS"
            className={styles.fieldInput}
            readOnly={!isEditing}
          />
        </div>
      </div>

      {/* City, State, Pincode */}
      <div className={styles.rowThree}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <span className={styles.required}>*</span> City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Mumbai"
            className={styles.fieldInput}
            readOnly={!isEditing}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <span className={styles.required}>*</span> State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Maharashtra"
            className={styles.fieldInput}
            readOnly={!isEditing}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <span className={styles.required}>*</span> Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="400025"
            className={styles.fieldInput}
            readOnly={!isEditing}
          />
        </div>
      </div>
    </div>
  );
}

export default AddBrandScreen;
