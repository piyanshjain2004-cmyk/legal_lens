const buildButton = document.getElementById("buildButton");
const rebuildButton = document.getElementById("rebuildButton");
const clearButton = document.getElementById("clearButton");
const statusBox = document.getElementById("statusBox");
const chatMessages = document.getElementById("chatMessages");
const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("questionInput");

function setStatus(message) {
    statusBox.textContent = message;
}

function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSources(sources) {
    if (!sources || sources.length === 0) {
        return;
    }

    const box = document.createElement("div");
    box.className = "sources";

    sources.forEach((source, index) => {
        const title = document.createElement("div");
        title.className = "sourceTitle";
        title.textContent = `Source ${index + 1}: ${source.source}, Page ${source.page}`;

        const text = document.createElement("div");
        text.className = "sourceText";
        text.textContent = source.text;

        box.appendChild(title);
        box.appendChild(text);
    });

    chatMessages.appendChild(box);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

buildButton.addEventListener("click", async () => {
    setStatus("Building knowledge base...");
    buildButton.disabled = true;

    try {
        const response = await fetch("/build", { method: "POST" });
        const data = await response.json();
        setStatus(data.message);
    } catch (error) {
        setStatus("Could not build knowledge base.");
    }

    buildButton.disabled = false;
});

rebuildButton.addEventListener("click", async () => {
    setStatus("Rebuilding knowledge base...");
    rebuildButton.disabled = true;

    try {
        const response = await fetch("/rebuild", { method: "POST" });
        const data = await response.json();
        setStatus(data.message);
    } catch (error) {
        setStatus("Could not rebuild knowledge base.");
    }

    rebuildButton.disabled = false;
});

clearButton.addEventListener("click", () => {
    chatMessages.innerHTML = "";
    addMessage("Ask a question about Indian laws after building the knowledge base.", "bot");
});

questionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = questionInput.value.trim();

    if (!question) {
        return;
    }

    addMessage(question, "user");
    questionInput.value = "";
    addMessage("Searching legal documents...", "bot");

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question }),
        });

        const data = await response.json();
        chatMessages.lastChild.remove();

        if (!data.success) {
            addMessage(data.message, "bot");
            return;
        }

        addMessage(data.answer, "bot");
        addSources(data.sources);
    } catch (error) {
        chatMessages.lastChild.remove();
        addMessage("Sorry, something went wrong.", "bot");
    }
});
