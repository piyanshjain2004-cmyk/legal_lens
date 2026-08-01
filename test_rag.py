from unittest.mock import MagicMock, patch

from utils.rag import (
    answer_question,
    answer_stolen_phone,
    is_stolen_phone_question,
    make_prompt,
)


def test_is_stolen_phone_question():
    assert is_stolen_phone_question("My phone was stolen") is True
    assert is_stolen_phone_question("I lost my mobile phone") is True
    assert is_stolen_phone_question("My cell phone got snatched") is True
    assert is_stolen_phone_question("My phone was robbed") is True
    assert is_stolen_phone_question("what to do if mobile is lost") is True
    assert is_stolen_phone_question("My laptop was stolen") is False
    assert is_stolen_phone_question("I found a phone") is False
    assert is_stolen_phone_question("Just a regular question") is False


def test_make_prompt():
    question = "What is the law?"
    sources = [
        {"text": "This is the first source text."},
        {"text": "This is the second source text."},
    ]
    prompt = make_prompt(question, sources)
    assert "You are a helpful legal information assistant for Indian laws." in prompt
    assert "Context:" in prompt
    assert "This is the first source text." in prompt
    assert "This is the second source text." in prompt
    assert "Question:" in prompt
    assert "What is the law?" in prompt
    assert "Answer in simple language:" in prompt


def test_answer_stolen_phone():
    sources = [
        {"source": "doc1.pdf", "page": 1},
        {"source": "doc2.pdf", "page": 5},
        {"source": "doc1.pdf", "page": 1},  # duplicate
    ]
    answer = answer_stolen_phone(sources)
    assert "If your phone is stolen" in answer
    assert "Sources matched:" in answer
    assert "- doc1.pdf, page 1" in answer
    assert "- doc2.pdf, page 5" in answer
    # Check for no duplicates
    assert answer.count("- doc1.pdf, page 1") == 1


@patch("utils.rag.search_similar_chunks")
def test_answer_question_no_sources(mock_search):
    mock_search.return_value = []
    question = "some question"
    result = answer_question(question)
    assert result["answer"] == "I could not find relevant information in the knowledge base."
    assert result["sources"] == []
    mock_search.assert_called_once_with(question, top_k=5)


@patch("utils.rag.search_similar_chunks")
def test_answer_question_stolen_phone(mock_search):
    mock_search.return_value = [{"source": "doc1.pdf", "page": 1, "text": "some text"}]
    question = "my phone was stolen"
    result = answer_question(question)
    assert "If your phone is stolen" in result["answer"]
    assert result["sources"] is not None
    mock_search.assert_called_once_with(question, top_k=5)


@patch("utils.rag.get_answer_model")
@patch("utils.rag.search_similar_chunks")
def test_answer_question_general(mock_search, mock_get_model):
    mock_search.return_value = [{"source": "doc1.pdf", "page": 1, "text": "some context text"}]

    mock_pipeline = MagicMock()
    mock_pipeline.return_value = [{"generated_text": "This is the generated answer."}]
    mock_get_model.return_value = mock_pipeline

    question = "general question"
    result = answer_question(question)

    mock_search.assert_called_once_with(question, top_k=5)
    mock_get_model.assert_called_once()
    mock_pipeline.assert_called_once()

    prompt_arg = mock_pipeline.call_args[0][0]
    assert "some context text" in prompt_arg
    assert "general question" in prompt_arg

    assert "This is the generated answer." in result["answer"]
    assert "This is general legal information only and not professional legal advice." in result["answer"]
    assert result["sources"] is not None


@patch("utils.rag.get_answer_model")
@patch("utils.rag.search_similar_chunks")
def test_answer_question_model_error(mock_search, mock_get_model):
    mock_search.return_value = [{"source": "doc1.pdf", "page": 1, "text": "some context text"}]

    mock_pipeline = MagicMock()
    mock_pipeline.side_effect = Exception("Model error")
    mock_get_model.return_value = mock_pipeline

    question = "another question"
    result = answer_question(question)

    assert result["answer"] == (
        "I found relevant legal text, but the answer model could not generate a full response. "
        "Please read the sources shown below."
    )
    assert "This is general legal information only and not professional legal advice." not in result["answer"]
    assert result["sources"] is not None