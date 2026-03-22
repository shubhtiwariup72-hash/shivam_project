import { useRef, useState, useEffect } from "react";
import logo from "../assets/images/RiggleLogo.png";
import helpIcon from "../assets/images/streamline_help-chat-2-solid.png";
import chatIcon from "../assets/images/Vector (1).png";
import bookIcon from "../assets/images/Vector (2).png";
import bugIcon from "../assets/images/Vector (3).png";
import sendIcon from "../assets/images/send-icon.svg";
import attachmentIcon from "../assets/images/attachment-icon.svg";
import styles from "./LoginScreen.module.css";

const CHAT_DURATION_SECONDS = 180;
const CHAT_RESET_DELAY_MS = 3500;
const INITIAL_CHAT_MESSAGES = [
  { id: 1, role: "support", text: "Hello, describe your issue." },
];
const SUPPORT_RESPONSES = [
  "Thank you for reaching out! Our team will assist you shortly.",
  "Got it! We're looking into your request. Thanks for your patience!",
  "Thanks for getting in touch. Our support team will be with you soon.",
  "We appreciate you contacting us. We'll get back to you right away!",
  "Your message has been received. Our team is here to help!",
  "Thanks for reaching out! We're on it.",
  "Message received! We'll respond as soon as possible.",
  "Thanks for your feedback! We'll look into this for you.",
];

/**
 * LoginScreen
 *
 * Props:
 *  - onLoginSuccess(): called after OTP verified → open onboarding
 *  - greeting: optional name to show, e.g. "Karan" (default: "there")
 */
