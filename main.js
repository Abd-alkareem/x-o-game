const mainHolder = document.querySelector(".main-container");


//data for the game
let playerChose = "";
let playerTurn = true;
let siteChose = "";
const winLines = [[0,1,2],[0,3,6],[2,5,8],[6,7,8],[0,4,8],[2,4,6],[1,4,7],[3,4,5]];
let sitePlayed = false;
let gameDone = false;
// lay-out init
let layOut = document.createElement("div");
layOut.className = "layout";
layOut.innerHTML = `
<span>do want to play ?</span>
<div class="start-btns">
<i class="" player-type="x">x</i>
<i class="" player-type="o">o</i>
</div>
`;
mainHolder.appendChild(layOut);

// start game function
document.querySelectorAll(".start-btns i").forEach((btn)=>{
    btn.addEventListener("click",(event)=>{
        // close the lay-out
        layOut.classList.add("remo");
        //get the player chose
        playerChose = event.target.getAttribute("player-type");
        event.target.getAttribute("player-type") == 'x' ? siteChose = 'o': siteChose = 'x' ;
        // creating the game bord
        createBlocks();
        // active the right icons
        activeIcon();
        // active the turn board
        activeTurn();
        
    })
})


function createBlocks(){
    // create the game borf
    let gameBord = document.createElement("div");
    gameBord.className = "game-bord";
    // create the blocks for the bord
    for(let i = 0; i < 9 ; i++){
        let block = document.createElement("div");
        block.className = "game-block ";
        block.innerHTML = `
        <i class="icon x-icon fa" block-type="x-block" >x</i>
        <i class="icon o-icon fa" block-type="o-block">o</i>
        `;
        gameBord.appendChild(block);
    }
    // create the stick between bblocks
    for(let i = 0 ; i < 4 ; i ++){
        let stake = document.createElement("span");
        stake.className = `stake st-${i}`;
        gameBord.appendChild(stake);
    }
    mainHolder.appendChild(gameBord);
    // create turn board
    let turnBoard = document.createElement("div");
    turnBoard.innerHTML = `
        <span class="turn-x fa" >x</span>
        <span class="turn-o fa" >o</span>
        `;
    turnBoard.className = "turn-board";
    mainHolder.appendChild(turnBoard);
    // blocks functionality
    document.querySelectorAll(".game-block").forEach((block)=>{
        block.addEventListener("click",(event)=>{
            //change the turn
            playerTurn = !playerTurn;
            changeAc_Icon();
            activeTurn();
            // add chosed class to the 
            event.target.classList.add("chosed");
            event.target.parentElement.classList.add("chosed");
            event.target.parentElement.classList.add(`${event.target.getAttribute("block-type")}`);
            //
            checkResult();
            // check if its the site turn
            if(!playerTurn && gameDone != true){
            // pointer event none
            document.querySelectorAll(".game-block").forEach((block)=>{
             block.classList.add("stop");
            })
            // website turn
            sitePlayed = false;
            setTimeout(()=>{
                siteTurn();
                // checkResult();
            },1000)

            }
        })
    })
}

function activeIcon (){
    document.querySelectorAll(`.${playerChose}-icon`).forEach((i)=>{
        i.classList.add("active-icon");
    })
}

function changeAc_Icon (){
    if(!playerTurn){
    document.querySelectorAll(`.${playerChose}-icon`).forEach((i)=>{
        i.classList.remove("active-icon");
    }) 
    document.querySelectorAll(`.${siteChose}-icon`).forEach((i)=>{
        i.classList.add("active-icon");
    }) 
    }else{
        document.querySelectorAll(`.${siteChose}-icon`).forEach((i)=>{
            i.classList.remove("active-icon");
        }) 
        document.querySelectorAll(`.${playerChose}-icon`).forEach((i)=>{
            i.classList.add("active-icon");
        }) 

    }
}

function activeTurn(){
    if (playerTurn) {
        document.querySelector(`.turn-board .turn-${siteChose}`).classList.remove("turn-on");
        document.querySelector(`.turn-board .turn-${playerChose}`).classList.add("turn-on");
    }else{
        document.querySelector(`.turn-board .turn-${playerChose}`).classList.remove("turn-on");
        document.querySelector(`.turn-board .turn-${siteChose}`).classList.add("turn-on");

    }
}

function clickBlock(targetBlock){
        targetBlock.classList.add("chosed");
        targetBlock.classList.add(`${siteChose}-block`);
        targetBlock.querySelector(`.${siteChose}-icon`).classList.add("chosed");
    }


function siteTurn(){
    // can the site win?
    rightChose(siteChose);

    if(!sitePlayed){
        // stop the player from win
        rightChose(playerChose);
    }

    if(!sitePlayed){
        // a logical chose
        logicChose();
    }

    // random chose
    if(!sitePlayed){
        // console.log("randome chose")
        let emptyBlocks = document.querySelectorAll(".game-block:not(.chosed)");
        let randomIndex = Math.floor(Math.random() * emptyBlocks.length);
        let randomeBlock = emptyBlocks[randomIndex];
        randomeBlock.classList.add("chosed");
        randomeBlock.classList.add(`${siteChose}-block`);
        randomeBlock.querySelector(`.${siteChose}-icon`).classList.add("chosed");

    }

    //change the turn
    playerTurn = !playerTurn;
    changeAc_Icon();
    activeTurn();

    // retern pointer event
    setTimeout(()=>{
        document.querySelectorAll(".game-block").forEach((block)=>{
            block.classList.remove("stop");
        })
    },400)

    checkResult();

}



