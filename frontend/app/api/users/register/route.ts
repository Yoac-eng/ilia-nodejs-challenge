import { NextResponse } from "next/server";

import { usersProxyRequest } from "../server";

type RegisterBody = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
};

function isValidRegisterBody(
  body: RegisterBody
): body is { first_name: string; last_name: string; email: string; password: string } {
  return (
    typeof body.first_name === "string" &&
    typeof body.last_name === "string" &&
    typeof body.email === "string" &&
    typeof body.password === "string"
  );
}

export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  if (!isValidRegisterBody(body)) {
    return NextResponse.json({ message: "Invalid registration payload." }, { status: 400 });
  }

  const { status, payload } = await usersProxyRequest({
    path: "/users",
    method: "POST",
    body,
  });

  return NextResponse.json(payload, { status });
}

