const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const path = require('path');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');
const { ejs } = require('ejs');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var randomstring = require("randomstring");

dotenv.config({ path: "./.env" });
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
const myCustomMiddleware = require('./middlewares/middle1.js')
const pagination = require('./pagination.js');
app.use('/pagination', myCustomMiddleware, pagination);
async function queryExecuter(query) {
    return new Promise((resolve, rejects) => {
        connection.query(query, (err, result) => {
            if (err) {
                rejects(err);
            }
            resolve(result);
        });
    })
}

const jobform = require('./jobform.js')
app.use('/jobformdetail', myCustomMiddleware, jobform);


const excal = require('./excalserver.js');
app.use('/excaldata', myCustomMiddleware, excal);


const searchval = require('./searchserver.js');
app.use('/srch', searchval);



const connection = mysql2.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
connection.connect((err) => {
    if (err) {
        console.log("Error connecting to database");
    }
    else {
        console.log("Connected to database");
    }
});


const PORT = process.env.DATABASE_PORT;
app.get('/login', (req, res) => {
    let err = false;
    // res.clearCookie('token_value');
    res.render('login', { flag1: '', flag2: '', err });
})


app.post('/login', async (req, res) => {

    try {

        if (req.headers.cookie === undefined) {
            const { email, password } = req.body;
            let query = `select * from jwt_token_tb where email='${email}'`;
            let result = await queryExecuter(query);
            // console.log(result);
            if (result.length > 0) {
                let db_pass = result[0].password;
                let userdata = result[0];
                bcrypt.compare(password, db_pass).then(function (result) {
                    // console.log(result);
                    if (result) {
                        const token = jwt.sign({ userdata }, process.env.SECRET_KEY);

                        res.cookie('token_value', token)
                        res.redirect('/home')

                    }
                    else {
                        // return res.status(401).send('Invalid credentials');
                        res.clearCookie('token_value');
                        res.render('login', {})
                    }

                });

            }
            else {
                let err = true;
                res.render('login', { err })

            }
        }
        else {
            let err = true;
            res.render('login', { err });
        }


    }
    catch (err) {
        throw err;
    }

})
app.get('/checkout', (req, res) => {
    res.clearCookie('token_value');
    let err = false;
    res.render('login', { err })
})
app.get('/verfiy', async (req, res) => {
    const id = req.query.id;

    const query = await queryExecuter(`update Job_application_form.jwt_token_tb set isverfiy='${1}' where id='${id}'`)
    console.log(query);
    if (query) {
        res.redirect('/login');
    }
})
app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/signup', async (req, res) => {


    const { name, email, password } = req.body;

    const hashPassword = await bcrypt.hashSync(password, 10);


    if (!(email && password && name)) {
        return res.status(401).send('please input all details');
    }

    let checkExists = await queryExecuter(`select email from jwt_token_tb where email='${email}' `);

    if (checkExists.length == 0) {
        const query = `insert into jwt_token_tb(name,email,password,isverfiy) values('${name}','${email}','${hashPassword}',0)`;
        const result = await queryExecuter(query);


        const random_text = randomstring.generate({
            length: 12,
            charset: 'alphabetic'
        });
        const id = result.insertId;
        // console.log(id);
        const url_gen = `https://www.randomgen.com//${random_text}`;
        const activation = false;
        res.render('verfiy', { activation: activation, url_gen: url_gen, userid: id })

    }
    else {
        let err = true;
        res.render('signup', { err });
    }

});

app.post('/checklogiemail', async (req, res) => {
    const { email } = req.body;

    console.log(email);


    const result = await queryExecuter(`select * from jwt_token_tb where email='${email}';`);
    console.log(result);
    if (!(result.length === 0)) {

        // const hashPassword = await bcrypt.compare(pass, result[0]['password']);
        // if (hashPassword) {

        //     const token = jwt.sign({ userdata }, process.env.SECRET_KEY);
        //     res.cookie('token_value', token)
        //     res.json({ message: '' })
        //     res.redirect('/home');
        // }
        // else
        // {
        //     res.json({ message: 'Email / password not match !', status: 404 })
        // }

        res.json({ message: '' })


    }
    else {
        res.json({ message: 'Email / password not match !', status: 404 })

    }

})

app.get('/home', async (req, res) => {

    const token = await req.cookies['token_value'];
    if (token) {
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        res.render('home', { user: verified.userdata });

    }
    else {

        res.redirect('/login')
    }

})


app.post('/checkname', async (req, res) => {
    const { name } = req.body;
    let check = await queryExecuter(`select name from jwt_token_tb where name='${name}' `);

    // console.log(check.length);

    if (check.length === 0) {
        res.json({ message: '' })

    }
    else {
        res.json({ message: 'Username is already registered !', status: 404 })
    }

})
app.post('/checkemail', async (req, res) => {

    const { email } = req.body;
    // console.log(email);
    let check = await queryExecuter(`select email from jwt_token_tb where email='${email}' `);

    // console.log(check.length);

    if (check.length === 0) {
        res.json({ message: '' })

    }
    else {
        res.json({ message: 'Email is already registered', status: 404 })
    }


})

app.post('/checkpass', async (req, res) => {

    const { password, email } = req.body;
    // console.log(password);

    let result = await queryExecuter(`select * from jwt_token_tb where email='${email}' `);
    let check = await bcrypt.compare(password, result[0].password);
    console.log(check);

    if (!check) {
        res.json({ message: 'Password is not match', status: 404 })

    }
    else {
        res.json({ message: '' })
    }


})

app.get('/calc', myCustomMiddleware, async (req, res) => {
    res.sendFile(path.join(__dirname, 'calcal', 'index.html'));
})

app.get('/tictoc', myCustomMiddleware, async (req, res) => {
    res.sendFile(path.join(__dirname, 'tic-toc-tic', 'index.html'));
}
)

app.get('/colorcube', myCustomMiddleware, async (req, res) => {
    res.sendFile(path.join(__dirname, '30-1-23-color-chge', 'index.html'));
})


app.use(express.static(path.join(__dirname, '1-03-2023-figma1')));
app.get('/figma1', myCustomMiddleware, async (req, res) => {
    res.sendFile(path.join(__dirname, '1-03-2023-figma1', 'index.html'));
})

app.use(express.static(path.join(__dirname, '6-03-2023-figma2')));
app.get('/figma2', myCustomMiddleware, async (req, res) => {
    res.sendFile(path.join(__dirname, '6-03-2023-figma2', 'index.html'));
})

app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`http://localhost:${PORT}/home`);
})