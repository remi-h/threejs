'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { PerspectiveCamera } from 'three';
import { gsap } from 'gsap';

const GalaxyScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cameraRef = useRef<PerspectiveCamera | null>(null);

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

            const onMouseClick = (event: MouseEvent) => {
                const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
                if (cameraRef.current) {
                    gsap.to(cameraRef.current.position, {
                        x: mouseX * 10,
                        y: mouseY * 10,
                        duration: 1,
                        onUpdate: () => {
                            cameraRef.current?.lookAt(0, 0, 0);
                        }
                    });
                }
            };

            window.addEventListener('click', onMouseClick);
            renderScene();

            return () => {
                window.removeEventListener('click', onMouseClick);
            };
        }
    }, []);
    
    return (
        <div>
            <div ref={containerRef} />
        </div>
    );
};

export default GalaxyScene;