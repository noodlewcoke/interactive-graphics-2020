
function resetFlags() {
    typingFlags = { "sitting0" : true, "typing3" : true, "typing1" : true, "typing2" : true};
    fromChairFlags = { "fromChair0" : true, "fromChair1" : true, "fromChair2" : true };
    toChairFlags = { "turn" : true, "toChair0" : true, "toChair1" : true, "toChair2" : true, "toChair3" : true};
    walkingFlags = { "walking0" : true, "walking1" : true, "walking2" : true, "walking3" : true}
    toCouchFlags = { "laying1" : true, "laying2" : true };
    sleepFlags = { "laying1" : true, "sleeping" : true };
    fromCouchFlags = { "fromCouch1" : true, "fromCouch2" : true };
    gotoChairFlags = { "comeBack" : true, "toChair" : true };
    fromCouchInit = false;
    fromCouchInc = 0; 
    sleepInit = false;
    sleepInc = 0;
    toCouchInit = false;
    toCouchInc = 0;
    dirTable = false;
    walkingInit = false;
    walkingInc = 0;
    typingInit = false;
    typingCounter = 0;
    increment = 0;
    tiredFlag = false;
    tiredInc = 0 ;
    watchingFlag = false;
    watchingInc = 0;
    fromChairFlag = false;
    fromChairInc = 0;
    toChairInit = false;
    toChairInc = 0;
    sittingIdleInit = false;
    sittingIdleInc = 0;
}

var camPose = -7;

var speedMultiplier;


function fromCouch( poses, flags, inc ) {
    var fromCouch1 = poses["laying1"];
    var fromCouch2 = poses["fromChair2"];
    
    var speed = 0.005 * speedMultiplier;
    if ( flags.fromCouch1 ) {
        var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations))); 
        loadPoseR( letr3D( currentPose, fromCouch1, inc ) );
        // MODEL.position.z += ( 4 - MODEL.position.z ) * inc/4;
        
        // MODEL.rotation.y += (0.0 - MODEL.rotation.y) * inc/4;
        MODEL.rotation.x += (0.0 - MODEL.rotation.x) * inc/4;
        MODEL.rotation.z += (0.0 - MODEL.rotation.z) * inc/10;
        MODEL.position.y += (-3.5 - MODEL.position.y ) * inc/10;
        if ( inc >= 0.5 ) {
            MODEL.position.x += (-8.6 - MODEL.position.x ) * inc/9;
        }
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.fromCouch1 = false;
        }
    }
    else if ( flags.fromCouch2 ) {
        loadPoseR( letr3D( fromCouch1, fromCouch2, inc ));
        MODEL.position.y += (-2.5 - MODEL.position.y ) * inc/4;
        // MODEL.position.x += (-8.6 - MODEL.position.x ) * inc/9;
        MODEL.position.z += (6 - MODEL.position.z ) * inc/5;
        MODEL.rotation.y += (5*Math.PI/2 - MODEL.rotation.y) * inc/4;
        MODEL.rotation.z += (0.0 - MODEL.rotation.z) * inc/4;

        inc += speed*2;
        if ( inc >= 1.0 ) {
            inc = 0.0;
            flags.fromCouch2 = false;
            MODEL.rotation.y = Math.PI/2;
            layDownEventFlag = false;
            setTimeout(
                function () {
                    selectLOCK = false;
                },
                500
            )
            resetFlags();
        }

    }

    return inc;
}


function sleep( poses, flags, inc ) {
    var laying1 = poses["laying1"];
    var sleeping = poses["sleeping"];
    var speed = 0.01 * speedMultiplier;
    var finished = false;
    if ( flags.laying1 ) {
        var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations))); 
        loadPoseR( letr3D( currentPose, laying1, inc ) );
        MODEL.position.z += ( 4 - MODEL.position.z ) * inc/4;
        MODEL.position.y += (-3.5 - MODEL.position.y ) * inc/4;
        MODEL.rotation.y += (2* Math.PI - MODEL.rotation.y) * inc/4;
        // MODEL.rotation.x += (0.0 - MODEL.rotation.x) * inc/4;
        // MODEL.rotation.z += (0.0 - MODEL.rotation.z) * inc/4;
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.laying1 = false;
        }
    }
    else if ( flags.sleeping ) {
        loadPoseR( letr3D( laying1, sleeping, inc ));
        MODEL.position.x += ( -11.6 - MODEL.position.x ) * inc/4;
        MODEL.position.y += ( 0.5 - MODEL.position.y ) * inc/9;
        MODEL.rotation.y += ( 2* Math.PI - MODEL.rotation.y ) * inc/4;
        MODEL.rotation.z += ( -Math.PI/2 - MODEL.rotation.z ) * inc/10;
        camX += (camPose - camX ) * inc/10;

        if ( inc >= 0.5 ) {
            MODEL.rotation.x += ( -Math.PI - MODEL.rotation.x ) * inc/8;
        }
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 1.0;
            flags.sleeping = false;
            resetFlags();
            finished = true;
        }
    }

    return [inc, finished];
}


