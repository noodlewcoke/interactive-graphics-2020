
var panelRemove = true;


var SUCCESS = false;
var FAIL = false;
var STAMINA = 65;
var MOTIVATION = 65;
var PROGRESSION = 0;
var bone_structure = [];
var GAMETIME = 240;

// Simplified Structure
var bss = [];                   // Bone Structure Reduced to 19 Bones
var bss_quaternions = [];       // Fetch their quaternions
var bss_rotations = [];         // Rotations
var rootNode;
var rightArm;

var jsonData = {};
var parsedPoses = {};

var fileName = "frames.json";
var downloadFile = "frames.json";

var container = document.createElement('div');
document.body.appendChild(container);

var monitorObj = new THREE.Group();
var selectableObjects = []; // create an array of selectable ojects and use that for raycaster
// var selectableObjects = new THREE.Object3D();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000 );
cameraModel = new THREE.Scene(); // to move camera and player sync, parent node of them
scene.add(cameraModel);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor('#e5e5e5');
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var audioLoader = new THREE.AudioLoader();
var listener = new THREE.AudioListener();
var sound = new THREE.Audio( listener );
audioLoader.load('examples/sounds/Smoke trees - Trees (with Sleepdealer).mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.3);
    sound.play();
})


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedObjects = [];
var composer, effectFXAA, outlinePass;
var obj3d = new THREE.Object3D();

var group = new THREE.Group();
composer = new THREE.EffectComposer( renderer );

var renderPass = new THREE.RenderPass( scene, camera );
composer.addPass( renderPass );

outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
composer.addPass( outlinePass );

effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
composer.addPass( effectFXAA );
window.addEventListener( 'resize', onWindowResize, false );

var selectLOCK = true;
var buttonClicked = false;
window.addEventListener( 'mousemove', onTouchMove );
// window.addEventListener( 'touchmove', onTouchMove );
window.addEventListener( 'click' , clickAction);
function onTouchMove( event ) {

    var x, y;
    // event.preventDefault();

    if ( event.changedTouches ) {

        x = event.changedTouches[ 0 ].pageX;
        y = event.changedTouches[ 0 ].pageY;

    } else {

        x = event.clientX;
        y = event.clientY;

    }

    mouse.x = ( x / window.innerWidth ) * 2 - 1;
    mouse.y = - ( y / window.innerHeight ) * 2 + 1;

    checkIntersection();

}

function addSelectedObject( object ) {
    selectedObjects.push( object );
}

function checkIntersection() {

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( selectableObjects, true);

    if ( intersects.length > 0 && !selectLOCK) {
        selectedObjects = [];
        var selectedObject = intersects[ 0 ].object;
        selectedObject.parent.traverse((child) => {
            if ( child instanceof THREE.Mesh) {
                addSelectedObject( child );
            }
        })

        outlinePass.selectedObjects = selectedObjects;

    } else {
        outlinePass.selectedObjects = [];
    }
}

var toggleLight = false;

function clickAction () {
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( selectableObjects, true);

    if ( intersects.length > 0 && !selectLOCK) {
        selectedObjects = [];
        var selectedObject = intersects[ 0 ].object;
        selectedObject.parent.traverse((child) => {
            if ( child instanceof THREE.Mesh) {
                addSelectedObject( child );
            }
        })
        if ( selectedObjects[0].name == "Cylinder005" ) {
            console.log("light");
            toggleLight = !toggleLight;
            pointlight.visible = toggleLight;

        }

        else if ( selectedObjects[0].name == "Apple_iMac_27___display" || selectedObjects[0].name == "Apple_iMac_27___leg" ) {
            console.log("monitor");
            document.getElementById("typing-button").style.visibility = "visible";
            // document.getElementById("video-button").style.visibility = "visible";
            document.getElementById("submit-button").style.visibility = "visible";


            selectLOCK = true;


            setTimeout(function(){
                // document.getElementById("video-button").style.visibility = "hidden";
                document.getElementById("typing-button").style.visibility = "hidden";
                document.getElementById("submit-button").style.visibility = "hidden";


                if ( !buttonClicked ) {
                    selectLOCK=false;
                }
            }, 2000)
        }

        else if ( selectedObjects[0].name == "Circle1") {
            console.log("couch");
            document.getElementById("sleep-button").style.visibility = "visible";
            document.getElementById("laydown-button").style.visibility = "visible";
            selectLOCK = true;


            setTimeout(function(){
                document.getElementById("sleep-button").style.visibility = "hidden";
                document.getElementById("laydown-button").style.visibility = "hidden";
                if ( !buttonClicked ) {
                    selectLOCK=false;

                }

                }, 2000)
            

        }

        outlinePass.selectedObjects = selectedObjects;

    } else {
        outlinePass.selectedObjects = [];
    }
}

function onWindowResize() {

    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
    composer.setSize( width, height );

    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

}
var MODEL;

