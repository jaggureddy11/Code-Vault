import { onRequest } from "firebase-functions/v2/https";
import app from "./app.js";

// Export the HTTPS trigger
export const api = onRequest({
  cors: true,
  maxInstances: 10,
}, app);
