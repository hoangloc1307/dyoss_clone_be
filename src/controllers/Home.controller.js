import db from '../config/database.js';

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

    async newsletter(req, res) {
        const { email } = req.body;

        try {
            const existsEmail = await new Promise((resolve, reject) => {
                const sql = 'SELECT email FROM tb_newsletter WHERE email = ?';

                db.query(sql, [email], (err, result) => {
                    if (err) reject(err);

                    resolve(...result);
                });
            });
            if (existsEmail) {
                res.status(400);
                res.json({ status: 'existsEmail', message: 'Email exists.' });
            } else {
                const sql = 'INSERT INTO tb_newsletter (email) VALUES (?)';
                db.query(sql, [email], (err, result) => {
                    if (err) throw err;

                    res.status(200);
                    res.json({ status: 'success', message: 'Follow newsletter successfully.' });
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500);
            res.json({});
        }
    }
}

export default new HomeController();
