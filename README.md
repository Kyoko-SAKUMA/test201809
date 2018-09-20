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
3. キーを離すとマリオは止まります  
アニメーションが不自然にならないようアニメーションが一巡するまでは移動を行うため、キーを離してから止まるまでに若干のタイムラグが発生する場合があります

#### `test2.js`について
* jQueryが必要です
* 動かす要素に対して以下のように設定すると、左右キー押下により親要素の範囲内で左右に動かすことができます

```
<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/test2.js"></script>
<script>
$(function() {
  $(element).moveWithAnimation();
});
</script>
```

* 動かす要素のstyleに`position: absolute`、動かす要素の親要素のstyleに`position: relative`が自動で指定されます
* オプション（以下に記載）で画像パスを指定することでアニメーションを行うことができますが、動かす要素は`img`タグである必要があります

|項目|型|デフォルト値|説明|
|:-|:-|:-|:-|
|images|object|{}|アニメーション用画像パス<br>左向きの画像は'left'をキーとした配列、<br>右向きの画像は'right'をキーとした配列を入れます<br>片方しか指定していない場合、指定した側の画像パスを左右両方で使用してアニメーションを行います|
|movingPxPerSecond|int|250|移動秒速（単位：px）|
|animationSpeedMsec|int|100|アニメーション速度（単位：ミリ秒）|
