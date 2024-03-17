const { SkyWayStreamFactory } = skyway_room;

let localVideoRatio = 0.75;
let remoteVideoRatio = 0.75;
const footerHeight = 100;

const resize = () => {
  const localVideo = document.getElementById('local-video');
  const remoteVideo = document.getElementById('remote-video');

  const px = 5;

  localVideo.style.position = 'absolute';
  const newLocalWidth = window.innerWidth / 2 - 6 * px;
  const newLocalHeight = localVideoRatio * newLocalWidth;
  localVideo.style.width = newLocalWidth;
  localVideo.style.height = newLocalHeight;
  localVideo.style.top = (window.innerHeight - footerHeight) / 2 - newLocalHeight / 2
  localVideo.style.left = window.innerWidth / 2 - newLocalWidth - px;

  remoteVideo.style.position = 'absolute';
  const newRemoteWidth = window.innerWidth / 2 - 6 * px;
  const newRemoteHeight = remoteVideoRatio * newRemoteWidth;
  remoteVideo.style.width = newRemoteWidth;
  remoteVideo.style.height = newRemoteHeight;
  remoteVideo.style.top = (window.innerHeight - footerHeight) / 2 - newRemoteHeight / 2
  remoteVideo.style.left = window.innerWidth / 2 + px;
}
resize();

(async () => {
  const footer = document.getElementById('footer');
  footer.style.height = footerHeight;

  // 宣言・初期値の代入
  const localAudio = document.getElementById('local-audio');
  const localVideo = document.getElementById('local-video');

  // STEP2: 自分自身のカメラとマイクを取得して描画
  const { audio, video } = await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
  audio.attach(localAudio);
  localVideo.remove();
  const videoElement = document.createElement('video');
  videoElement.id = 'local-video';
  video.attach(videoElement);
  videoElement.play();
  const videoSettings = video.track.getSettings();
  localVideoRatio = videoSettings.height / videoSettings.width;
  document.body.append(videoElement);

  resize();
  window.onresize = resize;
})();

const audioMuteButton = document.getElementById('mute-audio-button');
let audioMuteButtonImg = document.getElementById('mute-audio-img');
let audioMuteButtonText = document.getElementById('mute-audio-text');
audioMuteButton.onclick = () => {
  if (audioMuteButtonImg.src.endsWith('mic_on.png')) {
    audioMuteButtonImg.src = 'mic_off.png';
    audioMuteButtonText.innerText = 'ミュート解除';
  } else {
    audioMuteButtonImg.src = 'mic_on.png';
    audioMuteButtonText.innerText = 'ミュート';
  }
}

const videoMuteButton = document.getElementById('mute-video-button');
let videoMuteButtonImg = document.getElementById('mute-video-img');
let videoMuteButtonText = document.getElementById('mute-video-text');
videoMuteButton.onclick = () => {
  if (videoMuteButtonImg.src.endsWith('video_on.png')) {
    const localVideo = document.getElementById('local-video');
    const tracks = localVideo.srcObject.getTracks();
    tracks.forEach(element => {
      element.stop();
    });
    localVideo.remove();
    const imgElement = document.createElement('img');
    imgElement.id = 'local-video';
    imgElement.src = '0.png';
    localVideoRatio = 0.75;
    document.body.append(imgElement);
    resize();
    videoMuteButtonImg.src = 'video_off.png';
    videoMuteButtonText.innerText = 'ビデオの開始';
  } else {
    const localVideo = document.getElementById('local-video');
    SkyWayStreamFactory.createCameraVideoStream().then((video) => {
      localVideo.remove();
      const videoElement = document.createElement('video');
      videoElement.id = 'local-video';
      video.attach(videoElement);
      videoElement.play();
      const videoSettings = video.track.getSettings();
      localVideoRatio = videoSettings.height / videoSettings.width;
      document.body.append(videoElement);
      resize();
    });

    videoMuteButtonImg.src = 'video_on.png';
    videoMuteButtonText.innerText = 'ビデオの停止';
  }
}