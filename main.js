const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const videoEl = document.getElementById("video");
const inputSize = 224;
const scoreThreshold = 0.5;
const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });

const image = new Image(500, 500);
image.src = "./asset/laughman.png";

async function onPlay() {
    if(videoEl.paused || videoEl.ended || !faceapi.nets.tinyFaceDetector.params)
        return setTimeout(() => onPlay());

    const iSize = {width: 640, height: 480};
    const fData = await faceapi.detectAllFaces(videoEl, options).withFaceLandmarks();
    const rData = await faceapi.resizeResults(fData, iSize);
    context.clearRect(0, 0, canvas.width, canvas.height);
    rData.forEach(data=>{drawResult(data);});
    setTimeout(() => onPlay());
};

function drawResult(data) {
    const box = data.detection.box;
    context.drawImage(image, box.x - box.width * 0.25, box.y - box.height * 0.25, box.height * 1.5, box.height * 1.5);
}

async function run(){
    await faceapi.nets.tinyFaceDetector.load("./lib/weights");
    await faceapi.loadFaceLandmarkModel("./lib/weights");
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    videoEl.srcObject = stream;
}

$(document).ready(function() {
    run();
});