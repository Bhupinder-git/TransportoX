const KEY = "transportox-delivery-requests";

export function getRequests() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}
export function saveRequest(request) {
  const next = [request, ...getRequests()];
  localStorage.setItem(KEY, JSON.stringify(next));
  return request;
}
export function updateRequest(id, changes) {
  const next = getRequests().map((request) =>
    request.id === id
      ? { ...request, ...changes, updatedAt: new Date().toISOString() }
      : request,
  );
  localStorage.setItem(KEY, JSON.stringify(next));
  return next.find((request) => request.id === id);
}
export function getRequest(id) {
  return getRequests().find((request) => request.id === id);
}
