console.log("ML5 version", ml5.version);

// Initialize the Image Classifier method with MobileNet
const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
const image = document.getElementById('output')
const fileButton = document.querySelector("#file")
const synth = window.speechSynthesis

fileButton.addEventListener("change", (event)=>loadFile(event))
image.addEventListener('load', () => userImageUploaded())

// When the model is loaded
function modelLoaded() {
    console.log("The model is loaded")
};

function ClassifyImage(){
    classifier.classify(document.getElementById('output'), (err, results) => {
        console.log(results);
        console.log(results[0].label)
        let resultOne = document.getElementById("resultOne")
        let resultTwo = document.getElementById("resultTwo")

        let confidenceFirst = results[0].confidence.toFixed(2) * 100
        resultOne.innerHTML = `Mijn voorspelling zegt dat dit met ${confidenceFirst}% een ${results[0].label} is.`

        let confidenceSecond = results[1].confidence.toFixed(2) * 100
        resultTwo.innerHTML = `Mijn voorspelling zegt dat dit met ${confidenceSecond}% een ${results[1].label} is.`

        speak(`Mijn voorspelling zegt dat dit met ${confidenceFirst}% een ${results[0].label} is.`)
    })
}

//Speech 
function speak(text) {
    if (synth.speaking) {
        console.log('still speaking...')
        return
    }
    if (text !== '') {
        let utterThis = new SpeechSynthesisUtterance(text)
        synth.speak(utterThis)
    }
}

//Image 
function loadFile(event) {
    image.src = URL.createObjectURL(event.target.files[0])
}

function userImageUploaded(){
    console.log("The image is now visible in the DOM")
    ClassifyImage()
}