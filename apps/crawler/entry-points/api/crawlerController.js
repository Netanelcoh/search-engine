const {CrawlerService} = require("../../domain/crawlerService");

async function crawl(req, res, next) {
    try {
        const crawler = new CrawlerService();
        const crawlId = crawler.generateCrawlId();

        await crawler.validateAndInit(crawlId, req.body);
        res.status(200).send(crawlId);

        const status = await crawler.crawlUrls(crawlId, req.body);
        console.log(`Finish crawling. ${status}`);

    } catch (error) {
        next(error);
    }    
}

async function checkStatus(req,res,next) {
    try {
        //await validateCrawlId(req.params.id); //id with 8 digit length
        const crawler = new CrawlerService();
        const status = await crawler.getCrawlStatus(req.params.id);

        res.status(200).send(status);
        
    } catch (error) {
        next(error);    
    }
}
module.exports.crawl = crawl;
module.exports.checkStatus = checkStatus;
