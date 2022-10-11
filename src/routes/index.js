import productRouter from './Product.route.js';
import collectionRouter from './Collection.route.js';
import homeRouter from './Home.route.js';
import authRouter from './Auth.route.js';

function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/home', homeRouter);
    app.use('/api/product', productRouter);
    app.use('/api/collection', collectionRouter);
}

export default route;
