import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const ReceiptGenerator = ({ deal }) => {
  const generateReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bolt Visa Express - Receipt Voucher</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
          
          body { 
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          
          .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
          }
          
          .logo {
            width: 100px;
            height: 100px;
            margin-right: 20px;
          }
          
          .company-name {
            font-size: 24px;
            font-weight: bold;
          }
          
          .company-name-arabic {
            font-family: 'Amiri', serif;
            font-size: 20px;
            margin-top: 5px;
          }
          
          .address {
            text-align: center;
            margin: 20px 0;
            font-size: 14px;
          }
          
          .contact-info {
            text-align: center;
            margin: 10px 0;
            font-size: 14px;
          }
          
          .receipt-title {
            text-align: center;
            margin: 20px 0;
            font-size: 24px;
            font-weight: bold;
          }
          
          .receipt-title-arabic {
            font-family: 'Amiri', serif;
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
          }
          
          .payment-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }
          
          .payment-method {
            margin: 20px 0;
          }
          
          .checkbox-group {
            display: flex;
            gap: 20px;
          }
          
          .agreement {
            margin-top: 30px;
            border-top: 1px solid #000;
            padding-top: 20px;
          }
          
          .agreement-content {
            font-size: 12px;
            line-height: 1.5;
          }
          
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
          }
          
          .signature-line {
            width: 200px;
            text-align: center;
          }
          
          .footer {
            margin-top: 30px;
            text-align: center;
            font-style: italic;
            background: #000;
            color: white;
            padding: 20px;
          }

          @media print {
            body { background: white; }
            .receipt-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="logo-section">
              <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/df2fcca4-4119-4901-b0e9-3709f827b0da/142a9efef25160c783e4a0f352f230c1.png" alt="Bolt Visa Express Logo" class="logo">
              <div>
                <div class="company-name">BOLT TSHREH FOR DOCUMENTS CLEARING SERVICES CO.</div>
                <div class="company-name-arabic">بولت تشريح للمستندات شركة خدمات التخليص</div>
              </div>
            </div>
          </div>

          <div class="address">
            Address: Deira, Al Naboodah Building - Bolt Visa Express, Office 205 - Al Baraha - Dubai - United Arab Emirates
          </div>

          <div class="contact-info">
            Mob: +971 56 754 31741 Email: info@boltvisaexpress.ae | Email: boltvisaexpress@gmail.com | Website: www.boltvisaexpress.ae/
          </div>

          <div class="payment-details">
            <div>
              <strong>Dhs. درهم</strong>
              <div>${deal?.payment.currency === 'AED' ? deal?.payment.paidAmount : ''}</div>
            </div>
            <div>
              <strong>Fils. فلس</strong>
              <div></div>
            </div>
          </div>

          <div class="receipt-title">RECEIPT VOUCHER</div>
          <div class="receipt-title-arabic">سند قبض</div>

          <div>
            <strong>No.</strong> ${deal.caseId}
            <strong style="margin-left: 40px;">Date</strong> ${new Date().toLocaleDateString()}
          </div>

          <div style="margin: 20px 0;">
            <strong>Received From Mr. / M/S:</strong> ${deal.createdBy.fullName} 
          </div>

          <div style="margin: 20px 0;">
            <strong>The Sum of Dhs:</strong> ${parseFloat(deal?.payment.paidAmount).toLocaleString()} ${deal?.payment.currency}
          </div>

          <div class="payment-method">
            <div class="checkbox-group">
              <label>
                <input type="checkbox" ${deal.payment.ReceiptGenerator === 'online' ? 'checked' : ''} /> Online
              </label>
              <label>
                <input type="checkbox" ${deal.payment.ReceiptGenerator === 'cash' ? 'checked' : ''} /> Cash
              </label>
              <label>
                <input type="checkbox" ${deal.payment.ReceiptGenerator === 'payment_link' ? 'checked' : ''} /> Payment Link
              </label>
              <label>
                <input type="checkbox" ${deal.payment.ReceiptGenerator === 'western_union' ? 'checked' : ''} /> Western Union
              </label>
            </div>
          </div>

          <div style="margin: 20px 0;">
            <strong>Being:</strong> Visa Processing Services
          </div>

          <div class="signatures">
            <div class="signature-line">
              <div>Client Sign</div>
              <div style="margin-top: 40px;">_________________</div>
            </div>
            <div class="signature-line">
              <div>Receiver Sign</div>
              <div style="margin-top: 40px;">_________________</div>
            </div>
          </div>

          <div class="agreement">
            <h3>Agreement</h3>
            <div class="agreement-content">
              <p>This agreement is made at Dubai U.A.E. on _______ among:-</p>
              <p><strong>Party NO: 1</strong> BOLT TSHREH FOR DOCUMENTS CLEARING SERVICES CO.</p>
              <p>And</p>
              <p><strong>Party NO: 2</strong> ${deal.clientInfo[0].firstName} ${deal.clientInfo[0].lastName}</p>
              <p><strong>Nationality:</strong> ${deal?.clientInfo[0].nationality} <strong>Apply Location:</strong> ${deal.applyFrom} <strong>Passport Number:</strong> ${deal?.clientInfo[0].passportNumber} <strong>Mobile Number:</strong> ${deal.clientInfo[0].phoneNumber}</p>
              
              <ul>
                <li>Making file of ___________________________</li>
                <li>Consultancy Charges</li>
              </ul>

              <p>A- Above Services we will be provided in AED ${parseFloat(deal?.payment.totalAmount).toLocaleString()} and it be taken as under:</p>
              <ol>
                <li>Applying for making case creation</li>
                <li>2nd Installment to be paid at the time of the file collection.</li>
              </ol>

              <p>Above payment has been made by the above-mentioned Party no: 2 to the Party No: 1 for the above written services and the overall payment will be given in 1 installment.</p>
            </div>
          </div>

          <div class="footer">
            Thank you for choosing Bolt Visa Express
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
  };

  return (
    <Button
      onClick={generateReceipt}
      variant="outline"
      size="sm"
      className="border-purple-500/20 text-white hover:bg-purple-500/10"
    >
      <FileText className="h-4 w-4 mr-1" />
      Generate Receipt
    </Button>
  );
};

export default ReceiptGenerator;