require('dotenv').config();

const app = require('./app');
const PORT = process.env.PORT || 5000;
const dbUri = process.env.DB_URI;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
});