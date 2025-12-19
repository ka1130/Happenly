import express from 'express';
import { someControllerFunction } from '../controllers/index.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Express App!');
});

router.get('/some-endpoint', someControllerFunction);

export default (app) => {
    app.use('/api', router);
};