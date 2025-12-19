export const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

export const authenticate = (req, res, next) => {
    // Authentication logic here
    next();
};

export { authenticateJWT } from './auth.js';