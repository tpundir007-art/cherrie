import sqlite3
import os


DB_NAME = "db/cherrie.db"


def get_db():

    conn = sqlite3.connect(DB_NAME)

    conn.row_factory = sqlite3.Row

    return conn



def init_db():

    os.makedirs("db", exist_ok=True)

    conn = get_db()

    cursor = conn.cursor()


    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        completed INTEGER DEFAULT 0
    )
    """)
    cursor.execute("""
CREATE TABLE IF NOT EXISTS chat_history(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_message TEXT NOT NULL,

    ai_reply TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

)
""")

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS habits(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit TEXT NOT NULL,
        completed INTEGER DEFAULT 0
    )
    """)


    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT
    )
    """)


    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pomodoros(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    cursor.execute("""
CREATE TABLE IF NOT EXISTS notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
)
""")

    conn.commit()
    conn.close()