require('dotenv').config();
const cheerio = require("cheerio");
const axios = require('axios');
const puppeteer = require('puppeteer');
const petService = require('../apis/pets/petService');
const mongoose = require('../utils/dbConnection');

const dogsSos = {
    url: 'https://www.sospets.co.il/dogs-adopting',
    type: 'dog'
}

const catsSOS = {
    url: 'https://www.sospets.co.il/cats-adoption',
    type: 'cat'
}

const sleep = (timeInMs) => new Promise((resolve) => setTimeout(resolve, timeInMs));

/**
 * Scrapes SOS site
 * 
 * @param {object} petsSOS 
 */
async function scrapeSOS(petsSOS) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // Goto SOS site
    await page.goto(petsSOS.url, { waitUntil: 'networkidle0' });
    const buttonSelector = 'button[data-testid="buttonElement"]';
    await page.waitForSelector(buttonSelector);
    // Gets the value of the attribute 'aria-disable' of the button - true/false 
    var buttonDisable = await page.evaluate(() => {
        const btn = document.querySelector('div._2btH0');
        return btn.getAttribute('aria-disabled')
    });
    // Checks is the button the disabled
    while (buttonDisable === 'false') {
        // Clicks the buuton
        await page.evaluate((selector) => document.querySelector(selector).click(), buttonSelector);
        await sleep(500);
        buttonDisable = await page.evaluate(() => {
            const btn = document.querySelector('div._2btH0');
            return btn.getAttribute('aria-disabled')
        });
    }
    await sleep(1000);
    // Gets the HTML
    const pageAfterClicks = await page.evaluate(() => document.querySelector('*').outerHTML);
    await getSOSpetsDetails(pageAfterClicks, petsSOS.type)
    await browser.close()
}


/**
 * Gets the detailes of the dogs and the cats
 * 
 * @param {string} data 
 * @param {string} petType 
 */
async function getSOSpetsDetails(data, petType) {
    var petPage, petPicString, picArray, extraDetails;
    const $ = cheerio.load(data);
    // Runs over all the cells in the grid that contains all pets
    $('._3Rcdf ._1ozXL').each(async (i, element) => {
        petPage = $(element).find('.Ued3M a').attr('href')
        petPicString = $(element).find('.Ued3M a img').attr('src')
        picArray = petPicString.split("/v1/fill/");
        const petPic = picArray[0];
        if (petType === 'dog') {
            extraDetails = await getDogExtraDetails(petPage)
        } else {
            extraDetails = await getCatExtraDetails(petPage)
        }

        var petDetails = {
            name: extraDetails.name,
            age: extraDetails.age,
            profilePhoto: petPic,
            description: extraDetails.description,
            gender: extraDetails.gender,
            tags: extraDetails.tags,
            type: petType
        };

        var filter = {
            name: extraDetails.name,
            type: petType
        }

        if (extraDetails.name) {
            // If the pet exists - updates his details, if not - creates a new pet.
            var upsertpet = await petService.upsertPet(filter, petDetails);
            if (!upsertpet) {
                console.error('Scraping error');
            }
        }
    })
}


/**
 * Gets the full details of the dog from his page
 * 
 * @param {string} petPage 
 * @returns 
 */
async function getDogExtraDetails(petPage) {
    const petTags = [];
    const { data } = await axios.get(petPage);
    const $ = cheerio.load(data);
    var petGender = $('#comp-kb0it5i8 > h2').text();
    const petDesc = $('#comp-kb0it5hn > p').text();
    const petAge = $('#comp-kb0it5ie > h2').text();
    const petName = $('#comp-kb0it5i2 > h2').text();
    const isVaccinated = $('#comp-kb0it5io > input').prop('checked');
    const isNeuteredOrSpayed = $('#comp-kb0it5il2 > input').prop('checked');
    var goodWith = $('#comp-kb0it5ix > h2').text();
    goodWith = goodWith.replace(/\s/g, '');
    const isHouseTrained = $('#comp-kb0it5is > h2').text();
    petGender = genderIntoEnglish(petGender);    
    // Checks if the dog is vaccinated
    if (isVaccinated) {
        // Pushes to the tags list
        petTags.push('vaccinated');
    }

    // Checks if the dog is neutered or spayed
    if (isNeuteredOrSpayed) {
        if (petGender === 'זכר') {
            petTags.push('neutered');
        } else {
            petTags.push('spayed');
        }
    }

    // Checks if the dog is dogFriendly/catFriendly/kidFriendly
    if (goodWith !== '') {
        goodWithArray = goodWith.split(",");
        if (goodWithArray.includes('כלבים')) {
            petTags.push('dogFriendly');
        }
        if (goodWithArray.includes('חתולים')) {
            petTags.push('catFriendly');
        }
        if (goodWithArray.includes('ילדים')) {
            petTags.push('kidFriendly');
        }
    }

    // Checks if the dog is house trained
    if (isHouseTrained.includes('כן')) {
        petTags.push('houseTrained');
    }

    const petAgeNum = ageConvert(petAge);
    const extraDetails = {
        name: petName,
        age: petAgeNum,
        description: petDesc,
        gender: petGender,
        tags: petTags
    }

    return extraDetails;
}


