const API = '/api';

export async function api(path, { token, ...opt } = {}) {
  const res = await fetch(API + path, {
    ...opt,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
  });
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok) throw Object.assign(new Error(json.error?.message || res.statusText), { status: res.status });
  return json.data;
}
