"use strict";

import express from "express";
import { usersRouter } from "./users/index.js";
import { itemsRouter } from "./items/index.js";
import { cartEntriesRouter } from "./cartEntries/index.js";
import { basicAuth } from "./util/basicAuth.js";

const app = express();
const port = 3000;

process.title = "REST shopping cart";

const API_VERSION = "1";

app.use(express.json());

const versionedRouter = express.Router();

versionedRouter.use("/users", usersRouter);
versionedRouter.use("/items", basicAuth, itemsRouter);
versionedRouter.use("/cartEntries", basicAuth, cartEntriesRouter);

app.use(`/v${API_VERSION}`, versionedRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app };
