const Pet = require('../../models/Pet');

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

function getAllPets({ type }) {
    return Pet.find({ type });
}

module.exports = {
    createPet,
    updatePet,
    getPetById,
    upsertPet,
    getAllPets,
    getPetByName,
};
