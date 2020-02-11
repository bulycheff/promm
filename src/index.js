import './styles/styles.css'
import GlbFile from './assets/models/scene.glb'
import GltfFile from './assets/models/machine.gltf'
import hdrFile from '@assets/hdr/industrial_pipe_and_valve_01_1k.hdr'
import * as THREE from 'three'
import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader.js"
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js'
import {
    RoughnessMipmapper
} from 'three/examples/jsm/utils/RoughnessMipmapper.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {
    dumpObject
} from './dumpobj'

import * as dat from 'dat.gui'


var container, stats, controls;
var camera, scene, renderer, rgbeLoader;
let head, bridge, laserhead;

///////////////////////

const datGui = new dat.GUI({
    autoPlace: true,
    name: 'Develop GUI',

})

init();

datGui.domElement.id = 'gui';

function updateDisplay(datGui) {
    for (var i in datGui.__controllers) {
        datGui.__controllers[i].updateDisplay();
    }
    for (var f in datGui.__folders) {
        updateDisplay(datGui.__folders[f]);
    }
}

animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
    camera.position.set(5, 6, 11);

    scene = new THREE.Scene();

    rgbeLoader = new RGBELoader();
    rgbeLoader.setDataType(THREE.UnsignedByteType);
    rgbeLoader.load(hdrFile, function (texture) {

        var envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();

        scene.background = new THREE.Color(0x555e5e);

        scene.environment = envMap;

        // model

        var roughnessMipmapper = new RoughnessMipmapper(renderer);

        var loader = new GLTFLoader();

        loader.load(GltfFile, function (gltf) {

            gltf.scene.traverse(function (child) {

                if (child.isMesh) {
                    roughnessMipmapper.generateMipmaps(child.material);

                }

            });

            scene.add(gltf.scene);

            roughnessMipmapper.dispose();

            head = gltf.scene.getObjectByName('head');
            // console.info(head.id);
            // console.log('Dump Obj head ...', dumpObject(head).join('\n'));

            bridge = gltf.scene.getObjectByName('bridge');
            // console.info(bridge.id)
            console.log('Dump Obj bridge ...', dumpObject(bridge).join('\n'));

            laserhead = gltf.scene.getObjectByName('LCM_laserhead_low');

            //----------------------------------------------------------------------------------------

            fldr = datGui.addFolder('BRIDGE');
            fldr.add(bridge.position, 'z', -1.1, 1.9, .01);
            fldr.open();

            let fldr = datGui.addFolder('HEAD');
            fldr.add(head.position, 'x', -.7, .7, .01);
            fldr.open();

            fldr = datGui.addFolder('LASER HEAD');
            fldr.add(laserhead.position, 'y', -.07, 0, .001);
            fldr.open();

            console.info('datGui.__controllers:', datGui.__controllers)
            console.info('datGui.__folders:', datGui.__folders)

            const moveHeadGUI = {
                "move head": () => {
                    SetHeadPosition(.63, 1.77);
                },
                "set to null coord": () => {
                    SetHeadPosition(0, 0);
                },
                "draw line 1": () => {
                    DrawLine(.5, -.5);
                },
                "draw line 2": () => {
                    DrawLine(-.5, -.5);
                },
                "draw line 3": () => {
                    DrawLine(-.5, .5);
                },
                "draw square": () => {

                    let xpos = -.65;
                    let strtx = xpos;
                    let strtz = -.95;
                    let sidel = .11;
                    
                    DrawSquare(strtx, strtz, sidel)
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx = xpos;
                            strtz += (sidel + .02);
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })
                        .then(() => {
                            strtx += (sidel + .02)
                            return DrawSquare(strtx, strtz, sidel)
                        })

                },

            }

            fldr.add(moveHeadGUI, 'move head');
            fldr.add(moveHeadGUI, 'set to null coord');

            fldr.add(moveHeadGUI, 'draw line 1');
            fldr.add(moveHeadGUI, 'draw line 2');
            fldr.add(moveHeadGUI, 'draw line 3');
            fldr.add(moveHeadGUI, 'draw square');

            fldr = datGui.addFolder('LASERHEAD UP / DOWN');
            fldr.open();

            const LaserHeadGUI = {
                "laserhead down": () => {
                    HeadDown();
                },
                "laserhead up": () => {
                    HeadUp();
                },
            }

            fldr.add(LaserHeadGUI, 'laserhead up');
            fldr.add(LaserHeadGUI, 'laserhead down');

            // РАБОЧЕЕ ПОЛЕ (x, z): (-0.7, -1.1) ... (0.7, 1.9)

            // переместить голову в заданную позицию (подготовка к резке)

            const SetHeadPosition = (x, z) => {

                return new Promise((resolve) => {

                    let deltaX = .01;
                    let deltaZ = .01;

                    const MoveHead = () => {

                        if (Math.round((bridge.position.z - z) * 100) / 100 < 0) {

                            bridge.position.z += deltaZ;

                        } else if (Math.round((bridge.position.z - z) * 100) / 100 > 0) {

                            bridge.position.z -= deltaZ;

                        }

                        bridge.position.z = (Math.round(bridge.position.z * 100) / 100);

                        if (Math.round((head.position.x - x) * 100) / 100 < 0) {

                            head.position.x += deltaX;

                        } else if (Math.round((head.position.x - x) * 100) / 100 > 0) {

                            head.position.x -= deltaX;

                        }

                        head.position.x = Math.round(head.position.x * 100) / 100;

                        if ((Math.abs(bridge.position.z - z).toFixed(2) >= deltaZ) || (Math.abs(head.position.x - x).toFixed(2) >= deltaX)) {

                            updateDisplay(datGui);
                            requestAnimationFrame(MoveHead);

                        } else {

                            head.position.x = x;
                            bridge.position.z = z;

                            resolve();

                        }

                    }

                    MoveHead();

                })

            }

            // перемещает линию по прямой (во время резки)

            const DrawLine = (x, z) => {

                return new Promise((resolve) => {

                    let pathLength, pathLengthX, pathLengthZ;
                    let pathVelocity;
                    let deltaX, deltaZ, delta;

                    delta = 5 * 0.00141421356;

                    pathLength = Math.sqrt((head.position.x - x) ** 2 + (bridge.position.z - z) ** 2);
                    pathLengthX = x - head.position.x;
                    pathLengthZ = z - bridge.position.z;

                    deltaX = Math.sign(pathLengthX) * delta * Math.abs(Math.cos(Math.atan(pathLengthZ / pathLengthX)));
                    deltaZ = Math.sign(pathLengthZ) * delta * Math.abs(Math.sin(Math.atan(pathLengthZ / pathLengthX)));

                    const DrawLineStep = () => {

                        head.position.x += deltaX;
                        bridge.position.z += deltaZ;

                        if (((Math.abs(head.position.x - x) > Math.abs(deltaX)) && (deltaX != 0)) || ((Math.abs(bridge.position.z - z) > Math.abs(deltaZ)) && (deltaZ != 0))) {

                            updateDisplay(datGui);
                            requestAnimationFrame(DrawLineStep)

                        } else {

                            head.position.x = x;
                            bridge.position.z = z;

                            resolve();

                        }
                    }

                    DrawLineStep();

                })


            }

            // устанавливает лазерную голову по высоте


            const SetLaserHeadPos = (y) => {

                return new Promise((resolve) => {

                    let deltaY = .005;
                    let rnDeltaY = 1 / deltaY;

                    const MoveLaserHead = () => {

                        if (Math.round((laserhead.position.y - y) * rnDeltaY) / rnDeltaY < 0) {

                            laserhead.position.y += deltaY;

                        } else if (Math.round((laserhead.position.y - y) * rnDeltaY) / rnDeltaY > 0) {

                            laserhead.position.y -= deltaY;

                        }

                        laserhead.position.y = Math.round(laserhead.position.y * rnDeltaY) / rnDeltaY;

                        if (Math.abs(laserhead.position.y - y) >= deltaY) {

                            updateDisplay(datGui);
                            requestAnimationFrame(MoveLaserHead);

                        } else {
                            
                            laserhead.position.y = y;

                            resolve();

                        }

                    }

                    MoveLaserHead();

                })

            }

            const HeadDown = () => SetLaserHeadPos(-.065);
            const HeadUp = () => SetLaserHeadPos(0);

            const DrawSquare = (xStart, zStart, sideLength) => {

                return new Promise((resolve) => {

                    SetHeadPosition(xStart, zStart)
                        .then(() => {
                            return HeadDown();
                        })
                        .then(() => {
                            return DrawLine(xStart + sideLength, zStart)
                        })
                        .then(() => {
                            return DrawLine(xStart + sideLength, zStart + sideLength)
                        })
                        .then(() => {
                            return DrawLine(xStart, zStart + sideLength)
                        })
                        .then(() => {
                            return DrawLine(xStart, zStart)
                        })
                        .then(() => {
                            return HeadUp();
                        })
                        .then(() => {
                            resolve();
                        })

                })

            }

        });

    });

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0xbdccc6, .1);

    container.appendChild(renderer.domElement);

    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, -1);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    // stats
    stats = new Stats();
    container.appendChild(stats.dom);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {

    updateDisplay(datGui);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    stats.update();

}