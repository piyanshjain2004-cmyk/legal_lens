# AI Legal Assistant for Indian Laws

## Goal

Build a simple, clean, beginner-friendly AI Legal Assistant for Indian laws. This is a final-year college project, so prioritize readability, maintainability, and clear explanations over enterprise-level architecture.

## Tech Stack

* Python 3.12+
* Flask
* Sentence Transformers
* FAISS
* PyMuPDF
* Transformers (Hugging Face)
* SQLite (only if chat history is needed)

Do NOT use:

* Docker
* Kubernetes
* Redis
* RabbitMQ
* LangGraph
* Microservices
* Cloud services
* Paid APIs

## Features

### Phase 1

* Chat interface
* User asks legal questions
* Search Indian law documents
* Generate answer using RAG
* Show sources used

### Phase 2

* PDF upload
* Ask questions about uploaded PDF
* Chat history
* Dark mode

## Folder Structure

legal-assistant/

data/

* law_pdfs/

vector_db/

models/

utils/

* pdf_loader.py
* text_splitter.py
* embeddings.py
* vector_store.py
* rag.py

app.py

requirements.txt

README.md

## Workflow

User Question

↓

Create Embedding

↓

Search FAISS

↓

Retrieve Top 5 Chunks

↓

Send Context + Question to LLM

↓

Generate Answer

↓

Display:

* Answer
* Source Sections
* Source Document Name

## UI

Left Sidebar:

* Upload PDF
* Select Knowledge Base
* Clear Chat

Main Screen:

* Chat Window
* User Message
* AI Response
* Sources

## Coding Guidelines

* Use classes only where necessary.
* Prefer simple functions.
* Keep each file under 250 lines if possible.
* Write clean variable names.
* Add docstrings.
* Add type hints.
* Include error handling.
* Display friendly error messages.

## Documentation

Create:

* README.md
* Installation guide
* Folder explanation
* Architecture diagram
* Requirements.txt

## Project Goal

The assistant should answer general legal information questions related to Indian laws using Retrieval-Augmented Generation (RAG). It should provide informational guidance only, cite the legal source used, and clearly state that it is not a substitute for professional legal advice.

Keep the code simple enough that a final-year student can understand every file and explain the project during a viva.

```bash
pip install -r requirements.txt
```

## Folder Structure

```text
legal-assistant/
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
├── data/
│   └── law_pdfs/
├── vector_db/
├── models/
└── utils/
    ├── __init__.py
    ├── pdf_loader.py
    ├── text_splitter.py
    ├── embeddings.py
    ├── vector_store.py
    └── rag.py
