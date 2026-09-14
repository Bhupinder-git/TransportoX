import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import coreRoutes from './routes/coreRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { errorHandler, notFound } from './middleware/error.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.get('/health', (request, response) => response.json({ ok: true, service: 'transportox-backend' }))
app.use('/api', coreRoutes)
app.use('/api/orders', orderRoutes)
app.use(notFound)
app.use(errorHandler)
app.listen(env.port, () => console.log(`TransportoX backend listening on port ${env.port}`))
