from utils.settings import setup_environment

setup_environment()

from flask import Flask, jsonify, render_template, request

from utils.rag import answer_question
from utils.vector_store import build_vector_store, rebuild_vector_store


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/build", methods=["POST"])
def build():
    try:
        total_chunks = build_vector_store()
        return jsonify(
            {
                "success": True,
                "message": f"Knowledge base ready with {total_chunks} chunks.",
            }
        )
    except Exception as error:
        return jsonify({"success": False, "message": str(error)}), 400


@app.route("/rebuild", methods=["POST"])
def rebuild():
    try:
        total_chunks = rebuild_vector_store()
        return jsonify(
            {
                "success": True,
                "message": f"Knowledge base rebuilt with {total_chunks} chunks.",
            }
        )
    except Exception as error:
        return jsonify({"success": False, "message": str(error)}), 400


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question", "").strip() if data else ""

    if not question:
        return jsonify({"success": False, "message": "Please enter a question."}), 400

    try:
        result = answer_question(question)
        return jsonify(
            {
                "success": True,
                "answer": result["answer"],
                "sources": result["sources"],
            }
        )
    except FileNotFoundError:
        return jsonify(
            {
                "success": False,
                "message": "Please build the knowledge base first.",
            }
        ), 400
    except Exception as error:
        return jsonify({"success": False, "message": str(error)}), 500


if __name__ == "__main__":
    app.run(debug=False, use_reloader=False)
