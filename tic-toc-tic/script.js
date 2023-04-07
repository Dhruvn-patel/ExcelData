var dhruv_td = document.querySelectorAll('td');
var dhruv_rst_btn = document.getElementById('rstbtn');
var dhruv_msg = document.getElementById('cng_player');
var dhruv_win = document.getElementById('ShowWin');
dhruv_rst_btn.addEventListener('click', resetValue);

dhruv_td.forEach((val) => {
    val.addEventListener('click', myfun)
})
var arr = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]
var dhruv_X_text = "X";
var dhruv_O_text = "O";
var dhruv_spa = new Array(9).fill(null);
var dhruv_chnge_player = dhruv_O_text;
var dhruv_tie = false;
var dhruv_cnt_tie = 0;
var flag = true;
var dhruv_player_x = 0, dhruv_player_O = 0;

function myfun(e) {
    let dhruv_idx = e.target.id;

    if (!dhruv_spa[dhruv_idx]) {
        dhruv_spa[dhruv_idx] = dhruv_chnge_player;
        e.target.innerHTML = dhruv_chnge_player;
        dhruv_cnt_tie++;
        if (win() != false) {
            let dhruv_arr = win();
            // dhruv_tie=true;
            // console.log(dhruv_arr);
            var ans = dhruv_spa[dhruv_arr[0]]
            flag = false;
            dhruv_win.innerHTML = `Player Win : ${ans}`;

            if (ans == "X") {
                dhruv_player_x += 1;
                localStorage.setItem("playerx", dhruv_player_x);

            }
            else {
                dhruv_player_O += 1;
                localStorage.setItem("playero", dhruv_player_O);

            }
            setTimeout(function () {

                resetValue();
            }, 1000);

            document.getElementById('playerx').innerHTML = "player x win :" + dhruv_player_x
            document.getElementById('playero').innerHTML = " player O win :" + dhruv_player_O
        }
        if (dhruv_cnt_tie == 9 && flag == true) {
            dhruv_win.innerHTML = "Sorry Try again"
        }


        dhruv_msg.innerHTML = dhruv_chnge_player;
        dhruv_chnge_player = dhruv_chnge_player == dhruv_X_text ? dhruv_O_text : dhruv_X_text;

    }
}
function win() {
    for (let val of arr) {
        let [a, b, c] = val;

        if (dhruv_spa[a] != null && dhruv_spa[b] != null && dhruv_spa[c] != null && dhruv_spa[a] == dhruv_spa[b] && dhruv_spa[a] == dhruv_spa[c]) {
            console.log(dhruv_spa[a]);
            return [a, b, c];

        }
    }
    return false;
}
function resetValue() {
    dhruv_spa.fill(null);
    dhruv_td.forEach((val) => {
        val.innerHTML = "";
    })
    dhruv_win.innerHTML = ""

    dhruv_cnt_tie = 0;
    return true;
}

function myfuncnew() {
    // localStorage.setItem("playerx",dhruv_player_x);
    // localStorage.setItem("playero",dhruv_player_O);
    document.getElementById('playerx').innerHTML = "Previous player x win :" + localStorage.getItem("playerx");
    document.getElementById('playero').innerHTML = "Previous player O win :" + localStorage.getItem("playero");

}