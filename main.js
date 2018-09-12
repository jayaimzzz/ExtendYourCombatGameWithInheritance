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
const mainWrapper = document.getElementById('mainWrapper');
function displayOnPage(text){
    let t = document.createTextNode(text);
    let span = document.createElement('span');
    let br = document.createElement('br');
    span.appendChild(t);
    mainWrapper.appendChild(span);
    mainWrapper.appendChild(br);
}

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
        this.aggression = .5;
    }
}

Car.prototype.makePitStop = function(){
    this.damage = 0;
    let index = grid.indexOf(this)
    grid.splice(index, 1)
    grid.push(this);
    console.log(index)
    
}

Car.prototype.passCar = function (whom) {
    if (this.position >= 1) {
        this.position = whom.position;
        whom.position++;
    }
    if (Math.random() < this.aggression){
        this.damage = this.damage + (10 * whom.weightLBS / this.weightLBS);
        whom.damage = whom.damage + (10 * this.weightLBS / whom.weightLBS)
        console.log(this.damage);
        displayOnPage(this.name + ' bumped ' + whom.name + ' while passing!')
        displayOnPage(this.name + ' has ' + this.damage + ' percent damage and is now in position ' + this.position)
        displayOnPage(whom.name + ' has ' + whom.damage + ' percent damage.')
    } else {
        displayOnPage(this.name + ' stole the ' + this.position + ' position from ' + whom.name + '.')
    }
}

function qualify(grid){
    function compare(a,b) {
        let random = 1 - (Math.random() * .5)
        if (a.powerToWeight * random < b.powerToWeight)
          return 1;
        if (a.powerToWeight * random > b.powerToWeight)
          return -1;
        return 0;
      }
      grid.sort(compare)
      let order = '';
      displayOnPage('The starting order is ')
      for (let i = 0; i < grid.length; i++){
       order = grid[i]['name']
       displayOnPage(i + 1 + ': ' + grid[i].name)
      }
}


const car1 = new Car('Blue Rolla', 'Corolla', 'Toyota', 'blue', 168, 3568);
const car2 = new Car('Trusty Rusty', 'F250', 'Ford', 'red', 200, 4200);
const car3 = new Car('White Stallion', 'E250', 'Ford', 'white', 200, 6000);
const car4 = new Car('Smiley', 'Miata', 'Mazda', 'yellow', 98, 1980);
const grid = [car1, car2, car3, car4];

qualify(grid);
console.log(grid)
car1.makePitStop()

