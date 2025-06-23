// setup all routes
const express = require('express')
const router = express.Router()
const controller = require("../controllers/orderController")

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create)
router.put("/:id", controller.update)
router.delete("/:id", controller.remove)

router.get("/:id/items", controller.getOrderItems);
router.post("/:id/items", controller.createOrderItem);
router.get("/:id/total", controller.getOrderTotal);

module.exports = router;