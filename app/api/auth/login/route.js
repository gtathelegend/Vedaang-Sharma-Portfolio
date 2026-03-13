import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      token: data.session.access_token,
      user: { email: data.user.email },
    });
  } catch {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
