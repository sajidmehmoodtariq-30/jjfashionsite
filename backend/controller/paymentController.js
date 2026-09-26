const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const checkout = async (req, res) => {
    try {
        const { amount, userId, productDetails, userDetails } = req.body;
        
        let productInfo = typeof productDetails === 'string' ? JSON.parse(productDetails) : productDetails;
        let userData = typeof userDetails === 'string' ? JSON.parse(userDetails) : userDetails;
        let totalAmount = Number(amount);

        const orderId = `COD_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

        // Create COD order in database
        const newOrder = await Payment.create({
            orderId: orderId,
            paymentMethod: 'COD',
            paymentStatus: 'Pending',
            user: userId,
            productData: productInfo,
            userData: userData,
            totalAmount: totalAmount
        });

        // Delete user's cart items
        if (userId) {
            await Cart.deleteMany({ user: userId });
        }

        // Send order confirmation email if EMAIL settings are present
        if (process.env.EMAIL && process.env.EMAIL_PASSWORD && userData.userEmail) {
            try {
                const transport = nodemailer.createTransport({
                    service: "gmail",
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: userData.userEmail,
                    subject: `Order Confirmation - ${orderId}`,
                    html: `<!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="UTF-8">
                        <title>Order Confirmation (COD)</title>
                        <style>
                          body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333; }
                          h1 { font-size: 24px; color: #1976d2; }
                          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                          th { text-align: left; padding: 10px; background-color: #eee; }
                          td { padding: 10px; border: 1px solid #ddd; }
                          .address { margin-bottom: 20px; }
                        </style>
                      </head>
                      <body>
                        <h1>Order Confirmation (Cash on Delivery)</h1>
                        <p>Dear <b>${userData.firstName} ${userData.lastName}</b>,</p>
                        <p>Thank you for your order! Your order has been placed successfully using <b>Cash on Delivery (COD)</b>. Total amount to be paid on delivery: <b>₹${totalAmount}</b>.</p>
                        <p><b>Order ID:</b> ${orderId}</p>
                        <table>
                          <thead>
                            <tr>
                              <th>Product Name</th>
                              <th>Quantity</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${productInfo.map((product) => `
                              <tr>
                                <td>${product.productId ? product.productId.name : 'Product'}</td>
                                <td>${product.quantity}</td>
                                <td>₹${product.productId ? product.productId.price : ''}</td>
                              </tr>
                            `).join('')}
                            <tr>
                              <td colspan="2"><b>Total Amount</b></td>
                              <td><b>₹${totalAmount}</b></td>
                            </tr>
                          </tbody>
                        </table>
                        <div class="address">
                          <h2>Shipping Address</h2>
                          <p>${userData.firstName} ${userData.lastName}</p>
                          <p>${userData.address}</p>
                          <p>${userData.city} - ${userData.zipCode}</p>
                          <p>${userData.userState}</p>
                        </div>
                        <p>If you have any questions, feel free to contact us.</p>
                      </body>
                    </html>`
                };

                transport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Email sending error:", error);
                    } else {
                        console.log("Order confirmation email sent:", info.response);
                    }
                });
            } catch (emailErr) {
                console.log("Email transport error:", emailErr);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Order placed successfully with Cash on Delivery",
            orderId: orderId,
            order: {
                id: orderId,
                amount: totalAmount,
                paymentMethod: 'COD'
            }
        });

    } catch (error) {
        console.log("Checkout Error:", error);
        return res.status(500).json({ success: false, message: "Order placement failed", error: error.message });
    }
};

const paymentVerification = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Cash on Delivery order confirmed"
    });
};

module.exports = { checkout, paymentVerification };