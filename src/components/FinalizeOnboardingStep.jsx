import { useRef, useState } from "react";
import PageLayout from "./PageLayout";
import styles from "./FinalizeOnboardingStep.module.css";

const UPLOAD_ROWS = [
  { id: "products", title: "Upload Products" },
  { id: "salesperson", title: "Upload Salesperson" },
  { id: "wholesaler", title: "Upload Wholesaler list" },
  { id: "distributor", title: "Upload Distributor list" },
];

function FinalizeOnboardingStep({ onBack }) {
  const fileRefs = useRef({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleFilePick = (rowId, event) => {
    const file = event.target.files?.[0] || null;
    setUploadedFiles((prev) => ({
      ...prev,
      [rowId]: file,
    }));
  };

  return (
    <PageLayout
      onBack={onBack}
      arrowAriaLabel="Finish onboarding"
      noFrameBorder>
      <section className={styles.stepCard}>
        <h2 className={styles.stepTitle}>
          Let's finalize your onboarding and get started together!
        </h2>

        <div className={styles.uploadGrid}>
          {UPLOAD_ROWS.map((row) => (
            <div key={row.id} className={styles.uploadRow}>
              <div className={styles.leftCell}>
                <h3 className={styles.rowTitle}>{row.title}</h3>
                <button type="button" className={styles.downloadButton}>
                  ⭳ Download Format
                </button>
                {uploadedFiles[row.id] ? (
                  <p className={styles.fileName}>
                    {uploadedFiles[row.id].name}
                  </p>
                ) : null}
              </div>

              <div className={styles.rightCell}>
                <input
                  ref={(el) => {
                    fileRefs.current[row.id] = el;
                  }}
                  type="file"
                  className={styles.hiddenFileInput}
                  onChange={(event) => handleFilePick(row.id, event)}
                />
                {uploadedFiles[row.id] ? (
                  <span
                    className={styles.uploadedTick}
                    role="img"
                    aria-label={`${row.title} uploaded`}>
                    ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    className={styles.uploadButton}
                    onClick={() => fileRefs.current[row.id]?.click()}>
                    ⭱ Upload
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

export default FinalizeOnboardingStep;
