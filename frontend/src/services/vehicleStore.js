import { vehicles as seededVehicles } from '../data/demo'
const KEY = 'transportox-vehicles'
const seed = seededVehicles.map((vehicle,index) => ({...vehicle, companyId:index===2?'northstar':index===3?'greenroute':'swiftline', companyName:index===2?'Northstar Logistics':index===3?'GreenRoute Mobility':'Swiftline Freight'}))
export function getVehicles(companyId) { const all=JSON.parse(localStorage.getItem(KEY)||JSON.stringify(seed)); return companyId ? all.filter(vehicle=>vehicle.companyId===companyId) : all }
export function saveVehicle(vehicle) { const all=JSON.parse(localStorage.getItem(KEY)||JSON.stringify(seed)); localStorage.setItem(KEY,JSON.stringify([vehicle,...all])); return vehicle }
