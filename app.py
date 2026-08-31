from flask import Flask, jsonify, request

from utils.rag import answer_question
from utils.vector_store import build_vector_store, rebuild_vector_store
from utils.settings import setup_environment

setup_environment()

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin", "")
    allowed_origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    }

    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin

    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.route("/build", methods=["POST"])
def build():
    try:
        total_chunks = build_vector_store()

        return jsonify({
            "success": True,
            "message": f"Knowledge base ready with {total_chunks} chunks."
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "message": str(error)
        }), 400


@app.route("/rebuild", methods=["POST"])
def rebuild():
    try:
        total_chunks = rebuild_vector_store()

        return jsonify({
            "success": True,
            "message": f"Knowledge base rebuilt with {total_chunks} chunks."
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "message": str(error)
        }), 400


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()

    if not question:
        return jsonify({
            "success": False,
            "message": "Please enter a question."
        }), 400

    try:
        result = answer_question(question)

        return jsonify({
            "success": True,
            "answer": result["answer"],
            "sources": result["sources"]
        })

    except FileNotFoundError:
        return jsonify({
            "success": False,
            "message": "Please build the knowledge base first."
        }), 400

    except Exception as error:
        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        use_reloader=False
    )
