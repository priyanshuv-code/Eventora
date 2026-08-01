const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("SMTP Server Ready");
  }
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const mailOptions = {
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for the event <strong>${eventTitle}</strong> has been successfully confirmed.</p>
                <p>Thank you for choosing <strong>Eventora</strong>.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Booking confirmation email sent to:", userEmail);
    } catch (error) {
        console.error("Error sending booking email:", error);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const subject =
            type === "account_verification"
                ? "Verify your Eventora Account"
                : "Eventora Booking Verification";

        const message =
            type === "account_verification"
                ? "Please use the following OTP to verify your Eventora account."
                : "Please use the following OTP to confirm your event booking.";

        const mailOptions = {
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
                    <h2>${subject}</h2>
                    <p>${message}</p>

                    <div style="
                        display:inline-block;
                        padding:15px 25px;
                        font-size:28px;
                        font-weight:bold;
                        background:#f5f5f5;
                        border-radius:8px;
                        letter-spacing:6px;
                        margin:20px 0;
                    ">
                        ${otp}
                    </div>

                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${userEmail}`);
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
};

module.exports = {
    sendBookingEmail,
    sendOTPEmail,
};