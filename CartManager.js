const fs = require('fs').promises;

class CartManager {
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

    async createCart() {
        const carts = await this.readFile();
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
        }
        carts.push(newCart);
        await this.writeFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.readFile();
        const cart = carts.find(cart => cart.id === id);
        return cart;
    }
    
    async addProducts(cartID, productID) {
        const carts = await this.readFile();
        const cart = carts.find(cart => cart.id === cartID);
        if (!cart) return null;
        const prod = cart.products.find(prod => prod.id === productID);
        if (item) {
            item.quantity++;
        } else {
            cart.products.push({
                product: productID,
                quantity: 1,
            });
        }
        await this.writeFile(carts);
        return cart;
    }
}

module.exports = CartManager;