
/*
 * Mouse wheel control
 * by @psyonline, majorartist@gmail.com
 */
window._wheeler = window._wheeler || (function() {

	var wheeleventname = 'onwheel' in document ? 'wheel' : 'DOMMouseScroll' in document ? 'DOMMouseScroll' : 'mousewheel',
		needtouchmousecheck = true,
		prevwheeldelta = 120,
		useragent = navigator.userAgent,
		issafari = (/safari/i).test(useragent) && !(/chrome/i).test(useragent),
		_istouchmouse = false,
		_blocked = false,
		events = [];

	document.documentElement.addEventListener(wheeleventname, function(e) {

		// check touch mouse
		_istouchmouse = false;
		if (needtouchmousecheck) {
			if (e.wheelDeltaY !== undefined) {
				if (e.wheelDeltaY === -3 * e.deltaY || (!issafari && (prevwheeldelta % 120 !== 0 || Math.abs(e.wheelDeltaY) % 120 !== 0))) {
					_istouchmouse = true;
				}
				prevwheeldelta = Math.abs(e.wheelDeltaY);
			} else if (e.wheelDelta !== undefined) {
				if (prevwheeldelta % 120 !== 0 || Math.abs(e.wheelDelta) % 120 !== 0) {
					_istouchmouse = true;
				}
				prevwheeldelta = Math.abs(e.wheelDelta);
			// dangerously check on firefox. not working with inner scroll.
			// } else if (e.deltaMode === 0) {
			// 	_istouchmouse = true;
			}
		}

		if (events.length) {
			var time = new Date().getTime(),
				delta = getwheeldelta(e);
			events.forEach(function(handler) {
				if (Math.abs(delta.y) > handler._wheelerdata.mindeltay) {
					if (handler._wheelerdata.mindelay) {
						if (time - (handler._wheelerdata.lastmovedtime || 0) > handler._wheelerdata.mindelay) {
							handler(e, delta.x, delta.y);
							// handler(e, delta.x === 0 ? 0 : delta.x > 0 ? 1 : -1, delta.y === 0 ? 0 : delta.y > 0 ? 1 : -1);
							handler._wheelerdata.lastmovedtime = time;
						}
					} else {
						handler(e, delta.x, delta.y);
					}
				}
			});
			e.preventDefault();
		}

		_blocked && e.preventDefault();

	}, {passive: false});

	function addlistener(handler, _options) {
		if (handler) {
			var options = _options;
			handler._wheelerdata = {
				mindeltay: options.mindeltay || 0,
				mindelay: options.mindelay || 0
			};
			events.push(handler);
		}
	}

	function removelistener(handler) {
		handler && events.indexOf(handler) > -1 && events.splice(events.indexOf(handler), 1);
	}

	function getwheeldelta(e) {
		return {
			x: e.deltaX !== undefined ? e.deltaX : e.wheelDeltaX || 0,
			y: e.deltaY !== undefined ? e.deltaY : e.wheelDeltaY !== undefined ? e.wheelDeltaY : e.detail || e.wheelDelta * -1
		};
	}

	return {
		wheelEventName: wheeleventname,
		addEventListener: addlistener,
		removeEventListener: removelistener,
		getWheelDelta: getwheeldelta,
		get blocked() {
			return _blocked;
		},
		set blocked(value) {
			_blocked = !!value;
		},
		get isTouchMouse() {
			return _istouchmouse;
		}
	};

})();

/*
 * Smooth scroller. y only.
 * by @psyonline, majorartist@gmail.com
 */
