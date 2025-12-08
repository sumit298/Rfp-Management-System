import nodemailer from 'nodemailer';

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendRFPEmail = async (rfp, vendors) => {
  try {
    const transporter = getTransporter();

    console.log('\n📧 SENDING RFP EMAILS:');
    
    for (const vendor of vendors) {
      const mailOptions = {
        from: '"RFP System" <rfp@company.com>',
        to: vendor.email,
        subject: `RFP: ${rfp.title}`,
        html: `
          <h2>Request for Proposal</h2>
          <p>Dear ${vendor.name},</p>
          <p>We invite you to submit a proposal for: <strong>${rfp.title}</strong></p>
          
          <h3>Requirements:</h3>
          <ul>
            ${rfp.requirements.items.map(item => 
              `<li>${item.quantity}x ${item.name} - ${item.specs}</li>`
            ).join('')}
          </ul>
          
          <p><strong>Budget:</strong> $${rfp.requirements.budget}</p>
          <p><strong>Delivery Required:</strong> ${rfp.requirements.deliveryDays} days</p>
          <p><strong>Payment Terms:</strong> ${rfp.requirements.paymentTerms}</p>
          <p><strong>Warranty:</strong> ${rfp.requirements.warranty}</p>
          
          <p>Please reply with your proposal including pricing and terms.</p>
          <p>RFP ID: ${rfp._id}</p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${vendor.name} (${vendor.email})`);
    }
    
    console.log('✅ All RFP emails sent successfully\n');
  } catch (error) {
    console.error('Email sending failed:', error.message);
    throw error;
  }
};