
var sweep_board = []
var board = document.getElementById('board')
var row_input = document.getElementById('row')
var col_input = document.getElementById('col')
var sign = document.getElementById('title')
var timeSecond = document.getElementsByClassName('second')[0]
row_input.value = 10
col_input.value = 10
board.addEventListener('contextmenu', function (event) {
    event.preventDefault()
})
// 生成board 初始化数据
function init_board() {
    is_gameover = false//游戏失败 否
    gameStart = false//游戏开始 否
    timeSecond.innerHTML = 0//游戏用时 0
    sweep_board = [] 
    board.innerHTML = ''
    var row = row_input.value
    var col = col_input.value
    for (let i = 0; i < col; i++) {
        var col_arr = []
        for (let k = 0; k < row; k++) {
            col_arr.push('E')
            var block = document.createElement('div')
            block.classList.add('block', i + '-' + k)
            block.setAttribute('id', i + '-' + k)
            block.style.width = (500 / col) + 'px'
            block.style.height = parseInt(block.style.width) + 'px'
            board.appendChild(block)
        }
        sweep_board.push(col_arr)
    }
    sweep(col, row, Math.floor(col * row / 5))
    flashBoard()
    // console.log(sweep_board)
}
//生成sweep
var sweep_num = 0
function sweep(col, row, num) {
    var map = new Map()
    for (let i = 0; i < num; i++) {
        var col_sweep = Math.floor(Math.random() * col)
        var row_sweep = Math.floor(Math.random() * row)
        if (map.has(col_sweep + '-' + row_sweep)) {
            i--
        } else {
            map.set(col_sweep + '-' + row_sweep)
        }
    }
    for (let [key, value] of map) {
        var click = key.split('-')

        sweep_board[click[0]][click[1]] = 'M'
    }
    sweep_num = num
    sign.innerHTML = 'SWEEP-'+sweep_num

}
//刷新board
function flashBoard() {
    var hasNotSweep = true
    var flag_num = 0
    sweep_board.map((e, i) => {
        e.map((t, j) => {
            var block = board.getElementsByClassName(i + '-' + j)[0]
            // console.log(t)
            if (t == 'B') {
                block.classList.remove('blank')
                block.classList.add('gray')
            }
            else if (t == 'M') {
                hasNotSweep = false
                block.classList.remove('flag')
                block.classList.remove('blank')
                block.classList.add('dead')
            }
            else if (t == 'E') {
                block.classList.add('blank')
                block.classList.remove('eflag')
            } else if (t == 'EF') {
                block.classList.remove('blank')
                block.classList.add('eflag')
                flag_num++
            } else if (t == 'F') {
                block.classList.remove('blank')
                // block.innerHTML = 'f'
                block.classList.add('flag')
                flag_num++
            }
            else if (t == 'X') {
                hasNotSweep = false
                // block.innerHTML = t
                block.classList.remove('blank')
                block.classList.add('warm')
                block.classList.add('boom')
            }
            else {
                block.classList.remove('blank')
                block.classList.add('num')
                block.innerHTML = t
            }
            
            sign.innerHTML = 'SWEEP-'+(sweep_num-flag_num)

        })
    })
    if (hasNotSweep) {
        clearInterval(gameTime)
        sign.innerHTML = 'You Win !'
    }
}
// 游戏失败
var is_gameover = false
function gameover() {
    sweep_board.map((e, i) => {
        e.map((t, j) => {
            var block = board.getElementsByClassName(i + '-' + j)[0]
            if (t == 'M') {
                // block.innerHTML = t
                block.classList.remove('blank')
                block.classList.add('warm')
            }
        })
    })
    // alert('Game Over!')
    is_gameover = true
    sign.innerHTML = 'GAME OVER'
    clearInterval(gameTime)
}
// 更新board数组
function updateBoard(board, click) {
    if (board[click[0]][click[1]] == 'M') {

        board[click[0]][click[1]] = 'X'

        flashBoard()
        setTimeout(gameover,100)
        // gameover()

        //    setTimeout( init_board,3000)
    }
    if (board[click[0]][click[1]] == 'E' || board[click[0]][click[1]] * 0 == 0) {

        judgeBlock(board, click)

    }
    flashBoard()
    return board
};
// 递归周围格子
function judgeBlock(board, click) {
    var col = click[0] * 1
    var row = click[1] * 1
    if (col < 0 || row < 0 || col > board.length - 1 || row > board[0].length - 1) {
        return
    }
    var arr_round = [
        [col - 1, row - 1],
        [col - 1, row],
        [col - 1, row + 1],
        [col, row - 1],
        [col, row + 1],
        [col + 1, row - 1],
        [col + 1, row],
        [col + 1, row + 1],
    ]
    var sweep_count = 0
    var sweep_flag = 0
    for (let val of arr_round) {
        if (board[val[0]] != undefined && board[val[0]][val[1]] != undefined) {
            //  console.dir(board)
            if (board[val[0]][val[1]] == 'M') {
                sweep_count++

            }
            if (board[val[0]][val[1]] == 'F') {
                sweep_count++
                sweep_flag++
            }
            if (board[val[0]][val[1]] == 'EF') {
                gameover()
                return
                // alert('game over')
                // return
            }
        }
    }
    if (sweep_count == 0) {
        board[col][row] = "B"
    }else {
        board[col][row] = sweep_count + ''
    }
    if (sweep_count == 0 || sweep_count == sweep_flag) {

        for (let val of arr_round) {
            if (board[val[0]] != undefined && board[val[0]][val[1]] != undefined && board[val[0]][val[1]] == 'E') {
                judgeBlock(board, val)
            }
        }
    }

}
init_board()
var gameStart = false
var gameTime,gameSecond
board.addEventListener('mousedown', e => {
    if (is_gameover) {
        return false
    }
    if(gameStart==false){
        console.log(1)
        gameSecond=0
        gameTime = setInterval(() => {
            gameSecond++
            timeSecond.innerHTML = gameSecond
        }, 1000);
    }
    if (e.which == 1) {
        if (e.target.classList.contains('blank') || e.target.classList.contains('dead')) {
            var click_point = e.target.classList[1].split('-')
            updateBoard(sweep_board, click_point)
            gameStart=true
        }
    } else if (e.which == 3) {
        if (e.target.classList.contains('blank') || e.target.classList.contains('dead')||e.target.classList.contains('flag')||e.target.classList.contains('eflag')) {
            var click_point = e.target.classList[1].split('-')

            if (e.target.classList.contains('blank')) {
                sweep_board[click_point[0]][click_point[1]] = 'EF'
               
            }
            if (e.target.classList.contains('dead')) {
                sweep_board[click_point[0]][click_point[1]] = 'F'
               
            }
            if (e.target.classList.contains('eflag')) {
                sweep_board[click_point[0]][click_point[1]] = 'E'
                
            }
            if (e.target.classList.contains('flag')) {
                sweep_board[click_point[0]][click_point[1]] = 'M'
               
            }
            gameStart=true
            flashBoard()
        }
    } else if (e.which == 2) {
        e.preventDefault()
        if (e.target.classList.contains('num')) {
            var click_point = e.target.classList[1].split('-')
            updateBoard(sweep_board, click_point)
            console.log(e.target.innerHTML)
        }
      
    }
   
})

// mousedown(function(e){ if (e.button == 1) { return false; } })
