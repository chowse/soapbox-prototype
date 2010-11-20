

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
		}
	});

	
	var currentArticle;
	
	function getArticle(href) {
		var hash = (href || '').replace(/^.*#/, '') || 'intro';
		var elem = $('#'+hash);
		return elem.length ? elem : $('#intro');
	}
	
	function goToArticle(href, pushState)
	{
		var article = getArticle(href);
		
		if (article.get(0) == currentArticle.get(0)) {
			return;
		}

		currentArticle.switchTo(article, function() {
			currentArticle = article;
			if (pushState) {
				alert('pushing ' + '#' + article.attr('id'));
				window.history.pushState('', '', '#' + article.attr('id'));
			}
		});
	}
	
	$(function() {
		currentArticle = getArticle(document.location.hash);
		currentArticle.css({ display: 'block' });
		
		window.onpopstate = function(e) {
			goToArticle(document.location.hash);
		};
	});
})(jQuery);

