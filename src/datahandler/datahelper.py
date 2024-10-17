import sqlite3
from datetime import datetime


class userHandler:
    def __init__(self, db_name='users.db'):
        self.connection = sqlite3.connect(db_name)
        self.cursor = self.connection.cursor()
        self.create_table_if_not_exists()

    def create_table_if_not_exists(self):
        query = '''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT NOT NULL,
            crypto_add TEXT UNIQUE,
            user_type TEXT NOT NULL,
            create_date TEXT NOT NULL
        );
        '''
        self.cursor.execute(query)
        self.connection.commit()

    def insert_user(self, name, phone, email, password, crypto_add, user_type):
        query = '''
        INSERT INTO users (name, phone, email, password, crypto_add, user_type, create_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        '''
        create_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        try:
            self.cursor.execute(
                query, (name, phone, email, password, crypto_add, user_type, create_date))
            self.connection.commit()
        except sqlite3.IntegrityError as e:
            print(f"Error: {e}")

    def update_user_by_id(self, user_id, name=None, phone=None, email=None, password=None, crypto_add=None, user_type=None):
        query = 'UPDATE users SET '
        updates = []
        params = []

        if name:
            updates.append('name = ?')
            params.append(name)
        if phone:
            updates.append('phone = ?')
            params.append(phone)
        if email:
            updates.append('email = ?')
            params.append(email)
        if password:
            updates.append('password = ?')
            params.append(password)
        if crypto_add:
            updates.append('crypto_add = ?')
            params.append(crypto_add)
        if user_type:
            updates.append('user_type = ?')
            params.append(user_type)

        query += ', '.join(updates) + ' WHERE user_id = ?'
        params.append(user_id)

        self.cursor.execute(query, params)
        self.connection.commit()

    def delete_user(self, **kwargs):
        allowed_fields = ['user_id', 'phone', 'email', 'crypto_add']
        field, value = next(((k, v) for k, v in kwargs.items()
                            if k in allowed_fields), (None, None))

        if field and value:
            query = f'DELETE FROM users WHERE {field} = ?'
            self.cursor.execute(query, (value,))
            self.connection.commit()
        else:
            print("Error: Invalid field for deletion")

    def close(self):
        self.connection.close()
