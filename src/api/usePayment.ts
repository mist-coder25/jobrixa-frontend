import { useCallback } from "react";
import api from "./axios";
import { toast } from "../components/Toast";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function usePayment(onSuccess?: () => void) {

  const initiatePayment = useCallback(async (plan: "PRO_MONTHLY" | "PRO_YEARLY" | "CAMPUS", amount?: number) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Could not load payment gateway. Please try again.");
      return;
    }

    let orderData: { orderId: string; amount: number; currency: string; key: string };
    try {
      const res = await api.post("/payments/create-order", { plan, amount: amount?.toString() });
      orderData = res.data;
    } catch (err) {
      console.error("Order creation failed:", err);
      toast.error("Failed to create order. Please try again.");
      return;
    }

    const planLabel = 
      plan === "PRO_MONTHLY" ? "Pro Plan — ₹149/month" : 
      plan === "PRO_YEARLY" ? "Pro Plan — ₹999/year" : 
      "Campus Plan — ₹499/semester";

    const options = {
      key: orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Jobrixa",
      description: planLabel,
      order_id: orderData.orderId,
      image: "https://ui-avatars.com/api/?name=J&background=6C63FF&color=fff&size=128",
      theme: { color: "#6C63FF" },
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        try {
          const verifyRes = await api.post("/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          
          // Optimistic plan update if backend is still deploying
          const backendPlan = verifyRes.data.plan;
          const optimisticPlan = plan.startsWith("PRO") ? "PRO" : (plan === "CAMPUS" ? "CAMPUS" : "FREE");
          const finalPlan = (backendPlan && backendPlan !== "FREE") ? backendPlan : optimisticPlan;
          
          localStorage.setItem("jobrixa_plan", finalPlan);
          window.dispatchEvent(new Event("planUpdated"));
          
          toast.success(`🎉 Welcome to Jobrixa ${plan.startsWith("PRO") ? "Pro" : "Campus"}!`);
          onSuccess?.();
        } catch {
          toast.error("Payment verification failed. Contact support.");
        }
      },
      modal: {
        ondismiss: () => toast.error("Payment cancelled"),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, [onSuccess]);

  return { initiatePayment };
}
