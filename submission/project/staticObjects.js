
function staticObjects() {

// Wall Object Creation
var texture = new THREE.TextureLoader().load( 'examples/textures/red-texture-backgrounds-fon.jpg');
var geometry = new THREE.BoxGeometry(45, 15, 1);
var material = new THREE.MeshLambertMaterial( {map: texture});
var cube = new THREE.Mesh( geometry, material );
cube.position.y = 5;
scene.add( cube );


// Floor Object Creation
var texture = new THREE.TextureLoader().load( 'examples/textures/hardwood2_diffuse.jpg')
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 10, 8 );
var geometry = new THREE.BoxGeometry(45, 15, 1);
var material = new THREE.MeshLambertMaterial( {map: texture});
var cube = new THREE.Mesh( geometry, material );
cube.position.y = -3;
cube.position.x = 0;
cube.position.z = 5;
cube.rotation.x = Math.PI/2;
scene.add( cube );


// Table Object Creation
var texture = new THREE.TextureLoader().load( 'examples/textures/Wood_07_1K_Base_Color.png')
var geometry = new THREE.BoxBufferGeometry(5, 5, 5);
var material = new THREE.MeshLambertMaterial({map: texture});

var root = new THREE.Mesh(geometry, material);
root.position.x = 2;
root.position.y = 1.0;
root.position.z = 2.4;
root.scale.x = 2;
root.scale.y = 0.03;
root.scale.z = 0.7;
scene.add(root);

var parent = root;
var object;
var positionsX = [2, 2, -2, -2];
var positionsZ = [2, -2, 2, -2];
for (var i=0; i<4; i++) {
    object = new THREE.Mesh(geometry, material);
    object.position.x = positionsX[i];
    object.position.z = positionsZ[i];
    object.position.y = -85;
    object.scale.x = 0.02;
    object.scale.z = 0.02;
    object.scale.y = 33;
    parent.add(object)
}

// Mouse and Keyboard Loader
var mtlLoader = new THREE.MTLLoader();
mtlLoader.load(
    'examples/models/obj/keyboard-and-mouse.mtl',
    function ( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            'examples/models/obj/keyboard-and-mouse.obj',
            function (object) {
                object.scale.x = 4.5;
                object.scale.y = 4.5;
                object.scale.z = 4.5;
                object.position.y = 1.1;
                object.position.x = 1.6;
                object.position.z = 3.5;
                object.rotation.y = -Math.PI/2;
                scene.add(object);
            }
        )
    }
)


// Lamp Loader
var mtlLoader = new THREE.MTLLoader();
mtlLoader.load(
    'examples/models/obj/lamp-1.mtl',
    function ( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            'examples/models/obj/lamp-1.obj',
            function (object) {
                object.scale.x = 0.005;
                object.scale.y = 0.005;
                object.scale.z = 0.005;
                object.position.y = 1.1;
                object.position.x = 4.6;
                object.position.z = 3.5;
                object.rotation.y = 3*Math.PI/4;
                scene.add(object);
                selectableObjects.push(object);

            }
        )
    }
)


// Monitor Loader
var mtlLoader = new THREE.MTLLoader();
mtlLoader.load(
    'examples/models/obj/mac-monitor.mtl',
    function ( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            'examples/models/obj/mac-monitor.obj',
            function (object) {
                // monitorObj = object;
                object.scale.x = .02;
                object.scale.y = .02;
                object.scale.z = .02;
                object.position.y = 1.0;
                object.position.x = 1.6;
                object.position.z = 2.5;
                // object.rotation.y = -Math.PI/2;
                scene.add(object);
                selectableObjects.push(object);

            }
        )
    }
)

// Couch Loader 
var geometry;
var mtlLoader = new THREE.MTLLoader();
mtlLoader.load(
    'examples/models/obj/couch.mtl',
    function ( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            'examples/models/obj/couch.obj',
            function (object) {
                // object.rotation.x = -1.6;
                object.scale.x = 2.8;
                object.scale.y = 2.8;
                object.scale.z = 2.8;
                object.position.y = -0.8;
                object.position.x = -9;
                object.position.z = 6.7;


                scene.add(object);
                selectableObjects.push(object);

            }
        )
    }
)


