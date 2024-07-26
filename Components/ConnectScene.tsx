'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { PerspectiveCamera } from 'three';
import { gsap } from 'gsap';

const ConnectScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cameraRef = useRef<PerspectiveCamera | null>(null);
    const isDragging = useRef(false);
    const initialMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const resetCameraPosition = () => {
        if (cameraRef.current) {
            gsap.to(cameraRef.current.position, {
                x: 0,
                y: 0,
                z: 8,
                duration: 1,
                onUpdate: () => {
                    cameraRef.current?.lookAt(0, 0, 0);
                }
            });
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000); // Set the background color to white
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.render(scene, camera);
            cameraRef.current = camera;

            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            camera.position.set(0, 0, 8); // Use the set() method to update the camera position
            camera.lookAt(0, 0, 0);

            const urls = Array(10).fill("https://picsum.photos/1000/1000");
            const loader = new THREE.TextureLoader();
            let planes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = [];
            let angles = [];
            const group = new THREE.Group();

            Promise.all(urls.map(urls => fetch(urls)))
                .then(responseArray => Promise.all(responseArray.map(response => response.blob())))
                .then(blobs => {
                    const imageUrls = blobs.map(blob => URL.createObjectURL(blob));

                    // Create a sphere of images
                    for (let i = 0; i < 10; i++) {
                        const texture = loader.load(imageUrls[i]);
                        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                        const geometry = new THREE.PlaneGeometry(2, 2); // Use PlaneGeometry for 2D images
                        const plane = new THREE.Mesh(geometry, material); // This is now a plane, not a cube

                        // Position the planes in a circle
                        const angle = (i / 10) * Math.PI * 2;
                        plane.position.set(Math.cos(angle) * 5, Math.sin(angle) * 5, 3);
                        planes.push(plane); // Add the plane to the array
                        angles.push(angle); // Store the initial angle

                        group.add(plane);
                    }
                    scene.add(group);
                })
                .catch(error => console.error(error));

            const renderScene = () => {
                for (let i = 0; i < planes.length; i++) {
                    const angle: number = angles[i] + 0.001; // Update the angle with type annotation
                    const radiusX = 5; // Radius in the x direction
                    const radiusY = 4; // Radius in the y direction
                    planes[i].position.set(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY, 0); // Recalculate the position
                    angles[i] = angle; // Store the updated angle
                }
                renderer.render(scene, camera);
                requestAnimationFrame(renderScene);
            };

            console.log('Component mounted');

            const onMouseDown = (event: MouseEvent) => {
                console.log('Mouse down:', event.clientX, event.clientY);
                isDragging.current = true;
                initialMousePosition.current = { x: event.clientX, y: event.clientY };
            };
            const onMouseMove = (event: MouseEvent) => {
                if (isDragging.current && cameraRef.current) {
                    const deltaX = (event.clientX - initialMousePosition.current.x) / window.innerWidth * 2;
                    const deltaY = -(event.clientY - initialMousePosition.current.y) / window.innerHeight * 2;
                    console.log('Mouse move:', deltaX, deltaY);
                    gsap.to(cameraRef.current.position, {
                        x: deltaX * 10,
                        y: deltaY * 10,
                        duration: 0.1,
                        onUpdate: () => {
                            cameraRef.current?.lookAt(0, 0, 0);
                        }
                    });
                }
            };
            const onMouseUp = () => {
                console.log('Mouse up');
                isDragging.current = false;
            };

            if (containerRef.current) {
                console.log('Adding event listeners');
                containerRef.current.addEventListener('mousedown', onMouseDown);
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
            }

            renderScene();

            return () => {
                console.log('Component unmounted');
                if (containerRef.current) {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    containerRef.current.removeEventListener('mousedown', onMouseDown);
                }
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };
        }
    }, []);

    return (
        <div>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <input type='text' placeholder='type a keyword...' className='p-1 bg-black text-center text-white focus:outline-none' />
            </div>
            <div ref={containerRef} />
            <div className='absolute bottom-0 left-0 bg-white m-auto'>
                <button onClick={resetCameraPosition} className='p-1'>Reset Camera Position</button>
            </div>
        </div>
    );
};

export default ConnectScene;
