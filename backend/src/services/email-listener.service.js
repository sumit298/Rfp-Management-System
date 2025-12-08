import Imap from 'imap';
import { simpleParser } from "mailparser";
import Proposal from '../models/proposal.model.js';
import Vendor from '../models/vendor.model.js'
import {parseVendorProposal} from './ai.service.js';
import Rfp from '../models/rfp.models.js';

let isListening = false;

export const startEmailListener = ()=> {
    if(isListening){
        console.log('📧 Email listener is already running.');
        return;
    }


    const imap = new Imap({
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        connTimeout: 10000,  // Add this
  authTimeout: 5000,   // Add this
  keepalive: false,    // Add this
    });
    

    const openInbox = (callback) => {
        imap.openBox('INBOX', false, callback);
    } 

    imap.once("ready", ()=> {
        console.log("Email listener connected");
        isListening = true;
        openInbox((err, box)=> {
            if(err) throw err;
            console.log("Monitoring index for vendor proposals...")

            imap.on("mail", ()=> {
                console.log("New Email Received.")
                fetchLatestEmail();
            })
        })
    })

    imap.once("error", (err) => {
        console.error("IMAP Error", err.message);
        isListening = false;
    })

    imap.once("end", () => {
        console.log("IMAP Connection ended");
        isListening = false;
    })

    const fetchLatestEmail = ()=> {
        imap.search(["UNSEEN"], (err, results)=> {
            if(err || !results || results.length === 0) return;

            const fetch = imap.fetch(results, { bodies: "" });

            fetch.on("message", (msg)=> {
                msg.on("body", (stream) => {
                    simpleParser(stream, async (err, parsed)=> {
                        if(err){
                            console.error("Error parsing email:", err.message);
                            return;
                        }
                        try {
                            await processVendorEmail(parsed);
                        } catch (error) {
                            console.error("Error processing email:", error.message);
                        }
                    })
                })
            })
            fetch.once("end", ()=> {
                console.log("Done fetching all messages!");
            })
        })
    }
    imap.connect();
}

const processVendorEmail = async (email) => {
  try {
    console.log("Processing email from:", email.from.text);
    console.log("Subject:", email.subject);

    // Extract RFP ID from subject or body
    const rfpIdMatch =
      email.subject?.match(/RFP ID: ([a-f0-9]{24})/i) ||
      email.text?.match(/RFP ID: ([a-f0-9]{24})/i);

    if (!rfpIdMatch) {
      console.log(" No RFP ID found in email, skipping...");
      return;
    }

    const rfpId = rfpIdMatch[1];
    console.log("Found RFP ID:", rfpId);

    // Check if RFP exists
    const rfp = await Rfp.findById(rfpId);
    if (!rfp) {
      console.log("RFP not found:", rfpId);
      return;
    }

    // Find vendor by email
    const vendorEmail = email.from.value[0].address;
    let vendor = await Vendor.findOne({ email: vendorEmail });

    if (!vendor) {
      console.log("Vendor not found, creating new vendor...");
      vendor = await Vendor.create({
        name: email.from.value[0].name || vendorEmail.split("@")[0],
        email: vendorEmail,
        company: email.from.value[0].name || "Unknown Company",
      });
    }

    // Check if proposal already exists
    const existingProposal = await Proposal.findOne({
      rfpId,
      vendorId: vendor._id,
    });

    if (existingProposal) {
      console.log("Proposal already exists for this vendor and RFP");
      return;
    }

    // Parse email content with AI
    const emailContent = email.text || email.html?.replace(/<[^>]*>/g, "");
    console.log("🤖 Parsing proposal with AI...");

    const parsedProposal = await parseVendorProposal(
      emailContent,
      rfp.requirements
    );

    // Create proposal
    const proposal = await Proposal.create({
      rfpId,
      vendorId: vendor._id,
      ...parsedProposal,
      rawEmail: emailContent,
      status: "received",
      receivedAt: new Date(),
    });

    console.log("Proposal created successfully!");
    console.log("Total Cost:", proposal.pricing.totalCost);
    console.log("Delivery:", proposal.terms.deliveryDays, "days\n");
  } catch (error) {
    console.error("Error processing vendor email:", error.message);
  }
};

export const stopEmailListener = () => {
  isListening = false;
  console.log("Email listener stopped");
};
