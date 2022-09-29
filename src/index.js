const morgan = require('morgan');
const express = require('express');
const cors = require('cors');

const route = require('./routes');

const app = express();
const port = 3000;

app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

route(app);

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
