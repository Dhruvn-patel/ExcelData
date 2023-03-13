const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');
const { ejs } = require('ejs');
const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "job_new"
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = 6050;
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
app.get('/', async (req, res) => {
    var query = await queryExecuter(`select * from excal_table `);
    // console.log(query);
    res.render('index.ejs', { showdata: query });
})

app.post('/adddata', async(req, res) => {

    const data_arr = req.body;
    
    const id=data_arr.id;
     console.log(id);
    var fname = data_arr.data[0];
    var lname = data_arr.data[1];
    var contact = data_arr.data[2];
    var email = data_arr.data[3];
  
    if(id=='savedata')
    {
        var result = await queryExecuter(`insert into excal_table(fname,lname,contact,email) values('${fname}','${lname}','${contact}','${email}')`)
        res.json({hi : "hi"});

    }
    else
    {
        queryExecuter(`update excal_table set fname='${fname}' ,lname='${lname}',contact='${contact}',email='${email}' where id='${id}'`);
        res.json({hi : "hi"});
    }
   
})
app.post('/updatedata/:id',async(req,res)=>{
    const id=req.params.id;
    const data_arr = req.body;
    var fname = data_arr.data[0];
    var lname = data_arr.data[1];
    var contact = data_arr.data[2];
    var email = data_arr.data[3];
     console.log({fname,lname,contact,email});

    queryExecuter(`update excal_table set fname='${fname}' ,lname='${lname}',contact='${contact}',email='${email}' where id='${id}'`);
    res.json({hi : "hi"});
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})

connection.connect();

