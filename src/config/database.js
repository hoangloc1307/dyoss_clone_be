const mysql = require('mysql');

const DATABASE_URL =
    'mysql://0wr178losjt4mllxjt67:pscale_pw_otrCXD1z16fJpDhR0aQ0NT72p68bEPPI8kn7IovBCuk@ap-southeast.connect.psdb.cloud/dyoss-clone-db?ssl={"rejectUnauthorized":true}';

const con = mysql.createConnection({
    host: 'ap-southeast.connect.psdb.cloud',
    database: 'dyoss-clone-db',
    user: 'xhgon2fqxdvsusevnfx2',
    password: 'pscale_pw_RRB7DCbUOJoJ6dqSVGa99xNM5xbMy9dTYSrpXx3azUp',
    multipleStatements: true,
    ssl: {
        rejectUnauthorized: true,
    },
});

con.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
});

module.exports = con;