var panel;
// model
//#region Model
var loader = new THREE.FBXLoader();
loader.load('examples/models/fbx/model65.fbx', function (model) {

    model.scale.set(.04, .04, .04);
    MODEL = model;
    model.children[8].traverse((bone) => {
        bone_structure.push(bone);
    })


    //#region simplify_bone_structure
    // NAME               // INDEX
    bss.push(bone_structure[0]);                  // Hips               //  0
    bss.push(bone_structure[3]);                  // Spine              //  1  
    bss.push(bone_structure[6]);                  // Spine1             //  2
    bss.push(bone_structure[8]);                  // Spine2             //  3
    bss.push(bone_structure[21]);                  // LeftShoulder       //  4
    bss.push(bone_structure[23]);                  // LeftArm            //  5
    bss.push(bone_structure[25]);                  // LeftForeArm        //  6
    bss.push(bone_structure[47]);                 // RightShoulder      //  7
    bss.push(bone_structure[49]);                 // RightArm           //  8
    bss.push(bone_structure[51]);                 // RightForeArm       //  9
    bss.push(bone_structure[15]);                 // Head               //  10
    bss.push(bone_structure[84]);                 // RightUpLeg         //  11
    bss.push(bone_structure[87]);                 // RightLeg           //  12
    bss.push(bone_structure[90]);                 // RightFoot          //  13
    bss.push(bone_structure[92]);                 // RightToeBase       //  14
    bss.push(bone_structure[73]);                 // LeftUpLeg          //  15
    bss.push(bone_structure[76]);                 // LeftLeg            //  16
    bss.push(bone_structure[79]);                 // LeftFoot           //  17
    bss.push(bone_structure[81]);                 // LeftToeBase        //  18
    //#endregion

    var snapShotFeed = function () {

        this.addFrame = function () {
            jsonData[fName] = JSON.stringify(bss_rotations);
            console.log(fName, " added");
        }

        this.download = function () {
            const link = document.createElement('a');
            console.log(link);
            link.style.display = 'none';
            document.body.appendChild(link);
            const blob = new Blob([JSON.stringify(jsonData)], { type: 'text/plain' });
            const objectURL = URL.createObjectURL(blob);
            console.log(blob, objectURL);
            link.href = objectURL;
            link.href = URL.createObjectURL(blob);
            link.download = downloadFile;
            link.click();
        }

        this.fileName = 'message';

    }

    var feed = function () {
        for (const key in bss) {
            bss_rotations.push(bss[key].rotation);
        }

        //#region InitGuiVariables

        // Left Shoulder
        this.ls_rotx = bss_rotations[4].x;
        this.ls_roty = bss_rotations[4].y;
        this.ls_rotz = bss_rotations[4].z;

        // Left Arm
        this.la_rotx = bss_rotations[5].x;
        this.la_roty = bss_rotations[5].y;
        this.la_rotz = bss_rotations[5].z;

        // Left ForeArm
        this.lfa_rotx = bss_rotations[6].x;
        this.lfa_roty = bss_rotations[6].y;
        this.lfa_rotz = bss_rotations[6].z;

        //Right Shoulder 7
        this.rs_rotx = bss_rotations[7].x;
        this.rs_roty = bss_rotations[7].y;
        this.rs_rotz = bss_rotations[7].z;

        //Right Arm 8
        this.ra_rotx = bss_rotations[8].x;
        this.ra_roty = bss_rotations[8].y;
        this.ra_rotz = bss_rotations[8].z;

        //Right ForeArm 9
        this.rfa_rotx = bss_rotations[9].x;
        this.rfa_roty = bss_rotations[9].y;
        this.rfa_rotz = bss_rotations[9].z;

        //Head 10
        this.h_rotx = bss_rotations[10].x;
        this.h_roty = bss_rotations[10].y;
        this.h_rotz = bss_rotations[10].z;

        //RightUpLeg 11
        this.rul_rotx = bss_rotations[11].x;
        this.rul_roty = bss_rotations[11].y;
        this.rul_rotz = bss_rotations[11].z;

        //RightLeg 12
        this.rl_rotx = bss_rotations[12].x;
        this.rl_roty = bss_rotations[12].y;
        this.rl_rotz = bss_rotations[12].z;

        //RightFoot 13
        this.rf_rotx = bss_rotations[13].x;
        this.rf_roty = bss_rotations[13].y;
        this.rf_rotz = bss_rotations[13].z;

        //RightToeBase 14
        this.rtb_rotx = bss_rotations[14].x;
        this.rtb_roty = bss_rotations[14].y;
        this.rtb_rotz = bss_rotations[14].z;

        //LeftUpLeg 15
        this.lul_rotx = bss_rotations[15].x;
        this.lul_roty = bss_rotations[15].y;
        this.lul_rotz = bss_rotations[15].z;

        //LeftLeg 16
        this.ll_rotx = bss_rotations[16].x;
        this.ll_roty = bss_rotations[16].y;
        this.ll_rotz = bss_rotations[16].z;

        //LeftFoot 17
        this.lf_rotx = bss_rotations[17].x;
        this.lf_roty = bss_rotations[17].y;
        this.lf_rotz = bss_rotations[17].z;

        //LeftToeBase 18
        this.ltb_rotx = bss_rotations[18].x;
        this.ltb_roty = bss_rotations[18].y;
        this.ltb_rotz = bss_rotations[18].z;

        //Spine 1
        this.s_rotx = bss_rotations[1].x;
        this.s_roty = bss_rotations[1].y;
        this.s_rotz = bss_rotations[1].z;

        //Spine1 2
        this.s1_rotx = bss_rotations[2].x;
        this.s1_roty = bss_rotations[2].y;
        this.s1_rotz = bss_rotations[2].z;

        //Spine2 3 
        this.s2_rotx = bss_rotations[3].x;
        this.s2_roty = bss_rotations[3].y;
        this.s2_rotz = bss_rotations[3].z;

        //#endregion

    };


    
    //#region GUI Event Handlers 

    //#region GUI Variables
    var GUIData = new feed();
    var snapData = new snapShotFeed();
    panel = new dat.GUI();
    panel.closed = true;
    //#endregion

    //LeftShoulder
    //#region
    var folder1 = panel.addFolder('Left Shoulder (index -> 4)');
    folder1.add(GUIData, 'ls_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[4].x = value;
        }
    );
    folder1.add(GUIData, 'ls_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[4].y = value;
        }
    );
    folder1.add(GUIData, 'ls_rotz', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[4].z = value;
        }
    );
    //#endregion

    //LeftArm
    //#region
    var folder2 = panel.addFolder('Left Arm (index -> 5)');
    folder2.add(GUIData, 'la_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[5].x = value;
        }
    );
    folder2.add(GUIData, 'la_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[5].y = value;
        }
    );
    folder2.add(GUIData, 'la_rotz', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[5].z = value;
        }
    );
    //#endregion

    //LeftForeArm
    //#region
    var folder3 = panel.addFolder('Left ForeArm (index -> 6)');
    folder3.add(GUIData, 'lfa_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[6].x = value;
        }
    );
    folder3.add(GUIData, 'lfa_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[6].y = value;
        }
    );
    folder3.add(GUIData, 'lfa_rotz', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[6].z = value;
        }
    );
    //#endregion

    //RightShoulder
    //#region
    var folder4 = panel.addFolder('Right Shoulder (index -> 7)');
    folder4.add(GUIData, 'rs_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[7].x = value;
        }
    );
    folder4.add(GUIData, 'rs_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[7].y = value;
        }
    );
    folder4.add(GUIData, 'rs_rotz', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[7].z = value;
        }
    );
    //#endregion

    //RightArm
    //#region
    var folder5 = panel.addFolder('Right Arm (index -> 8)');
    folder5.add(GUIData, 'ra_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[8].x = value;
        }
    );
    folder5.add(GUIData, 'ra_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[8].y = value;
        }
    );
    folder5.add(GUIData, 'ra_rotz', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[8].z = value;
        }
    );
    //#endregion

    //RightForeArm
    //#region
    var folder6 = panel.addFolder('Right ForeArm (index -> 9)');
    folder6.add(GUIData, 'rfa_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[9].x = value;
        }
    );
    folder6.add(GUIData, 'rfa_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[9].y = value;
        }
    );
    folder6.add(GUIData, 'rfa_rotz', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[9].z = value;
        }
    );
    //#endregion

    //Head
    //#region
    var folder7 = panel.addFolder('Head (index -> 10)');
    folder7.add(GUIData, 'h_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[10].x = value;
        }
    );
    folder7.add(GUIData, 'h_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[10].y = value;
        }
    );
    folder7.add(GUIData, 'h_rotz', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[10].z = value;
        }
    );
    //#endregion

    //RightUpLeg
    //#region
    var folder8 = panel.addFolder('RightUpLeg (index -> 11)');
    folder8.add(GUIData, 'rul_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[11].x = value;
        }
    );
    folder8.add(GUIData, 'rul_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[11].y = value;
        }
    );
    folder8.add(GUIData, 'rul_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[11].z = value;
        }
    );
    //#endregion

    //RightLeg
    //#region
    var folder9 = panel.addFolder('RightLeg (index -> 12)');
    folder9.add(GUIData, 'rl_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[12].x = value;
        }
    );
    folder9.add(GUIData, 'rl_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[12].y = value;
        }
    );
    folder9.add(GUIData, 'rl_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[12].z = value;
        }
    );
    //#endregion

    //RightFoot
    //#region
    var folder10 = panel.addFolder('RightFoot (index -> 13)');
    folder10.add(GUIData, 'rf_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[13].x = value;
        }
    );
    folder10.add(GUIData, 'rf_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[13].y = value;
        }
    );
    folder10.add(GUIData, 'rf_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[13].z = value;
        }
    );
    //#endregion

    //RightToeBase
    //#region
    var folder11 = panel.addFolder('RightToeBase (index -> 14)');
    folder11.add(GUIData, 'rtb_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[14].x = value;
        }
    );
    folder11.add(GUIData, 'rtb_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[14].y = value;
        }
    );
    folder11.add(GUIData, 'rtb_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[14].z = value;
        }
    );
    //#endregion

    //LeftUpLeg
    //#region
    var folder12 = panel.addFolder('LeftUpLeg (index -> 15)');
    folder12.add(GUIData, 'lul_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[15].x = value;
        }
    );
    folder12.add(GUIData, 'lul_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[15].y = value;
        }
    );
    folder12.add(GUIData, 'lul_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[15].z = value;
        }
    );
    //#endregion

    //LeftLeg
    //#region
    var folder13 = panel.addFolder('LeftLeg (index -> 16)');
    folder13.add(GUIData, 'll_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[16].x = value;
        }
    );
    folder13.add(GUIData, 'll_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[16].y = value;
        }
    );
    folder13.add(GUIData, 'll_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[16].z = value;
        }
    );
    //#endregion

    //LeftFoot
    //#region
    var folder14 = panel.addFolder('LeftFoot (index -> 17)');
    folder14.add(GUIData, 'lf_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[17].x = value;
        }
    );
    folder14.add(GUIData, 'lf_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[17].y = value;
        }
    );
    folder14.add(GUIData, 'lf_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[17].z = value;
        }
    );
    //#endregion

    //LeftToeBase
    //#region
    var folder15 = panel.addFolder('LeftToeBase (index -> 18)');
    folder15.add(GUIData, 'ltb_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[18].x = value;
        }
    );
    folder15.add(GUIData, 'ltb_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[18].y = value;
        }
    );
    folder15.add(GUIData, 'ltb_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[18].z = value;
        }
    );
    //#endregion

    //#region Spine
    var folder16 = panel.addFolder('Spine (index -> 1)');
    folder16.add(GUIData, 's_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[1].x = value;
        }
    );
    folder16.add(GUIData, 's_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[1].y = value;
        }
    );
    folder16.add(GUIData, 's_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[1].z = value;
        }
    );
    //#endregion

    //#region Spine1
    var folder17 = panel.addFolder('Spine1 (index -> 2)');
    folder17.add(GUIData, 's1_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[2].x = value;
        }
    );
    folder17.add(GUIData, 's1_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[2].y = value;
        }
    );
    folder17.add(GUIData, 's1_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[2].z = value;
        }
    );
    //#endregion

    //#region Spine2
    var folder18 = panel.addFolder('Spine2 (index -> 3)');
    folder18.add(GUIData, 's2_rotx', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[3].x = value;
        }
    );
    folder18.add(GUIData, 's2_roty', -2, 2).listen().onChange(
        function (value) {
            bss_rotations[3].y = value;
        }
    );
    folder18.add(GUIData, 's2_rotz', -5, 5).listen().onChange(
        function (value) {
            bss_rotations[3].z = value;
        }
    );
    //#endregion





    var folder21 = panel.addFolder('Util');
    folder21.add(snapData, 'fileName').onChange(setValue);
    folder21.add(snapData, 'addFrame');
    folder21.add(snapData, 'download');


    function setValue() {
        fName = snapData.fileName;
    }

    //#endregion

    for (key in bss) {
        bss_quaternions.push(bss[key].quaternion);
    }

    // Idle : poseZ = 10 , poseY = -2.5, poseX = 0.0
    // Sitting : poseZ = 5 , poseY = -4.0 , poseX = 1.6, rotY = PI
    // fromChair1 : poseZ = 7 , poseY = -4.0 , poseX = 1.6, rotY = PI
    // fromChair2 : poseZ = 5 , poseY = -2.5 , poseX = 1.6, rotY = PI
    // walking0 : poseZ = 5 , poseY = -2.5 , poseX = 1.6, rotY = -PI/2
    // laying0 : poseZ = 6 , poseY = -2.5 , poseX = -8.6
    // laying1 : poseZ = 4 , poseY = -3.5 , poseX = -8.6
    // laying2 : poseZ = 4 , poseY = 0 , poseX = -10.6, rotX = -Math.PI/2 , rotZ = -Math.PI/2
    // sleeping : poseZ = 4 , poseY = 0.5 , poseX = -11.6, rotX = Math.PI , rotZ = -Math.PI/2
    model.position.z = 5; //5
    model.position.y = -4.0; // -4.0
    model.position.x = 1.6; //1.6
    model.rotation.y = Math.PI; //PI
    // model.rotation.z = -Math.PI/2;
    // model.rotation.x = Math.PI;
    cameraModel.add(model);
    loading2 = false;
});
//#endregion

