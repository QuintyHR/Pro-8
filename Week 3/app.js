const video = document.getElementById('video');

// Create a new poseNet method
const poseNet = ml5.poseNet(video, modelLoaded);

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
        };
    });
}

// When the model is loaded
function modelLoaded() {
    console.log('Model Loaded!');

    // Listen to new 'pose' events
    poseNet.on('pose', (results) => {
        poses = results;
        console.log(poses)
    });
}
