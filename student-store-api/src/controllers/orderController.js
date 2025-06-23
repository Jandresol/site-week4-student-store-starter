const prisma  = require("../db/db");

exports.getAll = async (req, res) => {
    const { customer, sort, status } = req.query

    const filters = {}
    const orderBy = []

    if (customer) {
        filters.customer = {
            contains: customer,
            mode: 'insensitive'
        }
    }

    if (status) {
        filters.status = {
            contains: status,
            mode: 'insensitive'
        }
    }

    if (sort) {
        const [field, direction] = sort.split("_")
        const validFields = ["total", "createdAt"]
        const validDirections = ["asc", "desc"]
        if (validFields.includes(field) && validDirections.includes(direction)) {
            orderBy.push({ [field]: direction });
        } else {
            return res.status(400).json({ error: "Invalid sort query format. Use format: field_asc or field_desc" });
        }
    } 

    try {
        const orders = await prisma.order.findMany({
            where: filters,
            orderBy: orderBy.length ? orderBy : undefined,
        });

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

exports.getById = async (req, res) => {
    const id = Number(req.params.id)
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            orderItems: true,
        },
    });
    if (!order) return res.status(404).json({ error: "Not found!" });
    await updateOrderTotal(id);
    res.json(order);
}
// Post /orders
exports.create = async (req, res) => {
    const {customer, status, createdAt } = req.body
    if (!customer || !status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const neworder = await prisma.order.create({
        data: {customer, status, createdAt}
    });
    res.status(201).json(neworder)
}

// Put /orders/:id
exports.update = async (req, res) => {
    const id = Number(req.params.id)
    const { customer, status, createdAt } = req.body
    const updatedorder = await prisma.order.update({
        where: { id },
        data: { customer, status, createdAt },
    })
    res.json(updatedorder)
}

// Delete
exports.remove = async (req, res) => {
    const id = Number(req.params.id);
    await prisma.order.delete ({ where : { id }})
    res.status(204).end();
}

// Update Order Total
async function updateOrderTotal(orderId) {
    const items = await prisma.orderItem.findMany({
        where: { orderId },
    });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await prisma.order.update({
        where: { id: orderId },
        data: { total },
    });

    return total;
}

// GET /orders/:id/items
exports.getOrderItems = async (req, res) => {
    const orderId = Number(req.params.id);

    const items = await prisma.orderItem.findMany({
        where: { orderId },
        include: {
            product: true
        }
    });

    res.json(items);
};

// Post /orders/:id/items
exports.createOrderItem = async (req, res) => {
    const orderId = Number(req.params.id);
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    const newOrderItem = await prisma.orderItem.create({
        data: {
            orderId,
            productId,
            quantity,
            price: product.price
        }
    });
    await updateOrderTotal(orderId);
    res.status(201).json(newOrderItem);
};

// GET /orders/:id/total
exports.getOrderTotal = async (req, res) => {
    const orderId = Number(req.params.id);
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { total: true }
    });

    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    res.json({ total: order.total });
};



