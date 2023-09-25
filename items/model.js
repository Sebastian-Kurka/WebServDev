"use strict";

import { db } from "../database.js";

async function insertItem(name, priceEuroCent) {
  const query = "INSERT INTO items (name, priceEuroCent) VALUES (?, ?)";
  const stmt = db.prepare(query);

  return new Promise((resolve, reject) => {
    stmt.run([name, priceEuroCent], function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
}

export async function getItemById(id) {
  const query = "SELECT * FROM items WHERE id = ? LIMIT 1";
  const stmt = db.prepare(query);
  return new Promise((resolve, reject) => {
    stmt.get([id], function (err, row) {
      if (err) {
        return reject(err);
      }
      if (row) {
        resolve(row);
      } else {
        resolve(null);
      }
    });
  });
}

export async function getItems() {
  const query = "SELECT * FROM items";
  const stmt = db.prepare(query);
  return new Promise((resolve, reject) => {
    stmt.all(function (err, rows) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

export async function deleteItem(id) {
  const query = "DELETE FROM items WHERE id =?";
  const stmt = db.prepare(query);
  return new Promise((resolve, reject) => {
    stmt.run([id], function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this.changes);
    });
  });
}

async function updateItem(id, name, priceEuroCent) {
  if (id === undefined) {
    throw new Error("The id parameter is required for updating.");
  }

  // Determine which columns to update
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push("name = ?");
    values.push(name);
  }

  if (priceEuroCent !== undefined) {
    updates.push("priceEuroCent = ?");
    values.push(priceEuroCent);
  }

  if (updates.length === 0) {
    throw new Error(
      "At least one field (name or priceEuroCent) must be provided to update."
    );
  }

  // Construct the SQL query
  const query = `UPDATE items SET ${updates.join(", ")} WHERE id = ?`;
  values.push(id);

  const stmt = db.prepare(query);

  return new Promise((resolve, reject) => {
    stmt.run(values, function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this.changes);
    });
  });
}

export { insertItem, updateItem };
