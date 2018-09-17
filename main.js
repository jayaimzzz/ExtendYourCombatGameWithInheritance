const mainWrapper = document.getElementById('mainWrapper');
const carsDiv = document.getElementById('carsDiv');
let playersCarName, randomCar1, randomCar2, interval;
let grid = [];
let lengthOfRace = 10;
let i = 0;

function displayOnPage(text) {
    let t = document.createTextNode(text);
    let span = document.createElement('span');
    let br = document.createElement('br');
    span.appendChild(t);
    mainWrapper.appendChild(span);
    mainWrapper.appendChild(br);
}

function displayCarOnPage(car) {
    let div = document.createElement('div');
    div.id = car.name + 'Div';
    div.className = 'car';
    div.dataset.carName = car.name
    div.style.backgroundColor = car.color;
    div.addEventListener('click', selectCar)
    carsDiv.appendChild(div);
}

function removeCarsOnPage() {
    carsDiv.innerHTML = '';
}

function removeEventListnersFromCars() {
    for (let i = 0; i < grid.length; i++) {
        car = document.querySelector(`[data-car-name='${grid[i].name}']`)
        car.removeEventListener('click', selectCar)
    }
}



function selectCar(element) {
    playersCarName = element.currentTarget.dataset.carName;
    let aggression = parseInt(prompt(`You selected ${playersCarName}. On a scale between 0 and 10, how aggresive are you going to drive?`))
    if (aggression > 10) {
        aggression = 10
    };
    if (aggression < 0) {
        aggression = 0
    };
    if (aggression == 'NaN') {
        aggression = 5;
    }
    aggression = aggression / 10;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].name == playersCarName) {
            grid[i].aggression = aggression
            // grid[i].name = 'YOU, aka ' + grid[i].name + ','
        }
    }
    // removeCarsOnPage();
    // removeEventListnersFromCars();
    removeEventListnersFromCars();
    qualify();

    interval = setInterval(race, 2000);

}

class Car {
    constructor(options) {
        this.name = options.name;
        this.modelName = options.modelName;
        this.manufacturer = options.manufacturer;
        this.color = options.color;
        this.hp = options.hp;
        this.weightLBS = options.weightLBS;
        this.powerToWeight = options.hp / options.weightLBS * 10;
        this.damage = 0;
        // this.position = 1;
        this.aggression = options.aggression || .5;
        this.wrecked = false;
        grid.push(this)
    }
    passCar(who) {
        if (this.position > who.position) {
            if (this.powerToWeight / Math.random() > who.powerToWeight) {
                let temp = this.position;
                this.position = who.position;
                who.position = temp;
                sortGrid();
                if (Math.random() < this.aggression) {
                    this.damage = this.damage + (10 * who.weightLBS / this.weightLBS);
                    who.damage = who.damage + (10 * this.weightLBS / who.weightLBS)
                    console.log(this.damage);
                    displayOnPage(this.name + ' bumped ' + who.name + ' while passing!')
                    displayOnPage(this.name + ' has ' + this.damage + ' percent damage and is now in position ' + this.position)
                    displayOnPage(who.name + ' has ' + who.damage + ' percent damage.')
                    this.addDamageToCarDiv();
                    who.addDamageToCarDiv();
                } else {
                    displayOnPage(this.name + ' stole the ' + this.position + ' position from ' + who.name + '.')
                }
                updateDisplayedPositionOfCars();
    
            } else {
                displayOnPage(this.name + ' tried to pass ' + who.name + "but didn't have enough speed.")
            }
    
        } else {
            // console.log(this.name + ' is already ahead of ' + whom.name)
        }
    }
    makePitStop() {
        let damage = this.damage;
        this.damage = 0;
        let index = grid.indexOf(this)
        grid.splice(index, 1)
        grid.push(this);
        assignPositions();
        displayOnPage(this.name + ' made a pit stop. ' + damage + ' damage was repaired but now they are in last place.');
        this.addDamageToCarDiv();
    
    }
    bumpCarInFront() {

        if (this.position > 1) {
            let carInFront = grid[this.position - 2];
            this.damage = this.damage + (10 * carInFront.weightLBS / this.weightLBS);
            carInFront.damage = carInFront.damage + (10 * this.weightLBS / carInFront.weightLBS)
            displayOnPage(`${this.name} bumped ${carInFront.name}. ${this.name} has ${this.damage} damage. ${carInFront.name} has ${carInFront.damage}`)
            carInFront.addDamageToCarDiv();
        }
    }
    addDamageToCarDiv() {
        let carDiv = document.getElementById(this.name + 'Div')
        carDiv.innerHTML = "";
        for (let i = 0; i < this.damage; i++) {
            let damage = document.createElement('div');
            damage.className = 'damage';
            damage.style.marginTop = Math.random() * 100 + 'px';
            damage.style.marginLeft = Math.random() * 100 + 'px';
            carDiv.appendChild(damage);
        }
    }
    checkForHighDamage() {
        if (this.damage > 100) {
            let index = grid.indexOf(this)
            grid.splice(index, 1)
            // TODO fix this mess
            // let child = document.querySelector(`[data-car-name='${this.name}']`)
            // carWrapper.removeChild(child);
            displayOnPage(this.name + ' wrecked out of the race.')
        }
    }
}

