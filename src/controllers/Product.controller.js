const db = require('../config/database');
const Func = require('../functions');

class ProductController {
    //[GET] /api/product
    getProducts(req, res) {
        let sql = 'SELECT * FROM tb_product WHERE 1 = 1';

        if (req.query.hasOwnProperty('type')) {
            sql += ` AND type = '${Func.RemoveSpecialCharacters(
                req.query.type.toLowerCase()
            )}'`;
        }
        if (req.query.hasOwnProperty('sex')) {
            sql += ` AND sex = '${Func.RemoveSpecialCharacters(
                req.query.sex.toLowerCase()
            )}'`;
        }
        if (req.query.hasOwnProperty('stock')) {
            sql += ` AND stock > 0`;
        }
        if (parseInt(req.query.limit).toString() !== 'NaN') {
            sql += ` LIMIT ${parseInt(req.query.limit)}`;
        }
        if (parseInt(req.query.offset).toString() !== 'NaN') {
            sql += ` OFFSET ${parseInt(req.query.offset)}`;
        }

        db.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }

    //[GET] /api/product/selling/:type
    getSellingProducts(req, res) {
        const { type } = req.params;
        let sql = 'SELECT * FROM tb_product WHERE type = ? ORDER BY sold DESC';

        if (parseInt(req.query.limit).toString() !== 'NaN') {
            sql += ` LIMIT ${parseInt(req.query.limit)}`;
        }

        const values = [[type]];

        db.query(sql, [values], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }

    //[GET] /api/product/related/:id
    getProductsRelated(req, res) {
        const { id } = req.params;
        let sql =
            'SELECT tb.id, tb.name, tb.price, tb.images, tb.link, tb.stock FROM tb_product AS tb, (SELECT * FROM tb_product WHERE id = ?) AS curr WHERE tb.id <> curr.id AND tb.type = curr.type AND tb.sex = curr.sex AND tb.collection = curr.collection';

        if (parseInt(req.query.limit).toString() !== 'NaN') {
            sql += ` LIMIT ${parseInt(req.query.limit)}`;
        }

        const values = [[id]];

        db.query(sql, [values], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }

    //[GET] /api/product/viewed
    getProductsViewed(req, res) {
        const ids = req.query.id.split(',');
        const sql =
            'SELECT id, name, price, images, link, stock FROM tb_product WHERE id IN ?';
        const values = [ids];

        db.query(sql, [values], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }

    //[GET] /api/product/:slug
    getProductBySlug(req, res) {
        const { slug } = req.params;
        const sql = 'SELECT * FROM tb_product WHERE link = ?;';
        const values = [[slug]];

        db.query(sql, [values], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }

    //[GET] /api/product/collections
    getProductsOfCollections(req, res) {
        let sql =
            'SELECT c.id as collectionId, c.name as collectionName, c.description as collectionDescription, p.id, p.name, p.price, p.link, p.stock, p.images FROM tb_collection AS c, tb_product AS p WHERE c.id = p.collection';

        if (req.query.hasOwnProperty('type')) {
            if (Func.RemoveSpecialCharacters(req.query.type) === 'accessory') {
                sql += " AND type in ('strap', 'bracelet')";
            } else {
                sql += ` AND type = '${Func.RemoveSpecialCharacters(
                    req.query.type
                )}'`;
            }
        }
        if (req.query.hasOwnProperty('sex')) {
            sql += ` AND sex = '${Func.RemoveSpecialCharacters(
                req.query.sex
            )}'`;
        }

        sql += ' ORDER BY c.id DESC, p.id DESC';

        db.query(sql, (err, result) => {
            if (err) throw err;

            const response = [];
            let currID = -1;
            let obj;
            result.map((item, index) => {
                if (item.collectionId !== currID) {
                    if (currID != -1 && item.collectionId !== currID) {
                        response.push(obj);
                    }
                    obj = {
                        id: item.collectionId,
                        name: item.collectionName,
                        description: item.collectionDescription,
                        products: [
                            {
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                link: item.link,
                                stock: item.stock,
                                images: item.images,
                            },
                        ],
                    };
                    currID = item.collectionId;
                } else {
                    obj.products.push({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        link: item.link,
                        stock: item.stock,
                        images: item.images,
                    });
                }
                if (index == result.length - 1) {
                    response.push(obj);
                }
            });

            res.json(response);
        });
    }

    //[GET] /api/product/search
    getProductsSearch(req, res) {
        const { name, slug, limit, offset } = req.query;
        let slugs;
        let sql =
            'SELECT id, name, price, link, stock, images FROM tb_product WHERE 1 = 1';

        if (name) {
            sql += ` AND name LIKE '%${Func.RemoveSpecialCharacters(name)}%' `;
        }

        if (slug) {
            slugs = slug.split(',');
            sql += ` AND link IN ?`;
        }

        sql += ` ORDER BY id DESC`;

        if (parseInt(limit).toString() !== 'NaN') {
            sql += ` LIMIT ${parseInt(limit)}`;
        }
        if (parseInt(offset).toString() !== 'NaN') {
            sql += ` OFFSET ${parseInt(offset)}`;
        }

        const values = [slugs];

        db.query(sql, [values], (err, result) => {
            if (err) throw err;

            res.json(result);
        });
    }

    //[GET] /api/product/detail/:slug
    getProductDetailAndRelated(req, res) {
        const { slug, amount } = req.params;
        let sql = 'SELECT * FROM tb_product WHERE link = ?;';
        sql +=
            'SELECT tb.id, tb.name, tb.price, tb.images, tb.link, tb.stock FROM tb_product AS tb, (SELECT id, type, sex, collection FROM tb_product WHERE link = ?) AS curr WHERE tb.id <> curr.id AND tb.type = curr.type AND tb.sex = curr.sex AND tb.collection = curr.collection';

        sql += ` LIMIT ${parseInt(amount)}`;

        const values = [[slug]];

        db.query(sql, [values, values], (err, result) => {
            if (err) throw err;

            const response = {};
            [response.detail] = [...result[0]];
            response.relatedProducts = result[1];

            res.json(response);
        });
    }

    //[POST] /api/product/add
    addProduct(req, res) {
        const {
            name,
            type,
            collection,
            sex,
            price,
            stock,
            sold,
            view,
            link,
            description,
            features,
            images,
        } = req.body;
        const sql =
            'INSERT INTO tb_product (name, type, collection, sex, price, stock, sold, view, link, description, features, images) VALUES ?';
        const values = [
            [
                name,
                type,
                collection,
                sex,
                price,
                stock,
                sold,
                view,
                link,
                description,
                JSON.stringify(features),
                JSON.stringify(images),
            ],
        ];

        db.query(sql, [values], (err, result) => {
            if (err) throw err;
            res.json('Number of records inserted: ' + result.affectedRows);
        });
    }
}

module.exports = new ProductController();
