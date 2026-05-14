# input-voice

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A custom HTML element (`<input-voice>`) that provides a simple user interface for recording audio from a microphone.

The component displays buttons to record, play, and download the audio.

## Demo

*   **Live Demo:** [code4fukui.github.io/input-voice/](https://code4fukui.github.io/input-voice/)
*   **Local Demo:** [index.html](index.html)

## Features

*   **Simple Interface:** Provides Record/Stop, Play/Stop, and Download buttons.
*   **Microphone Recording:** Captures audio from the user's microphone (requires browser permission).
*   **Audio Playback:** Allows the recorded audio to be played back directly.
*   **WAV Download:** Lets users download their recording as a `.wav` file.
*   **Data Access:** Exposes the recorded audio as a `Blob` object for easy use with JavaScript.
*   **Configurable Length:** Set a maximum recording duration using the `max-length` attribute.

## Usage

1.  **Include the script:** Add the JavaScript module to your HTML file.
2.  **Add the element:** Place the `<input-voice>` tag in your HTML.
3.  **Listen for changes:** Use the `onchange` event to get the audio data after a recording is finished.

```html
<!DOCTYPE html>
<html>
<head>
  <title>input-voice demo</title>
  <!-- 1. Include the script -->
  <script type="module" src="https://code4fukui.github.io/input-voice/input-voice.js"></script>
</head>
<body>

  <!-- 2. Add the element -->
  <input-voice id="voiceRecorder" max-length="5"></input-voice>

  <script type="module">
    const voiceRecorder = document.getElementById('voiceRecorder');

    // 3. Listen for the 'onchange' event
    voiceRecorder.onchange = () => {
      // The recorded audio is available as a Blob in the .value property
      const audioBlob = voiceRecorder.value;
      console.log('Recording finished. Blob:', audioBlob);

      // You can now use the Blob, for example, to upload it or play it elsewhere.
    };
  </script>

</body>
</html>
```

## API Reference

### Attributes

*   `max-length`
    *   **Description:** The maximum recording duration in seconds.
    *   **Type:** `Number`
    *   **Default:** `10`

### Properties

*   `.value`
    *   **Description:** The recorded audio data. It is `null` until a recording is made.
    *   **Type:** `Blob | null`

### Events

*   `onchange`
    *   **Description:** Fires when a recording is stopped and the `.value` property has been updated with the new audio `Blob`.

## License

MIT License — see [LICENSE](LICENSE).