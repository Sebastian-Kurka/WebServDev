"use strict";

import bcrypt from "bcrypt";
import { db } from "../database.js";

const SALT_ROUNDS = 10;

// Create the 'users' table if it doesn't exist

export async function insertUser(username, passwordUnhashed) {
  const hash = await bcrypt.hash(passwordUnhashed, SALT_ROUNDS);
  const query = "INSERT INTO users (username, passwordHash) VALUES (?, ?)";
  const stmt = db.prepare(query);

  return new Promise((resolve, reject) => {
    stmt.run([username, hash], function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
}

// get user by username from db:
export async function getUserByUsername(username) {
  const query = "SELECT * FROM users WHERE username = ? LIMIT 1";
  const stmt = db.prepare(query);
  return new Promise((resolve, reject) => {
    stmt.get([username], function (err, row) {
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

export async function isAuthenticatedUser(username, passwordUnhashed) {
  const user = await getUserByUsername(username);
  const correctPwHash = user ? user.passwordHash : null;
  return (
    correctPwHash && (await bcrypt.compare(passwordUnhashed, correctPwHash))
  );
}

export async function getUserById(id) {
  const query = "SELECT * FROM users WHERE id = ? LIMIT 1";
  const stmt = db.prepare(query);
  return new Promise((resolve, reject) => {
    stmt.get([id], function (err, row) {
      if (err) {
        return reject(err);
      }
      if (row) {
        resolve({
          id: row.id,
          username: row.username,
        });
      } else {
        resolve(null);
      }
    });
  });
}

export async function deleteUser(id) {
  const query = "DELETE FROM users WHERE id = ?";
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
