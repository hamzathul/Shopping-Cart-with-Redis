import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";

const OrderSummary = () => {
  const navigate = useNavigate();

  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    const res = await axios.post("/payments/create-checkout-session", {
      products: cart,
      coupon: coupon ? coupon.code : null,
    });

    const session = res.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: session.totalAmount,
      currency: "INR",
      name: "Acme Corp", // your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: session.id,
      // callback_url: `http://localhost:5173/purchase-success?session_id=${session.id}`,
      // callback_url: `${window.location.origin}/payment-success`,
      // redirect: true,
      prefill: {
        name: "Hamzathul Favas E", // customer's name
        email: "ehamzathulfavas@gmail.com",
        contact: "9048787719", // customer's phone number
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      handler: function (response) {
        // This function is triggered on successful payment
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
          response;

        navigate(`/purchase-success`, {
          state: {
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            signature: razorpay_signature,
          },
        });
      },
    };

    const rzp1 = new window.Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      navigate("/purchase-cancel");
    });

    rzp1.open();
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order Summary</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original Price
            </dt>
            <dd className="text-base font-medium text-white">
              Rs.{formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-start justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -Rs.{formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              Rs.{formattedTotal}
            </dd>
          </dl>
        </div>
        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 
        px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none
        focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400 ">or</span>
          <Link
            to={"/"}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline
            hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
