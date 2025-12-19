import express from 'express';
import { logger, authenticate } from './middleware/index.js';
import tablesRouter from './routes/tables.js';
import usersRouter from './routes/users.js';

const app = express();

// Middleware setup
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serves static files (like HTML, CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(logger);
app.use(authenticate);

// Routes setup
app.use('/api/tables', tablesRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant App!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
