const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');
const express = require('express');

const app = express();
const PORT = 8080;
const productManager = new ProductManager('./archivos/products.json');
const cartManager = new CartManager('./archivos/carts.json');

app.use(express.json());

// Obtener productos
app.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.json({products});
});

app.get('/products/:id', async (req, res) => {
    const product = await productManager.getProductById(req.params.id);

    if (!product) {
        res.status(404).json({error: 'Producto no encontrado'});
        return res.jason(product);
    }
    res.json(product);
});

app.post('/products', async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

app.get('/carts/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
        res.status(404).json({error: 'Carrito no encontrado'});
        return res.json(cart.products);
    }
});

app.post('/carts', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

app.post('/carts/:cid/products/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const product = await productManager.getProductById(pid);
    if (!product) {
        res.status(404).json({error: 'Producto no encontrado'});
        return res.json(product);
    }

    const updatedCart = await cartManager.addProducts(cid, pid);
    if (!updatedCart) {
        res.status(404).json({error: 'Carrito no encontrado'});
        return res.json(updatedCart);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});