const express = require('express');
const router = express.Router();
const userService = require('./userService');
const jwt = require('jsonwebtoken');
const cfg = require("../../config.js");


// /api/user gets added before
router.post('/signup', async (req, res, next) => {
    try {
        const { email, username, firstName, lastName, password } = req.body;
        // checks if user is already exists by email
        const exists = await userService.userExists({ email })
        if (exists) {
            res.status(500).json({error: "Email already exists"});
        }
        else {
            const newUser = await userService.createUser({
                email,
                username,
                firstName,
                lastName,
                password
            });
            const body = { _id: newUser._id, email: newUser.email };
            // issue jwt
            const token = "Bearer " + jwt.sign({ newUser: body }, cfg.jwtSecret);
            res.json({user: newUser, token: token});
        }

    } catch (error) {
        return next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const correctUser = await userService.checkUser({
            email,
            password
        });

        if (correctUser) {
            userDetails = await userService.getUserByEmail({email})
            const body = { _id: userDetails._id, email: userDetails.email };
            // issue jwt
            const token = "Bearer " + jwt.sign({ userDetails: body }, cfg.jwtSecret);
            res.json({user: userDetails, token: token});
        } else {
            res.status(500).json({error: "Incorrect details"});
        }

    } catch (error) {
        return next(error);
    }
});

router.put('/:id', async (req, res, next) =>  {
    try {
        // TODO- What fields is the user allowed to update? If email is also allowed, 
        //we should check that it does not exist in the system. If also a password - a hash function must be performed on it
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(500).json({error: "ID not found"});
        }
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
