const mainWrapper = document.getElementById('mainWrapper');
const carsDiv = document.getElementById('carsDiv');
let playersCarName, randomCar1, randomCar2;
let lengthOfRace = 100;

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

function selectCar(element) {
    playersCarName = element.currentTarget.dataset.carName;
    let aggression = prompt(`You selected ${playersCarName}. On a scale between 0 and 10, how aggresive are you going to drive?`)
    if (aggression > 10) {
        aggression = 10
    };
    if (aggression < 0) {
        aggression = 0
    };
    agression = aggression / 10;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].name == playersCarName) {
            grid[i].aggression = aggression
            grid[i].name = 'YOU, aka ' + grid[i].name + ','
        }
    }
    removeCarsOnPage();
    qualify();
    race()

}

function Car(options) {
    this.name = options.name;
    this.modelName = options.modelName;
    this.manufacturer = options.manufacturer;
    this.color = options.color;
    this.hp = options.hp;
    this.weightLBS = options.weightLBS;
    this.powerToWeight = options.hp / options.weightLBS * 10;
    this.damage = 0;
    this.position = 1;
    this.aggression = options.aggression || .5;
    this.wrecked = false;
}

function PaceCar(options) {
    Car.call(this);
}

function assignPositions() {
    for (let i = 0; i < grid.length; i++) {
        grid[i].position = i + 1;
    }
}

// class Car {
//     constructor(name, modelName, manufacturer, color, hp, weightLBS) {
//         this.name = name;
//         this.modelName = modelName;
//         this.manufacturer = manufacturer;
//         this.color = color;
//         this.hp = hp;
//         this.weightLBS = weightLBS;
//         this.powerToWeight = hp / weightLBS * 10;
//         this.damage = 0;
//         this.position = 1;
//         this.aggression = .5;
//     }
// }

Car.prototype.makePitStop = function () {
    let damage = this.damage;
    this.damage = 0;
    let index = grid.indexOf(this)
    grid.splice(index, 1)
    grid.push(this);
    assignPositions();
    displayOnPage(this.name + ' made a pit stop. ' + damage + ' damage was repaired but now they are in last place.');

}

Car.prototype.passCar = function (whom) {
    if (this.position > whom.position) {
        if (this.powerToWeight / Math.random() > whom.powerToWeight) {
            let temp = this.position;
            this.position = whom.position;
            whom.position = temp;
            sortGrid();
            // displayOnPage(this.name + ' stole the ' + this.position + ' position from ' + whom.name + '.')
            if (Math.random() < this.aggression) {
                this.damage = this.damage + (10 * whom.weightLBS / this.weightLBS);
                whom.damage = whom.damage + (10 * this.weightLBS / whom.weightLBS)
                console.log(this.damage);
                displayOnPage(this.name + ' bumped ' + whom.name + ' while passing!')
                displayOnPage(this.name + ' has ' + this.damage + ' percent damage and is now in position ' + this.position)
                displayOnPage(whom.name + ' has ' + whom.damage + ' percent damage.')
            } else {
                displayOnPage(this.name + ' stole the ' + this.position + ' position from ' + whom.name + '.')
            }

        } else {
            displayOnPage(this.name + ' tried to pass ' + whom.name + "but didn't have enough speed.")
        }

    } else {
        console.log(this.name + ' is already ahead of ' + whom.name)
    }
}

Car.prototype.bumpCarInFront = function () {

    if (this.position > 1) {
        carInFront = grid[this.position - 2];
        this.damage = this.damage + (10 * carInFront.weightLBS / this.weightLBS);
        carInFront.damage = carInFront.damage + (10 * this.weightLBS / carInFront.weightLBS)
        displayOnPage(`${this.name} bumped ${carInFront.name}. ${this.name} has ${this.damage} damage. ${carInFront.name} has ${carInFront.damage}`)
    }
}

// Car.prototype.passCar = function (whom) {
//     if ((this.powerToWeight * Math.random()) < whom.powerToWeight) {
//         if (this.position > whom.position) {
//             let temp = this.position;
//             this.position = whom.position;
//             whom.position = temp;
//             if (Math.random() < this.aggression) {
//                 this.damage = this.damage + (10 * whom.weightLBS / this.weightLBS);
//                 whom.damage = whom.damage + (10 * this.weightLBS / whom.weightLBS)
//                 console.log(this.damage);
//                 displayOnPage(this.name + ' bumped ' + whom.name + ' while passing!')
//                 displayOnPage(this.name + ' has ' + this.damage + ' percent damage and is now in position ' + this.position)
//                 displayOnPage(whom.name + ' has ' + whom.damage + ' percent damage.')
//             } else {
//                 displayOnPage(this.name + ' stole the ' + this.position + ' position from ' + whom.name + '.')
//             }
//         } else {
//             console.log(this.name + ' is already ahead of ' + whom.name)
//         }
//         assignPositions(grid);
//     } else {
//         displayOnPage(this.name + ' tried to pass ' + whom.name + "but didn't have enough speed.")
//     }
// }


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
}

function race() {
    for (let i = 0; i < lengthOfRace; i++) {
        randomNumber1 = Math.floor(Math.random() * grid.length)
        randomNumber2 = Math.floor(Math.random() * grid.length)
        while (randomNumber2 === randomNumber1) {
            randomNumber2 = Math.floor(Math.random() * grid.length)
        }
        randomCar1 = grid[randomNumber1];
        randomCar2 = grid[randomNumber2];
        console.log(randomCar1)
        console.log(randomCar2)
        randomCar1.passCar(randomCar2);
        randomCar2.bumpCarInFront();

        if (randomCar2.damage > 80) {
            randomCar2.makePitStop();
        }
        if (randomCar1.damage > 80) {
            randomCar1.makePitStop();
        }
        displayOnPage('The finishing order is ')
        for (let i = 0; i < grid.length; i++) {
            displayOnPage(`${i + 1}: ${grid[i].name} the ${grid[i].color} ${grid[i].manufacturer} ${grid[i].modelName} with ${grid[i].damage} damage`)
        }
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

const grid = [car1, car2, car3, car4];
grid.forEach(displayCarOnPage)

// qualify(grid);
// car2.passCar(car4);
// car2.makePitStop();
// console.log(grid)
// car1.makePitStop()