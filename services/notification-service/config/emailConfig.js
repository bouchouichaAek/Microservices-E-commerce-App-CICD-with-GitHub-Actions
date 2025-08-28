import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // أو أي SMTP آخر
  port: 587,
  secure: false, // true إذا كان المنفذ 465
  auth: {
    user: process.env.EMAIL_USER, // الإيميل
    pass: process.env.EMAIL_PASS, // كلمة المرور أو App Password
  },
});

export default transporter;
