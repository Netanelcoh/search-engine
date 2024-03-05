const axios = require('axios');
const cheerio = require('cheerio');
const CrawlerRecord = require("./crawlerRecord");
const {validateRequest} = require('./validation');
const redis = require('../data-access/redis');
const CrawlStatus = require('./crawlStatus');

class CrawlerService {
    constructor() {
        this.queue = [];
    }

    generateCrawlId() {
      const charPool = "ABCDEFHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const ID_LENGTH = 8;
      let res = '';

      for (let i = 0; i < ID_LENGTH; i++) {
          res += charPool.charAt(Math.floor(Math.random() * charPool.length));
      }

      return res;
    }

    async validateAndInit(crawlId, request) {
      validateRequest(request);
      await this.initCrawlInRedis(crawlId);
      this.queue.push(new CrawlerRecord(crawlId, request));
    }

    async crawlUrls(crawlId, request) {
          let baseUrl = request.url;
          let crawlerRecord = '';
          let response = '';
          let innerUrls = [];
          
          while (this.queue.length > 0 && await this.getStopReason(this.queue.at(0)) == null) {
              crawlerRecord = this.queue.shift();
              console.log(crawlerRecord.url);
              await this.setCrawlStatus(crawlId, CrawlStatus.of(crawlerRecord.distance, crawlerRecord.startTime, null, 0));
              response = await this.redirect(crawlerRecord.url);
              innerUrls = this.extractUrlsFromWebpage(response, baseUrl);
              await this.addUrlsToQueue(crawlerRecord, innerUrls);
          }

          let stopReason = this.queue.length > 0 ? await this.getStopReason(this.queue.at(0)) : null
          return await this.setCrawlStatus(crawlId, CrawlStatus.of(crawlerRecord.distance, crawlerRecord.startTime, stopReason, 0));
  }

    async initCrawlInRedis(crawlId) {
        await this.setCrawlStatus(crawlId, CrawlStatus.of(0, Date.now(), null, 0));
        await redis.set(crawlId + ".urls.count", 1);
      }
      
      async setCrawlStatus(crawlId, crawlStatus) {
        await redis.set(crawlId + ".status", JSON.stringify(crawlStatus));
        return JSON.stringify(crawlStatus);
      }

      async getCrawlStatus(crawlId) {
        let status = await redis.get(crawlId + ".status");
        status = JSON.parse(status);
        status.visitedPages = await this.getVisitedUrls(crawlId);
        return JSON.stringify(status);
      }
      
      async addUrlsToQueue(record, innerUrls) {
          let newRecord;
          let visited = false;
          for (let url of innerUrls) {
              visited = await this.crawlHasVisited(record, url);
              if(!visited) {
                  newRecord = CrawlerRecord.copy(record).setUrl(url).IncDistance();
                  this.queue.push(newRecord);
              }
          }
      }

      async crawlHasVisited(rec, url) {
        const key = rec.crawlId + ".urls." + url;
        const setIfAbsentResult = await redis.set(key, "1");
      
        if (setIfAbsentResult === "OK") {
          await redis.incr(rec.crawlId + ".urls.count");
          console.log(await redis.get(rec.crawlId + ".urls.count"));
          return false;
        } else {
          return true;
        }
      }
      
      async getVisitedUrls(crawlId) {
        const curCount = await redis.get(crawlId + ".urls.count");
        return curCount ? parseInt(curCount) : 0;
      }

    async redirect(url) {
        if(url && !url.startsWith("https"))
            throw new httpError("url must start with https");

        return fetch(url)
            .then(response => response.text())
            .then(htmlContent => htmlContent)
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

    async getStopReason(crecord) {
        let currentTimeInMilliSeconds = Math.floor(Date.now() / 1000);
        
        if(crecord.maxDistance + 1 === crecord.distance)
            return 'max distance';
        if(currentTimeInMilliSeconds - crecord.startTime > crecord.maxSeconds)
            return 'max seconds';

        return (await this.getVisitedUrls(crecord.crawlId)) > crecord.maxUrls ? 'max urls' : null;
    }

}

class httpError extends Error {
    constructor(message) {
      super(message);
    }
  }



module.exports.CrawlerService = CrawlerService;
module.exports.httpError = httpError;