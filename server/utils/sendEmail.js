const nodemailer = require("nodemailer");

async function sendEmail(toEmail, subject, htmlBody) 
{
    try 
    {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
            port: 587, // Use 587 for TLS
            secure: false, // Must be false for port 587
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: toEmail,
            subject: subject,
            html: htmlBody,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
        return info.response;
    } 
    catch (error) 
    {
        console.error("❌ Error sending email:", error);
        throw new Error("Email sending failed");
    }
}

module.exports = sendEmail;