// Chair Loader
var chair;
var mtlLoader = new THREE.MTLLoader();
mtlLoader.load(
    'examples/models/obj/chair.mtl',
    function ( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            'examples/models/obj/chair.obj',
            function(object) {
                object.scale.x = 4.5;
                object.scale.y = 4.5;
                object.scale.z = 4.5;
                // object.rotation.y = 1.0;
                object.position.y = -2.5;
                object.position.x = 7;
                object.position.z = -16; //-16 -14
                object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -2.9*Math.PI/4);
                chair = object;

                scene.add(object);
                // selectableObjects.push(object);


            }
        )

    }
)


// var controls = new THREE.OrbitControls( camera ,renderer.domElement);
var light = new THREE.PointLight(0xFFFFFF, 1, 1000)
light.position.set(0,30,20);
scene.add(light);

var loading = true;
var loading2 = true;
staticObjects();


var pointlight = new THREE.PointLight( 0xffffed, 1, 10 );
pointlight.position.set( 3.1, 3.1, 3.5 );
scene.add( pointlight );
pointlight.visible = false;
// const helper = new THREE.PointLightHelper(pointlight);
// scene.add(helper);

var pose, currPose;
var flag = true;
var typingFlags = { "sitting0" : true, "typing3" : true, "typing1" : true, "typing2" : true};
var fromChairFlags = { "fromChair0" : true, "fromChair1" : true, "fromChair2" : true };
var toChairFlags = { "turn" : true, "toChair0" : true, "toChair1" : true, "toChair2" : true, "toChair3" : true};
var walkingFlags = { "walking0" : true, "walking1" : true, "walking2" : true, "walking3" : true}
var toCouchFlags = { "laying1" : true, "laying2" : true };
var sleepFlags = { "laying1" : true, "sleeping" : true };
var fromCouchFlags = { "fromCouch1" : true, "fromCouch2" : true };
var fromCouchInit = false;
var fromCouchInc = 0; 
var sleepInit = false;
var sleepInc = 0;
var toCouchInit = false;
var toCouchInc = 0;
var dirTable = false;
var walkingInit = false;
var walkingInc = 0;
var typingInit = false;
var typingCounter = 0;
var increment = 0;
var tiredFlag = false;
var tiredInc = 0 ;
var watchingFlag = false;
var watchingInc = 0;
var fromChairFlag = false;
var fromChairInc = 0;
var toChairInit = false;
var toChairInc = 0;
var sittingIdleInit = false;
var sittingIdleInc = 0;
var cameraInc = 0;
var cameraInit1 = false;
var cameraInit2 = false;
var cameraInit3 = false;
var cameraInit4 = false;
var cameraInit5 = false;


