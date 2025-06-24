// setup all routes
const express = require('express')
const router = express.Router()
const controller = require("../controllers/orderController")

router.get("/", controller.getAll);

module.exports = router;