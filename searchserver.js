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

const PORT = 7050;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var data = [];
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
app.get('/form', (req, res) => {

    connection.query(`select state_master_tb.state,state_master_tb.id from state_master_tb ;`, (err, results1) => {
        connection.query(`select option_master.value from option_master where s_id=2;`, (err, results2) => {
            connection.query(`select option_master.value from option_master where s_id=3;`, (err, results3) => {
                connection.query(`select option_master.value from option_master where s_id=4;`, (err, results4) => {

                    connection.query(`select option_master.value from option_master where s_id=5;`, (err, results5) => {
                        connection.query(`select option_master.value from option_master where s_id=6;`, (err, results6) => {

                            connection.query(`select option_master.value from option_master where s_id=7;`, (err, results7) => {
                                res.render('searchapp.ejs', { data_option: results1, relation_option: results2, course_option: results3, lang: results4, tech: results5, loc: results6, dep: results7 });

                            })

                        })
                    })
                })
            })
        })
    })

})

app.post('/jobform', (req, res) => {

    const { fname, lname, email_name, Designation, Address1, Address2, phone_name, city_name, state_name, gender, RelationShip, date_name, zipcode_name } = req.body;

    query_details = `insert into basic_details(first_name,last_name,designation,address1,address2,email,phone_num,state,gender,zipcode,realtionship,date,city,isdelete) values("${fname}","${lname}","${Designation}","${Address1}","${Address2}","${email_name}","${phone_name}","${state_name}","${gender}","${zipcode_name}","${RelationShip}","${date_name}","${city_name}","${0}");`

    connection.query(query_details, (err, result) => {

        if (err) console.log(err.message);
        // console.log("added Basic");
        var c_id = result.insertId;
        console.log(result);




        const { course, board, passingyear, percentage } = req.body;

        query_val = "";
        console.log(typeof (course));
        if (typeof (course) == "string") {
            query_val = `insert into edu_detail (c_name,board_name,pass_year,percentage,c_id) values('${course}','${board}','${passingyear}','${percentage}','${c_id}');`

            connection.query(query_val, (err, result) => {
                if (err) console.log(err.message);
                // console.log("added edu_detail");
            });
        }
        else {
            for (let i = 0; i < course.length; i++) {
                query_val = `insert into edu_detail (c_name,board_name,pass_year,percentage,c_id) values('${course[i]}','${board[i]}','${passingyear[i]}','${percentage[i]}','${c_id}');`
                connection.query(query_val, (err, result) => {
                    if (err) console.log(err.message);
                    // console.log("added edu_detail");
                });

            }
        }



        const { php, laravel, Oracle, Mysql, level0, level1, level2, level3 } = req.body;
        const tech_arr = [php, laravel, Oracle, Mysql];
        const level = [level0, level1, level2, level3];
        for (let i = 0; i < tech_arr.length; i++) {


            if (typeof (tech_arr[i]) == "string" && typeof (level[i]) == "string") {
                query_tech = `insert into tech_table (tech_name,level,c_id) values('${tech_arr[i]}','${level[i]}','${c_id}');`
                connection.query(query_tech, (err, result) => {
                    if (err) console.log(err.message);
                    // console.log(query_tech);
                });
            }
        }




        // connection.query(`select value from option_master where s_id=5;`, (err, result) => {
        //     var tech_arr;
        //     var level;

        //     for (let i = 0; i < result.length; i++) {
        //         tech_arr = req.body
        //         level = req.body["r" + i];
        //         // console.log(tech_arr);
        //         console.log(tech_arr);

        //     }
        // })


        connection.query(`select value from option_master where s_id=4;`, (err, result) => {
            var query_lan;
            for (let i = 0; i < result.length; i++) {

                var vj = req.body[result[i].value];
                var r = req.body[result[i].value + "r"];
                var w = req.body[result[i].value + "w"];
                var s = req.body[result[i].value + "s"];
                if (typeof (r) == "undefined") r = "0";
                if (typeof (w) == "undefined") w = "0";
                if (typeof (s) == "undefined") s = "0";

                if (typeof (vj) == "string") {
                    query_lan = `insert into lang_table (lang_name,read_name,write_name,speak_name,c_id) values('${vj}','${r}','${w}','${s}','${c_id}');`;

                    // console.log(query_lan);

                    connection.query(query_lan, (err, results) => {
                        if (err) console.log(err.message);
                        // console.log("inserted lang_table");
                    })
                }
            }
        })


        const { company_name, designation_name, from_date, to_date } = req.body;
        var query_val1 = "";

        if (typeof (company_name) == "string") {
            query_val1 = `insert into work_table (c_name,designation,from_name,to_name,c_id) values('${company_name}','${designation_name}','${from_date}','${to_date}','${c_id}');`
            connection.query(query_val1, (err, results) => {
                if (err) console.log(err.message);
                console.log("inserted exp");
            })

        }
        else {
            for (let i = 0; i < company_name.length; i++) {
                query_val1 = `insert into work_table (c_name,designation,from_name,to_name,c_id) values('${company_name[i]}','${designation_name[i]}','${from_date[i]}','${to_date[i]}','${c_id}');`
                connection.query(query_val1, (err, results) => {
                    if (err) console.log(err.message);

                })
            }
        }
        // console.log(query_val1);

        const { referance, contact, relation } = req.body;
        var query_val2 = "";

        if (typeof (referance) == "string") {
            query_val2 = `insert into ref_table (name_ref,contact,relation,c_id) values('${referance}','${contact}','${relation}','${c_id}');`
            connection.query(query_val2, (err, results) => {
                if (err) console.log(err.message);
                // console.log("inserted ref");
            })

        }
        else {
            for (let i = 0; i < referance.length; i++) {
                query_val2 = `insert into ref_table (name_ref,contact,relation,c_id) values('${referance[i]}','${contact[i]}','${relation[i]}','${c_id}');`
                connection.query(query_val2, (err, results) => {
                    if (err) console.log(err.message);
                    // console.log("inserted ref");
                })

            }
        }


        const { location_name, notice_period, expected, current, department_name } = req.body;

        var query_val3;
        query_val3 = `insert into prefed_table (prefed_loc,notice_per,dept,curr_ctc,expected_ctc,c_id) values('${location_name}','${notice_period}','${department_name}','${current}','${expected}','${c_id}');`
        connection.query(query_val3, (err, results) => {
            if (err) console.log(err.message);
            // console.log("added prefed location");
        });

        res.redirect('/srch/datashow');

    })
})
app.get('/datashow', (req, res) => {

    connection.query(`select * from job_new.basic_details where isdelete="${0}";`, (err, results1) => {
        res.render('searchmain.ejs', { basic_table: results1, serachV: " " });

    })
})
app.get('/search', (req, res) => {
    searchVal = req.query.searchVal;
    console.log(searchVal);
    if (searchVal != " ") {
        optrVal = req.query.options;
        console.log(optrVal);
        let symbol = ['^', '$', '%', '~', '_'];
        let newStr = "";
        var count = 0;
        for (var i = 0; i < searchVal.length; i++) {
            if (symbol.includes(searchVal[i])) {
                newStr += " " + searchVal[i];
                count++;
            }
            else {
                newStr += searchVal[i];
            }
        }
        var spiltarr = newStr.split(' ');

        var queryans = "where";
        console.log("Count total :  ", count);
        for (let val of spiltarr) {
            if (val[0] == "$") {

                count--;
                if (count)
                    queryans += ` last_name LIKE '${val.slice(1)}%' ${optrVal}`
                else
                    queryans += ` last_name LIKE '${val.slice(1)}%'`
            }
            else if (val[0] == "^") {

                count--;
                if (count)
                    queryans += ` first_name LIKE '${val.slice(1)}%' ${optrVal}`
                else
                    queryans += ` first_name LIKE '${val.slice(1)}%'`

            }
            else if (val[0] == "~") {
                // count--;
                console.log("Count  :  ", count);
                if (count)
                    queryans += ` phone_num LIKE '${val.slice(1)}' ${optrVal}`
                else
                    queryans += ` phone_num LIKE '${val.slice(1)}'`

            }
            else if (val[0] == "_") {
                count--;
                if (count)
                    queryans += ` city LIKE '${val.slice(1)}%' ${optrVal}`
                else
                    queryans += ` city LIKE '${val.slice(1)}%'`
            }
            else if (val[0] == "%") {
                count--;
                console.log(val.slice(1));
                if (count)
                    queryans += ` email LIKE '${val.slice(1)}%' ${optrVal}`
                else
                    queryans += ` email LIKE '${val.slice(1)}%'`
            }
        }
        console.log(queryans);
        if (queryans == "where")
            queryans = "";
        connection.query(`select * from job_new.basic_details ${queryans};`, (err, results) => {
            res.render('searchmain.ejs', { basic_table: results, serachV: searchVal });
        })
    }

});

app.get('/all/state', async (req, res) => {

    var sname = req.query.state_name;
    console.log("name " + sname);
    if (sname.length != 0) {
        var sid = await queryExecuter(`select id from state_master_tb where state='${sname}'`);
        console.log("sid  " + sid.length);

        connection.query(`select city_name from city_table where s_id=${sid[0]['id']}`, (err, result) => {

            return res.json({ result });
        })
    }
})

app.get('/deleterecord/:id', (req, res) => {
    var r_id = req.params.id;
    console.log(r_id);
    connection.query(`update basic_details set isdelete="${1}" where id="${r_id}"`, (err, result) => {
        return res.json({ result });

    })
    // connection.query(`select id from basic_details where id `)s
})
// app.listen(PORT, () => {
//     console.log(`http://localhost:${PORT}/form`);
// })

connection.connect();
module.exports = app;

// onchange="mydeleteall1(this)"