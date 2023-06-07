class Ship {
    constructor(length, helth, alive, coordinates) {
        this.length = length
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
let battlePhase = false
const ship1 = new Ship(3, 3, true, [[0, 0], [0, 0], [0, 0]])
const ship2 = new Ship(2, 2, true, [[0, 0], [0, 0]])
const ship3 = new Ship(1, 1, true, [[0, 0]])

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



function addEventListenerByClass(className, event, fn, repaet = false) {
    var list = document.getElementsByClassName(className);
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, { once: repaet }, false);
    }
}
function removeEventListenerByClass(className, event, fn, repeat = false) {
    var list = document.getElementsByClassName(className);
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].removeEventListener(event, fn, { once: repeat }, false);
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

function attackAtCoord(e, board) {
    let domElement = e
    if (domElement.srcElement.classList.contains('hit') ||
        domElement.srcElement.classList.contains('miss')) {
        return
    }

    let gridNumber = parseInt(domElement.srcElement.classList[0])
    console.log(gridNumber)
    let coordinates = getCoordinates(gridNumber)
    console.log(coordinates)



    board.attackCoord(coordinates, playerFleet.aliveShips)
    board.paintBoard(domElement)
}

//ship visualization and player placement module
function playerPlacementModule() {
    let currShip = 0
    let isHorizontal = true;
    function placeShipAtCoord(e) {
        let domElement = e

        let gridNumber = parseInt(domElement.srcElement.classList[0])
        console.log(gridNumber)
        let coordinates = getCoordinates(gridNumber)
        console.log(coordinates)
        const ship = playerFleet.aliveShips[currShip]

        let shipCoordinates = playerFleet.aliveShips[currShip].coordinates
        shipCoordinates[0] = coordinates

        const currCell = document.querySelector(`[data-cell='${gridNumber}']`)

        console.log(currCell)

        //return if placed on existing ship
        if (currCell.classList.contains('ship')) {
            console.log('Invalid Placement')
            return
        }

        //place ships horizontal
        if (isHorizontal) {

            for (let i = 1; i < shipCoordinates.length; i++) {
                let nextCoord = coordinates[0] + i
                let nextGridCell = gridNumber + i
                let nextGridCellElement = document.querySelector(`[data-cell='${nextGridCell}']`)
                if (nextCoord > 10) {
                    console.log('Invalid Placement')
                    return
                }
                if (nextGridCellElement.classList.contains('ship')) {
                    console.log('Invalid Placement')
                    return
                }
                console.log(nextGridCell)

                shipCoordinates[i] = [nextCoord, coordinates[1]]

            }
            //place ships vertical
        } else {
            for (let i = 1; i < shipCoordinates.length; i++) {
                let nextCoord = coordinates[1] + i
                let nextGridCell = gridNumber + i * 10
                let nextGridCellElement = document.querySelector(`[data-cell='${nextGridCell}']`)
                if (nextCoord > 10) {
                    console.log('Invalid Placement')
                    return
                }
                if (nextGridCellElement.classList.contains('ship')) {
                    console.log('Invalid Placement')
                    return
                }
                console.log(nextGridCell)
                shipCoordinates[i] = [coordinates[0], nextCoord]

            }
        }
        //paint board with ship placement
        placeShipPermanent()
        console.log(shipCoordinates)
        const playerCells = document.querySelectorAll('.pending-placement')
        playerCells.forEach(element => {
            element.classList.remove('pending-placement')
        });
        if (currShip == playerFleet.aliveShips.length - 1) {
            console.log('Placement done')
            stopPlacement()
            battlePhase = true
            attackEnabled(playerBoard)
        }
        if (currShip < playerFleet.aliveShips.length - 1) {
            currShip++
            console.log(currShip)
        }
    }
    //visualize placement
    function placeShipPermanent() {
        const pendingPlacement = document.querySelectorAll(`.pending-placement`);
        console.log(pendingPlacement)
        pendingPlacement.forEach(element => {
            element.classList.add('ship')
        });
    }
    function placeHorizontal(index, ship) {
        for (let i = 1; i < ship.length; i++) {
            const nextIndex = index + i;
            if (nextIndex % 10 === 1) {
                break; // Break out of the loop if the next div reaches the specified indexes
            }
            const element = document.querySelector(`[data-cell='${nextIndex}']`);
            element.classList.add('pending-placement');
        }
    }
    function removeHorizontal(index, ship) {
        for (let i = 1; i < ship.length; i++) {
            const nextIndex = index + i;
            if (nextIndex % 10 === 1) {
                break; // Break out of the loop if the next div reaches the specified indexes
            }
            const element = document.querySelector(`[data-cell='${nextIndex}']`);
            element.classList.remove('pending-placement');
        }
    }
    function placeVertical(index, ship) {
        for (let i = 1; i < ship.length; i++) {
            const nextIndex = index + i * 10;
            if (nextIndex > 100) {
                break; // Break out of the loop if the next index exceeds 100
            }
            const element = document.querySelector(`[data-cell='${nextIndex}']`);
            element.classList.add('pending-placement');
        }
    }
    function removeVertical(index, ship) {
        for (let i = 1; i < ship.length; i++) {
            const nextIndex = index + i * 10;
            if (nextIndex > 100) {
                break; // Break out of the loop if the next index exceeds 100
            }
            const element = document.querySelector(`[data-cell='${nextIndex}']`);
            element.classList.remove('pending-placement');
        }
    }



    function displayPlacement(e) {
        e.srcElement.classList.add('pending-placement')
        let gridNumber = parseInt(e.srcElement.classList[0])

        const ship = playerFleet.aliveShips[currShip]


        if (isHorizontal) {
            placeHorizontal(gridNumber, ship);
        } else {
            placeVertical(gridNumber, ship);
        }

    }
    function removeDisplayPlacement(e) {
        e.srcElement.classList.remove('pending-placement')
        let gridNumber = parseInt(e.srcElement.classList[0])

        const ship = playerFleet.aliveShips[currShip]

        if (isHorizontal) {
            removeHorizontal(gridNumber, ship);
        } else {
            removeVertical(gridNumber, ship);
        }

    }
    function togglePlacement(e) {
        const cells = document.querySelectorAll('.pending-placement')
        cells.forEach(element => {
            element.classList.remove('pending-placement')
        });

        e.preventDefault()
        isHorizontal = !isHorizontal;
        displayPlacement(e)
    }

    function placeShipsOnBoard() {
        addEventListenerByClass('player-cells', 'mouseenter', displayPlacement)
        addEventListenerByClass('player-cells', 'mouseleave', removeDisplayPlacement)
        addEventListenerByClass('player-cells', 'click', placeShipAtCoord);
        addEventListenerByClass('player-cells', 'contextmenu', togglePlacement)
    }
    function stopPlacement() {
        removeEventListenerByClass('player-cells', 'mouseenter', displayPlacement)
        removeEventListenerByClass('player-cells', 'mouseleave', removeDisplayPlacement)
        removeEventListenerByClass('player-cells', 'click', placeShipAtCoord);
        removeEventListenerByClass('player-cells', 'contextmenu', togglePlacement)
    }
    placeShipsOnBoard()
}

function attackEnabled(board) {
    if (battlePhase = true) {
        addEventListenerByClass('player-cells', 'click', function (e) {
            attackAtCoord(e, board)
        });
    }
}
function attackDisabled(board) {
    removeEventListenerByClass('player-cells', 'click', function (e) {
        attackAtCoord(e, board)
    })
}



playerPlacementModule()