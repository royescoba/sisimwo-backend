// Uses Brevo HTTP API instead of SMTP
const https = require("https");

function brevoRequest(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const options = {
      hostname: "api.brevo.com",
      path:     "/v3/smtp/email",
      method:   "POST",
      headers: {
        "Content-Type":  "application/json",
        "api-key":       process.env.BREVO_API_KEY,
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Brevo API error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Order confirmation → customer ────────────────────────────
async function sendOrderConfirmation(order) {
  const rows = order.items
    .map(i => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${i.qty}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">KSh ${(i.price * i.qty).toLocaleString()}</td>
      </tr>`)
    .join("");

  await brevoRequest({
    sender:  { name: "Sisimwo Estate", email: process.env.SMTP_USER },
    to:      [{ email: order.customerEmail, name: order.customerName }],
    subject: `Your Sisimwo Estate Order – #${order._id}`,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#1E4228;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:400;">Sisimwo Estate</h1>
          <p style="color:rgba(255,255,255,.6);margin:4px 0 0;font-size:13px;">Mt. Elgon, Kenya</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1E4228;font-weight:400;">Thank you, ${order.customerName}!</h2>
          <p style="color:#555;line-height:1.6;">Your order has been received and is being processed. We'll be in touch to confirm delivery.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:20px;">
            <thead>
              <tr style="background:#f5f5f0;">
                <th style="padding:10px 12px;text-align:left;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#888;">Product</th>
                <th style="padding:10px 12px;text-align:center;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#888;">Qty</th>
                <th style="padding:10px 12px;text-align:right;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#888;">Amount</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;font-weight:600;color:#1E4228;">Total</td>
                <td style="padding:12px;text-align:right;font-weight:700;font-size:18px;color:#1E4228;">KSh ${order.total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          <p style="margin-top:24px;color:#888;font-size:13px;">Questions? Reply to this email or WhatsApp us at +254 700 000 000.</p>
        </div>
      </div>`,
  });
}

// ── New order alert → admin ───────────────────────────────────
async function sendAdminOrderAlert(order) {
  const itemSummary = order.items.map(i => `${i.name} × ${i.qty}`).join(", ");

  await brevoRequest({
    sender:  { name: "Sisimwo Estate", email: process.env.SMTP_USER },
    to:      [{ email: process.env.ADMIN_EMAIL }],
    subject: `New Order – KSh ${order.total.toLocaleString()} from ${order.customerName}`,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;">
        <h3 style="color:#1E4228;">New order received</h3>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Phone:</strong> ${order.customerPhone || "—"}</p>
        <p><strong>Items:</strong> ${itemSummary}</p>
        <p><strong>Total:</strong> KSh ${order.total.toLocaleString()}</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
      </div>`,
  });
}

// ── New comment alert → admin ─────────────────────────────────
async function sendCommentNotification(comment) {
  await brevoRequest({
    sender:  { name: "Sisimwo Estate", email: process.env.SMTP_USER },
    to:      [{ email: process.env.ADMIN_EMAIL }],
    subject: `New Review from ${comment.name}`,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;">
        <h3 style="color:#1E4228;">New review posted on the website</h3>
        <p><strong>From:</strong> ${comment.name}</p>
        <blockquote style="border-left:4px solid #1E4228;padding-left:16px;color:#555;">${comment.text}</blockquote>
      </div>`,
  });
}

module.exports = {
  sendOrderConfirmation,
  sendAdminOrderAlert,
  sendCommentNotification,
};