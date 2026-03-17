import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { syncInstagramPostsToSupabase } from "../instagram/syncInstagramPostsToSupabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const run = async () => {
  const startedAt = Date.now();
  const result = await syncInstagramPostsToSupabase({ limit: 9 });
  const durationMs = Date.now() - startedAt;

  console.info(
    JSON.stringify({
      event: "instagram_sync_completed",
      at: new Date().toISOString(),
      fetched: result.fetched,
      upserted: result.upserted,
      upsertMode: result.upsertMode,
      durationMs,
    })
  );
};

run().catch((error) => {
  console.error(
    JSON.stringify({
      event: "instagram_sync_failed",
      at: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    })
  );
  process.exitCode = 1;
});
