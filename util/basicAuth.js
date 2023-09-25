import { isAuthenticatedUser } from "../users/model.js";

async function isValidUser(username, password) {
  return isAuthenticatedUser(username, password);
}

export async function basicAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "no or invalid authorization" });
  }

  const base64 = req.headers.authorization.split(" ")[1];
  const userPass = Buffer.from(base64, "base64").toString("utf8");

  const [username, password] = userPass.split(":");

  if (!username || !password) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  if (!(await isValidUser(username, password))) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  next();
}
