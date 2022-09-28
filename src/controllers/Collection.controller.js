const db = require('../config/database');

class CollectionController {
    //[GET] /api/collection
    getCollections(req, res) {
        const sql = 'SELECT * FROM tb_collection';

        db.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }

    //[POST] /api/collection/add
    addCollection(req, res) {
        const { name, description } = req.body;
        const sql = 'INSERT INTO tb_collection (name, description) VALUES ?';
        const values = [[name, description]];

        db.query(sql, [values], (err, result) => {
            if (err) throw err;
            res.json('Number of records inserted: ' + result.affectedRows);
        });
    }
}

module.exports = new CollectionController();
