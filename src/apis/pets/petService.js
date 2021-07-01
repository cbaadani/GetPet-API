const Dog = require('../../models/Dog');
const Cat = require('../../models/Cat');

const petType = Object.freeze({
    Dog: 'dog',
    Cat: 'cat'
});

async function createPet(pet, { name, age, page, pic, description, gender }) {
    if (pet === petType.Dog) {
        const newPet = new Dog({
            name, age, page, pic, description, gender
        });
        return newPet.save();
    }
    else if (pet === petType.Cat) {
        const newPet = new Cat({
            name, age, page, pic, description, gender
        });
        return newPet.save();
    }
}


async function updatePet(pet, id, reqBody) {
    if (pet === petType.Dog) {
        const updatedPet = await Dog.findByIdAndUpdate(id, reqBody, { new: true });
        return updatedPet;
    }
    else if (pet === petType.Cat) {
        const updatedPet = await Cat.findByIdAndUpdate(id, reqBody, { new: true });
        return updatedPet;
    }
}

async function upsertPet(pet, filter, petDetails) {
    if (pet === petType.Dog) {
        const upsertedPet = await Dog.findOneAndUpdate(filter, petDetails, { new: true, upsert: true });
        return upsertedPet;
    }
    else if (pet === petType.Cat) {
        const upsertedPet = await Cat.findOneAndUpdate(filter, petDetails, { new: true, upsert: true });
        return upsertedPet;
    }
}

async function getPetById(pet, id) {
    if (pet === petType.Dog) {
        const receivedPet = await Dog.findById(id);
        return receivedPet;
    }
    else if (pet === petType.Cat) {
        const receivedPet = await Cat.findById(id);
        return receivedPet;
    }
}

async function getPetByName(pet, name) {
    if (pet === petType.Dog) {
        const receivedPet = await Dog.findOne({ name: name });
        return receivedPet;
    }
    else if (pet === petType.Cat) {
        const receivedPet = await Cat.findOne({ name: name });
        return receivedPet;
    }
}

async function getAllPets(pet) {
    if (pet === petType.Dog) {
        const all = await Dog.find({});
        return all;
    }
    else if (pet === petType.Cat) {
        const all = await Cat.find({});
        return all;
    }
}



module.exports = {
    createPet,
    updatePet,
    getPetById,
    upsertPet,
    getAllPets,
    getPetByName,
};
