const express = require('express');
const router = express.Router();
const petService = require('./petService');
const proxy = require('http-proxy-middleware');
const { authMiddleware } = require('../../utils/auth');
const controller = require('../../utils/controller');
const { NotFoundError } = require('../../utils/errors');

// /api/pets gets added before

// Autentication
router.use(authMiddleware);

// recognize pet
router.use('/recognize', proxy.createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: {
        '^/api/pets/recognize': '/api/recognize',
    },
}));

// add new pet
router.post('/pets', controller(async (req) => {
    const { name, age, page, pic, description, gender, type } = req.body;

    // TODO - check if pet already exists?
    const newPet = await petService.createPet({
        name,
        age,
        page,
        pic,
        description,
        gender,
        type
    });

    return newPet;
}));

// get all pets
router.get('/pets/adoption', controller(() => {
    return petService.getAllPets('dog');;
}));

// get pet by name
router.get('/pets/:name', controller(async (req) => {
    const pet = await petService.getPetByName(req.params.name, { type: req.params.type });

    if (!pet) {
        throw new NotFoundError('Pet not found');
    }

    return pet;
}));

// update pet by id
router.put('/pets/:id', controller(async (req) => {
    // TODO- What fields we can update?
    const updatedPet = await petService.updatePet(req.params.id, req.body);

    if (!updatedPet) {
        throw new NotFoundError('Pet not found');
    }

    return updatedPet;
}));

module.exports = router;
