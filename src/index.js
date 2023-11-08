const express = require('express')
const database = require('./config/database')
const eventRoutes = require('./routes/eventRoutes')

const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});