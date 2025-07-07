import express from 'express';
import cors from 'cors'


const app = express();

app.use(cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Tye'],
    credentials: true,
}))

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

const port = process.env.PORT || 6001
const server = app.listen(port, () => {
    console.log(`Auth service is running at http://localhost:${port}`)
})

server.on('error', (err) => {
    console.log('Server Error:', err)
})