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

const PORT = 8050;


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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var data = [];
app.get('/form', async (req, res) => {

    const results1 = await queryExecuter(`select state_master_tb.state,state_master_tb.id from state_master_tb ;`);
    const results2 = await queryExecuter(`select option_master.value from option_master where s_id=2;`);
    const results3 = await queryExecuter(`select option_master.value from option_master where s_id=3;`);
    const results4 = await queryExecuter(`select option_master.value from option_master where s_id=4;`);
    const results5 = await queryExecuter(`select option_master.value from option_master where s_id=5;`);
    const results6 = await queryExecuter(`select option_master.value from option_master where s_id=6;`);
    const results7 = await queryExecuter(`select option_master.value from option_master where s_id=7;`);

    // console.log(results4);
    res.render('jobformapp.ejs', { data_option: results1, relation_option: results2, course_option: results3, lang: results4, tech: results5, loc: results6, dep: results7 });
})

app.post('/jobform', async (req, res) => {

    const { fname, lname, email_name, Designation, Address1, Address2, phone_name, city_name, state_name, gender, RelationShip, date_name, zipcode_name } = req.body;

    query_details = `insert into basic_details(first_name,last_name,designation,address1,address2,email,phone_num,state,gender,zipcode,realtionship,date,city,isdelete) values("${fname}","${lname}","${Designation}","${Address1}","${Address2}","${email_name}","${phone_name}","${state_name}","${gender}","${zipcode_name}","${RelationShip}","${date_name}","${city_name}","${0}");`

    connection.query(query_details, (err, result) => {

        if (err) console.log(err.message);
        // console.log("added Basic");
        var c_id = result.insertId;
        // console.log(result);




        const { course, board, passingyear, percentage } = req.body;

        query_val = "";
        // console.log(typeof (course));
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


        connection.query(`select value from option_master where s_id=5;`, (err, result4) => {
            for (var i = 0; i < result4.length; i++) {
                var tech = req.body[result4[i].value];
                var techr = req.body[result4[i].value + 'r'];
                console.log(techr);
                // if (tech == 'undefined') { }
                // else {
                //     if (techr == 'undefined') {
                //         techr = "-";
                //     }
                //     var sql7 = `insert into tech_table(tech_name,level,c_id) VALUES("${tech}","${techr}","0${c_id}")`;
                //     var r7 = queryExecuter(sql7)
                // }

                if (tech != undefined && techr != undefined)
                    //  { }
                    // else {
                    //     if (techr == 'undefined') {
                    //         techr = "-";
                    //     }
                    var sql7 = `insert into tech_table(tech_name,level,c_id) VALUES("${tech}","${techr}","${bid}")`;
                var r7 = queryExecuter(sql7)
                // }
            }
        })


        connection.query(`select value from option_master where s_id=4;`, (err, result) => {
            var query_lan;
            for (let i = 0; i < result.length; i++) {

                var vj = req.body[result[i].value];
                var r = req.body[result[i].value + "r"];
                var w = req.body[result[i].value + "w"];
                var s = req.body[result[i].value + "s"];
                if (vj == 'undefined') {

                }
                else {
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

        res.redirect('/jobformdetail/datashow');

    })
})


app.post('/editform', async (req, res) => {

    const { fname, lname, email_name, Designation, Address1, Address2, phone_name, city_name, state_name, gender, RelationShip, date_name, zipcode_name, bid } = req.body;
    // console.log(state_name);
    query_details = `update basic_details set first_name="${fname}",last_name ="${lname}",designation="${Designation}",address1="${Address1}",address2="${Address2}",email="${email_name}",
    phone_num="${phone_name}",state="${state_name}",gender="${gender}",zipcode="${zipcode_name}",realtionship="${RelationShip}",date="${date_name}",city="${city_name}" where id="${bid}"`;
    // console.log(query_details); 
    var result = await queryExecuter(query_details);




    await queryExecuter(`delete from edu_detail where c_id='${bid}'`)
    const { course, board, passingyear, percentage } = req.body;
    // console.log({ course, board, passingyear, percentage });
    var query_val = "";

    if (typeof (course) == "string") {
        query_val = `insert into edu_detail (c_name,board_name,pass_year,percentage,c_id) values('${course}','${board}','${passingyear}','${percentage}','${bid}');`
        // console.log(query_val);
        await queryExecuter(query_val);
    }
    else {
        for (let i = 0; i < course.length; i++) {
            query_val = `insert into edu_detail (c_name,board_name,pass_year,percentage,c_id) values('${course[i]}','${board[i]}','${passingyear[i]}','${percentage[i]}','${bid}');`
            await queryExecuter(query_val);
            // console.log(query_val);
        }
    }


    await queryExecuter(`delete from work_table where c_id='${bid}'`)
    const { company_name, designation_name, from_date, to_date } = req.body;
    var query_val1 = "";

    if (typeof (company_name) == "string") {

        query_val1 = `insert into work_table (c_name,designation,from_name,to_name,c_id) values('${company_name}','${designation_name}','${from_date}','${to_date}','${bid}');`
        await queryExecuter(query_val1)

    }
    else {
        for (let i = 0; i < company_name.length; i++) {
            query_val1 = `insert into work_table (c_name,designation,from_name,to_name,c_id) values('${company_name[i]}','${designation_name[i]}','${from_date[i]}','${to_date[i]}','${bid}');`

            await queryExecuter(query_val1)
        }
    }


    await queryExecuter(`delete from tech_table where c_id='${bid}'`)
    var result4 = await queryExecuter(`select value from option_master where s_id=5;`);

    for (var i = 0; i < result4.length; i++) {
        var tech = req.body[result4[i].value];
        var techr = req.body[result4[i].value + 'r'];
        console.log(techr);
        if (tech != undefined && techr != undefined)
            //  { }
            // else {
            //     if (techr == 'undefined') {
            //         techr = "-";
            //     }
            var sql7 = `insert into tech_table(tech_name,level,c_id) VALUES("${tech}","${techr}","${bid}")`;
        var r7 = await queryExecuter(sql7)
        // }
    }
    await queryExecuter(`delete from ref_table where c_id='${bid}'`)
    const { referance, contact, relation } = req.body;
    var query_val2 = "";

    if (typeof (referance) == "string") {
        query_val2 = `insert into ref_table (name_ref,contact,relation,c_id) values('${referance}','${contact}','${relation}','${bid}');`
        connection.query(query_val2, (err, results) => {
            if (err) console.log(err.message);
            // console.log("inserted ref");
        })

    }
    else {
        for (let i = 0; i < referance.length; i++) {
            query_val2 = `insert into ref_table (name_ref,contact,relation,c_id) values('${referance[i]}','${contact[i]}','${relation[i]}','${bid}');`
            connection.query(query_val2, (err, results) => {
                if (err) console.log(err.message);
                // console.log("inserted ref");
            })

        }
    }


    await queryExecuter(`delete from lang_table where c_id='${bid}'`)
    connection.query(`select value from option_master where s_id=4;`, (err, result) => {
        var query_lan;
        for (let i = 0; i < result.length; i++) {

            var vj = req.body[result[i].value];
            var r = req.body[result[i].value + "r"];
            var w = req.body[result[i].value + "w"];
            var s = req.body[result[i].value + "s"];
            if (vj == 'undefined') {

            }
            else {
                if (typeof (r) == "undefined") r = "0";
                if (typeof (w) == "undefined") w = "0";
                if (typeof (s) == "undefined") s = "0";

                if (typeof (vj) == "string") {
                    query_lan = `insert into lang_table (lang_name,read_name,write_name,speak_name,c_id) values('${vj}','${r}','${w}','${s}','${bid}');`;

                    // console.log(query_lan);

                    connection.query(query_lan, (err, results) => {
                        if (err) console.log(err.message);
                        // console.log("inserted lang_table");
                    })
                }
            }
        }
    })

    await queryExecuter(`delete from prefed_table where c_id='${bid}'`)
    const { location_name, notice_period, expected, current, department_name } = req.body;

    var query_val3;
    query_val3 = `insert into prefed_table (prefed_loc,notice_per,dept,curr_ctc,expected_ctc,c_id) values('${location_name}','${notice_period}','${department_name}','${current}','${expected}','${bid}');`
    await queryExecuter(query_val3);


    res.redirect('/jobformdetail/datashow')
})


app.get('/datashow', (req, res) => {

    connection.query(`select * from job_new.basic_details where isdelete="${0}";`, (err, results1) => {
        res.render('jobformsearch.ejs', { basic_table: results1, serachV: " " });

    })
})

app.get('/editData/:id', async (req, res) => {
    var id = req.params.id;


    const results0 = await queryExecuter(`select * from job_new.basic_details where id='${id}';`);
    // console.log(results0);
    const lang_tb = await queryExecuter(`select * from job_new.lang_table where c_id='${id}';`);
    // console.log(lang_tb);
    const tech_tb = await queryExecuter(`select * FROM job_new.tech_table where c_id='${id}';`);
    // console.log(tech_tb);
    const ed_tb = await queryExecuter(`select * FROM job_new.edu_detail where c_id='${id}';`);
    // console.log(ed_tb);
    const work_tb = await queryExecuter(`select * FROM job_new.work_table where c_id='${id}';`);
    // console.log(work_tb);
    const ref_tb = await queryExecuter(`select * FROM job_new.ref_table where c_id='${id}';`);
    // console.log(ref_tb);
    const prfed_tb = await queryExecuter(`select * FROM job_new.prefed_table where c_id='${id}';`);
    // console.log(prfed_tb);
    const results1 = await queryExecuter(`select state_master_tb.state,state_master_tb.id from state_master_tb ;`);
    const results2 = await queryExecuter(`select option_master.value from option_master where s_id=2;`);
    const results3 = await queryExecuter(`select option_master.value from option_master where s_id=3;`);
    const results4 = await queryExecuter(`select option_master.value from option_master where s_id=4;`);
    const results5 = await queryExecuter(`select option_master.value from option_master where s_id=5;`);
    const results6 = await queryExecuter(`select option_master.value from option_master where s_id=6;`);
    const results7 = await queryExecuter(`select option_master.value from option_master where s_id=7;`);


    res.render('jobformindx.ejs', { data: results0, data_option: results1, relation_option: results2, course_option: results3, lang: results4, tech: results5, loc: results6, dep: results7, lang_tb: lang_tb, tech_tb: tech_tb, ed_tb: ed_tb, work_tb: work_tb, ref_tb: ref_tb, prfed_tb: prfed_tb });

})


app.get('/search', (req, res) => {
    searchVal = req.query.searchVal;
    console.log(searchVal);
    if (searchVal != undefined) {
        optrVal = req.query.options;
        // console.log(optrVal);
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

        for (let val of spiltarr) {
            if (val[0] == "$") {

                count--;
                if (count)
                    queryans += ` last_name LIKE '${val.substring(1)}%' ${optrVal}`
                else
                    queryans += ` last_name LIKE '${val.substring(1)}%'`
            }
            if (val[0] == "^") {

                count--;
                if (count)
                    queryans += ` first_name LIKE '${val.substring(1)}%' ${optrVal}`
                else
                    queryans += ` first_name LIKE '${val.substring(1)}%'`

            }
            if (val[0] == "~") {
                count--;
                if (count)
                    queryans += ` phone_num LIKE '${val.substring(1)}%' ${optrVal}`
                else
                    queryans += ` phone_num LIKE '${val.substring(1)}%'`

            }
            if (val[0] == "_") {
                count--;
                if (count)
                    queryans += ` city LIKE '${val.substring(1)}%' ${optrVal}`
                else
                    queryans += ` city LIKE '${val.substring(1)}%'`
            }
            if (val[0] == "%") {
                count--;
                if (count)
                    queryans += ` email LIKE '${val.substring(1)}%' ${optrVal}`
                else
                    queryans += ` email LIKE '${val.substring(1)}%'`
            }
        }
        // console.log(queryans);
        if (queryans == "where")
            queryans = "";
        connection.query(`select * from job_new.basic_details ${queryans};`, (err, results) => {
            res.render('jobformsearch.ejs', { basic_table: results, serachV: searchVal });
        })
    }
    else {
        res.render('jobformsearch.ejs', { basic_table: results, serachV: searchVal });
    }

});

app.get('/all/state', async (req, res) => {

    var sname = req.query.state_name;
    // console.log("name "  + sname);

    var sid = await queryExecuter(`select id from state_master_tb where state='${sname}'`);
    // console.log("sid  " + sid[0]['id']);
    connection.query(`select city_name from city_table where s_id=${sid[0]['id']}`, (err, result) => {
        return res.json({ result });
    })
})
app.get('/deleterecord/:id', (req, res) => {
    var r_id = req.params.id;
    // console.log(r_id);
    connection.query(`update basic_details set isdelete="${1}" where id="${r_id}"`, (err, result) => {
        return res.json({ result });

    })
    // connection.query(`select id from basic_details where id `)
})
// app.listen(PORT, () => {
//     console.log(`http://localhost:${PORT}/form`);
// })

connection.connect();

module.exports = app;