window._scroller = window._scroller || (function() {

	var $html = document.documentElement,
		$body = document.body,

		$tester = document.createElement('div'),

		useragent = navigator.userAgent,
		ismobile = (/(ip(ad|hone|od)|android)/i).test(useragent) || (navigator.platform.toLowerCase() === 'macintel' && navigator.maxTouchPoints > 1),
		isfirefox = (/firefox/i).test(useragent),
		isandroid = (/android/i).test(useragent),

		issupportscrollanimation = ismobile || isfirefox,
		// issupportscrollanimation = true,

		windowheight = window.innerHeight,
		vhsize = 0,
		scrollbarwidth = 0,

		scrollers = [],

		scrollerdataname = '_scrollerdata',

		ispageloaded = false;


	gsap.config({force3D: true});

	// get scroll bar size
	$tester.style.cssText = 'position: absolute; left: -999em; top: -999em; height: 100vh; overflow: scroll; visibility: hidden;';
	$body.appendChild($tester);
	scrollbarwidth = $tester.offsetWidth;
	_assignvh();

	window.addEventListener('DOMContentLoaded', _onresize);
	window.addEventListener('resize', _onresize);
	window.addEventListener('load', function() {
		_updateallscrollers();
		setTimeout(function() {
			ispageloaded = true;
		}, 100);
	});


	function _assignvh() {
		$body.appendChild($tester);
		vhsize = $tester.offsetHeight;
		$body.removeChild($tester);
	}

	function _onresize() {
		windowheight = window.innerHeight;
		_assignvh();
		if (document.documentElement.style.setProperty) {
			document.documentElement.style.setProperty('--ah', $html.offsetHeight +'px');
		}
		_updateallscrollers(true);
	}

	function _updateallscrollers() {
		scrollers.forEach(function(scroller) {
			if (isandroid) {
				scroller.wrapper.style.height = $html.offsetHeight - 0.4 + 'px';
				// alert(window.innerWidth + ' ' + window.innerHeight + ' ' + $html.offsetHeight + ' ' + vhsize);
			}
			scroller._updatenodes();
			scroller.update();
		});
	}

	// fixed node
	function _addfixednode($node, $group) {
		$group.push($node);
	}
	function _removefixednode($node, $group) {
		_removenode($node, $group);
	}
	function _updatefixednodes($nodes, scrolltop) {
		for (var $node, i = 0, numnodes = $nodes.length; i < numnodes; i++) {
			$node = $nodes[i];
			gsap.set($node, {y: scrolltop});
		}
	}

	// sticky node
	function _addstickynode($node, $group, options) {
		if ($node && !ismobile && !issupportscrollanimation) {
			_addscrollerdata($node, function() {
				$node.style.position = 'relative';
			});
			_setstickynodebase($node, options);
			$group.push($node);
		}
	}
	function _removestickynode($node, $group) {
		_removenode($node, $group);
	}
	function _setstickynodebase($node, _options) {
		if ($node.forEach) {
			$node.forEach(function(_$node) {
				_setstickynodebase(_$node, _options);
			});
		} else {
			var options = _options || {},
				direction = options.direction || $node.dataset.scrollerStickyDirection || 'top';
			$node[scrollerdataname].stickydirection = direction;
			$node.style[direction] = '';
			$node[scrollerdataname].stickyvalue = parseInt(getstyle($node)[direction]) || 0;
			$node.style[direction] = 0;
			$node[scrollerdataname].margintop = $node.offsetTop;
			$node[scrollerdataname].marginbottom = $node.parentNode ? (parseInt(getstyle($node.parentNode)['paddingBottom']) || 0) + (parseInt(getstyle($node.parentNode)['borderBottomWidth']) || 0) : 0;
		}
	}
	function _updatestickynodes($nodes, scrolltop) {
		var i = 0, numnodes = $nodes.length,
			$node, parentrect, scrollerdata, stickydirection, stickyvalue, y;
		for (; i < numnodes; i++) {
			$node = $nodes[i];
			parentrect = $node.parentNode.getBoundingClientRect();
			scrollerdata = $node[scrollerdataname];
			stickydirection = scrollerdata.stickydirection;
			stickyvalue = scrollerdata.stickyvalue;
			if (stickydirection === 'top') {
				y = Math.max(
						stickyvalue > -parentrect.top - scrollerdata.margintop ? 0 : stickyvalue,
						Math.min(
							$node.parentNode.offsetHeight - scrollerdata.margintop - scrollerdata.marginbottom - $node.offsetHeight,
							-parentrect.top - scrollerdata.margintop+stickyvalue
						)
					);
			} else if (stickydirection === 'bottom') {
				y = Math.min(stickyvalue, -parentrect.bottom + windowheight - stickyvalue);
			}
			gsap.set($node, {y: y});
		}
	}

	// trigger node
	function _addtriggernode($node, $group, _options) {
		var options = _options || {};
		for (var key in options) {
			if ((/^scroller-(visible|invisible|scroll)$/).test(key)) {
				$node.addEventListener(key, options[key]);
			}
		}
		_addscrollerdata($node);
		$group.push($node);
	}
	function _removetriggernode($node, $group) {
		_removenode($node, $group);
	}
	function _updatetriggernodes($nodes, scrolltop) {
		for (var $node, rect, i = 0, numnodes = $nodes.length; i < numnodes; i++) {
			$node = $nodes[i];
			rect = $node.getBoundingClientRect();

			// visible
			if (windowheight > rect.top && rect.bottom > 0) {
				if ($node[scrollerdataname].visible === undefined || $node[scrollerdataname].visible === false) {
					dispatchevent($node, 'scroller-visible');
					$node[scrollerdataname].visible = true;
				}

				var visibleheight = rect.height + Math.min(0, rect.top) - Math.max(0, rect.bottom - windowheight);
				dispatchevent($node, 'scroller-scroll', {
					target: $node,
					rect: rect,
					progress: -rect.top / (rect.height - windowheight),
					progressOnScreen: -rect.top / windowheight,
					// top: {
					// 	percent: -rect.top / windowheight,
					// 	percentSelf: -rect.top / rect.height,
					// 	percentSafe: Math.max(0, Math.min(1, -rect.top / Math.max(0, rect.height - windowheight)))
					// },
					visiblePercent: visibleheight / Math.min(rect.height, windowheight),
					visibleHeight: visibleheight,
					windowHeight: windowheight,
					scrollTop: scrolltop
				});

			// invisible
			} else {
				if ($node[scrollerdataname].visible === true) {
					dispatchevent($node, 'scroller-invisible');
					$node[scrollerdataname].visible = false;
				}
			}
		}
	}

	function _removenode($node, $group) {
		var index = $group.indexOf($node);
		if (index > -1) {
			_removescrollerdata($node);
			$group.splice(index, 1);
		}
	}

	function _addscrollerdata($node, extra) {
		if (!$node[scrollerdataname]) {
			$node[scrollerdataname] = {
				csstext: $node.style.cssText
			};
			extra && typeof(extra) === 'function' && extra();
		}
	}

	function _removescrollerdata($node) {
		if ($node[scrollerdataname]) {
			$node.style.cssText = $node[scrollerdataname].csstext;
			delete $node[scrollerdataname];
			delete $node._gsTransform;
		}
	}
		
	function getoffsettop($target, _$limit) {
		var $limit = _$limit || $body,
			top = 0;
		while ($target && $target !== $limit) {
			top += $target.offsetTop;
			$target = $target.offsetParent;
		}
		return top;
	}

	function plusrightvalue($node) {
		if ($node && $node.offsetWidth) {
			restorerightvalue($node);
			var right = parseInt(getstyle($node)['right']);
			// save inline style right value before disabled
			$node.dataset.scrollerRvbd = $node.style.right;
			$node.style.right = right + scrollbarwidth + 'px';
		}
	}

	function restorerightvalue($node) {
		if ($node && $node.offsetWidth) {
			// restore inline style right value before disabled
			$node.style.right = $node.dataset.scrollerRvbd;
		}
	}

	function checkisbodyscroll(_$parent) {
		while (_$parent !== $html) {
			if (!(/^(auto|scroll)$/).test(getstyle(_$parent)['overflowY'])) {
				return false;
			}
			_$parent = _$parent.parentNode;
		}
		return true;
	}

	function dispatchevent($target, eventname, data) {
		var event;
		if (typeof(Event) === 'function') {
			event = new Event(eventname);
		} else {
			event = document.createEvent('Event');
			event.initEvent(eventname, true, true);
		}
		event.scroller = data || null;
		$target.dispatchEvent(event);
	}

	function getstyle($node) {
		return window.getComputedStyle($node);
	}

	return function($wrap, _options) {

		var $parent = $wrap.parentNode,

			options = _options || {},

			$synced = options.synced,

			$fixednodes = [],
			$stickynodes = [],
			$triggernodes = [],

			events = [],

			currentscrolltop = getscrolltop(),
			prevscrolltop = -1,
			maxscrolltop = 0,

			isbodyscroll = checkisbodyscroll($parent),
			isdisabled = false,
			isfixed = issupportscrollanimation && options.fixed,

			scroller = {
				wrapper: $wrap,
				isFixed: isfixed,
				isActivated: !issupportscrollanimation,
				addEventListener: function(handler) {
					events.push(handler);
				},
				removeEventListener: function(handler) {
					events.indexOf(handler) > -1 && events.splice(events.indexOf(handler), 1);
				},
				addFixedNode: function($node) {
					_addfixednode($node, $fixednodes);
				},
				removeFixedNode: function($node) {
					_removefixednode($node, $fixednodes);
				},
				addStickyNode: function($node, options) {
					_addstickynode($node, $stickynodes, options);
				},
				removeStickyNode: function($node) {
					_removestickynode($node, $stickynodes);
				},
				addTrigger: function($node, options) {
					_addtriggernode($node, $triggernodes, options);
					_updatetriggernodes([$node], currentscrolltop);
				},
				removeTrigger: function($node) {
					_removetriggernode($node, $triggernodes);
				},

				// temporally disable/enable functions are body scroll only.
				disable: function($enabled, $nodesneedsplusrightvalue) {
					if (isbodyscroll && !isdisabled) {
						if (ismobile) {
							window.bodyScrollLock && bodyScrollLock.disableBodyScroll($enabled);
						} else {
							$body.style.overflow = 'hidden';
						}
						if (scrollbarwidth) {
							$body.style.paddingRight = scrollbarwidth +'px';
							!issupportscrollanimation && plusrightvalue($wrap);
							$fixednodes.forEach(plusrightvalue);
							$nodesneedsplusrightvalue && $nodesneedsplusrightvalue.forEach(plusrightvalue);
						}
						isdisabled = true;
					}
				},
				enable: function($enabled, $nodesneedsrestorerightvalue) {
					if (isbodyscroll && isdisabled) {
						if (ismobile) {
							window.bodyScrollLock && bodyScrollLock.enableBodyScroll($enabled);
						} else {
							$body.style.overflow = '';
						}
						if (scrollbarwidth) {
							$body.style.paddingRight = '';
							!issupportscrollanimation && restorerightvalue($wrap);
							$fixednodes.forEach(restorerightvalue);
							$nodesneedsrestorerightvalue && $nodesneedsrestorerightvalue.forEach(restorerightvalue);
						}
						isdisabled = false;
					}
				},

				get scrollTop() {
					return currentscrolltop;
				},
				set scrollTop(value) {
					scroller.top(value, 0);
				},
				get scrollBarWidth() {
					return scrollbarwidth;
				},
				get changedTop() {
					return currentscrolltop - prevscrolltop;
				},

				_updatenodes: function() {
					_setstickynodebase($stickynodes);
				}
			};


		if (window.ScrollTrigger && !issupportscrollanimation && isbodyscroll) {
			ScrollTrigger.scrollerProxy($body, {
				scrollTop(value) {
					if (arguments.length) {
						scroller.scrollTop = value;
					}
					return scroller.scrollTop;
				}
			});
			events.push(ScrollTrigger.update);
		}

		if (options.triggerNodes) {
			if (options.triggerNodes.length) {
				options.triggerNodes = [].slice.call(options.triggerNodes);
			} else {
				options.triggerNodes = [options.triggerNodes];
			}
			$triggernodes.forEach(_addtriggernode);
		}

		[].forEach.call($wrap.querySelectorAll('*'), function($node) {
			var position = getstyle($node)['position'];
			if (position === 'fixed') {
				scroller.addFixedNode($node);
			} else if (position === 'sticky') {
				scroller.addStickyNode($node);
			}
		});


		issupportscrollanimation ? (function() {

			var needsupdate = false;

			if (isfixed) {
				if (getstyle($wrap)['position'] === 'static') {
					$wrap.style.position = 'relative';
				}
				$wrap.style.height = '100%';
				$wrap.style.minHeight = 0;
				$wrap.style.overflow = 'hidden';
				$wrap.style.overflowY = 'auto';
				$wrap.addEventListener('touchmove', function(e) {
					e.stopPropagation();
				}, {passive: false});
				window.ScrollTrigger && ScrollTrigger.defaults({
					scroller: $wrap
				});
			}

			// debouncing
			gsap.ticker.add(function() {
				if (needsupdate) {
					updatescroll();
					needsupdate = false;
				}
			});
			(isfixed ? $wrap : isbodyscroll ? window : $parent).addEventListener('scroll', function() {
				needsupdate = true;
			});

			scroller.top = function(value, _option) {
				var option;
				if (!isNaN(_option)) {
					option = {duration: _option, ease: 'power4.inOut'};
				} else if (_option && !isNaN(_option.duration)) {
					option = _option;
				} else if (!_option) {
					option = {duration: 1, ease: 'power4.inOut'};
				}
				gsap.to(isbodyscroll ? [$html, $body] : $parent, option.duration, {scrollTop: value, ease: option.ease});
			};

			scroller.update = function(withnodes) {
				withnodes && scroller._updatenodes();
				updatescroll(null, true);
			};

		})() : (function() {

			var $hodor = document.createElement('div'),
				tweener = {y: 0, py: -1},
				scrolltween = null,
				customanimateoption = null;

			$hodor.style.cssText = 'pointer-events: none;'
			$parent.appendChild($hodor);
			$wrap.style.position = 'fixed';
			$wrap.style.left = 0;
			$wrap.style.right = isbodyscroll ? 0 : scrollbarwidth +'px';
			gsap.set($wrap, {y: 0});
			if ($synced) {
				$synced.style.position = 'fixed';
				gsap.set($synced, {y: 0});
			}

			(isbodyscroll ? window : $parent).addEventListener('scroll', onscroll);

			// only body scroll
			if (isbodyscroll) {
				$html.classList.add('scroll-managed');
				// control hash move
				window.addEventListener('hashchange', function() {
					if (!location.hash) {
						scroller.top(0, 0);
					} else {
						scrolltotarget($body.querySelector(location.hash));
					}
				});
				// focused element
				$body.addEventListener('keyup', function(e) {
					if (e.keyCode === 9 && document.activeElement) {
						var $target = document.activeElement || e.target,
							targetrect = $target.getBoundingClientRect(),
							parentheight = $parent.offsetHeight,
							relatedtop = 0;
						if (0 > targetrect.top || targetrect.bottom > parentheight) {
							if (targetrect.top > parentheight) {
								relatedtop = (targetrect.top - parentheight) + (parentheight / 2 + targetrect.height / 2);
							} else if (0 > targetrect.bottom) {
								relatedtop = -(-targetrect.bottom + (parentheight / 2 + targetrect.height / 2));
							} else if (0 > targetrect.top) {
								relatedtop = targetrect.top;
							} else if (targetrect.bottom > parentheight) {
								relatedtop = targetrect.bottom - parentheight;
							}
						}
						if (relatedtop !== 0) {
							scroller.top(currentscrolltop + relatedtop, 0);
							// to avoid losing focus bug.
							requestAnimationFrame(function() {
								if (document.activeElement !== $target) {
									$target.focus();
								}
							});
						}
					}
				});
			}

			$wrap.addEventListener('pointerdown', function() {
				scrolltween && scrolltween.kill();
				tweener.py = tweener.y = Math.round(tweener.y);
				setscrolltop(tweener.y);
			}, true);

			// if not body scroll
			if (window._wheeler && !isbodyscroll) {
				// fix fixed element scroll issue
				$wrap.addEventListener(_wheeler.wheelEventName, function(e) {
					$parent.scrollTop += _wheeler.getWheelDelta(e).y;
				}, {passive: false});

				// imitate overscroll behavior. block parent scroll
				// !issupport.overscrollbehavior && $modal.addEventListener(_wheeler.wheelEventName, function(e) {
				$parent.addEventListener(_wheeler.wheelEventName, function(e) {
					var deltay = _wheeler.getWheelDelta(e).y,
						scrolltop = $parent.scrollTop;
					if ((scrolltop === 0 && 0 > deltay) || (scrolltop === maxscrolltop && deltay > 0)) {
						e.preventDefault();
					}
				}, {passive: false});
			}

			function onmove() {
				var y = tweener.y;
				if (y !== tweener.py) {
					// $wrap.style.transform = 'translate3d(0, -'+ y +'px, 0)';
					gsap.set($wrap, {y: -y});
					$synced && gsap.set($synced, {y: -y});
					updatescroll(y, true);
					tweener.py = y;
				}
			}

			function onscroll(_scrolltop) {
				var scrolltop = !isNaN(_scrolltop) ? _scrolltop : getscrolltop();

				scrolltween && scrolltween.kill();
				checksize();

				if (scrolltop !== tweener.py) {
					var duration = customanimateoption && !isNaN(customanimateoption.duration) ? customanimateoption.duration : 
						window._wheeler && _wheeler.isTouchMouse ? 0 : 
						!ispageloaded ? 0 : 
						Math.max(0.25, Math.min(1.25, Math.abs(scrolltop - tweener.py) / 250)),
						onend = customanimateoption ? customanimateoption.onend : null;

					if (duration) {
						scrolltween = gsap.to(tweener, duration, {
							y: scrolltop,
							ease: customanimateoption ? (customanimateoption.ease || 'power4.out') : 'power4.out',
							// roundProps: 'y',
							onUpdate: onmove,
							onComplete: onend
						});
					} else {
						tweener.y = scrolltop;
						onmove();
						onend && onend();
					}
				}

				customanimateoption = null;
			}

			function checksize() {
				var parentheight = isbodyscroll ? windowheight : $parent.offsetHeight,
					wrapheight = Math.max(parentheight, $wrap.offsetHeight);
				$hodor.style.height = wrapheight + 'px';
				maxscrolltop = wrapheight - parentheight;
			}

			function scrolltotarget($target) {
				if ($target) {
					scroller.top(getoffsettop($target, $parent), 0);
				}
			}

			scroller.top = function(value, _customanimateoption) {
				if (!isNaN(_customanimateoption)) {
					customanimateoption = {duration: _customanimateoption, ease: 'power4.inOut'};
				} else if (_customanimateoption && (!isNaN(_customanimateoption.duration) || _customanimateoption.ease || _customanimateoption.onend)) {
					customanimateoption = _customanimateoption;
				} else if (!_customanimateoption) {
					customanimateoption = {duration: 1, ease: 'power4.inOut'};
				}
				setscrolltop(value);
			};
			scroller.update = function(withnodes) {
				withnodes && scroller._updatenodes();
				checksize();
				updatescroll(null, true);
				// initial
				if (!ispageloaded && location.hash && $body.querySelector(location.hash)) {
					var _scrolltop = getoffsettop($body.querySelector(location.hash), $parent);
					setTimeout(function() {
						window.scrollTo(0, _scrolltop);
					}, 0);
				}
			};

		})();

		scrollers.push(scroller);


		function updatescroll(_scrolltop, forced) {
			if (_scrolltop === true) {
				return updatescroll(null, true);
			}
			var scrolltop = _scrolltop && !isNaN(_scrolltop) ? _scrolltop : getscrolltop();
			if (forced || scrolltop !== prevscrolltop) {
				prevscrolltop = currentscrolltop;
				currentscrolltop = scrolltop;

				if ($wrap.offsetWidth) {
					if (!issupportscrollanimation) {
						_updatestickynodes($stickynodes, scrolltop);
						_updatefixednodes($fixednodes, scrolltop);
					}
					_updatetriggernodes($triggernodes, scrolltop);
				}

				events.forEach(function(handler) {
					handler(scrolltop);
				});
			}
		}

		function getscrolltop() {
			return Math.round(isfixed ? $wrap : isbodyscroll ? ($body.scrollTop || $html.scrollTop) : $parent.scrollTop);
		}

		function setscrolltop(value) {
			if (isbodyscroll) {
				window.scrollTo(0, value);
			} else {
				$parent.scrollTop = value;
			}
		}

		return scroller;

	}

})();