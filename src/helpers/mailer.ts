import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    //create a hashed token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    //create a transporter
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: "cezayir_07@hotmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your mail" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">Here</a> to ${
        emailType === "VERIFY" ? "Verify your mail" : "Reset your password"
      }  or copy paste link the below in your browser <br/> ${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}</p>`,
    };
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
