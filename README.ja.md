# input-voice

音声入力を行えるWebコンポーネントです。録音した音声の再生、ダウンロード、アップロードが簡単に行えます。

## デモ
[デモページ](https://code4fukui.github.io/input-voice/)で使用例を確認できます。

## 機能
- 音声の録音
- 録音した音声の再生
- 録音した音声のダウンロード

## 使い方
HTMLに以下のように`<input-voice>`タグを追加するだけで使えます:

```html
<script type="module" src="https://code4fukui.github.io/input-voice/input-voice.js"></script>
<input-voice id="inputVoice" max-length=5></input-voice>
```

録音時間の上限は`max-length`属性で指定できます（単位は秒）。

## ライセンス
MIT License