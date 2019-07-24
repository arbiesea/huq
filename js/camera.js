// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false };

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[1];
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}

// Take a picture when cameraTrigger is tapped
    cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);

    //cameraOutput = document.querySelector("#" +imageCode),
    //cameraOutput.src = cameraSensor.toDataURL("image/webp");
    //cameraOutput.style.backgroundImage= cameraSensor.toDataURL("image/webp");

    document.getElementById(imageCode).style.backgroundImage = "url(" + cameraSensor.toDataURL("image/webp") +")";
    //cameraOutput.classList.add("taken");
    $('#viewFinder').fadeOut();
    //cameraView.pause();
    cameraView.srcObject = null;
};

// Start the video stream when the window loads
//window.addEventListener("load", cameraStart, false);