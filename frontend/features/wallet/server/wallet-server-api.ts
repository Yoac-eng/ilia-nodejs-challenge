import "server-only";

import { auth } from "@/auth";
import { toCamelCaseDeep } from "@/lib/case-conversion";
import { WalletBalance, WalletTransaction } from "../types/wallet";

const walletApiBaseUrl =
  process.env.WALLET_API_URL ?? "http://localhost:3001";

function buildWalletUrl(path: string): string {
  return new URL(path, walletApiBaseUrl).toString();
}

async function parseJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined;
  }

  try {
    const rawPayload = (await response.json()) as unknown;
    return toCamelCaseDeep(rawPayload);
  } catch {
    return undefined;
  }
}

// this is a server side function that fetches data from the wallet service
// designed to be used in server components for better first render performance (mainly for the dashboard page)
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

// get the balance from the wallet service
export async function getServerWalletBalance(): Promise<WalletBalance> {
  return getServerWalletData<WalletBalance>("/balance");
}

// get the transactions from the wallet service
export async function getServerWalletTransactions(): Promise<WalletTransaction[]> {
  return getServerWalletData<WalletTransaction[]>("/transactions");
}

