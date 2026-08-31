import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { askQuestion, buildKnowledgeBase, rebuildKnowledgeBase } from "../../services/api";
import "./chat.css";

function Chat() {
  const location = useLocation();
  const firstQuestion = location.state?.question || "";
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const firstQuestionSent = useRef(false);
  const messagesEnd = useRef(null);

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

  useEffect(() => {
    if (!firstQuestion || firstQuestionSent.current) {
      return;
    }

    firstQuestionSent.current = true;
    sendQuestion(firstQuestion);
  }, [firstQuestion, sendQuestion]);

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

  return (
    <main className="chat-page">
      <aside className="chat-sidebar">
        <Link to="/" className="chat-logo">
          Legal<span>Lens</span>
        </Link>

        <button onClick={handleBuild}>Build Knowledge Base</button>
        <button onClick={handleRebuild}>Rebuild Knowledge Base</button>
        <button onClick={() => setMessages([])}>Clear Chat</button>

        {status && <p className="chat-status">{status}</p>}
      </aside>

      <section className="chat-panel">
        <header className="chat-top">
          <h1>Ask Legal Lens</h1>
          <p>General Indian law information based on your PDF knowledge base.</p>
        </header>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-chat">
              Ask a legal question to start.
            </div>
          )}

          {messages.map((message, index) => (
            <article className={`chat-message ${message.role}`} key={index}>
              <div className="message-name">
                {message.role === "user" ? "You" : "Legal Lens"}
              </div>
              <div className="message-text">{message.text}</div>

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
              <div className="message-text">Searching legal documents...</div>
            </article>
          )}

          <div ref={messagesEnd}></div>
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Type your legal question..."
            rows="2"
          />
          <button type="submit" disabled={loading || !question.trim()}>
            Ask
          </button>
        </form>
      </section>
    </main>
  );
}

export default Chat;