//
//
let gameCounter = 0;
function checkResult(){
    // counter thet help to stop the game
    gameCounter++;
    // state of game
    let stateOfGame  = 'draw';
    // needed to select the avaliable win line
    let chosedEle = 0;
    // the lines which have 3 blocks chosed
    let avabelLines = [];
    // all the blick in the board
    let allBlocks = Array.from(mainHolder.querySelectorAll(".game-block"));
    // array that have win line as element
    let lineElements = winLines.map((ele)=>{
        return [allBlocks[ele[0]],allBlocks[ele[1]],allBlocks[ele[2]]]
    })
    // function to filtter the avaliabe lines -- which have 3 block chosed
    lineElements.forEach((line)=>{ 
        chosedEle = 0 ;
        line.forEach((e)=>{
            // if(e.classList.contains(`${siteChose}-block`)) chosedEle++;
            if(e.classList.contains(`chosed`)) chosedEle++;
        })
        if(chosedEle == 3) avabelLines.push(line);
    })
    
    let finalLine = [];
    for(let i = 0;i<avabelLines.length;i++){
        if(stateOfGame == 'draw'){
            let x = 0;
            let o = 0;
            let winLine = [];
            for(let j =0 ; j < 3 ;j++){
                if(avabelLines[i][j].classList.contains("x-block")){
                    x++;
                }
                if (avabelLines[i][j].classList.contains("o-block")){
                    o++;
                }
            }
            if(x == 3){
                stateOfGame = "X";
                finalLine = avabelLines[i];
            }
            if(o == 3){
                stateOfGame = "O";
                finalLine = avabelLines[i];
            }
            
        }    
    }
    
    if(gameCounter == 9){
        allBlocks.forEach((block)=>{
        block.classList.add("done");
        });
        gameDone = true;
        setTimeout(()=>{restartGame()},1000);
    }
    if(stateOfGame != "draw"){
        allBlocks.forEach((block)=>{
        block.classList.add("done");
        });
        finalLine.forEach((block)=>{
        block.classList.add("win-block");
        });
        gameDone = true;
        setTimeout(()=>{restartGame()},1000);

    }



}

function rightChose(side){ 
    // variable for the block which the site will chose
    let elementToClick = '';
    // needed to select the avaliable win line
    let chosedEle = 0;
    // the win line which have 2 chosed blocks -- for the site type
    let avabelLines = [];
    // all the blick in the board
    let allBlocks = Array.from(mainHolder.querySelectorAll(".game-block"));
    // array that have win line as element
    let lineElements = winLines.map((ele)=>{
        return [allBlocks[ele[0]],allBlocks[ele[1]],allBlocks[ele[2]]]
    })
    // function to filtter the avaliabe win line -- which have 2 block chosed
    lineElements.forEach((line)=>{ 
        chosedEle = 0 ;
        line.forEach((e)=>{
            if(e.classList.contains(`${side}-block`)) chosedEle++;
        })
        if(chosedEle == 2) avabelLines.push(line);
    })
    // function to search for the empty block in the avaliabel line
        //search state
    let searchSt = true
    //looping on the all avaliable line
    for(let i = 0 ; i< avabelLines.length ; i++){
        // if we still search
        if(searchSt){
            // loop on the blocks in the line
            for(let j = 0 ; j < 3;j++){
                // if the block dont have chosed class
                if(!avabelLines[i][j].classList.contains("chosed")){
                    //that is empty block in a avaliable win line
                elementToClick = avabelLines[i][j];
                // stop searching
                searchSt = false;
                // we will play
                sitePlayed = true;
                // chose the block
                clickBlock(elementToClick);

                }
            }
        }
    }};

function logicChose(){
    let allBlocks = Array.from(mainHolder.querySelectorAll(".game-block"));
    let horzinalLines = [allBlocks[1],allBlocks[3],allBlocks[5],allBlocks[7]];
    let multibleLines = [allBlocks[0],allBlocks[2],allBlocks[6],allBlocks[8]];
    let searchSt = true;
    if(!allBlocks[4].classList.contains("chosed")){
        // to chose the middle at first
        clickBlock(allBlocks[4]);
        sitePlayed = true;    
        return;
    }else if(allBlocks[4].classList.contains(`${playerChose}-block`)){
        // in case the player chosed the middle
        for(let i = 0 ; i < multibleLines.length; i++){
                if(searchSt){
                    if(!multibleLines[i].classList.contains("chosed")){
                        clickBlock(multibleLines[i]);
                        sitePlayed = true;
                        searchSt = false; 
                        return;
                    }
                }
        }
    }else{
        // in case we chosed the middle
            for(let i = 0 ; i < horzinalLines.length; i++){
                if(searchSt){
                    if(!horzinalLines[i].classList.contains("chosed")){
                        clickBlock(horzinalLines[i]);
                        sitePlayed = true;
                        searchSt = false;   
                        return;
                    }
                }
            }
    }



}

// restart game
function restartGame(){
    mainHolder.innerHTML = ''
    gameDone = false;
    sitePlayed = false;
    playerTurn = true;
    gameCounter = 0;
    mainHolder.appendChild(layOut);
    layOut.classList.remove("remo");

}