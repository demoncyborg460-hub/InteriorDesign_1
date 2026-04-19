/**
 * Three.js Scene Manager for Interior Design Portfolio
 * Creates interactive 3D room visualizations
 */

class SceneManager {
    constructor() {
        this.scenes = new Map();
        this.currentProject = null;
    }

    /**
     * Initialize a Three.js scene in a container
     */
    createScene(containerId, roomType = 'default') {
        const container = document.getElementById(containerId);
        if (!container) return null;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x121212);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(5, 3, 5);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 3;
        controls.maxDistance = 10;
        controls.maxPolarAngle = Math.PI / 2.2;

        // Lighting
        this.setupLighting(scene);

        // Create room based on type
        this.createRoom(scene, roomType);

        // Store scene reference
        const sceneData = { scene, camera, renderer, controls, container };
        this.scenes.set(containerId, sceneData);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        return sceneData;
    }

    /**
     * Setup scene lighting
     */
    setupLighting(scene) {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Main directional light (sun)
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 8, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        scene.add(mainLight);

        // Fill light (teal accent)
        const fillLight = new THREE.PointLight(0x00b5b8, 0.3);
        fillLight.position.set(-3, 2, -3);
        scene.add(fillLight);

        // Accent light (coral)
        const accentLight = new THREE.PointLight(0xff6b6b, 0.4);
        accentLight.position.set(3, 4, -2);
        scene.add(accentLight);
    }

    /**
     * Create a room with furniture based on type
     */
    createRoom(scene, type) {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(6, 6);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        // Walls
        this.createWalls(scene);

        // Add furniture based on room type
        switch(type) {
            case 'living-room':
                this.createSofa(scene);
                this.createCoffeeTable(scene);
                this.createFloorLamp(scene);
                break;
            case 'bedroom':
                this.createBed(scene);
                this.createNightstand(scene);
                this.createBedsideLamp(scene);
                break;
            case 'kitchen':
                this.createKitchenCounter(scene);
                this.createKitchenIsland(scene);
                break;
            case 'office':
                this.createDesk(scene);
                this.createOfficeChair(scene);
                this.createBookshelf(scene);
                break;
            default:
                this.createAbstractFurniture(scene);
        }
    }

    /**
     * Create room walls
     */
    createWalls(scene) {
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.9
        });

        // Back wall
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(6, 3, 0.1),
            wallMaterial
        );
        backWall.position.set(0, 1.5, -3);
        backWall.receiveShadow = true;
        scene.add(backWall);

        // Left wall
        const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 3, 6),
            wallMaterial
        );
        leftWall.position.set(-3, 1.5, 0);
        leftWall.receiveShadow = true;
        scene.add(leftWall);
    }

    /**
     * Create a modern sofa
     */
    createSofa(scene) {
        const sofaGroup = new THREE.Group();

        // Sofa base
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d2d2d,
            roughness: 0.7
        });
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.4, 1),
            baseMaterial
        );
        base.position.y = 0.2;
        base.castShadow = true;
        sofaGroup.add(base);

        // Backrest
        const backrest = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.8, 0.3),
            baseMaterial
        );
        backrest.position.set(0, 0.8, -0.35);
        backrest.castShadow = true;
        sofaGroup.add(backrest);

        // Armrests
        const armrestMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.5
        });
        const leftArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.6, 1),
            armrestMaterial
        );
        leftArm.position.set(-1.15, 0.5, 0);
        leftArm.castShadow = true;
        sofaGroup.add(leftArm);

        const rightArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.6, 1),
            armrestMaterial
        );
        rightArm.position.set(1.15, 0.5, 0);
        rightArm.castShadow = true;
        sofaGroup.add(rightArm);

        // Accent pillows
        const pillowMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            roughness: 0.8
        });
        const pillow1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.3, 0.3),
            pillowMaterial
        );
        pillow1.position.set(-0.7, 0.55, -0.2);
        pillow1.rotation.z = 0.1;
        sofaGroup.add(pillow1);

        const pillow2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.3, 0.3),
            pillowMaterial
        );
        pillow2.position.set(0.7, 0.55, -0.2);
        pillow2.rotation.z = -0.1;
        sofaGroup.add(pillow2);

        sofaGroup.position.set(0, 0, 1);
        scene.add(sofaGroup);
    }

    /**
     * Create a coffee table
     */
    createCoffeeTable(scene) {
        const tableGroup = new THREE.Group();

        // Table top
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x3d3d3d,
            roughness: 0.3,
            metalness: 0.5
        });
        const top = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.6, 0.05, 32),
            topMaterial
        );
        top.position.y = 0.4;
        top.castShadow = true;
        tableGroup.add(top);

        // Base
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.4,
            metalness: 0.8
        });
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.3, 0.4, 8),
            baseMaterial
        );
        base.position.y = 0.2;
        base.castShadow = true;
        tableGroup.add(base);

        tableGroup.position.set(0, 0, -0.5);
        scene.add(tableGroup);
    }

    /**
     * Create a floor lamp
     */
    createFloorLamp(scene) {
        const lampGroup = new THREE.Group();

        // Pole
        const poleMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            roughness: 0.3,
            metalness: 0.9
        });
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8),
            poleMaterial
        );
        pole.position.y = 0.75;
        lampGroup.add(pole);

        // Shade
        const shadeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            transparent: true,
            opacity: 0.9
        });
        const shade = new THREE.Mesh(
            new THREE.ConeGeometry(0.25, 0.4, 32, 1, true),
            shadeMaterial
        );
        shade.position.y = 1.5;
        lampGroup.add(shade);

        // Light bulb glow
        const bulbLight = new THREE.PointLight(0xffaa66, 0.5, 3);
        bulbLight.position.y = 1.4;
        lampGroup.add(bulbLight);

        lampGroup.position.set(1.8, 0, -2);
        scene.add(lampGroup);
    }

    /**
     * Create a bed
     */
    createBed(scene) {
        const bedGroup = new THREE.Group();

        // Mattress
        const mattressMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9
        });
        const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.3, 2.5),
            mattressMaterial
        );
        mattress.position.y = 0.45;
        mattress.castShadow = true;
        bedGroup.add(mattress);

        // Bed frame
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d2d2d,
            roughness: 0.5
        });
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.2, 2.7),
            frameMaterial
        );
        frame.position.y = 0.15;
        frame.castShadow = true;
        bedGroup.add(frame);

        // Headboard
        const headboard = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 1, 0.15),
            frameMaterial
        );
        headboard.position.set(0, 1, -1.2);
        headboard.castShadow = true;
        bedGroup.add(headboard);

        // Accent blanket
        const blanketMaterial = new THREE.MeshStandardMaterial({
            color: 0x00b5b8,
            roughness: 0.8
        });
        const blanket = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.05, 1.5),
            blanketMaterial
        );
        blanket.position.set(0.3, 0.63, 0.3);
        bedGroup.add(blanket);

        // Pillows
        const pillowMaterial = new THREE.MeshStandardMaterial({
            color: 0x3d3d3d,
            roughness: 0.9
        });
        const pillow1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.2, 0.4),
            pillowMaterial
        );
        pillow1.position.set(-0.4, 0.65, -0.8);
        bedGroup.add(pillow1);

        const pillow2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.2, 0.4),
            pillowMaterial
        );
        pillow2.position.set(0.4, 0.65, -0.8);
        bedGroup.add(pillow2);

        bedGroup.position.set(0, 0, -0.5);
        scene.add(bedGroup);
    }

    /**
     * Create a nightstand
     */
    createNightstand(scene) {
        const nightstand = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.4),
            new THREE.MeshStandardMaterial({
                color: 0x2d2d2d,
                roughness: 0.5
            })
        );
        nightstand.position.set(1.3, 0.25, -1);
        nightstand.castShadow = true;
        scene.add(nightstand);
    }

    /**
     * Create bedside lamp
     */
    createBedsideLamp(scene) {
        const lampGroup = new THREE.Group();

        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.15, 0.3, 8),
            new THREE.MeshStandardMaterial({
                color: 0xff6b6b,
                roughness: 0.4
            })
        );
        base.position.y = 0.15;
        lampGroup.add(base);

        const shade = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffaa66,
                emissiveIntensity: 0.3
            })
        );
        shade.position.y = 0.35;
        lampGroup.add(shade);

        lampGroup.position.set(1.3, 0.5, -1);
        scene.add(lampGroup);
    }

    /**
     * Create kitchen counter
     */
    createKitchenCounter(scene) {
        const counterGroup = new THREE.Group();

        // Counter base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.9, 0.8),
            new THREE.MeshStandardMaterial({
                color: 0x2d2d2d,
                roughness: 0.5
            })
        );
        base.position.y = 0.45;
        base.castShadow = true;
        counterGroup.add(base);

        // Countertop
        const top = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 0.05, 1),
            new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                roughness: 0.2,
                metalness: 0.5
            })
        );
        top.position.y = 0.925;
        top.castShadow = true;
        counterGroup.add(top);

        counterGroup.position.set(-1, 0, -2.5);
        scene.add(counterGroup);
    }

    /**
     * Create kitchen island
     */
    createKitchenIsland(scene) {
        const island = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.9, 0.8),
            new THREE.MeshStandardMaterial({
                color: 0x3d3d3d,
                roughness: 0.6
            })
        );
        island.position.set(1, 0.45, -1);
        island.castShadow = true;
        scene.add(island);
    }

    /**
     * Create office desk
     */
    createDesk(scene) {
        const deskGroup = new THREE.Group();

        // Desk top
        const top = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.05, 1),
            new THREE.MeshStandardMaterial({
                color: 0x3d3d3d,
                roughness: 0.3
            })
        );
        top.position.y = 0.75;
        top.castShadow = true;
        deskGroup.add(top);

        // Legs
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.4,
            metalness: 0.8
        });
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 8);

        const positions = [
            [-0.9, 0.375, 0.4],
            [0.9, 0.375, 0.4],
            [-0.9, 0.375, -0.4],
            [0.9, 0.375, -0.4]
        ];

        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeo, legMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            deskGroup.add(leg);
        });

        deskGroup.position.set(0, 0, 0.5);
        scene.add(deskGroup);
    }

    /**
     * Create office chair
     */
    createOfficeChair(scene) {
        const chairGroup = new THREE.Group();

        // Seat
        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.1, 0.5),
            new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                roughness: 0.7
            })
        );
        seat.position.y = 0.5;
        seat.castShadow = true;
        chairGroup.add(seat);

        // Backrest
        const backrest = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.6, 0.1),
            new THREE.MeshStandardMaterial({
                color: 0xff6b6b,
                roughness: 0.5
            })
        );
        backrest.position.set(0, 0.85, -0.2);
        backrest.rotation.x = 0.1;
        backrest.castShadow = true;
        chairGroup.add(backrest);

        // Base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.4, 0.05, 5),
            new THREE.MeshStandardMaterial({
                color: 0x2d2d2d,
                roughness: 0.4
            })
        );
        base.position.y = 0.05;
        chairGroup.add(base);

        // Pole
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8),
            new THREE.MeshStandardMaterial({
                color: 0x1a1a1a
            })
        );
        pole.position.y = 0.25;
        chairGroup.add(pole);

        chairGroup.position.set(0, 0, 1.5);
        chairGroup.rotation.y = Math.PI;
        scene.add(chairGroup);
    }

    /**
     * Create bookshelf
     */
    createBookshelf(scene) {
        const shelfGroup = new THREE.Group();

        const shelfMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d2d2d,
            roughness: 0.6
        });

        // Frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.5, 0.3),
            shelfMaterial
        );
        frame.position.y = 0.75;
        frame.castShadow = true;
        shelfGroup.add(frame);

        // Shelves
        for (let i = 0; i < 4; i++) {
            const shelf = new THREE.Mesh(
                new THREE.BoxGeometry(0.7, 0.03, 0.25),
                shelfMaterial
            );
            shelf.position.y = 0.2 + i * 0.35;
            shelfGroup.add(shelf);
        }

        // Books (abstract)
        const bookColors = [0xff6b6b, 0x00b5b8, 0xffffff, 0x3d3d3d];
        for (let i = 0; i < 8; i++) {
            const book = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.2, 0.15),
                new THREE.MeshStandardMaterial({
                    color: bookColors[i % bookColors.length]
                })
            );
            book.position.set(-0.25 + (i % 4) * 0.15, 0.35 + Math.floor(i / 4) * 0.35, 0);
            shelfGroup.add(book);
        }

        shelfGroup.position.set(-2, 0, -2);
        scene.add(shelfGroup);
    }

    /**
     * Create abstract furniture for default/hero scene
     */
    createAbstractFurniture(scene) {
        // Floating geometric shapes
        const colors = [0xff6b6b, 0x00b5b8, 0xffffff];
        const geometries = [
            new THREE.TorusGeometry(0.3, 0.1, 16, 32),
            new THREE.OctahedronGeometry(0.3),
            new THREE.TorusKnotGeometry(0.2, 0.06, 64, 8)
        ];

        geometries.forEach((geo, i) => {
            const material = new THREE.MeshStandardMaterial({
                color: colors[i],
                roughness: 0.3,
                metalness: 0.7
            });
            const mesh = new THREE.Mesh(geo, material);
            mesh.position.set(
                (i - 1) * 0.8,
                0.5 + Math.sin(i) * 0.3,
                -0.5
            );
            mesh.castShadow = true;
            scene.add(mesh);
        });

        // Add some floating particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 50;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 8;
            positions[i + 1] = Math.random() * 4;
            positions[i + 2] = (Math.random() - 0.5) * 8;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff6b6b,
            size: 0.02,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
    }

    /**
     * Initialize all project scenes
     */
    initializeAllScenes() {
        // Hero scene with abstract furniture
        this.createScene('hero-scene', 'abstract');

        // Project scenes with specific room types
        this.createScene('scene-living-room', 'living-room');
        this.createScene('scene-bedroom', 'bedroom');
        this.createScene('scene-kitchen', 'kitchen');
        this.createScene('scene-office', 'office');
    }

    /**
     * Clean up a scene
     */
    disposeScene(containerId) {
        const sceneData = this.scenes.get(containerId);
        if (!sceneData) return;

        const { scene, renderer } = sceneData;

        // Dispose of all objects
        scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        renderer.dispose();
        renderer.domElement.remove();
        this.scenes.delete(containerId);
    }
}

// Export for use in main.js
window.SceneManager = SceneManager;
