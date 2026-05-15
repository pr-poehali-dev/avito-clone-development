"""
Авторизация: регистрация, вход, выход, проверка сессии.
action=register | login | logout | me
"""
import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_conn():
    dsn = os.environ["DATABASE_URL"]
    return psycopg2.connect(dsn)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}

def err(msg: str, code: int = 400) -> dict:
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    params = event.get("queryStringParameters") or {}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action") or params.get("action", "")

    # ── me ───────────────────────────────────────────────────────
    if action == "me" or (method == "GET" and not action):
        token = (event.get("headers") or {}).get("X-Session-Token", "")
        if not token:
            return err("Не авторизован", 401)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT u.id, u.email, u.full_name, u.company, u.phone, u.is_verified "
            f"FROM {schema}.sessions s JOIN {schema}.users u ON u.id = s.user_id "
            f"WHERE s.token = %s AND s.expires_at > NOW()",
            (token,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return err("Сессия истекла", 401)
        return ok({"id": row[0], "email": row[1], "full_name": row[2], "company": row[3], "phone": row[4], "is_verified": row[5]})

    # ── register ─────────────────────────────────────────────────
    if action == "register":
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        full_name = (body.get("full_name") or "").strip()
        company = (body.get("company") or "").strip()
        phone = (body.get("phone") or "").strip()

        if not email or not password or not full_name:
            return err("Заполните обязательные поля: email, пароль, имя")
        if len(password) < 6:
            return err("Пароль должен быть не менее 6 символов")

        pw_hash = hash_password(password)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {schema}.users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return err("Пользователь с таким email уже зарегистрирован")

        cur.execute(
            f"INSERT INTO {schema}.users (email, password_hash, full_name, company, phone) "
            f"VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (email, pw_hash, full_name, company or None, phone or None)
        )
        user_id = cur.fetchone()[0]
        token = secrets.token_hex(32)
        expires = datetime.now() + timedelta(days=30)
        cur.execute(
            f"INSERT INTO {schema}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, token, expires)
        )
        conn.commit()
        conn.close()
        return ok({"token": token, "user": {"id": user_id, "email": email, "full_name": full_name, "company": company, "phone": phone, "is_verified": False}})

    # ── login ────────────────────────────────────────────────────
    if action == "login":
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return err("Введите email и пароль")

        pw_hash = hash_password(password)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, full_name, company, phone, is_verified FROM {schema}.users "
            f"WHERE email = %s AND password_hash = %s",
            (email, pw_hash)
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return err("Неверный email или пароль")

        user_id, full_name, company, phone, is_verified = row
        token = secrets.token_hex(32)
        expires = datetime.now() + timedelta(days=30)
        cur.execute(
            f"INSERT INTO {schema}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, token, expires)
        )
        conn.commit()
        conn.close()
        return ok({"token": token, "user": {"id": user_id, "email": email, "full_name": full_name, "company": company, "phone": phone, "is_verified": is_verified}})

    # ── logout ───────────────────────────────────────────────────
    if action == "logout":
        token = (event.get("headers") or {}).get("X-Session-Token", "")
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {schema}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return ok({"ok": True})

    return err("Неизвестное действие", 400)