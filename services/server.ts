import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_TOKEN = process.env.TOKEN_REGISTRY || "";

const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const queryToken = req.query.token as string;

  const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : "";
  const incomingToken = tokenFromHeader || queryToken;

  if (!incomingToken || incomingToken !== SECRET_TOKEN) {
    res.status(401).json({ error: "Unauthorized: Token not available or wrong" });
    return;
  }

  next();
};

app.use("/api/registry", requireAuth, express.static(path.join(__dirname, "..", "dist-registry"), { extensions: ["json"] }));
app.use(express.static(path.join(__dirname, "..", "dist")));

app.get("*any", (_: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Private Registry running on port ${PORT}`);
});