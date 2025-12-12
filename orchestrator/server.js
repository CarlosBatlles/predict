require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Cargar rutas
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`🚀 Orchestrator service running on port ${PORT}`);
});