import { auth } from "@trigger.dev/sdk";
import { config } from "dotenv";

config();

async function run() {
  console.log("TRIGGER_SECRET_KEY:", process.env.TRIGGER_SECRET_KEY ? process.env.TRIGGER_SECRET_KEY.slice(0, 10) + "..." : "Missing");
  try {
    const token = await auth.createTriggerPublicToken("workflow-execution", {
      multipleUse: true,
    });
    console.log("\nGenerated Token:\n", token);
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      console.log("\nDecoded Payload:\n", JSON.stringify(payload, null, 2));
    }
  } catch (err) {
    console.error("Error generating token:", err);
  }
}

run();
