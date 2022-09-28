const db = require('../config/database');

class HomeController {
    //[GET] /api/home
    index(req, res) {
        let sql =
            "SELECT id, name, price, images, link, stock from tb_product WHERE type = 'watch' ORDER BY sold DESC LIMIT 3;";

        sql +=
            "SELECT id, name, price, images, link, stock from tb_product WHERE type = 'watch' AND stock > 0 AND sex = 'M' ORDER BY view DESC LIMIT 5;";

        sql +=
            "SELECT id, name, price, images, link, stock from tb_product WHERE type = 'watch' AND stock > 0 AND sex = 'W' ORDER BY view DESC LIMIT 5;";

        db.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }
}

module.exports = new HomeController();
