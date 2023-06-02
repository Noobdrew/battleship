//1.create ship objects that have health, lenght and status(alive or dead)

class Ship {
    constructor(lenght, helth, alive) {
        this.lenght = lenght
        this.helth = helth
        this.alive = alive
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

class Water {

    hit() {
        console.log('miss')
    }
}

const ship1 = new Ship(2, 2, true)
const ship2 = new Ship(1, 1, true)
const water = new Water()
const fleet = [ship1, ship2]
//2.create game board as an array 3x3 for starters 
let gameboard = [
    [water, water, water],
    [water, water, water],
    [water, water, water]
];

class Gameboard {
    constructor() {
        this.board = [
            [water, water, water, water, water],
            [water, water, water, water, water],
            [water, water, water, water, water],
            [water, water, water, water, water],
            [water, water, water, water, water]
        ]
    }
    placeShip() {
        fleet.forEach(element => {

        });
    }
}

const test = new Gameboard()
gameboard[1][1] = ship1
gameboard[1][2] = ship1
gameboard[0][0] = ship2


console.log(gameboard[1][1])
console.log(gameboard[1][2])
//2.1. place ships on game board

//2.2.