var DEADLINE = 0;
var col = 0;
var camX = 1.6;
var clockStartFlag = false;


var clock = new THREE.Clock({autoStart : false});
clock.stop();
function startTime() {
    clock.start();    
}

function stopTime() {
    clock.stop();
}

function workingEvent() {
    var counterMultiplier = delta;
    if (PROGRESSION < 100) {

        // PROGRESSION += (STAMINA%101 + MOTIVATION%101)/8000;
        if ( delta > 0.005) {

            PROGRESSION += ((1/(101-STAMINA)) + (1/(101-MOTIVATION))) * 10* delta; ///10;
        }
        else {
            PROGRESSION += ((1/(101-STAMINA)) + (1/(101-MOTIVATION))) /10;

        }
    }
    STAMINA -= 1/100;
    if (MOTIVATION < 100 && STAMINA >30) {

        MOTIVATION += 1/200;
    }
    if (STAMINA <= 1) {
        typingInit = false;
        selectLOCK = false;
    }
    else if (MOTIVATION <= 1) {
        typingInit = false;
        selectLOCK = false;
    }

    if ( ~~STAMINA == 30 || ~~STAMINA == 20) {
        tiredFlag = true
        STAMINA--;
    }

}


var sleepClock = new THREE.Clock({autoStart : false})
var sleepClockInit = false;
var sleepMotivationFlag = true;
var sleepDuration = 10;
function sleepEvent() {
    if ( sleepClock.getElapsedTime() >= sleepDuration ) {
        STAMINA += 40;
        if ( sleepMotivationFlag ) {
            MOTIVATION += 10;
        }
        else {
            MOTIVATION -= 20;
        }
        if ( MOTIVATION > 100) {
            MOTIVATION = 100;
        }
        else if ( MOTIVATION < 0) {
            MOTIVATION = 0;
        }
        sleepClockInit = false;
        sleepClock.stop();
        console.log("Sleep completed");
        gotoSleepFlag = false;
        fromCouchInit = true;
        document.getElementById("sleep-counter").style.visibility = "hidden";
        // selectLOCK = false;
        buttonClicked = false;
    }
    else {
        var sleepCount = ~~(sleepDuration - sleepClock.getElapsedTime());
        document.getElementById("sleep-counter").style.visibility = "visible";
        document.getElementById("sleep-counter").innerHTML = sleepCount;
    }
}

var layDownEventFlag = false;
function layDownEvent() {
    if (STAMINA < 100 ) {

        STAMINA += 1/100;
    }
    else {
        STAMINA = 100;
    }
    if ( MOTIVATION < 100){
        MOTIVATION += 1/300;
    }
    else {
        MOTIVATION = 100;
    }
    // BUTTON FOR GOING TO TABLE OR GOING TO SLEEP

}

var modelPoseTableFlag = true;
var gotoCouchInit = false;
var gotoCouchFlags = { "fromChair" : true, "walkOut" : true };

function gotoCouch () {
    if ( gotoCouchFlags.fromChair ) {
        fromChairInc = fromChair(parsedPoses, fromChairFlags, fromChairInc);
        if (!fromChairFlags.fromChair2){
            gotoCouchFlags.fromChair = false;
        }
    }
    else if ( gotoCouchFlags.walkOut ) {
        dirTable  = false;
        walkingInc = walking(parsedPoses, walkingFlags, walkingInc, dirTable);
        MODEL.position.z += 0.005;
        if ( MODEL.position.x <= -8.0) {
            resetFlags();
            gotoCouchFlags.walkOut = false;
            gotoCouchInit = false;
            modelPoseTableFlag = false;
            gotoCouchFlags = { "fromChair" : true, "walkOut" : true };
        }
    }
}

var restEventFlag = false;
function restEvent () {
    if ( modelPoseTableFlag ) {
        gotoCouchInit = true;
        gotoCouch();
    }
    else {
        layDownEventFlag = true;
        var currAction = toCouch(parsedPoses, toCouchFlags, toCouchInc);
        toCouchInc = currAction[0];
        if ( currAction[1] ) {
            // selectLOCK = false;
            restEventFlag = false;
            document.getElementById("stop-button").style.visibility = "visible";
        }
    }
}

var gotoSleepFlag = false;
function gotoSleep() {
    if (modelPoseTableFlag) {
        gotoCouchInit = true;

        gotoCouch();
    }
    else {
        if ( !sleepClockInit ){
            sleepClockInit = true;
            sleepClock.start();
        }
        
        var currentAction = sleep(parsedPoses, sleepFlags, sleepInc);
        sleepInc = currentAction[0];
        if ( currentAction[1] ) {
            gotoSleepFlag = false;
            // selectLOCK = false;
        }
    }

}

var gotoChairInit = false;
var gotoChairFlags = { "comeBack" : true, "toChair" : true };
function gotoChair () {
    if ( modelPoseTableFlag ) {
        selectLOCK = false;
        buttonClicked  = false;
    }
    else {
        if ( layDownEventFlag ) {
            fromCouchInit = true;
        }
        else{

            
            if ( gotoChairFlags.comeBack ) {
                dirTable  = true;
                walkingInc = walking(parsedPoses, walkingFlags, walkingInc, dirTable);
                MODEL.position.z -= 0.005;
                if ( MODEL.position.x >= 1.6) {
                    gotoChairFlags.comeBack = false;
                }
            }
            else if ( gotoChairFlags.toChair ) {
                toChairInc = toChair(parsedPoses, toChairFlags, toChairInc);
                if ( !toChairFlags.toChair3) {
                    gotoChairFlags.toChair = false;
                    gotoChairInit = false;
                    resetFlags();
                    if (typingButton) {
                        typingInit = true;
                        selectLOCK = false;
                        buttonClicked  = false;

                    }
                    
                    modelPoseTableFlag = true;
                }
            }
        }
    }
}

var watchVideoBadFlag = false;
function watchVideoBad() {
    typingInit = false;
    increment = 0;
    STAMINA += 1/200;
    MOTIVATION -= 1/100;
    if ( watchingInc < 5.0) {
        watchingInc = watching(parsedPoses, watchingInc);

    }
}


var watchVideoGoodFlag = false;
function watchVideoGood() {
    typingInit = false;
    increment = 0;
    STAMINA -= 1/200;
    MOTIVATION += 1/100;
    if ( watchingInc < 5.0) {
        watchingInc = watching(parsedPoses, watchingInc);

    }
}

