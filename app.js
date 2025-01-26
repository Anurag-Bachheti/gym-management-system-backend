const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const billRoutes = require('./routes/billRoutes'); 

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use('/api', userRoutes);
app.use('/api/bills',billRoutes);
app.use('/api/members',billRoutes);
app.use('/api/users',userRoutes);

app.use(errorHandler);

module.exports = app;