const productRouter = require('./Product.route');
const collectionRouter = require('./Collection.route');

function route(app) {
    app.use('/api/product', productRouter);
    app.use('/api/collection', collectionRouter);
}

module.exports = route;
