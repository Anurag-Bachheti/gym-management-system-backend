const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

// const cors = require('cors');
// app.use(cors());


module.exports = app;