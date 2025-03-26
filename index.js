const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', schoolRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
