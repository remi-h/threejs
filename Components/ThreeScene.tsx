'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
    console.log('ThreeScene rendered');
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff); // Set the background color to white
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.render(scene, camera);

            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            camera.position.z = 10;

            // -- text --
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
                context.font = '48px Arial';
                context.fillStyle = 'white';
                context.fillText('REMI', 26, 50);
                context.font = '28px Arial';
                context.fillText('HIGUCHI', 26, 80);
            }
            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            // -- text --

            const geometry = new THREE.BoxGeometry(5,5,5);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            console.log("added cube to scene")

            const renderScene = () => {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
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

export default ThreeScene;