import pkg from "sqlite3";
const { Database } = pkg;

const db = new Database("./database.db");
db.run("PRAGMA foreign_keys = ON");

db.run(
  `CREATE TABLE IF NOT EXISTS users (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  username     TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL
);`
);

db.run(
  `CREATE TABLE IF NOT EXISTS items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL UNIQUE,
  priceEuroCent    INTEGER NOT NULL
);`
);

db.run(
  `CREATE TABLE IF NOT EXISTS cart_entries (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id  INTEGER NOT NULL,
  item_id  INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  UNIQUE (user_id, item_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);`
);

function dangerouslyClearAllTablesJustForTesting() {
  db.serialize(() => {
    db.run("DELETE FROM cart_entries");
    db.run("DELETE FROM items");
    db.run("DELETE FROM users");

    // Reset the auto-increment counter
    db.run("DELETE FROM sqlite_sequence WHERE name='cart_entries'");
    db.run("DELETE FROM sqlite_sequence WHERE name='items'");
    db.run("DELETE FROM sqlite_sequence WHERE name='users'");
  });
}

export { db, dangerouslyClearAllTablesJustForTesting as clearAllTables };
