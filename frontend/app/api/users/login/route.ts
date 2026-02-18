import { NextResponse } from "next/server";

import { usersProxyRequest } from "../server";

type LoginBody = {
  email?: string;
  password?: string;
};

function isValidLoginBody(body: LoginBody): body is { email: string; password: string } {
  return typeof body.email === "string" && typeof body.password === "string";
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  if (!isValidLoginBody(body)) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const { status, payload } = await usersProxyRequest({
    path: "/auth",
    method: "POST",
    body,
  });

  return NextResponse.json(payload, { status });
}

