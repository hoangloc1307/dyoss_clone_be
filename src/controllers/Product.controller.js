const db = require('../config/database');
const Func = require('../functions');

class ProductController {
    //[GET] /api/product
    getProducts(req, res) {
        const params = [];
        let sql = 'SELECT ';

        // COLUMN
        if (req.query.hasOwnProperty('column')) {
            const value = Func.RemoveSpecialCharacters(req.query.column.toLowerCase());
            sql += value;
        } else {
            sql += '*';
        }

        //WHERE
        sql += ' FROM tb_product WHERE 1 = 1';
        if (req.query.hasOwnProperty('id')) {
            const value = Func.RemoveSpecialCharacters(req.query.id.toLowerCase());
            params.push([value.split(',')]);
            sql += ' AND id IN ?';
        }
        if (req.query.hasOwnProperty('name')) {
            const value = Func.RemoveSpecialCharacters(req.query.name.toLowerCase());
            params.push(`%${value}%`);
            sql += ' AND name LIKE ?';
        }
        if (req.query.hasOwnProperty('type')) {
            const value = Func.RemoveSpecialCharacters(req.query.type.toLowerCase());
            params.push([value.split(',')]);
            sql += ' AND type IN ?';
        }
        if (req.query.hasOwnProperty('collection')) {
            const value = Func.RemoveSpecialCharacters(req.query.collection.toLowerCase());
            params.push([value.split(',')]);
            sql += ' AND collection IN ?';
        }
        if (req.query.hasOwnProperty('sex')) {
            const value = Func.RemoveSpecialCharacters(req.query.sex.toLowerCase());
            params.push(value);
            sql += ' AND sex = ?';
        }
        if (req.query.hasOwnProperty('priceMin')) {
            const value = Func.RemoveSpecialCharacters(req.query.priceMin.toLowerCase());
            const num = parseInt(value) || 0;
            params.push(num);
            sql += ' AND price > ?';
        }
        if (req.query.hasOwnProperty('priceMax')) {
            const value = Func.RemoveSpecialCharacters(req.query.priceMax.toLowerCase());
            const num = parseInt(value) || 0;
            params.push(num);
            sql += ' AND price < ?';
        }
        if (req.query.hasOwnProperty('inStock')) {
            const value = Func.RemoveSpecialCharacters(req.query.inStock.toLowerCase());
            switch (value) {
                case 'true':
                    sql += ' AND stock > 0';
                    break;
                case 'false':
                    sql += ' AND stock = 0';
                    break;
                default:
                    const num = parseInt(value) || 0;
                    params.push(num);
                    sql += ' AND stock >= ?';
            }
        }
        if (req.query.hasOwnProperty('link')) {
            const value = Func.RemoveSpecialCharacters(req.query.link.toLowerCase());
            params.push([value.split(',')]);
            sql += ' AND link IN ?';
        }

        //ORDER BY
        if (req.query.hasOwnProperty('orderBy')) {
            const value = Func.RemoveSpecialCharacters(req.query.orderBy.toLowerCase());
            const orderString = value.replaceAll('.', ' ');
            sql += ` ORDER BY ${orderString}`;
        }

        //LIMIT
        if (req.query.hasOwnProperty('limit')) {
            const value = Func.RemoveSpecialCharacters(req.query.limit.toLowerCase());
            const [limitString, offsetString] = value.split(',');
            const limit = parseInt(limitString) || 0;
            const offset = parseInt(offsetString) || 0;
            params.push(limit, offset);
            sql += ' LIMIT ? OFFSET ?';
        }

        db.query(sql, params, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }

    //[GET] /api/product/detail/:slug/:amount
    getProductDetailAndRelated(req, res) {
        const { slug, amount } = req.params;
        let sql = 'SELECT * FROM tb_product WHERE link = ?;';
        sql += 'SELECT tb.id, tb.name, tb.price, tb.images, tb.link, tb.stock FROM tb_product AS tb, ';
        sql += '(SELECT id, type, sex, collection FROM tb_product WHERE link = ?) AS curr ';
        sql += 'WHERE tb.id <> curr.id AND tb.type = curr.type AND tb.sex = curr.sex ';
        sql += 'AND tb.collection = curr.collection ORDER BY RAND() ';
        sql += `LIMIT ${parseInt(amount)}`;

        const values = [[slug]];
        db.query(sql, [values, values], (err, result) => {
            if (err) throw err;

            const response = {};
            [response.detail] = [...result[0]];
            response.relatedProducts = result[1];

            res.json(response);
        });
    }

    //[GET] /api/product/options/:slug
    async getProductOptions(req, res) {
        const { slug } = req.params;
        const params = [slug];
        let sql = 'SELECT options FROM tb_product_box tpb INNER JOIN tb_product tp ';
        sql += 'ON tpb.product_id = tp.id WHERE link = ?';

        const options = await new Promise((resolve, reject) => {
            db.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result[0]?.options);
            });
        });

        if (options) {
            const listId = options.split(',');

            sql = 'SELECT id, name, images, type FROM tb_product WHERE id IN ?';
            db.query(sql, [[listId]], (err, result) => {
                if (err) throw err;
                const opt = { watch: [], strap: [] };
                result.map(item => {
                    if (item.type === 'watch') {
                        opt.watch.push(item);
                    }
                    if (item.type === 'strap') {
                        opt.strap.push(item);
                    }
                });
                res.json(opt);
            });
        } else {
            res.json([]);
        }
    }

    //[GET] /api/product/collections
    getProductsOfCollections(req, res) {
        const params = [];
        let sql = 'SELECT c.id as collectionId, c.name as collectionName, c.description as collectionDescription, ';
        sql += 'p.id, p.name, p.price, p.link, p.stock, p.images FROM tb_collection AS c, tb_product AS p ';
        sql += 'WHERE c.id = p.collection';

        if (req.query.hasOwnProperty('type')) {
            const value = Func.RemoveSpecialCharacters(req.query.type.toLowerCase());
            params.push([value.split(',')]);
            sql += ' AND type IN ?';
        }
        if (req.query.hasOwnProperty('sex')) {
            const value = Func.RemoveSpecialCharacters(req.query.sex);
            params.push(value);
            sql += ` AND sex = ?`;
        }

        sql += ' ORDER BY c.id DESC, p.id DESC';

        db.query(sql, params, (err, result) => {
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

    //[POST] /api/product/add
    addProduct(req, res) {
        const { name, type, collection, sex, price, stock, sold, view, link, description, features, images } = req.body;
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
