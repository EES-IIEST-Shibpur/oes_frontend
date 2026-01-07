const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function apiFetch(path, options = {}) {
  const { method = "GET", body, headers = {} } = options;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const opts = {
    method,
    headers: {
      ...headers,
    },
  };

  if (token) {
    opts.headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  // Ensure path starts with /
  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, opts);

  // Auth errors → redirect
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return { status: res.status, data: null };
  }

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return {
    status: res.status,
    data,
    ok: res.ok
  };
}