var favShowFlag = true;
function favouriteShowEvent () {

    stopTime();

    favShowFlag = false;
    typingInit = false;
    increment = 0;
    typingCounter = 0;
    selectLOCK = true;

    document.getElementById('fav-show').style.visibility = 'visible';
    document.getElementById('binge-button').style.visibility = 'visible';
    document.getElementById('couple-eps-button').style.visibility = 'visible';
    document.getElementById('not-watch-button').style.visibility = 'visible';

}

function bingeEvent (button) {
    // BINGE event
    // STAMINA +50, MOTIVATION +10, TIME +50
    watchingFlag = true;
    
    setTimeout(function(){
        document.getElementById('10hours-later').style.visibility = 'visible';
        TIME += 50;
        if ( MOTIVATION < 90 ) {

            MOTIVATION += 10;
        }
        else {
            MOTIVATION = 100;
        }
        if ( STAMINA < 50 ) {

            STAMINA += 50;
        }
        else {
            STAMINA = 100;
        }
    }, 1500)
    
    setTimeout(function(){ 
        document.getElementById('10hours-later').style.visibility = 'hidden';  
        document.getElementById('negated-motivation').innerHTML = "+10 MOTIVATION";
        document.getElementById('negated-motivation').style.visibility = 'visible';
        document.getElementById('negated-progress').innerHTML = "+50 TIME";
        document.getElementById('negated-progress').style.visibility = 'visible';
        document.getElementById('negated-stamina').innerHTML = "+50 STAMINA";
        document.getElementById('negated-stamina').style.visibility = 'visible';
        selectLOCK = false;
        buttonClicked = false;
        setTimeout(function(){ 
            sittingIdleInit = true;
            document.getElementById('negated-motivation').style.visibility = 'hidden';
            document.getElementById('negated-progress').style.visibility = 'hidden';
            document.getElementById('negated-stamina').style.visibility = 'hidden';

            }, 2000)
    }, 4000)

    document.getElementById('fav-show').style.visibility = 'hidden';
    document.getElementById('binge-button').style.visibility = 'hidden';
    document.getElementById('couple-eps-button').style.visibility = 'hidden';
    document.getElementById('not-watch-button').style.visibility = 'hidden';
    TIME += clock.getElapsedTime();
    startTime();
}

function coupleEpsEvent (button) {
    // CoupleofEpisodes event
    // STAMINA +20, MOTIVATION -20, TIME +20
    watchingFlag = true;
    
    setTimeout(function(){
        document.getElementById('2hours-later').style.visibility = 'visible';
        TIME += 20;
        if ( MOTIVATION > 20 ) {

            MOTIVATION -= 20;
        }
        else {
            MOTIVATION = 0;
        }
        if ( STAMINA < 80 ) {

            STAMINA += 20;
        }
        else {
            STAMINA = 100;
        }
    }, 1500)
    
    setTimeout(function(){ 
        document.getElementById('2hours-later').style.visibility = 'hidden';  
        document.getElementById('negated-motivation').innerHTML = "-10 MOTIVATION";
        document.getElementById('negated-motivation').style.visibility = 'visible';
        document.getElementById('negated-progress').innerHTML = "+20 TIME";
        document.getElementById('negated-progress').style.visibility = 'visible';
        document.getElementById('negated-stamina').innerHTML = "+20 STAMINA";
        document.getElementById('negated-stamina').style.visibility = 'visible';
        selectLOCK = false;
        buttonClicked = false;
        setTimeout(function(){ 
            sittingIdleInit = true;
            document.getElementById('negated-motivation').style.visibility = 'hidden';
            document.getElementById('negated-progress').style.visibility = 'hidden';
            document.getElementById('negated-stamina').style.visibility = 'hidden';

            }, 2000)
    }, 4000)
    document.getElementById('fav-show').style.visibility = 'hidden';
    document.getElementById('binge-button').style.visibility = 'hidden';
    document.getElementById('couple-eps-button').style.visibility = 'hidden';
    document.getElementById('not-watch-button').style.visibility = 'hidden';
    TIME += clock.getElapsedTime();
    startTime();
}

function notWatchEvent (button) {
    // Not Watch Event
    // MOTIVATION -60
    document.getElementById('negated-motivation').innerHTML = "-60 MOTIVATION";
    document.getElementById('negated-motivation').style.visibility = 'visible';
    if ( MOTIVATION > 60 ) {

        MOTIVATION -= 60;
    }
    else {
        MOTIVATION = 0;
    }
    setTimeout(function(){    document.getElementById('negated-motivation').style.visibility = 'hidden';
    ;}, 2500)
    selectLOCK = false;
    buttonClicked = false;
    document.getElementById('fav-show').style.visibility = 'hidden';
    document.getElementById('binge-button').style.visibility = 'hidden';
    document.getElementById('couple-eps-button').style.visibility = 'hidden';
    document.getElementById('not-watch-button').style.visibility = 'hidden';
    TIME += clock.getElapsedTime();
    startTime();
}


var deletedFileFlag = true;
function deletedFileEvent () {
    // MOTIVATION -40 
    // PROGRESSION -10
    stopTime();
    selectLOCK = true;

    deletedFileFlag = false;
    typingInit = false;
    document.getElementById('deleted-file').style.visibility = 'visible';
    document.getElementById('negated-progress').innerHTML = "-10 PROGRESS";
    document.getElementById('negated-motivation').innerHTML = "-40 MOTIVATION";

    document.getElementById('negated-progress').style.visibility = 'visible';
    document.getElementById('negated-motivation').style.visibility = 'visible';
    document.getElementById('deleted-file-button').style.visibility = 'visible';
    document.getElementById('deleted-file-button2').style.visibility = 'visible';

}

function deleted_ack_cont(button) {
    if ( MOTIVATION > 40 ) {

        MOTIVATION -= 40;
    }
    else {
        MOTIVATION = 0;
    }
    PROGRESSION -= 10;
    document.getElementById('deleted-file').style.visibility = 'hidden';
    document.getElementById('negated-progress').style.visibility = 'hidden';
    document.getElementById('negated-motivation').style.visibility = 'hidden';
    document.getElementById('deleted-file-button').style.visibility = 'hidden';
    document.getElementById('deleted-file-button2').style.visibility = 'hidden';
    selectLOCK = false;
    buttonClicked = false;
    TIME += clock.getElapsedTime();
    startTime();

}

function deleted_ack_other(button) {
    document.getElementById('deleted-file').style.visibility = 'hidden';
    document.getElementById('negated-progress').style.visibility = 'hidden';
    document.getElementById('negated-motivation').style.visibility = 'hidden';
    document.getElementById('deleted-file-button').style.visibility = 'hidden';
    document.getElementById('deleted-file-button2').style.visibility = 'hidden';
    grading(FAIL);
}

var goingOutFlag = true;
function goingOutEvent () {
    stopTime();

    goingOutFlag = false;
    typingInit = false;
    increment = 0;
    typingCounter = 0;
    selectLOCK = true;

    document.getElementById('going-out').style.visibility = 'visible';
    document.getElementById('going-out-button').style.visibility = 'visible';
    document.getElementById('going-out-button2').style.visibility = 'visible';

}

