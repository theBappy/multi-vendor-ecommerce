
import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: 'Product Service API',
        description: 'Automatically generated Swagger docs',
        version: '1.0.0'
    },
    host: 'localhost:6002',
    schemes: ['http'],
}
const outputFile = "./swagger-output.json"
const endPointFiles = ["./routes/product.router.ts"]

swaggerAutogen()(outputFile, endPointFiles, doc)