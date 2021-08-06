const Pet = require('../../models/Pet');
const { clearUndefinedFields } = require('../../utils/object');
const ObjectId = require('../../utils/objectId');
const userService = require('../user/userService');

function createPet({
    name,
    description,
    type,
    age,
    gender,
    profilePhoto,
    tags = [],
    addedBy
}) {
    const newPet = new Pet({
        name,
        description,
        type,
        age,
        gender,
        profilePhoto,
        tags,
        addedBy: ObjectId(addedBy)
    });

    return newPet.save();
}

async function updatePet(id, reqBody) {
    const updatedPet = await Pet.findByIdAndUpdate(id, clearUndefinedFields(reqBody), { new: true });

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

function getAllPets(addedBy) {
    return Pet.find({ addedBy: ObjectId(addedBy) }).sort('-updatedAt');
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
