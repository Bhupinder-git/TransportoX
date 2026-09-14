const DRIVER_KEY = "transportox-drivers";
const INCIDENT_KEY = "transportox-driver-incidents";
export const seededDrivers = [
  {
    id: "DRV-1001",
    name: "Ravi Singh",
    email: "driver.ravi@transportox.local",
    password: "ravi123",
    phone: "+91 98765 43210",
    vehicle: "TX-042",
    status: "ON DUTY",
    companyId: "swiftline",
    companyName: "Swiftline Transport",
  },
];
export function getDrivers() {
  const drivers = JSON.parse(
    localStorage.getItem(DRIVER_KEY) || JSON.stringify(seededDrivers),
  );
  return drivers.map((driver) => ({
    ...driver,
    companyId: driver.companyId || "swiftline",
    companyName: driver.companyName || "Swiftline Transport",
  }));
}
export function saveDriver(driver) {
  const next = [...getDrivers(), driver];
  localStorage.setItem(DRIVER_KEY, JSON.stringify(next));
  return driver;
}
export function getDriverIncidents() {
  return JSON.parse(localStorage.getItem(INCIDENT_KEY) || "[]");
}
export function saveDriverIncident(incident) {
  const next = [incident, ...getDriverIncidents()];
  localStorage.setItem(INCIDENT_KEY, JSON.stringify(next));
  return incident;
}
