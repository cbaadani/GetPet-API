const Pet = require('../../models/Pet');
const { clearUndefinedFields } = require('../../utils/object');
const userService = require('../user/userService');

const petType = Object.freeze({
    Dog: 'dog',
    Cat: 'cat'
});

function createPet({ name, age, page, pic, description, gender, type }) {
    const newPet = new Pet({
        name, age, page, pic, description, gender, type
    });

    return newPet.save();
}

async function updatePet(id, reqBody) {
    const updatedPet = await Pet.findByIdAndUpdate(id, reqBody, { new: true });

    return updatedPet;
}

async function upsertPet(filter, petDetails) {
    const upsertedPet = await Pet.findOneAndUpdate(filter, petDetails, { new: true, upsert: true });

    return upsertedPet;
}

async function getPetById(id) {
    const receivedPet = await Pet.findById(id);

    return receivedPet;
}

async function getPetByName(name, { type } = {}) {
    const receivedPet = await Pet.findOne({ name, type });
    return receivedPet;
}

async function getNonSavedPets({ userId, type }) {
    const { savedPets } = await userService.getUserById(userId);
    const savedPetIds = savedPets.map((pet) => pet._id);

    return Pet.find(clearUndefinedFields({ _id: { $nin: savedPetIds }, type })).sort('-updatedAt');
}

function getAllPets({ type }) {
    return Pet.find(clearUndefinedFields({ type })).sort('-updatedAt');
}

function search(text) {
    const regexSearch = { $regex: new RegExp(text, 'i') };
    const find = text ? {
        $or: [
            { name: regexSearch },
            { description: regexSearch },
        ]
    } : {};

    return Pet.find(find).sort('-updatedAt');
}

module.exports = {
    createPet,
    updatePet,
    getPetById,
    upsertPet,
    getAllPets,
    getPetByName,
    getNonSavedPets,
    search,
};
