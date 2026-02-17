const walletApiBaseUrl =
  process.env.NEXT_PUBLIC_WALLET_API_URL ?? "http://localhost:3001";
const usersApiBaseUrl =
  process.env.NEXT_PUBLIC_USERS_API_URL ?? "http://localhost:3002";

type ApiService = "wallet" | "users";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type RequestConfig = {
  service: ApiService;
  path: string;
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
};

type ApiErrorPayload = {
  message?: string | string[];
  error?: string;
};

function resolveBaseUrl(service: ApiService) {
  return service === "wallet" ? walletApiBaseUrl : usersApiBaseUrl;
}

function toErrorMessage(status: number, payload: unknown) {
  const fallback = `Request failed (${status})`;

  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const { message, error } = payload as ApiErrorPayload;
  if (Array.isArray(message)) {
    return message.join(", ");
  }
  if (typeof message === "string" && message.length > 0) {
    return message;
  }
  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  return fallback;
}

export async function apiRequest<T>({
  service,
  path,
  method = "GET",
  body,
  token,
}: RequestConfig): Promise<T> {
  const response = await fetch(`${resolveBaseUrl(service)}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let parsedError: unknown = null;
    try {
      parsedError = await response.json();
    } catch {
      parsedError = null;
    }
    throw new Error(toErrorMessage(response.status, parsedError));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

