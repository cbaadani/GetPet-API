const express = require('express');
const router = express.Router();
const userService = require('./petService');

// /api/pets gets added before
router.post('/addpet', async (req, res, next) => {
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

