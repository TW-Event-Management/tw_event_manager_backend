const express = require('express')
const cors = require('cors')
const database = require('./config/database')
const eventRoutes = require('./routes/eventRoutes')
const userRoutes = require('./routes/userRoutes')
const registerRoutes = require('./routes/registerRoutes')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/register', registerRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});