class CrawlStatus {
    distance
    startTime
    stopReason
    lastModified
    numPages

    Of(distance, startTime, stopReason, lastModified, numPages) {
      const crawlStatus = new CrawlStatus();
      crawlStatus.distance = distance;
      crawlStatus.startTime = startTime;
      crawlStatus.stopReason = stopReason;
      crawlStatus.lastModified = lastModified;
      crawlStatus.numPages = numPages;

      return crawlStatus;
    }

    setDistance(value) {
        myObject.distance = value;
      }
      
    setStartTime(value) {
        myObject.startTime = value;
      }
      
    setStopReason(value) {
        myObject.stopReason = value;
      }
      
    setLastModified(value) {
        myObject.lastModified = value;
      }
      
    setNumPages(value) {
        myObject.numPages = value;
      }

}

module.exports = CrawlStatus;