const productRouter = require('./Product.route');
const collectionRouter = require('./Collection.route');
const homeRouter = require('./Home.route');

function route(app) {
    app.use('/api/home', homeRouter);
    app.use('/api/product', productRouter);
    app.use('/api/collection', collectionRouter);
}

module.exports = route;
