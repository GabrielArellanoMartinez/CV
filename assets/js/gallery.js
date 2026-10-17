(function($, browser) {

	var $body = $('body');

	$('.gallery').each(function() {

		var $gallery = $(this),
			$inner = $gallery.wrapInner('<div class="inner"></div>').children('.inner');

		if (!browser.mobile)
			$gallery.prepend('<div class="forward"></div><div class="backward"></div>');

		$inner
			.css('overflow-y', browser.mobile ? 'visible' : 'hidden')
			.css('overflow-x', browser.mobile ? 'scroll' : 'hidden')
			.scrollLeft(0);

		if ('IntersectionObserver' in window) {

			var observer = new IntersectionObserver(function(entries) {

				entries.forEach(function(entry) {

					if (entry.isIntersecting) {
						$(entry.target).removeClass('is-inactive');
						observer.unobserve(entry.target);
					}

				});

			}, { rootMargin: '30% 0px 30% 0px' });

			$gallery.addClass('is-inactive');
			observer.observe(this);

		}

		$gallery
			.on('wheel', '.inner', function(event) {

				var delta = event.originalEvent.deltaX * 10;

				if (delta > 0)
					delta = Math.min(25, delta);
				else if (delta < 0)
					delta = Math.max(-25, delta);

				$(this).scrollLeft($(this).scrollLeft() + delta);

			})
			.on('mouseenter', '.forward, .backward', function() {

				var $control = $(this),
					$galleryInner = $control.siblings('.inner'),
					direction = ($control.hasClass('forward') ? 1 : -1);

				clearInterval(this._galleryMoveIntervalId);
				this._galleryMoveIntervalId = setInterval(function() {
					$galleryInner.scrollLeft($galleryInner.scrollLeft() + (5 * direction));
				}, 10);

			})
			.on('mouseleave', '.forward, .backward', function() {
				clearInterval(this._galleryMoveIntervalId);
			});

		if (!$gallery.hasClass('lightbox'))
			return;

		var $modal = $('<div class="modal" tabindex="-1"><div class="inner"><img src="" /></div></div>')
				.appendTo($gallery),
			$modalImage = $modal.find('img');

		$gallery
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				if (!href || !href.match(/\.(jpg|gif|png|mp4)$/))
					return;

				event.preventDefault();
				event.stopPropagation();

				if ($modal[0]._locked)
					return;

				$modal[0]._locked = true;
				$modalImage.attr('src', href);
				$modal.addClass('visible').focus();

				setTimeout(function() {
					$modal[0]._locked = false;
				}, 600);

			})
			.on('click', '.modal', function() {

				if ($modal[0]._locked || !$modal.hasClass('visible'))
					return;

				$modal[0]._locked = true;
				$modal.removeClass('loaded');

				setTimeout(function() {

					$modal.removeClass('visible');

					setTimeout(function() {

						$modalImage.attr('src', '');
						$modal[0]._locked = false;
						$body.focus();

					}, 475);

				}, 125);

			})
			.on('keydown', '.modal', function(event) {

				if (event.key === 'Escape' || event.keyCode === 27)
					$modal.trigger('click');

			});

		$modalImage.on('load', function() {

			setTimeout(function() {

				if ($modal.hasClass('visible'))
					$modal.addClass('loaded');

			}, 275);

		});

	});

})(jQuery, browser);
