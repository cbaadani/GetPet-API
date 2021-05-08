const express = require('express');
const router = express.Router();
const userService = require('./userService');

// /api/user gets added before
router.post('/signup', async (req, res, next) => {
    try {
        const { email, username, firstName, lastName, password } = req.body;
        const exists = await userService.userExists({ email })
        if (exists) {
            throw 'Email already exists'
        }
        else {
            const newUser = await userService.createUser({
                email,
                username,
                firstName,
                lastName,
                password
            });
            res.json(newUser);

        }


    } catch (error) {
        return next(error)
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, firstName, password } = req.body;

        const correctUser = await userService.checkUser({
            email,
            password
        });

        if (correctUser) {
            res.send(`Welcome ${firstName}`);
        } else {
            throw 'Incorrect details';
        }

    } catch (error) {
        return next(error)
    }
});

module.exports = router;
