
import { createChart, updateChart } from "./scatterplot.js";

let nn;
let fillPrediction = document.getElementById("prediction")

let inputBrand
let currentInputBrand
let inputCylinders
let currentInputCylinders
let inputFuelCity
let currentInputFuelCity
let inputFuelConsumption
let currentInputFuelConsumption

let predictEmission

document.getElementById('predict').onclick = function (){ inputs() }

function inputs() {
  inputBrand = document.getElementById('brand').value
  currentInputBrand = parseInt(inputBrand)

  inputCylinders = document.getElementById('cylinders').value
  currentInputCylinders = parseInt(inputCylinders)

  inputFuelCity = document.getElementById('fuelCity').value
  currentInputFuelCity = parseInt(inputFuelCity)

  inputFuelConsumption = document.getElementById('fuelConsumption').value
  currentInputFuelConsumption = parseInt(inputFuelConsumption)

  loadModel()
}

function loadModel() {
  const options = {task: "regression", debug: true}
  nn = ml5.neuralNetwork(options)

  const modelInfo = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
  };
  
  nn.load(modelInfo, predict())
  console.log("Model loaded")
}

async function predict() {
  predictEmission = { 
    Brand: currentInputBrand, 
    Cylinders: currentInputCylinders, 
    FuelConsumptionCity: currentInputFuelCity, 
    FuelConsumptionComb: currentInputFuelConsumption 
  }

  const results = await nn.predict(predictEmission);

  console.log(`Deze auto verbruikt ${results[0].Emission} g/km`);
  fillPrediction.innerHTML(`Uw auto verbruikt ${results[0].Emission} g/km`)
}
