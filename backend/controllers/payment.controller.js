import { razorpay } from "../lib/razorpay.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // razorpay expects amount in paise
      totalAmount += amount * product.quantity;

      return {
        name: product.name,
        image: product.image,
        price: amount,
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const options = {
      amount: totalAmount,
      currency: "INR",
      payment_capture: 1,
      receipt: `receipt#${Math.random() * 1000}`,
      notes: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    };

    const order = await razorpay.orders.create(options);

    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({ id: order.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.log("Error in createCheckoutSession controller", error);
    res
      .status(500)
      .json({ message: "Error Processing checkout", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;
    const orderDetails = await razorpay.orders.fetch(orderId);

    if (orderDetails.status === "Paid") {
      if (orderDetails.notes.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: orderDetails.notes.couponCode,
            userId: orderDetails.notes.userId,
          },
          { isActive: false }
        );
      }

      const products = JSON.parse(orderDetails.notes.products);
      const newOrder = new Order({
        user: orderDetails.notes.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: orderDetails.amount / 100, // convert from paise to rupees
        razorpayOrderId: orderId,
        paymentId,
      });

      await newOrder.save();

      res
        .status(200)
        .json({
          success: true,
          message:
            "Payment successful, order created, and coupon deactivated if used.",
          orderId: newOrder._id,
        });
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res
      .status(500)
      .json({
        message: "Error processing successful checkout",
        error: error.message,
      });
  }
};

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity for coupon
    userId,
  });

  await newCoupon.save();

  return newCoupon;
}