function toCouch( poses, flags, inc ) {
    var laying1 = poses["laying1"];
    var laying2 = poses["laying2"];
    var speed = 0.01 * speedMultiplier;
    var finished = false;
    if ( flags.laying1 ) {
        var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations))); 
        loadPoseR( letr3D( currentPose, laying1, inc ) );
        MODEL.position.z += ( 4 - MODEL.position.z ) * inc/4;
        MODEL.position.y += (-3.5 - MODEL.position.y ) * inc/4;
        MODEL.rotation.y += (2* Math.PI - MODEL.rotation.y) * inc/4;
        // camX += (-7.6 - camX ) * inc/10;

        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.laying1 = false;
        }
    }
    else if ( flags.laying2 ) {
        loadPoseR( letr3D( laying1, laying2, inc ) );
        MODEL.position.x += (-10.6 - MODEL.position.x ) * inc/4;
        MODEL.position.y += (0.0 - MODEL.position.y ) * inc/9;
        MODEL.rotation.z += (-Math.PI/2 - MODEL.rotation.z) * inc/10;
        camX += (camPose - camX ) * inc/10;
        if ( inc >= 0.5 ) {
            MODEL.rotation.x += (-Math.PI/2 - MODEL.rotation.x) * inc/8;

        }
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.laying2 = false;
            resetFlags();
            finished = true;
        }


    }

    return [inc, finished];
}

function testAnim(poses) {
    // pose = poses["sitting0"];
    currPose = JSON.stringify(bss_rotations);
    currPose = jsonToArrayR(JSON.parse(currPose));
    loadPoseR(pose);
    if (JSON.stringify(currPose) === JSON.stringify(pose)){
        flag = false;
        console.log("Flag release");
    }
    // loadPoseR(currPose);
}

function sittingIdleAnim ( poses, inc ) {
    pose = poses["sitting0"];
    var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations))); 
    loadPoseR( letr3D( currentPose, pose, inc ) );
    inc += 0.05;
    if ( inc >= 1.0 ) {
        resetFlags();

    }
    return inc;
}

function walking( poses, flags, inc, dir ) {
    var walking0 = poses["walking0"];
    var walking1 = poses["walking1"];
    var walking2 = poses["walking2"];
    var walking3 = poses["walking3"];
    var speed = 0.03 * speedMultiplier;

    if ( flags.walking0 ) {
        var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations))); 
        loadPoseR( letr3D( currentPose, walking0, inc ) );
        MODEL.position.x -= Math.pow(-1, dir) * speed/1.5;
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.walking0 = false;

        }
    }
    else if ( flags.walking1 ) {
        loadPoseR( letr3D( walking0, walking1, inc ) );
        MODEL.position.x -= Math.pow(-1, dir) * speed;
        MODEL.position.y -= 0.006;
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.walking1 = false;

        }
    }
    else if ( flags.walking2 ) {
        loadPoseR( letr3D( walking1, walking2, inc ) );
        MODEL.position.x -= Math.pow(-1, dir) * speed * 1.2;
        MODEL.position.y += 0.006;

        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.walking2 = false;

        }
    }
    else if ( flags.walking3 ) {
        loadPoseR( letr3D( walking2, walking3, inc ) );
        MODEL.position.x -= Math.pow(-1, dir) * speed;
        MODEL.position.y -= 0.006;
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.walking3 = false;
            // resetFlags();
            // walkingInit = true;
        }
    }
    else {
        loadPoseR( letr3D( walking3, walking0, inc ) );
        MODEL.position.x -= Math.pow(-1, dir) * speed;
        MODEL.position.y += 0.008;

        inc += speed/1.5;
        if ( inc >= 0.5 ) {
            inc = 0;
            resetFlags();
            // walkingInit = true;
            // flags.walking0 = false;
         
            // flags.walking2 = false;
        }
    }

    return inc;
}




