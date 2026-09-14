import { supabase } from '../lib/supabase'

async function invoke(body){const {data,error}=await supabase.functions.invoke('routing',{body});if(error)throw error;if(data?.error)throw new Error(data.error);return data}
function straightLineDistance(pickup,dropoff){const radians=value=>value*Math.PI/180;const earthRadius=6371;const latDifference=radians(dropoff.lat-pickup.lat);const lngDifference=radians(dropoff.lng-pickup.lng);const a=Math.sin(latDifference/2)**2+Math.cos(radians(pickup.lat))*Math.cos(radians(dropoff.lat))*Math.sin(lngDifference/2)**2;return Math.round(earthRadius*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))*10)/10}
export function geocodeAddress(address){return invoke({action:'geocode',address})}
export async function calculateRoute(pickup,dropoff){try{return await invoke({action:'route',pickup,dropoff})}catch{const distanceKm=straightLineDistance(pickup,dropoff);return {distance_km:distanceKm,duration_min:Math.max(1,Math.ceil(distanceKm/0.8)),geometry:{type:'LineString',coordinates:[[pickup.lng,pickup.lat],[dropoff.lng,dropoff.lat]]}}}}
export async function calculateFare(distanceKm,weightKg){try{return await invoke({action:'fare',distance_km:distanceKm,cargo_weight_kg:weightKg})}catch{return {fare:Math.round((500+distanceKm*25+weightKg*2)*100)/100}}}
export async function optimizeEstimate(input){try{return await invoke({action:'ai-estimate',...input})}catch{return {fare:input.fare,duration_min:input.duration_min,confidence:'standard',source:'deterministic-fallback'}}}
