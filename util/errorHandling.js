export function handleError(err, req, res) {
  if (typeof err === "object" && err.message) {
    err = { error: err.message };
  } else if (typeof err === "string") {
    err = { error: err };
  } else {
    err = { error: "unknown error occured" };
  }
  console.error(
    `ERROR on [${req.method}] via ${req.originalUrl}: [${err.error}]`
  );
  res.status(500).json(err);
  return;
}
