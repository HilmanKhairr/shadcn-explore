import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import type { Registry, RegistryItem } from "shadcn/schema";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_TOKEN = process.env.TOKEN_REGISTRY || "";

app.get("/api/registry/:name", async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || authHeader !== `Bearer ${SECRET_TOKEN}`) {
    res.status(401).json({ error: "Unauthorized: token not available or wrong!" });
    return;
  }

  try {
    const registryPath = path.join(__dirname, "registry.json");
    const registryData: Registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    const componentName = req.params.name;

    if (componentName) {
      const component = registryData.items?.find((item: RegistryItem) => item.name === componentName);

      if (!component) {
        res.status(404).json({ error: `Component ${componentName} not found` });
        return;
      }

      if (component.files && component.files.length > 0) {
        component.files = component.files.map((file) => {
          const targetFilePath = path.join(__dirname, file.path);

          if (fs.existsSync(targetFilePath)) {
            const fileContent = fs.readFileSync(targetFilePath, "utf8");
            return {
              ...file,
              content: fileContent,
            };
          }
          return file;
        });
      }

      res.json(component);
      return;
    }

    res.json(registryData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: `Failed to load registry component: ${errorMessage}` });
  }
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*any", (_, res: Response): void => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Project shadcn-explore running on port ${PORT}`);
});