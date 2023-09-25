import { getCartEntriesByUserId } from "../cartEntries/model.js";
import { getItemById } from "../items/model.js";
import { handleError } from "../util/errorHandling.js";
import {
  insertUser,
  getUserById,
  deleteUser as deleteUserDb,
} from "./model.js";

export async function createUser(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  let id;
  try {
    id = await insertUser(req.body.username, req.body.password);
  } catch (e) {
    // check if error is thrown because user already exists:
    if (e.code === "SQLITE_CONSTRAINT") {
      return res.status(409).json({ error: "user already exists" });
    }
    return handleError(e, req, res);
  }
  res.json({ userId: id });
}

export async function getUser(req, res) {
  const userId = req.params.userId;
  const [user, cartEntries] = await Promise.all([
    getUserById(userId),
    getCartEntriesByUserId(userId),
  ]);
  const cartItemIds = cartEntries.map((entry) => entry.item_id);
  const cartItems = await Promise.all(
    cartItemIds.map((itemId) => getItemById(itemId))
  );

  let totalPriceEuroCent = 0;
  const cart = cartEntries.map((cartEntry) => {
    const item = cartItems.find((item) => item.id === cartEntry.item_id);
    const cartEntryInfo = {};
    cartEntryInfo.entryPriceEuroCent = item.priceEuroCent * cartEntry.quantity;
    totalPriceEuroCent += cartEntryInfo.entryPriceEuroCent;
    cartEntryInfo.id = cartEntry.id;
    cartEntryInfo.name = item.name;
    cartEntryInfo.quantity = cartEntry.quantity;
    cartEntryInfo.itemPriceEuroCent = item.priceEuroCent;
    cartEntryInfo.itemId = item.id;
    return cartEntryInfo;
  });

  user.totalPriceEuroCent = totalPriceEuroCent;
  user.cart = cart;

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  res.json(user);
}

export async function deleteUser(req, res) {
  let id;
  try {
    id = req.params.userId;
    await deleteUserDb(id);
  } catch (e) {
    return handleError(e, req, res);
  }
  res.json({ userId: id });
}
