import * as dotenv from "dotenv";
import { startIngestion } from "./index";

dotenv.config();

startIngestion().catch((error) => {
  console.error("Failed to start atproto2elasticsearch", error);
  process.exit(1);
});
