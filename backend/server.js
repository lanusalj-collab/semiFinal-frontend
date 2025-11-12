const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://eljay:eljay@cluster0.q5gns0y.mongodb.net/shoehub?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ MongoDB connected successfully');
})
.catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
});

mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

// --- Order Schema ---
const orderSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String }
    },
    items: [
        {
            id: Number,
            name: String,
            price: Number,
            qty: Number
        }
    ],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// --- REST API Endpoints ---

// GET all orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json({
            success: true,
            count: orders.length,
            orders: orders
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: err.message
        });
    }
});

// GET order by ID
app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ id: req.params.id });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        }
        res.json({
            success: true,
            order: order
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: err.message
        });
    }
});

// POST checkout (create new order)
app.post('/checkout', async (req, res) => {
  console.log('POST /checkout - incoming body:', JSON.stringify(req.body).slice(0,1000));
  try {
    const { items, customer, total, id, createdAt } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty or invalid data provided.' });
    }

    if (!customer || !customer.name || !customer.email) {
        return res.status(400).json({ success: false, message: 'Customer information is required (name, email).' });
    }

    const newOrder = new Order({
        id: id || `ORD-${Date.now()}`,
        customer,
        items,
        total: total || items.reduce((sum, item) => sum + (item.price * item.qty), 0),
        status: 'pending',
        createdAt: createdAt || new Date(),
        updatedAt: new Date()
    });

    await newOrder.save();
    console.log('Order saved to DB id=', newOrder.id);

    res.status(201).json({ success: true, orderId: newOrder.id, order: newOrder });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update order status
app.put('/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { id: req.params.id },
            { status: status, updatedAt: new Date() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        }

        res.json({
            success: true,
            message: 'Order updated successfully.',
            order: order
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error: err.message
        });
    }
});

// DELETE order
app.delete('/orders/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findOneAndDelete({ id: req.params.id });

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully.',
            order: deletedOrder
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error: err.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running', database: 'MongoDB' });
});

// Bind to 0.0.0.0 so interfaces accept connections
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on http://localhost:${PORT} (bound 0.0.0.0:${PORT})`);
    console.log(`🗄️  Using MongoDB: ${MONGODB_URI}`);
    console.log(`Available endpoints:`);
    console.log(`  GET    /health           - Health check`);
    console.log(`  POST   /checkout         - Create new order`);
    console.log(`  GET    /orders           - Get all orders`);
    console.log(`  GET    /orders/:id       - Get order by ID`);
    console.log(`  PUT    /orders/:id       - Update order status`);
    console.log(`  DELETE /orders/:id       - Delete order`);
});

// End of file (no frontend code or PowerShell script here)