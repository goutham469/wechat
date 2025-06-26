require("dotenv").config()
const { FORNTEND_URL } = process.env;

function register_template(username, email, name, password) {
    return `
<!DOCTYPE html>
<html lang="en" style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0; margin: 0;">
<head>
  <meta charset="UTF-8">
  <title>Welcome to weChat</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table align="center" width="100%" style="max-width: 600px; background-color: #ffffff; margin: 20px auto; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="background-color: #4A90E2; padding: 20px; text-align: center; color: white;">
        <h1>Welcome to <strong>weChat</strong>!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; color: #333333;">
        <h2>Hello ${name},</h2>
        <p>Thank you for joining <strong>weChat</strong> – your new favorite real-time chat application 🚀</p>
        <p>Here are your login credentials:</p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Username:</strong> ${username}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Temporary Password:</strong> <span style="color: #d9534f;">${password}</span></li>
        </ul>
        <p>🔒 We recommend you <strong>change your password</strong> after your first login to keep your account secure.</p>
        <p>To get started, click the button below:</p>
        <p style="text-align: center;">
          <a href="${FORNTEND_URL}/login" target="_blank" style="background-color: #4A90E2; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block;">Login Now</a>
        </p>
        <p>If you didn’t sign up for weChat, you can ignore this email.</p>
        <p>Happy chatting!<br>The weChat Team</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #888888;">
        © ${new Date().getFullYear()} weChat Inc. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
    `;
}


module.exports = register_template;