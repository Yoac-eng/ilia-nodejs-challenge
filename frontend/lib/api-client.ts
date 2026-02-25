import axios, { type AxiosError, type AxiosInstance } from "axios";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type InternalRequestConfig = {
  path: string;
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
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

const appApi: AxiosInstance = axios.create();

export async function appApiRequest<T>({
  path,
  method = "GET",
  body,
  headers,
}: InternalRequestConfig): Promise<T> {
  try {
    const response = await appApi.request<T>({
      url: path,
      method,
      data: body,
      headers,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    return response.data as T;
  } catch (error) {
    const axiosError = error as AxiosError<unknown>;

    if (!axiosError.response) {
      throw new Error("Network error. Please try again.");
    }

    const status = axiosError.response.status;
    const payload = axiosError.response.data;
    throw new Error(toErrorMessage(status, payload));
  }
}

function toErrorMessage(status: number, payload: unknown) {
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

