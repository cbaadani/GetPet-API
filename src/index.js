const express = require('express');
require('./utils/dbConnection');
const userRouter = require('./apis/user');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.listen(port, () => {
    console.log("Server is running on " + port + " port");
});

app.get('/api/health', (req, res) => {
    res.send('ok');
});

app.use('/api/user', userRouter);
