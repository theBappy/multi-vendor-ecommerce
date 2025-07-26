import { useState } from "react";
import { useStripe, useElements,PaymentElement } from "@stripe/react-stripe-js";
import { Loader2, XCircle, CheckCircle } from "lucide-react";

const CheckoutForm = ({
  clientSecret,
  cartItems,
  coupon,
  sessionId,
}: {
  clientSecret: string;
  cartItems: any[];
  coupon: any;
  sessionId: string | null;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const total = cartItems.reduce(
    (sum, item) => sum + item.sale_price * item.quantity,
    0
  );

  const handleSubmit = async  (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    if(!stripe || !elements){
      setLoading(false)
      return
    }
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?sessionId=${sessionId}`
      }
    })
    if(result.error){
      setStatus('failed')
      setErrorMsg(result.error.message || 'Something went wrong')
    }else{
      setStatus('success')
    }
    setLoading(false)
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 my-10">
      <form 
      onSubmit={handleSubmit}
      className="bg-white w-full max-w-lg p-8 rounded-md shadow space-y-6">
        <h2 className="text-3xl font-bold text-center mb-2">
          Secure payment checkout
        </h2>
        {/* dynamic order summary */}
        <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 space-y-2">
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm pb-1">
              <span>
                {item.quantity} * {item.title}
              </span>
              <span>${(item.quantity * item.sale_price).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold pt-2 border-t border-t-gray-300 mt-1">
            {!!coupon?.discountAmount && (
              <>
                <span>Discount</span>
                <span className="text-green-600">
                  ${coupon?.discountAmount?.toFixed(2)}
                </span>
              </>
            )}
          </div>
          <div className="flex justify-between font-semibold mt-2">
            <span>Total</span>
            <span className="text-green-600">
              ${(total - (coupon?.discountAmount || 0)).toFixed(2)}
            </span>
          </div>
        </div>
        <PaymentElement />
        <button
          disabled={!stripe || loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Processing..." : "Pay Now"}
        </button>
        {errorMsg && (
          <div className="flex items-center gap-2 text-red-600 text-sm justify-center">
            <XCircle className="w-5 h-5" />
            {errorMsg}
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600 text-sm justify-center">
            <CheckCircle className="w-5 h-5" />
            Payment Successful!
          </div>
        )}
        {status === "failed" && (
          <div className="flex items-center gap-2 text-red-600 text-sm justify-center">
            <XCircle className="w-5 h-5" />
            Payment failed. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
