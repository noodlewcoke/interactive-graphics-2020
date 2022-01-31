function loadJSON() {
    loadFile(fileName, jsonData);

    if (jsonData["sitting0"]) {
        setTimeout(function () { j1 = JSON.parse(jsonData["sitting0"]) }, 100);
        console.log("JSON loaded indeed.")
        loading = false;
        parsedPoses = parseJSONData(jsonData);
    }
    if (jsonData["f2"]) {
        j2 = JSON.parse(jsonData["f2"]);
    }
}

function loadFile(fileName, jData) {
    var fileLoader = new THREE.FileLoader();
    fileLoader.load(
        // resource URL
        fileName,
        // onLoad callback
        function (data) {
            // output the text to the console

            jsonData = JSON.parse(data);

        },
        // onProgress callback
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // onError callback
        function (err) {
            console.error('An error happened');
        }
    );
}

function onMouseMove(event){
    event.preventDefault();
    
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);
    for (var i=0; i < intersects.length; i++){
        // intersects[i].object.material.color.set(0xff0000);
    }
}




function chunkArray(array, size) {
    let result = []
    let arrayCopy = [...array]
    while (arrayCopy.length > 0) {
        result.push(arrayCopy.splice(0, size))
    }
    return result
}

var jsonToArrayQ = function (jData) {
    var element = [];
    for (i in jData) {
        element.push(jData[i]._x, jData[i]._y, jData[i]._z, jData[i]._w);
    }
    
    return chunkArray(element,4);

}

var jsonToArrayR = function (jData) {
    var element = [];
    for (i in jData) {
        element.push(jData[i]._x, jData[i]._y, jData[i]._z);
    }
    
    return chunkArray(element,3);

}

var loadPoseQ = function (array) {
    for (i in bss_quaternions) bss_quaternions[i].fromArray(array[i]);
}

var loadPoseR = function (array) {
    for (i in bss_rotations) bss_rotations[i].fromArray(array[i]);
}
function parseJSONData (jsonData) {
    var parsed = {};
    var poses = Object.keys(jsonData);
    for (k in poses) {
        parsed[poses[k]] = jsonToArrayR(JSON.parse(jsonData[poses[k]]));
    }
    return parsed;
}

function letr3D(start, stop, increment) {
    var pose = [];
    for (i in start) {
        var m = new THREE.Vector3();
        var a = new THREE.Vector3();
        var b = new THREE.Vector3();
        a.fromArray(stop[i]);
        b.fromArray(start[i]);
    m.subVectors(a, b);
    m.multiplyScalar(increment);
    m.addVectors(m, b);
    
    var eu = new THREE.Euler();
    eu.setFromVector3(m);
    pose.push(eu);
}
return jsonToArrayR( pose );
}
