import { useMemo, useState } from "react";
import cpNodeIcon from "../assets/images/Group.png";
import manufacturerIcon from "../assets/images/Manufacturer.png";
import retailerIcon from "../assets/images/Reatiler.png";
import PageLayout from "./PageLayout";
import styles from "./SupplyChainStep.module.css";

const CHANNEL_OPTIONS = ["1", "2", "3", "4"];

function SupplyChainStep({ onBack, onNext }) {
  const [selectedPartnerCount, setSelectedPartnerCount] = useState(0);

  const cpNodes = useMemo(() => {
    const total = Math.max(0, Math.min(4, Number(selectedPartnerCount) || 0));
    return Array.from({ length: total }, (_, index) => `CP${index + 1}`);
  }, [selectedPartnerCount]);

  const handleContinue = () => {
    if (selectedPartnerCount <= 0) {
      return;
    }

    onNext({ channelPartnerCount: selectedPartnerCount });
  };

  return (
    <PageLayout
      onBack={onBack}
      onArrowClick={handleContinue}
      isArrowDisabled={selectedPartnerCount <= 0}
      arrowAriaLabel="Continue to designation step">
      <section className={styles.stepCard}>
        <h2 className={styles.stepTitle}>
          Replicate your brand's supply chain
        </h2>

        <div className={styles.fieldBlock}>
          <label htmlFor="channelCount" className={styles.fieldLabel}>
            How many channel partners do you currently have?
          </label>
          <select
            id="channelCount"
            value={
              selectedPartnerCount === 0 ? "" : String(selectedPartnerCount)
            }
            onChange={(e) => {
              const next = Number.parseInt(e.target.value, 10);
              setSelectedPartnerCount(Number.isNaN(next) ? 0 : next);
            }}
            className={styles.fieldSelect}>
            <option value="" disabled>
              Select
            </option>
            {CHANNEL_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.chainRow}>
          <div className={styles.endNode}>
            <img
              src={manufacturerIcon}
              alt="Manufacturer"
              className={styles.endIconImage}
            />
            <span className={styles.endLabel}>Manufacturer</span>
          </div>

          <div className={styles.chainMiddle}>
            {cpNodes.length ? (
              cpNodes.map((cp) => (
                <div key={cp} className={styles.cpWrap}>
                  <img
                    src={cpNodeIcon}
                    alt=""
                    aria-hidden="true"
                    className={styles.cpNodeIcon}
                  />
                  <span className={styles.cpBox}>{cp}</span>
                </div>
              ))
            ) : (
              <span className={styles.emptyGuide} aria-hidden="true" />
            )}
          </div>

          <div className={styles.endNode}>
            <img
              src={retailerIcon}
              alt="Retailer"
              className={styles.endIconImage}
            />
            <span className={styles.endLabel}>Retailer</span>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default SupplyChainStep;
