require('dotenv').config();
const express = require('express');
require('./utils/dbConnection');
//require('./utils/scrape');
const userRouter = require('./apis/user');
const petRouter = require('./apis/pets');
const app = express();
const port = process.env.PORT || 3000;
const passport = require('passport');
const { jwtStrategy } = require('./utils/auth');

passport.use(jwtStrategy);

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.get('/api/health', (req, res) => {
    res.send('ok');
});

app.use('/api/user', userRouter);

app.use('/api/pets', petRouter);

app.use('*', function(req, res) {
    return res.status(404).json({ error: 'Route Not Found' });
});

app.use((error, req, res, next) => {
    const status = error.status || 500;

    if (error.message) {
        console.error(error.message);
    }

    return res.status(status).json({ error: error.message || 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});
