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

const ship1 = new Ship(2, 2, true, [[1, 1], [1, 2]])
const ship2 = new Ship(1, 1, true, [[2, 2]])
const ship3 = new Ship(1, 1, true, [[5, 4]])

class Fleet {
    constructor(aliveShips) {
        this.aliveShips = aliveShips
        this.destroyedShips
    }
    removeDestroyedShips() {
        this.aliveShips.forEach((ship, index) => {
            if (ship.helth <= 0) {
                this.destroyedShips = this.aliveShips.splice(index, 1)
            }
        });
    }
}

const playerFleet = new Fleet([ship1, ship2, ship3])
//2.create game board as an array 3x3 for starters 

class Gameboard {
    constructor() {
        this.allShips = []
        this.prevShot = false
    }
    placeShips() {
        playerFleet.aliveShips.forEach(ship => {
            this.allShips.push(ship)
        });
    }

    attackCoord(arr1, arr2) {

        for (let j = 0; j < arr2.length; j++) {
            let ship = arr2[j]
            let shipCoords = ship.coordinates
            shipCoords = shipCoords.flat(2)

            for (let i = 0; i < shipCoords.length; i++) {
                if (i % 2 == 0) {
                    if (shipCoords[i] == arr1[0] &&
                        shipCoords[i + 1] == arr1[1]) {
                        console.log('hit')
                        ship.hit()
                        playerFleet.removeDestroyedShips()
                        return this.prevShot = true
                    }
                }
            }
        }

        console.log('miss')
        return this.prevShot = false

    }

    paintBoard(cell) {
        if (this.prevShot) {
            cell.srcElement.classList.add('hit')
        } else {
            cell.srcElement.classList.add('miss')
        }
    }
}

const playerBoard = new Gameboard()
playerBoard.placeShips()



function addEventListenerByClass(className, event, fn) {
    var list = document.getElementsByClassName(className);
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, false);
    }
}
function removeEventListenerByClass(className, event, fn) {
    var list = document.getElementsByClassName(className);
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].removeEventListener(event, fn, false);
    }
}
function getCoordinates(index) {
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

    const coordinates = convertTableToCoordinates(table, numColumns, index);
    return coordinates

}

function attackAtCoord(e) {
    let domElement = e
    if (domElement.srcElement.classList.contains('hit') ||
        domElement.srcElement.classList.contains('miss')) {
        return
    }

    let gridNumber = parseInt(domElement.srcElement.classList[0])
    console.log(gridNumber)
    let coordinates = getCoordinates(gridNumber)
    console.log(coordinates)



    playerBoard.attackCoord(coordinates, playerFleet.aliveShips)
    playerBoard.paintBoard(domElement)
}
function placeShipsOnBoard() {

}

function attackEnabled() {
    addEventListenerByClass('player-cells', 'click', attackAtCoord);
}
function attackDisabled() {
    removeEventListenerByClass('player-cells', 'click', attackAtCoord)
}


