import {loadGLTF, loadAudio} from "./libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/targets/targetsWolf.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const gltf = await loadGLTF('./assets/Raptor_Animated_FBX_5K_Green.glb');
    gltf.scene.scale.set(0.8, 0.8, 0.8);
    gltf.scene.position.set(0, -0.4, 0);
	gltf.scene.rotation.set(0, Math.PI, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene);
	
	const audioClip = await loadAudio('./assets/RaptorRoar3.wav');

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const audio = new THREE.PositionalAudio(listener);
    anchor.group.add(audio);
	
	audio.setBuffer(audioClip);
    audio.setRefDistance(800);
    audio.setLoop(true);
	
	anchor.onTargetFound = () => {
      audio.play();
    }
    anchor.onTargetLost = () => {
      audio.pause();
    }

    const mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
	//const mixer1 = new THREE.AnimationMixer(gltf.scene);
	//const action1 = mixer.clipAction(gltf.animations[1]);
	//const action1 = mixer.clipAction(gltf.animations[1]);
    action.play();
	//action1.play();
	//action1.play();

    const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      //gltf.scene.rotation.set(0, gltf.scene.rotation.y+delta, 0);
      mixer.update(delta);
	  //const delta1 = clock.getDelta();
	  //mixer1.update(delta + 200);
      renderer.render(scene, camera);
    });
  }
  start();
});
