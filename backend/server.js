import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import productsRoutes from './routes/products.js';
import bookingsRoutes from './routes/bookings.js';
import ordersRoutes from './routes/orders.js';
import consentRoutes from './routes/consent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- ROUTES ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Backend API is running smoothly!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/consent', consentRoutes);

// Handle Contact Form Submissions (still a simple stub — no dedicated table yet)
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log('New Contact Message Received:', { name, email, phone, message });
  res.status(200).json({ success: true, message: 'Message received successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Ready to connect with the React Frontend!`);
});
