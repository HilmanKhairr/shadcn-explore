import { auth, runs } from "@trigger.dev/sdk";
import { config } from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { readFile } from "fs/promises";
import { join } from "path";

config({ path: join(process.cwd(), ".env") });
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const SECRET_TOKEN = process.env.TOKEN_REGISTRY || "";

if (!process.env.VERCEL) {
  app.use(express.static(join(process.cwd(), "dist")));
}

const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const queryToken = req.query.token as string;

  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : "";
  const incomingToken = tokenFromHeader || queryToken;

  if (!incomingToken || incomingToken !== SECRET_TOKEN) {
    res
      .status(401)
      .json({ error: "Unauthorized: Token not available or wrong" });
    return;
  }

  next();
};

app.get(
  "/api/registry/:component",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { component } = req.params;

      const filePath = join(
        process.cwd(),
        "dist-registry",
        `${component}.json`
      );
      const fileContent = await readFile(filePath, "utf8");

      res.setHeader("Content-Type", "application/json");
      res.status(200).send(fileContent);
    } catch (error) {
      console.error("Registry file error:", error);
      res.status(404).json({ error: "Component registry not found" });
    }
  }
);

app.post(
  "/api/trigger-token",
  async (req: Request, res: Response): Promise<void> => {
    const taskId = (req.query.task as string) || "extract-node-task";
    const allowedTasks = [
      "extract-node-task",
      "transform-node-task",
      "load-node-task",
      "workflow-execution",
    ];

    if (!allowedTasks.includes(taskId)) {
      res.status(400).json({ error: "Unknown task identifier" });
      return;
    }

    try {
      const publicAccessToken = await auth.createTriggerPublicToken(taskId, {
        multipleUse: true,
      });
      res.status(200).json({ publicAccessToken });
    } catch (error) {
      console.error("Trigger token generation error:", error);
      res.status(500).json({ error: "Failed to generate trigger token" });
    }
  }
);

app.get(
  "/api/run-status",
  async (req: Request, res: Response): Promise<void> => {
    const runId = req.query.runId as string;

    if (!runId || typeof runId !== "string") {
      res.status(400).json({ error: "runId query parameter is required" });
      return;
    }

    try {
      const runData = await runs.retrieve(runId);
      res.status(200).json(runData);
    } catch (error: unknown) {
      console.error("Run retrieve error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve run";
      res.status(500).json({ error: errorMessage });
    }
  }
);

app.post(
  "/api/cancel-run",
  async (req: Request, res: Response): Promise<void> => {
    const { runId } = req.body || {};

    if (!runId || typeof runId !== "string") {
      res.status(400).json({ error: "runId is required and must be a string" });
      return;
    }

    try {
      await runs.cancel(runId);
      res
        .status(200)
        .json({ success: true, message: `Run ${runId} cancelled` });
    } catch (error: unknown) {
      console.error("Run cancellation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel run";
      res.status(500).json({ error: errorMessage });
    }
  }
);

app.get(/.*$/, (_: Request, res: Response): void => {
  try {
    res.sendFile(join(process.cwd(), "dist", "index.html"));
  } catch (error) {
    console.log(error);
    res.status(500).send("Frontend assets not available.");
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(
      `🚀 [LOCAL MODE] Private Static Registry running at http://localhost:${PORT}`
    );
  });
}

export default app;
