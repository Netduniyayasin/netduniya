import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (key_id && key_secret && key_id.startsWith("rzp_")) {
      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      const options = {
        amount: Math.round(amount * 100), // amount in paise
        currency,
        receipt: receipt || `rec_${Date.now()}`,
        notes: notes || {},
      };

      const order = await razorpay.orders.create(options);
      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      });
    }

    // Fallback/Sandbox simulated order when keys are pending configuration
    const simulatedOrderId = `order_sim_${Date.now()}`;
    return NextResponse.json({
      id: simulatedOrderId,
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `rec_${Date.now()}`,
      isSimulated: true,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
