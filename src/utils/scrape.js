const cheerio = require("cheerio");
const axios = require('axios');
const puppeteer = require('puppeteer');
const petService = require('../apis/pets/petService');
const Dog = require('../models/Dog');

const sleep = (timeInMs) => new Promise((resolve) => setTimeout(resolve, timeInMs));

async function scrapeSOS() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // SOS site
    await page.goto('https://www.sospets.co.il/dogs-adopting', { waitUntil: 'networkidle0' });
    const buttonSelector = 'button[data-testid="buttonElement"]';
    await page.waitForSelector(buttonSelector);
    // Gets the number of grid cells
    var numOfGridCells = ((await page.$$('div[role="gridcell"]')).length)
    // Gets the value of the attribute 'aria-disable' of the button - true/false 
    var buttonDisable = await page.evaluate(() => {
        const btn = document.querySelector('div._2btH0');
        return btn.getAttribute('aria-disabled')
    });
    
    while (buttonDisable === 'false') {
        //await page.click(buttonSelector);
        await page.evaluate((selector) => document.querySelector(selector).click(), buttonSelector); 
        await sleep(500);
        buttonDisable = await page.evaluate(() => {
            const btn = document.querySelector('div._2btH0');
            return btn.getAttribute('aria-disabled')
        });
    }
    await sleep(1000);
    numOfGridCells = ((await page.$$('div[role="gridcell"]')).length)
    // Gets the HTML
    const data = await page.evaluate(() => document.querySelector('*').outerHTML);
    await getSOSDogsDetails(data)
    await browser.close()
}



async function getSOSDogsDetails(data) {
    var dogPage, dogPic, dogName, dogAge;
    const $ = cheerio.load(data);
    $('._3Rcdf ._1ozXL').each(async (i, element) => {
        dogPage = $(element).find('.Ued3M a').attr('href')
        // TODO: the image type changes from webp to jpg ????
        dogPic = $(element).find('.Ued3M a img').attr('src')
        $(element).find('._2bafp').each((j, el) => {
            if (j === 0) {
                dogName = $(el).text()
            } else if (j === 1) {
                dogAge = $(el).text()
            } 
        })
        //const dogDesc = await getDogDescription(dogPage);
        const petDetails = {
            age: dogAge,
            pic: dogPic,
            // description: 'dogDesc.dogPageDesc',
            // gender: 'dogDesc.dogGender'
        };
        const filter = {
            name: dogName,
            page: dogPage
        }
        await petService.upsertPet(Dog, filter, petDetails);
        // TODO: need to delete the irrelevant dogs
    })
}


async function getDogsDescriptions() {
    const allDogs = await petService.getAllPets(Dog);
    allDogs.forEach(async function(dog) {
        const { data } = await axios.get(dog['page'])
        const $ = cheerio.load(data);
        const dogPageDesc = $('#comp-kb0it5hn > p > span > span > span > span > span > span > span > span > span > span > span').text()
        const dogGender = $('#comp-kb0it5i8 > h2 > span > span > span > span > span > span').text();
        //const vaccinated = $('#comp-kb0it5io > input').attr('checked');
        //const dogName = $('#comp-kb0it5i2 > h2 > span > span > span > span > span > span > span > span > span > span').text();
        const petDetails = {
            age: dog['age'],
            pic: dog['pic'],
            description: dogPageDesc,
            gender: dogGender
        };
        const filter = {
            name: dog['name'],
            page: dog['page']
        }
        await petService.upsertPet(Dog, filter, petDetails);
    })
}


// TODO:How often to repeat the scraping? add timeout
async function callScarpeSOS() {
    try {
        await scrapeSOS();
        await getDogsDescriptions();
        console.log("Scrape SOS succeeded")
    } catch (err) {
        console.error("Scrape SOS failed: ", err)
    }
}
callScarpeSOS();