/**
 * Gets the full details of the cat from his page
 * 
 * @param {string} petPage 
 * @returns 
 */
async function getCatExtraDetails(petPage) {
    var petTags = [];
    const { data } = await axios.get(petPage);
    const $ = cheerio.load(data);
    var petGender = $('#comp-kcbptxel1 > h2').text();
    const petDesc = $('#comp-kcbptxdu > p').text();
    const petAge = $('#comp-kcbptxes > h2').text();
    const petName = $('#comp-kcbptxef > h2').text();
    const isVaccinated = $('#comp-kcbqunem > h2').text();
    const isNeuteredOrSpayed = $('#comp-kcbptxf01 > input').prop('checked');
    var goodWith = $('#comp-kcbptxfg > h2').text();
    goodWith = goodWith.replace(/\s/g, '');
    const isHouseTrained = $('#comp-kcbptxfa > h2').text();
    petGender = genderIntoEnglish(petGender);    
    // Checks if the cat is vaccinated
    if (isVaccinated.includes('כן')) {
        petTags.push('vaccinated');
    }

    // Checks if the cat is neutered or spayed
    if (isNeuteredOrSpayed) {
        if (petGender === 'זכר') {
            petTags.push('neutered');
        } else {
            petTags.push('spayed');
        }
    }

    // Checks if the cat is dogFriendly/catFriendly/kidFriendly
    if (goodWith !== '') {
        goodWithArray = goodWith.split(",");
        if (goodWithArray.includes('כלבים')) {
            petTags.push('dogFriendly');
        }

        if (goodWithArray.includes('חתולים')) {
            petTags.push('catFriendly');
        }

        if (goodWithArray.includes('ילדים')) {
            petTags.push('kidFriendly');
        }
    }

    // Checks if the cat is house trained
    if (isHouseTrained.includes('כן')) {
        petTags.push('houseTrained');
    }

    const petAgeNum = ageConvert(petAge);
    const extraDetails = {
        name: petName,
        age: petAgeNum,
        description: petDesc,
        gender: petGender,
        tags: petTags
    }
    return extraDetails;
}


/**
 * Converts the age of the pet from string to number
 * 
 * @param {string} petAge 
 * @returns 
 */
function ageConvert(petAge) {
    const month = 1 / 12;
    const reNumber = /\d+/;
    var ageNum;
    if (petAge.includes('שנים')) {
        ageNum = parseFloat(petAge.match(reNumber));
    } else if (petAge.includes('חודשים')) {
        ageNum = month * parseFloat(petAge.match(reNumber));
    } else if (petAge.includes('שנה')) {
        ageNum = 1;
        if (petAge.includes('וחצי')) {
            ageNum += 0.5;
        } else if (petAge.includes('חצי')) {
            ageNum = 0.5;
        }
    } else if (petAge.includes('שנתיים')) {
        ageNum = 2;
        if (petAge.includes('וחצי')) {
            ageNum += 0.5;
        }
    } else if (petAge.includes('חודשיים')) {
        ageNum = 2 * month;
        if (petAge.includes('וחצי')) {
            ageNum += 0.5 * month;
        }
    } else if (petAge.includes('חודש')) {
        ageNum = month;
        if (petAge.includes('וחצי')) {
            ageNum += 0.5 * month;
        }
    }
    return ageNum;
}


/**
 * Translte the pet's gender from Hebrew to English.
 * 
 * @param {string} petGender 
 * @returns 
 */
function genderIntoEnglish(petGender) { 
    if (petGender.includes('זכרים')) {
        if (petGender.includes('נקבות')) {
            petGender = 'males and females';
        } else {
            petGender = 'males';
        }
    } else if (petGender.includes('נקבות')) {
        petGender = 'females';
    } else if (petGender.includes('זכר')) {
        if (petGender.includes('נקבה')) {
            petGender = 'male and female';
        } else {
            petGender = 'male';
        }
    } else if (petGender.includes('נקבה')) {
        petGender = 'female';
    }
    return petGender;
}

mongoose.connection.on('connected', async (err) => {
    try {
        await scrapeSOS(catsSOS);
        await scrapeSOS(dogsSos);
        console.log('Scraping SOS succeeded');
    } catch (error) {
        console.error("Scraping SOS failed: ", error)
    }
});