class PaceCar extends Car {
    constructor(options) {
        super(options);
        let index = grid.indexOf(this)
        grid.splice(index, 1)
    }
    cautionLap() {
        //TODO make this function;
    }
}


function assignPositions() {
    for (let i = 0; i < grid.length; i++) {
        grid[i].position = i + 1;
    }
}

function updateDisplayedPositionOfCars() {
    for (let i = 0; i < grid.length; i++) {
        let car = document.getElementById(grid[i].name + 'Div')
        car.style.marginTop = grid[i].position * 100 + 'px';
    }
}

PaceCar.prototype.cautionLap = function () {

}

function sortGrid() {
    function compare(a, b) {
        if (a.position < b.position)
            return -1;
        if (a.position > b.position)
            return 1;
        return 0;
    }
    grid.sort(compare)
}

function qualify() {
    function compare(a, b) {
        let random = 1 - (Math.random() * .5)
        if (a.powerToWeight * random < b.powerToWeight)
            return 1;
        if (a.powerToWeight * random > b.powerToWeight)
            return -1;
        return 0;
    }
    grid.sort(compare)
    displayOnPage('The starting order is ')
    for (let i = 0; i < grid.length; i++) {
        displayOnPage(`${i + 1}: ${grid[i].name} the ${grid[i].color} ${grid[i].manufacturer} ${grid[i].modelName}`)
    }
    assignPositions(grid);
    updateDisplayedPositionOfCars();
}

function race() {
    // for (let i = 0; i < lengthOfRace; i++) {
    i++
    randomNumber1 = Math.floor(Math.random() * grid.length)
    randomNumber2 = Math.floor(Math.random() * grid.length)
    while (randomNumber2 === randomNumber1) {
        randomNumber2 = Math.floor(Math.random() * grid.length)
    }
    randomCar1 = grid[randomNumber1];
    randomCar2 = grid[randomNumber2];

    randomCar1.passCar(randomCar2);
    randomCar2.bumpCarInFront();
    randomCar1.checkForHighDamage();
    randomCar2.checkForHighDamage();

    if (randomCar2.damage > 80) {
        randomCar2.makePitStop();
    }
    if (randomCar1.damage > 80) {
        randomCar1.makePitStop();
    }
    if (i == lengthOfRace) {
        clearInterval(interval);
        displayOnPage('The finishing order is ')
        for (let i = 0; i < grid.length; i++) {
            displayOnPage(`${i + 1}: ${grid[i].name} the ${grid[i].color} ${grid[i].manufacturer} ${grid[i].modelName} with ${grid[i].damage} damage`)
        }
        displayOnPage('You were ' + playersCarName)
    }
}


const car1 = new Car({
    name: 'Blue Rolla',
    modelName: 'Corolla',
    manufacturer: 'Toyota',
    color: 'blue',
    hp: 168,
    weightLBS: 3568
});

const car2 = new Car({
    name: 'Trusty Rusty',
    modelName: 'truck from 1957',
    manufacturer: 'Chevy',
    color: 'red',
    hp: 200,
    weightLBS: 5000
});
const car3 = new Car({
    name: 'White Stallion',
    modelName: 'E250',
    manufacturer: 'Ford',
    color: 'white',
    hp: 200,
    weightLBS: 4000,
    aggression: .7
});
const car4 = new Car({
    name: 'Smiley',
    modelName: 'Miata',
    manufacturer: 'Mazda',
    color: 'yellow',
    hp: 98,
    weightLBS: 1980
});

const paceCar1 = new PaceCar({
    name: 'Petey',
    modelName: 'Camero',
    manufacturer: 'Chevrolet',
    color: 'white',
    hp: 400,
    weightLBS: 3900
});

grid.forEach(displayCarOnPage)
