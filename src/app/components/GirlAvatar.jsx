// --------------- SOLUTION 2: Alpha Hair Planes ---------------
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei'; // Need useTexture
import * as THREE from 'three';

// --- Configs ---
const COLORS = { /* ... Same ... */ };
const SIZES = { /* ... Body/Face Sizes similar ... */
  headRadius: 0.45, torsoHeight: 0.6, torsoRadius: 0.18, skirtHeight: 0.7,
  skirtTopRadius: 0.20, skirtBottomRadius: 0.5, neckHeight: 0.08, neckRadiusFactor: 0.65,
  eyeRadius: 0.06, eyePositionZ: 0.36, eyePositionX: 0.17, eyePositionY: 0.07,
  noseRadius: 0.045, nosePositionZ: 0.40, nosePositionY: -0.04, smileRadius: 0.16,
  smileCurveDepth: 0.06, smilePositionZ: 0.38, smilePositionY: -0.16, smileTubeRadius: 0.012,
  // --- Hair Plane Params ---
  hairPlaneCount: 80,    // Number of hair planes (cards)
  hairPlaneWidth: 0.4,   // Width of each plane
  hairPlaneHeight: 2.0, // *** Length/Height of each plane - Controls hair length ***
  hairPlaneWidthVariance: 0.1,
  hairPlaneHeightVariance: 0.5,
  hairPlacementRadius: 0.42, // Start slightly off the head surface
  hairPlacementVariance: 0.05,
  hairMaxY: 0.45, // Relative to head center
  hairMinY: 0.0,  // Start planes mostly on upper hemisphere
  hairTiltAngle: 0.8, // How much planes tilt outwards/downwards (radians)
  // --- Exclude face area ---
  hairExcludeThetaStart: -Math.PI / 2.3, // Wider exclusion needed for planes
  hairExcludeThetaEnd: Math.PI / 2.3,
};

// --- Placeholder Loader for Texture ---
function Loader() { return <mesh><boxGeometry args={[0.1,0.1,0.1]} /><meshBasicMaterial wireframe/></mesh>; }

// --- Hair Component (Alpha Plane Style) ---
function AlphaHair({ texturePath = "/textures/hair_alpha.png" }) { // Prop for texture path
    // Load the texture - Ensure Suspense is used higher up!
    const hairTexture = useTexture(texturePath);
    // Configure texture (optional but good practice)
    // hairTexture.wrapS = hairTexture.wrapT = THREE.RepeatWrapping;

    const hairMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        map: hairTexture,        // Color texture
        alphaMap: hairTexture,   // Alpha map (uses same texture)
        transparent: true,      // Enable transparency
        alphaTest: 0.3,         // Discard pixels below this alpha value (adjust!)
       // depthWrite: false,     // Alternative/addition to alphaTest - handles sorting issues sometimes
        side: THREE.DoubleSide, // Render both sides of the plane
        color: COLORS.hair,      // Tint the texture if it's grayscale/white
        roughness: 0.7,
        metalness: 0.1,
    }), [hairTexture]);

    // Generate positions, scales, rotations for hair planes
    const planes = useMemo(() => {
        const planeData = [];
        let attempts = 0;
        const maxAttempts = SIZES.hairPlaneCount * 5;

        while (planeData.length < SIZES.hairPlaneCount && attempts < maxAttempts) {
            attempts++;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(1 - 2 * Math.random());

            let normalizedTheta = theta > Math.PI ? theta - Math.PI * 2 : theta;
            if (normalizedTheta > SIZES.hairExcludeThetaStart && normalizedTheta < SIZES.hairExcludeThetaEnd) {
                if (Math.random() < 0.8) continue; // Skip most frontal
            }

            const placementRadius = SIZES.hairPlacementRadius + (Math.random() - 0.5) * 2 * SIZES.hairPlacementVariance;
            let x = placementRadius * Math.sin(phi) * Math.cos(theta);
            let y = placementRadius * Math.cos(phi);
            let z = placementRadius * Math.sin(phi) * Math.sin(theta);

            // Clamp Y start position higher up
             y = SIZES.hairMinY + Math.random() * (SIZES.hairMaxY - SIZES.hairMinY);
             // Recalculate radius based on new Y to keep it near the sphere surface
             const horizontalRadius = Math.sqrt(Math.max(0, SIZES.headRadius**2 - y**2)) * 1.05; // Slight offset outwards
             const currentTheta = Math.atan2(z, x); // Recalculate theta based on projection
             x = horizontalRadius * Math.cos(currentTheta);
             z = horizontalRadius * Math.sin(currentTheta);


            const height = SIZES.hairPlaneHeight + (Math.random() - 0.5) * 2 * SIZES.hairPlaneHeightVariance;
            const width = SIZES.hairPlaneWidth + (Math.random() - 0.5) * 2 * SIZES.hairPlaneWidthVariance;

             // Calculate rotation to orient the plane outwards/downwards
             const lookAtPoint = new THREE.Vector3(x, y, z).normalize().multiplyScalar(0.1); // Point slightly away from origin
             const rotationY = Math.atan2(x, z); // Align with radius direction
             const tiltX = -SIZES.hairTiltAngle + (Math.random() - 0.5) * 0.5; // Tilt downwards/outwards

             // Add some random twist
             const randomTwist = (Math.random() - 0.5) * 0.4;


            planeData.push({
                position: [x, y, z],
                scale: [width, height, 1],
                // Simple rotation: align Y with radius, tilt around X-axis relative to that
                rotation: [tiltX, rotationY + Math.PI/2, randomTwist], // Adjust rotation order/axes as needed
            });
        }
         console.log(`Generated ${planeData.length} hair planes.`);
        return planeData;
    }, []);

    // Use a single Plane geometry
    const planeGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1, 5), []); // Radius of 1, will be scaled, add segments for potential bending later

    return (
        <group name="alpha-hair-group">
            {planes.map((plane, index) => (
                 // We position the plane based on its center, adjust if texture expects top/bottom origin
                <mesh
                    key={index}
                    geometry={planeGeometry}
                    material={hairMaterial}
                    position={plane.position}
                    scale={plane.scale}
                    rotation={plane.rotation}
                    castShadow // Shadows might look odd with alpha, experiment
                />
            ))}
        </group>
    );
}

