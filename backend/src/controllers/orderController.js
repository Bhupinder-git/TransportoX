import { env } from '../config/env.js'
import { orderSchema, statusSchema } from '../validators/schemas.js'
import { assignNearestDriver, createOrder, getOrder, listUserOrders, updateOrderStatus } from '../services/orders.js'
export async function create(request, response) { response.status(201).json(await createOrder(request.authUser.id, orderSchema.parse(request.body))) }
export async function details(request, response) { response.json(await getOrder(request.params.id)) }
export async function history(request, response) { if (request.params.userId !== request.authUser.id) return response.status(403).json({ error: 'You can only view your own order history' }); response.json(await listUserOrders(request.authUser.id)) }
export async function status(request, response) { response.json(await updateOrderStatus(request.params.id, statusSchema.parse(request.body).status)) }
export async function assign(request, response) { response.json(await assignNearestDriver(request.params.id, Number(request.body.radius_km || env.driverSearchRadiusKm))) }