var goEventInit = false;
var goEventFlags = { "fromChair" : true, "walkOut" : true, "momentsLater" : true, "comeBack" : false, "toChair" : false };
function going_out_accept (button) {

    document.getElementById('going-out').style.visibility = 'hidden';
    document.getElementById('going-out-button').style.visibility = 'hidden';
    document.getElementById('going-out-button2').style.visibility = 'hidden';
    resetFlags();
    goEventInit = true;
    
}

function goEvent() {
    // fromChair

    // Walk out

    // SOME TIME LATER SCREEN

    // Come Back

    // toChair
 
    // -30 STAMINA , +50 MOTIVATION, +20 TIME
    if ( goEventFlags.fromChair ) {
        fromChairInc = fromChair(parsedPoses, fromChairFlags, fromChairInc);
        if (!fromChairFlags.fromChair2){
            goEventFlags.fromChair = false;
        }
    }
    else if ( goEventFlags.walkOut ) {
        dirTable  = false;
        walkingInc = walking(parsedPoses, walkingFlags, walkingInc, dirTable);
        MODEL.position.z += 0.005;
        if ( MODEL.position.x <= -8.0) {
            resetFlags();
            goEventFlags.walkOut = false;
            document.getElementById('2hours-later2').style.visibility = 'visible';  
            setTimeout(function(){  
                document.getElementById('2hours-later2').style.visibility = 'hidden';  
                MODEL.rotation.y = Math.PI/2;
                goEventFlags.comeBack = true;
                TIME += 20;
            }, 4000) 

        }

    }
    
        
        
    if ( goEventFlags.comeBack ) {
        dirTable  = true;
        walkingInc = walking(parsedPoses, walkingFlags, walkingInc, dirTable);
        MODEL.position.z -= 0.005;
        if ( MODEL.position.x >= 1.6) {
            goEventFlags.comeBack = false;
            goEventFlags.toChair = true;
            document.getElementById('negated-motivation').innerHTML = "+50 MOTIVATION";
            document.getElementById('negated-motivation').style.visibility = 'visible';
            document.getElementById('negated-progress').innerHTML = "+20 TIME";
            document.getElementById('negated-progress').style.visibility = 'visible';
            document.getElementById('negated-stamina').innerHTML = "-30 STAMINA";
            document.getElementById('negated-stamina').style.visibility = 'visible';
            
        }
    }
    else if ( goEventFlags.toChair ) {
        toChairInc = toChair(parsedPoses, toChairFlags, toChairInc);
        if ( !toChairFlags.toChair3) {
            goEventFlags.toChair = false;
            goEventInit = false;
            selectLOCK = false;
            buttonClicked = false;
            setTimeout(function(){   
                document.getElementById('negated-stamina').style.visibility = 'hidden';
                document.getElementById('negated-progress').style.visibility = 'hidden';
                document.getElementById('negated-motivation').style.visibility = 'hidden';

            ;}, 1500)


            if ( MOTIVATION < 50 ) {
                MOTIVATION += 50;
            }
            else {
                MOTIVATION = 100;
            }
            if ( STAMINA > 30 ) {
                STAMINA -= 30;
            }
            else {
                STAMINA = 0;
            }

            resetFlags();


            TIME += clock.getElapsedTime();
            startTime();
        }
    }


}

function going_out_reject (button) {
    document.getElementById('negated-motivation').innerHTML = "-40 MOTIVATION";
    document.getElementById('negated-motivation').style.visibility = 'visible';
    if ( MOTIVATION > 40 ) {

        MOTIVATION -= 40;
    }
    else {
        MOTIVATION = 0;
    }
    setTimeout(function(){    document.getElementById('negated-motivation').style.visibility = 'hidden';
    ;}, 2500)
    document.getElementById('going-out').style.visibility = 'hidden';
    document.getElementById('going-out-button').style.visibility = 'hidden';
    document.getElementById('going-out-button2').style.visibility = 'hidden';
    selectLOCK = false;
    buttonClicked = false;
    TIME += clock.getElapsedTime();
    startTime();

}


// BUTTON MANAGEMENT SECTION (kw: buttonmanagement)

var typingButton = false;
function typing_button(button) {
    document.getElementById("typing-button").style.visibility = "hidden";
    // document.getElementById("video-button").style.visibility = "hidden";
    document.getElementById("submit-button").style.visibility = "hidden";


    buttonClicked = true;
    selectLOCK = true;
    typingButton = true;
    if ( modelPoseTableFlag) {
        typingInit = true;
        selectLOCK = false;
        buttonClicked = false;
    }
    else {
    // gotoChair();
        gotoChairInit = true;

    }
}

function sleep_button ( button ) {
    buttonClicked = true;
    gotoSleepFlag = true;
    selectLOCK = true;
    document.getElementById("sleep-button").style.visibility = "hidden";
    document.getElementById("laydown-button").style.visibility = "hidden";
}

function laydown_button ( button ) {
    buttonClicked = true;
    selectLOCK = true;
    restEventFlag = true;
    document.getElementById("sleep-button").style.visibility = "hidden";
    document.getElementById("laydown-button").style.visibility = "hidden";

}

function stop_button ( button ) {
    // buttonClicked = true;
    resetFlags();
    document.getElementById("stop-button").style.visibility = "hidden";
    
    if (layDownEventFlag) {
        layDownEventFlag = false;
        fromCouchInit = true;
        selectLOCK = true;
        setTimeout(function() {
            // selectLOCK = false;
            buttonClicked = false;
        }, 1500);
    }
}


var videoButtonFlag = false;
function video_button ( button ) {
    document.getElementById("typing-button").style.visibility = "hidden";
    // document.getElementById("video-button").style.visibility = "hidden";
    document.getElementById("submit-button").style.visibility = "hidden";

    
    typingInit = false;
    selectLOCK = true;
    videoButtonFlag = true;
    buttonClicked = true;
    document.getElementById("goodvideo-button").style.visibility = "visible";
    document.getElementById("badvideo-button").style.visibility = "visible";
    document.getElementById("back-button").style.visibility = "visible";


}

function back_button ( button ) {
    document.getElementById("goodvideo-button").style.visibility = "hidden";
    document.getElementById("badvideo-button").style.visibility = "hidden";
    document.getElementById("back-button").style.visibility = "hidden";
    document.getElementById("center-text-dummy").style.visibility = "hidden";
    document.getElementById("yes-button").style.visibility = "hidden";
    selectLOCK = false;
    buttonClicked = false;
}

function badvideo_button ( button ) {
    document.getElementById("goodvideo-button").style.visibility = "hidden";
    document.getElementById("badvideo-button").style.visibility = "hidden";
    document.getElementById("back-button").style.visibility = "hidden";

    // Create an event which applies stats during the process of watching 
    // STOP button should appear 
}

function goodvideo_button ( button ) {
    document.getElementById("goodvideo-button").style.visibility = "hidden";
    document.getElementById("badvideo-button").style.visibility = "hidden";
    document.getElementById("back-button").style.visibility = "hidden";
}

