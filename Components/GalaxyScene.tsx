'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const GalaxyScene: React.FC = () => {
    console.log('ThreeScene rendered');
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000); // Set the background color to white
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.render(scene, camera);

            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            camera.position.set(0, 1, 8); // Use the set() method to update the camera position
            camera.lookAt(0, 0, 0);

            const urls = Array(10).fill("https://picsum.photos/1000/1000");
            const loader = new THREE.TextureLoader();
            let planes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = [];
            let angles = [];
            const group = new THREE.Group();

            Promise.all(urls.map(url => fetch(url)))
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
                        plane.position.set(Math.cos(angle) * 5, Math.sin(angle) * 5, 0);
                        plane.lookAt(camera.position); // Make the plane face the camera
                        planes.push(plane); // Add the plane to the array
                        angles.push(angle); // Store the initial angle

                        group.add(plane);
                    }
                    scene.add(group);
                })
                .catch(error => console.error(error));

            const renderScene = () => {
                for (let i = 0; i < planes.length; i++) {
                    const angle: number = angles[i] + 0.005; // Update the angle with type annotation
                    const radiusX = 5; // Radius in the x direction
                    const radiusY = 3; // Radius in the y direction
                    planes[i].position.set(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY, 0); // Recalculate the position
                    planes[i].lookAt(camera.position);
                    angles[i] = angle; // Store the updated angle
                }
                renderer.render(scene, camera);
                requestAnimationFrame(renderScene);
            };
            renderScene();

            const handleResize = () => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return <div ref={containerRef} />;
};

export default GalaxyScene;