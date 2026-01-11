const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function apiFetch(path, options = {}) {
  const { method = "GET", body, headers = {}, skipAuthRedirect = false } = options;

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

  try {
    const res = await fetch(url, opts);

    // Auth errors → redirect (unless explicitly skipped for login/signup pages)
    if ((res.status === 401 || res.status === 403) && !skipAuthRedirect) {
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
  } catch (error) {
    // Network errors (backend offline, no internet, etc.)
    const isNetworkError = error instanceof TypeError && 
      (error.message.includes('fetch') || 
       error.message.includes('Failed to fetch') ||
       error.message.includes('NetworkError'));
    
    return {
      status: 0,
      data: null,
      ok: false,
      error: {
        message: error.message,
        isNetworkError,
        isOffline: !navigator.onLine || isNetworkError,
      }
    };
  }
}
