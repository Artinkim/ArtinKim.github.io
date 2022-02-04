let capture;
let posenet;
let noseX,noseY;
let reyeX,reyeY;
let leyeX,leyeY;
let singlePose,skeleton;
let actor_img;
let specs,smoke;
let yolo; //Initializing model method with YOLO. A callback needs to be passed
let status; //Status check to determine whthere the model has been loaded
let objects = [];

function setup() {  // this function runs only once while running
    createCanvas(800, 500);
    //console.log("setup funct");
    capture = createCapture(VIDEO);
    capture.hide();

    //load the PoseNet model
    posenet = ml5.poseNet(capture, modelLOADED);
    yolo = ml5.YOLO(capture, startDetecting);
    
    status = select('#status');
    //detect pose
    posenet.on('pose', recievedPoses);

    actor_img = loadImage('images/shahrukh.png');
    specs = loadImage('images/spects.png');
}

function recievedPoses(poses) {
    console.log(poses);

    if(poses.length > 0) {
        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function modelLOADED() {
    console.log("model has loaded");
}

function startDetecting() {
    status.html('Model loaded!'); //When the model is loaded
    detect(); //Calling detect method
} 
function detect() {
    yolo.detect(function(err, results) {
    objects = results; //Storing results in object
    detect(); //Continuous detection
    });
}    

function draw() { // this function code runs in infinite loop
    
    // images and video(webcam)
    image(capture, 0, 0);
    fill(255, 0, 0);
    
    if(singlePose) {
        for(let i=0; i<singlePose.keypoints.length; i++) {
            ellipse(singlePose.keypoints[i].position.x, singlePose.keypoints[i].position.y, 20);
        }

        stroke(255, 255, 255);
        strokeWeight(5);

        for(let j=0; j<skeleton.length; j++) {
            line(skeleton[j][0].position.x, skeleton[j][0].position.y, skeleton[j][1].position.x, skeleton[j][1].position.y);
        }
        for (let i = 0; i < objects.length; i++) {  //Iterating through all object
            noStroke();
            fill(0, 255, 0); //Color of text
            text(objects[i].label, objects[i].x * width, objects[i].y * height - 5); //Displaying the label
            noFill();
            strokeWeight(4); 
            stroke(0, 255, 0); //Defining stroke for rectangular outline
            rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
        }
        // Apply specs and cigar
        image(specs, singlePose.nose.x, singlePose.nose.y, 125, 125);
    }
}
