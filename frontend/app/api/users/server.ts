const usersApiBaseUrl =
  process.env.USERS_API_URL ?? "http://localhost:3002";

type UsersMethod = "POST";

type UsersProxyConfig = {
  path: string;
  method?: UsersMethod;
  body?: unknown;
};

type ProxyResponse = {
  status: number;
  payload: unknown;
};

function buildUsersUrl(path: string): string {
  return new URL(path, usersApiBaseUrl).toString();
}

// transform the response from the users service into a JSON object
async function parseBackendPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return (await response.json()) as unknown;
    } catch {
      return { message: "Invalid JSON response from users service." };
    }
  }

  const text = await response.text();
  return text.length > 0 ? { message: text } : undefined;
}

export async function usersProxyRequest({
  path,
  method = "POST",
  body,
}: UsersProxyConfig): Promise<ProxyResponse> {
  try {
    const response = await fetch(buildUsersUrl(path), {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return {
      status: response.status,
      payload: await parseBackendPayload(response),
    };
  } catch {
    return {
      status: 502,
      payload: { message: "Users service is unavailable right now." },
    };
  }
}

