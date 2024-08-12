// src/utils/nodemailer.ts

// dependency modules
import nodemailer from 'nodemailer';
// self-defined modules
import invoiceUtils from './invoice';

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
      text: `Click on the link to verify your email: ${process.env.REACT_APP_URL}/email-verification?token=${token}`,
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

  // TODO: Fix Send New Order Email
  async sendNewOrderEmail(email: string, invoiceData: any) {
    const invoiceHtml = await invoiceUtils.generateOrderInvoiceHtml(invoiceData);
    
    const jpgFilePath = `/tmp/invoice-${invoiceData.invoiceNumber}.jpg`;
    await invoiceUtils.generateOrderInvoiceJpg(invoiceHtml);
    const jpgAttachment = {
      filename: 'invoice.jpg',
      path: jpgFilePath,
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invoice for Order ${invoiceData.invoiceNumber}`,
      html: invoiceHtml,
      attachments: [jpgAttachment],
    };

    return this.sendMail(mailOptions);
  }
}

export default new NodemailerUtils();
