// function Car(name, modelName, manufacturer, color, hp, weightLBS) {
//     this.name = name;
//     this.modelName = modelName;
//     this.manufacturer = manufacturer;
//     this.color = color;
//     this.hp = hp;
//     this.weightLBS = weightLBS;
//     this.powerToWeight = hp / weightLBS * 10;
//     this.damage = 0;
//     this.position = 1;
// }
class Car {
    constructor(name, modelName, manufacturer, color, hp, weightLBS) {
        this.name = name;
        this.modelName = modelName;
        this.manufacturer = manufacturer;
        this.color = color;
        this.hp = hp;
        this.weightLBS = weightLBS;
        this.powerToWeight = hp / weightLBS * 10;
        this.damage = 0;
        this.position = 1;
    }
}

Car.prototype.passCar = function (whom) {
    if (this.position >= 1) {
        this.position = whom.position;
        whom.position++;
    }
}

function qualify(grid){
    
}


const car1 = new Car('Blue Rolla', 'Corolla', 'Toyota', 'blue', 168, 3568);
const car2 = new Car('Trusty Rusty', 'F250', 'Ford', 'red', 200, 4200);
const car3 = new Car('White Stallion', 'E250', 'Ford', 'white', 200, 6000);
const car4 = new Car('Smiley', 'Miata', 'Mazda', 'yellow', 98, 1980);
const opponents = [car2, car3];

car1.passCar(car2)
console.log(car1.position);
console.log(car2.position)