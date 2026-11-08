import { NextRequest, NextResponse } from "next/server";

const submissions = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const now = Date.now();
    const timestamps = submissions.get(ip) || [];
    const recent = timestamps.filter((t) => now - t < 60000);

    if (recent.length >= 3) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before resubmitting." },
        { status: 429 }
      );
    }

    recent.push(now);
    submissions.set(ip, recent);

    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: ["shindeyash0204@gmail.com"],
          reply_to: email,
          subject: `Portfolio Inquiry from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }),
      });

      if (!resendRes.ok) {
        const errorData = await resendRes.json();
        return NextResponse.json(
          { error: errorData?.message || "Failed to deliver email." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
