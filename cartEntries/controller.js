import { handleError } from "../util/errorHandling.js";
import {
  insert,
  update,
  deleteCartEntry as deleteCartEntryDb,
} from "./model.js";

export async function createCartEntry(req, res) {
  let id;
  try {
    id = await insert(req.body.userId, req.body.itemId, req.body.quantity);
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT") {
      return res.status(409).json({ error: `invalid cart entry. ${e}` });
    }
    return handleError(e, req, res);
  }
  res.json({ cartEntryId: id });
}

export async function updateCartEntry(req, res) {
  const id = req.params.id;
  try {
    const userId = req.body.userId;
    const itemId = req.body.itemId;

    const quantity = req.body.quantity;
    await update(id, userId, itemId, quantity);
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT") {
      return res.status(409).json({ error: `invalid cart entry. ${e}` });
    }
    return handleError(e, req, res);
  }
  res.json({ cartEntryId: id });
}

export async function deleteCartEntry(req, res) {
  const id = req.params.id;
  try {
    await deleteCartEntryDb(id);
  } catch (e) {
    return handleError(e, req, res);
  }
  res.json({ cartEntryId: id });
}
