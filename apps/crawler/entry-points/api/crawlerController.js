const {CrawlerService} = require("../../domain/crawlerService");
const {validateRequest} = require("../../domain/validation");

async function crawl(req, res, next) {
    try {
        validateRequest(req.body);
        const crawlId = generateCrawlId();
        const crawler = new CrawlerService();
        
        crawler.crawl(crawlId, req)
        .then((status) => console.log(`Finish crawling. stop reason ${status}`));

        res.status(200).send(crawlId);
    } catch (error) {
        next(error);
    }    
}

function generateCrawlId() {
        const charPool = "ABCDEFHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const ID_LENGTH = 8;
        let res = '';

        for (let i = 0; i < ID_LENGTH; i++) {
            res += charPool.charAt(Math.floor(Math.random() * charPool.length));
        }

        return res;
}

module.exports.crawl = crawl;
