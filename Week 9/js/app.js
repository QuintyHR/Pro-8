
import { createChart, updateChart } from "./scatterplot.js";

let nn;
let tempArray = []
let btnSaveTraining = document.getElementById("saveTraining")

btnSaveTraining.addEventListener("click", () => saveTraining())

function saveTraining() {
  console.log("Save emission model")
  nn.save()
}

function loadData() {
  Papa.parse("./data/emission.csv", {
      download: true,
      header: true, 
      dynamicTyping: true,
      complete: (results) => {
          console.log(results.data)

          // pass the data to the showdata function
          showData(results.data);

          // pass the data to a neural network
          createNeuralNetwork(results.data);
      }
  })
}

function showData(data) {

  const columns = data.map((emission) => ({
    x: emission.Cylinders,
    y: emission.Emission,
  }));

  // now call the create chart function
  createChart(columns);
}

function createNeuralNetwork(data) {
  data = data.map(emission => ({
    Cylinders: emission.Cylinders,
    Emission: emission.Emission,
    Brand: emission.Brand,
    FuelConsumptionCity: emission.FuelConsumptionCity,
    FuelConsumptionComb: emission.FuelConsumptionComb
  }))

  data.sort(() => Math.random() - 0.5);

  nn = ml5.neuralNetwork({ task: "regression", debug: true });

  for (let emission of data) {
    // hier Cylinders en Emission doorgeven, zie github
    nn.addData( { Cylinders:emission.Cylinders, 
                  Brand:emission.Brand, 
                  FuelConsumptionCity:emission.FuelConsumptionCity,
                  FuelConsumptionComb:emission.FuelConsumptionComb }, 
                { Emission: emission.Emission });
  }

  nn.normalizeData();
  // nn.train({ epochs: 100 }, () => finishedTraining());
}

async function finishedTraining() {
  let testCar = { Cylinders: 6, Brand: 30, FuelConsumptionCity: 9.9, FuelConsumptionComb: 28 };
  const results = await nn.predict(testCar);

  // toon de voorspelling in de console
  console.log(`Deze auto met Cylinders: 6, Brand: 30, FuelConsumptionCity: 9.9, FuelConsumptionComb: 28 verbruikt ${results[0].Emission} g/km`);

  for (let emission = 2; emission < 16; emission += 0.1) {
    const results = await nn.predict({ Cylinders: emission, Brand: emission, FuelConsumptionCity: emission, FuelConsumptionComb:emission });
    tempArray.push({ x: emission, y: results[0].Emission });
  }

  updateChart("predicted Emission", tempArray);
}

loadData();
