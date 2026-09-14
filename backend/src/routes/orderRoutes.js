import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { assign, create, details, history, status } from '../controllers/orderController.js'
const router = Router()
router.use(requireAuth)
router.post('/', create)
router.get('/user/:userId', history)
router.get('/:id', details)
router.patch('/:id/status', status)
router.post('/:id/assign-driver', assign)
export default router
