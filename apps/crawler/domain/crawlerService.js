const axios = require('axios');
const cheerio = require('cheerio');
const CrawlerRecord = require("./crawlerRecord");
const {validateRequest} = require('./validation');

class CrawlerService {
    constructor() {
        this.queue = [];
        this.visitedUrls = new Set();
    }

    async crawl(crawlId, req) {
            validateRequest(req.body);

            let baseUrl = req.body.url;
            let crawlerRecord = '';
            let response = '';
            let innerUrls = [];
            
            this.queue.push(this.createCrawlerRecord(crawlId, req.body));
            
            while (this.queue.length > 0 && this.getStopReason(this.queue.at(0)) == null) {
                crawlerRecord = this.queue.shift();
                console.log(crawlerRecord.url);
                response = await this.redirect(crawlerRecord.url);
                innerUrls = this.extractUrlsFromWebpage(response, baseUrl);
                this.addUrlsToQueue(crawlerRecord, innerUrls);
            }

            let stopReason = this.queue.length > 0 ? this.getStopReason(this.queue.at(0)) : null

            return stopReason ? stopReason : "successfull";
    }

    async redirect(url) {
        if(url && !url.startsWith("https"))
            throw new httpError("url must start with https");
      
       
        return fetch(url)
            .then(response => response.text())
            .then(htmlContent => htmlContent)
            
        // return await axios.get(url, {
        //     headers: {
        //         'Origin': 'http://localhost:3000',
        //         //'Authorization': `Bearer ${apiKey}`,
        //       },
        //            httpsAgent: new https.Agent({  
        //         rejectUnauthorized: false  // Ignore SSL/TLS certificate validation
        //       }),
        // });

        // return await axios.get(url, {
        //     httpsAgent: new https.Agent({  
        //         rejectUnauthorized: false  // Ignore SSL/TLS certificate validation
        //       }),
        //     proxy: {
        //         protocol: 'https',
        //         host: '127.0.0.1',
        //         port: 3000
        //     }
        // });
        
    }


    addUrlsToQueue(record, innerUrls) {
        let currentDistance = record.distance + 1;
        let newRecord;
        for (let url of innerUrls) {
            if (!this.visitedUrls.has(url)) {
                newRecord = CrawlerRecord.copy(record).setUrl(url).setDistance(currentDistance);
                this.visitedUrls.add(url);
                this.queue.push(newRecord);
            }
        }
    }

    createCrawlerRecord(crawlId, request) {
        return new CrawlerRecord(crawlId, request);
    }

    extractUrlsFromWebpage(doc, prefix) {
        const $ = cheerio.load(doc);
        const urls = [];
    
        $('a').each((index, element) => {
          const href = $(element).attr('href');
          if (href && href.startsWith(prefix)) {
            urls.push(href);
          }
        });
    
        return urls;
    }

    getStopReason(crecord) {
        let currentTimeInMilliSeconds = Math.floor(Date.now() / 1000);
        
        if(crecord.maxDistance + 1 === crecord.distance)
            return 'max distance';
        if(this.visitedUrls.size > crecord.maxUrls)
            return 'max urls';
        if(currentTimeInMilliSeconds - crecord.startTime > crecord.maxSeconds)
            return 'max seconds';

        return null;
    }
}

class httpError extends Error {
    constructor(message) {
      super(message);
    }
  }



module.exports.CrawlerService = CrawlerService;
module.exports.httpError = httpError;