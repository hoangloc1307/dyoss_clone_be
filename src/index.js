const morgan = require('morgan');
const express = require('express');
const route = require('./routes');

const app = express();
const port = 3000;

app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
