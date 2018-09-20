<?php
/**
 * Googleスプレッドシートデータ抽出設定
 */

// API設定
define('API_KEY', '');

// シート設定
define('SHEET_ID', '11BCnspCt2Mut3nhc4WMY6CYTd0zF9C3eCzsk1AEpKLM');
define('SHEET_NAME', 'sales');
define('SHEET_RANGE', 'A1:E6');

// タイムアウト時間（秒）
define('TIMEOUT', 5);

// 出力設定
define('ENCODING', 'UTF-8');
define('EOL', "\n");
define('QUOTE', '\'');
define('DELIMITER', ',');
