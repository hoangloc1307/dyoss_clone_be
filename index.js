import dotenv from 'dotenv';
import morgan from 'morgan';
import express, { urlencoded, json } from 'express';
import cors from 'cors';

import route from './src/routes/index.js';

const app = express();
const port = 3000;

dotenv.config();

app.use(morgan('combined'));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

route(app);

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
