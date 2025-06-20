const prisma  = require("../db/db");

exports.getAll = async (req, res) => {
    const { category, name, sort } = req.query

    const filters = {}
    const orderBy = []

    if (category) {
        filters.category = {
            equals: category,
            mode: 'insensitive' 
        }
    }

    if (name) {
        filters.name = {
            contains: name,
            mode: 'insensitive'
        }
    }

    if (sort) {
        const [field, direction] = sort.split("_")
        const validFields = ["id", "price", "name"]
        const validDirections = ["asc", "desc"]
        if (validFields.includes(field) && validDirections.includes(direction)) {
            orderBy.push({ [field]: direction });
        } else {
            return res.status(400).json({ error: "Invalid sort query format. Use format: field_asc or field_desc" });
        }
    } 

    try {
        const products = await prisma.product.findMany({
            where: filters,
            orderBy: orderBy.length ? orderBy : undefined,
        });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

exports.getById = async (req, res) => {
    const id = Number(req.params.id)
    const product = await prisma.product.findUnique({where : { id }});
    if (!product) return res.status(404).json({ error: "Not found!" });
    res.json(product);
}

// Post /products
exports.create = async (req, res) => {
    const {name, description, price, image_url, category } = req.body
    if (!name || !description || !price || !category) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newProduct = await prisma.product.create({
        data: {name, description, price, image_url, category}
    });
    res.status(201).json(newProduct)
}

// Put /products/:id
exports.update = async (req, res) => {
    const id = Number(req.params.id)
    const { name, description, price, image_url, category } = req.body
    const updatedProduct = await prisma.product.update({
        where: { id },
        data: { name, description, price, image_url, category },
    })
    res.json(updatedProduct)
}

// Delete
exports.remove = async (req, res) => {
    const id = Number(req.params.id);
    await prisma.product.delete ({ where : { id }})
    res.status(204).end();
}

