class CrawlStatus {
    distance
    startTime
    stopReason
    visitedPages

    static of(distance, startTime, stopReason, visitedPages) {
      const crawlStatus = new CrawlStatus();
      crawlStatus.distance = distance;
      crawlStatus.startTime = startTime;
      crawlStatus.stopReason = stopReason;
      crawlStatus.visitedPages = visitedPages;

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
      
    setVisitedPages(value) {
        myObject.visitedPages = value;
      }

}

module.exports = CrawlStatus;