const rateLimit = require('express-rate-limit');


// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 100,
    message: {
        error: 'Too many requests',
        message: 'You have exceeded the request limit. Please try again later.'
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

//  limiter for auth endpoints (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 15, 
    message: {
        error: 'Too many login attempts',
        message: 'Please try again after 15 minutes'
    },
    skipSuccessfulRequests: true, 
});

//  limiter for proposal creation (prevent spam)
const proposalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 60, 
    message: {
        error: 'Proposal limit reached',
        message: 'You can only create 10 proposals per hour'
    }
});

module.exports = {
    apiLimiter,
    authLimiter,
    proposalLimiter
};