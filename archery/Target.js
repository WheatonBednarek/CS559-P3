import * as THREE from 'three';
import { WorldObject } from "../WorldObject.js";

export class Target extends WorldObject {
	constructor() {
		super();
		this.object = new THREE.Group();

		// the back stand of the target
		const baseColor = '#67322a';
		const baseMaterial = new THREE.MeshBasicMaterial({ color: baseColor });
		const stand = new THREE.Mesh(
			new THREE.BoxGeometry(.1, .7, .1),
			baseMaterial
		);
		stand.translateX(-.2);
		this.object.add(stand);
		const stand2 = stand.clone();
		stand2.translateX(.4);
		this.object.add(stand2);

		// the actual target board
		// const targetMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
		const colors = [
		    new THREE.Color("#f1e31f"),
		    new THREE.Color("#f1e31f"),
		    new THREE.Color("#ff0000"),
		    new THREE.Color("#ff0000"),
		    new THREE.Color("#00bfff"),
		    new THREE.Color("#00bfff"),
		    new THREE.Color("#121212"),
		    new THREE.Color("#121212"),
		    new THREE.Color("#ece4e4"),
		    new THREE.Color("#ece4e4")
		];
		const targetMaterial = new THREE.ShaderMaterial({
			uniforms: {
                colors: { value: colors },
				base: { value: new THREE.Color(baseColor)},
				ring: { value: new THREE.Color('#acacac')}
			},
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				varying vec2 vUv;
				uniform vec3 colors[10];
				uniform vec3 base;
				uniform vec3 ring;
				const float ringSize = 0.1;
				const float outerRadius = 0.45;
				
				void main() {
					float distance = length(vUv - vec2(0.5, 0.5));
					vec3 color;
					if(distance < outerRadius) {
						float progress = distance / .45;
						int index = int(floor(progress * 10.0));

						float offset = fract(progress * 10.0 - floor(progress * 10.0));

						// inner rings
						float edge = fwidth(offset) * 1.5;
						float ringMask = 1.0 - smoothstep(ringSize - edge, ringSize + edge, offset);
						color = mix(colors[index], ring, ringMask);

						// the outer edge mix
						float outerEdge = fwidth(distance)*1.5;
						float outerMask = smoothstep(outerRadius - outerEdge, outerRadius + outerEdge, distance);
        				color = mix(color, base, outerMask);
					} else {
						color = base;
					}
					gl_FragColor = vec4(pow(color, vec3(1.0/2.2)), 1.0);
				}
			`
		});
		// so that every side isn't a target
		const materials = [
			baseMaterial,
			baseMaterial,
			baseMaterial,
			baseMaterial,
			targetMaterial,
			baseMaterial
		]
		const target = new THREE.Mesh(
			new THREE.BoxGeometry(.5, .5, .15),
			materials
		);
		target.translateY(.1);
		this.object.add(target);
	}
}