const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
const db = require("../db.js");

const SCRAPER_URL = "https://www.zeit.de/news/index";

const getNewsItems = (async (req, res) => {
    const browser = await puppeteer.launch({
        headless: true
      });
    try {
        const page = await browser.newPage();
        await page.goto(SCRAPER_URL);
        const titleAttributeValue = 'SP Consent Message';
        const selector = `[title="${titleAttributeValue}"]`;


        await page.waitForSelector(selector);

        const iframeHandle = await page.$('iframe');
        const iframe = await iframeHandle.contentFrame();


        const elementSelector = 'button'; // Replace with your element selector
        await iframe.waitForSelector(elementSelector);


        const element = await iframe.$(elementSelector);
        await element.click();
        await page.waitForNavigation({waitUntil: 'domcontentloaded'});
        const htmlContent = await page.content();

        // Load the HTML content into Cheerio
        const $ = cheerio.load(htmlContent);

        const newsItems = [];

        $("article.zon-teaser-news").each((index, el) => {
            const newsTitle = $(el).find(".zon-teaser-news__title").text();
            const newsByLine =  $(el).find(".zon-teaser-news__byline").text();
            const newsLink = $(el).find(".zon-teaser-news__heading-link").attr("href");
            const publishDate = $(el).find("time.zon-teaser-news__date").attr("datetime");


            const currentTime = dayjs();
            const timestampTime = dayjs(publishDate);
            const hoursDifference = currentTime.diff(timestampTime, 'hour');
            if (hoursDifference >= 0 && hoursDifference <= 24) {
                newsItems.push({id: index, title: newsTitle, byline: newsByLine, newsLink, date: publishDate});
            } else {
                return; 
            }
        })
        const promiseData = newsItems.map((item) => {
            return db.collection(collectionName).add(item)
        });
        Promise.all(promiseData).then(results => {
            results.forEach(docRef => {
                console.log('Document added with ID:', docRef.id);
            });
        })
        .catch(error => {
            console.error('Error adding documents:', error);
            throw new Error();
        });
        // Close the browser
        await browser.close();
        const data = newsItems;
        return res.status(200).json({data});
    } catch {
        const data = "ann error occurred";
        return res.status(500).json({data});
    }
      
})


module.exports = {
    getNewsItems
}