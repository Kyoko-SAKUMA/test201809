/**
 * 要素を左右に動かす＋画像を切り替えてアニメーションさせるプラグイン
 */
;(function($) {
	'use strict';

	let MoveWithAnimation = window.MoveWithAnimation || {};
	const MOVING_PX_PER_SECOND = 250;
	const ANIMATION_SPEED_SEC = 100;
	const DEFAULT_DIRECTION = 'right';

	MoveWithAnimation = (function() {
		var instanceId = 0;
		function MoveWithAnimation(e, options) {
			const SELF = this;
			SELF.settings = options;
			if ($(e).length && $(e).parent().length) {
				$(e).css('position', 'absolute');
				$(e).parent().css('position', 'relative');
				SELF.instanceId = instanceId++;
				SELF.settings['element'] = e;
				SELF.init();
			}
		}
		return MoveWithAnimation;
	}());
	
	/**
	 * 初期処理
	 */
	MoveWithAnimation.prototype.init = function() {
		const SELF = this;
		
		SELF.withAnimation = false;
		if ('undefined' !== typeof SELF.settings['images']) {
			if ('undefined' !== typeof SELF.settings['images']['left'] && 'undefined' !== typeof SELF.settings['images']['right']) {
				SELF.withAnimation = true;
			} else if ('undefined' !== typeof SELF.settings['images']['left']) {
				SELF.withAnimation = true;
				SELF.settings['images']['right'] = SELF.settings['images']['left'];
			} else if ('undefined' !== typeof SELF.settings['images']['right']) {
				SELF.withAnimation = true;
				SELF.settings['images']['left'] = SELF.settings['images']['right'];
			}
		}
		if ('undefined' === typeof SELF.settings['movingPxPerSecond'] || !SELF.isNaturalNumber(SELF.settings['movingPxPerSecond'])) {
			SELF.settings['movingPxPerSecond'] = MOVING_PX_PER_SECOND;
		}
		if ('undefined' === typeof SELF.settings['animationSpeedMsec'] || !SELF.isNaturalNumber(SELF.settings['animationSpeedMsec'])) {
			SELF.settings['animationSpeedMsec'] = ANIMATION_SPEED_SEC;
		}

		SELF.updateCharacterXPositionMax();
		SELF.setAnimationNo(1);
		SELF.setTimerId();
		SELF.setMoving(false);

		$(window).on('resize.moveWithAnimation-' + SELF.instanceId, function() {
			SELF.updateCharacterXPositionMax();
			const LEFT_MAX = SELF.getCharacterXPositionMax();
			if (SELF.getCharacterXPosition() > LEFT_MAX) {
				$(SELF.getElement()).css('left', LEFT_MAX + 'px');
			}
			if (true === SELF.isMoving()) {
				// 移動中の場合、再計算のため一瞬停止させる
				SELF.stopMoving(true);
			}
		});

		$(window).on('keydown.moveWithAnimation-' + SELF.instanceId, function(evt) {
			if ('' !== SELF.getTimerId() || true === SELF.isMoving()) {
				// 移動中は何もしない
				return true;
			}

			// 左右キー押下時のみ移動方向を設定
			switch (evt.key) {
				case 'Left':
				case 'ArrowLeft':
					SELF.setDirection('left');
					break;
				case 'Right':
				case 'ArrowRight':
					SELF.setDirection('right');
					break;
				default:
					return true;
			}

			SELF.startMoving();
		});

		$(window).on('keyup.moveWithAnimation-' + SELF.instanceId, function(evt) {
			const DIRECTION = SELF.getDirection();

			// 進行中の方向キーを離した場合に移動を止める
			switch (evt.key) {
				case 'Left':
				case 'ArrowLeft':
					if ('left' === DIRECTION) {
						SELF.stopMoving();
					}
					break;
				case 'Right':
				case 'ArrowRight':
					if ('right' === DIRECTION) {
						SELF.stopMoving();
					}
					break;
			}
		});
	};

	/**
	 * 操作対象要素取得
	 *
	 * @return {object} 操作対象要素
	 */
	MoveWithAnimation.prototype.getElement = function() {
		const SELF = this;
		return SELF.settings['element'];
	};

	/**
	 * タイマーID取得
	 *
	 * @return {int} タイマーID
	 */
	MoveWithAnimation.prototype.getTimerId = function() {
		const SELF = this;
		return $(SELF.getElement()).data('timerid');
	};

	/**
	 * タイマーID設定
	 *
	 * @param {int} timerId タイマーID
	 */
	MoveWithAnimation.prototype.setTimerId = function(timerId = '') {
		const SELF = this;
		$(SELF.getElement()).data('timerid', timerId);
	};

	/**
	 * 移動フラグ取得
	 *
	 * @return {bool} 移動中であればtrue
	 */
	MoveWithAnimation.prototype.isMoving = function() {
		const SELF = this;
		return (1 === $(SELF.getElement()).data('moving')) ? true : false;
	};

	/**
	 * 移動フラグ設定
	 *
	 * @param {bool} isMoving 移動中であればtrue
	 */
	MoveWithAnimation.prototype.setMoving = function(isMoving) {
		const SELF = this;
		$(SELF.getElement()).data('moving', (true === isMoving) ? 1 : 0);
	};

	/**
	 * キャラクターX座標を取得
	 *
	 * @return {int} X座標
	 */
	MoveWithAnimation.prototype.getCharacterXPosition = function() {
		const SELF = this;
		return parseInt($(SELF.getElement()).css('left').replace('px'), 10);
	};

	/**
	 * キャラクターX座標最大値を取得
	 *
	 * @return {int} X座標最大値
	 */
	MoveWithAnimation.prototype.getCharacterXPositionMax = function() {
		const SELF = this;
		return $(SELF.getElement()).data('xposmax');
	};

	/**
	 * キャラクターX座標最大値を更新
	 */
	MoveWithAnimation.prototype.updateCharacterXPositionMax = function() {
		const SELF = this;
		const ELEMENT = SELF.getElement();
		$(ELEMENT).data('xposmax', $(ELEMENT).parent().width() - $(ELEMENT).width());
	};

	/**
	 * キャラクター移動方向を取得
	 *
	 * @return {string} 移動方向
	 */
	MoveWithAnimation.prototype.getDirection = function() {
		const SELF = this;
		return $(SELF.getElement()).attr('data-direction');
	};

	/**
	 * キャラクター移動方向を設定
	 *
	 * @param {string} direction 移動方向
	 */
	MoveWithAnimation.prototype.setDirection = function(direction) {
		const SELF = this;
		switch (direction) {
			case 'left':
			case 'right':
				break;
			default:
				direction = DEFAULT_DIRECTION;
				break;
		}
		$(SELF.getElement()).attr('data-direction', direction);
		SELF.updateImagePath();
	};

	/**
	 * 自然数かどうかチェック
	 *
	 * @param {int} checkVal チェック値
	 * @param {bool} 自然数であればtrue
	 */
	MoveWithAnimation.prototype.isNaturalNumber = function(checkVal) {
		return (/^[1-9]{1}[0-9]*$/.test(checkVal)) ? true : false;
	};

	/**
	 * アニメーション番号を取得
	 *
	 * @return {int} アニメーション番号
	 */
	MoveWithAnimation.prototype.getAnimationNo = function() {
		const SELF = this;
		return parseInt($(SELF.getElement()).attr('data-animationno'), 10);
	};

	/**
	 * アニメーション番号を設定
	 *
	 * @param {int} animationNo アニメーション番号
	 */
	MoveWithAnimation.prototype.setAnimationNo = function(animationNo) {
		const SELF = this;
		if (!SELF.isNaturalNumber(animationNo)) {
			animationNo = 1;
		}
		$(SELF.getElement()).attr('data-animationno', animationNo);
		SELF.updateImagePath();
	};

	/**
	 * 画像パス更新
	 */
	MoveWithAnimation.prototype.updateImagePath = function() {
		const SELF = this;
		const DIRECTION = SELF.getDirection();
		const ANIMATION_NO = SELF.getAnimationNo();
		if (
			'undefined' !== typeof SELF.settings['images']
			&& 'undefined' !== typeof SELF.settings['images'][DIRECTION]
			&& 'undefined' !== typeof SELF.settings['images'][DIRECTION][ANIMATION_NO - 1]
		) {
			$(SELF.getElement()).prop('src', SELF.settings['images'][DIRECTION][ANIMATION_NO - 1]);
		}
	};

	/**
	 * 移動開始
	 */
	MoveWithAnimation.prototype.startMoving = function() {
		const SELF = this;

		// 移動中フラグを立て、移動・アニメーション開始
		let setLeftInt = 0;
		if ('right' === SELF.getDirection()) {
			setLeftInt = SELF.getCharacterXPositionMax();
		}
		SELF.setMoving(true);
		$(SELF.getElement()).animate({
			'left'	: setLeftInt + 'px'
		}, Math.abs(setLeftInt - SELF.getCharacterXPosition()) * 1000 / SELF.settings['movingPxPerSecond'], 'linear');
		
		if (true === SELF.withAnimation) {
			SELF.animateImage();
		}
	};

	/**
	 * 画像のアニメーション
	 */
	MoveWithAnimation.prototype.animateImage = function() {
		const SELF = this;
		let animationTimerId = SELF.getTimerId();
		clearTimeout(animationTimerId);

		let animationNo = SELF.getAnimationNo();
		if (false === SELF.isMoving() && 1 === animationNo) {
			// 移動中フラグがOFFになり、初期画像に戻った時点で移動も終了
			$(SELF.getElement()).stop(true);
			SELF.setTimerId();
			return;
		}

		// 次の画像に切り替え（最大数を超える場合は初期画像に戻す）
		++animationNo;
		if (SELF.settings['images'][SELF.getDirection()].length < animationNo) {
			animationNo = 1;
		}
		SELF.setAnimationNo(animationNo);

		// 一定時間後に再度アニメーション実施
		animationTimerId = setTimeout(function() {
			SELF.animateImage();
		}, SELF.settings['animationSpeedMsec']);
		SELF.setTimerId(animationTimerId);
	};

	/**
	 * 移動停止
	 *
	 * @param {bool} forcibly true: 即座に停止、false: アニメーションが完全に終わった時点で停止
	 */
	MoveWithAnimation.prototype.stopMoving = function(forcibly = false) {
		const SELF = this;

		// 移動中フラグOFF
		SELF.setMoving(false);
		if (false === SELF.withAnimation) {
			// アニメーションが無い場合、即座に停止
			$(SELF.getElement()).stop(true);
		} else if (true === forcibly) {
			// 即座に停止
			clearTimeout(SELF.getTimerId());
			$(SELF.getElement()).stop(true);
			SELF.setAnimationNo(1);
			SELF.setTimerId();
		}
	};

	$.fn.moveWithAnimation = function() {
		let elms = this;
		const OPTIONS = arguments[0];
		$.each(elms, function(i, elm) {
			elms[i].moveWithAnimation = new MoveWithAnimation(elm, OPTIONS);
		});
		return elms;
	};
})(jQuery);
