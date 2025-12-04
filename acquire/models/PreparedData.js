const mongoose = require('mongoose');

const PreparedDataSchema = new mongoose.Schema({
    features: {
        type: [Number], // Array de números
        required: true
    },
    featureCount: {
        type: Number,
        required: true,
        default: 7
    },
    scalerVersion: {
        type: String,
        default: "v1"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PreparedData', PreparedDataSchema, 'prepared_samples');
