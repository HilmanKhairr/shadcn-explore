import { execSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const TARGET_URL = process.env.BASE_URL || "";
const TOKEN_REGISTRY = process.env.TOKEN_REGISTRY || "";

console.log("Building shadcn registry...");

execSync("bunx --bun shadcn@latest build --output dist-registry", {
  stdio: "inherit",
  env: {
    ...process.env,
  },
});

const distPath = path.join(__dirname, "..", "dist-registry");

if (fs.existsSync(distPath)) {
  const files = fs.readdirSync(distPath);

  files.forEach((file) => {
    if (file.endsWith(".json")) {
      const filePath = path.join(distPath, file);
      let content = fs.readFileSync(filePath, "utf8");

      if (content.includes("$BASE_URL")) {
        content = content.replaceAll("$BASE_URL", TARGET_URL);
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ Variable BASE_URL injected into ${file}`);
      }

      if (content.includes("$TOKEN_REGISTRY")) {
        content = content.replaceAll("$TOKEN_REGISTRY", TOKEN_REGISTRY);
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ Variable TOKEN_REGISTRY injected into ${file}`);
      }
    }
  });
}