import { Hono } from 'hono'
import { auth } from '../../lib/auth.js'
import type { AppBindings } from '../../lib/types.js'

const router = new Hono<AppBindings>({
  strict: false,
})

router.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})


export default router