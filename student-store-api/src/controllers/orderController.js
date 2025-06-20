const prisma  = require("../db/db");

exports.getAll = async (req, res) => {
    const { customer, sort } = req.query

    const filters = {}
    const orderBy = []

    if (customer) {
        filters.customer = {
            contains: customer,
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
    const order = await prisma.order.findUnique({where : { id }});
    if (!order) return res.status(404).json({ error: "Not found!" });
    res.json(order);
}
// Post /orders
exports.create = async (req, res) => {
    const {customer, total, status, createdAt } = req.body
    if (!customer || !total || !status || !createdAt) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const neworder = await prisma.order.create({
        data: {customer, total, status, createdAt}
    });
    res.status(201).json(neworder)
}

// Put /orders/:id
exports.update = async (req, res) => {
    const id = Number(req.params.id)
    const { customer, total, status, createdAt } = req.body
    const updatedorder = await prisma.order.update({
        where: { id },
        data: { customer, total, status, createdAt },
    })
    res.json(updatedorder)
}

// Delete
exports.remove = async (req, res) => {
    const id = Number(req.params.id);
    await prisma.order.delete ({ where : { id }})
    res.status(204).end();
}

