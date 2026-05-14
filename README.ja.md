# input-voice

マイクから音声を録音するためのシンプルなユーザーインターフェースを提供するカスタムHTML要素（`<input-voice>`）です。

コンポーネントは録音、再生、ダウンロードのボタンを表示します。

## デモ

*   **ライブデモ:** [code4fukui.github.io/input-voice/](https://code4fukui.github.io/input-voice/)
*   **ローカルデモ:** [index.html](index.html)

## 機能

*   **シンプルなインターフェース:** 録音/停止、再生/停止、およびダウンロードボタンを提供します。
*   **マイク録音:** ユーザーのマイクから音声をキャプチャします（ブラウザの許可が必要です）。
*   **音声再生:** 録音した音声を直接再生できます。
*   **WAVダウンロード:** 録音データを `.wav` ファイルとしてダウンロードできます。
*   **データアクセス:** 録音した音声を `Blob` オブジェクトとして公開し、JavaScriptで簡単に利用できます。
*   **録音時間の設定:** `max-length` 属性を使用して最大録音時間を設定できます。

## 使い方

1.  **スクリプトの読み込み:** JavaScriptモジュールをHTMLファイルに追加します。
2.  **要素の追加:** `<input-voice>` タグをHTMLに配置します。
3.  **変更の監視:** 録音終了後に音声データを取得するため、`onchange` イベントを使用します。

```html
<!DOCTYPE html>
<html>
<head>
  <title>input-voice demo</title>
  <!-- 1. スクリプトの読み込み -->
  <script type="module" src="https://code4fukui.github.io/input-voice/input-voice.js"></script>
</head>
<body>

  <!-- 2. 要素の追加 -->
  <input-voice id="voiceRecorder" max-length="5"></input-voice>

  <script type="module">
    const voiceRecorder = document.getElementById('voiceRecorder');

    // 3. 'onchange' イベントの監視
    voiceRecorder.onchange = () => {
      // 録音された音声は .value プロパティから Blob として取得できます
      const audioBlob = voiceRecorder.value;
      console.log('Recording finished. Blob:', audioBlob);

      // 取得した Blob は、アップロードや他の場所での再生などに利用できます。
    };
  </script>

</body>
</html>
```

## APIリファレンス

### 属性

*   `max-length`
    *   **説明:** 最大録音時間（秒単位）。
    *   **型:** `Number`
    *   **デフォルト:** `10`

### プロパティ

*   `.value`
    *   **説明:** 録音された音声データ。録音が行われるまでは `null` です。
    *   **型:** `Blob | null`

### イベント

*   `onchange`
    *   **説明:** 録音が停止し、`.value` プロパティが新しい音声 `Blob` で更新されたときに発生します。

## ライセンス

MIT License — [LICENSE](LICENSE) を参照してください。
