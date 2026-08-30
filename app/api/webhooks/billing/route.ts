import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const payload = await req.json();
  return NextResponse.json({ received: true, event: payload.type });
}
