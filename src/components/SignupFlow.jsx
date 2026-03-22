import { useEffect, useRef, useState } from "react";
import heroArt from "../assets/images/image.png";
import logo from "../assets/images/RiggleLogo.png";
import helpIcon from "../assets/images/streamline_help-chat-2-solid.png";
import chatIcon from "../assets/images/Vector (1).png";
import bookIcon from "../assets/images/Vector (2).png";
import bugIcon from "../assets/images/Vector (3).png";
import sendIcon from "../assets/images/send-icon.svg";
import attachmentIcon from "../assets/images/attachment-icon.svg";
import LoginScreen from "./LoginScreen";
import BrandSetup from "./BrandSetup";
import SupplyChainStep from "./SupplyChainStep";
import DesignationStep from "./DesignationStep";
import FinalizeOnboardingStep from "./FinalizeOnboardingStep";
import styles from "./SignupFlow.module.css";

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

function SignupFlow() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isBrandSetupOpen, setIsBrandSetupOpen] = useState(false);
  const [isSupplyChainOpen, setIsSupplyChainOpen] = useState(false);
  const [isDesignationOpen, setIsDesignationOpen] = useState(false);
  const [isFinalizeOpen, setIsFinalizeOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isChatViewOpen, setIsChatViewOpen] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({
    name: "",
    businessName: "",
    gstNumber: "",
  });
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [chatSessionStatus, setChatSessionStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(CHAT_DURATION_SECONDS);
  const chatBodyRef = useRef(null);
  const imageInputRef = useRef(null);

  const isOnboardingFormValid =
    onboardingForm.name.trim() !== "" &&
    onboardingForm.businessName.trim() !== "";

  const handleOnboardingChange = (event) => {
    const { name, value } = event.target;
    setOnboardingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnboardingNext = () => {
    if (!isOnboardingFormValid) {
      return;
    }

    setIsBrandSetupOpen(true);
  };

  const handleBrandSetupNext = (brandData) => {
    console.log("Brand setup completed", {
      ...onboardingForm,
      ...brandData,
    });
    setIsBrandSetupOpen(false);
    setIsSupplyChainOpen(true);
  };

  const handleSupplyChainNext = (supplyData) => {
    console.log("Supply chain setup completed", supplyData);
    setIsSupplyChainOpen(false);
    setIsDesignationOpen(true);
  };

  const handleDesignationNext = () => {
    setIsDesignationOpen(false);
    setIsFinalizeOpen(true);
  };

  const handleRequestDemo = () => {
    setIsFinalizeOpen(false);
    setIsDesignationOpen(false);
    setIsSupplyChainOpen(false);
    setIsBrandSetupOpen(false);
    setIsOnboardingOpen(false);
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsOnboardingOpen(true);
  };

  const handleFinalizeBack = () => {
    setIsFinalizeOpen(false);
    setIsDesignationOpen(true);
  };

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
    if (!trimmed) {
      return;
    }

    if (chatSessionStatus === "expired") {
      setChatMessages(INITIAL_CHAT_MESSAGES);
      setChatSessionStatus("idle");
      setTimeLeft(CHAT_DURATION_SECONDS);
    }

    if (chatSessionStatus === "idle") {
      setChatSessionStatus("active");
      setTimeLeft(CHAT_DURATION_SECONDS);
    }

    const randomResponse =
      SUPPORT_RESPONSES[Math.floor(Math.random() * SUPPORT_RESPONSES.length)];
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: trimmed },
      {
        id: Date.now() + 1,
        role: "support",
        text: randomResponse,
      },
    ]);
    setChatInput("");
  };

  useEffect(() => {
    if (chatSessionStatus !== "active") {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setChatSessionStatus("expired");
          setChatMessages((existing) => {
            const alreadyHasTimeoutMessage = existing.some(
              (msg) =>
                msg.role === "support" &&
                msg.text.includes("currently unavailable"),
            );

            if (alreadyHasTimeoutMessage) {
              return existing;
            }

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

    return () => clearInterval(intervalId);
  }, [chatSessionStatus]);

  useEffect(() => {
    if (chatSessionStatus !== "expired") {
      return;
    }

    const timeoutId = setTimeout(() => {
      setChatSessionStatus("idle");
      setTimeLeft(CHAT_DURATION_SECONDS);
      setChatMessages(INITIAL_CHAT_MESSAGES);
      setChatInput("");
    }, CHAT_RESET_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [chatSessionStatus]);

  useEffect(() => {
    if (!isChatViewOpen || !chatBodyRef.current) {
      return;
    }

    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatMessages, isChatViewOpen, chatSessionStatus]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(1, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  if (isLoginOpen) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (isFinalizeOpen) {
    return <FinalizeOnboardingStep onBack={handleFinalizeBack} />;
  }

  if (isDesignationOpen) {
    return (
      <DesignationStep
        onNext={handleDesignationNext}
        onBack={() => {
          setIsDesignationOpen(false);
          setIsSupplyChainOpen(true);
        }}
      />
    );
  }

  if (isSupplyChainOpen) {
    return (
      <SupplyChainStep
        onBack={() => setIsSupplyChainOpen(false)}
        onNext={handleSupplyChainNext}
      />
    );
  }

  if (isBrandSetupOpen) {
    return (
      <BrandSetup
        onBack={() => setIsBrandSetupOpen(false)}
        onNext={handleBrandSetupNext}
      />
    );
  }

  return (
    <div className={styles.shell}>
      {!isOnboardingOpen ? (
        <>
          <header className={styles.header}>
            <img src={logo} alt="Riggle" className={styles.brandLogo} />
          </header>

          <main className={styles.hero}>
            <section className={styles.heroCopy}>
              <h1 className={styles.heroTitle}>
                <span className={styles.heroLead}>
                  Launch your supply chain into the future
                </span>
                <span className={styles.heroHighlight}>
                  with powerful easy-to-use tools.
                </span>
              </h1>

              <p className={styles.description}>
                Welcome to our suite of cutting-edge apps, engineered to elevate
                and revolutionize every part of your distribution journey.
              </p>

              <button
                className={styles.cta}
                type="button"
                onClick={handleRequestDemo}>
                Request a Demo
              </button>
              <p className={styles.gst}>(Inclusive of GST)</p>
            </section>

            <section
              className={styles.heroVisual}
              aria-label="Rocket illustration">
              <img
                src={heroArt}
                alt="Rocket launch illustration"
                className={styles.heroImage}
              />
            </section>
          </main>
        </>
      ) : (
        <main className={styles.onboardingFrame}>
          <header className={styles.header}>
            <img src={logo} alt="Riggle" className={styles.brandLogo} />
          </header>

          <section className={styles.onboardingWrap}>
            <section
              className={styles.onboardingCard}
              aria-label="Business details form">
              <h2 className={styles.formTitle}>
                Welcome to
                <img src={logo} alt="Riggle" className={styles.formTitleLogo} />
              </h2>

              <form className={styles.formGrid}>
                <label htmlFor="name" className={styles.fieldLabel}>
                  What do we call you?<span className={styles.required}>*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={onboardingForm.name}
                  onChange={handleOnboardingChange}
                  className={styles.fieldInput}
                  placeholder="Your name"
                />

                <label htmlFor="businessName" className={styles.fieldLabel}>
                  What is your business name?
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>
                  (kindly enter your business name exactly as it appears on the
                  GST certificate)
                </p>
                <input
                  id="businessName"
                  name="businessName"
                  value={onboardingForm.businessName}
                  onChange={handleOnboardingChange}
                  className={styles.fieldInput}
                  placeholder="Business name"
                />

                <label htmlFor="gstNumber" className={styles.fieldLabel}>
                  What is your GST number?
                </label>
                <input
                  id="gstNumber"
                  name="gstNumber"
                  value={onboardingForm.gstNumber}
                  onChange={handleOnboardingChange}
                  className={styles.fieldInput}
                  placeholder="GST number"
                />
              </form>
            </section>

            <div className={styles.sideActions}>
              <div className={styles.helpMenuWrapper}>
                <button
                  className={styles.sideCircle}
                  type="button"
                  aria-label="Need help"
                  onClick={handleHelpToggle}>
                  {isHelpMenuOpen ? (
                    <span
                      className={styles.actionIconOpen}
                      aria-hidden="true"
                    />
                  ) : (
                    <img
                      src={helpIcon}
                      alt=""
                      aria-hidden="true"
                      className={styles.actionIconHelp}
                    />
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
                        <span
                          className={styles.chatAlertIcon}
                          aria-hidden="true">
                          !
                        </span>
                      )}
                    </div>

                    {isChatViewOpen ? (
                      <>
                        <div className={styles.chatBody} ref={chatBodyRef}>
                          {chatMessages.map((message) => (
                            <div
                              key={message.id}
                              className={
                                message.role === "support"
                                  ? styles.chatBubbleSupport
                                  : styles.chatBubbleUser
                              }>
                              {message.text}
                            </div>
                          ))}
                        </div>
                        <div className={styles.chatComposer}>
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSendMessage();
                              }
                            }}
                            placeholder="Type here"
                            className={styles.chatInput}
                          />
                          <button
                            type="button"
                            className={styles.chatImageButton}
                            onClick={() => imageInputRef.current?.click()}
                            aria-label="Attach image">
                            <img src={attachmentIcon} alt="Attach image" />
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
                            <img src={sendIcon} alt="Send message" />
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
              <button
                className={styles.sideCircle}
                type="button"
                aria-label="Continue to brand setup"
                onClick={handleOnboardingNext}
                disabled={!isOnboardingFormValid}>
                <span className={styles.actionIconArrow} aria-hidden="true">
                  &rarr;
                </span>
              </button>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default SignupFlow;
