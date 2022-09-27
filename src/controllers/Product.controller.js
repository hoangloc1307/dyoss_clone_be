const db = require('../config/database');

class ProductController {
    //[GET] /api/product
    getAllProduct(req, res) {
        const sql = 'SELECT * FROM tb_product';

        db.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }

    //[GET] /api/product/selling-watch
    getSellingWatchs(req, res) {
        res.send('get selling watchs');
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
