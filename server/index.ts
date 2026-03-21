import { Hono } from 'hono'
import { corsMiddleware } from './middleware/cors'
import conversations from './routes/conversations'
import messages from './routes/messages'

const app = new Hono().basePath('/api')

app.use('*', corsMiddleware)

app.route('/conversations', conversations)
app.route('/conversations', messages)

export default app