function LoginScreen({ onLoginSuccess, greeting = "there" }) {
  const [otpSent, setOtpSent] = useState(false);
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);

  // Help / chat state
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isChatViewOpen, setIsChatViewOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [chatSessionStatus, setChatSessionStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(CHAT_DURATION_SECONDS);

  const chatBodyRef = useRef(null);
  const imageInputRef = useRef(null);
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const minutes = String(Math.floor(timeLeft / 60)).padStart(1, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  /* ─── Chat timer ─── */
  useEffect(() => {
    if (chatSessionStatus !== "active") return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setChatSessionStatus("expired");
          setChatMessages((existing) => {
            if (existing.some((m) => m.text.includes("currently unavailable")))
              return existing;
            return [
              ...existing,
              {
                id: Date.now() + 2,
                role: "support",
                text: "Our team is currently unavailable. We will respond during our working hours: 10 AM to 6 PM.",
              },
            ];
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [chatSessionStatus]);

  useEffect(() => {
    if (chatSessionStatus !== "expired") return;
    const id = setTimeout(() => {
      setChatSessionStatus("idle");
      setTimeLeft(CHAT_DURATION_SECONDS);
      setChatMessages(INITIAL_CHAT_MESSAGES);
      setChatInput("");
    }, CHAT_RESET_DELAY_MS);
    return () => clearTimeout(id);
  }, [chatSessionStatus]);

  useEffect(() => {
    if (!isChatViewOpen || !chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatMessages, isChatViewOpen]);

  /* ─── Resend countdown ─── */
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  /* ─── Handlers ─── */
  const handleHelpToggle = () => {
    setIsHelpMenuOpen((prev) => {
      const next = !prev;
      if (!next) {
        setIsChatViewOpen(false);
        setChatSessionStatus("idle");
        setTimeLeft(CHAT_DURATION_SECONDS);
        setChatMessages(INITIAL_CHAT_MESSAGES);
        setChatInput("");
      }
      return next;
    });
  };

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    if (chatSessionStatus === "expired") {
      setChatMessages(INITIAL_CHAT_MESSAGES);
      setChatSessionStatus("idle");
      setTimeLeft(CHAT_DURATION_SECONDS);
    }
    if (chatSessionStatus === "idle") {
      setChatSessionStatus("active");
      setTimeLeft(CHAT_DURATION_SECONDS);
    }
    const resp =
      SUPPORT_RESPONSES[Math.floor(Math.random() * SUPPORT_RESPONSES.length)];
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: trimmed },
      { id: Date.now() + 1, role: "support", text: resp },
    ]);
    setChatInput("");
  };

  const handleSendOtp = () => {
    if (phone.trim().length < 10) return;
    // In production: fire actual OTP API here
    setOtpSent(true);
    setResendTimer(90);
    setTimeout(() => otpRefs[0].current?.focus(), 50);
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (otp.join("").length !== 6) return;
    // In production: verify OTP via API
    setIsVerificationSuccess(true);
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setResendTimer(90);
    otpRefs[0].current?.focus();
  };

  const isPhoneValid = phone.trim().replace(/\D/g, "").length === 10;
  const isOtpComplete = otp.join("").length === 6;

  return (
    <div className={styles.pageFrame}>
      {/* Header */}
      <header className={styles.header}>
        <img src={logo} alt="Riggle" className={styles.brandLogo} />
      </header>

      {/* Centered card */}
      <div className={styles.pageContent}>
        <div className={styles.card}>
          {isVerificationSuccess ? (
            <div className={styles.successView}>
              <div className={styles.successIcon} aria-hidden="true">
                <span>✓</span>
              </div>
              <p className={styles.successTitle}>
                Mobile Number has been
                <br />
                verified successfully!
              </p>
              <p className={styles.successSubtitle}>
                Please proceed to choose your preferred plan
              </p>
              <button
                className={styles.successProceedButton}
                type="button"
                onClick={onLoginSuccess}>
                Proceed
              </button>
            </div>
          ) : (
            <>
              <h2 className={styles.greeting}>Hello {greeting},</h2>
              <p className={styles.subtitle}>
                Enter your Mobile Number to get started
              </p>

              {/* Phone row — read-only once OTP sent */}
              <div className={styles.phoneRow}>
                <div className={styles.countryPrefix}>
                  <span className={styles.flagEmoji}>🇮🇳</span>
                  <span className={styles.prefixCode}>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  className={styles.phoneInput}
                  placeholder="Enter mobile number"
                  value={phone}
                  readOnly={otpSent}
                  onChange={(e) => {
                    if (!otpSent)
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !otpSent) handleSendOtp();
                  }}
                  autoFocus={!otpSent}
                />
              </div>

              {!otpSent ? (
                <button
                  className={styles.otpButton}
                  type="button"
                  disabled={!isPhoneValid}
                  onClick={handleSendOtp}>
                  Send OTP
                </button>
              ) : (
                <>
                  <p className={styles.otpLabel}>
                    Enter 6-digit confirmation code
                  </p>
                  <div className={styles.otpInputRow}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={otpRefs[i]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className={styles.otpDigit}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      />
                    ))}
                  </div>

                  <div className={styles.resendRow}>
                    <span>
                      Didn&apos;t receive?{" "}
                      <button
                        className={styles.resendBtn}
                        type="button"
                        disabled={resendTimer > 0}
                        onClick={handleResend}>
                        Resend it
                      </button>
                    </span>
                    {resendTimer > 0 && (
                      <span className={styles.resendTimer}>:{resendTimer}</span>
                    )}
                  </div>

                  <button
                    className={styles.verifyButton}
                    type="button"
                    disabled={!isOtpComplete}
                    onClick={handleVerifyOtp}>
                    Verify
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Side help button only — no arrow on login screen */}
      {!isVerificationSuccess && (
        <div className={styles.sideActions}>
          <div className={styles.helpMenuWrapper}>
            <button
              className={styles.sideCircle}
              type="button"
              aria-label="Need help"
              onClick={handleHelpToggle}>
              {isHelpMenuOpen ? (
                <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
                  ✕
                </span>
              ) : (
                <img src={helpIcon} alt="" aria-hidden="true" />
              )}
            </button>

            {isHelpMenuOpen && (
              <div className={styles.helpDropdown}>
                <div className={styles.helpHeader}>
                  <img
                    src={logo}
                    alt="Riggle"
                    className={styles.helpHeaderLogo}
                  />
                  <span>Support</span>
                  {isChatViewOpen && chatSessionStatus === "active" && (
                    <span
                      className={styles.chatTimer}
                      aria-label="Chat session timer">
                      <span
                        className={styles.chatTimerIcon}
                        aria-hidden="true"
                      />
                      {minutes}:{seconds}
                    </span>
                  )}
                  {isChatViewOpen && chatSessionStatus === "expired" && (
                    <span className={styles.chatAlertIcon} aria-hidden="true">
                      !
                    </span>
                  )}
                </div>

                {isChatViewOpen ? (
                  <>
                    <div className={styles.chatBody} ref={chatBodyRef}>
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={
                            msg.role === "support"
                              ? styles.chatBubbleSupport
                              : styles.chatBubbleUser
                          }>
                          {msg.text}
                        </div>
                      ))}
                    </div>
                    <div className={styles.chatComposer}>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendMessage();
                        }}
                        placeholder="Type here"
                        className={styles.chatInput}
                      />
                      <button
                        type="button"
                        className={styles.chatImageButton}
                        onClick={() => imageInputRef.current?.click()}
                        aria-label="Attach image">
                        <img src={attachmentIcon} alt="Attach" />
                      </button>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        className={styles.chatSendButton}
                        onClick={handleSendMessage}
                        aria-label="Send message">
                        <img src={sendIcon} alt="Send" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.helpItem}
                      type="button"
                      onClick={() => setIsChatViewOpen(true)}>
                      <img
                        src={chatIcon}
                        alt=""
                        className={styles.helpItemIcon}
                      />{" "}
                      Chat with us
                    </button>
                    <button className={styles.helpItem} type="button">
                      <img
                        src={bookIcon}
                        alt=""
                        className={styles.helpItemIcon}
                      />{" "}
                      Book a training
                    </button>
                    <button className={styles.helpItem} type="button">
                      <img
                        src={bugIcon}
                        alt=""
                        className={styles.helpItemIcon}
                      />{" "}
                      Report a bug
                    </button>
                  </>
                )}
                <div className={styles.dropdownArrow} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginScreen;
