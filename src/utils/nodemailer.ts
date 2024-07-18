import nodemailer from 'nodemailer';

class NodemailerUtils {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendMail(mailOptions: nodemailer.SendMailOptions) {
    return this.transporter.sendMail(mailOptions);
  }

  async sendVerificationEmail(email: string, token: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Click on the link to verify your email: ${process.env.REACT_APP_URL}/verify-email?token=${token}`,
    };

    return this.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your password',
      text: `Click on the link to reset your password: ${process.env.REACT_APP_URL}/reset-password?token=${token}`,
    };

    return this.sendMail(mailOptions);
  }

  async sendOrderConfirmationEmail(email: string, orderId: number, token: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order confirmation',
      text: `Your order with id ${orderId} has been confirmed. Click on the link to view your order: ${process.env.REACT_APP_URL}/order/${orderId}?token=${token}`,
    };

    return this.sendMail(mailOptions);
  }
}

export default new NodemailerUtils();
