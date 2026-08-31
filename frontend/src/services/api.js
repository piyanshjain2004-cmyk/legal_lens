const API_URL = "http://127.0.0.1:5000";

export async function askQuestion(question) {
  const response = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: question.trim(),
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function buildKnowledgeBase() {
  const response = await fetch(`${API_URL}/build`, {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function rebuildKnowledgeBase() {
  const response = await fetch(`${API_URL}/rebuild`, {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}