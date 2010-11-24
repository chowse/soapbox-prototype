

(function($) {
	$.extend($.fn, {
		nodeIndex: function() {
			var i = -1, node = this.get(0);
			for ( ; node; i++, node = node.previousSibling);
			return i;
		},
		
		switchTo: function(what, callback) {
			var fromElem = this,
			    toElem = $(what);
			
			if (fromElem.nodeIndex() < toElem.nodeIndex()) {
				var height = fromElem.height();
				var fromEnd = 0 - height;
				var toStart = height;
			} else {
				var height = toElem.height();
				var fromEnd = height;
				var toStart = 0 - height;
			}
			
			fromElem.css({ top: 0, opacity: 1 });
			toElem.css({ top: toStart, opacity: 0, display: 'block' });
			$('html').addClass('transitioning');
			
			toElem.one('transitionend', function(e) {
				fromElem.css({ display: 'none' });
				$('html').removeClass('transitioning');
				if (callback) callback();
			});
			
			setTimeout(function() {
				fromElem.css({ top: fromEnd, opacity: 0 });
				toElem.css({ top: 0, opacity: 1 });
			}, 100);
			
			return this;
		},
		styledRadio: function(radioSelector, parentSelector) {
			var self = this.get();
			updateChecks(this);
			return this.delegate(radioSelector, 'change', onChange)
			           .delegate(radioSelector, 'focus', onFocus)
			           .delegate(radioSelector, 'blur', onBlur);
			
			function onFocus(e) { $(this).closest(parentSelector).addClass('focused'); }
			function onBlur(e) { $(this).closest(parentSelector).removeClass('focused'); }
			function onChange(e) { updateChecks($(self)); }
			
			function updateChecks(self) {
				self.find(radioSelector).each(function() {
					$(this).closest(parentSelector).toggleClass('checked', this.checked);
				});
			}
		},
		submitButton: function(state) {
			var textElem = this.find('span');
			var oldHTML = textElem.html();
			var newTextAttr = (state == 'waiting') ? 'data-waittext' : 'data-text';
			
			this.toggleClass('waiting', state == 'waiting');
			textElem.html( this.attr(newTextAttr) );
			
			if (state == 'waiting') this.attr('data-text', oldHTML);
			
			return this;
		}
	});

	
	var currentArticle;
	
	function getArticle(href) {
		var hash = (href || '').replace(/^.*#/, '') || 'intro';
		var elem = $('#'+hash);
		return elem.length ? elem : $('#intro');
	}
	
	function goToArticle(href, pushState, callback)
	{
		var oldArticle = currentArticle;
		var newArticle = getArticle(href);
		
		if (oldArticle.get(0) == newArticle.get(0)) {
			return;
		}

		if (pushState) window.history.pushState('', '', '#' + newArticle.attr('id'));
		currentArticle = newArticle;
		
		oldArticle.switchTo(newArticle, callback);
	}
	
	$(function() {
		currentArticle = getArticle(document.location.hash);
		currentArticle.css({ display: 'block' });
		
		window.onpopstate = function(e) {
			goToArticle(document.location.hash);
		};
		
		$('#rate table').styledRadio('input', 'span');

		$('article form').submit(function(e) {
			var button = $(this).find('.submit a');
			button.submitButton('waiting');
			setTimeout(function() {
				goToArticle('#thanks', true, function() {
					button.submitButton('default');
				});
			}, 1000);
			return false;
		});
		
		$('.submit a').click(function(e) {
			$(this).closest('form').submit();
			return false;
		});
	});
})(jQuery);