// --- Smile Component (Unchanged) ---
const SmileCurve = (props) => { /* ... Same ... */ };

// --- Main Model Component (Uses AlphaHair) ---
function GirlModel(props) {
    const groupRef = useRef();
    useFrame((state, delta) => { if (groupRef.current) { groupRef.current.rotation.y += delta * 0.3; }});

    // Materials, Body Geometries, Positions (Same as before)
    const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.skin, roughness: 0.7 }), []);
    /* ... other materials, geometries, positions setup ... */
    const dressTopMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.dressTop, roughness: 0.7 }), []);
    const dressBottomMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.dressBottom, roughness: 0.7 }), []);
    const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.eye, roughness: 0.4, metalness: 0.1 }), []);
    const headGeo = useMemo(() => new THREE.SphereGeometry(SIZES.headRadius, 32, 16), []);
    const torsoGeo = useMemo(() => new THREE.CylinderGeometry(SIZES.torsoRadius, SIZES.torsoRadius, SIZES.torsoHeight, 32), []);
    const skirtGeo = useMemo(() => new THREE.CylinderGeometry(SIZES.skirtTopRadius, SIZES.skirtBottomRadius, SIZES.skirtHeight, 32), []);
    const neckGeo = useMemo(() => new THREE.CylinderGeometry(SIZES.torsoRadius * SIZES.neckRadiusFactor, SIZES.torsoRadius * SIZES.neckRadiusFactor, SIZES.neckHeight, 16), []);
    const eyeGeo = useMemo(() => new THREE.SphereGeometry(SIZES.eyeRadius, 12, 8), []);
    const noseGeo = useMemo(() => new THREE.SphereGeometry(SIZES.noseRadius, 8, 6), []);
    const skirtY = SIZES.skirtHeight / 2; const torsoY = SIZES.skirtHeight + SIZES.torsoHeight / 2;
    const neckY = SIZES.skirtHeight + SIZES.torsoHeight + SIZES.neckHeight / 2;
    const headY = SIZES.skirtHeight + SIZES.torsoHeight + SIZES.neckHeight + SIZES.headRadius;


    return (
        <group ref={groupRef} {...props} dispose={null}>
            {/* Body Meshes */}
             <mesh geometry={skirtGeo} material={dressBottomMaterial} position={[0, skirtY, 0]} castShadow receiveShadow />
            <mesh geometry={torsoGeo} material={dressTopMaterial} position={[0, torsoY, 0]} castShadow receiveShadow/>
            <mesh geometry={neckGeo} material={skinMaterial} position={[0, neckY, 0]} castShadow />

            {/* Head Group */}
            <group position={[0, headY, 0]} name="head-group">
                <mesh geometry={headGeo} material={skinMaterial} castShadow name="head-sphere" />
                {/* Facial Features */}
                 <mesh geometry={eyeGeo} material={eyeMaterial} position={[SIZES.eyePositionX, SIZES.eyePositionY, SIZES.eyePositionZ]} />
                <mesh geometry={eyeGeo} material={eyeMaterial} position={[-SIZES.eyePositionX, SIZES.eyePositionY, SIZES.eyePositionZ]} />
                <mesh geometry={noseGeo} material={skinMaterial} position={[0, SIZES.nosePositionY, SIZES.nosePositionZ]} />
                <SmileCurve curveRadius={SIZES.smileRadius} depth={SIZES.smileCurveDepth} tubeRadius={SIZES.smileTubeRadius} positionY={SIZES.smilePositionY} positionZ={SIZES.smilePositionZ} />

                {/* *** Use Alpha Hair *** */}
                 {/* Make sure texture is loading via Suspense */}
                <AlphaHair texturePath="/textures/hair_alpha.png"/>
            </group>
        </group>
    );
}


// --- Main Canvas Component (Needs Suspense for useTexture) ---
export default function GirlAvatar() { /* ... Same Canvas setup ... */
    const modelHeight = SIZES.skirtHeight + SIZES.torsoHeight + SIZES.neckHeight + SIZES.headRadius * 2;
    const cameraTargetY = modelHeight * 0.55;
     return (
        <Canvas shadows camera={{ position: [0, cameraTargetY, 5.0], fov: 45 }} style={{ background: '#f0f0f0', height: '600px', width: '100%' }} gl={{ antialias: true }} pixelRatio={window.devicePixelRatio} >
             <ambientLight intensity={0.6} />
             <directionalLight position={[6, 10, 8]} intensity={1.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} /* ...shadow props... */ />
             <directionalLight position={[-6, 4, -8]} intensity={0.3} />
             {/* *** Add Suspense for Texture Loading *** */}
             <Suspense fallback={<Loader />}>
                <GirlModel position={[0, 0, 0]} />
             </Suspense>
             <OrbitControls enableZoom={true} enablePan={true} target={[0, cameraTargetY, 0]} minDistance={2} maxDistance={15} />
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow> <planeGeometry args={[20, 20]} /> <meshStandardMaterial color="#cccccc" side={THREE.DoubleSide} /> </mesh>
        </Canvas>
    );
}   