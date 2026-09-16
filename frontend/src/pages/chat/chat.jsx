import { useCallback, useEffect, useRef, useState } from "react";

import { askQuestion, buildKnowledgeBase, rebuildKnowledgeBase } from "../../services/api";
import Navbar from "../../components/navbar/navbar";
import "./chat.css";

// Helper to format basic markdown (bold text) safely without libraries
// Newlines are automatically handled by CSS white-space: pre-wrap on .message-text
function formatText(text) {
  if (!text) return null;
  return text.split(/(\*\*.*?\*\*)/g).map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);
  const textareaRef = useRef(null);

  const sendQuestion = useCallback(async (text) => {
    const userQuestion = text.trim();

    if (!userQuestion || loading) {
      return;
    }

    setMessages((oldMessages) => [
      ...oldMessages,
      { role: "user", text: userQuestion },
    ]);

    setQuestion("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
    }
    setLoading(true);

    try {
      const data = await askQuestion(userQuestion);
      setMessages((oldMessages) => [
        ...oldMessages,
        {
          role: "assistant",
          text: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      setMessages((oldMessages) => [
        ...oldMessages,
        {
          role: "assistant",
          text: error.message,
          sources: [],
        },
      ]);
    }

    setLoading(false);
  }, [loading]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleBuild() {
    setStatus("Preparing knowledge base...");

    try {
      const data = await buildKnowledgeBase();
      setStatus(data.message);
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleRebuild() {
    setStatus("Rebuilding knowledge base...");

    try {
      const data = await rebuildKnowledgeBase();
      setStatus(data.message);
    } catch (error) {
      setStatus(error.message);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendQuestion(question);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion(question);
    }
  };

  const handleInput = (e) => {
    setQuestion(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <>
      <Navbar />
      <main className="chat-page">
        <aside className="chat-sidebar">
          <p className="chat-side-label">Knowledge Base</p>
          <button onClick={handleBuild}>Use Saved Index</button>
          <button onClick={handleRebuild}>Refresh Index</button>
          <button onClick={() => setMessages([])}>Clear Conversation</button>
          {status && <p className="chat-status">{status}</p>}
        </aside>

        <section className="chat-panel">
        <header className="chat-top">
          <h1>Legal Query Workspace</h1>
          <p>Ask questions grounded in the indexed Indian legal knowledge base.</p>
        </header>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-chat-container">
              <div className="empty-chat">
                <h3>Welcome to Legal Lens</h3>
                <p>Ask about a legal provision, citizen right, process, or document-backed issue. All responses are derived strictly from our indexed legal knowledge base.</p>
              </div>
              <div className="quick-prompts">
                <button onClick={() => sendQuestion("What are the grounds for divorce under the Hindu Marriage Act?")}>
                  What are the grounds for divorce under the Hindu Marriage Act?
                </button>
                <button onClick={() => sendQuestion("Explain the procedure for filing a Public Interest Litigation (PIL).")}>
                  Explain the procedure for filing a Public Interest Litigation (PIL).
                </button>
                <button onClick={() => sendQuestion("What are the provisions regarding cyberstalking under the IT Act?")}>
                  What are the provisions regarding cyberstalking under the IT Act?
                </button>
                <button onClick={() => sendQuestion("What are a consumer's rights under the Consumer Protection Act, 2019?")}>
                  What are a consumer's rights under the Consumer Protection Act, 2019?
                </button>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <article className={`chat-message ${message.role}`} key={index}>
              <div className="message-name">
                {message.role === "user" ? "You" : "Legal Lens"}
              </div>
              <div className="message-text">{message.role === "assistant" ? formatText(message.text) : message.text}</div>

              {message.sources?.length > 0 && (
                <div className="source-list">
                  {message.sources.slice(0, 5).map((source, sourceIndex) => (
                    <details key={sourceIndex}>
                      <summary>
                        {source.source}, page {source.page}
                      </summary>
                      <p>{source.text}</p>
                    </details>
                  ))}
                </div>
              )}
            </article>
          ))}

          {loading && (
            <article className="chat-message assistant">
              <div className="message-name">Legal Lens</div>
              <div className="message-text">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </article>
          )}

          <div ref={messagesEnd}></div>
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <div className="chat-form-inner">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type your legal question... (Shift + Enter for new line)"
              rows="1"
            />
            <button type="submit" disabled={loading || !question.trim()}>
              Send
            </button>
          </div>
          <p className="chat-disclaimer">
            Legal Lens is an AI-powered informational tool, not a substitute for professional legal advice. Always verify with official sources.
          </p>
        </form>
      </section>
      </main>
    </>
  );
}

export default Chat;
