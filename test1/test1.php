<?php
/**
 * Googleスプレッドシートデータ抽出
 *
 * 条件等はsetting.phpにて設定
 */
require_once('setting.php');

try {
	$ch = curl_init(sprintf('https://sheets.googleapis.com/v4/spreadsheets/%s/values/%s!%s?key=%s', SHEET_ID, SHEET_NAME, SHEET_RANGE, API_KEY));
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER	=> true,
		CURLOPT_TIMEOUT			=> TIMEOUT,
	]);

	$json = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$errorNo = curl_errno($ch);
	$error = curl_error($ch);
	curl_close($ch);

	if (CURLE_OK !== $errorNo) {
		throw new RuntimeException($error, $errorNo);
	}

	$res = json_decode($json, true);
	if (200 !== $httpCode) {
		$msg = $res['error']['message'] ?? 'URLが存在しません。';
		throw new Exception('[error] ' . $msg);
	}
	if (!isset($res['values'])) {
		throw new Exception('[error] レスポンスが不正です。');
	}

	preg_match('/^([A-Z]+)([0-9]+)\:([A-Z]+)([0-9]+)$/', strtoupper(SHEET_RANGE), $matched);
	$columnNum = abs(convertColumnStrToNum($matched[3]) - convertColumnStrToNum($matched[1])) + 1;
	$rowNum = abs($matched[4] - $matched[2]) + 1;
	
	$output_array = [];
	for ($r = 0; $r < $rowNum; $r++) {
		$output_line = '';
		for ($c = 0; $c < $columnNum; $c++) {
			$output_line .= sprintf('%s%s%s%s', QUOTE, $res['values'][$r][$c] ?? '', QUOTE, DELIMITER);
		}
		$output_array[] = $output_line;
	}
	
	$echoStr = implode(EOL, $output_array);
	$encoding = mb_internal_encoding();
	if (ENCODING !== $encoding) {
		$echoStr = mb_convert_encoding($echoStr, ENCODING, $encoding);
	}
	echo $echoStr;
} catch (Exception $e) {
	echo $e->getMessage() . PHP_EOL;
	exit(1);
}


/**
 * 列のアルファベットを数値に変換
 *
 * @param string $columnStr 列（アルファベット表記）
 * @return int 列（数値）
 */
function convertColumnStrToNum(string $columnStr): int
{
	$reversedColumnStr = strrev(strtoupper($columnStr));
	$strlen = strlen($reversedColumnStr);
	$columnNum = 0;

	// 反転した文字を1文字ずつ配列として処理
	for ($i = 0; $i < $strlen; $i++) {
		// ASCII値から64を減算（アルファベットのASCII値は65～90）
		// 26進数なので26の累乗をかける
		$columnNum += (ord($reversedColumnStr[$i]) - 64) * pow(26, $i);
	}
	return $columnNum;
}
