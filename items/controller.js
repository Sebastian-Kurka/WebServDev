import { handleError } from "../util/errorHandling.js";
import {
  insertItem,
  updateItem as updateItemDb,
  deleteItem as deleteItemDb,
  getItems as getItemsDb,
  getItemById,
} from "./model.js";

export async function createItem(req, res) {
  let id;
  try {
    id = await insertItem(req.body.name, req.body.priceEuroCent);
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT") {
      return res
        .status(409)
        .json({ error: "item with that name already exists" });
    }
    return handleError(e, req, res);
  }
  res.json({ itemId: id });
}

export async function getItem(req, res) {
  let id;
  try {
    id = req.params.id;
    const item = await getItemById(id);
    if (!item) {
      return res.status(404).json({ error: "item not found" });
    }
    res.json(item);
  } catch (e) {
    return handleError(e, req, res);
  }
}

export async function getItems(req, res) {
  try {
    const items = await getItemsDb();
    res.json(items);
  } catch (e) {
    return handleError(e, req, res);
  }
}

export async function updateItem(req, res) {
  let id;
  try {
    id = req.params.id;
    const name = req.body.name;
    const priceEuroCent = req.body.priceEuroCent;
    await updateItemDb(id, name, priceEuroCent);
  } catch (e) {
    // check if item with that name already exists:

    if (e.code === "SQLITE_CONSTRAINT") {
      return res
        .status(409)
        .json({ error: "item with that name already exists" });
    }
    return handleError(e, req, res);
  }
  res.json({ itemId: id });
}

export async function deleteItem(req, res) {
  let id;
  try {
    id = req.params.id;
    await deleteItemDb(id);
  } catch (e) {
    return handleError(e, req, res);
  }
  res.json({ itemId: id });
}
