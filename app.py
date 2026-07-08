from flask import Flask, render_template, request, jsonify
from core.ai import ask_cherrie
from core.database import init_db
from core.database import get_db

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/chat")
def chat():
    return render_template("chat.html")


@app.route("/planner")
def planner():
    return render_template("planner.html")


@app.route("/focus")
def focus():
    return render_template("focus.html")


@app.route("/habits")
def habits():
    return render_template("habits.html")

@app.route("/api/chat", methods=["POST"])
@app.route("/api/chat", methods=["POST"])
def chat_api():

    data = request.json

    user_message = data.get("message")


    if not user_message:

        return jsonify({
            "reply":"Tell me what's on your mind ♡"
        })


    reply = ask_cherrie(user_message)


    db = get_db()

    db.execute(
        """
        INSERT INTO chat_history(user_message, ai_reply)
        VALUES(?,?)
        """,
        (user_message, reply)
    )

    db.commit()
    db.close()


    return jsonify({
        "reply": reply
    })
@app.route("/api/tasks", methods=["GET"])
def get_tasks():

    db = get_db()

    tasks = db.execute(
        "SELECT * FROM tasks"
    ).fetchall()

    db.close()

    return jsonify([dict(task) for task in tasks])


@app.route("/api/tasks", methods=["POST"])
def add_task():

    data = request.json

    task = data.get("task")

    if not task:
        return jsonify({"message": "Task required"}), 400

    db = get_db()

    db.execute(
        "INSERT INTO tasks(task) VALUES(?)",
        (task,)
    )

    db.commit()
    db.close()

    return jsonify({"message": "Task added 🍒"})
@app.route("/api/tasks/<int:id>", methods=["PUT"])
def update_task(id):

    data = request.json

    db = get_db()

    db.execute(
        "UPDATE tasks SET completed=? WHERE id=?",
        (data["completed"], id)
    )

    db.commit()
    db.close()

    return jsonify({"message":"updated"})
@app.route("/api/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):

    db = get_db()

    db.execute(
        "DELETE FROM tasks WHERE id=?",
        (id,)
    )

    db.commit()
    db.close()

    return jsonify({"message":"deleted"})
# ==============================
# 🌱 HABITS API
# ==============================

@app.route("/api/habits", methods=["GET"])
def get_habits():

    db = get_db()

    habits = db.execute(
    "SELECT * FROM habits ORDER BY id DESC"
    ).fetchall()

    db.close()

    return jsonify([dict(h) for h in habits])



@app.route("/api/habits", methods=["POST"])
def add_habit():

    data = request.json

    habit = data.get("habit")


    if not habit:
        return jsonify({"message":"Habit required"}),400


    db = get_db()

    db.execute(
        "INSERT INTO habits(habit) VALUES(?)",
        (habit,)
    )


    db.commit()
    db.close()


    return jsonify({"message":"Habit added 🍃"})



@app.route("/api/habits/<int:id>", methods=["PUT"])
def update_habit(id):

    data=request.json


    db=get_db()

    db.execute(
        "UPDATE habits SET completed=? WHERE id=?",
        (data["completed"], id)
    )


    db.commit()
    db.close()


    return jsonify({"message":"updated"})



@app.route("/api/habits/<int:id>", methods=["DELETE"])
def delete_habit(id):

    db=get_db()

    db.execute(
        "DELETE FROM habits WHERE id=?",
        (id,)
    )


    db.commit()
    db.close()


    return jsonify({"message":"deleted"})

# ==============================
# 🍅 FOCUS API
# ==============================


@app.route("/api/pomodoros", methods=["POST"])
def add_pomodoro():

    db = get_db()

    db.execute(
        "INSERT INTO pomodoros DEFAULT VALUES"
    )

    db.commit()
    db.close()


    return jsonify({
        "message":"Pomodoro completed 🍅"
    })



@app.route("/api/pomodoros", methods=["GET"])
def get_pomodoros():

    db = get_db()

    count = db.execute(
        """
        SELECT COUNT(*) as total
        FROM pomodoros
        WHERE DATE(created_at)=DATE('now')
        """
    ).fetchone()


    db.close()


    return jsonify({
        "count": count["total"]
    })
@app.route("/api/chat/history", methods=["GET"])
def chat_history():

    db = get_db()

    chats = db.execute(
        """
        SELECT * FROM chat_history
        ORDER BY id ASC
        """
    ).fetchall()


    db.close()


    return jsonify([
        dict(chat)
        for chat in chats
    ])
if __name__ == "__main__":

    init_db()

    app.run(debug=True)