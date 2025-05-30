const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/mydb";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));

app.get('/', (req, res) => {
    res.send('Hello from Node.js! Monitoring enabled.');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});