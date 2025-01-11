module.exports = function calculateReadingTime(body) {
    const wordsPerMinute = 200;
    const wordCount = body.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };
  