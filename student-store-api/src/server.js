require('dotenv').config()

const express = require('express')
const app = express()
const productRoutes = require("./routes/productRoutes.js")
const orderRoutes = require("./routes/orderRoutes.js")
const cors = require("cors")
const morgan = require("morgan")

const corsOption = {
    origin: "http://localhost:3000/"
}

app.use(morgan("dev"))
app.use(cors())
// So we can parse json
app.use(express.json())

// Links the router for products
app.use("/products", productRoutes)
app.use("/orders", orderRoutes)

const PORT = process.env.PORT 

app.get('/', (req, res) => {
    res.send('This is my main page')
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
