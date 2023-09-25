"use strict";

import { db } from "../database.js";

export async function insert(userId, itemId, quantity) {
  const query =
    "INSERT INTO cart_entries (user_id, item_id, quantity) VALUES (?, ?, ?)";
  const stmt = db.prepare(query);
  return new Promise((resolve, reject) => {
    stmt.run([userId, itemId, quantity], function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
}

export async function getCartEntriesByUserId(userId) {
  const query = "SELECT * FROM cart_entries WHERE user_id = ?";
  const stmt = db.prepare(query);
  return new Promise((resolve, reject) => {
    stmt.all([userId], function (err, rows) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

export async function update(id, userId, itemId, quantity) {
  // Determine which columns to update
  const updates = [];
  const values = [];

  if (userId !== undefined) {
    updates.push("user_id = ?");
    values.push(userId);
  }

  if (itemId !== undefined) {
    updates.push("item_id = ?");
    values.push(itemId);
  }

  if (quantity !== undefined) {
    updates.push("quantity = ?");
    values.push(quantity);
  }

  if (updates.length === 0) {
    throw new Error(
      "At least one field (userId, itemId or quantity) must be provided to update."
    );
  }

  const query = `UPDATE cart_entries SET ${updates.join(", ")} WHERE id = ?`;
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

export async function deleteCartEntry(id) {
  const query = "DELETE FROM cart_entries WHERE id = ?";
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
