const calculateReadingTime = (text) => {
    const wordsPerMinute = 200; // Average words per minute
    const words = text.trim().split(/\s+/).length;
    if (words === 0) return 0;
    const minutes = words / wordsPerMinute;
    return Math.ceil(minutes); // Return reading time in minutes
};

const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

module.exports = {
    calculateReadingTime,
    generateRandomString
};