import express from "express";
import { createServer } from "http";
import cors from "cors";
import { connectDB } from "./config/database.js";
import RFPRouter from "./routes/rfp.routes.js";
import VendorRouter from "./routes/vendor.routes.js";
import ProposalRouter from "./routes/proposal.route.js";
import { startEmailListener } from "./services/email-listener.service.js";


const app = express();

app.use(cors());
app.use(express.json());
const server = createServer(app);

// Connect to database
connectDB();

// start Email listener
startEmailListener();

//Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.use("/api/rfps", RFPRouter);
app.use("/api/vendors", VendorRouter);
app.use("/api/proposals", ProposalRouter);

const port = process.env.PORT || 5500;

server.listen(port, () => console.log(`🚀 Server up and running on ${port}`));
