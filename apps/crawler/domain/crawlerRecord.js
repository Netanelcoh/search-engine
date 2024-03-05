class CrawlerRecord {
    crawlId
    startTime
    baseUrl
    url
    distance
    maxDistance
    maxSeconds
    maxUrls

    
    
    constructor(crawlId, req) {
        this.startTime = Math.floor(Date.now() / 1000),
        this.crawlId = crawlId,
        this.baseUrl = req.url,
        this.url = req.url,
        this.distance = 0,
        this.maxDistance = req.maxDistance,
        this.maxSeconds = req.maxSeconds,
        this.maxUrls = req.maxUrls
    }

   static copy(crecord) {
    const res = new CrawlerRecord(crecord.crawlId, crecord)
    res.crawlId = crecord.crawlId;
    res.baseUrl = crecord.url;
    res.url = crecord.url;
    res.distance = crecord.distance;
    res.maxDistance = crecord.maxDistance;
    res.maxSeconds = crecord.maxSeconds;
    res.maxUrls = crecord.maxUrls;

    return res;
   }

   setUrl(url) {
    this.url = url

    return this;
   }

   IncDistance() {
    this.distance++;

    return this;
   }
   setCrawlId(crawlId) {
     this.crawlId = crawlId;
     return this; 
   }
   
   setBaseUrl(baseUrl) {
     this.baseUrl = baseUrl;
     return this; g
   }
   
   setUrl(url) {
     this.url = url;
     return this; 
   }
   
   setMaxDistance(maxDistance) {
     this.maxDistance = maxDistance;
     return this; 
   }
   
   setMaxSeconds(maxSeconds) {
     this.maxSeconds = maxSeconds;
     return this; 
   }
   
   setMaxUrls(maxUrls) {
     this.maxUrls = maxUrls;
     return this; 
   }
}

  
module.exports = CrawlerRecord;