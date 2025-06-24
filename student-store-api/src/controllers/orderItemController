const prisma  = require("../db/db");

// Get /order-items
exports.getAll = async (req, res) => {
    const items = await prisma.orderItem.findMany({
        include: {
            order: true,
            product: true
        }
    });

    res.json(items);
}