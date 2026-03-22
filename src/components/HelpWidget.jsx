import { useRef, useState, useEffect } from "react";
import logo from "../assets/images/RiggleLogo.png";
import helpIcon from "../assets/images/streamline_help-chat-2-solid.png";
import chatIcon from "../assets/images/Vector (1).png";
import bookIcon from "../assets/images/Vector (2).png";
import bugIcon from "../assets/images/Vector (3).png";
import sendIcon from "../assets/images/send-icon.svg";
import attachmentIcon from "../assets/images/attachment-icon.svg";
import styles from "./HelpWidget.module.css";

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
const HELP_MENU_ITEMS = [
  { id: 1, label: "Chat with us", icon: chatIcon },
  { id: 2, label: "Book a training", icon: bookIcon },
  { id: 3, label: "Report a bug", icon: bugIcon },
];

/**
 * HelpWidget
 *
 * Reusable help menu with chat support, training booking, and bug reporting.
 *
 * Props:
 *  - isHidden (bool): Hide the help button entirely (e.g., during verification success)
 */
function HelpWidget({ isHidden = false }) {
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isChatViewOpen, setIsChatViewOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [chatSessionStatus, setChatSessionStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(CHAT_DURATION_SECONDS);
  const chatBodyRef = useRef(null);
  const imageInputRef = useRef(null);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(1, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

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

    return () => {
      clearInterval(id);
    };
  }, [chatSessionStatus]);

  useEffect(() => {
    if (chatSessionStatus !== "expired") {
      return;
    }

    const id = setTimeout(() => {
      setChatSessionStatus("idle");
      setTimeLeft(CHAT_DURATION_SECONDS);
      setChatMessages(INITIAL_CHAT_MESSAGES);
      setChatInput("");
    }, CHAT_RESET_DELAY_MS);

    return () => {
      clearTimeout(id);
    };
  }, [chatSessionStatus]);

  useEffect(() => {
    if (!isChatViewOpen || !chatBodyRef.current) {
      return;
    }

    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatMessages, isChatViewOpen]);

  if (isHidden) {
    return null;
  }

  return (
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
              <div className={styles.helpMenu}>
                {HELP_MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.helpMenuItem}
                    onClick={() => {
                      if (item.id === 1) {
                        setIsChatViewOpen(true);
                      }
                    }}>
                    <img src={item.icon} alt="" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HelpWidget;
