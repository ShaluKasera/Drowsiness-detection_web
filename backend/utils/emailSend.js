const transporter = require("./emailConfig");

const sendForgotPasswordMail = async (email, resetToken) => {
  try {
    const resetLink = `https://drowsiness-detection-web.vercel.app//passwordReset/${resetToken}`;

    // ✅ Ensure transporter is used correctly
    const response = await transporter.sendMail({
      from: '"Support Team" <your-email@example.com>',
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
            <h2 style="color: #1E90FF; text-align: center;">Reset Your Password</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${resetLink}" 
                   style="background-color: #007BFF; color: white; padding: 10px 20px; 
                          text-decoration: none; font-size: 16px; border-radius: 5px;">
                   Reset Password
                </a>
            </div>
            <p>If you did not request this, you can safely ignore this email.</p>
            <p>Best Regards,</p>
            <p><strong>Support Team</strong></p>
        </div>
      `,
    });

    console.log(
      ` Password reset email sent to ${email}. Message ID: ${response.messageId}`
    );
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

const sendNewSignupUserDetailsToAdmin = async (name, email, role) => {
  try {
    const response = await transporter.sendMail({
      from: '"Support Team" <your-email@example.com>',
      to: "admin@example.com", 
      subject: "New User Signup Request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
            <h2 style="color: #1E90FF; text-align: center;">New User Signup Request</h2>
            <p>Hello Admin,</p>
            <p>A new user has signed up and is awaiting approval. Here are the details:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Role:</strong> ${role}</li>
            </ul>
            <p>Please review and approve the user if necessary.</p>
            <p>Best Regards,</p>
            <p><strong>Support Team</strong></p>
        </div>
      `,
    });

    console.log(`Signup request email sent to admin. Message ID: ${response.messageId}`);
    return true;
  } catch (error) {
    console.error("Error sending signup request email:", error);
    return false;
  }
};

const sentApprovedMailToUser = async(email, name) => {
  try {
    const link = `https://drowsiness-detection-web.vercel.app/`
    const response = await transporter.sendMail({
      from: '"Support Team" <your-email@example.com>',
      to: email, 
      subject: "Your Account Has Been Approved",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
            <h2 style="color: #1E90FF; text-align: center;">Account Approved</h2>
            <p>Hello ${name},</p>
            <p>We are pleased to inform you that your account has been approved by the admin. You can now log in and start using our services.</p>
            <p>Click the link below to log in:</p>
            <p style="text-align: center;">
                <a href= ${link} 
                   style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #1E90FF; text-decoration: none; border-radius: 5px;">
                   Login to Your Account
                </a>
            </p>
            <p>If you did not sign up for this account, please ignore this email.</p>
            <p>Best Regards,</p>
            <p><strong>Support Team</strong></p>
        </div>
      `,
    });

    console.log(`Approval email sent to user. Message ID: ${response.messageId}`);
    return true;
  } catch (error) {
    console.error("Error sending approval email:", error);
    return false;
  }
}

module.exports = {
  sendForgotPasswordMail,
  sendNewSignupUserDetailsToAdmin,
  sentApprovedMailToUser
};
