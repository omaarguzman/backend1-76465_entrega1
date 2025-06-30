const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async writeFile(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    async addProduct({title, description, price, thumbnail, code, stock}) {
        const products = await this.readFile();

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campós son obligatorios');
        }

        if (products.some(product => product.code === code)) {
            throw new Error('El código de producto ya existe');
        }

        const newID = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }
        products.push(newProduct);
        await this.writeFile(products);
        return newProduct;
    }

    async getProducts() {
        return this.readFile();
    }

    async getProductById(id) {
        const products = await this.readFile();
        const product = products.find(product => product.id === id);
        return product;
    }

}

module.exports = ProductManager;