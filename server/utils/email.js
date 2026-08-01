const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,
});

// Verify SMTP connection when server starts
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Verify Error:", error);
    } else {
        console.log("✅ SMTP Server is ready");
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
                <p>Your booking for the event <strong>${eventTitle}</strong> has been confirmed successfully.</p>
                <p>Thank you for choosing <strong>Eventora</strong>.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Booking confirmation email sent to:", userEmail);
    } catch (error) {
        console.error("❌ Error sending booking email:", error);
        throw error;
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
                : "Please use the following OTP to verify and confirm your booking.";

        const mailOptions = {
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject,
            html: `
                <div style="font-family:Arial,sans-serif;padding:20px;text-align:center;">
                    <h2>${subject}</h2>
                    <p>${message}</p>

                    <div style="
                        display:inline-block;
                        background:#f4f4f4;
                        padding:15px 25px;
                        font-size:30px;
                        font-weight:bold;
                        letter-spacing:6px;
                        border-radius:8px;
                        margin:20px 0;
                    ">
                        ${otp}
                    </div>

                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent successfully to ${userEmail}`);
    } catch (error) {
        console.error("❌ Error sending OTP email:", error);
        throw error;
    }
};

module.exports = {
    sendBookingEmail,
    sendOTPEmail,
};