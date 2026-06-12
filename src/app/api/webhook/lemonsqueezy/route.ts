import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // LemonSqueezy sends webhook events
    const eventName = body.meta?.event_name
    const data = body.data

    switch (eventName) {
      case "subscription_created":
        // Handle new subscription
        console.log("Subscription created:", data)
        break
      case "subscription_updated":
        // Handle subscription update
        console.log("Subscription updated:", data)
        break
      case "subscription_cancelled":
        // Handle cancellation
        console.log("Subscription cancelled:", data)
        break
      case "order_created":
        // Handle one-time purchase
        console.log("Order created:", data)
        break
      default:
        console.log("Unhandled event:", eventName)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Webhook error:", err)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
