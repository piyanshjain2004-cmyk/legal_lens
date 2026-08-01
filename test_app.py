import json
from unittest.mock import patch

import pytest

from app import app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_home(client):
    rv = client.get("/")
    assert rv.status_code == 200
    assert rv.content_type == "text/html; charset=utf-8"


@patch("app.build_vector_store")
def test_build_success(mock_build, client):
    mock_build.return_value = 123
    rv = client.post("/build")
    assert rv.status_code == 200
    response_data = json.loads(rv.data)
    assert response_data["success"] is True
    assert response_data["message"] == "Knowledge base ready with 123 chunks."
    mock_build.assert_called_once()


@patch("app.build_vector_store")
def test_build_error(mock_build, client):
    mock_build.side_effect = Exception("Build failed")
    rv = client.post("/build")
    assert rv.status_code == 400
    response_data = json.loads(rv.data)
    assert response_data["success"] is False
    assert response_data["message"] == "Build failed"
    mock_build.assert_called_once()


@patch("app.rebuild_vector_store")
def test_rebuild_success(mock_rebuild, client):
    mock_rebuild.return_value = 456
    rv = client.post("/rebuild")
    assert rv.status_code == 200
    response_data = json.loads(rv.data)
    assert response_data["success"] is True
    assert response_data["message"] == "Knowledge base rebuilt with 456 chunks."
    mock_rebuild.assert_called_once()


@patch("app.rebuild_vector_store")
def test_rebuild_error(mock_rebuild, client):
    mock_rebuild.side_effect = Exception("Rebuild failed")
    rv = client.post("/rebuild")
    assert rv.status_code == 400
    response_data = json.loads(rv.data)
    assert response_data["success"] is False
    assert response_data["message"] == "Rebuild failed"
    mock_rebuild.assert_called_once()


def test_ask_no_question(client):
    rv = client.post("/ask", json={})
    assert rv.status_code == 400
    response_data = json.loads(rv.data)
    assert response_data["success"] is False
    assert response_data["message"] == "Please enter a question."

    rv = client.post("/ask", json={"question": "  "})
    assert rv.status_code == 400
    response_data = json.loads(rv.data)
    assert response_data["success"] is False
    assert response_data["message"] == "Please enter a question."


@patch("app.answer_question")
def test_ask_success(mock_answer, client):
    mock_answer.return_value = {
        "answer": "This is the answer.",
        "sources": [{"source": "doc.pdf", "page": 1}],
    }
    rv = client.post("/ask", json={"question": "What is the law?"})
    assert rv.status_code == 200
    response_data = json.loads(rv.data)
    assert response_data["success"] is True
    assert response_data["answer"] == "This is the answer."
    assert len(response_data["sources"]) == 1
    mock_answer.assert_called_once_with("What is the law?")


@patch("app.answer_question")
def test_ask_file_not_found_error(mock_answer, client):
    mock_answer.side_effect = FileNotFoundError("DB not found")
    rv = client.post("/ask", json={"question": "What is the law?"})
    assert rv.status_code == 400
    response_data = json.loads(rv.data)
    assert response_data["success"] is False
    assert response_data["message"] == "Please build the knowledge base first."
    mock_answer.assert_called_once_with("What is the law?")


@patch("app.answer_question")
def test_ask_generic_error(mock_answer, client):
    mock_answer.side_effect = Exception("Something went wrong")
    rv = client.post("/ask", json={"question": "What is the law?"})
    assert rv.status_code == 500
    response_data = json.loads(rv.data)
    assert response_data["success"] is False
    assert response_data["message"] == "Something went wrong"
    mock_answer.assert_called_once_with("What is the law?")