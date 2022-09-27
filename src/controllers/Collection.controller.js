const db = require('../config/database');

class CollectionController {
    //[GET] /api/collection
    getAllCollection(req, res) {
        const sql = 'SELECT * FROM tb_collection';

        db.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }

    //[POST] /api/collection/add
    addCollection(req, res) {
        const { collectionName, collectionDescription } = req.body;
        const sql =
            'INSERT INTO tb_collection (collection_name, collection_description) VALUES ?';
        const values = [[collectionName, collectionDescription]];

        db.query(sql, [values], (err, result) => {
            if (err) throw err;
            res.json('Number of records inserted: ' + result.affectedRows);
        });
    }
}

module.exports = new CollectionController();
