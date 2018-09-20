# test201809
第2回PGテスト用  

### 問1（test1ディレクトリ内）
* 動作確認：PHP 7.2.4
* CONSUMER KEYはsetting.phpで設定してください
* `php test1.php`で実行できます

### 問2（test2ディレクトリ内）
* 動作確認：Windows10 Google Chrome最新版

#### 確認方法
1. test2.htmlをブラウザで開きます
2. 左キー押下で左に、右キー押下で右にマリオが移動します

#### `test2.js`の設定
|項目|型|デフォルト値|説明|
|:-|:-|:-|:-|
|images|object|{}|アニメーション用画像パス<br>左向きの画像は'left'をキーとした配列、<br>右向きの画像は'right'をキーとした配列を入れる|
|movingPxPerSecond|int|250|移動秒速（単位：px）|
|animationSpeedMsec|int|100|アニメーション速度（単位：ミリ秒）|
