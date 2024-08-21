// src/utils/nodemailer.ts

// dependency modules
import nodemailer from 'nodemailer';
// self-defined modules
import invoiceUtils from './invoice';
import { ItemEventDetail, ItemProductDetail, OrderDetail} from './types';

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
  async sendNewOrderEmail(email: string, order: OrderDetail, items: (ItemEventDetail | ItemProductDetail)[]) {
    const invoiceHtml = await invoiceUtils.generateInvoiceBillHtml(order, items);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invoice Tagihan Pemesanan Logevent`,
      html: invoiceHtml
    };

    return this.sendMail(mailOptions);
  }

  // TODO: Fix Send Paid Order Email
  async sendPaidOrderEmail(email: string, order: OrderDetail, items: (ItemEventDetail | ItemProductDetail)[]) {
    const invoiceHtml = await invoiceUtils.generateInvoicePaidHtml(order, items);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invoice Pelunasan Pemesanan Logevent`,
      html: invoiceHtml
    };

    return this.sendMail(mailOptions);
  }

  // TODO: Fix Send Cancel Order Email
  async sendCancelOrderEmail(email: string, order: OrderDetail) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Pemesanan Logevent Dibatalkan`,
      text: `Pemesanan dengan ID ${order.id} telah dibatalkan.`
    };

    return this.sendMail(mailOptions);
  }
}

export default new NodemailerUtils();
