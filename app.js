const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const memberRoutes = require('./routes/memberRoutes');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const billRoutes = require('./routes/bill.Routes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running');
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


//Routes
app.use('/api', userRoutes);
app.use('/api/bill', billRoutes);
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes); // Ensure this is correct
app.use(errorHandler);

module.exports = app;