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
let myReq;

///////////////////////

const datGui = new dat.GUI({
    autoPlace: true,
    name: 'Develop GUI',

})

init();

datGui.domElement.id = 'gui';



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

            const moveHeadGUI = {
                "move head": () => {
                    SetHeadPosition(.63, 1.77);
                    console.log('Clicked ...')
                },
                "set to null coord": () => {
                    SetHeadPosition(0, 0);
                    console.log('Clicked ...')
                },
                "draw line 1": () => {
                    DrawLine(-.55, 1.6);
                    console.log('Draw ...')
                },
                "draw line 2": () => {
                    DrawLine(-.1, .5);

                    console.log('Draw ...')
                },
                "draw line 3": () => {
                    DrawLine(.22, -.3);

                    console.log('Draw ...')
                },
                "draw square": () => {
                    DrawLine(-.55, .5);
                    DrawLine(-.55, -.5);
                    DrawLine(0, -.5);
                    DrawLine(0, .5);
                    DrawLine(-.55, .5);

                    console.log('Draw ...')
                },

            }

            fldr.add(moveHeadGUI, 'move head');
            fldr.add(moveHeadGUI, 'set to null coord');

            fldr.add(moveHeadGUI, 'draw line 1');
            fldr.add(moveHeadGUI, 'draw line 2');
            fldr.add(moveHeadGUI, 'draw line 3');
            fldr.add(moveHeadGUI, 'draw line 4');

            fldr = datGui.addFolder('LASERHEAD UP / DOWN');
            fldr.open();

            const LaserHeadGUI = {
                "laserhead down": () => {
                    HeadDown();
                    console.log('Clicked ...')
                },
                "laserhead up": () => {
                    HeadUp();
                    console.log('Clicked ...')
                },
            }

            fldr.add(LaserHeadGUI, 'laserhead up');
            fldr.add(LaserHeadGUI, 'laserhead down');

            /////////////////////////////////////////////////////////////////////////////////////////////////
            //установить голову в нужную позицию

            const SetHeadPosition = (x, z) => {

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

                        myReq = requestAnimationFrame(MoveHead);
                        console.info('myReq MoveHead #: ', myReq);

                    }

                }

                MoveHead();

            }

            const DrawLine = (x, z) => {

                let pathLength, pathLengthX, pathLengthZ;
                let pathVelocity;
                let deltaX, deltaZ, delta;

                pathVelocity = Math.sqrt(2 * .01 ** 2);
                console.info('pathVelocity: ', pathVelocity)

                pathLength = Math.sqrt((head.position.x - x) ** 2 + (bridge.position.z - z) ** 2);
                console.info('pathLength: ', pathLength);

                pathLengthX = x - head.position.x;
                console.info('pathLengthX: ', pathLengthX);

                pathLengthZ = z - bridge.position.z;
                console.info('pathLengthZ: ', pathLengthZ);

                deltaX = pathLengthX * pathVelocity;
                console.info('deltaX: ', deltaX)

                deltaZ = pathLengthZ * pathVelocity;
                console.info('deltaZ: ', deltaZ)

                delta = Math.sqrt(deltaX ** 2 + deltaZ ** 2);
                console.info('delta: ', delta)

                const DrawLineStep = () => {

                    head.position.x += deltaX;
                    console.info('head.position.x: ', head.position.x)

                    bridge.position.z += deltaZ;
                    console.info('bridge.position.z: ', bridge.position.z)

                    if (Math.sqrt((head.position.x - x) ** 2 + (bridge.position.z - z) ** 2) > pathVelocity) {

                        myReq = requestAnimationFrame(DrawLineStep)
                        console.info('myReq DrawLineStep #: ', myReq);

                    }
                }

                DrawLineStep();

            }


            const SetLaserHeadPos = (y) => {

                let deltaY = .005;
                let rnDeltaY = 1 / deltaY;

                const MoveLaserHead = () => {

                    if (Math.round((laserhead.position.y - y) * rnDeltaY) / rnDeltaY < 0) {

                        console.info(laserhead.position.y)

                        laserhead.position.y += deltaY;

                        console.info(laserhead.position.y)

                    } else if (Math.round((laserhead.position.y - y) * rnDeltaY) / rnDeltaY > 0) {

                        console.info(laserhead.position.y)

                        laserhead.position.y -= deltaY;

                        console.info(laserhead.position.y)

                    }

                    laserhead.position.y = Math.round(laserhead.position.y * rnDeltaY) / rnDeltaY;

                    console.info(laserhead.position.y)

                    if (Math.abs(laserhead.position.y - y) >= deltaY) {

                        requestAnimationFrame(MoveLaserHead);

                    }

                }

                MoveLaserHead();

            }

            const HeadDown = () => SetLaserHeadPos(-.065);
            const HeadUp = () => SetLaserHeadPos(0);



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

    myReq = requestAnimationFrame(animate);
    console.info('myReq animate #: ', myReq);

    renderer.render(scene, camera);
    // console.log(camera.position)

    stats.update();
}