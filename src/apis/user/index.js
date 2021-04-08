const express = require('express');
const router = express.Router();
const userService = require('./userService');

// /api/user gets added before
router.post('/', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const newUser = await userService.createUser({
            username,
            password
        });

        res.json(newUser);
    } catch (error) {
        return next(error)
    }
});

module.exports = router;
