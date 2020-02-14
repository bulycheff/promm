import './styles/styles.css'
import smazkasystem from './assets/models/gaztank2.gltf'
import GltfFile from './assets/models/machine.gltf'
import AnimationPath from './assets/models/animation6.gltf'
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


var stats, controls;
var camera, scene, renderer, rgbeLoader;
let head, bridge, laserhead;

// stats
stats = new Stats();
document.body.appendChild(stats.dom);

//DAT.GUI
const datGui = new dat.GUI({
    autoPlace: true,
    name: 'Develop GUI',
})

datGui.domElement.id = 'gui';

////////////////////////////////////////////

const container = document.querySelector('.canvasjs');
init();

////////////////////////////////////////////

controls = new OrbitControls(camera, container);
controls.target.set(0, 0, -1);


window.addEventListener('resize', onWindowResize, false);


function init() {

    renderer = new THREE.WebGLRenderer({
        container,
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0xbdccc6, .1);
    document.body.appendChild(renderer.domElement);

    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

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
            // console.log('Dump Obj head ...', dumpObject(head).join('\n'));

            bridge = gltf.scene.getObjectByName('bridge');

            laserhead = gltf.scene.getObjectByName('LCM_laserhead_low');

            //создание света от сварки
            var weld = new weldingLight('#EDD175');
            weld.visible(1);
            weld.addGUI();
            weld.setIntens(50);
            weld.blinking();


            //----------------------------------------------------------------------------------------

            fldr = datGui.addFolder('BRIDGE');
            var bridgeController = fldr.add(bridge.position, 'z', -1.1, 1.9, .01);
            bridgeController.onChange(() => {
                weld.setPositionXZ(head.position.x, bridge.position.z)
            })
            fldr.open();

            let fldr = datGui.addFolder('HEAD');
            var headController = fldr.add(head.position, 'x', -.7, .7, .01);
            headController.onChange(() => {
                weld.setPositionXZ(head.position.x, bridge.position.z)
            })
            fldr.open();

            fldr = datGui.addFolder('LASER HEAD');
            fldr.add(laserhead.position, 'y', -.07, 0, .001);
            fldr.open();

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

                        weld.setPositionXZ(head.position.x, bridge.position.z);

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
                        weld.setPositionXZ(head.position.x, bridge.position.z);

                        if (((Math.abs(head.position.x - x) > Math.abs(deltaX)) && (deltaX != 0)) || ((Math.abs(bridge.position.z - z) > Math.abs(deltaZ)) && (deltaZ != 0))) {

                            updateDisplay(datGui);
                            requestAnimationFrame(DrawLineStep)

                        } else {

                            head.position.x = x;
                            bridge.position.z = z;
                            weld.setPositionXZ(head.position.x, bridge.position.z);

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

                        if (laserhead.position.y <= -.065) {
                            weld.setPositionXZ(head.position.x, bridge.position.z)
                            weld.visible(1)
                        } else if (laserhead.position.y > -.065) {
                            weld.visible(0)
                        }

                        if (Math.abs(laserhead.position.y - y) >= deltaY) {

                            updateDisplay(datGui);
                            requestAnimationFrame(MoveLaserHead);

                        } else {

                            laserhead.position.y = y;

                            resolve();

                        }

                    }

                    MoveLaserHead();

                });



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

            function weldingLight(color) {

                var lightcolor;
                var colparams = {
                    lightcolor: color
                };
                var intens = 10;

                this.addGUI = function () {

                    let fldr = datGui.addFolder('LIGHT');
                    fldr.add(light1.position, 'x', -.7, .7, .01);
                    fldr.add(light1.position, 'y', .5, 1.5, .01);
                    fldr.add(light1.position, 'z', -1.1, 1.9, .01);

                    fldr.addColor(colparams, 'lightcolor')
                        .name('LIGHT')
                        .onChange(function () {
                            light1.color.set(colparams.lightcolor);
                            spherematerial.color.set(colparams.lightcolor);
                        })

                    fldr.add(light1, 'visible');
                    fldr.open();

                    console.info(fldr.__controllers)
                    console.info(fldr.updateDisplay())

                }

                this.visible = (visible) => {
                    if (visible) {
                        light1.visible = true
                    } else {
                        light1.visible = false
                    }
                }

                this.lightcolor = lightcolor = color;

                this.changecolor = function (newcolor) {
                    light1.color.set(newcolor);
                    spherematerial.color.set(newcolor);
                }

                this.setPositionXZ = (x, z) => {
                    light1.position.x = x;
                    light1.position.z = z + .21;
                }

                this.setIntens = function (intens) {
                    light1.intensity = intens
                }

                var sphere = new THREE.SphereBufferGeometry(0.005, 16, 16);
                var spherematerial = new THREE.MeshBasicMaterial({
                    color: lightcolor
                });
                var light1 = new THREE.PointLight(lightcolor, intens, 100000);
                console.log('Date')
                console.log(Date.now())
                console.log(Math.sin(Date.now()))
                light1.add(new THREE.Mesh(sphere, spherematerial));

                light1.position.x = .00;
                light1.position.y = .95;
                light1.position.z = .21;

                console.info('light1 intensity: ', light1.intensity)

                this.continueblink = function (isBlink = true) {
                    return isBlink
                }

                this.blinking = function () {

                }

                light1.visible = false;

                scene.add(light1);

            }




        });

        // var loader2 = new GLTFLoader();
        // loader2.load(AnimationPath, function(gltf2) {

        //     scene.add(gltf2.scene);
        //     console.log('gltf2.scene: ', gltf2.scene)
        //     var smz = gltf2.scene.getObjectByName('LCM_gas_tank_low001')

        //     var fldr = datGui.addFolder('SMAZKA');
        //     fldr.add(smz.position, 'x', -100, 100, 1);
        //     fldr.add(smz.position, 'y', -100, 100, 1);
        //     fldr.add(smz.position, 'z', -100, 100, 1);
        //     fldr.add(smz.scale, 'x', 0, 1, .001);
        //     fldr.add(smz.scale, 'y', 0, 1, .001);
        //     fldr.add(smz.scale, 'z', 0, 1, .001);
        //     fldr.open();
        // })


    });


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function updateDisplay(datGui) {
    for (var i in datGui.__controllers) {
        datGui.__controllers[i].updateDisplay();
    }
    for (var f in datGui.__folders) {
        updateDisplay(datGui.__folders[f]);
    }
}

function animate() {

    updateDisplay(datGui);
    controls.update();
    stats.update();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}

controls.update();
animate();