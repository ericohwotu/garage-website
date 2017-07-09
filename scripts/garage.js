var carBrands = ["BMW", "Benz", "Toyota", "VW", "Nissan", "Ford"];
var pendingIndex = 0;
var garage = { open: false, vehicles: [], maxcapacity: 30, profit: 0 }
var pendingCars = [];
var consolePending = [];
var carsInGarage = [];
const MAX_PENDING = 10;

// ===================================== prototype functions =========================================== //
Array.prototype.sum = function (prop) {
    var total = 0
    for (var i = 0, _len = this.length; i < _len; i++) {
        total += this[i][prop]
    }
    return total
}

Array.prototype.average = function (prop) {
    var total = 0
    for (var i = 0, _len = this.length; i < _len; i++) {
        total += this[i][prop]
    }
    var average = total / this.length
    return average
}

// ========================================= onload ==================================================== //
window.onload = function () {
    console.log("started")
    generateCar()
    setInterval(generateCar, 2000);

    // set up for command line if enter is pressed then call the function run command
    document.getElementById("terminal")
    .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            runCommand()
        }
    });
}

// ========================================= Garage Functions ========================================= //
var getLicensePlate = function (length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function generateCar() {
    // timeout function that constantly adds an new vehicle
    // to the pending vehicles which are waiting to be accepted
    if (pendingCars.length < MAX_PENDING && garage.open) {
        var ci = Math.floor(Math.random() * carBrands.length);
        var chosenBrand = carBrands[ci];
        var price = (Math.floor(Math.random() * 50000)) + 10000;
        this.vehicle = { _id: pendingIndex, _brand: chosenBrand, _price: price, _license: getLicensePlate(5), _parts: generateParts(10,true) }

        pendingCars.push(this.vehicle);
        addToPendingTable(this.vehicle)

        pendingIndex++;
    }
    //console.log(pendingCars);
}

function addVehicle(){
    this.brand = document.getElementById("make").value
    this.price = document.getElementById("value").value
    this.license = document.getElementById("licenceplate").value
    this.vehicle = {_id: pendingIndex, _brand:this.brand, _price: this.price, _license: this.license, _parts: generateParts(10,true)};
    addToGarageTable(this.vehicle)
    garage.vehicles.push(this.vehicle)
}

function generateParts(num, dam) {
    partsList = []
    for (i = 0; i < num; i++) {
        maxFixTime = Math.floor(Math.random() * 40) + 10//in minutes 
        maxFixCost = Math.floor(Math.random() * 200) + 50//in pounds

        if(!dam) brokenLevel = 0; else brokenLevel = Math.random()

        fixTime = maxFixTime * brokenLevel
        fixCost = Math.floor(maxFixCost * brokenLevel)
        var part = { _id: i, _ref: getLicensePlate(10), _damageLevel: parseFloat(brokenLevel.toFixed(2)), _fixTime: fixTime, _fixCost: fixCost}
        partsList.push(part)
    }
    return partsList
}

function checkInCar() {
    // function to check in the car
    var pendingTable = document.getElementById("pendingVehicles")

    if (garage.open) {
        var vehicle = pendingCars.shift()
        garage.vehicles.push(vehicle);
        addToGarageTable(vehicle);
        pendingTable.removeChild(pendingTable.getElementsByTagName("tr")[0])
        console.log(garage.vehicles)
    } else {
        alert("Sorry The Garage is closed")
    }
}

function checkOutCar(i) {
    // function to check out the car
    var garageTable = document.getElementById("garageVehicles")

    var doc = document.getElementById(i)

    if (garage.open) {
        var result = garage.vehicles.filter(function (obj) {
            return obj._id != i;
        });

        garage.vehicles = result
        garageTable.removeChild(doc)

        console.log(result)
    } else {
        alert("Sorry The Garage is closed. Vehicle will be left in until it reopens")
    }
}

function fixVehicle(i) {
    
    var objIndex = garage.vehicles.findIndex((obj => obj._id == i));
    console.log(objIndex)
    for (j = 0; j < garage.vehicles[objIndex]._parts.length; j++) {
        garage.vehicles[objIndex]._parts[j]._damageLevel = 0
    }

    //console.log()
    //update the table
    var doc = document.getElementById("damage" + i)
    doc.getElementsByClassName('damagelevel')[0].style.width = 0
    //doc.appendChild(getProgressBar(0))

}

// ================================================ garage ui functions ==========================================//

function addToPendingTable(vehicle) {
    var pendingTable = document.getElementById("pendingVehicles")

    var row = document.createElement("tr");
    row.id = vehicle._id

    var licenseField = document.createElement("td")
    var licenseText = document.createTextNode(vehicle._license)
    licenseField.appendChild(licenseText)

    var makeField = document.createElement("td")
    var makeText = document.createTextNode(vehicle._brand)
    makeField.appendChild(makeText)

    row.appendChild(licenseField)
    row.appendChild(makeField)

    pendingTable.appendChild(row)
    //pendingTable.appendChild('<tr id="'+ vehicle._id +'"><td>'+vehicle._license+'</td><td>'+vehicle._brand+'</td></tr>')
}

function addToGarageTable(vehicle) {
    var garageTable = document.getElementById("garageVehicles")

    var row = document.createElement("tr");
    row.id = vehicle._id

    //license plate
    var licenseField = document.createElement("td")
    var licenseText = document.createTextNode(vehicle._license)
    licenseField.appendChild(licenseText)

    //brand name
    var makeField = document.createElement("td")
    var makeText = document.createTextNode(vehicle._brand)
    makeField.appendChild(makeText)

    //parst list
    var partsField = document.createElement("td")
    var partsText = document.createTextNode(vehicle._parts.length)
    partsField.appendChild(partsText)

    //health
    var healthField = document.createElement("td")
    healthField.setAttribute("id", "damage" + vehicle._id)
    var healthText = getProgressBar(vehicle._parts.average("_damageLevel"))
    healthField.appendChild(healthText)

    //progress
    var costField = document.createElement("td")
    var costBar = document.createTextNode(vehicle._parts.sum("_fixCost"))
    costField.appendChild(costBar)

    //actions
    var actionsField = document.createElement("td")
    var actionsText = getActions(vehicle._id)
    actionsField.appendChild(actionsText)

    row.appendChild(licenseField)
    row.appendChild(makeField)
    row.appendChild(partsField)
    row.appendChild(healthField)
    row.appendChild(costField)
    row.appendChild(actionsField)

    garageTable.appendChild(row)

}

function getProgressBar(progress) {
    var p = Math.floor(progress * 100)
    console.log(progress)

    var progressDiv = document.createElement("div")
    progressDiv.setAttribute("class", "progress")

    var progressBarDiv = document.createElement("div")
    progressBarDiv.setAttribute("class", "progress-bar damagelevel")
    progressBarDiv.setAttribute("role", "progress-bar")
    progressBarDiv.setAttribute("aria-valuenow", p)
    progressBarDiv.setAttribute("aria-valuemin", "0")
    progressBarDiv.setAttribute("aria-valuemax", "100")
    progressBarDiv.setAttribute("style", 'width:' + p + '%')

    progressDiv.appendChild(progressBarDiv)

    return progressDiv
}

function getActions(i) {
    var actionsDiv = document.createElement("div")

    var checkOutBtn = document.createElement("button")
    checkOutBtn.setAttribute("type", "button")
    checkOutBtn.setAttribute("id", 'checkout' + i)
    checkOutBtn.setAttribute("class", "btn table-btn")
    checkOutBtn.setAttribute("onclick", "checkOutCar(" + i + ")")
    checkOutBtn.innerHTML = "CheckOut"

    var fixBtn = document.createElement("button")
    fixBtn.setAttribute("type", "button")
    fixBtn.setAttribute("id", 'fix' + i)
    fixBtn.setAttribute("class", "btn table-btn")
    fixBtn.setAttribute("onclick", "fixVehicle(" + i + ")")
    fixBtn.innerHTML = "Fix"

    actionsDiv.appendChild(checkOutBtn)
    actionsDiv.appendChild(fixBtn)

    return actionsDiv
}

function openDoors(){
    var doors = document.getElementsByClassName("door");
    
    for(var door=0; door<doors.length; door++){
        console.log(door)
        doors[door].style.width = 0;
    }

    garage.open = true;
}

//=========================================== command line scripts =============================================///
function runCommand(){
    var commands = document.getElementById("terminal").value.split(" ")
    var consoleOutput = document.getElementById("consoleout")

    switch(commands[0]){
        case "open":
            garage.open = true;
            consoleOutput.value += ">>> The Garage Is Open\n"
            break;

        case "close":
            garage.open = false;
            consoleOutput.value += ">>> The Garage Is Closed\n"
            break;

        case "clear":
            consoleOutput.value = ""
            break;

        case "output":
            if (commands.length>=2){
                if (commands[1] == "garage") consoleOutput.value += outputGarage()
                if (commands[1] == "pending") consoleOutput.value += output(pendingCars)
                if (commands[1] == "created") consoleOutput.value += output(consolePending)
            }else consoleOutput.value += "Sorry command not recognised please try: \n  garage or \n  pending or\n  created\n"
            break;

        case "create":
            if (commands.length>=5){
                var faults = true
                if(commands[4]=="NOFAULTS") faults = false
                var price = (Math.floor(Math.random() * 50000)) + 10000;
                consolePending.push({_id:pendingIndex,_license:commands[2],_brand:commands[1],_parts:generateParts(commands[3],faults), _price: price})
                pendingIndex++;
                consoleOutput.value += ">>> Vehicle Succesfully Created\n"
            }else consoleOutput.value += ">>> Sorry missing some parameters\n"
            break;

    }

    document.getElementById("terminal").value = ""
    consoleOutput.scrollTop = consoleOutput.scrollHeight; //set scroll to latest
    
}

function outputGarage(){
    var output = ""
    
    output += "Open: " + garage.open + "\nVehicles: \n\n"
    for (var i=0; i<garage.vehicles.length; i++){
        output += "    Make: " + garage.vehicles[i]._brand + "\n"
        output += "    License Plate: " + garage.vehicles[i]._license + "\n"
        output += "    Damage Level: " + garage.vehicles[i]._parts.average("_damageLevel") + "\n"
        output += "    Parts: " + garage.vehicles[i]._parts.length + "\n"
        output += "    Cost: " + garage.vehicles[i]._parts.sum("_fixCost") + "\n\n"
    }

    return output
}

function output(list){
    var output = ""
    
    for (var i=0; i<list.length; i++){
        output += "    License Plate: " + list[i]._license + "\n"
        output += "    Make: " + list[i]._brand + "\n"
        output += "    Damage Level: " + list[i]._parts.average("_damageLevel") + "\n"
        output += "    Parts: " + list[i]._parts.length + "\n"
        output += "    Cost: " + list[i]._parts.sum("_fixCost") + "\n\n"
    }

    return output
}

function checkInCar2(lic) {
    // function to check in the car
    var pendingTable = document.getElementById("pendingVehicles")

    if (garage.open) {

        var result = consolePending.filter(function (obj) {
            return obj._license == lic;
        });

        if(result.length == 0) return ">>> License plate does not exist\n"

        consolePending = consolePending.filter(function (obj) {
            return obj._license != lic;
        });

        garage.vehicles.push(result[0]);
        addToGarageTable(result[0]);

        return ">>> " + lic + " added successfully\n"
    } else {
        return ">>> Sorry The Garage is closed\n"
    }
}