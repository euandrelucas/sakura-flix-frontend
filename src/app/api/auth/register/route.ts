/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import limiter from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.ip ?? request.headers.get("x-forwarded-for") ?? "127.0.0.1";

    // Verifica limite de requisição
    await limiter.consume(ip);

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nome, email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Erro ao criar conta." },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    if (err instanceof Error && err.name === "RateLimiterRes") {
      return NextResponse.json(
        { message: "Muitas tentativas, tente novamente depois." },
        { status: 429 } // Too Many Requests
      );
    }

    console.error(err);
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}
