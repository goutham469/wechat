function login_verification_template(email, secret) {
    return `
<!DOCTYPE html>
<html lang="en" style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0; margin: 0;">
<head>
  <meta charset="UTF-8">
  <title>Login Activity Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table align="center" width="100%" style="max-width: 600px; background-color: #ffffff; margin: 20px auto; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="background-color: #f39c12; padding: 20px; text-align: center; color: white;">
        <h1>Login Activity Detected</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; color: #333333;">
        <p>Hi there,</p>
        <p>We noticed a login attempt on your <strong>weChat</strong> account associated with:</p>
        <p style="margin-left: 15px;"><strong>Email:</strong> ${email}</p>
        <p>To proceed with login, please enter the secret code below:</p>
        <p style="text-align: center; margin: 30px 0;">
          <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #e74c3c;">${secret}</span>
        </p>
        <p>If this was <strong>not you</strong>, you can safely ignore this message. No further action is needed.</p>
        <p>For your security, this code will expire shortly.</p>
        <p>Thanks,<br>The weChat Security Team</p>
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


module.exports = login_verification_template;