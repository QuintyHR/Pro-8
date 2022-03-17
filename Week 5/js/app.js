import { DecisionTree } from "../libraries/decisiontree.js"
import { VegaTree } from "../libraries/vegatree.js"

const csvFile = "./data/diabetes.csv"
const trainingLabel = "Gender"
const ignoredColumns = ['Name']    

let trainData
let testData

let patient
let patientPrediction

let decisionTree

let totalAmount
let amountCorrectDiabetes = 0
let amountFalseDiabetes = 0
let amountCorrectHealthy = 0
let amountFalseHealthy = 0
let amountTotalCorrect
let amountTotalFalse
let accuracy

let diabetesGreen = document.getElementById("diabetesGreen")
let actuallyHealthy = document.getElementById("actuallyHealthy")
let actuallyDiabetes = document.getElementById("actuallyDiabetes")
let healthyGreen = document.getElementById("healthyGreen")

// inladen csv data
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => trainModel(results.data) // train het model met deze data
    })

    predict()
}

//
// MACHINE LEARNING - Bouw de Decision Tree
//
function trainModel(data) {
    //Train en test data
    trainData = data.slice(0, Math.floor(data.length * 0.8))
    testData = data.slice(Math.floor(data.length * 0.8) + 1)

    console.log(trainData)
    console.log(testData)

    decisionTree = new DecisionTree({
        // hier kan je aangeven welke kolommen genegeerd moeten worden
        //ignoredAttributes: ['Label'],    
        trainingSet: trainData,
        // dit is het label dat je wil gaan voorspellen
        categoryAttr: "Outcome"          
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let json = decisionTree.toJSON()
    let visual = new VegaTree('#view', 2300, 1000, json)

    predict()
}

function predict() {
    patient = testData[0]
    patientPrediction = decisionTree.predict(patient)
    //console.log(`Predict if diabetes : ${patientPrediction}`)

    totalAmount = testData.length

    for(let i = 0; i < totalAmount; i++) {
        testPatient(testData[i])
    }

    amountTotalCorrect = amountCorrectDiabetes + amountCorrectHealthy
    amountTotalFalse = amountFalseDiabetes + amountFalseHealthy
    accuracy = amountTotalCorrect / totalAmount

    diabetesGreen.innerHTML = `${amountCorrectDiabetes}`
    actuallyHealthy.innerHTML = `${amountFalseDiabetes}`
    actuallyDiabetes.innerHTML = `${amountFalseHealthy}`
    healthyGreen.innerHTML = `${amountCorrectHealthy}`

    console.log(`The accuracy is: ${accuracy}`)
}

function testPatient(patient) {
    // kopie van patient maken, zonder het label
    const patientWithoutLabel = Object.assign({}, patient)
    delete patientWithoutLabel.Outcome

    // prediction
    let prediction = decisionTree.predict(patientWithoutLabel)

    // vergelijk de prediction met het echte label
    if (prediction == 1 && patient.Outcome == 1) {
        amountCorrectDiabetes++
    } 
    
    if (prediction == 1 && patient.Outcome != 1) {
        amountFalseDiabetes++
    }

    if (prediction == 0 && patient.Outcome == 0) {
        amountCorrectHealthy++
    } 
    
    if (prediction == 0 && patient.Outcome != 0) {
        amountFalseHealthy++
    }
}

loadData()