// Notebook Paper Objects Creation
var texture = new THREE.TextureLoader().load( 'examples/textures/notebook1.jpg')
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set( 10, 8 );
var geometry = new THREE.BoxGeometry(1, 0.8, 0.01);
var material = new THREE.MeshLambertMaterial( {map: texture});
var paper01 = new THREE.Mesh( geometry, material );
paper01.position.x = -2;
paper01.position.y = 5;
paper01.position.z = 1;
paper01.rotation.z = Math.PI/2;
scene.add( paper01 );


var texture = new THREE.TextureLoader().load( 'examples/textures/notebook2.jpg')
var geometry = new THREE.BoxGeometry(1, 0.8, 0.01);
var material = new THREE.MeshLambertMaterial( {map: texture});
var paper02 = new THREE.Mesh( geometry, material );
paper02.position.x = -2.3;
paper02.position.y = 3.8;
paper02.position.z = 1;


scene.add( paper02 );



var texture = new THREE.TextureLoader().load( 'examples/textures/notebook3.png')
var geometry = new THREE.BoxGeometry(1, 0.8, 0.01);
var material = new THREE.MeshLambertMaterial( {map: texture});
var paper03 = new THREE.Mesh( geometry, material );
paper03.position.x = -1;
paper03.position.y = 4.5;
paper03.position.z = 1;
paper03.rotation.z = Math.PI/2;
scene.add( paper03 );




var loader = new THREE.FontLoader();
loader.load('examples/fonts/gentilis_regular.typeface.json', function (font) {
    var xMid;
    var color = 0x000000;
    var matDark = new THREE.LineBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    });

    var message = "Welcome! \n " + 
    "You play as a student who is working on \n"+
    "a project for his class. You have limited \n time, " +
    "and you need to manage your stamina  \n and  " + 
    "motivation levels. \n" ;

    var shapes = font.generateShapes(message, 0.03);
    var geometry = new THREE.ShapeBufferGeometry(shapes);
    geometry.computeBoundingBox();
    xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    text = new THREE.Mesh(geometry, matDark);
    text.position.x = -2;

    text.position.y = 5.3;
    text.position.z = 1.01;
    scene.add(text);
});

var loader = new THREE.FontLoader();
loader.load('examples/fonts/gentilis_regular.typeface.json', function (font) {
    var xMid;
    var color = 0x000000;
    var matDark = new THREE.LineBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    });

    var message = "The speed of your progress\n" + 
    "depends on your stamina and motivation \n"+
    "levels. Throught the game you will \n " +
    "encounter problems, that will challenge \n" + 
    "your progress. Try to choose \n your actions wisely.\n\n\n" +
    "You can interact with certain objects\n"+
    "by selecting them. Do not forget about them.\n";

    var shapes = font.generateShapes(message, 0.03);
    var geometry = new THREE.ShapeBufferGeometry(shapes);
    geometry.computeBoundingBox();
    xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    text = new THREE.Mesh(geometry, matDark);
    text.position.x = -1;

    text.position.y = 4.9;
    text.position.z = 1.01;
    scene.add(text);
});

var loader = new THREE.FontLoader();
loader.load('examples/fonts/gentilis_regular.typeface.json', function (font) {
    var xMid;
    var color = 0x000000;
    var matDark = new THREE.LineBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    });

    var message = "Tips:\n\n" + 
    "* Do not forget to SUBMIT the project.\n"+
    "* Working and resting increases your motivation. \n " +
    "* Social interactions are very important but \n    time consuming. \n" + 
    "* Difficulty levels determines how much time you \n   will have.\n" +
    "* You can submit the project only once!\n"+ 
    "\nGood luck!";

    var shapes = font.generateShapes(message, 0.03);
    var geometry = new THREE.ShapeBufferGeometry(shapes);
    geometry.computeBoundingBox();
    xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    text = new THREE.Mesh(geometry, matDark);
    text.position.x = -2.3;

    text.position.y = 4.1;
    text.position.z = 1.01;
    scene.add(text);
});

}