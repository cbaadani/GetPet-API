const express = require('express');
const router = express.Router();
const petService = require('./petService');
const proxy = require('http-proxy-middleware');
const { authMiddleware } = require('../../utils/auth');
const controller = require('../../utils/controller');
const { NotFoundError } = require('../../utils/errors');
const axios = require('axios');

// /api/pets gets added before

// Autentication
router.use(authMiddleware);

// recognize pet
router.use('/recognize', proxy.createProxyMiddleware({
    target: process.env.RECOGNITION_PROXY_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/pets/recognize': '/api/recognize',
    },
}));

// add new pet
router.post('/', controller(async (req) => {
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
router.get('/adoption', controller(async (req) => {
    return petService.getNonSavedPets({ userId: req.user.id });
}));

router.get('/search', controller(async (req) => {
    return await petService.search(req.query.q);
}));

// get pet by name
router.get('/name/:name', controller(async (req) => {
    const pet = await petService.getPetByName(req.params.name, { type: req.params.type });

    if (!pet) {
        throw new NotFoundError('Pet not found');
    }

    return pet;
}));

// get pet by id
router.get('/:id', controller(async (req) => {
    const pet = await petService.getPetById(req.params.id, { type: req.params.type });

    if (!pet) {
        throw new NotFoundError('Pet not found');
    }

    return pet;
}));

// update pet by id
router.put('/:id', controller(async (req) => {
    // TODO- What fields we can update?
    const updatedPet = await petService.updatePet(req.params.id, req.body);

    if (!updatedPet) {
        throw new NotFoundError('Pet not found');
    }

    return updatedPet;
}));

router.get('/images/breed/:breed', controller(async (req) => {
    let breed = req.params.breed;

    if (breed.indexOf('_') !== -1) {
        breed = breed.split('_').reverse().join('/');
    }

    const result = await axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);

    return {
        breed,
        url: result.data.message
    };
}));

module.exports = router;
