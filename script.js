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
    let gridNumber = parseInt(e.srcElement.classList[0])
    console.log(gridNumber)

    function convertTableToCoordinates(tableInteger, numColumns, findCoordinate) {
        const values = Array.from({ length: tableInteger }, (_, i) => i + 1);
        const coordinates = [];

        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            const x = (i % numColumns) + 1;
            const y = Math.floor(i / numColumns) + 1;

            coordinates.push({ x: x, y: y, value: value });

            if (value === findCoordinate) {
                return [x, y];
            }
        }
        return null;
    }

    const table = 100;
    const numColumns = 10;

    const coordinates = convertTableToCoordinates(table, numColumns, gridNumber);
    console.log(coordinates)
} 