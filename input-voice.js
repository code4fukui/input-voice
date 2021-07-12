// audio

let audioContext = null;
let audioStream = null;

// audio data
let audioData = [];
const bufferSize = 1024;
let audio_sample_rate = 0;

const startAudio = async () => {
  audioData = []
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  audioStream = stream
  window.AudioContext = window.webkitAudioContext || window.AudioContext
  audioContext = new AudioContext()
  audio_sample_rate = audioContext.sampleRate; // 44100 on Mac
  const scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1)
  const mediastreamsource = audioContext.createMediaStreamSource(stream)
  mediastreamsource.connect(scriptProcessor);
  scriptProcessor.onaudioprocess = (e) => {
    const input = e.inputBuffer.getChannelData(0);
    const bufferData = new Float32Array(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
      bufferData[i] = input[i];
    }
    audioData.push(bufferData);
  }
  scriptProcessor.connect(audioContext.destination);
};

const stopAudio = async () => {
  if (!audioContext)
    return;
  await audioContext.close()
  audioContext = null
  audioStream.getTracks().forEach(t => t.stop())
  audioStream = null
  return getBlobWAV();
};
const download = (blob, filename) => {
  const bloblink = URL.createObjectURL(blob);
  const download = document.createElement("a");
  download.href = bloblink;
  download.download = filename;
  download.click();
  download.remove();
};

// export WAV from audio float data
const getBlobWAV = () => {
  const encodeWAV = (samples, sampleRate) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2)
    const view = new DataView(buffer)
    const writeString = function(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }
    const floatTo16BitPCM = function (output, offset, input) {
      for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]))
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
      }
    }
    writeString(view, 0, 'RIFF')  // RIFF
    view.setUint32(4, 32 + samples.length * 2, true) // file size
    writeString(view, 8, 'WAVE') // WAVE
    writeString(view, 12, 'fmt ') // fmt chunk
    view.setUint32(16, 16, true) // size of fmt chknk
    view.setUint16(20, 1, true) // format ID
    view.setUint16(22, 1, true) // n channels
    view.setUint32(24, sampleRate, true) // sampling rate
    view.setUint32(28, sampleRate * 2, true) // byte per sec
    view.setUint16(32, 2, true) // size of block
    view.setUint16(34, 16, true) // bit per sample
    writeString(view, 36, 'data') // data chunk
    view.setUint32(40, samples.length * 2, true) // size of wave
    floatTo16BitPCM(view, 44, samples) // wave data
    return view
  }
  const mergeBuffers = (audioData) => {
    let sampleLength = 0;
    for (let i = 0; i < audioData.length; i++) {
      sampleLength += audioData[i].length;
    }
    const samples = new Float32Array(sampleLength);
    let sampleIdx = 0;
    for (let i = 0; i < audioData.length; i++) {
      for (let j = 0; j < audioData[i].length; j++) {
        samples[sampleIdx++] = audioData[i][j];
      }
    }
    return samples;
  }
  const dataview = encodeWAV(mergeBuffers(audioData), audio_sample_rate);
  const audioBlob = new Blob([dataview], { type: 'audio/wav' });
  //console.log(dataview)
  return audioBlob;
};

const uploadAudio = async (audioBlob, filename) => {
  for (;;) {
    try {
      const url = '/'
      const formdata = new FormData()
      formdata.append("file", audioBlob)
      if (filename)
        formdata.append("filename", filename)
      const res = await (await fetch(url, { method: 'POST', body: formdata })).json()
      console.log(res)
      if (res.res == 'ok') {
        return res.id
      }
     alert("upload error, retry? (" + res.res + ") tap to retry")
    } catch (e) {
      alert("upload error, retry? (" + e + ") tap to retry")
    }
  }
};

class InputVoice extends HTMLElement {
  constructor() {
    super();

    //this.style.display = "grid";
    //this.style.gridTemplateColumns = "1fr 1fr 1fr";
    this.style.display = "inline-block";
    this.style.border = "2px solid black";
    this.style.padding = ".4em";
    this.style.margin = ".2em";
    const cr = (tag, parent) => {
      const c = document.createElement(tag);
      //c.style.flex = "1";
      c.style.margin = ".2em";
      c.style.width = "8em";
      parent.appendChild(c);
      return c;
    };

    this.audioblob = null;

    const btn = cr("button", this);
    btn.textContent = "record";
    btn.onclick = async () => {
      const stop = async () => {
        btn.textContent = "record";
        this.recording = false;
        this.audioblob = await stopAudio();
        this.changed();
        clearTimeout(this.rect);
      };
      if (this.recording) {
        await stop();
      } else {
        btn.textContent = "stop";
        startAudio();
        this.recording = true;
        this.rect = setTimeout(async () => {
          if (this.recording) {
            await stop();
          }
        }, (this.getAttribute("max-length") || 10) * 1000);
      }
    };
    this.recording = false;

    const btnp = cr("button", this);
    btnp.textContent = "play";
    this.audio = null;
    btnp.onclick = async () => {
      if (!this.audioblob) {
        return;
      }
      if (this.playing) {
        btnp.textContent = "play";
        this.audio.pause();
        this.audio = null;
        this.playing = false;
      } else {
        btnp.textContent = "stop";
        this.audio = new Audio(URL.createObjectURL(this.audioblob));
        this.audio.play();
        this.audio.onended = () => {
          this.audio = null;
          this.playing = false;
          btnp.textContent = "play";
        };
        this.playing = true;
      }
    };
    this.playing = false;

    const btnd = cr("button", this);
    btnd.textContent = "download";
    btnd.onclick = () => {
      if (!this.audioblob) {
        return;
      }
      download(this.audioblob, "recorded.wav");
    };

  }
  changed() {
    if (this.onchange) {
      this.onchange();
    }
  }
  get value() {
    return this.audioblob;
  }
}

customElements.define("input-voice", InputVoice);

export { InputVoice };