function toChair(poses, flags, inc) {
    var toChair2 = poses["fromChair0"];
    var toChair1 = poses["fromChair1"];
    var toChair0 = poses["fromChair2"];
    var sitting0 = poses["sitting0"];
    var speed = 0.05 * speedMultiplier;

    if ( flags.toChair0 ) {
        var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations))); 
        loadPoseR(letr3D(currentPose, toChair0, inc));
        MODEL.rotation.y += (Math.PI - MODEL.rotation.y) * inc;
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.toChair0 = false;
        }
    }
    else if ( flags.toChair1 ) {
        loadPoseR( letr3D( toChair0, toChair1, inc ) );
        MODEL.position.z += ( 7.0 - MODEL.position.z ) * inc/4;
        MODEL.position.y += (-4.0 - MODEL.position.y) * inc/4;
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.toChair1 = false;
        }
    }
    else if ( flags.toChair2 ) {
        loadPoseR( letr3D( toChair1, toChair2, inc ) );
        MODEL.position.z += ( 5.0 - MODEL.position.z ) * inc/4;
        chair.position.z += ( -16 - chair.position.z ) * inc/4;
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags.toChair2 = false;
        }
    }
    else if ( flags.toChair3 ) {
        loadPoseR ( letr3D( toChair2, sitting0, inc) );
        inc += speed/2;
        if ( inc >= 1.0 ) {
            inc = 0;
            // resetFlags();
            flags.toChair3 = false;

        }
    }


    return inc;
}

function fromChair(poses, flags, inc) {
    var fromChair0 = poses["fromChair0"];
    var fromChair1 = poses["fromChair1"];
    var fromChair2 = poses["fromChair2"];
    var speed = 0.03 * speedMultiplier;

    if ( flags["fromChair0"] ) {
        var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations))); 
        loadPoseR(letr3D(currentPose, fromChair0, inc));
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags["fromChair0"] = false;
        }
    }
    else if ( flags["fromChair1"] ) {
        loadPoseR(letr3D(fromChair0, fromChair1, inc));
        MODEL.position.z += (7.0 - MODEL.position.z) * inc/4;
        chair.position.z += (-14 - chair.position.z) * inc/4;
        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags["fromChair1"] = false;
        }
    }
    else if ( flags["fromChair2"] ) {
        loadPoseR(letr3D(fromChair1, fromChair2, inc));
        MODEL.position.z += (5.0 - MODEL.position.z) * inc/4;
        MODEL.position.y += (-2.4 - MODEL.position.y) * inc/4;
        MODEL.rotation.y += (3*Math.PI/2 - MODEL.rotation.y) * inc/4;

        inc += speed;
        if ( inc >= 1.0 ) {
            inc = 0;
            flags["fromChair2"] = false;
            fromChairFlag = false;
            layDownEventFlag = false;

        }
    }

    return inc;

}

function watching(poses, inc) {
    var watching0 = poses["watching0"];
    var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations))); 
    loadPoseR(letr3D(currentPose, watching0, inc));
    inc += 0.05;
    if (inc >= 5.0) { 
        resetFlags();
    }
    return inc;
}


function tired(poses, inc){
    var tired0 = poses["tired0"];
    var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations))); 
    loadPoseR(letr3D(currentPose, tired0, inc));
    inc += 0.01;
    if (inc >= 2.0) {
        resetFlags();
        tiredFlag = false;
        typingInit = true;


        inc = 0;
    }
    return inc;
}


function typing(poses, flags, counter, inc) {
    var typing1 = poses["typing1"];
    var typing2 = poses["typing2"];
    var typing3 = poses["typing3"];
    var sitting0 = poses["sitting0"];
    var speed = 0.05 * speedMultiplier;
    if (counter <300){

        if (flags["sitting0"]){
            var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations)));
            loadPoseR(letr3D(currentPose, typing1, inc));
            inc += speed;
            if (inc >= 1.0) {
                flags["sitting0"] = false;
                flags["typing1"] = true;
                
                inc = 0;
            }
        }
        else if (flags["typing1"]){
            loadPoseR(letr3D(typing1, typing2, inc));
            inc += speed;
            if (inc >= 1.0) {
                flags["typing1"] = false;
                flags["sitting0"] = true;
                inc = 0
            }
        }
        counter++;
    }
    else {
        var currentPose = jsonToArrayR(JSON.parse(JSON.stringify(bss_rotations)));
        loadPoseR(letr3D(currentPose, typing3, inc));
        inc += speed;
        if (inc >= 10){
            flags["sitting0"] = true;
            flags["typing1"] = true;
            inc = 0
            counter = 0;
        }

    }
        
    return [inc, counter];
}


