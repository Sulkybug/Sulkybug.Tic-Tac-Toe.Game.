export default function playSound(audioName) {
  let audio = new Audio(audioName);
  audio.play();
  audio.volume = 0.4;
}
