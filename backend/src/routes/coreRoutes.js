import { Router } from 'express'
import { fareEstimate, geocode, route } from '../controllers/coreController.js'
const router = Router()
router.post('/geocode', geocode)
router.post('/route', route)
router.post('/fare-estimate', fareEstimate)
export default router
