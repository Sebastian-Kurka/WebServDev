import { Router } from "express";
import {
  createItem,
  deleteItem,
  updateItem,
  getItem,
  getItems,
} from "./controller.js";
import { basicAuth } from "../util/basicAuth.js";

const itemsRouter = Router();

itemsRouter.post("/", basicAuth, createItem);
itemsRouter.get("/", basicAuth, getItems);
itemsRouter.get("/:id", basicAuth, getItem);
itemsRouter.patch("/:id", basicAuth, updateItem);
itemsRouter.delete("/:id", basicAuth, deleteItem);

export { itemsRouter };
