<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Results } from '@mediapipe/hands';
	import drawingUtils from '@mediapipe/drawing_utils';
	import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';

	let canvas: HTMLCanvasElement;
	let canvasCtx: CanvasRenderingContext2D;
	let hands: Hands;
	let video: HTMLVideoElement;
	let requestId: number;

	let videoWidth = 640;
	let videoHeight = 480;

	function setDimensions() {
		videoWidth = video.videoWidth;
		videoHeight = video.videoHeight;

		canvas.width = videoWidth;
		canvas.height = videoHeight;
	}

	async function loop() {
		await hands.send({
			image: video
		});
		requestId = video.requestVideoFrameCallback(loop);
	}

	function startWebCam() {
		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((stream) => {
					video.srcObject = stream;
					video.addEventListener('loadedmetadata', setDimensions);
					video.requestVideoFrameCallback(loop);
				})
				.catch((error) => console.warn(error));
		}
	}

	function onResults(results: Results): void {
		canvasCtx.save();
		canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
		if (results.multiHandLandmarks && results.multiHandedness) {
			for (let index = 0; index < results.multiHandLandmarks.length; index++) {
				const landmarks = results.multiHandLandmarks[index];

				drawingUtils.drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
					color: '#EFE7F9'
				});

				drawingUtils.drawLandmarks(canvasCtx, landmarks, {
					color: '#EFE7F9',
					fillColor: '#7000FF',
					radius: (data: drawingUtils.Data) => {
						return drawingUtils.lerp(data.from!.z!, -0.15, 0.1, 10, 1);
					}
				});
			}
		}
		canvasCtx.restore();

		// if (results.multiHandWorldLandmarks) {
		// 	const landmarks = results.multiHandWorldLandmarks.reduce(
		// 		(prev, current) => [...prev, ...current],
		// 		[]
		// 	);
		// 	const colors = [];
		// 	let connections: mpHands.LandmarkConnectionArray = [];
		// 	for (let loop = 0; loop < results.multiHandWorldLandmarks.length; ++loop) {
		// 		const offset = loop * mpHands.HAND_CONNECTIONS.length;
		// 		const offsetConnections = mpHands.HAND_CONNECTIONS.map((connection) => [
		// 			connection[0] + offset,
		// 			connection[1] + offset
		// 		]) as mpHands.LandmarkConnectionArray;
		// 		connections = connections.concat(offsetConnections);
		// 		const classification = results.multiHandedness[loop];

		// 		chart.draw([
		// 			calcAngle(
		// 				results.multiHandWorldLandmarks[loop][0],
		// 				results.multiHandWorldLandmarks[loop][5],
		// 				results.multiHandWorldLandmarks[loop][6]
		// 			),
		// 			calcAngle(
		// 				results.multiHandWorldLandmarks[loop][5],
		// 				results.multiHandWorldLandmarks[loop][6],
		// 				results.multiHandWorldLandmarks[loop][7]
		// 			),
		// 			calcAngle(
		// 				results.multiHandWorldLandmarks[loop][9],
		// 				results.multiHandWorldLandmarks[loop][5],
		// 				results.multiHandWorldLandmarks[loop][6]
		// 			)
		// 		]);

		// 		colors.push({
		// 			list: offsetConnections.map((_unused, i) => i + offset),
		// 			color: classification.label
		// 		});
		// 	}
		// 	grid.updateLandmarks(landmarks, connections, colors);
		// } else {
		// 	grid.updateLandmarks([]);
		// }
	}

	onMount(() => {
		canvasCtx = canvas.getContext('2d')!;
		hands = new Hands();

		hands.setOptions({
			selfieMode: true,
			maxNumHands: 1,
			modelComplexity: 1,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5
		});

		hands.onResults(onResults);

		startWebCam();
	});

	onDestroy(() => {
		if (requestId !== undefined) {
			video.cancelVideoFrameCallback(requestId);
		}
		if (video) {
			const stream = video.srcObject;
			//@ts-ignore
			const tracks = stream.getTracks();
			tracks.forEach((track: any) => track.stop());
			video.srcObject = null;
		}
	});
</script>

<svelte:head>
	<title>Распознавание действий</title>
</svelte:head>

<canvas
	bind:this={canvas}
	width={videoWidth}
	height={videoHeight}
	style="--video-width: {videoWidth}px; --video-height: {videoHeight}px"
/>
<!-- svelte-ignore a11y-media-has-caption -->
<video bind:this={video} autoplay />

<style lang="scss">
	canvas {
		background: var(--primary-low-contrast-2);
		display: block;
		border-radius: 16px;
		height: 100%;
		width: 100%;
		max-height: var(--video-width);
		max-width: var(--video-height);
	}
	video {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
