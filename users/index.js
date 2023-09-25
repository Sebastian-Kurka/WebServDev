import { Router } from "express";
import { createUser, getUser, deleteUser } from "./controller.js";
import { basicAuth } from "../util/basicAuth.js";

const usersRouter = Router();
usersRouter.post("/", createUser);
usersRouter.get("/:userId", basicAuth, getUser);
usersRouter.delete("/:userId", basicAuth, deleteUser);

export { usersRouter };
