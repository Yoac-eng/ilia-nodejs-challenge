import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { getAuthContext, walletProxyRequest } from "../server";
import { TransactionType } from "@/features/wallet/types/wallet";

type CreateTransactionBody = {
  type?: TransactionType;
  amount?: number;
  description?: string;
};

function toCreateTransactionPayload(
  body: CreateTransactionBody,
  userId: string
): { user_id: string; type: TransactionType; amount: number; description?: string } | null {
  if ((body.type !== "CREDIT" && body.type !== "DEBIT") || typeof body.amount !== "number") {
    return null;
  }

  const normalizedAmount = Math.round(body.amount * 100);
  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    return null;
  }

  return {
    user_id: userId,
    type: body.type,
    amount: normalizedAmount,
    ...(body.description ? { description: body.description } : {}),
  };
}

export async function GET(request: Request) {
  const authContext = await getAuthContext();
  if (!authContext) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const searchParams = new URLSearchParams();
  if (type === "CREDIT" || type === "DEBIT") {
    searchParams.set("type", type);
  }

  const { status, payload } = await walletProxyRequest({
    path: "/transactions",
    accessToken: authContext.accessToken,
    searchParams,
  });

  return NextResponse.json(payload, { status });
}

export async function POST(request: Request) {
  const authContext = await getAuthContext();
  if (!authContext) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const idempotencyKey = randomUUID();

  let body: CreateTransactionBody;
  try {
    body = (await request.json()) as CreateTransactionBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const payload = toCreateTransactionPayload(body, authContext.userId);
  if (!payload) {
    return NextResponse.json(
      { message: "Invalid transaction payload." },
      { status: 400 }
    );
  }

  const response = await walletProxyRequest({
    path: "/transactions",
    method: "POST",
    accessToken: authContext.accessToken,
    body: payload,
    headers: { "x-idempotency-key": idempotencyKey },
  });

  return NextResponse.json(response.payload, { status: response.status });
}

