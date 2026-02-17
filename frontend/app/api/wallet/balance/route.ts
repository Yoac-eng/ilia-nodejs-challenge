import { NextResponse } from "next/server";

import { getAuthContext, walletProxyRequest } from "../server";

export async function GET() {
  const authContext = await getAuthContext();
  if (!authContext) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { status, payload } = await walletProxyRequest({
    path: "/balance",
    accessToken: authContext.accessToken,
  });

  return NextResponse.json(payload, { status });
}

