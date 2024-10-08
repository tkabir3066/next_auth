import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET  ") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "b17176654f1356",
        pass: "57ff30668d191d",
      },
    });

    const verifyEmail = `<p> Click<a href="${
      process.env.DOMAIN
    }/verifyemail?token=${hashedToken}">here</a> to ${
      emailType === "VERIFY" ? "verify your email" : "reset your password"
    }
          or copy and paste the link below in your browser.
          <br/> ${process.env.DOMAIN}/verifyemail?token=${hashedToken} 
          </p>`;

    const forgotPassword = `<p> Click<a href="${
      process.env.DOMAIN
    }/forgotpassword?token=${hashedToken}">here</a> to ${
      emailType === "RESET" ? "reset your password" : "verify your email"
    }
          or copy and paste the link below in your browser.
          <br/> ${process.env.DOMAIN}/forgotpassword?token=${hashedToken} 
          </p>`;
    const mailOptions = {
      from: "tkabir@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<div>
      ${verifyEmail}
      <br />

      ${forgotPassword}
      </div>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
