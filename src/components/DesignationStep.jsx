import { useEffect, useMemo, useRef, useState } from "react";
import PageLayout from "./PageLayout";
import styles from "./DesignationStep.module.css";

const PYRAMID_CENTER_X = 130;
const PYRAMID_TOP_Y = 8;
const BASE_HEIGHT = 162;
const BASE_HALF_WIDTH = 110;
const SEGMENT_MIN_HEIGHT = 30;
const MAX_DESIGNATIONS = 5;
const MAX_LABEL_CHARS = 8;

function DesignationStep({ onBack, onNext }) {
  const [designations, setDesignations] = useState(["ASM", "M", "SO"]);
  const [draftDesignation, setDraftDesignation] = useState("");
  const [isInputOpen, setIsInputOpen] = useState(false);
  const inputRef = useRef(null);
  const hasReachedMax = designations.length >= MAX_DESIGNATIONS;

  useEffect(() => {
    if (isInputOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputOpen]);

  const { triangle, viewBox, separators, labels, labelFontSize } =
    useMemo(() => {
      const total = designations.length;
      const height = Math.max(BASE_HEIGHT, total * SEGMENT_MIN_HEIGHT);
      const halfWidth = Math.max(
        BASE_HALF_WIDTH,
        Math.round(height * (BASE_HALF_WIDTH / BASE_HEIGHT)),
      );

      const nextTriangle = {
        topX: PYRAMID_CENTER_X,
        topY: PYRAMID_TOP_Y,
        leftX: PYRAMID_CENTER_X - halfWidth,
        rightX: PYRAMID_CENTER_X + halfWidth,
        baseY: PYRAMID_TOP_Y + height,
      };

      const nextViewBox = {
        minX: nextTriangle.leftX - 18,
        minY: 0,
        width: nextTriangle.rightX - nextTriangle.leftX + 36,
        height: nextTriangle.baseY + 12,
      };

      const nextSeparators = [];
      for (let i = 1; i < total; i += 1) {
        const t = i / total;
        const y = nextTriangle.topY + height * t;
        const left =
          nextTriangle.topX + (nextTriangle.leftX - nextTriangle.topX) * t;
        const right =
          nextTriangle.topX + (nextTriangle.rightX - nextTriangle.topX) * t;
        nextSeparators.push({ y, left, right });
      }

      const cuts = [
        nextTriangle.topY,
        ...nextSeparators.map((line) => line.y),
        nextTriangle.baseY,
      ];
      const nextLabels = designations.map((title, index) => ({
        title:
          title.length > MAX_LABEL_CHARS
            ? `${title.slice(0, MAX_LABEL_CHARS)}…`
            : title,
        y: (cuts[index] + cuts[index + 1]) / 2,
      }));

      const nextFontSize = Math.max(9, 14 - Math.max(0, total - 3) * 1.2);

      return {
        triangle: nextTriangle,
        viewBox: nextViewBox,
        separators: nextSeparators,
        labels: nextLabels,
        labelFontSize: nextFontSize,
      };
    }, [designations]);

  const handleAddDesignation = () => {
    if (hasReachedMax) {
      return;
    }

    if (!isInputOpen) {
      setIsInputOpen(true);
      return;
    }

    const value = draftDesignation.trim().toUpperCase();
    if (!value) {
      return;
    }

    setDesignations((prev) => [...prev, value]);
    setDraftDesignation("");
    setIsInputOpen(false);
  };

  return (
    <PageLayout
      onBack={onBack}
      onArrowClick={onNext}
      arrowAriaLabel="Continue to finalize onboarding">
      <section className={styles.stepCard}>
        <h2 className={styles.stepTitle}>Designation</h2>
        <p className={styles.stepSubTitle}>
          What title do your salespeople hold? Let us know
        </p>

        <div className={styles.pyramidArea}>
          <svg
            viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
            className={styles.pyramidSvg}
            aria-label="Designation pyramid">
            <path
              d={`M ${triangle.leftX} ${triangle.baseY} L ${triangle.topX} ${triangle.topY} L ${triangle.rightX} ${triangle.baseY} Z`}
              className={styles.pyramidBorder}
            />

            {separators.map((line) => (
              <line
                key={`sep-${line.y}`}
                x1={line.left}
                y1={line.y}
                x2={line.right}
                y2={line.y}
                className={styles.pyramidBorder}
              />
            ))}

            {labels.map((label) => (
              <text
                key={`${label.title}-${label.y}`}
                x={triangle.topX}
                y={label.y}
                className={styles.pyramidText}
                style={{ fontSize: `${labelFontSize}px` }}>
                {label.title}
              </text>
            ))}
          </svg>
        </div>

        <div className={styles.addRow}>
          {isInputOpen && !hasReachedMax ? (
            <input
              ref={inputRef}
              type="text"
              maxLength={MAX_LABEL_CHARS + 2}
              value={draftDesignation}
              onChange={(e) => setDraftDesignation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddDesignation();
                }
                if (e.key === "Escape") {
                  setDraftDesignation("");
                  setIsInputOpen(false);
                }
              }}
              placeholder="Enter designation"
              className={styles.addInput}
            />
          ) : null}
          <button
            type="button"
            className={styles.addButton}
            disabled={hasReachedMax}
            onClick={handleAddDesignation}>
            + ADD
          </button>
        </div>
      </section>
    </PageLayout>
  );
}

export default DesignationStep;
