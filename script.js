//1.create ship objects that have health, lenght and status(alive or dead)
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time

    for (var i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

class Ship {
    constructor(lenght, helth, alive, coordinates) {
        this.lenght = lenght
        this.helth = helth
        this.alive = alive
        this.coordinates = coordinates

    }
    hit() {
        if (this.alive == false) {
            console.log('ship is already destroyed, pick another spot')
            return
        }
        this.helth--
        console.log('Ship hit!!')
        this.isSunk()


    }
    isSunk() {
        if (this.helth == 0) {
            this.alive = false
            console.log('Ship is Destroyed')
        }
    }
}

const ship1 = new Ship(2, 2, true, [[3, 1], [1, 2]])
const ship2 = new Ship(1, 1, true, [[2, 2]])
const ship3 = new Ship(1, 1, true, [[5, 4]])

const fleet = [ship1, ship2, ship3]
//2.create game board as an array 3x3 for starters 

class Gameboard {
    constructor() {
        this.allShips = []
    }
    placeShips() {
        fleet.forEach(ship => {
            this.allShips.push(ship.coordinates)
        });
    }
    attackCoord(arr1, arr2) {
        arr2 = arr2.flat(2)
        for (let i = 0; i < arr2.length; i++) {
            if (i % 2 == 0) {
                if (arr2[i] == arr1[0] &&
                    arr2[i + 1] == arr1[1]) {
                    console.log('hit')
                    return true
                }
            }
        }
        console.log('miss')
        return false
    }
}

const playerBoard = new Gameboard()
playerBoard.placeShips()
playerBoard.attackCoord([2, 2], playerBoard.allShips)



// dom manipulation
const cell = document.querySelectorAll('.player-cells')

function addEventListenerByClass(className, event, fn) {
    var list = document.getElementsByClassName(className);
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, false);
    }
}

addEventListenerByClass('player-cells', 'click', doSomething);
function doSomething(e) {
    console.log(parseInt(e.srcElement.classList[0]))
    console.log(e)
} 