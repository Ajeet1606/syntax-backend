import express, { Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes/router";
import * as bodyParser from "body-parser";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/json" }));

const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (error: Error | null, allow: boolean) => void
  ) {
    // Check if the incoming origin is in the allowed origins list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Domain unauthorized."), false);
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Syntax Anon!");
});

app.use("/api/v1", router);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
