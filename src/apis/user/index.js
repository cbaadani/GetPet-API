const express = require('express');
const router = express.Router();
const userService = require('./userService');
const jwt = require('jsonwebtoken');
const { jwtSecret, authMiddleware } = require('../../utils/auth');
const controller = require('../../utils/controller');
const { BadRequestError } = require('../../utils/errors');

// /api/user gets added before
router.post('/signup', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // checks if user is already exists by email
        const exists = await userService.userExists({ email })
        if (exists) {
            res.status(500).json({ error: "Email already exists" });
        }
        else {
            const userDetails = await userService.createUser({
                email,
                name,
                password
            });

            // issue jwt
            const token = jwt.sign({ id: userDetails.id, email: userDetails.email }, jwtSecret);
            res.json({ token });
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
            userDetails = await userService.getUserByEmail(email);

            // issue jwt
            const token = jwt.sign({ id: userDetails.id, email: userDetails.email }, jwtSecret);
            res.json({ token });
        } else {
            res.status(500).json({ error: 'Incorrect details' });
        }
    } catch (error) {
        return next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        // TODO- What fields is the user allowed to update? If email is also allowed, 
        //we should check that it does not exist in the system. If also a password - a hash function must be performed on it
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(500).json({ error: "ID not found" });
        }
    } catch (error) {
        return next(error);
    }
});

router.use(authMiddleware);

router.get('/', controller(async (req) => {
    const { name, savedPets } = await userService.getUserById(req.user.id);

    return { name, savedPets };
}));

router.post('/savePet', controller((req) => {
    const { petId } = req.body;

    if (!petId) throw new BadRequestError('missing petId');

    return userService.savePet({ userId: req.user.id, petId });;
}));

module.exports = router;
