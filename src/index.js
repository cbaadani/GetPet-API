require('dotenv').config();
const express = require('express');
require('./utils/dbConnection');
//require('./utils/scrape');
const userRouter = require('./apis/user');
const petRouter = require('./apis/pets');
const reportRouter = require('./apis/reports');
const app = express();
const port = process.env.PORT || 3000;
const passport = require('passport');
const { jwtStrategy } = require('./utils/auth');
const { GetPetError } = require('./utils/errors');
const { isDev } = require('./utils/env');

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

app.use('/api/reports', reportRouter);

app.use('*', function(req, res) {
    return res.status(404).json({ error: 'Route Not Found' });
});

app.use((error, req, res, next) => {
    const status = error.status || 500;

    if (error.message) {
        console.error(error.message);
    }

    const isGetPetError = error instanceof GetPetError;
    const errorMessage = isGetPetError || isDev ? error.message : 'Internal Server Error';

    return res.status(status).json({ error: errorMessage });
});

app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});