function submit_button ( button ) {
    if ( SUCCESS ) {
        // FINISH THE GAME
        buttonClicked = true;
        grading();
    }
    else {
        document.getElementById("typing-button").style.visibility = "hidden";
        // document.getElementById("video-button").style.visibility = "hidden";
        document.getElementById("submit-button").style.visibility = "hidden";
        selectLOCK = true;
        buttonClicked = true;

        document.getElementById("center-text-dummy").innerHTML = "ARE YOU SURE?!";
        document.getElementById("center-text-dummy").style.visibility = "visible";

        document.getElementById("yes-button").style.visibility = "visible";
        document.getElementById("back-button").style.visibility = "visible";
    }
}

function yes_button ( button ) {
    // FINISH THE GAME
    typingInit = false;
    buttonClicked = true;
    grading();
}




function startGame_button ( button ) {
    document.getElementById("startGame-button").style.visibility = "hidden";
    document.getElementById("instructions-button").style.visibility = "hidden";
    document.getElementById("difficulty-button").style.visibility = "hidden";

    document.getElementById("progress-bar").style.visibility = "visible";
    document.getElementById("deadline-bar").style.visibility = "visible";
    document.getElementById("stamina-bar").style.visibility = "visible";
    document.getElementById("motivation-bar").style.visibility = "visible";

    
    setTimeout(
        function () {
            document.getElementById("center-text-dummy").innerHTML = "THE GAME STARTS...";
            document.getElementById("center-text-dummy").style.visibility = "visible";
        },
        500
    )

    setTimeout(
        function () {
            document.getElementById("center-text-dummy").innerHTML = "NOW";
            selectLOCK = false;
            startTime();
        }, 
        1500
    )

    setTimeout(
        function () {
            document.getElementById("center-text-dummy").style.visibility = "hidden";
        },
        2500
    )
}


function difficulty_button ( button ) {
    document.getElementById("startGame-button").style.visibility = "hidden";
    document.getElementById("instructions-button").style.visibility = "hidden";
    document.getElementById("difficulty-button").style.visibility = "hidden";
    document.getElementById("easy-button").style.visibility = "visible";
    document.getElementById("hard-button").style.visibility = "visible";
}


function easy_diff_button ( button ) { 
    document.getElementById("startGame-button").style.visibility = "visible";
    document.getElementById("instructions-button").style.visibility = "visible";
    document.getElementById("difficulty-button").style.visibility = "visible";
    document.getElementById("easy-button").style.visibility = "hidden";
    document.getElementById("hard-button").style.visibility = "hidden";
    GAMETIME = 360;
    STAMINA = 80;
    MOTIVATION = 80;
}

function hard_diff_button ( button ) {
    document.getElementById("startGame-button").style.visibility = "visible";
    document.getElementById("instructions-button").style.visibility = "visible";
    document.getElementById("difficulty-button").style.visibility = "visible";
    document.getElementById("easy-button").style.visibility = "hidden";
    document.getElementById("hard-button").style.visibility = "hidden";
    GAMETIME = 240;
    STAMINA = 65;
    MOTIVATION = 65;
}

var cameraMovementPose;
function instructions_button ( button ) {
    document.getElementById("startGame-button").style.visibility = "hidden";
    document.getElementById("instructions-button").style.visibility = "hidden";
    document.getElementById("difficulty-button").style.visibility = "hidden";
    cameraMovementPose = camera.position;
    cameraInit1 = true;
    cameraInc = 0;
    instructionsLOCK = true;
}

function next1_button ( button ) {
    document.getElementById("next1-button").style.visibility = "hidden";
    cameraInit2 = true;
    cameraInc = 0;
}

function next2_button ( button ) {
    document.getElementById("next2-button").style.visibility = "hidden";
    cameraInit3 = true;
    cameraInc = 0;
}

function next3_button ( button ) {
    document.getElementById("next3-button").style.visibility = "hidden";
    cameraInit4 = true;
    cameraInc = 0;
}

function next4_button ( button ) {
    document.getElementById("next4-button").style.visibility = "hidden";
    document.getElementById("startGame-button").style.visibility = "visible";
    document.getElementById("instructions-button").style.visibility = "visible";
    document.getElementById("difficulty-button").style.visibility = "visible";
    cameraInc = 0;
    instructionsLOCK = false;
}


var TIME = 0;

