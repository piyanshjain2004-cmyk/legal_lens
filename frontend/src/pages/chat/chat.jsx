import { useCallback, useEffect, useRef, useState } from "react";

import { askQuestion, buildKnowledgeBase, rebuildKnowledgeBase } from "../../services/api";
import Navbar from "../../components/navbar/navbar";
import "./chat.css";

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
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
          <p>Ask questions grounded in the Indian law documents stored in your project.</p>
        </header>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-chat">
              Start with a specific legal situation, Act name or right you want to understand.
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
              <div className="message-text">Retrieving legal context...</div>
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
            Send
          </button>
        </form>
      </section>
      </main>
    </>
  );
}

export default Chat;
