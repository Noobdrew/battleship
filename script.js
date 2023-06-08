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
    isOccupied(x, y) {
        for (const ship of this.aliveShips) {
            for (const [shipX, shipY] of ship.coordinates) {
                if (shipX === x && shipY === y) {
                    return true; // Coordinate is occupied by a ship
                }
            }
        }
        return false; // Coordinate is not occupied by any ship
    }
}
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
        this.prevShot = false
        for (let j = 0; j < arr2.aliveShips.length; j++) {
            let ship = arr2.aliveShips[j]
            let shipCoords = ship.coordinates
            shipCoords = shipCoords.flat(2)

            for (let i = 0; i < shipCoords.length; i++) {
                if (i % 2 == 0) {
                    if (shipCoords[i] == arr1[0] &&
                        shipCoords[i + 1] == arr1[1]) {
                        console.log('hit')

                        ship.hit()
                        arr2.removeDestroyedShips()
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
            cell.classList.add('hit')
        } else {
            cell.classList.add('miss')
        }
    }
}
//player definitions
const ship1 = new Ship(4, 4, true, [[0, 0], [0, 0], [0, 0], [0, 0]])
const ship2 = new Ship(3, 3, true, [[0, 0], [0, 0], [0, 0]])
const ship3 = new Ship(3, 3, true, [[0, 0], [0, 0], [0, 0]])
const ship4 = new Ship(2, 2, true, [[0, 0], [0, 0]])
const ship5 = new Ship(2, 2, true, [[0, 0], [0, 0]])
const ship6 = new Ship(2, 2, true, [[0, 0], [0, 0]])
const ship7 = new Ship(1, 1, true, [[0, 0]])
const ship8 = new Ship(1, 1, true, [[0, 0]])
const playerFleet = new Fleet([
    ship1, ship2, ship3, ship4, ship5, ship6, ship7, ship8])

const playerBoard = new Gameboard()
playerBoard.placeShips()

//computer definitions
const computerShip1 = new Ship(4, 4, true, [[0, 0], [0, 0], [0, 0], [0, 0]])
const computerShip2 = new Ship(3, 3, true, [[0, 0], [0, 0], [0, 0]])
const computerShip3 = new Ship(3, 3, true, [[0, 0], [0, 0], [0, 0]])
const computerShip4 = new Ship(2, 2, true, [[0, 0], [0, 0]])
const computerShip5 = new Ship(2, 2, true, [[0, 0], [0, 0]])
const computerShip6 = new Ship(2, 2, true, [[0, 0], [0, 0]])
const computerShip7 = new Ship(1, 1, true, [[0, 0]])
const computerShip8 = new Ship(1, 1, true, [[0, 0]])

const computerFleet = new Fleet([
    computerShip1, computerShip2, computerShip3, computerShip4,
    computerShip5, computerShip6, computerShip7, computerShip8])

const computerBoard = new Gameboard()
placeComputerShips(computerFleet)

let battlePhase = false
let currentTurn = 0

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

function attackAtCoord(e, board, fleet) {

    let domElement = e.srcElement

    if (domElement.classList.contains('hit') ||
        domElement.classList.contains('miss')) {
        return
    }
    let gridNumber = parseInt(domElement.classList[0])
    let coordinates = getCoordinates(gridNumber)

    board.attackCoord(coordinates, fleet)
    board.paintBoard(domElement)


}

//ship visualization and player placement module
function playerPlacementModule() {
    let currShip = 0
    let isHorizontal = true;
    function placeShipAtCoord(e) {
        let domElement = e

        let gridNumber = parseInt(domElement.srcElement.classList[0])
        let coordinates = getCoordinates(gridNumber)
        const ship = playerFleet.aliveShips[currShip]

        let shipCoordinates = playerFleet.aliveShips[currShip].coordinates
        shipCoordinates[0] = coordinates

        const currCell = document.querySelector(`[data-cell='${gridNumber}']`)

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
        const playerCells = document.querySelectorAll('.pending-placement')
        playerCells.forEach(element => {
            element.classList.remove('pending-placement')
        });
        if (currShip == playerFleet.aliveShips.length - 1) {
            console.log('Placement done')
            stopPlacement()
            battlePhase = true
            //attack computer board
            attackEnabled(computerBoard, 'comp-cell', computerFleet)
        }
        if (currShip < playerFleet.aliveShips.length - 1) {
            currShip++

        }
    }
    //visualize placement
    function placeShipPermanent() {
        const pendingPlacement = document.querySelectorAll(`.pending-placement`);
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

function attackEnabled(board, domElement, fleet) {
    if (battlePhase = true) {
        addEventListenerByClass(domElement, 'click', function (e) {
            attackAtCoord(e, board, fleet)
        });
    }
}
function attackDisabled(board, domElement, fleet) {
    removeEventListenerByClass(domElement, 'click', function (e) {
        attackAtCoord(e, board, fleet)
    })
}



playerPlacementModule()

//create computer ships

//place computer ships at random coords

function placeComputerShips(fleet) {
    fleet.aliveShips.forEach(ship => {
        let randomX, randomY, randomDirection;

        do {
            randomX = Math.floor(Math.random() * 10) + 1;    // X 1 - 10 
            randomY = Math.floor(Math.random() * 10) + 1;    // Y 1 - 10
            randomDirection = Math.round(Math.random());     // 1 or 0

            // Check if the ship can be placed at the randomly generated coordinates
            if (randomDirection === 0) {  // Place ship horizontally
                if (randomX + ship.length > 10) {
                    continue;  // Skip this iteration and generate new random coordinates
                }
            } else {  // Place ship vertically
                if (randomY + ship.length > 10) {
                    continue;  // Skip this iteration and generate new random coordinates
                }
            }

            // Check if any of the generated coordinates are already occupied by another ship
            let overlap = false;
            for (let i = 0; i < ship.length; i++) {
                if (randomDirection === 0) {  // Check for overlap horizontally
                    if (fleet.isOccupied(randomX + i, randomY)) {
                        overlap = true;
                        break;
                    }
                } else {  // Check for overlap vertically
                    if (fleet.isOccupied(randomX, randomY + i)) {
                        overlap = true;
                        break;
                    }
                }
            }

            if (overlap) {
                continue;  // Skip this iteration and generate new random coordinates
            }

            // Place the ship at the generated coordinates
            if (randomDirection === 0) {  // Place ship horizontally
                for (let i = 0; i < ship.length; i++) {
                    ship.coordinates[i] = [randomX + i, randomY];
                }
            } else {  // Place ship vertically
                for (let i = 0; i < ship.length; i++) {
                    ship.coordinates[i] = [randomX, randomY + i];
                }
            }

            break;  // Exit the loop once a valid placement is found

        } while (true);  // Continue generating random coordinates until a valid placement is found
    });
}

//attack the player board
function generateUniqueNumber() {
    let usedNumbers = []
    let randomNumber;

    do {
        randomNumber = Math.floor(Math.random() * 100) + 1;
    } while (usedNumbers.includes(randomNumber));

    usedNumbers.push(randomNumber);
    return randomNumber;
}
function computerAttack(board, fleet) {
    let gridNumber = generateUniqueNumber()
    let coordinates = getCoordinates(gridNumber)
    let domElement = document.querySelector(`[data-cell='${gridNumber}']`)
    board.attackCoord(coordinates, fleet)

    board.paintBoard(domElement)

}
//attackEnabled(playerBoard, 'player-cells', playerFleet)
//create a turn based function calls

function turnOrder() {
    currentTurn++
    console.log(currentTurn)
    if (currentTurn % 2 == 0) {
        attackDisabled(playerBoard, 'player-cells', playerFleet)
        attackEnabled(computerBoard, 'comp-cell', computerFleet)
    } else {
        computerAttack(playerBoard, playerFleet)
        attackDisabled(computerBoard, 'comp-cell', computerFleet)
    }
}


//computerAttack(playerBoard, playerFleet)
//check computerFleet and playerFleet after every turn to check for winners