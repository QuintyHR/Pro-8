import "./styles.css";
import { kNear } from "knear";

const result = document.querySelector("#result");

// maak een knear instance
const k = 3;
const machine = new kNear(k);

// leer een kat
machine.learn([18, 9.2, 8.1, 2], "cat")
machine.learn([20.1, 17, 15.5, 5], "dog")
machine.learn([17, 9.1, 9, 1.95], "cat")
machine.learn([23.5, 20, 20, 6.2], "dog")
machine.learn([16, 9, 10, 2.1], "cat")
machine.learn([21, 16.7, 16, 3.3], "dog")

// maak een voorspelling
let length = document.getElementById('length').value
let height = document.getElementById('height').value
let weight = document.getElementById('weight').value
let ear = document.getElementById('ear').value

let prediction = machine.classify([length, height, weight, ear])

result.innerHTML = `I think it's a ${prediction}!`
