# input-voice

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A custom HTML element that allows users to record audio input from their microphone and provides options to play, download, and upload the recorded audio.

## Demo
You can find a demo of the `<input-voice>` element in the [index.html file](index.html) of this repository.

## Features
- Records audio input from the user's microphone
- Allows setting a maximum recording length
- Provides buttons to start/stop recording, play the recorded audio, and download the audio as a WAV file
- Emits an `onchange` event when the recorded audio changes
- Exposes the recorded audio as a Blob object

## Usage
To use the `<input-voice>` element, include the `input-voice.js` script in your HTML file:

```html
<script type="module" src="https://code4fukui.github.io/input-voice/input-voice.js"></script>
```

Then, add the `<input-voice>` element to your HTML, and optionally, set the `max-length` attribute to specify the maximum recording length in seconds:

```html
<input-voice id="inputVoice" max-length=5></input-voice>
```

You can access the recorded audio by listening to the `onchange` event or by accessing the `value` property of the `<input-voice>` element:

```javascript
const inputVoice = document.getElementById('inputVoice');
inputVoice.onchange = () => {
  const audioBlob = inputVoice.value;
  // Use the recorded audio Blob
};
```

## License
MIT License — see [LICENSE](LICENSE).