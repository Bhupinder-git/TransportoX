import { supabase } from "../lib/supabase";

export async function listCompanyVehicles(companyId) {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function createCompanyVehicle(vehicle) {
  const { data, error } = await supabase
    .from("vehicles")
    .insert(vehicle)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function listCompanyDrivers(companyId) {
  const { data, error } = await supabase
    .from("drivers")
    .select("*,profiles(name,email)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function createDriverAccount(payload) {
  const { data, error } = await supabase.functions.invoke("create-driver", {
    body: payload,
  });
  if (error) throw error;
  return data;
}
export async function registerAccount(payload) {
  const { data, error } = await supabase.functions.invoke("register-account", {
    body: payload,
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}
export async function createDeliveryRequest(request) {
  const { data, error } = await supabase
    .from("delivery_requests")
    .insert(request)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function uploadRequestImage(userId, requestId, file) {
  const path = `${userId}/${requestId}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from("delivery-images")
    .upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}
export async function createDeliveryImage(image) {
  const { data, error } = await supabase
    .from("delivery_images")
    .insert(image)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function listNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export function subscribeToOrder(orderId, callback) {
  return supabase
    .channel(`order-${orderId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "delivery_requests",
        filter: `id=eq.${orderId}`,
      },
      callback,
    )
    .subscribe();
}
export async function listCompanies() {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("status", "ACTIVE")
    .order("name");
  if (error) throw error;
  return data;
}
export async function listRequests({ customerId, companyId } = {}) {
  let query = supabase
    .from("delivery_requests")
    .select(
      "*,company:companies(name),assigned_vehicle:vehicles!delivery_requests_assigned_vehicle_id_fkey(vehicle_number,plate_number),assigned_driver:profiles!delivery_requests_assigned_driver_id_fkey(name,email)",
    );
  if (customerId) query = query.eq("customer_id", customerId);
  if (companyId) query = query.eq("company_id", companyId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function updateDeliveryRequest(id, changes) {
  const { data, error } = await supabase
    .from("delivery_requests")
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function createInvoice(invoice) {
  const { data, error } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function listIncidents(companyId) {
  const { data, error } = await supabase
    .from("incidents")
    .select("*,request:delivery_requests(pickup,dropoff),driver:profiles(name)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function createIncident(incident) {
  const { data, error } = await supabase
    .from("incidents")
    .insert(incident)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function recoverFailure(payload) {
  const { data, error } = await supabase.functions.invoke("recover-failure", {
    body: payload,
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}
export async function listOrderEvents(requestId) {
  const { data, error } = await supabase
    .from("order_events")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function listDriverRequests(driverId) {
  return listRequests({}).then((rows) =>
    rows.filter((row) => row.assigned_driver_id === driverId),
  );
}
