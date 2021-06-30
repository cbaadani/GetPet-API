const express = require('express');
require('./utils/dbConnection');
//require('./utils/scrape');
const userRouter = require('./apis/user');
const petRouter = require('./apis/pets');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});

app.get('/api/health', (req, res) => {
    res.send('ok');
});

app.use('/api/user', userRouter);

app.use('/api', petRouter);

app.use((error, req, res, next) => {
    return res.status(500).json({ error: error.toString() });
});