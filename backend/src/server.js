import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import RFPRouter from "./routes/rfp.routes";
import VendorRouter from "./routes/vendor.routes";
import ProposalRouter from "./routes/proposal.route";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const server = createServer();

//Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.use("/api/rfps", RFPRouter);
app.use("/api/vendors", VendorRouter);
app.use("/api/proposals", ProposalRouter);

const port = process.env.PORT || 5500;

server.listen(port, () => console.log(`Server up and running on ${port}`));
