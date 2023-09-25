import { Router } from "express";
import {
  createCartEntry,
  updateCartEntry,
  deleteCartEntry,
} from "./controller.js";
import { basicAuth } from "../util/basicAuth.js";

const cartEntriesRouter = Router();

cartEntriesRouter.post("/", basicAuth, createCartEntry);
cartEntriesRouter.patch("/:id", basicAuth, updateCartEntry);
cartEntriesRouter.delete("/:id", basicAuth, deleteCartEntry);

export { cartEntriesRouter };
