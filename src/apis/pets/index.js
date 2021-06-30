const express = require('express');
const Dog = require('../../models/Dog');
const Cat = require('../../models/Cat');
const passport = require('passport')
const router = express.Router();
const petService = require('./petService');
require('../../utils/auth.js')(passport)


// /api/ gets added before

// add new dog
router.post('/dogs', async (req, res, next) => {
    try {
        await passport.authenticate('jwt', { session: false }, async function (err, user, info) {
            if (err) { 
                return next(err);
            }
            if (!user) { 
                return res.json({ error: info.message });
            }
            const { name, age, page, pic, description, gender } = req.body;
            // TODO - check if pet already exists?
            const newPet = await petService.createPet('dog', {
                name,
                age,
                page,
                pic,
                description,
                gender
            });
            res.json(newPet);
        })(req, res, next);
    } catch (error) {
        return next(error)
    }
});


// get all dogs
router.get('/dogs/adoption', async (req, res, next) => {
    try {
        await passport.authenticate('jwt', { session: false }, async function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({ error: info.message });
            }
            const allDogs = await petService.getAllPets('dog');
            if (allDogs) {
                res.json(allDogs)
            }
            else {
                res.status(500).json({ error: "Could not receive dogs" })
            }
        })(req, res, next);
    } catch (error) {
        return next(error);
    }
});


// get dog by name
router.get('/dogs/:name', async (req, res, next) => {
    try {
        await passport.authenticate('jwt', { session: false }, async function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({ error: info.message });
            }
            const receivedPet = await petService.getPetByName('dog', req.params.name);
            if (receivedPet) {
                res.json(receivedPet)
            }
            else {
                // TODO: check what is the right way
                res.status(500).json({ error: "pet not found" })
                //throw new Error ("pet not found");
            }
        })(req, res, next);
    } catch (error) {
        return next(error);
    }
});

// update dog by id
router.put('/dogs/:id', async (req, res, next) => {
    try {
        await passport.authenticate('jwt', { session: false }, async function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({ error: info.message });
            }
            // TODO- What fields we can update?
            const updatedPet = await petService.updatePet('dog', req.params.id, req.body);
            if (updatedPet) {
                res.json(updatedPet);
            } else {
                res.status(500).json({ error: "ID not found" })
            }
        })(req, res, next);
        
    } catch (error) {
        return next(error);
    }
});


// add new cat
router.post('/cats', async (req, res, next) => {
    try {
        await passport.authenticate('jwt', { session: false }, async function (err, user, info) {
            if (err) { 
                return next(err);
            }
            if (!user) { 
                return res.json({ error: info.message });
            }
            const { name, age, page, pic, description, gender } = req.body;
            // TODO - check if pet already exists?
            const newPet = await petService.createPet('cat', {
                name,
                age,
                page,
                pic,
                description,
                gender
            });
            res.json(newPet);
        })(req, res, next);
    } catch (error) {
        return next(error)
    }
});


// get all cats
router.get('/cats/adoption', async (req, res, next) => {
    try {
        await passport.authenticate('jwt', { session: false }, async function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({ error: info.message });
            }
            const allCats = await petService.getAllPets('cat');
            if (allCats) {
                res.json(allCats)
            }
            else {
                res.status(500).json({ error: "Could not receive cats" })
            }
        })(req, res, next);
    } catch (error) {
        return next(error);
    }
});


// get cat by name
router.get('/cats/:name', async (req, res, next) => {
    try {
        await passport.authenticate('jwt', { session: false }, async function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({ error: info.message });
            }
            const receivedPet = await petService.getPetByName('cat', req.params.name);
            if (receivedPet) {
                res.json(receivedPet)
            }
            else {
                // TODO: check what is the right way
                res.status(500).json({ error: "pet not found" })
                //throw new Error ("pet not found");
            }
        })(req, res, next);
    } catch (error) {
        return next(error);
    }
});

// update cat by id
router.put('/cats/:id', async (req, res, next) => {
    try {
        await passport.authenticate('jwt', { session: false }, async function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({ error: info.message });
            }
            // TODO- What fields we can update?
            const updatedPet = await petService.updatePet('cat', req.params.id, req.body);
            if (updatedPet) {
                res.json(updatedPet);
            } else {
                res.status(500).json({ error: "ID not found" })
            }
        })(req, res, next);
        
    } catch (error) {
        return next(error);
    }
});





module.exports = router;