'use strict';

var $container = document.getElementById('container');
var $tableSize = document.getElementById('table-size');
var visibleItems = [];
var areUncheckedItems = false;
var timer;
var winningNumber;

function resetGame() {
    alert ('aaaaaa');
}

function setWinNum(winNum) {
    $winningNumber().innerHTML = winNum;
    winningNumber = winNum;

    for (var i = 1; i <= 10; i++) {
        var opt = document.createElement('option');

        opt.value = winNum * i;
        opt.innerHTML = winNum * i + 'X'+ winNum * i;
        $tableSize.appendChild(opt);
    }
}

function $winningNumber() {
    if (!$winningNumber.element) {
        $winningNumber.element = document.getElementById('winning-number');
    }

    return $winningNumber.element;
};

function startGame() {

    var gameArray = getRandArray(10, $tableSize.value * $tableSize.value);

    gameArray.forEach(function(value) {
        new Memory(value);
    });

    document.getElementById("menu").style.display = "none";
    document.getElementById("zoomButton").style.display = "block";
    //document.getElementById("reset").style.display = "block";

   // var width = (Math.min(window.innerHeight, window.innerWidth)) / $tableSize.value;
    //console.log(width);
    let widthValue = $tableSize.value * 66;
    //var widthValue = ($tableSize.value * width)/2 ;

    $container.style.width = widthValue + 'px';
}

function changeNumber(action) {

    $tableSize.innerHTML = "";

    if(action == 'minus' && winningNumber != 2) {
        winningNumber--;
    }
    else if(action == 'plus' && winningNumber < 4) {
        winningNumber++;
    }

    setWinNum(winningNumber);
   
}

function zoomItem(value) {
    var width = (Math.min(window.innerHeight, window.innerWidth)) / $tableSize.value;
    let list = document.getElementsByClassName("item");
    for (let item of list) {
        var itemWidth = item.offsetWidth;
        var itemHeight = item.offsetHeight;
        if(value == 'minus') {
            console.log(itemWidth * $tableSize.value);
            if((itemWidth * $tableSize.value) < 100) {
                return;
            }
            itemWidth-=10; 
            itemHeight-=10; 
            item.style.width = itemWidth +'px';
            item.style.height= itemHeight+'px';
            if(itemWidth * $tableSize.value === 100){
                $container.style.width = (itemWidth * $tableSize.value)  + 15 + 'px';
            } else {
                $container.style.width = (itemWidth * $tableSize.value) + 'px';
            } 
          
        } else if(value == 'plus') {
            if($container.style.width === '1320px' && window.innerHeight > '920px') {
                return;
            }
            itemWidth+=10; 
            itemHeight+=10; 
            item.style.width = itemWidth +'px';
            item.style.height= itemHeight +'px';
            $container.style.width = (itemWidth * $tableSize.value)  + 30 +'px';
        }
    }  
}

function getRandArray(maxNumber, cellCount) {
    if(cellCount % winningNumber) {
        alert("Please enter valid length");
        throw "Cell count is not dividing to winning number";
    }

    var gameArray = [];

    for(var j = 0; (j < cellCount) && (gameArray.length < cellCount); j++) {
        for(var k = 0; k < winningNumber; k++) {
            gameArray.push(j);
        }
    }

    return gameArray.randomize();
}

Array.prototype.randomize = function () {
    var newArray = [].concat(this);
    var randArray = [];
    var length  = newArray.length;

    for(var i = 0; i < length; i++ ) {
        var randomIndex = Math.floor(Math.random() * newArray.length);

        randArray.push(newArray[randomIndex]);
        newArray.splice(randomIndex, 1);
    }
    
    return randArray;
};

function checkMatch() {
    var length = visibleItems.length;

    if(length === 1) {
        return;
    }

    if(visibleItems[length-1].value != visibleItems[length-2].value) {
        console.log('No Matched');

        visibleItems.forEach(function(element) {
            element.hide();
        });

        visibleItems = [];

    } else if(visibleItems[length-1].value === visibleItems[length-2].value && length == winningNumber) {
        console.log('Matched');

        visibleItems.forEach(function(element) {
            element.hide();
            element.makeMatched();
        });

        visibleItems = [];
    }
}

function Memory(value) {
    this.value = value;
    this.element = document.createElement("div");

    var span = document.createElement("span");
    span.innerHTML = value;
    this.element.appendChild(span);
    this.element.classList.add('item');

    this.element.onclick = this.click.bind(this);

    $container.appendChild(this.element);
}

Memory.prototype.click = function(){
    if(areUncheckedItems) {
        clearTimeout(timer);
        checkMatch();
        areUncheckedItems = false;
    }

    this.show();
    areUncheckedItems = true;

    timer = setTimeout(function() {
        checkMatch();
        areUncheckedItems = false;
    }, 2000)
}

Memory.prototype.show = function() {
    this.element.classList.add('show');
    visibleItems.push(this);
}

Memory.prototype.hide = function() {
    this.element.classList.remove('show');
}

Memory.prototype.makeMatched = function() {
    this.element.classList.add('matched');
}

window.onload = setWinNum(2);