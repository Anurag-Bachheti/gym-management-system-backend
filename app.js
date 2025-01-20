const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;