import db from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AuthController {
    //[POST] /api/register
    async createAccount(req, res) {
        const { name, email, phone, address, password } = req.body;

        //Check exists email or phone
        const sql = 'SELECT 1 FROM tb_customer WHERE email = ? or phone = ?';
        const isExists = await new Promise((resolve, reject) => {
            db.query(sql, [email, phone], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        if (isExists.length === 0) {
            db.beginTransaction(async err => {
                if (err) {
                    throw err;
                }
                //Insert to tb_customer first.
                const sqlInsertCustomer = 'INSERT INTO tb_customer (name, email, phone, address) VALUES (?, ?, ?, ?)';
                const customerId = await new Promise((resolve, reject) => {
                    db.query(sqlInsertCustomer, [name, email, phone, address], (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                throw err;
                            });
                        }
                        resolve(result.insertId);
                    });
                });

                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(password, salt);

                //Insert to tb_account
                const sqlInsertAccount = 'INSERT INTO tb_account (password, role, customer_id) VALUES (?, ?, ?)';
                db.query(sqlInsertAccount, [hashPassword, 1, customerId], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            throw err;
                        });
                    }
                    //Commit transaction
                    db.commit(err => {
                        if (err) {
                            return db.rollback(function () {
                                throw err;
                            });
                        }

                        res.status(200);
                        res.json({ code: 200, message: 'Create account successfully.' });
                    });
                });
            });
        } else {
            res.status(400);
            res.json({ code: 400, message: 'Email or phone exists.' });
        }
    }

    //[POST] /api/login
    async login(req, res) {
        const { username, password } = req.body;

        try {
            //Get user id by email or phone
            const user = await new Promise((resolve, reject) => {
                let sql = 'SELECT c.id, c.name FROM tb_account a INNER JOIN tb_customer c ON a.customer_id = c.id ';
                sql += 'WHERE email = ? OR phone = ?';

                db.query(sql, [username, username], (err, result) => {
                    if (err) reject(err);
                    resolve(...result);
                });
            });

            //Get password if exists user
            if (user) {
                const account = await new Promise((resolve, reject) => {
                    let sql = 'SELECT password, role FROM tb_account WHERE customer_id = ?';
                    db.query(sql, [user.id], (err, result) => {
                        if (err) reject(err);
                        resolve(...result);
                    });
                });

                //Check password match
                const isPasswordMatch = bcrypt.compareSync(password, account.password);

                if (isPasswordMatch) {
                    const userToken = {
                        id: user.id,
                        name: user.name,
                        role: account.role,
                    };

                    //Create token
                    const token = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

                    res.status(200);
                    res.json({
                        status: 'loginSuccess',
                        message: 'Login successfully.',
                        accessToken: token,
                    });
                } else {
                    res.status(401);
                    res.send({ status: 'wrongPassword', message: 'Wrong password.' });
                }
            } else {
                res.status(401);
                res.send({ status: 'invalidUser', message: 'Email or phone not exists.' });
            }
        } catch (err) {
            console.log(err);
            res.status(500);
            res.json({});
        }
    }
}

export default new AuthController();