var instructionsLOCK = false;
let then = 0;
var delta;
function render(now) {
    now *= 0.001;
    delta = now - then;
    then = now;
    // console.log(delta)
    if( loading ) {
        loadJSON();
        pose = parsedPoses["watching0"];
    }
    else if (!loading && !loading2) { 
        if( panelRemove) {
            setTimeout(function(){panel.destroy(); panelRemove=false;}, 500)
        }
        
        if ( clockStartFlag ) {
            clockStartFlag = false;
            startTime();
        }

        // controls.update();
        if (!instructionsLOCK) {

            if (!sleepClockInit && !toCouchInit && !layDownEventFlag && !goEventInit && !fromCouchInit){
                if (  MODEL.position.x < -5.6){
                    camX = -3.6;
                }
                else{
                    camX = 1.6;
                }
            }
            else {
                camX = -3.6;
            }
            camera.position.z = 12; //12
            camera.position.y = 3;  //3
            camera.position.x =  camX; //camX
            camera.rotation.y = -0.2;
            camera.lookAt(camX,1.5,0);
        }
        
        // camera.position.x = -2.3; //camX
        // camera.position.y = 3.8;  //3
        // camera.position.z = 2.5; //12
        // camera.rotation.y = -0.2;
        // camera.lookAt(-2.3, 3.8 ,1);
        camera.updateMatrixWorld();
        if ( flag ) {
            testAnim(parsedPoses);
        }

        //#region PROBLEMS SECTION

        if ( ~~PROGRESSION == 50 && deletedFileFlag) {
            deletedFileEvent();
        }

        if ( ~~PROGRESSION == 30 && favShowFlag) {
            favouriteShowEvent();
        }

        if ( ~~PROGRESSION == 75 && goingOutFlag) {
            goingOutEvent();
        }

        if ( goEventInit ) {
            goEvent();
        }

        //#endregion

        if ( cameraInit1 ) {
            cameraInc = moveCamera1(cameraInc);
        }

        if ( cameraInit2 ) {
            cameraInc = moveCamera2(cameraInc);
        }
        if ( cameraInit3 ) {
            cameraInc = moveCamera3(cameraInc);
        }
        if ( cameraInit4 ) {
            cameraInc = moveCamera4(cameraInc);
        }


        if ( sittingIdleInit ) {
            sittingIdleInc = sittingIdleAnim(parsedPoses, sittingIdleInc);
        }

        if ( typingInit ) {
            var animVars = typing(parsedPoses, typingFlags, typingCounter, increment);
            increment = animVars[0];
            typingCounter = animVars[1];
            workingEvent();
        }   

        if ( tiredFlag ) {
            if (tiredInc == 0) {
                typingInit = false;
                increment = 0;

            }
            tiredInc = tired(parsedPoses, tiredInc);

        }

        if ( watchingFlag ) {
            typingInit = false;
            increment = 0;
            watchingInc = watching(parsedPoses, watchingInc);
        }

        if ( watchVideoBadFlag ) {
            watchVideoBad();
        }

        if ( watchVideoGoodFlag ) {
            watchVideoGood();
        }

        if ( fromChairFlag ) {
            typingInit = false;
            increment = 0;
            fromChairInc = fromChair(parsedPoses, fromChairFlags, fromChairInc);
        }

        if ( toChairInit ) {
            typingInit = false;
            increment = 0;
            toChairInc = toChair(parsedPoses, toChairFlags, toChairInc);
        }

        if ( walkingInit ) {
            walkingInc = walking(parsedPoses, walkingFFlags, walkingInc, dirTable);
        }

        if ( toCouchInit ) {
            layDownEventFlag = true;
            toCouchInc = toCouch(parsedPoses, toCouchFlags, toCouchInc);
        }

        if ( layDownEventFlag ) {
            layDownEvent();
        }

        if ( gotoChairInit ) {
            gotoChair();
        }


        if ( sleepClockInit ) {
            sleepEvent();
            // LOCK EVERYTHING UNTIL SLEEP EVENT FINISHES
        }
        if ( gotoSleepFlag && STAMINA > 30 ) {
            gotoSleepFlag = false;
            selectLOCK = false;
            buttonClicked = false;
            console.log("Too much stamina to sleep.")
            document.getElementById("negated-stamina").innerHTML = "TOO MUCH STAMINA"
            document.getElementById("negated-stamina").style.visibility = "visible";
            document.getElementById("negated-stamina").style.left = "25%";
            document.getElementById("negated-stamina").style.top = "50%";
            setTimeout(
                function () {
                    document.getElementById("negated-stamina").style.visibility = "hidden";
                    document.getElementById("negated-stamina").style.left = "30%";
                    document.getElementById("negated-stamina").style.top = "20%";
                },
                1500
            )

        }
        else if (gotoSleepFlag) {

            tiredFlag = false;
            typingInit = false;
            increment = 0;
            typingCounter = 0;
            gotoSleep();
        }

        if ( fromCouchInit ) {
            fromCouchInc = fromCouch(parsedPoses, fromCouchFlags, fromCouchInc );
        }

        if ( restEventFlag ) {
            tiredFlag = false;
            typingInit = false;
            increment = 0;
            typingCounter = 0;
            restEvent();
        }

        if ( gradeFlag ) {
            gradeFlag = false;
            setTimeout(
                function () {
                    //menu
                    document.getElementById("backMenu-button").style.visibility = "visible";
                }, 
                2500
            )
        }

        if ( PROGRESSION >= 100 ) {
            // STOP THE GAME 
            SUCCESS = true;
            if ( typingInit ){
                resetFlags();
                typingInit = false;
                increment = 0;
                typingCounter = 0;

                document.getElementById("project-complete").innerHTML = "PROJECT COMPLETED!"
                document.getElementById("project-complete").style.visibility = "visible";

                // document.getElementById("submit-button").style.visibility = "visible";

                document.getElementById("stamina-bar").style.visibility = "hidden";
                document.getElementById("motivation-bar").style.visibility = "hidden";

            }

        }

        document.getElementById("progress-bar").innerHTML = "Progress: &nbsp&nbsp%" + ~~PROGRESSION%101;
        document.getElementById("deadline-bar").innerHTML = "Deadline:&nbsp&nbsp&nbsp&nbsp %" + ~~(((TIME +clock.getElapsedTime() ))/ (GAMETIME/100)) %101; // 2.4 for 4 min gameplay , 1.8 for 3 min
        document.getElementById("time-bar").innerHTML = "Time: " + ~~(TIME +clock.getElapsedTime()  );
        if ( TIME +clock.getElapsedTime()   >= GAMETIME  && !FAIL) {
            clock.stop();
            resetFlags();
            selectLOCK = true;
            FAIL = true;
            document.getElementById("center-text-dummy").innerHTML = "TIME'S UP!";
            document.getElementById("center-text-dummy").style.visibility = "visible";
            setTimeout(
                function () {
                    grading(FAIL);
                },
                2000
            );
            
        }

        
        document.getElementById("stamina-bar").innerHTML = "Stamina: &nbsp&nbsp&nbsp&nbsp&nbsp" + ~~STAMINA%101;
        document.getElementById("motivation-bar").innerHTML = "Motivation: " + ~~MOTIVATION%101;
        document.getElementById("progress-bar").style.color = "rgb(" + 255 +", 255, 255)";
        // document.getElementById("progress-bar").style.fontSize = "60px";

        col++;
        // console.log(clock.getDelta()*1000);
        if ( performance.now() < 100000 ) {
            speedMultiplier  = 1;
        }
        else {
            speedMultiplier = 1;
        }

    }
    
    // renderer.render( scene, camera );
    requestAnimationFrame( render );

    composer.render();
}


// window.addEventListener('mousemove', onMouseMove);
render();


var gradeFlag = false;
function grading (timesup = false) {
    stopTime();
    selectLOCK = true;
    document.getElementById("project-complete").style.visibility = "hidden";
    document.getElementById("deadline-bar").style.visibility = "hidden";
    document.getElementById("progress-bar").style.visibility = "hidden";
    document.getElementById("stamina-bar").style.visibility = "hidden";
    document.getElementById("motivation-bar").style.visibility = "hidden";
    document.getElementById("back-button").style.visibility = "hidden";
    document.getElementById("center-text-dummy").style.visibility = "hidden";
    document.getElementById("yes-button").style.visibility = "hidden";

    document.getElementById("center-text-dummy").innerHTML = "YOUR GRADE IS...";
    document.getElementById("center-text-dummy").style.visibility = "visible";

    if ( PROGRESSION < 70 || timesup) {
        // grade = 0
        setTimeout(
            function () {
                document.getElementById("center-text-dummy").style.fontSize = "500px";
                document.getElementById("center-text-dummy").innerHTML = "0/30";
                gradeFlag = true;
            },
            1500
        );

    }
    else if ( PROGRESSION < 80 ) {
        // grade = 18
        setTimeout(
            function () {
                document.getElementById("center-text-dummy").style.fontSize = "500px";
                document.getElementById("center-text-dummy").innerHTML = "18/30";
                gradeFlag = true;
            },
            1500
        );

    }
    else if ( PROGRESSION < 90 ) {
        // grade = 25
        setTimeout(
            function () {
                document.getElementById("center-text-dummy").style.fontSize = "500px";
                document.getElementById("center-text-dummy").innerHTML = "25/30";
                gradeFlag = true;
            },
            1500
        );

    }
    else if ( PROGRESSION < 95 ) {
        // grade = 28
        setTimeout(
            function () {
                document.getElementById("center-text-dummy").style.fontSize = "500px";
                document.getElementById("center-text-dummy").innerHTML = "28/30";
                gradeFlag = true;
            },
            1500
        );

    }
    else {
        // grade = 30
        setTimeout(
            function () {
                document.getElementById("center-text-dummy").style.fontSize = "500px";
                document.getElementById("center-text-dummy").innerHTML = "30/30";
                gradeFlag = true;
            },
            1500
        );
        
    }
}

function backMenu_button ( button ) {
    location.reload();
}