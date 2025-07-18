import express from 'express';
import "./jobs/product-cron-job"
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '@packages/error-handler/error-middleware';
import router from './routes/product.router';


const app = express();

app.use(cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
}))

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello Product-Service API'});
});

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// app.get("/docs-json", (req,res) => {
//     res.json(swaggerDocument)
// })

app.use('/api', router)

app.use(errorMiddleware)

const port = process.env.PORT || 6002
const server = app.listen(port, () => {
    console.log(`Product service is running at http://localhost:${port}/api`)
    console.log(`Swagger Docs available at http://localhost:${port}/docs`)
})

server.on('error', (err) => {
    console.log('Server Error:', err)
})