function moveCamera1 (inc) {
    var poseFrom = [1.6, 3.0, 12.0];
    var poseTo = [-2, 5, 2.0];
    var lookatFrom = [1.6, 1.5, 0];
    var lookatTo = [-2, 5, 1];

    camera.position.x = poseFrom[0] + (poseTo[0] - poseFrom[0])*inc;
    camera.position.y = poseFrom[1] + (poseTo[1] - poseFrom[1])*inc;
    camera.position.z = poseFrom[2] + (poseTo[2] - poseFrom[2])*inc;

    var l_x = lookatFrom[0] + (lookatTo[0] - lookatFrom[0])*inc;
    var l_y = lookatFrom[1] + (lookatTo[1] - lookatFrom[1])*inc;
    var l_z = lookatFrom[2] + (lookatTo[2] - lookatFrom[2])*inc;
    camera.lookAt(l_x, l_y, l_z);
    inc += 0.01;
    if ( inc >= 1.0 ) {
        cameraInit1 = false;
        inc = 0.0;
        document.getElementById("next1-button").style.visibility = "visible";
    }
    return inc; 
}

function moveCamera2 (inc) {
    var poseFrom = [-2, 5, 2.0];
    var poseTo = [-1, 4.55, 2.0];
    var lookatFrom = [-2, 5, 1];
    var lookatTo = [-1, 4.55, 1];

    camera.position.x = poseFrom[0] + (poseTo[0] - poseFrom[0])*inc;
    camera.position.y = poseFrom[1] + (poseTo[1] - poseFrom[1])*inc;
    camera.position.z = poseFrom[2] + (poseTo[2] - poseFrom[2])*inc;

    var l_x = lookatFrom[0] + (lookatTo[0] - lookatFrom[0])*inc;
    var l_y = lookatFrom[1] + (lookatTo[1] - lookatFrom[1])*inc;
    var l_z = lookatFrom[2] + (lookatTo[2] - lookatFrom[2])*inc;
    camera.lookAt(l_x, l_y, l_z);
    inc += 0.01;
    if ( inc >= 1.0 ) {
        cameraInit2 = false;
        inc = 0.0;
        document.getElementById("next2-button").style.visibility = "visible";
    }
    return inc; 
}

function moveCamera3 (inc) {
    var poseFrom = [-1, 4.5, 2.0];
    var poseTo = [-2.3, 3.8, 2.0];
    var lookatFrom = [-1, 4.5, 1];
    var lookatTo = [-2.3, 3.8, 1];

    camera.position.x = poseFrom[0] + (poseTo[0] - poseFrom[0])*inc;
    camera.position.y = poseFrom[1] + (poseTo[1] - poseFrom[1])*inc;
    camera.position.z = poseFrom[2] + (poseTo[2] - poseFrom[2])*inc;

    var l_x = lookatFrom[0] + (lookatTo[0] - lookatFrom[0])*inc;
    var l_y = lookatFrom[1] + (lookatTo[1] - lookatFrom[1])*inc;
    var l_z = lookatFrom[2] + (lookatTo[2] - lookatFrom[2])*inc;
    camera.lookAt(l_x, l_y, l_z);
    inc += 0.01;
    if ( inc >= 1.0 ) {
        cameraInit3 = false;
        inc = 0.0;
        document.getElementById("next3-button").style.visibility = "visible";
    }
    return inc; 
}


function moveCamera4 (inc) {
    var poseFrom = [-2.3, 3.8, 2.0];
    var poseTo = [1.6, 3.0, 12.0];
    var lookatFrom = [-2.3, 3.8, 1];
    var lookatTo = [1.6, 1.5, 0];

    camera.position.x = poseFrom[0] + (poseTo[0] - poseFrom[0])*inc;
    camera.position.y = poseFrom[1] + (poseTo[1] - poseFrom[1])*inc;
    camera.position.z = poseFrom[2] + (poseTo[2] - poseFrom[2])*inc;

    var l_x = lookatFrom[0] + (lookatTo[0] - lookatFrom[0])*inc;
    var l_y = lookatFrom[1] + (lookatTo[1] - lookatFrom[1])*inc;
    var l_z = lookatFrom[2] + (lookatTo[2] - lookatFrom[2])*inc;
    camera.lookAt(l_x, l_y, l_z);
    inc += 0.01;
    if ( inc >= 1.0 ) {
        cameraInit4 = false;
        inc = 0.0;
        // document.getElementById("next4-button").style.visibility = "visible";
        // document.getElementById("next4-button").style.visibility = "hidden";
        document.getElementById("startGame-button").style.visibility = "visible";
        document.getElementById("instructions-button").style.visibility = "visible";
        document.getElementById("difficulty-button").style.visibility = "visible";
        instructionsLOCK = false;

    }
    return inc; 
}