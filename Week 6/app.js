/* global Chart, ml5 */

import { createChart, updateChart } from "./scatterplot.js"

let nn
let tempArray = []
let btnSaveTraining = document.getElementById("saveTraining")

btnSaveTraining.addEventListener("click", () => saveTraining())

function saveTraining() {
    console.log("Save car model")
    nn.save("carModel")
}

function loadModel() {
    const options = {task: "regression", debug: true}
    nn = ml5.neuralNetwork(options)
    
    nn.load('model/carModel.json', loadData)
    // console.log("Model loaded")
}

function loadData() {
    Papa.parse("./data/cars.csv", {
        download: true,
        header: true, 
        dynamicTyping: true,
        complete: (results) => {
            drawScatterplot(results.data)
        }
    })
}

//
// mpg en horsepower gebruiken als x, y voor de scatterplot
//
async function drawScatterplot(data) {
    const columns = data.map(car => ({
        x: car.horsepower,
        y: car.mpg,
    }))
    
    // now call the create chart function  
    createChart(columns)

    for(let hp = 50; hp < 250; hp += 5) {
        const results = await nn.predict({horsepower:hp, weight:3000, cylinders:8, acceleration:11})
        tempArray.push({x:hp, y:results[0].mpg})
        // console.log({x:hp, y:results[0].mpg})
    }

    updateChart("predicted mpg", tempArray)
}

//
// neural network leert mpg voor elke horsepower
//
async function createNeuralNetwork(data) {
    data.sort(() => (Math.random() - 0.5))

    const options = {task: "regression", debug: true}
    nn = ml5.neuralNetwork(options)

    for (let car of data) {
        // hier horsepower en mpg doorgeven, zie github
        nn.addData({horsepower:car.horsepower, weight:car.weight, cylinders:car.cylinders, acceleration:car.acceleration}, {mpg:car.mpg})
    }

    // nn.normalizeData()
    // nn.train({ epochs: 15 }, () => finishedTraining())
}

//
// maak een prediction
//
async function finishedTraining() {
    let testCar = {horsepower: 90, weight:3000, cylinders:8, acceleration:11}
    const results = await nn.predict(testCar)
    
    // toon de voorspelling in de console
    console.log(`Auto met 90 hp hp rijdt ${results[0].mpg} mpg`)

    for(let hp = 50; hp < 250; hp += 5) {
        const results = await nn.predict({horsepower:hp, weight:3000, cylinders:8, acceleration:11})
        tempArray.push({x:hp, y:results[0].mpg})
        // console.log({x:hp, y:results[0].mpg})
    }

    updateChart("predicted mpg", tempArray)
}

// loadData()
loadModel ()