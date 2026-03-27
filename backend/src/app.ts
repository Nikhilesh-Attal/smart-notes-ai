import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import storeDocumentRouter from "./routers/storeDocumentRoutes";
import queryDocumentRouter from "./routers/queryDocumentRoutes";
import uploadDocumentRouter from "./routers/uploadDocumentRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

const envAllowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
  
const allowedOrigins = new Set([...defaultAllowedOrigins, ...envAllowedOrigins]);

const isAllowedOrigin = (origin: string): boolean => {
  if (allowedOrigins.has(origin)) return true;

  try {
    const parsed = new URL(origin);
    const isLocalHost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    return isLocalHost && Boolean(parsed.port);
  } catch {
    return false;
  }
};

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed for origin: " + origin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use('/store-document', storeDocumentRouter);
app.use('/query-document', queryDocumentRouter);
app.use('/upload-document', uploadDocumentRouter);

console.log("App.tsx file running");

export default app;