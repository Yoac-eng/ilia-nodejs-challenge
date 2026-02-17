import "server-only";

import { auth } from "@/auth";
import { WalletBalance, WalletTransaction } from "../types/wallet";

const walletApiBaseUrl =
  process.env.NEXT_PUBLIC_WALLET_API_URL ?? "http://localhost:3001";

function buildWalletUrl(path: string): string {
  return new URL(path, walletApiBaseUrl).toString();
}

async function parseJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined;
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    return undefined;
  }
}

async function getServerWalletData<T>(path: string): Promise<T> {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error("Unauthorized.");
  }

  const response = await fetch(buildWalletUrl(path), {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: "no-store",
  });

  const payload = await parseJson(response);
  if (!response.ok) {
    throw new Error("Could not load wallet data.");
  }

  return payload as T;
}

export async function getServerWalletBalance(): Promise<WalletBalance> {
  return getServerWalletData<WalletBalance>("/balance");
}

export async function getServerWalletTransactions(): Promise<WalletTransaction[]> {
  return getServerWalletData<WalletTransaction[]>("/transactions");
}

