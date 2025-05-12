require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key', // Use a strong, environment-specific secret
    jwtExpiration: '1h',
    defaultPageSize: 20,
};