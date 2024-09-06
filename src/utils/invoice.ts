// src/utils/invoice.ts

// self-defined modules
import { format } from 'path';
import { ItemEventDetail, ItemProductDetail, OrderDetail} from './types';

class InvoiceUtils {
  // TODO: Fix Generate Bill Invoice HTML
  async generateInvoiceBillHtml(order: OrderDetail, items: (ItemEventDetail | ItemProductDetail)[]) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>

          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(to bottom, #fbb6ce, #fef3c7);
            border: 1px solid #ccc;
            box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05);
            color: black;
            font-family: 'Sofia', sans-serif;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }

          .table th, .table td {
            padding: 8px;
            text-align: center;
            border-bottom: 1px solid #ddd;
          }

          .table-divider {
            padding: 1px !important;
            background-color: black;
          }

        </style>
      </head>
      <body>
        <div class="container">

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
            <tr>
              <td width="50%" valign="middle">
                <a href="https://www.logevent.com" target="_blank">
                  <img src="https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522722/kop8wdcpriag8h2vtwel.png" alt="Logevent Logo" width="100" height="100" />
                </a>
              </td>
              <td width="50%" align="right" valign="middle" style="text-align: right;">
                <p style="margin: 0;">Invoice No: <strong>${order.id}</strong></p>
                <p style="margin: 0;">Date: <strong>${this.convertToWIB(order.orderDate)}</strong></p>
              </td>
            </tr>
          </table>
          
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
            <tr>
              <td>
                <p style="margin: 0;"><strong>Invoice to:</strong> ${order.name}</p>
                <p style="margin: 0;">${order.address}</p>
              </td>
            </tr>
          </table>

          <table class="table">
            <thead>
              <tr>
                <td colspan="4" class="table-divider"></td>
              </tr>
              <tr>
                <th>INFO PRODUK</th>
                <th>HARGA SATUAN</th>
                <th>JUMLAH</th>
                <th>
                  TOTAL HARGA<br>
                  <small style="font-style: italic;  color: #666; font-weight: normal;">*sudah termasuk biaya layanan</small>
                </th>
              </tr>
              <tr>
                <td colspan="4" class="table-divider"></td>
              </tr>
            </thead>
            <tbody>
              ${items.map((item) => {
                if ('eventId' in item) {
                  const totalPrice = Math.ceil(
                    item.eventPrice *
                    this.calculateDaysBetweenDates(order.startDate, order.endDate) *
                    (1 + item.categoryFee / 100)
                  );

                  return `
                    <tr>
                      <td>
                        ${item.eventName}<br>
                        <small>Paket Event - ${item.categoryName}</small>
                      </td>
                      <td>Rp ${item.eventPrice.toLocaleString()}</td>
                      <td>${this.calculateDaysBetweenDates(order.startDate, order.endDate)} Hari</td>
                      <td>Rp ${totalPrice.toLocaleString()}</td>
                    </tr>
                  `;
                } else {
                  const totalPrice = item.duration !== null
                  ? Math.ceil(item.productPrice * item.duration * (1 + item.categoryFee / 100))
                  : item.quantity !== null
                  ? Math.ceil(item.productPrice * item.quantity * (1 + item.categoryFee / 100))
                  : Math.ceil(item.productPrice * this.calculateDaysBetweenDates(order.startDate, order.endDate) * (1 + item.categoryFee / 100));

                  return `
                    <tr>
                      <td>
                        ${item.productName}<br>
                        ${
                          item.productId !== 1
                            ? `<small>Logistik Vendor - ${item.categoryName}</small>`
                            : ""
                        }
                      </td>
                      <td>
                        ${
                          item.productId === 1
                            ? `Rp ${Math.ceil(order.orderTotal).toLocaleString()}`
                            : `Rp ${item.productPrice.toLocaleString()}`
                        }
                      </td>
                      <td>
                        ${
                          item.duration !== null
                            ? item.duration + " Jam"
                            : item.quantity !== null
                            ? item.quantity + " Pcs"
                            : this.calculateDaysBetweenDates(order.startDate, order.endDate) + " Hari"
                        }
                      </td>
                      <td>
                        ${
                          item.productId === 1
                            ? `Rp ${Math.ceil(order.orderTotal).toLocaleString()}`
                            : `Rp ${totalPrice.toLocaleString()}`
                        }
                      </td>
                    </tr>
                  `;
                }
              }).join('')}
              <tr>
                <td colspan="4" class="table-divider"></td>
              </tr>
            </tbody>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
            <tr>
              <td valign="top" style="width: 50%; padding-right: 10px;">
                <table>
                  <tr>
                    <td style="margin: 0;"><strong>Payment Info</strong></td>
                  </tr>
                  <tr>
                    <td style="margin: 0;">Account No</td>
                    <td style="margin: 0;">: 102470393708</td>
                  </tr>
                  <tr>
                    <td style="margin: 0;">A.C Name</td>
                    <td style="margin: 0;">: Satria Octavianus Nababan</td>
                  </tr>
                  <tr>
                    <td style="margin: 0;">Bank Details</td>
                    <td style="margin: 0;">: Bank Jago</td>
                  </tr>
                </table>
              </td>
              
              <td valign="top" style="width: 50%; text-align: right;">
                <p style="margin: 0;"><strong>Total Pembayaran: Rp ${Math.ceil(order.orderTotal).toLocaleString()}</strong></p>
              </td>
            </tr>
          </table>

          <p style="font-style: italic; color: #666; font-size: 12px; margin-bottom: 60px;">
            Note :<br>
            Lakukan pembayaran hingga pukul ${this.formatOrderDateToWIB(order.orderDate)}, melebihi waktu tersebut pesanan Anda akan dibatalkan oleh Admin.
          </p>

          <table align="center" cellpadding="0" cellspacing="0" border="0" style="color: #666;">
            <tr>
              <td style="padding-right: 80px; text-align: center;">
                <img src="https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/uz35k05n1swrvf2be7ai.png" alt="Phone" width="10" height="10">
                <br>
                089520771715
              </td>
              <td style="padding-right: 80px; text-align: center;">
                <img src="https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/kqhe1wh6j9qj4yurv1tu.png" alt="Email" width="10" height="10">
                <br>
                logevent.eo@gmail.com
              </td>
              <td style="text-align: center;">
                <img src="https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/a63iixwusyj5habr35j9.png" alt="Location" width="7.5" height="10">
                <br>
                Jl. Ganesha No. 10
              </td>
            </tr>
          </table>

        </div>
      </body>
      </html>
    `;
  }

  // TODO: Fix Generate Paid Invoice HTML
  async generateInvoicePaidHtml(order: OrderDetail, items: (ItemEventDetail | ItemProductDetail)[]) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>

          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(to bottom, #fbb6ce, #fef3c7);
            border: 1px solid #ccc;
            box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05);
            color: black;
            font-family: 'Sofia', sans-serif;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }

          .table th, .table td {
            padding: 8px;
            text-align: center;
            border-bottom: 1px solid #ddd;
          }

          .table-divider {
            padding: 1px !important;
            background-color: black;
          }

        </style>
      </head>
      <body>
        <div class="container">

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
            <tr>
              <td width="50%" valign="middle">
                <a href="https://www.logevent.com" target="_blank">
                  <img src="https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522722/kop8wdcpriag8h2vtwel.png" alt="Logevent Logo" width="100" height="100" />
                </a>
              </td>
              <td width="50%" align="right" valign="middle" style="text-align: right;">
                <p style="margin: 0;">Invoice No: <strong>${order.id}</strong></p>
                <p style="margin: 0;">Date: <strong>${this.getCurrentWIBTime()}</strong></p>
              </td>
            </tr>
          </table>
          
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
            <tr>
              <td>
                <p style="margin: 0;"><strong>Invoice to:</strong> ${order.name}</p>
                <p style="margin: 0;">${order.address}</p>
              </td>
            </tr>
          </table>

          <table class="table">
            <thead>
              <tr>
                <td colspan="4" class="table-divider"></td>
              </tr>
              <tr>
                <th>INFO PRODUK</th>
                <th>HARGA SATUAN</th>
                <th>JUMLAH</th>
                <th>
                  TOTAL HARGA<br>
                  <small style="font-style: italic;  color: #666; font-weight: normal;">*sudah termasuk biaya layanan</small>
                </th>
              </tr>
              <tr>
                <td colspan="4" class="table-divider"></td>
              </tr>
            </thead>
            <tbody>
              ${items.map((item) => {
                if ('eventId' in item) {
                  const totalPrice = Math.ceil(
                    item.eventPrice *
                    this.calculateDaysBetweenDates(order.startDate, order.endDate) *
                    (1 + item.categoryFee / 100)
                  );

                  return `
                    <tr>
                      <td>
                        ${item.eventName}<br>
                        <small>Paket Event - ${item.categoryName}</small>
                      </td>
                      <td>Rp ${item.eventPrice.toLocaleString()}</td>
                      <td>${this.calculateDaysBetweenDates(order.startDate, order.endDate)} Hari</td>
                      <td>Rp ${totalPrice.toLocaleString()}</td>
                    </tr>
                  `;
                } else {
                  const totalPrice = item.duration !== null
                  ? Math.ceil(item.productPrice * item.duration * (1 + item.categoryFee / 100))
                  : item.quantity !== null
                  ? Math.ceil(item.productPrice * item.quantity * (1 + item.categoryFee / 100))
                  : Math.ceil(item.productPrice * this.calculateDaysBetweenDates(order.startDate, order.endDate) * (1 + item.categoryFee / 100));

                  return `
                    <tr>
                      <td>
                        ${item.productName}<br>
                        ${
                          item.productId !== 1
                            ? `<small>Logistik Vendor - ${item.categoryName}</small>`
                            : ""
                        }
                      </td>
                      <td>
                        ${
                          item.productId === 1
                            ? `Rp ${Math.ceil(order.orderTotal).toLocaleString()}`
                            : `Rp ${item.productPrice.toLocaleString()}`
                        }
                      </td>
                      <td>
                        ${
                          item.duration !== null
                            ? item.duration + " Jam"
                            : item.quantity !== null
                            ? item.quantity + " Pcs"
                            : this.calculateDaysBetweenDates(order.startDate, order.endDate) + " Hari"
                        }
                      </td>
                      <td>
                        ${
                          item.productId === 1
                            ? `Rp ${Math.ceil(order.orderTotal).toLocaleString()}`
                            : `Rp ${totalPrice.toLocaleString()}`
                        }
                      </td>
                    </tr>
                  `;
                }
              }).join('')}
              <tr>
                <td colspan="4" class="table-divider"></td>
              </tr>
            </tbody>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 80px;">
            <tr>
              <td valign="top" style="width: 50%; padding-right: 10px;">
                <img src="https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522722/ree2dp1vy5ziv6aw3vpi.png" alt="Lunas" width="152" height="100" />
              </td>
              
              <td valign="top" style="width: 50%; text-align: right;">
                <p style="margin: 0;"><strong>Total Pembayaran: Rp ${Math.ceil(order.orderTotal).toLocaleString()}</strong></p>
              </td>
            </tr>
          </table>

          <table align="center" cellpadding="0" cellspacing="0" border="0" style="color: #666;">
            <tr>
              <td style="padding-right: 40px; text-align: center;">
                <img src="https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/uz35k05n1swrvf2be7ai.png" alt="Phone" width="10" height="10">
                <br>
                089520771715
              </td>
              <td style="padding-right: 40px; text-align: center;">
                <img src="https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/kqhe1wh6j9qj4yurv1tu.png" alt="Email" width="10" height="10">
                <br>
                logevent.eo@gmail.com
              </td>
              <td style="text-align: center;">
                <img src="https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/a63iixwusyj5habr35j9.png" alt="Location" width="7.5" height="10">
                <br>
                Jl. Ganesha No. 10
              </td>
            </tr>
          </table>

        </div>
      </body>
      </html>
    `;
  }

  convertToWIB(date: Date) {
    const wibTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const month = String(wibTime.getMonth() + 1).padStart(2, '0');
    const day = String(wibTime.getDate()).padStart(2, '0');
    const year = wibTime.getFullYear();
    const hours = String(wibTime.getHours()).padStart(2, '0');
    const minutes = String(wibTime.getMinutes()).padStart(2, '0');
    return `${month}/${day}/${year}, ${hours}:${minutes} WIB`;
  }

  getCurrentWIBTime() {
    const now = new Date();
    const utcOffset = 7 * 60 * 60 * 1000;
    const wibTime = new Date(now.getTime() + utcOffset);
    
    const day = String(wibTime.getDate()).padStart(2, '0');
    const month = String(wibTime.getMonth() + 1).padStart(2, '0');
    const year = wibTime.getFullYear();
    
    const hours = String(wibTime.getHours()).padStart(2, '0');
    const minutes = String(wibTime.getMinutes()).padStart(2, '0');
    
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  formatOrderDateToWIB(orderDate: Date) {
    const utcOffset = 7 * 60 * 60 * 1000;
    const tomorrow = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);
    const wibTime = new Date(tomorrow.getTime() + utcOffset);

    const day = String(wibTime.getDate()).padStart(2, '0');
    const monthIndex = wibTime.getMonth();
    const year = wibTime.getFullYear();
    const hours = String(wibTime.getHours()).padStart(2, '0');
    const minutes = String(wibTime.getMinutes()).padStart(2, '0');

    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
  
    const monthName = months[monthIndex];
    return `${hours}.${minutes} tanggal ${day} ${monthName} ${year}`;
  }

  calculateDaysBetweenDates(startDate: Date, endDate: Date) {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return dayDiff + 1;
  }
}

export default new InvoiceUtils();
