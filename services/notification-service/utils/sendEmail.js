import transporter from "../config/emailConfig.js";
import dotenv from "dotenv";
import loadTemplate from "../utils/loadTemplate.js";
dotenv.config();

async function sendEmail({ to, subject, template, variables, text }) {
  const html = loadTemplate(template, variables);

  return transporter.sendMail({
    from: `"E-Commerce" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: text || "This is the plain text version",
    html,
  });
}

export default sendEmail;
