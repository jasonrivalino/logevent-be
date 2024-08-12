// src/utils/invoice.ts

// dependency modules
import puppeteer from 'puppeteer';

class InvoiceUtils {
  async generateOrderInvoiceJpg(invoiceHtml: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(invoiceHtml, { waitUntil: 'networkidle0' });

    const imageBuffer = await page.screenshot({ type: 'jpeg', fullPage: true });
    await browser.close();
    
    return imageBuffer;
  }

  // TODO: Fix Generate Order Invoice HTML
  async generateOrderInvoiceHtml(invoiceData: any) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* Add your inline styles here */
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff3f3; border: 1px solid #ccc; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { padding: 8px; text-align: center; border-bottom: 1px solid #ddd; }
          .footer { text-align: center; font-size: 12px; color: #666; }
          .footer div { margin: 10px 0; }
          .footer img { width: 20px; height: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <img src="https://yourdomain.com/Image/logo2.png" alt="Logevent Logo" width="100" height="100"/>
            </div>
            <div style="text-align: right;">
              <p>Invoice No: <strong>${invoiceData.invoiceNumber}</strong></p>
              <p>Date: <strong>${invoiceData.date}</strong></p>
            </div>
          </div>
          <div>
            <p><strong>Invoice to:</strong> ${invoiceData.customerName}</p>
            <p class="text-sm">${invoiceData.customerAddress}</p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>INFO PRODUK</th>
                <th>HARGA SATUAN</th>
                <th>JUMLAH</th>
                <th>TOTAL HARGA</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map((item: any) => `
                <tr>
                  <td>${item.product} <br><span class="text-sm">${item.description}</span></td>
                  <td>Rp ${item.unitPrice.toLocaleString()}</td>
                  <td>${item.quantity}</td>
                  <td>Rp ${item.totalPrice.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div>
            <p><strong>Payment Info:</strong></p>
            <p>Account No: ${invoiceData.accountNumber}</p>
            <p>A.C Name: ${invoiceData.accountName}</p>
            <p>Bank Details: ${invoiceData.bankDetails}</p>
          </div>
          <div style="text-align: right;">
            <p>Sub Total: <strong>Rp ${invoiceData.subTotal.toLocaleString()}</strong></p>
            <p>Biaya Layanan: <strong>${invoiceData.serviceFee}%</strong></p>
            <p><strong>Total Pembayaran: Rp ${invoiceData.totalPayment.toLocaleString()}</strong></p>
          </div>
          <div class="footer">
            <div>
              <img src="https://yourdomain.com/icons/phone.png" alt="Phone"> ${invoiceData.phone}
            </div>
            <div>
              <img src="https://yourdomain.com/icons/email.png" alt="Email"> ${invoiceData.email} <br> ${invoiceData.contactEmail}
            </div>
            <div>
              <img src="https://yourdomain.com/icons/location.png" alt="Location"> ${invoiceData.address}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new InvoiceUtils();
