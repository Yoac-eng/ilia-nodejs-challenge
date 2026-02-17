import { auth } from "@/auth";

const walletApiBaseUrl =
  process.env.WALLET_API_URL ?? "http://localhost:3001";

type WalletRequestConfig = {
  path: string;
  method?: "GET" | "POST";
  accessToken: string;
  body?: unknown;
  searchParams?: URLSearchParams;
};

type AuthContext = {
  accessToken: string;
  userId: string;
};

type ProxyResponse = {
  status: number;
  payload: unknown;
};

function buildWalletUrl(path: string, searchParams?: URLSearchParams): string {
  const url = new URL(path, walletApiBaseUrl);
  if (searchParams) {
    url.search = searchParams.toString();
  }
  return url.toString();
}

async function parseBackendPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return (await response.json()) as unknown;
    } catch {
      return { message: "Invalid JSON response from wallet service." };
    }
  }

  const text = await response.text();
  return text.length > 0 ? { message: text } : undefined;
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const session = await auth();
  const accessToken = session?.accessToken;
  const userId = session?.user?.id;

  if (!accessToken || !userId) {
    return null;
  }

  return { accessToken, userId };
}

export async function walletProxyRequest({
  path,
  method = "GET",
  accessToken,
  body,
  searchParams,
}: WalletRequestConfig): Promise<ProxyResponse> {
  try {
    const response = await fetch(buildWalletUrl(path, searchParams), {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const payload = await parseBackendPayload(response);
    return {
      status: response.status,
      payload,
    };
  } catch {
    return {
      status: 502,
      payload: { message: "Wallet service is unavailable right now." },
    };
  }
}

