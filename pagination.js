const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');
const { render } = require('ejs');
const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "studentDb"
})
const PORT = 5023;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/page', (req, res) => {
    console.log("page called");
    var pid = req.params.id || 1;
    var limit = 10;
    var offset = (pid - 1) * limit;


    if (offset < 0)
        offset = 0;
    console.log(pid);
    // const searchTerm = req.query.searchTerm || '';   
    // console.log(searchTerm);

    var count;
    var total_cnt;
    connection.query(` select count(st_table.student_id) as total from studentDb.st_table `, (err, results) => {
        count = results;
        total_cnt = count[0]['total'];
        console.log(`select * from st_table order by student_id LIMIT ${offset},${limit}`);
        connection.query(`select * from st_table order by student_id LIMIT ${offset},${limit}`, (err, result) => {
            var page = pid;
            var next, prev;
            if (page >= (total_cnt) / limit) {
                page = 0;
            }
            next = Number(page) + 1;
            prev = page - 1;
            if (prev == 0) {
                prev = 1;
            }


            if (err) throw err;

            res.render('pagination.ejs', { data: result, prev: prev, next: next, id: pid });
            // return res.json({result});
            //  res.redirect('/page/data/:id');
        })
    })


});
app.get('/page/data/:id', (req, res) => {
    var pid = req.params.id || 1;
    var limit = 10;
    var offset = (pid - 1) * limit;

    // const searchTerm = req.query.searchTerm || '';
    // console.log(searchTerm);

    var count;
    var total_cnt;
    connection.query(` select count(st_table.student_id) as total from studentDb.st_table `, (err, results) => {
        count = results;
        total_cnt = count[0]['total'];
        console.log(`select * from st_table order by student_id LIMIT ${offset},${limit}`);
        connection.query(`select * from st_table order by student_id LIMIT ${offset},${limit}`, (err, result) => {
            var page = pid;
            var next, prev;
            if (page >= (total_cnt) / limit) {
                page = 0;
            }
            next = Number(page) + 1;
            prev = page - 1;
            if (prev == 0) {
                prev = 1;
            }

            if (err) throw err;
            return res.json({ result });

            // res.render('page_idx.ejs', { data: result, prev: prev, next: next, id: pid });
        })
    })
})

// app.listen(PORT, () => {
//     console.log(`http://localhost:${PORT}/page`);
// })
connection.connect();

module.exports = app;
