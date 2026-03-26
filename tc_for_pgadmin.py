import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="postgres",
        password="postgres123"
    )
    print("Connection successful")

    cur = conn.cursor()
    cur.execute("SELECT 1;")
    print("Query result:", cur.fetchone())

    cur.close()
    conn.close()

except Exception as e:
    print("Connection failed:", e)