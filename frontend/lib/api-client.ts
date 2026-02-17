import axios, { type AxiosError, type AxiosInstance } from "axios";

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
  details?: {
    code: string;
    message: string;
    path: string;
  }[];
};

const walletApi: AxiosInstance = axios.create({
  baseURL: walletApiBaseUrl,
});

const usersApi: AxiosInstance = axios.create({
  baseURL: usersApiBaseUrl,
});

function resolveClient(service: ApiService) {
  return service === "wallet" ? walletApi : usersApi;
}

function toErrorMessage(status: number, payload: unknown) {
  console.log("payload ", payload);
  console.log("status ", status);
  const fallback = `Request failed (${status})`;

  // if we don't have a payload, return the fallback
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const { message, error, details } = payload as ApiErrorPayload;

  if (details && details.length > 0) {
    return details.map((detail) => detail.message).join(", ");
  }
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
  try {
    const response = await resolveClient(service).request<T>({
      url: path,
      method,
      data: body,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    // Axios returns "" for empty responses in some cases; normalize to undefined.
    if (response.status === 204) {
      return undefined as T;
    }

    return response.data as T;
  } catch (error) {
    const axiosError = error as AxiosError<unknown>;

    // Network / CORS / no response
    if (!axiosError.response) {
      throw new Error("Network error. Please try again.");
    }

    const status = axiosError.response.status;
    const payload = axiosError.response.data;
    throw new Error(toErrorMessage(status, payload));
  }
}

