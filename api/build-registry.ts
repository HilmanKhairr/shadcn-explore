import { execSync } from "child_process";
import { config } from "dotenv";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });
const TARGET_URL = process.env.BASE_URL || "";
const TOKEN_REGISTRY = process.env.TOKEN_REGISTRY || "";

console.log("Building shadcn registry...");

execSync("bunx --bun shadcn@latest build --output dist-registry", {
  stdio: "inherit",
  env: {
    ...process.env,
  },
});

const distPath = join(__dirname, "..", "dist-registry");

if (existsSync(distPath)) {
  const files = readdirSync(distPath);

  files.forEach((file) => {
    if (file.endsWith(".json")) {
      const filePath = join(distPath, file);
      let content = readFileSync(filePath, "utf8");

      if (content.includes("$BASE_URL")) {
        content = content.replaceAll("$BASE_URL", TARGET_URL);
        writeFileSync(filePath, content, "utf8");
        console.log(`✅ Variable BASE_URL injected into ${file}`);
      }

      if (content.includes("$TOKEN_REGISTRY")) {
        content = content.replaceAll("$TOKEN_REGISTRY", TOKEN_REGISTRY);
        writeFileSync(filePath, content, "utf8");
        console.log(`✅ Variable TOKEN_REGISTRY injected into ${file}`);
      }
    }
  });
}