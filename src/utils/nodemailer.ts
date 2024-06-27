import nodemailer from 'nodemailer';

class NodemailerUtil {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  sendMail(mailOptions: nodemailer.SendMailOptions) {
    return this.transporter.sendMail(mailOptions);
  }

  async sendVerificationEmail(email: string, token: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Click on the link to verify your email: ${process.env.CLIENT_URL}/verify-email/${token}`,
    };

    return this.sendMail(mailOptions);
  }
}

export default new NodemailerUtil();
