/*-----------------------------------------------------------------------------------

 Theme Name: The GoodWin eCommerce Template
 Author: BigSteps
 Author URI: http://themeforest.net/user/bigsteps
 Version: 1.0.0

 -----------------------------------------------------------------------------------*/

//"use strict";

(function ($) {

	function calcScrollWidth() {
		var _ = $('<div style="width:100px;height:100px;overflow:scroll;visibility: hidden;"><div style="height:200px;"></div>');
		$('body').append(_);
		var w = (_[0].offsetWidth - _[0].clientWidth);
		$(_).remove();
		return (w);
	}

	function debouncer(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this,
				args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	}

	var GOODWIN = GOODWIN || {};

	GOODWIN.initialization = {
		init: function () {
			this.removePreloader(1000);
			this.checkDevice();
			this.hideBeforeLoad('.mobilemenu-content', 1000);
			this.hideEmptyFilters('.js-filter-col', '.aside', '.sidebar-block_content', '.filter-button', '.filter-row');
			this.showAboveFooter('.show_above_footer', '.page-content');
			this.showAboveContent('.show_under_header', '.page-content');
			this.productTab('.product-tab');
			this.accordionSetActive();
			this.footerCollapse('.collapsed-mobile');
			this.changeInput();
			this.tooltipIni('[data-toggle="tooltip"]', '.prd-block [data-toggle="tooltip"]');
			this.modalCountDown('.modal--countdown');
			this.countdown('.js-countdown');
			this.reposInit();
			this.insideCarousel('.carousel-inside');
			this.loadingEmulate('.loading-emulate');
			this.sliderTextTopShift();
			this.newsletterModal('.js-newslettermodal', '#newsLetterCheckBox');
			this.setFullHeight();
			this.setFullHeightSlider();
			this.fullPage('#fullpage');
			this.removeEmpty('.shopify-section');
			this.removeEmptyParent('.header-banners > .container');
			this.openAccordion('#productAccordion');
			this.imageLoadedProductPage('.prd-block .prd-has-loader');
			this.imageLoaded('.prd.prd-has-loader, .prd-hor.prd-has-loader, .has-loader');
			this.simpleFilters();
			this.compensateScrollBar();
			if ($('.snow-effect').length) this.initLetItSnow('.snow-effect', 50, 150);
		},
		removePreloader: function (delay) {
			setTimeout(function () {
				$body.addClass('no-loader').removeClass('document-ready');
			}, delay)
			setTimeout(function () {
				$('.body-loader').remove()
			}, (delay + 1000))
		},
		checkDevice: function () {
			var isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
			if (navigator.userAgent.indexOf('Windows') > 0) {
				$body.addClass('win');
				isTouchDevice = false;
			}
			if (isTouchDevice) {
				$('body').addClass('touch');
				swipemode = true;
			}
			if (navigator.userAgent.indexOf('Mac') > 0) {
				$('body').addClass('mac');
			}
			if (navigator.userAgent.match(/Android/)) {
				$('body').addClass('android');
			}
		},
		compensateScrollBar: function () {
			$('.fixed-scroll').css({
				width: 'calc(100% + ' + scrollWidth + 'px)'
			});
		},
		scrollOnLoad: function () {
			var $elem = $($(location).attr('href').split('#')[1]);
			if ($elem.length) {
				setTimeout(function () {
					var speed = $('body').height() / 3 > 500 ? $('body').height() / 3 : 500;
					var wHeight = $(window).height() < $elem.height() * 2 ? 0 : $(window).height() - $elem.height() * 2,
						offsetTop = $elem.offset().top - wHeight;
					$('html,body').animate({
						scrollTop: offsetTop
					}, speed);
				}, 500)
			}
		},
		simpleFilters: function () {
			var SimpleFilters = {
				default: {
					gallery: '.js-simple-filter',
					galleryItem: '.js-simple-filter-item',
					filterLabel: '.js-simple-filter-label'
				},
				init: function (options) {
					$.extend(this.default, options);
					var that = this,
						$gallery = $(this.default.gallery);
					$gallery.each(function () {
						var $gallery = $(this),
							$galleryItem = $(that.default.galleryItem, $gallery),
							$filterLabel = $(that.default.filterLabel, $gallery),
							activeStart;
						that._handlers($filterLabel, $galleryItem, $gallery);
						$filterLabel.each(function () {
							var $this = $(this),
								selectedCategory = $this.attr("data-filter"),
								count = '<span>' + $gallery.find(selectedCategory).length + '</span>';
							$this.append(count);
							if ($this.hasClass('active')) {
								$galleryItem.filter(selectedCategory).fadeIn(0).addClass('isvisible');
								activeStart = true;
							} else {
								$galleryItem.fadeIn(0).addClass('isvisible');
							}
						});
						if (!activeStart) $filterLabel.first().trigger('click');
						that._clickFirst($gallery);
					})
				},
				_clickFirst: function ($gallery) {
					if ($('.faq-item', $gallery).length) {
						$('.panel-heading.active', $gallery).find('.panel-title').trigger('click');
						$('.faq-item.isvisible', $gallery).first().find('.panel-title').trigger('click');
					}
				},
				_handlers: function ($filterLabel, $galleryItem, $gallery) {
					var that = this;
					$filterLabel.on('click', function (e) {
						var $this = $(this),
							selectedCategory = $this.attr("data-filter");
						if ($this.hasClass('active')) {
							return false;
						} else {
							$this.siblings().removeClass('active');
							$this.addClass('active')
						}
						if (!selectedCategory) {
							$galleryItem.fadeIn(0).addClass('isvisible');
						} else {
							$galleryItem.filter(':not(' + selectedCategory + ')').fadeOut(0).removeClass('isvisible');
							$galleryItem.filter(selectedCategory).fadeIn(0).addClass('isvisible');
						}
						that._clickFirst($gallery);
						e.preventDefault();
					});
				},
				reinit: function () {
					this.init();
					return this;
				}
			}
			GOODWIN.simplefilters = Object.create(SimpleFilters);
			GOODWIN.simplefilters.init();
		},
		imageLoadedProductPage: function (image) {
			$(image).each(function () {
				var $this = $(this);
				if ($this.closest('.prd')) $this.find('img').css({
					opacity: 0
				});
				$this.imagesLoaded(function () {
					$this.addClass('loaded');
					$this.find('img').animate({
						opacity: 1
					}, 200);
				});
			})
		},
		imageLoaded: function (image, carousel) {
			var $imageL = $(image);
			if (carousel) {
				$imageL = image;
			}
			$imageL.each(function () {
				var $this = $(this);
				if ($('.prd-img-area', $this).length) {
					$('.prd-img-area', $this).imagesLoaded(function () {
						$this.addClass('loaded');
					});
				} else {
					$this.imagesLoaded(function () {
						$this.addClass('loaded');
					});
				}
			})
		},
		productWidth: function (product) {
			$(product).each(function () {
				var $this = $(this);
				$this.removeClass('prd-w-md prd-w-sm prd-w-xs');
				var w = $this.find('.prd-img-area').width(),
					wClass = '';
				if (w >= 220 && w < 250) {
					wClass = 'prd-w-md';
				} else if (w >= 190 && w < 220) {
					wClass = 'prd-w-sm';
				} else if (w <= 190) {
					wClass = 'prd-w-xs';
				}
				$this.addClass(wClass);
			})
		},
		removeEmpty: function (selector) {
			$(selector).each(function () {
				var $this = $(this);
				if (!$.trim($this.html()).length) $this.remove();
			});
		},
		removeEmptyLinked: function (absent, linked) {
			if (!$(absent).length) $(linked).remove;
		},
		removeEmptyParent: function (selector) {
			$(selector).each(function () {
				var $this = $(this);
				if (!$.trim($this.html()).length) $this.parent().remove();
			});
		},
		fullPage: function (fullpageID) {
			if ($(fullpageID).length) {
				var doAnimations = function doAnimations(elements) {
					$(elements).each(function () {
						var $this = $(this);
						var animationDelay = $this.data('animation-delay');
						var animationType = 'animated ' + $this.data('animation');
						$this.css({
							'animation-delay': animationDelay,
							'-webkit-animation-delay': animationDelay
						});
						$this.addClass(animationType);
					});
				};
				$('.shopify-section, .fullpage-section').each(function () {
					var $this = $(this);
					if (!$.trim($this.html()).length > 0) $this.remove();
				});
				$(fullpageID).fullpage({
					licenseKey: '9472EE4F-F4F54BF6-815B4F05-9A29E818',
					menu: '.hdr',
					sectionSelector: '.fullpage-section',
					slideSelector: '.fullpage-section-slide',
					scrollOverflow: false,
					navigation: true,
					navigationPosition: 'right',
					afterLoad: function afterLoad() {
						doAnimations('.fullpage-section.active .load-animate');
					}
				});
				var $lastSection = $(fullpageID).find('.fullpage-section').last(),
					$footer = $('.page-footer');
				$footer.detach().appendTo($lastSection);
				$lastSection.find('.fp-tableCell').css({
					'padding-bottom': $footer.outerHeight()
				});
				$('.minicart-drop-content, .mobilemenu-scroll').perfectScrollbar();
			}
		},
		showAboveFooter: function (section, content) {
			$(section).each(function () {
				var $this = $(this),
					detached = $this.detach();
				$(content).append(detached);
				if (($this).find('.contact-map').length) {
					$('.page-footer').addClass('mt-0');
				}
			})
		},
		showAboveContent: function (section, content) {
			$(section).each(function (i) {
				var $this = $(this),
					detached = $this.detach();
				if (i > 0) {
					$(content).find(section).after(detached);
				} else $(content).prepend(detached);
				setTimeout(function () {
					$this.find('.slick-initialized').slick('setPosition');
					$this.css({
						'opacity': 1
					}).addClass('loaded');
					$(window).trigger('resize');
				}, 1000);
			});
		},
		setFullHeight: function () {
			var SetFullHeight = {
				default: {
					holder: '.holder.fullheight',
					header: '.hdr',
					footer: '.page-footer'
				},
				init: function (options) {
					$.extend(this.default, options);
					var that = this;
					$(that.default.holder).each(function () {
						var $this = $(this),
							wh = $(window).height();
						if ($(that.default.header).length && $(that.default.footer).length) {
							$this.css({
								'max-height': wh - $(that.default.header).outerHeight() - $(that.default.footer).outerHeight() + 'px'
							})
						} else if ($(that.default.header).length) {
							$this.css({
								'max-height': wh - $(that.default.header).outerHeight() + 'px'
							})
						} else if ($(that.default.footer).length) {
							$this.css({
								'max-height': wh - $(that.default.footer).outerHeight() + 'px'
							})
						}
					})
				},
				reinit: function () {
					this.init();
					return this;
				}
			}
			GOODWIN.setfullheight = Object.create(SetFullHeight);
			GOODWIN.setfullheight.init();
		},
		setFullHeightSlider: function () {
			var SetFullHeightSlider = {
				default: {
					slider: '.bnslider--fullheight',
					header: '.hdr'
				},
				init: function (options) {
					$.extend(this.default, options);
					var that = this;
					$(that.default.slider).each(function () {
						var $this = $(this),
							wh = $(window).height(),
							$header = $(that.default.header);
						if ($header.length) {
							if ($header.hasClass('hdr--transparent')) {
								$this.css({
									'min-height': wh + 'px',
								})
							} else {
								$this.css({
									'min-height': wh - $(that.default.header).outerHeight() + 'px',
								})
							}
						}
					})
				},
				reinit: function () {
					this.init();
					return this;
				}
			}
			GOODWIN.setfullheightslider = Object.create(SetFullHeightSlider);
			GOODWIN.setfullheightslider.init();
		},
		backToTop: function (button) {
			var $button = $(button),
				windowH = $(window).height();
			if ($(window).scrollTop() > windowH / 2) {
				$button.addClass('is-visible');
			}
			$(window).scroll(function () {
				if ($(this).scrollTop() > windowH / 2) {
					$button.addClass('is-visible');
				} else {
					$button.removeClass('is-visible');
				}
			});

			function scrollToTop() {
				$body.addClass('blockSticky');
				var speed = $(window).scrollTop() / 4 > 500 ? $(window).scrollTop() / 4 : 500;
				if (isMobile) {
					speed = speed * 2;
				}
				$("html, body").animate({
					scrollTop: 0
				}, speed, function () {
					$body.removeClass('blockSticky');
				});
				GOODWIN.stickyheader.destroySticky();
			}

			$button.on('click', function (e) {
				scrollToTop();
				e.preventDefault();
			});
			$('.logo-holder-s').on('click', function (e) {
				if (isMobile) {
					scrollToTop();
					e.preventDefault();
				}
			});
		},
		newsletterModal: function (modal, checkbox) {
			var $newsletter = $(modal),
				$checkBox = $(checkbox);

			function checkCookie() {
				if ($.cookie('goodwinNewsLetter') != 'yes' || $('body').hasClass('demo')) {
					openNewsletterPopup();
				}
			}

			function openNewsletterPopup() {
				var pause = $newsletter.attr('data-pause') > 0 ? $newsletter.attr('data-pause') : 2000;
				setTimeout(function () {
					$.fancybox.open($newsletter, {
						animationEffect: "material",
						animationDuration: 350,
						touch: false
					});
				}, pause);
			}

			$checkBox.change(function () {
				if ($(this).is(':checked')) {
					$.cookie('goodwinNewsLetter', 'yes', {
						expires: parseInt($newsletter.attr('data-expires'), 10)
					});
				} else {
					$.cookie('goodwinNewsLetter', null, {
						path: '/'
					});
				}
			});
			if ($('body[class*="home-page"]').length || $('body[class*="page-index"]').length) {
				checkCookie();
			}
		},
		hideEmptyFilters: function (columnFilter, columns, filter, mobFilter, filterRow) {
			if (!$(columnFilter).find(filter).length) {
				$(columnFilter).remove();
				$(columns).removeClass('invisible');
				$(mobFilter).remove();
			} else {
				$(columns).removeClass('invisible');
			}
			$(filterRow).removeClass('invisible');
		},
		sliderTextTopShift: function () {
			var SliderTextTopShift = {
				default: {
					header: '.hdr',
					text: '.bnslider-text-content-flex'
				},
				init: function (options) {
					$.extend(this.default, options);
					if (!isMobile && !$('.aside').length) {
						if ($(this.default.header).hasClass('hdr--transparent')) {
							$(this.default.header).addClass('visible');
							$(this.default.text).css({
								'padding-top': $(this.default.header).outerHeight() * .85
							})
						}
					} else {
						$(this.default.text).css({
							'padding-top': ''
						})
					}
					return this;
				},
				reinit: function () {
					this.init();
					return this;
				}
			}
			GOODWIN.slidertexttopshift = Object.create(SliderTextTopShift).init({
				header: '.hdr',
				text: '.bnslider-text-content-flex'
			});
		},
		sideFixed: function () {
			var SideFixed = {
				default: {
					el: '.side-fixed'
				},
				init: function (options) {
					$.extend(this.default, options);
					this.reinit();
				},
				reinit: function () {
					var $this = $(this.default.el);
					$this.css({
						'height': '100vh'
					});
					setTimeout(function () {
						$this.css({
							'height': $('body').height()
						});
					}, 500);
				}
			}
			GOODWIN.sidefixed = Object.create(SideFixed);
			GOODWIN.sidefixed.init();
		},
		loadingEmulate: function (btn) {
			function toggleBtn() {
				var btn = $(this);
				btn.addClass('btn--loading');
				setTimeout(function () {
					btn.removeClass('btn--loading');
				}, 5000)
			}

			$(btn).on('click', toggleBtn);
		},
		hideBeforeLoad: function (el, timeOut) {
			$(el).css('visibility', 'hidden');
			setTimeout(function () {
				$(el).css('visibility', '').addClass('loaded');
			}, timeOut);
		},
		countdown: function (countdown) {
			function removeCountdown($countdown) {
				if ($countdown.closest('.js-countdown-wrap').length) {
					$countdown.closest('.js-countdown-wrap').remove();
				} else $countdown.remove();
			}

			$(countdown).each(function () {
				var $countdown = $(this),
					promoperiod,
					isActual = false;
				if ($countdown.attr('data-promoperiod')) {
					promoperiod = parseInt($countdown.attr('data-promoperiod'), 10);
					isActual = promoperiod > 0;
					promoperiod = new Date().getTime() + promoperiod;
				}
				if ($countdown.attr('data-countdown')) {
					promoperiod = $countdown.attr('data-countdown');
					isActual = Date.parse(promoperiod) - Date.parse(new Date()) > 0;
				}
				if (isActual) {
					$countdown.countdown(promoperiod, function (event) {
						$countdown.html(event.strftime('<span><span>%D</span>DAYS</span>' + '<span><span>%H</span>HRS</span>' + '<span><span>%M</span>MIN</span>' + '<span><span>%S</span>SEC</span>'));
					}).on('finish.countdown', function () {
						removeCountdown($countdown);
					});
				} else {
					removeCountdown($countdown);
				}
			});
		},
		productTab: function (tab) {
			var $tabs = $(tab),
				setCurrent = false;
			$tabs.tabCollapse({
				accordion: false,
				tabsClass: 'd-none d-lg-flex',
				accordionClass: 'd-lg-none'
			});
			$('a', $tabs).each(function () {
				var $this = $(this);
				if ($this.parent('li').is('.active')) {
					var curTab = $this.attr("href");
					$(curTab).addClass('active');
					setCurrent = true;
				}
			});
			if (!setCurrent) {
				$('li:first-child a', $tabs).tab('show');
			}
			$document.on('click', '.js-tabcollapse-panel-heading', function () {
				var $panel = $(this).closest('.panel');
				if (!$panel.find('.panel-heading.active').length) return false;
				$('html,body').animate({
					scrollTop: $panel.offset().top - 60
				}, 0);
			})
		},
		accordionSetActive: function () {
			$('body').on('show.bs.collapse', '.panel-collapse', function (e) {
				$(e.currentTarget).siblings('.panel-heading').addClass('active');
			}).on('hide.bs.collapse', '.panel-collapse', function (e) {
				$(e.currentTarget).siblings('.panel-heading').removeClass('active');
			});
		},
		openAccordion: function (accordion) {
			if ($(accordion).find('.panel-heading.active')) return false;
			$(accordion).find('.panel-body').each(function () {
				var $this = $(this);
				if (!$.trim($this.html()).length) $this.closest('.panel').remove();
			}).promise().done($(accordion).find('.panel:first-child').find('.panel-title > a').trigger('click'));
		},
		flowtype: function () {
			var FlowType = {
				default: {
					maximum: 9999,
					minimum: 1,
					maxFont: 9999,
					minFont: 1
				},
				init: function (bnr) {
					var that = this;
					$(bnr).each(function () {
						var $this = $(this);
						$this.imagesLoaded(function () {
							var fontratio = Math.round($this.attr("data-fontratio") * 100) / 100;
							if (fontratio > 0) {
								that._changes($this, fontratio)
							}
						});
					});
				},
				hide: function (bnr) {
					var that = this;
					$(bnr).each(function () {
						$(this).removeClass('fontratio-calc');
					});
				},
				reinit: function (bnr) {
					var that = this;
					$(bnr).each(function () {
						var $this = $(this),
							fontratio = Math.round($this.attr("data-fontratio") * 100) / 100;
						$this.removeClass('fontratio-calc');
						if (fontratio > 0) {
							that._changes($this, fontratio)
						}
					});
				},
				_changes: function (el, fontRatio) {
					var $el = $(el),
						elw = $el.width(),
						width = elw > this.default.maximum ? this.default.maximum : elw < this.default.minimum ? this.default.minimum : elw,
						fontBase = width / fontRatio,
						fontSize = fontBase > this.default.maxFont ? this.default.maxFont : fontBase < this.default.minFont ? this.default.minFont : fontBase;
					$el.css('font-size', fontSize + 'px').addClass('fontratio-calc');
				}
			}
			GOODWIN.flowtype = Object.create(FlowType);
			GOODWIN.flowtype.init('.bnr[data-fontratio]');
		},
		footerCollapse: function (el) {
			$.fn.footerCollapse = function () {
				var $collapsed = this;
				$('.title', $collapsed).on('click', function (e) {
					e.preventDefault;
					$(this).closest('.collapsed-mobile').toggleClass('open');
				});
			};
			$(el).footerCollapse();
		},
		changeInput: function () {
			$(document).on('click', '.decrease, .increase', function (e) {
				var $this = $(e.target),
					input = $this.parent().find('.qty-input'),
					v = $this.hasClass('decrease') ? input.val() - 1 : input.val() * 1 + 1,
					min = input.attr('data-min') ? input.attr('data-min') : 1,
					max = input.attr('data-max') ? input.attr('data-max') : false;
				if (v >= min) {
					if (!max == false && v > max) {
						return false
					} else input.val(v);
				}
				e.preventDefault();
			});
			$(document).on('change', '.qty-input', function (e) {
				var input = $(e.target),
					min = input.attr('data-min') ? input.attr('data-min') : 1,
					max = input.attr('data-max'),
					v = input.val();
				if (v > max) input.val(max);
				else if (v < min) input.val(min);
			});
		},
		tooltipIni: function (tooltip) {
			$(tooltip).tooltip();
			$window.on('scroll', function () {
				$(tooltip).tooltip('hide');
			});
		},
		modalCountDown: function (modal) {
			var $modal = $(modal);
			if ($modal.length) {
				var counter;
				$modal.on('hidden.bs.modal', function () {
					var $modal = $(this);
					if ($modal.attr('data-interval') > 0) {
						$('.count', $modal).html('').fadeOut();
						clearInterval(counter);
					}
				});
				$modal.on('shown.bs.modal', function () {
					var interval = 0,
						$modal = $(this);
					if ($modal.attr('data-interval') > 0) {
						interval = $modal.attr('data-interval')
					}
					var count = interval / 1000;
					if (count > 0) {
						$('.modal--countdown', $modal).show();
						$('.count', $modal).html(count).fadeIn();
						counter = setInterval(function modalCount() {
							if (count > 0) {
								count -= 1;
								$('.count', $modal).html(count);
							} else {
								$modal.modal('hide').removeData('bs.modal');
								clearInterval(counter)
							}
						}, 1000);
					}
				});
			}
		},
		dependHeight: function (standart, depend, styled) {
			if ($(depend).length && $(standart).length) {
				var css = $(depend).attr("style"),
					style = styled + ':' + $(standart).outerHeight(true) + 'px';
				if (css === undefined) css = style;
				else css += style;
				$(depend).attr('style', css);
			}
		},
		reposInit: function () {
			var ReposBlock = {
				init: function (options) {
					this.default = options;
					if ($(this.default.mobile).closest('.prd-block--mobile-image-first').length) return false;
					this._reposBlock(w < this.default.reposBreakpoint);
					return this;
				},
				reinit: function (w) {
					if ($(this.default.mobile).closest('.prd-block--mobile-image-first').length) return false;
					this._reposBlock(w < this.default.reposBreakpoint);
					return this;
				},
				_reposBlock: function (isMobile) {
					var $prdInfoDesktop = $(this.default.desktop),
						$prdInfoMobile = $(this.default.mobile);
					if (isMobile) {
						if ($body.hasClass('prd-mob')) return false;
						$prdInfoDesktop.hide();
						if ($prdInfoDesktop.length) {
							$prdInfoDesktop.children().detach().appendTo($prdInfoMobile);
							$prdInfoMobile.show();
							$body.addClass('prd-mob').removeClass('prd-dsc');
						}
					} else {
						if ($body.hasClass('prd-dsc')) return false;
						$prdInfoMobile.hide();
						if ($prdInfoMobile.length) {
							$prdInfoMobile.children().detach().appendTo($prdInfoDesktop);
							$prdInfoDesktop.show();
							$body.addClass('prd-dsc').removeClass('prd-mob');
						}
					}
				}
			}
			GOODWIN.prdrepos1 = Object.create(ReposBlock);
			GOODWIN.prdrepos1.init({
				desktop: '.prd-block--creative .js-prd-d-holder',
				mobile: '.prd-block--creative .js-prd-m-holder',
				reposBreakpoint: maxSM
			});
			GOODWIN.prdrepos = Object.create(ReposBlock);
			GOODWIN.prdrepos.init({
				desktop: '#prdGallery100 .js-prd-d-holder',
				mobile: '#prdGallery100 .js-prd-m-holder',
				reposBreakpoint: maxSM
			});
		},
		insideCarousel: function (el) {
			$.fn.insideCarousel = function () {
				var $carousel = this,
					next = '.carousel-control.next',
					prev = '.carousel-control.prev';
				$carousel.carousel({
					interval: false
				});
				$(document).on('click', next, function () {
					$(this).parent().carousel('next');
				});
				$(document).on('click', prev, function () {
					$(this).parent('.carousel-inside').carousel('prev');
				});
			};
			$(el).insideCarousel();
		},
		initLetItSnow: function initLetItSnow(el, mCount, dCount) {
			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
					window.setTimeout(callback, 1000 / 60);
				};
			window.requestAnimationFrame = requestAnimationFrame;
			var flakes = [],
				canvas = $(el)[0],
				ctx = canvas.getContext("2d"),
				mX = -100,
				mY = -100;
			if (isMobile) {
				var flakeCount = mCount;
			} else {
				var flakeCount = dCount;
			}
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			function snow() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				for (var i = 0; i < flakeCount; i++) {
					var flake = flakes[i],
						x = mX,
						y = mY,
						minDist = 250,
						x2 = flake.x,
						y2 = flake.y;
					var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
						dx = x2 - x,
						dy = y2 - y;
					if (dist < minDist) {
						var force = minDist / (dist * dist),
							xcomp = (x - x2) / dist,
							ycomp = (y - y2) / dist,

							// deltaV = force / 2;
							deltaV = force;
						flake.velX -= deltaV * xcomp;
						flake.velY -= deltaV * ycomp;
					} else {
						flake.velX *= .98;
						if (flake.velY <= flake.speed) {
							flake.velY = flake.speed;
						}
						flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
					}
					ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
					flake.y += flake.velY;
					flake.x += flake.velX;
					if (flake.y >= canvas.height || flake.y <= 0) {
						reset(flake);
					}
					if (flake.x >= canvas.width || flake.x <= 0) {
						reset(flake);
					}
					ctx.beginPath();
					ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
					ctx.fill();
				}
				requestAnimationFrame(snow);
			};
			function reset(flake) {
				flake.x = Math.floor(Math.random() * canvas.width);
				flake.y = 0;
				flake.size = Math.random() * 3 + 5;
				flake.speed = Math.random() * 1 + 0.5;
				flake.velY = flake.speed;
				flake.velX = 0;
				flake.opacity = Math.random() * 0.5 + 0.3;
			}
			function init() {
				for (var i = 0; i < flakeCount; i++) {
					var x = Math.floor(Math.random() * canvas.width),
						y = Math.floor(Math.random() * canvas.height),
						size = Math.random() * 3 + 4,
						speed = Math.random() * 1 + 0.5,
						opacity = Math.random() * 0.5 + 0.3;
					flakes.push({
						speed: speed,
						velY: speed,
						velX: 0,
						x: x,
						y: y,
						size: size,
						stepSize: Math.random() / 160,
						step: 0,
						opacity: opacity
					});
				}
				snow();
			};
			$window.on("resize", function () {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			});
			init();
		}
	};
	GOODWIN.header = {
		init: function () {
			//this.mobileMenu('.mobilemenu');
			this.headerDrop();
			this.scrollMenuInit({
				menu: '.hdr-onerow-menu .mmenu-js',
				arrowPrev: '.prev-menu-js',
				arrowNext: '.next-menu-js',
				bodyFlagClass: 'has-scrollmenu',
				scrollStep: 10, // scroll menu step in px
				scrollSpeed: 4 // scroll menu speed in msec
			});
			this.miniCartInit({
				headerCart: '.minicart-js',
				toggleBtn: '.minicart-link',
				closeBtn: '.minicart-drop-close',
				dropdn: '.minicart-drop',
				header: '.hdr',
				sticky: '.sticky-holder',
				stickyFlag: 'has-sticky'
			});
			this.megaMenu();
			this.mmobilePush();
			this.searchAutoFill('.js-search-autofill', 'a', '.search-input');
			//this.collapseCategory('.hdr-category', '.hdr .mmenu--vertical.mmenu-js');
		},
		promoTopline: function (topline, close) {
			var $topline = $(topline),
				$close = $(close),
				speed = 300,
				timeout = 1000;
			if ($('.hdr-mobile-style2').length && isMobile) {
				speed = 100;
				timeout = 0;
			}

			function checkCookie() {
				if ($.cookie('goodwinPromoTopLine') != 'yes') {
					setTimeout(function () {
						$topline.slideDown(speed, function () {
							promoToplineHeight = $topline.outerHeight();
							if (GOODWIN.stickyheader) GOODWIN.stickyheader.setHeaderHeight();
						});
					}, timeout);
				} else {
					$topline.slideUp(0);
					promoToplineHeight = 0;
					if (GOODWIN.stickyheader) GOODWIN.stickyheader.setHeaderHeight();
				}
			}

			$close.on('click', function () {
				if ($('body').hasClass('demo')) {
					$topline.slideUp(speed);
					promoToplineHeight = 0;
					if (GOODWIN.stickyheader) GOODWIN.stickyheader.setHeaderHeight();
				} else {
					$.cookie('goodwinPromoTopLine', 'yes', {
						expires: parseInt($topline.attr('data-expires'), 10)
					});
					checkCookie();
				}
			});
			checkCookie();
		},
		collapseCategory: function (btn, menu) {
			var $menu = $(menu),
				$button = $(btn);
			$button.on('mouseenter', function (e) {
				$button.addClass('opened');
				$menu.stop(true, false).slideDown();
				GOODWIN.flowtype.reinit(menu + '.bnr[data-fontratio]');
				e.preventDefault();
			}).on('mouseleave', function (e) {
				$button.removeClass('opened');
				$menu.stop(true, false).slideUp();
				e.preventDefault();
			})
		},
		searchAutoFill: function (parent, link, target) {
			$(parent).find(link).on('click', function (e) {
				if ($(target).val() == $(this).html()) {
					return false;
				}
				$(target).val($(this).html()).focus().trigger('keyup');
				e.preventDefault();
			})
		},
		mobileMenu: function () {
			var MobileMenu = {
				MobileMenuData: {
					mobilemenu: '.mobilemenu',
					toggleMenu: '.mobilemenu-toggle',
					mobileCaret: '.js-accordion-mbmenu ul.nav li .arrow',
					mobileLink: '.js-accordion-mbmenu ul.nav li > a',
					search: '.dropdn_search .dropdn-content, .search-holder',
					currency: '.dropdn_currency',
					lang: '.dropdn_language',
					settings: '.dropdn_settings_',
					searchMobile: '.mobilemenu-search',
					currencyMobile: '.mobilemenu-currency',
					langMobile: '.mobilemenu-language',
					settingsMobile: '.mobilemenu-settings_',
					headerM: '.hdr-mobile',
					headerD: '.hdr-desktop',
					logo: '.hdr-desktop .logo-holder',
					cart: '.hdr-desktop .minicart-holder',
					links: '.hdr-desktop .links-holder',
					logoMobile: '.hdr-mobile .logo-holder',
					cartMobile: '.hdr-mobile .minicart-holder',
					linksMobile: '.hdr-mobile .links-holder'
				},
				init: function (options) {
					$.extend(this.MobileMenuData, options);
					var obj = {
						$mobilemenu: $(this.MobileMenuData.mobilemenu),
						$toggleMenu: $(this.MobileMenuData.toggleMenu),
						$mobileCaret: $(this.MobileMenuData.mobileCaret),
						$mobileLink: $(this.MobileMenuData.mobileLink),
						$search: $(this.MobileMenuData.search),
						$lang: $(this.MobileMenuData.lang),
						$currency: $(this.MobileMenuData.currency),
						$settings: $(this.MobileMenuData.settings),
						$searchMobile: $(this.MobileMenuData.searchMobile),
						$langMobile: $(this.MobileMenuData.langMobile),
						$currencyMobile: $(this.MobileMenuData.currencyMobile),
						$settingsMobile: $(this.MobileMenuData.settingsMobile),
						$headerM: $(this.MobileMenuData.headerM),
						$headerD: $(this.MobileMenuData.headerD),
						$logo: $(this.MobileMenuData.logo),
						$cart: $(this.MobileMenuData.cart),
						$links: $(this.MobileMenuData.links),
						$logoMobile: $(this.MobileMenuData.logoMobile),
						$cartMobile: $(this.MobileMenuData.cartMobile),
						$linksMobile: $(this.MobileMenuData.linksMobile)
					}
					$.extend(this.MobileMenuData, obj);
					if ($(this.MobileMenuData.menu).length) {
						this._handlers(this);
					}
					if (isMobile) {
						this._mobileEvent();
						this._attachMenu();
					} else if ($('.hdr').hasClass('slide-menu')) {
						this._mobileEvent();
						this._attachMenuD();
					}
				},
				reinit: function () {
					this.MobileMenuData.$mobileLink.off('click.mobileMenu');
					this.MobileMenuData.$mobileCaret.off('click.mobileMenu');
					if (!isMobile) {
						if (!$('.hdr').hasClass('slide-menu')) {
							$('body').removeClass('is-fixed');
							this.MobileMenuData.$mobilemenu.removeClass('active');
							this.MobileMenuData.$toggleMenu.removeClass('active');
							this._detachMenu();
						} else {
							this._mobileEvent();
							this._detachMenu();
							this._attachMenuD();
						}
					} else if ($('.hdr').hasClass('slide-menu')) {
						this._mobileEvent();
						this._detachMenuD();
						this._attachMenu();
					} else {
						this._mobileEvent();
						this._attachMenu();
					}
				},
				_handlers: function () {
					var _ = this.MobileMenuData;
					_.$toggleMenu.on('click.mobileMenu', function () {
						_.$mobilemenu.toggleClass('active');
						_.$toggleMenu.toggleClass('active');
						$('body').toggleClass('slidemenu-open');
						if (isMobile) {
							if ($('body').hasClass('is-fixed')) {
								setTimeout(function () {
									$('body').removeClass('is-fixed');
									$('.mobilemenu-scroll').scrollLock('disable');
								}, 500);
							} else {
								$('body').addClass('is-fixed');
								$('.mobilemenu-scroll').scrollLock('enable');
							}
						}
						return false;
					});
					_.$mobilemenu.on('click.mobileMenu', function (e) {
						if ($(e.target).is(_.$mobilemenu)) {
							_.$mobilemenu.toggleClass('active');
							_.$toggleMenu.toggleClass('active');
							$('body').toggleClass('slidemenu-open');
							if (isMobile) {
								if ($('body').hasClass('is-fixed')) {
									setTimeout(function () {
										$('body').removeClass('is-fixed');
										$('.mobilemenu-scroll').scrollLock('disable');
									}, 500);
								} else {
									$('body').addClass('is-fixed');
									$('.mobilemenu-scroll').scrollLock('enable');
								}
							}
							e.preventDefault();
						}
					});
				},
				_attachMenuD: function () {
					var _ = this.MobileMenuData;
					if (_.$search.length) {
						_.$search.find('.container').detach().appendTo(_.$searchMobile);
					}
					if (_.$lang.length) {
						_.$lang.find('.dropdn').detach().appendTo(_.$langMobile);
					}
					if (_.$currency.length) {
						_.$currency.find('.dropdn').detach().appendTo(_.$currencyMobile);
					}
					if (_.$settings.length) {
						_.$settings.find('.dropdn').detach().appendTo(_.$settingsMobile);
					}
				},
				_attachMenu: function () {
					var _ = this.MobileMenuData;
					if (_.$search.length) {
						_.$search.find('.container').detach().appendTo(_.$searchMobile);
					}
					if (_.$currency.length) {
						_.$currency.find('.dropdn').detach().appendTo(_.$currencyMobile);
					}
					if (_.$lang.length) {
						_.$lang.find('.dropdn').detach().appendTo(_.$langMobile);
					}
					if (_.$settings.length) {
						_.$settings.find('.dropdn').detach().appendTo(_.$settingsMobile);
					}
					if (_.$cart.length) {
						_.$cart.children().detach().appendTo(_.$cartMobile);
					}
					if (_.$links.length) {
						if (!$.trim(_.$linksMobile.html())) {
							if (_.$links.length > 1) {
								_.$linksMobile.html('');
								_.$links.each(function (i) {
									_.$linksMobile.append('<div class="links-mobile-holder-' + i + '"></div>');
									$(this).addClass('links-holder-' + i);
									$(this).children().detach().appendTo(".links-mobile-holder-" + i, _.$linksMobile);
								})
							} else _.$links.children().detach().appendTo(_.$linksMobile);
						}
					}
				},
				_detachMenuD: function () {
					var _ = this.MobileMenuData;
					if (_.$searchMobile.length) {
						_.$searchMobile.find('.container').detach().appendTo(_.$search);
					}
					if (_.$currencyMobile.length) {
						_.$currencyMobile.find('.dropdn').detach().appendTo(_.$currency);
					}
					if (_.$langMobile.length) {
						_.$langMobile.find('.dropdn').detach().appendTo(_.$lang);
					}
					if (_.$settingsMobile.length) {
						_.$settingsMobile.find('.dropdn').detach().appendTo(_.$settings);
					}
				},
				_detachMenu: function () {
					var _ = this.MobileMenuData;
					if (_.$searchMobile.length) {
						_.$searchMobile.find('.container').detach().appendTo(_.$search);
					}
					if (_.$currencyMobile.length) {
						_.$currencyMobile.find('.dropdn').detach().appendTo(_.$currency);
					}
					if (_.$langMobile.length) {
						_.$langMobile.find('.dropdn').detach().appendTo(_.$lang);
					}
					if (_.$settingsMobile.length) {
						_.$settingsMobile.find('.dropdn').detach().appendTo(_.$settings);
					}
					if (_.$cartMobile.length) {
						_.$cartMobile.children().detach().appendTo(_.$cart);
					}
					if (_.$linksMobile.length) {
						if (_.$links.length > 1) {
							_.$links.each(function (i) {
								$(".links-mobile-holder-" + i, _.$linksMobile).children().detach().appendTo(".links-holder-" + i);
							})
							_.$linksMobile.html('');
						} else _.$linksMobile.children().detach().appendTo(_.$links);
					}
				},
				_mobileEvent: function () {
					var _ = this.MobileMenuData;
					_.$mobileCaret.on('click.mobileMenu', function (e) {
						e.preventDefault();
						var $parent = $(this).parent();
						if ($parent.hasClass('mmenu-submenu-open')) {
							$('li.mmenu-submenu-open ul', $parent).slideUp(200);
							$('li', $parent).removeClass('mmenu-submenu-open');
							$parent.removeClass('mmenu-submenu-open');
							$('> ul', $parent).slideUp(200);
							$parent.removeData('firstclick');
						} else {
							$parent.addClass('mmenu-submenu-open');
							$(' > ul', $parent).slideDown(200);
							$parent.data('firstclick', true);
						}
					});
					if (_.$mobilemenu.hasClass('dblclick')) {
						_.$mobileLink.on('click.mobileMenu', function (e) {
							e.preventDefault();
							var $parent = $(this).parent();
							if (!$parent.data('firstclick') && $parent.find('ul').length) {
								$parent.addClass('mmenu-submenu-open');
								$(' > ul', $parent).slideDown(200);
								$parent.data('firstclick', true);
							} else {
								var href = $(this).attr("href"),
									target = $(this).attr("target") ? $(this).attr("target") : '_self';
								window.open(href, target);
								$parent.removeData('firstclick');
							}
						});
					}
				}
			}
			GOODWIN.mobilemenu = Object.create(MobileMenu);
			GOODWIN.mobilemenu.init({
				menu: '.mobilemenu'
			});
		},
		megaMenu: function () {
			var MegaMenu = {
				MegaMenuData: {
					header: '.hdr',
					menu: '.mmenu-js',
					submenu: '.mmenu-submenu',
					toggleMenu: '.toggleMenu',
					simpleDropdn: '.mmenu-item--simple',
					megaDropdn: '.mmenu-item--mega',
					headerCart: '.minicart-js',
					headerCartToggleBtn: '.minicart-link',
					headerCartDropdn: '.minicart-drop',
					dropdn: '.dropdn',
					vertical: false,
					titleHeight: 50
				},
				init: function (options) {
					$.extend(this.MegaMenuData, options);
					if ($(this.MegaMenuData.menu).length) {
						MegaMenu._handlers(this);
					}
				},
				_handlers: function (menu) {
					function setMaxHeight(wHeight, submenu) {
						if ($menu.hasClass('mmenu--vertical')) return false;
						if (submenu.length) {
							var maxH = $('body').hasClass('has-sticky') ? (wHeight - $header.find('.sticky-holder').outerHeight()) : (wHeight - submenu.prev().offset().top - submenu.prev().outerHeight());
							submenu.children(':first').css({
								'max-height': maxH + 'px'
							})
						}
					}

					function clearMaxHeight() {
						$submenu.each(function () {
							var $this = $(this);
							$this.css({
								'max-height': ''
							});
						})
					}

					var $menu = $(menu.MegaMenuData.menu),
						submenu = menu.MegaMenuData.submenu,
						$submenu = $(menu.MegaMenuData.submenu, $menu),
						$header = $(menu.MegaMenuData.header),
						$toggleMenu = $(menu.MegaMenuData.toggleMenu),
						megaDropdnClass = menu.MegaMenuData.megaDropdn,
						simpleDropdnClass = menu.MegaMenuData.simpleDropdn,
						vertical = menu.MegaMenuData.vertical,
						$headerCart = $(menu.MegaMenuData.headerCart),
						$headerCartToggleBtn = $headerCart.find(menu.MegaMenuData.headerCartToggleBtn),
						$headerCartDropdn = $headerCart.find(menu.MegaMenuData.headerCartDropdn),
						$dropdn = $(menu.MegaMenuData.dropdn, $header);
					if (vertical && (window.innerWidth || $window.width()) < 1024) {
						$menu.on("click.mmenu", ".submenu a", function (e) {
							var $this = $(this);
							if (!$this.data('firstclick')) {
								$this.data('firstclick', true);
								e.preventDefault();
							}
						});
						$menu.on("click.mmenu", megaDropdnClass + '> a,' + simpleDropdnClass + '> a', function (e) {
							if (!$(this).parent('li').hasClass('hovered')) {
								setMaxHeight($window.height(), $(this).next());
								$submenu.scrollTop(0);
								$('li', $menu).removeClass('hovered');
								$(this).parent('li').addClass('hovered');
								e.preventDefault();
							} else {
								clearMaxHeight();
								$(this).parent('li').removeClass('hovered');
								$(submenu + 'a').removeData('firstclick');
							}
						});
						$menu.on("click.mmenu", function (e) {
							e.stopPropagation();
						})
					} else if ($('body').hasClass('touch') && $(window).width() < 1024) {
						$menu.on("click.mmenu", ".submenu a", function (e) {
							var $this = $(this);
							if (!$this.data('firstclick')) {
								$this.data('firstclick', true);
								e.preventDefault();
							}
						});
						$menu.on("click.mmenu", megaDropdnClass + '> a,' + simpleDropdnClass + '> a', function (e) {
							if (!$(this).parent('li').hasClass('hovered')) {
								setMaxHeight($window.height(), $(this).next());
								$submenu.scrollTop(0);
								$('li', $menu).removeClass('hovered');
								$(this).parent('li').addClass('hovered');
								e.preventDefault();
							} else {
								clearMaxHeight();
								$(this).parent('li').removeClass('hovered');
								$(submenu + 'a', $menu).removeData('firstclick');
							}
						});
						$menu.on("click.mmenu", function (e) {
							e.stopPropagation();
						})
					} else {
						$menu.on("mouseenter", megaDropdnClass + '> a,' + simpleDropdnClass + '> a', function () {
							var $this = $(this),
								$submenu = $this.next(submenu);
							setMaxHeight($(window).height(), $submenu);
							$submenu.scrollTop(0);
							$this.parent('li').addClass('hovered');
							if ($headerCartDropdn.hasClass('opened')) {
								$headerCartToggleBtn.trigger('click')
							}
							$dropdn.each(function () {
								var $this = $(this);
								if ($this.hasClass('is-hovered')) {
									$('>a', $this).trigger('click')
								}
							})
							if ($('body').hasClass('has-scrollmenu') && $this.closest(simpleDropdnClass).length) {
								$this.next().css({
									'margin-left': -$menu.parent().scrollLeft()
								})
							}
						}).on("mouseleave", megaDropdnClass + ',' + simpleDropdnClass, function () {
							clearMaxHeight();
							var $this = $(this);
							$this.removeClass('hovered');
						});
					}
					$toggleMenu.on('click', function (e) {
						var $this = this;
						$header.toggleClass('open');
						$this.toggleClass('open');
						$menu.addClass('disable').delay(1000).queue(function () {
							$this.removeClass('disable').dequeue();
						});
						e.preventDefault();
					});
					if (vertical) {
						$('li.mmenu-item--simple', $menu).on('mouseenter', function () {
							var $this = $(this),
								$elm = $('.mmenu-submenu', this).length ? $('.mmenu-submenu', this) : $('ul:first', this),
								windowH = $window.height(),
								isYvisible = (windowH + $window.scrollTop()) - ($elm.offset().top + $elm.outerHeight());
							if (isYvisible < 0 && !$this.hasClass('mmenu-item--mega')) {
								$elm.css({
									'margin-top': isYvisible + 'px'
								});
							}
						})
					}
					$('li', $submenu).on('mouseenter', function () {
						var $this = $(this).addClass('active');
						if ($('> a .mmenu-preview', $this).length) {
							var $ul = $this.closest('ul'),
								$img = $('.mmenu-preview', $this);
							$ul.css({
								'min-width': '',
								'overflow': ''
							});
							$ul.css({
								'min-width': 454,
								'overflow': 'hidden'
							});
							$ul.append($img.clone());
						}
						if ($('ul', $this).length) {
							var $elm = $('.mmenu-submenu', this).length ? $('.mmenu-submenu', this) : $('ul:first', this),
								windowW = window.innerWidth || $window.width(),
								windowH = $window.height(),
								isXvisible,
								isYvisible,
								menuItemPos = $this.position();
							if ($this.closest('.mmenu-item--mega').length) {
								if (!$('body').hasClass('rtl')) {
									$elm.css({
										top: menuItemPos.top,
										left: menuItemPos.left + Math.round($this.outerWidth())
									});
								} else {
									$elm.css({
										top: menuItemPos.top,
										left: menuItemPos.left - $elm.outerWidth()
									});
								}
							}
							if ($elm.hasClass('sub-level')) {
								$elm.closest('.mmenu-submenu').addClass('mmenu--not-hide')
								//.css({'padding-right': scrollWidth + 'px'});
							}
							isXvisible = $('body').hasClass('rtl') ? $elm.offset().left >= 0 : ($elm.offset().left + $elm.width()) <= windowW,
								isYvisible = (windowH + $window.scrollTop()) - ($elm.offset().top + $elm.outerHeight());
							if (!isXvisible) {
								$this.addClass('to-right');
							} else {
								$this.removeClass('to-right');
							}
							if (isYvisible < 0) {
								$elm.css({
									'margin-top': isYvisible + 'px'
								});
							}
						}
					}).on('mouseleave', function () {
						var $elm = $('.mmenu-submenu', this).length ? $('.mmenu-submenu', this) : $('ul:first', this);
						var $this = $(this).removeClass('to-right').removeClass('active');
						if ($('> a .mmenu-preview', $this).length) {
							var $ul = $this.closest('ul');
							$ul.css({
								'min-width': '',
								'overflow': ''
							});
							$ul.find('>.mmenu-preview').remove();
						}
						$elm.css({
							'margin-top': ''
						});
						if (!$this.closest('.sub-level').length) {
							$elm.closest('.mmenu-submenu').removeClass('mmenu--not-hide').css({
								'padding-right': ''
							});
						}
					})
				}
			};
			GOODWIN.megamenu = Object.create(MegaMenu);
			GOODWIN.megamenu.init({
				menu: '.mmenu-js'
			});
			GOODWIN.vmegamenu = Object.create(MegaMenu);
			GOODWIN.vmegamenu.init({
				menu: '.vmmenu-js',
				vertical: true
			});
		},
		mmobilePush: function () {
			var mMenuPush = function () {
				this.curItem,
					this.curLevel = 0;
				var defaults = {
					initElem: ".mobilemenu",
					menuTitle: "Menu"
				}
				if (arguments[0] && typeof arguments[0] === "object") {
					this.options = extendDefaults(defaults, arguments[0]);
				}

				function extendDefaults(source, extender) {
					for (var option in extender) {
						if (source.hasOwnProperty(option)) {
							source[option] = extender[option];
						}
					}
				}

				mMenuPush.prototype.setHeigth = function () {
					$('.nav-wrapper').css({
						"height": $('mmenu-submenu-active .nav-level-' + (this.curLevel + 1)).outerHeight()
					});
				};
				(function (mMenuPush) {
					var initElem = ($(defaults.initElem).length) ? $(defaults.initElem) : false;
					if (initElem) {
						defaults.initElem = initElem;
						_clickHandlers(mMenuPush);
						_updateMenuTitle(mMenuPush);
						$('.nav-wrapper').css({
							"height": $('.nav-wrapper ul.nav').outerHeight()
						})
					}
				}(this));

				function _clickHandlers(menu) {
					defaults.initElem.on('click', 'a', function (e) {
						if ($(e.target).parent('li').find('ul').length) {
							e.preventDefault();
							menu.curItem = $(this).parent();
							_updateActiveMenu(menu);
						}
					});
					defaults.initElem.on('click', '.nav-toggle', function () {
						_updateActiveMenu(menu, 'back');
					});
				};

				function _updateActiveMenu(menu, direction) {
					_slideMenu(menu, direction);
					if (direction === "back") {
						var curItem = menu.curItem;
						setTimeout(function () {
							curItem.removeClass('mmenu-submenu-open mmenu-submenu-active');
						}, 300);
						menu.curItem = menu.curItem.parent().closest('li');
						menu.curItem.addClass('mmenu-submenu-open mmenu-submenu-active');
						_updateMenuTitle(menu);
					} else {
						menu.curItem.addClass('mmenu-submenu-open mmenu-submenu-active');
						_updateMenuTitle(menu);
					}
				};

				function _updateMenuTitle(menu) {
					var title = defaults.menuTitle;
					if (menu.curLevel > 0) {
						title = menu.curItem.children('a').html();
						defaults.initElem.find('.nav-toggle').addClass('back-visible');
					} else {
						defaults.initElem.find('.nav-toggle').removeClass('back-visible');
					}
					$('.nav-title').html(title);
				};

				function _updateHeight(menu) {
					if (menu.curLevel > 0) {
						menu.curItem.children('ul').css({
							"padding-top": defaults.initElem.find('.nav-toggle').outerHeight()
						});
						$('.nav-wrapper').css({
							"height": menu.curItem.children('ul').outerHeight()
						});
					} else {
						$('.nav-wrapper').css({
							"height": $('.nav-wrapper .nav-level-1').outerHeight()
						});
					}
				}

				function _slideMenu(menu, direction) {
					if (direction === "back") {
						menu.curLevel = (menu.curLevel > 0) ? menu.curLevel - 1 : 0;
						setTimeout(function () {
							_updateHeight(menu);
						}, 300);
					} else {
						menu.curLevel += 1;
						setTimeout(function () {
							_updateHeight(menu);
						}, 100);
					}
					defaults.initElem.children('ul').css({
						"transform": "translateX(-" + (menu.curLevel * 100) + "%)"
					});
				};
			}
			GOODWIN.mobilemenupush = new mMenuPush({
				initElem: ".js-push-mbmenu .nav-wrapper"
			});
		},
		headerDrop: function () {
			var HeaderDrop = (function (options) {
				var data = {
					dropLink: '.js-dropdn-link',
					dropLinkParent: '.dropdn',
					dropClose: '.dropdn-close'
				};

				function HeaderDrop(options) {
					$.extend(data, options);
					this.init()
				}

				HeaderDrop.prototype = $.extend({}, HeaderDrop.prototype, {
					init: function (options) {
						this._handlers();
						return this;
					},
					reinit: function (windowW) {
						if (!isMobile) {
							this._hideDrop();
						}
						this._handlers();
						return this;
					},
					_handlers: function () {
						var that = this,
							$dropLink = $(data.dropLink),
							$dropLinkParent = $dropLink.closest(data.dropLinkParent),
							$dropClose = $(data.dropClose, $dropLinkParent);
						if (isMobile) {
							if (!$dropLink.data('mclick')) {
								$dropClose.off('.dropdn');
								$dropLink.off('.dropdn');
								$dropLinkParent.off('.dropdn');
								$document.off('.dropdn');
								$dropLink.on('click.dropdn', function (e) {
									var $this = $(this);
									if ($this.closest('.mobilemenu').length) {
										$this.parent().toggleClass('is-hovered');
									} else if ($this.next().length) {
										if ($this.parent().hasClass('is-hovered')) {
											$this.parent().removeClass('is-hovered');
											setTimeout(function () {
												$('body').removeClass('is-fixed');
											}, 500);
											$this.next().find('ul').scrollLock('disable');
										} else {
											$dropLink.parent().removeClass('is-hovered');
											$this.parent().addClass('is-hovered');
											$this.next().find('ul').scrollLock('enable');
										}
									}
									e.preventDefault();
								});
								$dropLinkParent.on('click.dropdn', function (e) {
									if ($(e.target).is($('.dropdn-content')) && !$(e.target).closest('.mobilemenu').length) {
										$dropLinkParent.removeClass('is-hovered');
										setTimeout(function () {
											$('body').removeClass('is-fixed');
										}, 500);
										$dropLinkParent.find('ul').scrollLock('disable');
										e.preventDefault();
									}
								});
								$dropClose.on('click.dropdn', function (e) {
									if (!$(this).closest('.mobilemenu').length) {
										$dropLink.parent().removeClass('is-hovered');
										setTimeout(function () {
											$('body').removeClass('is-fixed');
										}, 500);
										$dropLink.parent().find('ul').scrollLock('disable');
									}
									e.preventDefault();
								});
								$dropLink.data('mclick', true);
								$dropLink.removeData('hover');
								$dropLink.removeData('click');
							}
						} else if ($('body').hasClass('is-dropdn-click')) {
							if (!$dropLink.data('click')) {
								$dropClose.off('.dropdn');
								$dropLink.off('.dropdn');
								$dropLinkParent.on('.dropdn');
								$dropLinkParent.off('.dropdn');
								$dropLink.on('click.dropdn', function (e) {
									var $this = $(this);
									if ($this.next().length) {
										if ($this.parent().hasClass('is-hovered')) {
											$this.parent().removeClass('is-hovered');
											setTimeout(function () {
												$this.next().find('.search-input').val('');
											}, 500);
										} else {
											$dropLink.parent().removeClass('is-hovered');
											$this.parent().addClass('is-hovered');
											$this.next().css({
												'min-height': that._getDropHeight($this) + 'px',
												'top': that._getDropPos($this) + 'px'
											});
											if ($this.parent().hasClass('dropdn_search')) {
												setTimeout(function () {
													$this.next().find('.search-input').focus()
												}, 100);
											}
										}
										e.preventDefault();
									}
								});
								$document.on('click.dropdn', function (e) {
									var $this = $(e.target);
									if (!$this.closest('.dropdn').length) {
										$dropLinkParent.removeClass('is-hovered');
										setTimeout(function () {
											if ($this.next().find('.search-input').length) {
												$this.next().find('.search-input').val('');
											}
										}, 500);
									}
								});
								$dropClose.on('click.dropdn', function (e) {
									var $this = $(e.target);
									$dropLink.parent().removeClass('is-hovered');
									setTimeout(function () {
										$this.next().find('.search-input').val('');
									}, 500);
									e.preventDefault();
								});
								$dropLink.data('click', true);
								$dropLink.removeData('mclick');
								$dropLink.removeData('hover');
							}
						} else {
							if (!$dropLink.data('hover')) {
								$dropLink.off('.dropdn');
								$document.off('.dropdn');
								$dropLinkParent.off('.dropdn');
								$dropLink.on('mouseenter.dropdn', function () {
									var $this = $(this);
									if ($this.next().length) {
										$dropLink.parent().removeClass('is-hovered');
										$this.parent().addClass('is-hovered');
										if (!$this.closest('.mobilemenu').length) $this.next().css({
											'min-height': getDropHeight($this) + 'px',
											'top': getDropPos($this) + 'px'
										});
									}
								});
								$dropLinkParent.on('mouseleave.dropdn', function () {
									var $this = $(this);
									$this.removeClass('is-hovered');
								});
								$dropLink.data('hover', true);
								$dropLink.removeData('click');
							}
						}
					},
					_getDropHeight: function (dropdn) {
						var h;
						if (dropdn.closest('.container').parent().next().length) {
							h = dropdn.closest('.container').parent().next().outerHeight();
						} else if (dropdn.closest('.container').parent().prev().length) {
							h = dropdn.closest('.container').parent().prev().outerHeight();
						}
						return h + 1;
					},
					_getDropPos: function (dropdn) {
						var $parent = dropdn.closest('.container').parent();
						if ($parent.length) {
							if ($('.hdr').hasClass('hdr-style-4') && dropdn.parent().hasClass('dropdn_search')) {
								return $parent.outerHeight();
							} else if ($('.hdr').hasClass('hdr-style-5') && !dropdn.closest('.hdr-topline').length) {
								return $parent.outerHeight();
							} else if ($('.hdr').hasClass('hdr-style-11') && dropdn.closest('.hdr-topline').length) {
								return $('.hdr-desktop .hdr-content').offset().top;
							} else if ($('.hdr').hasClass('hdr-style-2') || $('.hdr').hasClass('hdr-style-7') || $('.hdr').hasClass('hdr-style-8') || $('.hdr').hasClass('hdr-style-11') || $('.hdr').hasClass('hdr-style-12')) {
								return $parent.outerHeight();
							} else return $parent.outerHeight() + $parent.offset().top;
						}
					},
					_hideDrop: function () {
						$('body').removeClass('is-fixed');
						$(data.dropLink).parent().removeClass('is-hovered');
						$(data.dropLink).next().css({
							'min-height': '',
							'top': ''
						});
					}
				})
				return HeaderDrop;
			})();
			GOODWIN.headerdrop = new HeaderDrop();
		},
		scrollMenuInit: function (data) {
			var ScrollMenu = (function (options) {
				var initialized = false;
				var data = {
					headerNone: '.hdr.slide-menu',
					headerOneRowMenu: '.hdr-onerow-menu',
					menu: '.mmenu-js',
					arrowPrev: '.prev-menu-js',
					arrowNext: '.next-menu-js',
					bodyFlagClass: 'has-scrollmenu',
					scrollStep: 10,
					scrollSpeed: 4
				};

				function ScrollMenu(options) {
					$.extend(data, options);
					this.init()
				}

				ScrollMenu.prototype = $.extend({}, ScrollMenu.prototype, {
					init: function () {
						if ($(data.headerNone).length || !$(data.headerOneRowMenu).length) return false;
						initialized = true;
						this._handlers();
						this._isScroll($(data.menu), isMobile);
						return this;
					},
					reinit: function () {
						if ($(data.headerNone).length || !$(data.headerOneRowMenu).length) return false;
						var $this = $(data.menu);
						if (initialized) {
							this._isScroll($(data.menu), isMobile);
							return $this;
						} else return false;
					},
					// destroy
					destroy: function () {
						var $this = $(data.menu),
							$menuWrap = $this.parent(),
							options = $this.data('options');
						if ($this.data('initialized')) {
							$this.removeData('initialized');
							$menuWrap.animate({
								scrollLeft: 0
							}, 0);
							$(data.arrowNext + ',' + data.arrowPrev).off('.scrollmenu');
							$('body').removeClass(data.bodyFlagClass);
						} else return false;
					},
					// handlers
					_handlers: function () {
						var $this = $(data.menu),
							$menuWrap = $this.parent(),
							step;

						function scroll(menu) {
							var $menu = menu;
							$menu.animate({
								scrollLeft: step
							}, data.scrollSpeed, 'linear', function () {
								(step !== 0) ? scroll($menu) : false
							});
							$menu.scrollLeft() + $menu.innerWidth() >= $menu[0].scrollWidth ? $(data.arrowNext).addClass('disable') : $(data.arrowNext).removeClass('disable');
							$menu.scrollLeft() > 0 ? $(data.arrowPrev).removeClass('disable') : $(data.arrowPrev).addClass('disable');
						}

						$(data.arrowNext).on('mouseenter.scrollmenu', function () {
							step = '+=' + data.scrollStep;
							scroll($menuWrap);
						}).on('mouseleave.scrollmenu', function () {
							step = 0;
						});
						$(data.arrowPrev).on('mouseenter.scrollmenu', function () {
							step = '-=' + data.scrollStep;
							scroll($menuWrap);
						}).on('mouseleave.scrollmenu', function () {
							step = 0;
						});
						return $this;
					},
					scrollToStart: function () {
						var $this = this;
						if ($this.data('initialized')) {
							this._isScroll($(data.menu), isMobile);
							return $this;
						} else return false;
					},
					_isScroll: function (menu, isMobile) {
						var $this = menu,
							$menuWrap = $this.parent();
						$('body').removeClass(data.bodyFlagClass);
						$menuWrap.animate({
							scrollLeft: 0
						}, 0);
						$(data.arrowPrev).addClass('disable');
						$(data.arrowNext).removeClass('disable');
						if (!isMobile && ($this.width() >= $menuWrap.width())) $('body').addClass(data.bodyFlagClass);
						return $this;
					}
				});
				return ScrollMenu;
			})();
			GOODWIN.scrollmenu = new ScrollMenu(data);
		},
		miniCartInit: function (data) {
			var MiniCart = (function (options) {
				var data = {
					headerCart: '.minicart-js',
					toggleBtn: '.minicart-link',
					closeBtn: '.minicart-drop-close',
					dropdn: '.minicart-drop',
					header: '.hdr',
					sticky: '.sticky-holder',
					stickyFlag: 'has-sticky'
				};

				function MiniCart(options) {
					$.extend(data, options);
					this.init()
				}

				MiniCart.prototype = $.extend({}, MiniCart.prototype, {
					init: function (options) {
						this._handlers($(data.headerCart), isMobile);
						return this;
					},
					reinit: function (windowW) {
						this._handlers($(data.headerCart), isMobile);
						return this;
					},
					_handlers: function (cart, isMobile) {
						var $this = cart,
							self = this;
						$('.minicart-drop').scrollLock('disable');
						if (isMobile) {
							if (!$this.data('mobile')) {
								$(data.dropdn).removeClass('opened');
								$(data.headerCart).removeClass('is-hovered');
								$(data.dropdn).css({
									'top': '',
									'height': '',
									'max-height': ''
								});
								$(data.toggleBtn).on('click.miniCart', function (e) {
									self.open($this);
									return false;
									e.preventDefault();
								});
								$(data.closeBtn).on('click.miniCart', function (e) {
									self.close($this);
									return false;
								});
								$this.off('.miniCart').removeData('desktop').data('mobile', true).on('click.miniCart', function (e) {
									if ($(e.target).is($(data.dropdn))) {
										self.close($this);
										e.preventDefault();
									}
								});
							}
						} else {
							if (!$this.data('desktop')) {
								$(data.toggleBtn + ',' + data.closeBtn).off('.miniCart');
								$(data.dropdn + ',' + data.dropdn + '> .container').css({
									'height': ''
								});
								$(data.toggleBtn).on('click.miniCart', function (e) {
									$(data.dropdn).toggleClass('opened');
									$(data.headerCart).toggleClass('is-hovered');
									$('.minicart-drop').scrollLock('enable');
									self._topCalc($this);
									e.preventDefault();
								});
								$document.on('click.miniCart', function (e) {
									var $this = $(e.target);
									if (!$this.closest(data.dropdn).length && !$this.closest(data.headerCart).length) {
										$(data.dropdn).removeClass('opened');
										$(data.headerCart).removeClass('is-hovered');
									}
								});
								self._bodyFixed($this, false);
								$this.off('.miniCart').removeClass('active, mobile').removeData('mobile').data('desktop', true)
							}
						}
						return $this;
					},
					// open minicart
					open: function (cart) {
						var $this = cart ? cart : this;
						$this.toggleClass('active');
						if ($('body').hasClass('is-fixed')) {
							this._bodyFixed($this, false);
						} else {
							this._bodyFixed($this, true);
							this._heightCalc($this);
						}
						return $this;
					},
					// close minicart
					close: function (cart) {
						var $this = cart ? cart : this;
						$this.removeClass('active');
						this._bodyFixed($this, false);
						$(data.headerCart).removeClass('is-hovered');
						$(data.dropdn + ',' + data.dropdn + '> .container').css({
							'height': ''
						});
						return $this;
					},
					_heightCalc: function () {
						var height = isMobile ? window.innerHeight : $(window).height();
						$(data.dropdn + ',' + data.dropdn + '> .container').css({
							'height': height + 'px'
						});
					},
					_topCalc: function () {
						if ($(data.dropdn).length) {
							var $dropdn = $(data.dropdn),
								$parent = $dropdn.closest('.container').parent(),
								hTop = $parent.outerHeight(),
								maxH = $(window).height() - $parent.outerHeight() - $parent.offset().top;
							if ($('body').hasClass(data.stickyFlag)) {
								hTop = $(data.sticky).outerHeight();
								maxH = $(window).height() - $parent.outerHeight();
							}
							if (!isMobile) {
								$dropdn.css({
									'top': hTop + 'px',
									'max-height': maxH + 'px'
								})
							}
						}
					},
					_bodyFixed: function (cart, state) {
						if (state) {
							$('body,' + data.sticky).addClass('is-fixed').css({
								'padding-right': scrollWidth + 'px'
							});
							$('.minicart-drop-content').scrollLock('enable');
						} else {
							$('.minicart-drop-content').scrollLock('disable');
							$('body,' + data.sticky).removeClass('is-fixed').css({
								'padding-right': ''
							});
						}
					}
				});
				return MiniCart;
			})();
			GOODWIN.minicart = new MiniCart(data);
		},
		stickyHeaderInit: function () {
			var StickyHeader = (function () {
				var data = {
					header: '.hdr_sticky',
					headerM: '.hdr-mobile',
					headerD: '.hdr-desktop',
					hdrLogo: '.logo-holder',
					hdrNav: '.nav-holder',
					hdrCart: '.minicart-holder',
					sticky: '.sticky-holder',
					stickyLogo: '.logo-holder-s',
					stickyNav: '.nav-holder-s',
					stickyCart: '.minicart-holder-s',
					mobileMenu: '.mmenu',
					promoTopline: '.promo-topline',
					offset: 500
				};

				function StickyHeader(options) {
					$.extend(data, options);
					this.init()
				}

				StickyHeader.prototype = $.extend({}, StickyHeader.prototype, {
					init: function () {
						if (!$(data.header).length) return false;
						if (!isMobile && !$('body').hasClass('has-sticky')) {
							this._setHeigth();
						} else if ($(data.header).hasClass('hdr-mobile-style2')) {
							this._setScrollSimple();
							return false;
						}
						this._setScroll(isMobile);
						this._multirow();
						this._multirowS();
						return this;
					},
					reinit: function () {
						if (!$(data.header).length) return false;
						$window.off('scroll.stickyHeader');
						if (!isMobile) {
							this._setHeigth();
						} else if ($(data.header).hasClass('hdr-mobile-style2')) {
							if ($('body').hasClass('has-sticky')) {
								this.destroySticky();
								this.setHeaderHeight();
							}
							this._setScrollSimple();
							return false;
						}
						this._multirow();
						this._multirowS();
						this._setScroll(isMobile);
						return this;
					},
					_multirow: function () {
						if (isMobile) return false;
						if ($(data.hdrNav).outerHeight() > 60) {
							$(data.header).addClass('mmenu-multirow');
						} else $(data.header).removeClass('mmenu-multirow');
					},
					_multirowS: function () {
						if (isMobile) return false;
						if ($('body').hasClass('has-sticky')) {
							if ($(data.stickyNav).outerHeight() > 60) {
								$(data.header).addClass('mmenu-multirow-s');
							} else $(data.header).removeClass('mmenu-multirow-s');
						}
					},
					destroySticky: function () {
						var $sticky = $(data.sticky),
							$stickyLogo = $(data.stickyLogo),
							$stickyNav = $(data.stickyNav),
							$stickyCart = $(data.stickyCart);
						if (isMobile) {
							var $hdrLogo = $(data.hdrLogo, $(data.headerM)),
								$hdrNav = $(data.hdrNav),
								$hdrCart = $(data.hdrCart, $(data.headerM));
						} else {
							var $hdrLogo = $(data.hdrLogo, $(data.headerD)),
								$hdrNav = $(data.hdrNav, $(data.headerD)),
								$hdrCart = $(data.hdrCart, $(data.headerD));
						}
						this._removeSticky($stickyNav, $hdrNav, $stickyCart, $hdrCart, $sticky);
					},
					setHeaderHeight: function () {
						if ($(data.header).hasClass('hdr-mobile-style2') && isMobile) {
							if (promoToplineHeight > 0) {
								promoToplineHeight = $(data.promoTopline).outerHeight();
							}
							$(data.header).css({
								height: $(data.headerM).height() + promoToplineHeight
							});
						}
					},
					_setScrollSimple: function () {
						this.setHeaderHeight();
						$window.on('scroll.stickyHeader', function () {
							if ($body.hasClass('blockSticky')) return false;
							if ($window.scrollTop() > promoToplineHeight) {
								if ($(data.headerM).hasClass('is-sticky')) return false;
								$(data.headerM).addClass('is-sticky');
							} else {
								$(data.headerM).removeClass('is-sticky');
							}
						});
					},
					_setScroll: function (isMobile) {
						var that = this;
						var $header = $(data.header),
							$sticky = $(data.sticky),
							$stickyLogo = $(data.stickyLogo),
							$stickyNav = $(data.stickyNav),
							$stickyCart = $(data.stickyCart),
							stickyH = $header.height(),
							offset = data.offset;
						if (isMobile) {
							var $hdrNav = $(data.hdrNav, $(data.headerM)),
								$hdrCart = $(data.hdrCart, $(data.headerM));
						} else {
							var $hdrNav = $(data.hdrNav, $(data.headerD)),
								$hdrCart = $(data.hdrCart, $(data.headerD));
						}

						$window.on('scroll.stickyHeader', function () {
							if ($body.hasClass('blockSticky')) return false;
							var st = $window.scrollTop();
							if (st > (stickyH + offset)) {
								if (!$('body').hasClass('has-sticky')) {
									that._setSticky($hdrNav, $stickyNav, $hdrCart, $stickyCart, $sticky);
								}
							} else {
								if ($('body').hasClass('has-sticky')) {
									that._removeSticky($stickyNav, $hdrNav, $stickyCart, $hdrCart, $sticky);
								}
							}
						});
						return this;
					},
					_setSticky: function (hdrNav, stickyNav, hdrCart, stickyCart, sticky) {
						hdrNav.children().detach().appendTo(stickyNav);
						hdrCart.children().detach().appendTo(stickyCart);
						sticky.addClass('animated fadeIn');
						$body.addClass('has-sticky');
						GOODWIN.minicart._topCalc();
						this._multirowS();
						this._clearActive($(data.header));
					},
					_removeSticky: function (stickyNav, hdrNav, stickyCart, hdrCart, sticky) {
						stickyNav.children().detach().appendTo(hdrNav);
						stickyCart.children().detach().appendTo(hdrCart);
						sticky.removeClass('animated fadeIn');
						$body.removeClass('has-sticky');
						this._clearActive($(data.header));
						GOODWIN.minicart._topCalc();
					},
					_setHeigth: function () {
						var $header = $(data.header),
							$hdrNav = $(data.hdrNav);
						$hdrNav.css({
							'height': ''
						});
						$header.removeClass('animated fadeIn').css({
							'height': ''
						});
						if (!$('body').hasClass('has-sticky')) {
							$hdrNav.css({
								'height': $hdrNav.height()
							})
						} else {
							$('body').removeClass('has-sticky');
						}

						return this;
					},
					_clearActive: function (parent) {
						parent.find('.hovered, .is-hovered, .opened').removeClass('hovered is-hovered opened');
					}
				});
				return StickyHeader;
			})();
			GOODWIN.stickyheader = new StickyHeader();
		}
	}
	GOODWIN.product = {
		init: function () {
			this.productGalleryBuild('.js-prd-gallery');
			this.productSlideMain('.js-main-image--slide');
			this.productHoverHeight('.prd');
			this.creativeGalleryInit('.prd-block_gallery');
			this.colorToggle();
			this.scrollToReview('.prd-block_info .spr-badge', '#shopify-product-reviews');
			this.scrollToDiv('.js-scroll-to');
			this.swatchToggle('.prd-color.swatches');
			this.simpleFancyGallery('.prd-block [data-fancybox="galleryQW"], .prd-block [data-fancybox="gallery"]');
			this.selectPicker();
			this.quickView();
			this.addToWishlist('.js-label-wishlist');
			this.removePrd('.js-product-remove');
			this.swatchToSelect();
		},
		swatchToSelect: function () {
			var swatch = '.js-size-list a';
			$document.on('click', swatch, function (e) {
				var $this = $(this),
					$select = $('#' + $this.closest('[data-select-id]').data('select-id'));
				if (!$this.parent('li').is('.active')) {
					$this.closest('.js-size-list').find('li').removeClass('active');
					$this.parent('li').addClass('active');
					$select.val($this.data('value'));
					$select.trigger('change');
				}
				e.preventDefault();
			});
		},
		selectPicker: function () {
			$('.prd-action select').selectpicker();
			function makeBold(el) {
				el.each(function () {
					$(this).html($(this).html().replace('bopen', '<b>').replace('bclose', '</b>'));
				})
			}

			$('.prd-action select').on('loaded.bs.select', function () {
				makeBold($(this).parent().find('.filter-option-inner-inner'));
			}).on('show.bs.select', function () {
				makeBold($(this).parent().find('.text'));
			}).on('changed.bs.select', function () {
				makeBold($(this).parent().find('.filter-option-inner-inner'));
			});
		},
		swatchToggle: function (option) {
			$(option).each(function () {
				var $option = $(this),
					$optionlist = $('ul', $option),
					$optionbtn = $('a', $optionlist),
					$optionselect = $('select', $option),
					$productblock = $option.closest('.prd-block'),
					$previewsCarousel = $productblock.find('.product-previews-carousel'),
					creativeProduct = '.prd-block--creative',
					$productGallery = $('.prd-block_gallery'),
					$productGalleryM = $('.prd-block_gallery-mobile');
				if (!$optionlist.hasClass('js-list-filter')) {
					$optionlist.find("a[data-value='" + $optionselect.val() + "']").parent().addClass('active');
				}
				$optionbtn.on('click touchstart', function (e) {
        
        
					var $this = $(this),
						currentSelect = $this.attr('data-value'),
						allCount = $previewsCarousel.find('.slick-slide').length,
						showCount = $previewsCarousel.find('.slick-active').length;  
            
          if (!$optionlist.hasClass('js-list-filter')) {
            if ($this.attr('data-image')) {
              if (($previewsCarousel.length && w < maxSM) || ($previewsCarousel.length && !$productGalleryM.length)) {
                $previewsCarousel.find('.slick-slide').each(function (i) {
                  if ($(this).attr('data-value') == currentSelect) {
                    $(this).trigger('click');
                    var pos = i > (allCount - showCount) ? (allCount - showCount) : i;
                    $previewsCarousel.slick('slickGoTo', pos, false);
                    return false;
                  }
                });
              } else if ($this.closest(creativeProduct).length) {
                $productGallery.find('a').each(function () {
                  if ($(this).attr('data-value') == currentSelect) {
                    var offset = $(this).offset().top,
                      shift = offset > 300 ? 70 : 15;
                    $('html,body').animate({
                      scrollTop: offset - shift
                    }, 500);
                    return false;
                  }
                });
              } else {
                var $image = $('.main-image-holder img', $productblock);
                var imgSrc = $this.attr('data-image');
                var newImg = document.createElement("img");
                newImg.src = imgSrc;
                newImg.onload = function () {
                  $image.attr('src', imgSrc);
                  $image.attr('data-zoom-image', imgSrc);
                  $('.main-image-holder > .zoom', $productblock).data('ezPlus').destroy();
                  $('.main-image-holder > .zoom', $productblock).initProductZoom();
                };
              }
            } 					
          }else {
            console.log(currentSelect)
						$previewsCarousel.slick('slickUnfilter');
						$previewsCarousel.slick('slickFilter', 'a[data-value="' + currentSelect + '"]');
						$previewsCarousel.slick('refresh');
            $previewsCarousel.find('.slick-current').trigger('click');
					}
            
					if (!$this.parent('li').is('.active')) {
						$optionselect.val($this.attr('data-value'));
						$this.closest('ul').find('li').removeClass('active');
						$this.parent('li').addClass('active');
					}
					e.preventDefault();
				});
			});
		},
		colorToggle: function () {
			var ColorToggle = {
				data: {
					toggle: '.js-color-toggle',
					image: '.js-prd-img',
					colorswatch: '.color-swatch',
					product: '.prd, .prd-hor',
					arrows: '.color-swatch-arrows',
					prev: '.js-color-swatch-prev',
					next: '.js-color-swatch-next',
					scrolldiv: '.color-swatch-scroll',
					scrollpx: 42,
					scrollspeed: 300
				},
				init: function (options) {
					$.extend(this.data, options);
					this._handlers();
					this.reinit();
				},
				_handlers: function () {
					var that = this;
					$(document).on('click', that.data.prev, function (e) {
						var $wrap = $(this).closest(that.data.product).find(that.data.scrolldiv);
						$wrap.animate({scrollLeft: $wrap.scrollLeft() - that.data.scrollpx}, that.data.scrollspeed);
						e.preventDefault();
					});
					$(document).on('click', that.data.next, function (e) {
						var $wrap = $(this).closest(that.data.product).find(that.data.scrolldiv);
						$wrap.animate({scrollLeft: $wrap.scrollLeft() + that.data.scrollpx}, that.data.scrollspeed);
						e.preventDefault();
					});
					$(document).on('click', that.data.toggle, function (e) {
						var $el = $(this).parent('li');
						if ($el.data('image')) {
							var $prd = $el.closest(that.data.product),
								$image = $prd.find(that.data.image),
								imgSrc = $el.data('image');
							$prd.addClass('prd-loading');
							$el.siblings().removeClass('active');
							$el.addClass('active');
							var newImg = document.createElement("img");
							newImg.src = $el.data('image');
							newImg.onload = function () {
								$image.attr('src', imgSrc);
								if ($image.attr('srcset')) {
									$image.attr('srcset', imgSrc);
								}
								$prd.removeClass('prd-loading');
							};
						}
						e.preventDefault();
					});
				},
				reinit: function () {
					var that = this;
					$(that.data.colorswatch).each(function () {
						var $this = $(this);
						$this.find(that.data.toggle).first().parent().addClass('active');
						if ($this.get(0).scrollWidth <= $this.width()) {
							$this.closest(that.data.product).find(that.data.arrows).hide();
						} else {
							$this.closest(that.data.product).find(that.data.arrows).show();
						}
					});
				}
			};
			GOODWIN.colortoggle = Object.create(ColorToggle);
			GOODWIN.colortoggle.init();
		},
		scrollToReview: function (link, reviewID) {
			$(document).on('click', link, function () {
				var $panReview = $(reviewID),
					tabNavs = '.nav-tabs',
					tabPane = '.tab-pane',
					tabPaneM = '.panel',
					header = '.hdr';
				if ($panReview.length) {
					if ($panReview.closest(tabPaneM).length) {
						var $reviewTab = $panReview.closest(tabPaneM).find('.panel-title > a');
						$reviewTab.trigger('click');
						setTimeout(function () {
							$('html,body').animate({
								scrollTop: $reviewTab.offset().top - $(header).height()
							}, 500);
						}, 500);
					} else if ($panReview.closest(tabPane).length) {
						var tabReviewID = $panReview.closest(tabPane).attr('id'),
							reviewTabNum = $('#' + tabReviewID).index(),
							$reviewTab = $(tabNavs).find('li').eq(reviewTabNum).find('a');
						$reviewTab.trigger('click');
						$('html,body').animate({
							scrollTop: $(tabNavs).offset().top - $(header).height()
						}, 500);
					} else {
						$('html,body').animate({
							scrollTop: $panReview.offset().top - $(header).height()
						}, 500);
					}
				}
			});
		},
		scrollToDiv: function (link) {
			var header = '.hdr';

			function goToByScroll(id) {
				id = id.replace("link", "");
				$('html,body').animate({
					scrollTop: $(id).offset().top - $(header).height()
				}, 500);
			}

			$(link).on('click', function (e) {
				e.preventDefault();
				$(this).blur();
				goToByScroll($(this).attr('href'));
			});
		},
		simpleFancyGallery: function (link) {
			$(link).fancybox({
				loop: false,
				animationEffect: "zoom",
				buttons: ["close"],
				thumbs: {
					autoStart: true
				},
				arrows: false,
				touch: false,
				beforeShow: function (instance, slide) {
					$(".fancybox-container").last().addClass("fancybox--light");
				}
			});
		},
		productGalleryBuild: function (gallery) {
			productGallery = function () {
				var defaults = {
					$prdBlock: $('#prdGallery'),
					zoomLink: '.prd-block_zoom-link',
					prdPreviews: '.product-previews-carousel',
					imageHolder: '.prd-block_main-image-holder',
					zoomImg: '.zoom',
					videoHolder: '.js-main-image-video',
					verticalSelector: '.prd-block--prv-left, .prd-block--prv-right'
				};
				this.data = extendDefaults({}, defaults);
				if (arguments[0] && typeof(arguments[0]) === "object") {
					this.options = extendDefaults(this.data, arguments[0]);
				}
				(function (productGallery) {
					var _ = productGallery;
					var addData = {
						$imageHolder: $(_.data.imageHolder, _.data.$prdBlock),
						$prdPreviews: $(_.data.prdPreviews, _.data.$prdBlock),
						$zoomLink: $(_.data.zoomLink, _.data.$prdBlock),
						$zoomImg: $(_.data.zoomImg, _.data.$prdBlock),
						$video: $(_.data.videoHolder, _.data.$prdBlock)
					};
					$.extend(_.data, addData);
					_galleryBuild(_);
					_zoomLinkEvent(_);
					if (isMobile) {
						_productZoom(_);
					} else if (!_.data.$imageHolder.closest('.prd-block_gallery-mobile').length) {
						_productZoom(_);
					}
					_videoEvent(_);
				})(this);
				productGallery.prototype.previewsReInit = function () {
					var _ = this;
					if (isMobile && _.data.$imageHolder.closest('.prd-block_gallery-mobile').length && !_.data.$prdPreviews.hasClass('slick-initialized')) {
						_productZoom(_);
						_videoEvent(_);
					}
					;
				};
				productGallery.prototype.elevateZoomReInit = function () {
					var _ = this,
						$this = _.data.$zoomImg;
					if ($(_.data.$video).hasClass('showed-video')) {
						return false;
					}
					if ($('.zoomContainer').length) {
						$this.data('ezPlus').destroy();
						$this.removeData('ezPlus');
					}
					$('.zoomContainer, .ezp-spinner').remove();
					if ($this.closest('.zoomWrapper').length) {
						$this.removeAttr('style').unwrap();
					}
					_.data.$imageHolder.removeAttr('style');
					setTimeout(function () {
						_elevateZoom(_);
					}, 100);
				};

				function _elevateZoom(el) {
					var _ = el,
						$prdPreviews = _.data.$prdPreviews,
						$imageHolder = _.data.$imageHolder,
						$zoomImg = _.data.$zoomImg,
						zoompos = $('body').is('.rtl') ? 11 : 1,
						galleryID = $prdPreviews.attr('id'),
						append,
						zoomtype;
					if (!$('body').hasClass('touch')) {
						$imageHolder.removeClass('hideZoom');
						//if (!$imageHolder.hasClass('zoomInit')){
						append = '#' + _.data.$prdBlock.attr('id') + " " + _.data.imageHolder;
						zoomtype = $zoomImg.closest('[data-zoomtype]').data('zoomtype') ? $zoomImg.closest('[data-zoomtype]').data('zoomtype') : 'window';
						$zoomImg.ezPlus({
							zoomType: zoomtype,
							zIndex: 149,
							zoomWindowPosition: zoompos,
							zoomContainerAppendTo: append,
							gallery: galleryID,
							galleryActiveClass: 'active',
							zoomWindowFadeIn: 500,
							zoomWindowFadeOut: 500,
							lensFadeIn: 500,
							lensFadeOut: 500,
							imageCrossfade: true,
							responsive: true,
							loadingIcon: 'images/ajax_loader.gif',
							cursor: 'crosshair'
						});
						$imageHolder.addClass('zoomInit');
						//}
					} else {
						$imageHolder.addClass('hideZoom');
					}
				}

				function _galleryBuild(el) {
					var _ = el,
						$prdPreviews = _.data.$prdPreviews,
						_galleryObj = [];
					$prdPreviews.find('[data-zoom-image]').each(function () {
						var $this = $(this),
							src = $this.attr('data-zoom-image'),
							image = {};
						image["src"] = src;
						image["opts"] = {
							thumb: src,
							caption: $this.find('img').attr('alt')
						};
						_galleryObj.push(image);
					});
					_.galleryObj = _galleryObj;
				}

				function _getActiveIndex(carousel) {
					var current = 0,
						videoPrev = 0;
					if ($(carousel).find('a.active').length) {
						current = $('a.active', $(carousel)).index();
						videoPrev = $('a.active', $(carousel)).prevAll('[data-video], .prd-video').length;
					}
					return current - videoPrev;
				}

				function _zoomLinkEvent(el) {
					var _ = el,
						$zoomLink = _.data.$zoomLink,
						$prdPreviews = _.data.$prdPreviews;
					if ($zoomLink.closest('.prd-block, .prd-single').find('.product-previews-carousel').length) {
						$zoomLink.on('click', function (e) {
							e.preventDefault();
							var carouselID = $prdPreviews.attr('id'),
								activeIndex = _getActiveIndex('#' + carouselID),
								items = _.galleryObj;
							$.fancybox.open(items, {
								loop: false,
								animationEffect: "zoom",
								touch: false,
								buttons: ["close"],
								thumbs: {
									autoStart: true
								},
								arrows: false,
								beforeShow: function (instance, slide) {
									$(".fancybox-container").last().addClass("fancybox--light");
								}
							});
							$.fancybox.getInstance('jumpTo', activeIndex);
						});
					} else {
						$zoomLink.on('click', function (e) {
							var $this = $(this);
							$.fancybox.open(
								[{
									src: $this.attr('href'),
									opts: {
										caption: $this.data('caption')
									}
								}], {
									beforeShow: function (instance, slide) {
										$(".fancybox-container").last().addClass("fancybox--light");
									}
								});
							e.preventDefault();
						});
					}
				}

				function _productZoom(el) {
					var _ = el,
						$imageHolder = _.data.$imageHolder,
						$prdPreviews = _.data.$prdPreviews;
					if ($imageHolder.hasClass('js-main-image-zoom')) {
						$imageHolder.imagesLoaded(function () {
							_elevateZoom(_);
						});
						if (!$prdPreviews.hasClass('slick-initialized')) {
							_previewsCarousel(_, $prdPreviews, 'zoom');
						}
					} else {
						if (!$prdPreviews.hasClass('slick-initialized')) {
							_previewsCarousel(_, $prdPreviews, 'nozoom');
						}
					}
				}

				function _videoSetStartPoster(el) {
					var _ = el,
						$prdPreviews = _.data.$prdPreviews;
					if ($prdPreviews.find('[data-video]:first-child').length) {
						var $this = $prdPreviews.find('[data-video]:first-child');
						data.$video.addClass('showed-video');
						data.$video.children('video').attr('poster', $this.find('img').attr('src'));
					}
				}

				function _videoEvent(el) {
					var _ = el,
						$mainImg = $('img', _.data.$imageHolder),
						$parent = _.data.$video;
					_videoSetStartPoster(_);
					$('[data-video]', _.data.$prdBlock).on('click', function (e) {
						e.stopPropagation();
						e.preventDefault();
						var $this = $(this),
							$slider = $this.closest('.prd-block, .prd-single').find('.prd-block_main-image-holder'),
							$next = $('.js-main-image-next', $slider),
							$prev = $('.js-main-image-prev', $slider);
						$next.removeClass('slick-disabled');
						$prev.removeClass('slick-disabled');
						$this.siblings().removeClass('active');
						$this.addClass('active');
						if ($this.is(':first-child')) {
							$prev.addClass('slick-disabled');
						}
						if ($this.is(':last-child')) {
							$next.addClass('slick-disabled');
						}
						var $this = $(this),
							$video = _.data.$video,
							video = _.data.$video.children('video').get(0),
							sources = video.getElementsByTagName('source');
						if (video != null) {
							if ($this.data('video') == sources[0].src) {
								if (!video.paused) {
									video.pause();
								} else {
									$video.children('video').attr('poster', $this.find('img').attr('src'));
									video.play();
									$parent.css({
										'max-height': $mainImg.height(),
										'height': $mainImg.height()
									});
									$mainImg.addClass('unvisible');
									$mainImg.closest('.zoomWrapper').addClass('unvisible');
									$video.addClass('showed-video');
								}
							} else {
								video.pause();
								$video.children('video').attr('poster', '');
								sources[0].src = $this.data('video');
								video.load();
								setTimeout(function () {
									var videoH = video.videoHeight * $video.width() / video.videoWidth;
									$parent.css({
										'max-height': $mainImg.height(),
										'height': $mainImg.height()
									});
									$video.addClass('showed-video').css({
										'height': videoH + 'px'
									});
									$mainImg.addClass('unvisible');
									$mainImg.closest('.zoomWrapper').addClass('unvisible');
									$video.children('video').attr('poster', $this.find('img').attr('src'));
									video.play();
								}, 100);
							}
						}
					});
				}

				function _previewsCarousel(el, carousel, zoom) {
					var _ = el,
						$this = $(carousel),
						zoom = zoom,
						$mainImg = $('img', _.data.$imageHolder),
						$parent = _.data.$imageHolder;
					//$this.imagesLoaded(function() {
					// set modal height on callback
					$this.on('init', function () {
						$this.find('.slick-slide').first().addClass('active');
						if ($this.closest('#quickView').length) {
							var $modal = $this.closest('#quickView').find('.modal-content');
							$modal.css({
								'height': $modal.find('.prd-block').outerHeight() + 'px'
							});
							setTimeout(function () {
								$modal.addClass('loaded');
							}, 500);
						}
						$('.slick-slide', $this).on('click', function () {
							var $slider = $this.closest('.prd-block, .prd-single').find('.prd-block_main-image-holder'),
								$next = $('.js-main-image-next', $slider),
								$prev = $('.js-main-image-prev', $slider);
							setTimeout(function () {
								$next.removeClass('slick-disabled');
								$prev.removeClass('slick-disabled');
								if ($('.slick-slide.active', $this).is(':first-child')) {
									$prev.addClass('slick-disabled');
								}
								if ($('.slick-slide.active', $this).is(':last-child')) {
									$next.addClass('slick-disabled');
								}
							}, 100);
						});
					});
					$this.slick({
						slidesToShow: 4,
						slidesToScroll: 1,
						dots: false,
						infinite: false, //don't change
						vertical: $this.closest(_.data.verticalSelector).length ? true : false,
						swipe: swipemode,
						responsive: [{
							breakpoint: maxMD,
							settings: {
								vertical: false
							}
						}, {
							breakpoint: maxXS,
							settings: {
								slidesToShow: 3
							}
						}]
					});
					$this.on('click', '.slick-slide', function (e) {
						if (!$(e.target).is($('[data-video]')) && !$(e.target).closest('[data-video]').length) {
							$parent.css({
								'max-height': '',
								'height': ''
							});
							$mainImg.removeClass('unvisible');
							$mainImg.closest('.zoomWrapper').removeClass('unvisible');
							;
							var video = _.data.$video.children("video").get(0);
							video.pause();
							_.data.$video.removeClass('showed-video');
							_.elevateZoomReInit();
						}
						if (zoom === 'nozoom' || $('body').hasClass('touch')) {
							e.preventDefault();
							e.stopPropagation();
							var newImg = $(this).attr('data-zoom-image');
							$this.find('.slick-slide').removeClass('active');
							$(this).addClass('active');
							$mainImg.attr('src', newImg);
						}
					});
					//});
				}
			};
			$(gallery).each(function (i) {
				productGalleryArray[i] = new productGallery({
					$prdBlock: $('#' + $(this).attr('id'))
				});
			});
		},
		productSlideMain: function (carousel) {
			$(carousel).each(function () {
				var $carousel = $(this),
					$next = $('.js-main-image-next', $carousel),
					$prev = $('.js-main-image-prev', $carousel),
					$productblock = $carousel.closest('.prd-block, .prd-single'),
					$previewsCarousel = $productblock.find('.product-previews-carousel');
				$prev.addClass('slick-disabled');

				function prevSlide() {
					if ($('.slick-active.active', $previewsCarousel).length) {
						if ($('.slick-active.active', $previewsCarousel).prev().hasClass('prd-video')) {
							if (!$('.slick-active.slick-active', $previewsCarousel).prev().prev().length) {
								$prev.addClass('slick-disabled');
							}
							$('.slick-active.active', $previewsCarousel).prev().prev().trigger('click');
							return false;
						} else $('.slick-active.active', $previewsCarousel).prev().trigger('click');
					} else {
						if ($('.slick-active.slick-active', $previewsCarousel).prev().hasClass('prd-video')) {
							if (!$('.slick-active.slick-active', $previewsCarousel).prev().prev().length) {
								$prev.addClass('slick-disabled');
							}
							$('.slick-current.slick-active', $previewsCarousel).prev().prev().trigger('click');
							return false;
						} else $('.slick-current.slick-active', $previewsCarousel).prev().trigger('click');
					}
					$previewsCarousel.slick('slickPrev');
				}

				function nextSlide() {
					if ($('.slick-active.active', $previewsCarousel).length) {
						if ($('.slick-active.active', $previewsCarousel).next().hasClass('prd-video')) {
							if (!$('.slick-active.slick-active', $previewsCarousel).next().next().length) {
								$next.addClass('slick-disabled');
							}
							$('.slick-active.active', $previewsCarousel).next().next().trigger('click');
							;
							return false;
						} else $('.slick-active.active', $previewsCarousel).next().trigger('click');
					} else {
						if ($('.slick-active.slick-active', $previewsCarousel).next().hasClass('prd-video')) {
							if (!$('.slick-active.slick-active', $previewsCarousel).next().next().length) {
								$next.addClass('slick-disabled');
							}
							$('.slick-current.slick-active', $previewsCarousel).next().next().trigger('click');
							return false;
						} else $('.slick-current.slick-active', $previewsCarousel).next().trigger('click');
					}
					$previewsCarousel.slick('slickNext');
				}

				$prev.on('click', function (e) {
					prevSlide();
					e.preventDefault();
				});
				$next.on('click', function (e) {
					nextSlide();
					e.preventDefault();
				});
				$carousel.on('swipeleft', function (e) {
					nextSlide();
				}).on('swiperight', function (e) {
					prevSlide();
				});
			});
		},
		quickView: function () {
			$(".js-qview-link").fancybox({
				backFocus : false,
				afterShow: function () {
					if ($('#fullpage').length) {
						$('.fancybox-content, .fancybox-content .table-responsive').perfectScrollbar();
					}
					if ($('.modal--quickview .product-card-selectbox').length) {
						updateProductCardSelectbox('.modal--quickview .product-card-selectbox');
					}
					if ($('.js-product-quickview-carousel').length) {
						var $this = $('.js-product-quickview-carousel:not(.slick-initialized)');
						$this.on('init', function () {
							setTimeout(function () {
								$this.css({
									'height': ''
								});
							}, 500);
						})
						$this.css({
							'height': $this.height()
						});
						$this.slick({
							arrows: true,
							slidesToShow: 3,
							swipe: swipemode,
							infinite: false,
							responsive: [{
								breakpoint: 630,
								settings: {
									slidesToShow: 2
								}
							}]
						});
					} else {
						var productGalleryNew = new productGallery({
							$prdBlock: $('#prdGalleryModal')
						});
						productGalleryArray.push(productGalleryNew);
					}
					GOODWIN.product.simpleFancyGallery('.prd-block [data-fancybox="galleryQW"]');
				},
				beforeClose: function () {
					if (!$('.product-quickview-carousel').length) {
						productGalleryArray.splice(-1, 1);
					}
					if ($('.modal--quickview .product-card-selectbox').length) {
						updateProductCardSelectbox('.modal--quickview .product-card-selectbox');
					}
				},
				touch: false,
				baseTpl: '<div class="fancybox-container">' + '<div class="fancybox-bg"></div>' + '<div class="fancybox-inner">' + '<div class="fancybox-stage"></div>' + '<div class="fancybox-caption"></div>' + "</div>" + "</div>"
			});
		},
		productHeightResize: function (product) {
			$(product).each(function () {
				var $this = $(this);
				$this.removeData('bottom1', 'bottom2');
				$('.color-swatch', $this).css({'bottom': ''});
				$('.countdown-box', $this).css({'bottom': ''});
			})
		},
		productHoverHeight: function (product) {
			var product = product,
				speed = 180;
			$document.on('mouseenter', product, function (e) {
				if (w < maxMD) return false;
				var $this = $(this);
				var $slick = $this.closest('.slick-list');
				if ($this.closest('.single-prd-carousel').length) return false;
				$this.css({
					'height': $(this)[0].getBoundingClientRect().height + 'px'
				});
				if (!$this.hasClass('hovered')) {
					$this.addClass('hovered');
					if ($this.hasClass('prd-style2') && !$this.hasClass('prd-outstock')) {
						var shiftY = $('.prd-hover', $this).height();
						if ($this.data('bottom1') === undefined) {
							$this.data('bottom1', parseInt($('.color-swatch', $this).css('bottom'), 10));
						}
						if ($this.data('bottom2') === undefined) {
							$this.data('bottom2', parseInt($('.countdown-box', $this).css('bottom'), 10));
						}
						$('.prd-info', $this).stop().animate({'top': -shiftY + 'px'}, speed);
						$('.color-swatch', $this).stop().animate({'bottom': $this.data('bottom1') + shiftY}, speed);
						$('.countdown-box', $this).stop().animate({'bottom': $this.data('bottom2') + shiftY}, speed);
					}
				}
				$slick.addClass('slick-list--offset');
				$slick.parent().addClass('prd-hovered');
			}).on('mouseleave', product, function (e) {
				if (w < maxMD) return false;
				var $this = $(this);
				var $slick = $this.closest('.slick-list');
				if ($this.closest('.single-prd-carousel').length) return false;
				$this.removeClass('hovered');
				$slick.removeClass('slick-list--offset');
				$slick.parent().removeClass('prd-hovered');
				if ($('.bootstrap-select', $this).hasClass('open')) $('select', $this).selectpicker('toggle');
				$this.css({
					'height': ''
				});
				if ($this.hasClass('prd-style2') && !$this.hasClass('prd-outstock')) {
					$('.prd-info', $this).stop().animate({'top': 0}, speed);
					$('.color-swatch', $this).stop().animate({'bottom': $this.data('bottom1')}, speed);
					$('.countdown-box', $this).stop().animate({'bottom': $this.data('bottom2')}, speed);
				}
			});
			$(document).on('mouseenter', '.dropdown-toggle', function (e) {
				$(this).attr("title", "");
			});
			$(".prd-carousel [data-fancybox]").fancybox({
				backFocus : false
			})
		},
		creativeGalleryInit: function (el) {
			$.fn.creativeGallery = function () {
				$('a', this).fancybox({
					touch: false,
					buttons: ["zoom", "thumbs", "close"]
				});
			};
			$(el).creativeGallery();
		},
		addToWishlist: function (link) {
			var $link = $(link),
				$modalAdd = $('#modalWishlistAdd'),
				$modalRemoved = $('#modalWishlistRemove');
			$link.on('click', function (e) {
				var $this = $(this),
					$modal = $this.hasClass('active') ? $modalRemoved : $modalAdd;
				$.fancybox.open($modal, {
					animationDuration: 350,
					touch: false
				});
				$this.toggleClass('active');
				e.preventDefault();
			})
		},
		removePrd: function (link) {
			var $link = $(link);
			$link.on('click', function (e) {
				var $prd = $(this).closest('.minicart-prd');
				$prd.fadeOut('300', function () {
					$(this).remove();
				});
				e.preventDefault();
			})
		}
	};
	GOODWIN.catalog = {
		init: function () {
			this.fixedSidebar('.js-product-fixed-col');
			this.blockCollapse('.sidebar-block');
			this.mobileFilter('.fixed-col');
			this.viewMode('.view-mode'); // product view mode toggle
			this.viewInRow('.view-in-row'); // product number in row toggle
			this.markSelectedFilter();
			this.emptyCategoryDisable('.filter-row');
			this.sortOptions('ul[data-sort]');
			this.ajaxShowMore('.js-product-show-more');
		},
		ajaxShowMore: function (link) {
			var $link = $(link),
				$container = $('.prd-grid'),
				$wrapper = $('.prd-grid-wrap');
			$link.on('click', function (e) {
				var target = $(this).attr('data-load');
				$wrapper.addClass('is-loading');
				$.ajax({
					url: target,
					success: function (data) {
						setTimeout(function () {
							$container.append(data);
							$wrapper.removeClass('is-loading');
							GOODWIN.catalog.postAjaxCatalog();
						}, 500);
					}
				});
				e.preventDefault();
			})
		},
		postAjaxCatalog: function () {
			//GOODWIN.emptycategorydisable.reinit();
			//GOODWIN.catalog.blockCollapse('.sidebar-block');
			//GOODWIN.catalog.markSelectedFilter();
			//GOODWIN.catalog.emptyBlockDisable('.prd-rating');
			GOODWIN.colortoggle.reinit();
			GOODWIN.initialization.productWidth('.prd, .prd-hor');
			GOODWIN.product.selectPicker();
			GOODWIN.product.quickView();
			GOODWIN.initialization.imageLoaded('.prd.prd-has-loader, .prd-hor.prd-has-loader, .has-loader');
			GOODWIN.initialization.countdown('.prd .js-countdown');
		},
		sortOptions: function (obj) {
			$(obj).each(function () {
				var $sizeList = $(this),
					defaultSort = ["xs", "s", "m", "l", "xl", "36", "38", "40", "42"],
					sortData = $sizeList.data('sort') ? $sizeList.data('sort') : defaultSort,
					unsortedArray = [];

				function intersect(a, b) {
					var t;
					if (b.length > a.length) t = b, b = a, a = t;
					return a.filter(function (e) {
						return b.indexOf(e) > -1;
					});
				}

				function sort_li(a, b) {
					return ($(b).data('position')) < ($(a).data('position')) ? 1 : -1;
				}

				$("li", $sizeList).each(function () {
					unsortedArray.push($(this).data('value'))
				});
				var sortedArray = intersect(sortData, unsortedArray);
				$("li", $sizeList).each(function (i) {
					var $this = $(this);
					$this.data("position", sortedArray.indexOf($this.data('value')));
				});
				$("li", $sizeList).sort(sort_li).appendTo($sizeList);
			})
		},
		emptyBlockDisable: function (obj) {
			$(obj).each(function () {
				$(this).remove();
			})
		},
		emptyCategoryDisable: function () {
			var EmptyCategoryDisable = {
				data: {
					emptyBlock: '.empty-category',
					filterRow: '.filter-row',
					disableClass: 'disable'
				},
				init: function (options) {
					$.extend(this.data, options);
					this.reinit();
				},
				reinit: function () {
					if ($(this.data.emptyBlock).length) {
						$(this.data.filterRow).addClass(this.data.disableClass)
					} else {
						$(this.data.filterRow).removeClass(this.data.disableClass)
					}
				}
			}
			GOODWIN.emptycategorydisable = Object.create(EmptyCategoryDisable);
			GOODWIN.emptycategorydisable.init();
		},
		markSelectedFilter: function () {
			var MarkSelectedFilter = {
				data: {
					block: '.sidebar-block',
					marker: 'selected',
					active: '.active'
				},
				init: function (options) {
					$.extend(this.data, options);
					this.reinit();
				},
				reinit: function () {
					var that = this;
					$(that.data.block).each(function () {
						var $this = $(this);
						if ($this.find(that.data.active).length) {
							$this.addClass(that.data.marker)
						} else {
							$this.removeClass(that.data.marker)
						}
					})
				}
			}
			GOODWIN.markselectedfilter = Object.create(MarkSelectedFilter);
			GOODWIN.markselectedfilter.init();
		},
		fixedSidebar: function (el) {
			var FixedSidebar = {
				options: {
					header: '.sticky-holder',
					sidebar: '.fixed-col',
					container: '.fixed-col_container',
					sidebarscroll: '.fixed-scroll',
					ymin: '.fixed-col',
					ymax: '.ymax',
					fstart: '.fstart',
					fend: '.fend',
					delta: 10,
					hideOnScroll: '#at15s'
				},
				init: function (options) {
					$.extend(this.options, options);
					FixedSidebar._setScroll(isMobile);
				},
				reinit: function (windowW) {
					FixedSidebar._setScroll(isMobile);
					return this;
				},
				_setScroll: function (isMobile) {
					var that = this;
					if ($window.scrollTop() > $(this.options.ymin).offset().top && !$('body').data('checkstart')) {
						$('body').data('checkstart', true);
					} else $('body').data('checkstart', true);
					$window.off('scroll.fixedsidebar');
					$(this.options.sidebar).removeClass('is-fixed is-fixed-bottom');
					$(this.options.container).css({
						'left': '',
						'width': ''
					});
					var windowHeight = $window.height();
					if (!isMobile) {
						$(this.options.sidebarscroll).css({
							'max-height': windowHeight + 'px'
						});
						$(this.options.container).css({
							'left': $(this.options.container).offset().left + 'px',
							'width': $(this.options.container).width() + 'px'
						});
						if ($(this.options.ymax).offset().top - $(this.options.fend).offset().top > 50) {
							$window.on('scroll.fixedsidebar', function (e) {
								FixedSidebar._checkFixed();
								$(that.options.hideOnScroll).hide()
							});
						}
						FixedSidebar._checkFixed();
						$window.scroll();
						return this;
					}
				},
				_checkFixed: function () {
					var scrollY = $window.scrollTop();
					if (!$(this.options.sidebar).hasClass('is-fixed')) {
						if (scrollY > $(this.options.ymin).offset().top) {
							if ($(this.options.fend).offset().top < $(this.options.ymax).offset().top - this.options.delta) {
								$(this.options.sidebar).addClass('is-fixed');
								if ($body.hasClass('has-sticky')) {
									$(this.options.sidebarscroll).css({
										'padding-top': $(this.options.header).outerHeight() + 20
									});
								}
								if ($(this.options.fend).offset().top > $(this.options.ymax).offset().top) {
									$(this.options.sidebar).addClass('is-fixed-bottom');
								}
							}
						}
					} else {
						if (scrollY > $(this.options.ymin).offset().top) {
							if (($(this.options.fend).offset().top + $(this.options.container).innerHeight()) > $(this.options.ymax).offset().top) {
								$(this.options.sidebar).addClass('is-fixed-bottom');
							}
							if (scrollY < $(this.options.fstart).offset().top) {
								$(this.options.sidebar).removeClass('is-fixed-bottom');
							}
						} else {
							$(this.options.sidebar).removeClass('is-fixed is-fixed-bottom');
							$(this.options.sidebarscroll).css({
								'padding-top': ''
							});
						}
					}
					if ($(this.options.hideOnScroll).length > 0) {
						$(this.options.hideOnScroll).hide();
					}
					if ($(this.options.container).data('hidden')) {
						$(this.options.container).animate({
							'opacity': '1'
						}, 1000).removeData('hidden');
					}
					return this;
				}
			};
			if ($(el).length) {
				GOODWIN.fixedsidebar = Object.create(FixedSidebar);
				GOODWIN.fixedsidebar.init({});
			}
		},
		blockCollapse: function (el) {
			var collapsed = el,
				slidespeed = 250;
			$('.sidebar-block_content', collapsed).each(function () {
				if ($(this).parent().is('.open')) {
					$(this).slideDown(0);
				}
			});
			$('.sidebar-block_title', collapsed).on('click.blockCollapse', function (e) {
				e.preventDefault;
				var $this = $(this),
					$thiscontent = $this.next('.sidebar-block_content');
				if ($this.parent().is('.open')) {
					$this.parent().removeClass('open');
					$thiscontent.slideUp(slidespeed);
				} else {
					$this.parent().addClass('open');
					$thiscontent.slideDown(slidespeed);
				}
			});
		},
		mobileFilter: function (el) {
			var $mobileFilter = $(el),
				toggleFilter = '.fixed-col-toggle, .filter-close';
			$document.on('click', toggleFilter, function (e) {
				$mobileFilter.toggleClass('active');
				$('body').toggleClass('is-fixed');
				$('.fixed-col_container').scrollLock('enable');
				e.preventDefault();
			});
			$document.on('touchstart click', '.fixed-col', function (e) {
				if ($(e.target).hasClass('active')) {
					$mobileFilter.removeClass('active');
					$('body').removeClass('is-fixed');
					e.preventDefault();
				}
			});
		},
		viewMode: function (viewmode) {
			var $grid = $('.grid-view', $(viewmode)),
				$list = $('.list-view', $(viewmode)),
				$products = $('.prd-grid'),
				$hideListView = $('.view-in-row, .view-label');
			if ($('.listing-view').length) {
				$list.addClass('active');
				$hideListView.addClass('hidden');
			} else $grid.addClass('active');
			$grid.on("click", function (e) {
				var $this = $(this);
				if (!$this.is('.active')) {
					$list.removeClass('active');
					$this.addClass('active');
					$products.removeClass('listing-view');
					$hideListView.removeClass('hidden');
				}
				e.preventDefault();
			});
			$list.on("click", function (e) {
				var $this = $(this);
				if (!$this.is('.active')) {
					$grid.removeClass('active');
					$this.addClass('active');
					$products.addClass('listing-view');
					$hideListView.addClass('hidden');
				}
				e.preventDefault();
			});
		},
		viewInRow: function (view) {
			var $link = $('[data-view]', $(view)),
				$products = $('.js-category-grid'),
				$one = $('[data-view="data-to-show-sm-1"]', $(view)),
				$two = $('[data-view="data-to-show-sm-2"]', $(view)),
				$two_md = $('[data-view="data-to-show-md-2"]', $(view)),
				$three_md = $('[data-view="data-to-show-md-3"]', $(view)),
				$three = $('[data-view="data-to-show-3"]', $(view)),
				$four = $('[data-view="data-to-show-4"]', $(view)),
				view12 = maxSM,
				view23 = 1024;

			function setView() {
				var windowWidth = window.innerWidth || $window.width();
				if (windowWidth <= view12) {
					if ($products.hasClass('data-to-show-sm-2')) {
						clearClass();
						$two.addClass('active');
					} else if ($products.hasClass('data-to-show-sm-1')) {
						clearClass();
						$one.addClass('active');
					}
				} else if (windowWidth > view12 && windowWidth <= view23) {
					if ($products.hasClass('data-to-show-md-3')) {
						clearClass();
						$three_md.addClass('active');
					} else if ($products.hasClass('data-to-show-md-2')) {
						clearClass();
						$two_md.addClass('active');
					}
				} else if (windowWidth > view23) {
					if ($products.hasClass('data-to-show-lg-3') || $products.hasClass('data-to-show-3')) {
						clearClass();
						$three.addClass('active');
					} else if ($products.hasClass('data-to-show-lg-4') || $products.hasClass('data-to-show-4')) {
						clearClass();
						$four.addClass('active');
					}
				}
			}

			setView();
			var setViewFn = debouncer(function () {
				setView();
			}, 250);
			$(window).on('resize', setViewFn);

			function clearClass(classes) {
				$link.removeClass('active');
				$products.removeClass(classes);
			}

			function allEvent(obj) {
				$products.addClass(obj.attr('data-view'));
				GOODWIN.initialization.productWidth('.prd, .prd-hor');
				GOODWIN.product.productHeightResize('.prd');
				setTimeout(function () {
					GOODWIN.sidefixed.reinit();
				}, 500)
			}

			$four.on("click", function (e) {
				var $this = $(this);
				if (!$this.is('.active')) {
					clearClass('data-to-show-3 data-to-show-lg-3');
					$this.addClass('active');
					allEvent($this);
				}
				e.preventDefault();
			});
			$three.on("click", function (e) {
				var $this = $(this);
				if (!$this.is('.active')) {
					clearClass('data-to-show-4 data-to-show-lg-4');
					$this.addClass('active');
					allEvent($this);
				}
				e.preventDefault();
			});
			$three_md.on("click", function (e) {
				var $this = $(this);
				if (!$this.is('.active')) {
					clearClass('data-to-show-md-2');
					$this.addClass('active');
					allEvent($this);
				}
				e.preventDefault();
			});
			$two_md.on("click", function (e) {
				var $this = $(this);
				if (!$this.is('.active')) {
					clearClass('data-to-show-md-3');
					$this.addClass('active');
					allEvent($this);
				}
				e.preventDefault();
			});
			$two.on("click", function (e) {
				var $this = $(this);
				if (!$this.is('.active')) {
					clearClass('data-to-show-sm-1');
					$this.addClass('active');
					allEvent($this);
				}
				e.preventDefault();
			});
			$one.on("click", function (e) {
				var $this = $(this);
				if (!$this.is('.active')) {
					clearClass('data-to-show-sm-2');
					$this.addClass('active');
					allEvent($this);
				}
				e.preventDefault();
			});
		}
	}
	GOODWIN.forms = {
		init: function () {
			this.checkoutTabs();
			this.checkoutAccordion();
			this.showRecoverPasswordForm();
			this.showForm();
			this.contactForm('#contactForm');
		},
		contactForm: function (form) {
			var $contactForm = $(form);
			$contactForm.validator().on('submit', function (e) {
				if (!e.isDefaultPrevented()) {
					e.preventDefault();
					$contactForm.ajaxSubmit({
						type: "POST",
						data: $contactForm.serialize(),
						url: "php/process-contact.php",
						success: function success() {
							$('.success-confirm', $contactForm).fadeIn();
							$contactForm.get(0).reset();
						},
						error: function error() {
							$('.error-confirm', $contactForm).fadeIn();
						}
					});
				}
			});
		},
		checkoutTabs: function () {
			$('.step-next').on('click', function () {
				var nextId = $(this).closest('.tab-pane').next().attr("id");
				$('[href=#' + nextId + ']').tab('show');
				return false;
			})
			$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
				var step = $(e.target).data('step');
				var percent = (parseInt(step) / 4) * 100;
				$('.progress-bar').css({width: percent + '%'});
				e.relatedTarget
			})
		},
		checkoutAccordion: function () {
			$('.step-next-accordion').on('click', function () {
				var $nextPanel = $(this).closest('.panel').next('.panel');
				if ($nextPanel) $nextPanel.find('.panel-title > a').trigger('click');
				return false;
			})
		},
		showRecoverPasswordForm: function () {
			var $link = $('.js-toggle-forms'),
				$form1 = $('#loginForm'),
				$form2 = $('#recoverPasswordForm');
			$link.on('click', function (e) {
				$form1.toggleClass('d-none');
				$form2.toggleClass('d-none');
				e.preventDefault();
			})
		},
		showForm: function () {
			var $linkShow = $('.js-show-form'),
				$linkClose = $('.js-close-form');
			$linkShow.on('click', function (e) {
				$($(this).data('form')).removeClass('d-none');
				e.preventDefault();
			})
			$linkClose.on('click', function (e) {
				$($(this).data('form')).addClass('d-none');
				e.preventDefault();
			})
		}
	};
	GOODWIN.sections = {
		init: function () {
			this.slickCarousels();
			this.carouselTab();
			this.prdCarousel();
			this.instaFeed('.js-instagram-feed');
			this.galleryIsotope();
			this.productIsotope();
			this.productIsotopeSm();
			this.timeLine();
		},
		productIsotopeSm: function () {
			var ProductIsotopeSm = {
				data: {
					gallery: '.js-product-isotope-sm',
					galleryItem: '.prd',
					filtersList: '.js-filters-prd-sm',
					filtersLabel: '.filters-label',
					filtersCount: '.filters-label-count',
					activeClass: 'active',
					dataAttr: 'data-filter',
					layoutMode: 'fitRows',
					currentFilter: ''
				},
				init: function (options) {
					$.extend(this.data, options);
					var that = this;
					$(that.data.gallery).each(function () {
						var $gallery = $(this),
							$filtersList = $(that.data.filtersList, $gallery.closest('.holder'));
						if ($filtersList.length) {
							if (w >= maxSM) {
								if ($gallery.data('isotope')) {
									$gallery.isotope('destroy');
								}
							} else if (!$(that.data.gallery).data('isotope')) {
								that._galleryInit($gallery);
							}
						}
					})
				},
				reinit: function () {
					var that = this;
					$(that.data.gallery).each(function () {
						var $gallery = $(this),
							$filtersList = $(that.data.filtersList, $gallery.closest('.holder'));
						if ($filtersList.length) {
							if (w >= maxSM) {
								if ($gallery.data('isotope')) {
									$gallery.isotope('destroy');
								}
							} else if (!$(that.data.gallery).data('isotope')) {
								that._galleryInit($gallery);
							}
						}
					})
					return this;
				},
				_galleryInit: function (gallery) {
					var $gallery = gallery,
						that = this,
						$filtersList = $(that.data.filtersList, $gallery.closest('.holder')),
						ltr = $('body').is('.rtl') ? false : true;
					if ($filtersList.length) {
						$gallery.imagesLoaded(function () {
							$gallery.isotope({
								isOriginLeft: ltr,
								itemSelector: that.data.galleryItem,
								layoutMode: that.data.layoutMode,
								percentPosition: true,
								filter: function () {
									var filterResult = that.data.currentFilter ? $(this).is(that.data.currentFilter) : true;
									return filterResult;
								}
							});
						});
						that._filters(this);
					}
					return this;
				},
				_filters: function (obj) {
					var activeStart,
						$gallery = $(obj.data.gallery),
						$filtersList = $(obj.data.filtersList, $gallery.closest('.holder')),
						$filtersLabel = $(obj.data.filtersList + ' ' + obj.data.filtersLabel),
						activeClass = obj.data.activeClass,
						dataAttr = obj.data.dataAttr;
					$filtersLabel.each(function () {
						var $this = $(this),
							$gallery = $(obj.data.gallery, $this.closest('.holder'));
						var filtered = $this.attr(dataAttr),
							count = (filtered == null) ? $gallery.find(obj.data.galleryItem).length : $gallery.find(filtered).length;
						$this.find(obj.data.filtersCount).html(count);
						if ($this.hasClass(activeClass)) {
							activeStart = true;
							obj.data.currentFilter = $this.attr(dataAttr);
							$gallery.isotope();
						}
					});
					if (!activeStart) $(obj.data.filtersList + ' ' + obj.data.filtersLabel + ':first-child').addClass(activeClass);
					$filtersLabel.on('click', function (e) {
						e.preventDefault();
						var $this = $(this),
							$gallery = $(obj.data.gallery, $this.closest('.holder'));
						if ($this.hasClass(activeClass)) {
							return false;
						} else {
							$filtersLabel.removeClass(activeClass);
							$this.addClass(activeClass)
						}
						obj.data.currentFilter = $this.attr(dataAttr);
						$gallery.isotope();
					});
				}
			}
			GOODWIN.productisotopeSM = Object.create(ProductIsotopeSm);
			GOODWIN.productisotopeSM.init({
				gallery: '.js-product-isotope-sm',
				filtersList: '.js-filters-prd-sm'
			});
		},
		productIsotope: function () {
			var ProductIsotope = {
				data: {
					gallery: '.js-product-isotope',
					galleryItem: '.prd',
					filtersList: '.js-filters-prd',
					filtersLabel: '.filters-label',
					filtersCount: '.filters-label-count',
					activeClass: 'active',
					dataAttr: 'data-filter',
					layoutMode: 'fitRows',
					currentFilter: ''
				},
				init: function (options) {
					$.extend(this.data, options);
					var $gallery = $(this.data.gallery),
						$filtersList = $(this.data.filtersList, $gallery.closest('.holder'));
					if ($filtersList.length) {
						$.extend(this.data, options);
						if (!$(this.data.gallery).data('isotope')) {
							this._galleryInit(this);
						}
					} else return false;
				},
				reinit: function () {
					var $gallery = $(this.data.gallery),
						$filtersList = $(this.data.filtersList, $gallery.closest('.holder'));
					if ($filtersList.length) {
						if (!$(this.data.gallery).data('isotope')) {
							this._galleryInit(this);
						}
						var $gallery = $(this.data.gallery);
						var ltr = $('body').is('.rtl') ? false : true;
						$gallery.isotope({
							isOriginLeft: ltr
						});
						return this;
					} else return false;
				},
				_galleryInit: function (obj) {
					var $gallery = $(obj.data.gallery),
						$filtersList = $(obj.data.filtersList, $gallery.closest('.holder'));
					if ($filtersList.length) {
						var ltr = $('body').is('.rtl') ? false : true;
						$gallery.imagesLoaded(function () {
							$gallery.isotope({
								isOriginLeft: ltr,
								itemSelector: obj.data.galleryItem,
								layoutMode: obj.data.layoutMode,
								percentPosition: true,
								filter: function () {
									var filterResult = obj.data.currentFilter ? $(this).is(obj.data.currentFilter) : true;
									return filterResult;
								}
							});
						});
						this._filters(this);
					}
					return this;
				},
				_filters: function (obj) {
					var activeStart,
						$gallery = $(obj.data.gallery),
						$filtersList = $(obj.data.filtersList, $gallery.closest('.holder')),
						$filtersLabel = $(obj.data.filtersList + ' ' + obj.data.filtersLabel),
						activeClass = obj.data.activeClass,
						dataAttr = obj.data.dataAttr;
					$filtersLabel.each(function () {
						var $this = $(this),
							$gallery = $(obj.data.gallery, $this.closest('.holder'));
						var filtered = $this.attr(dataAttr),
							count = (filtered == null) ? $gallery.find(obj.data.galleryItem).length : $gallery.find(filtered).length;
						$this.find(obj.data.filtersCount).html(count);
						if ($this.hasClass(activeClass)) {
							activeStart = true;
							obj.data.currentFilter = $this.attr(dataAttr);
							$gallery.isotope();
						}
					});
					if (!activeStart) $(obj.data.filtersList + ' ' + obj.data.filtersLabel + ':first-child').addClass(activeClass);
					$filtersLabel.on('click', function (e) {
						e.preventDefault();
						var $this = $(this),
							$gallery = $(obj.data.gallery, $this.closest('.holder'));
						if ($this.hasClass(activeClass)) {
							return false;
						} else {
							$filtersLabel.removeClass(activeClass);
							$this.addClass(activeClass)
						}
						obj.data.currentFilter = $this.attr(dataAttr);
						$gallery.isotope();
					});
				}
			}
			GOODWIN.productisotope = Object.create(ProductIsotope);
			GOODWIN.productisotope.init({
				gallery: '.js-product-isotope'
			});
		},
		galleryIsotope: function () {
			var GalleryIsotope = {
				data: {
					gallery: '.js-gallery-isotope',
					galleryItem: '.gallery-item',
					filtersList: '.js-filters-gallery',
					filtersLabel: '.filters-label',
					filtersCount: '.filters-label-count',
					activeClass: 'active',
					dataAttr: 'data-filter',
					layoutMode: 'fitRows',
					popupImage: '[data-fancybox="gallery"]',
					currentFilter: ''
				},
				init: function (options) {
					$.extend(this.data, options);
					this._galleryInit(this);
					this._filters(this);
					this._popup(this);
				},
				reinit: function () {
					var $gallery = $(obj.data.gallery);
					$gallery.isotope();
					return this;
				},
				_galleryInit: function (obj) {
					var $gallery = $(obj.data.gallery);
					$gallery.imagesLoaded(function () {
						$gallery.isotope({
							itemSelector: obj.data.galleryItem,
							layoutMode: obj.data.layoutMode,
							percentPosition: true,
							filter: function () {
								var filterResult = obj.data.currentFilter ? $(this).is(obj.data.currentFilter) : true;
								return filterResult;
							}
						});
						$gallery.isotope();
					});
					return this;
				},
				_popup: function (obj) {
					$('[data-fancybox]').fancybox({
						touch: false,
						buttons: ["close"]
					})
					var $popupImage = $(obj.data.gallery + ' ' + obj.data.popupImage);
					if ($popupImage.length) {
						$popupImage.fancybox({
							touch: false,
							buttons: ["close"]
						})
					}
					return this;
				},
				_filters: function (obj) {
					var activeStart,
						$gallery = $(obj.data.gallery),
						$filtersList = $(obj.data.filtersList, $gallery.closest('.holder')),
						$filtersLabel = $(obj.data.filtersList + ' ' + obj.data.filtersLabel),
						activeClass = obj.data.activeClass,
						dataAttr = obj.data.dataAttr;
					$filtersLabel.each(function () {
						var $this = $(this);
						var filtered = $this.attr(dataAttr),
							count = (filtered == null) ? $gallery.find(obj.data.galleryItem).length : $gallery.find(filtered).length;
						$this.find(obj.data.filtersCount).html(count);
						if ($this.hasClass(activeClass)) {
							activeStart = true;
							obj.data.currentFilter = $this.attr(dataAttr);
							$gallery.isotope();
						}
					});
					if (!activeStart) $(obj.data.filtersList + ' ' + obj.data.filtersLabel + ':first-child').addClass(activeClass);
					$filtersLabel.on('click', function (e) {
						e.preventDefault();
						var $this = $(this);
						if ($this.hasClass(activeClass)) return false;
						else {
							$filtersLabel.removeClass(activeClass);
							$this.addClass(activeClass)
						}
						obj.data.currentFilter = $this.attr(dataAttr);
						$gallery.isotope();
					});
				}
			}
			GOODWIN.gallery = Object.create(GalleryIsotope);
			GOODWIN.gallery.init({});
		},
		slickCarousels: function () {
			function arrowCenter(_carousel, arrow, image) {
				var carousel = _carousel;
				$(arrow, _carousel).css({
					'top': $(image, carousel).height() * 0.5
				});
			}

			$('.data-slick').each(function () {
				var $this = $(this),
					arrowsplace = $this.parent().find('.carousel-arrows').length ? $this.parent().find('.carousel-arrows') : $this;
				$this.imagesLoaded(function () {
					$this.on('init', function () {
						GOODWIN.initialization.productWidth('.prd', $this);
					})
					$this.slick({
						appendArrows: arrowsplace,
						swipe: swipemode,
						infinite: false
					});
					if ($this.hasClass('collection-carousel-2')) {
						arrowCenter($this, '.slick-arrow', '.collection-carousel-2-img > img');
					}
				})
			})
			$('.js-bigcarousel').each(function () {
				var $this = $(this);
				if ($this.children().length > 2 && !$this.closest('.aside').length) {
					$this.slick({
						arrows: true,
						dots: false,
						slidesToShow: 1,
						centerMode: true,
						centerPadding: '150px',
						swipe: swipemode,
						responsive: [{
							breakpoint: maxMD,
							settings: {
								centerPadding: '0'
							}
						}, {
							breakpoint: maxXS,
							settings: {
								dots: true,
								arrows: false,
								centerPadding: '0'
							}
						}]
					})
				} else {
					$this.slick({
						arrows: true,
						dots: false,
						slidesToShow: 1,
						swipe: swipemode,
						responsive: [{
							breakpoint: maxXS,
							settings: {
								dots: true,
								arrows: false
							}
						}]
					})
				}
			})
			$('.prd-promo-carousel').each(function () {
				$(this).slick({
					arrows: false,
					dots: true,
					//vertical: true,
					slidesToShow: 1,
					adaptiveHeight: true,
					swipe: swipemode,
					infinite: false
				});
			})
			$('.prd-carousel-menu').each(function () {
				var $this = $(this);
				$this.on('init', function () {
					$this.slice(1).imagesLoaded(function () {
						arrowCenter($this, '.slick-arrow', '.prd-img > img');
					})
				}).slick();
			})
			$('.post-prws-carousel').each(function () {
				var $this = $(this);
				var arrowsplace = $this.parent().find('.carousel-arrows');
				$this.slick({
					arrows: true,
					dots: false,
					slidesToShow: 2,
					appendArrows: arrowsplace,
					swipe: swipemode,
					infinite: false
				});
			})
			$('.promo-carousel').each(function () {
				var $this = $(this);
				var arrowsplace = $this.parent().find('.carousel-arrows').length ? $this.parent().find('.carousel-arrows') : $this;
				$this.slick({
					arrows: true,
					dots: false,
					slidesToShow: 1,
					appendArrows: arrowsplace,
					swipe: swipemode,
					infinite: false
				});
			})
			$('.brand-prd-carousel').each(function () {
				var $this = $(this);
				$this.slick({
					arrows: false,
					dots: true,
					slidesToShow: 1,
					swipe: swipemode,
					infinite: false
				});
			})
			$('.js-brand-carousel-full').each(function () {
				var $this = $(this);
				if ($this.hasClass('slick-initialized')) return false;
				var arrowsplace = $this.parent().find('.carousel-arrows').length ? $this.parent().find('.carousel-arrows') : $this,
					slidesToShow_lg = 6,
					slidesToScroll_lg = 3,
					slidesToShow_md = 4,
					slidesToScroll_md = 2;
				if ($this.closest('.aside ').length) {
					slidesToShow_lg = 4;
					slidesToScroll_lg = 2;
					slidesToShow_md = 3;
					slidesToScroll_md = 1;
				}
				$this.slick({
					arrows: true,
					dots: false,
					slidesToShow: slidesToShow_lg,
					slidesToScroll: slidesToScroll_lg,
					appendArrows: arrowsplace,
					swipe: swipemode,
					infinite: false,
					responsive: [{
						breakpoint: maxMD,
						settings: {
							slidesToShow: slidesToShow_md,
							slidesToScroll: slidesToScroll_md
						}
					}, {
						breakpoint: maxXS,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}]
				});
			})
			$('.js-brand-carousel').each(function () {
				var $this = $(this);
				var arrowsplace = $this.parent().find('.carousel-arrows').length ? $this.parent().find('.carousel-arrows') : $this,
					slidesToShow_lg = 6,
					slidesToScroll_lg = 3,
					slidesToShow_md = 4,
					slidesToScroll_md = 2;
				if ($this.closest('.aside ').length) {
					slidesToShow_lg = 4;
					slidesToScroll_lg = 2;
					slidesToShow_md = 3;
					slidesToScroll_md = 1;
				}
				$this.slick({
					arrows: true,
					dots: false,
					slidesToShow: slidesToShow_lg,
					slidesToScroll: slidesToScroll_lg,
					appendArrows: arrowsplace,
					swipe: swipemode,
					infinite: false,
					responsive: [{
						breakpoint: maxMD,
						settings: {
							slidesToShow: slidesToShow_md,
							slidesToScroll: slidesToScroll_md
						}
					}, {
						breakpoint: maxXS,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}]
				});
			})
			$('.js-prd-carousel-vert').each(function () {
				var $this = $(this);
				var arrowsplace = $this.parent().find('.carousel-arrows').length ? $this.parent().find('.carousel-arrows') : $this;
				$this.slick({
					slidesToShow: 3,
					slidesToScroll: 1,
					arrows: true,
					vertical: true,
					appendArrows: arrowsplace,
					swipe: swipemode,
					speed: 300,
					infinite: false
				});
			})
		},
		prdCarousel: function () {
			var PrdCarousel = {
				data: {
					carousel: '.js-prd-carousel'
				},
				init: function (options) {
					$.extend(this.data, options);
					if (w < maxSM && $(this.data.carousel).hasClass('js-product-isotope-sm')) {
						return false;
					}
					this.reinit();
				},
				reinit: function () {
					if (w < maxSM && $(this.data.carousel).hasClass('js-product-isotope-sm')) {
						if ($(this.data.carousel).hasClass('slick-initialized')) {
							$(this.data.carousel).css({
								'height': ''
							}).slick('unslick');
						}
						return false;
					} else if ($(this.data.carousel).hasClass('slick-initialized')) {
						return false;
					}
					$(this.data.carousel).each(function () {
						var $this = $(this),
							arrowsplace;
						if ($this.parent().find('.carousel-arrows').length) {
							arrowsplace = $this.parent().find('.carousel-arrows');
						} else if ($this.closest('.holder').find('.carousel-arrows').length) {
							arrowsplace = $this.closest('.holder').find('.carousel-arrows');
						}
						$this.on('beforeChange', function () {
							$this.find('.color-swatch').each(function () {
								$(this).find('.js-color-toggle').first().trigger('click');
							})
						});
						$this.on('init', function () {
							GOODWIN.initialization.productWidth('.prd', $this);
							GOODWIN.initialization.imageLoaded($('.prd.prd-has-loader', $this), true);
						})
						var slidesToShow = 4,
							speed = 500;
						if ($this.hasClass('data-to-show-3')) {
							slidesToShow = 3;
							speed = 300
						} else if ($this.hasClass('data-to-show-2')) {
							slidesToShow = 2;
							speed = 200
						} else if ($this.hasClass('data-to-show-1')) {
							slidesToShow = 1;
							speed = 200
						}
						$this.slick({
							slidesToShow: slidesToShow,
							slidesToScroll: slidesToShow,
							arrows: true,
							appendArrows: arrowsplace,
							adaptiveHeight: true,
							swipe: swipemode,
							speed: speed,
							infinite: false,
							responsive: [{
								breakpoint: maxMD,
								settings: {
									slidesToShow: 3,
									slidesToScroll: 1
								}
							}, {
								breakpoint: maxXS,
								settings: {
									slidesToShow: 2,
									slidesToScroll: 1
								}
							}]
						});
					});
				}
			}
			GOODWIN.prdcarousel = Object.create(PrdCarousel);
			GOODWIN.prdcarousel.init({});
		},
		carouselTab: function () {
			var CarouselTab = {
				data: {
					carousel: '.js-prd-carousel-tab',
					tabs: '.js-filters-prd',
					tab: '.js-filters-prd [data-filter]'
				},
				init: function (options) {
					$.extend(this.data, options);
					if (w < maxSM) return false;
					this.reinit();
				},
				hide: function () {
					if (!$(this.data.carousel).length) {
						return false;
					}
					$(this.data.carousel).each(function () {
						var $this = $(this);
						if ($this.hasClass('slick-initialized')) {
							$this.removeClass('slick-initialized');
							$this.slick('slickUnfilter');
							$this.slick('unslick');
						}
					})
				},
				reinit: function () {
					if (w < maxSM) return false;
					var that = this;
					that._handler();
					$(that.data.carousel).each(function () {
						var $this = $(this);
						var arrowsplace;
						if ($this.parent().find('.carousel-arrows').length) {
							arrowsplace = $this.parent().find('.carousel-arrows');
						} else if ($this.closest('.holder').find('.carousel-arrows').length) {
							arrowsplace = $this.closest('.holder').find('.carousel-arrows');
						}
						$this.on('beforeChange', function () {
							$this.find('.color-swatch').each(function () {
								$(this).find('.js-color-toggle').first().trigger('click');
							})
						});
						$this.on('init', function () {
							GOODWIN.initialization.productWidth('.prd', $this);
						})
						var slidesToShow = parseInt($this.attr('data-to-show'), 10);
						if (w < maxMD) {
							slidesToShow = 3
						}
						$this.slick({
							slidesToShow: slidesToShow,
							slidesToScroll: slidesToShow,
							arrows: true,
							appendArrows: arrowsplace,
							adaptiveHeight: true,
							swipe: swipemode,
							speed: 400,
							infinite: false
						});
					});
					$(that.data.tabs).find('.active').trigger('click');
				},
				_handler: function () {
					var that = this;
					if ($(that.data.carousel).hasClass('.slick-initialized')) {
						return false
					}
					$(that.data.tab, $(that.data.carousel).closest('.holder')).on('click', function (e) {
						var $this = $(this),
							$carousel = $('#' + $this.parent().attr('data-grid')),
							filtername = $this.attr('data-filter');
						$this.siblings().removeClass('active');
						$this.addClass('active');
						$carousel.slick('slickUnfilter');
						$carousel.slick('slickFilter', '.' + filtername);
						e.preventDefault();
					})
				}
			}
			GOODWIN.carouseltab = Object.create(CarouselTab);
			GOODWIN.carouseltab.init({});
		},
		instaFeed: function (el) {
			$(el).each(function () {
				var $el = $(this),
					dataFeed = $el.data('instafeed'),
					id = $el.attr('id');
				var userFeed = new Instafeed({
					target: id,
					get: 'user',
					userId: 'self',
					accessToken: dataFeed.accessToken,
					limit: Math.round(dataFeed.limit),
					resolution: 'low_resolution',
					sortBy: dataFeed.sortBy,
					template: '<a href="{{link}}" target="_blank"><span><img class="lazyload blur-up" data-aspectratio="1" data-src="{{image}}" /></span></a>',
					after: function () {
						if (('.js-instagram-feed-container').length) {
							var count = $('a', $el).length;
							$('a', $el).slice(count / 2).detach().appendTo('.js-instagram-feed-container');
						}
					}
				})
				userFeed.run();
				if ($el.closest('.instagram-carousel').length) {
					var timer = setInterval(function () {
						doStuff()
					}, 100);

					function startInstagramCarousel(carousel) {
						var $carousel = $(carousel);
						$carousel.find('a').each(function () {
							$(this).attr('target', '_blank');
						});
						var arrowsplace = $carousel.next('.instagram-carousel-arrows');
						var $slider = $carousel.slick({
							speed: 500,
							slidesToShow: 6,
							slidesToScroll: 2,
							arrows: true,
							appendArrows: arrowsplace,
							swipe: swipemode,
							responsive: [{
								breakpoint: maxMD,
								settings: {
									slidesToShow: 4,
									slidesToScroll: 2
								}
							}, {
								breakpoint: maxSM,
								settings: {
									slidesToShow: 3,
									slidesToScroll: 2
								}
							}, {
								breakpoint: maxXS,
								settings: {
									slidesToShow: 1,
									slidesToScroll: 1,
									centerMode: true,
									centerPadding: '60px'
								}
							}]
						});
					}

					function doStuff() {
						if ($el.has('a').length) {
							clearInterval(timer);
							startInstagramCarousel($el);
						}
					}
				}
			})
		},
		timeLine: function () {
			var TimeLine = {
				options: {
					timeLine: '.timeLine',
					leftCol: 'timeLine-left',
					rightCol: 'timeLine-right',
					item: 'timeLine-item',
					oneColBreikpoint: 600
				},
				init: function (options) {
					$.extend(this.options, options);
					var isMobile = (window.innerWidth || $window.width()) < this.options.oneColBreikpoint;
					isMobile ? TimeLine._oneCol() : TimeLine._twoCol();
					var timeLine = this.options.timeLine
					setTimeout(function () {
						$(timeLine).addClass('loaded');
					}, 1000)
				},
				reinit: function (windowW) {
					var windowW = windowW ? windowW : (window.innerWidth || $(window).width()),
						isMobile = windowW < this.options.oneColBreikpoint;
					isMobile ? TimeLine._oneCol() : TimeLine._twoCol();
				},
				_oneCol: function () {
					var timeLine = this.options.timeLine,
						leftCol = '.' + this.options.leftCol,
						rightCol = '.' + this.options.rightCol,
						item = '.' + this.options.item;
					if ($(timeLine).hasClass('timeLine--twocols')) {
						$(leftCol).children().detach().appendTo(timeLine);
						$(rightCol).children().detach().appendTo(timeLine);
						$(leftCol).remove();
						$(rightCol).remove();
						$(timeLine).removeClass('timeLine--twocols');

						function sortItem(a, b) {
							return ($(b).data('order')) < ($(a).data('order')) ? 1 : -1;
						}

						$(item).sort(sortItem).appendTo(timeLine);
					} else {
						return this;
					}
				},
				_twoCol: function () {
					var $timeLine = $(this.options.timeLine),
						leftCol = '.' + this.options.leftCol,
						rightCol = '.' + this.options.rightCol,
						item = '.' + this.options.item;
					if ($timeLine.hasClass('timeLine--twocols')) {
						return this;
					} else {
						$(item, $timeLine).each(function (index, obj) {
							var $this = $(this);
							$this.attr('data-order', index);
							(index % 2 === 0) ? $this.attr('data-col', 'left') : $this.attr('data-col', 'right');
						})
						$timeLine.addClass('timeLine--twocols');
						$timeLine.append("<div class=" + this.options.leftCol + "></div>");
						$timeLine.append("<div class=" + this.options.rightCol + "></div>");
						$('[data-col="left"]', $timeLine).each(function () {
							$(this).detach().appendTo(leftCol)
						})
						$('[data-col="right"]', $timeLine).each(function () {
							$(this).detach().appendTo(rightCol)
						})
						return this;
					}
				}
			}
			GOODWIN.timeline = Object.create(TimeLine);
			GOODWIN.timeline.init({});
		}
	}
	GOODWIN.beforeReady = {
		init: function () {
			GOODWIN.header.mobileMenu('.mobilemenu');
		}
	};
	GOODWIN.documentReady = {
		init: function () {
			GOODWIN.initialization.init();
			GOODWIN.header.init();
			GOODWIN.sections.init();
			GOODWIN.forms.init();
			GOODWIN.product.init();
			GOODWIN.catalog.init();
			// special function on ready init
			GOODWIN.initialization.flowtype();
			GOODWIN.header.promoTopline('.promo-topline', '.js-promo-topline-close');
			GOODWIN.initialization.sliderTextTopShift();
			GOODWIN.initialization.backToTop('.js-back-to-top');
			GOODWIN.initialization.productWidth('.prd, .prd-hor');
			GOODWIN.initialization.sideFixed();
		}
	};
	GOODWIN.documentLoad = {
		init: function () {
			w = window.innerWidth || $window.width();
			GOODWIN.header.stickyHeaderInit();
			if (GOODWIN.sidefixed) GOODWIN.sidefixed.reinit();
			GOODWIN.initialization.scrollOnLoad();
			GOODWIN.initialization.productWidth('.prd, .prd-hor');
			$('.slick-initialized').slick('setPosition');
			$('body').removeClass('hide-until-loaded');
		}
	};
	GOODWIN.documentResize = {
		init: function () {
			clearTimeout(resizeTimer);
			if ((window.innerWidth || $window.width()) == w) {
				if (!$body.hasClass('touch')) {
					resizeTimer = setTimeout(function () {
						scrollWidth = calcScrollWidth();
						w = window.innerWidth || $window.width();
						isMobile = w < mobileMenuBreikpoint;
						GOODWIN.initialization.compensateScrollBar();
						GOODWIN.mobilemenupush.setHeigth();
						GOODWIN.slidertexttopshift.reinit();
						GOODWIN.setfullheight.reinit();
						GOODWIN.setfullheightslider.reinit();
						GOODWIN.sidefixed.reinit();
						GOODWIN.minicart.reinit(w);
					}, 500)
				}
			} else {
				GOODWIN.carouseltab.hide();
				GOODWIN.flowtype.hide('.bnr[data-fontratio]');
				GOODWIN.product.productHeightResize('.prd');
				resizeTimer = setTimeout(function () {
					scrollWidth = calcScrollWidth();
					w = window.innerWidth || $window.width();
					isMobile = w < mobileMenuBreikpoint;
					GOODWIN.mobilemenu.reinit();
					GOODWIN.prdrepos1.reinit(w);
					GOODWIN.prdrepos.reinit(w);
					GOODWIN.initialization.compensateScrollBar();
					GOODWIN.stickyheader.reinit(w);
					GOODWIN.prdcarousel.reinit();
					GOODWIN.fixedsidebar ? GOODWIN.fixedsidebar.reinit(w) : false;
					GOODWIN.slidertexttopshift.reinit();
					GOODWIN.setfullheight.reinit();
					GOODWIN.setfullheightslider.reinit();
					GOODWIN.colortoggle.reinit();
					GOODWIN.productisotopeSM.reinit();
					GOODWIN.carouseltab.reinit();
					GOODWIN.initialization.productWidth('.prd, .prd-hor');
					GOODWIN.scrollmenu.reinit(w);
					GOODWIN.minicart.reinit(w);
					GOODWIN.headerdrop.reinit();
					GOODWIN.mobilemenupush.setHeigth();
					GOODWIN.timeline.reinit(w);
					GOODWIN.sidefixed.reinit();
					GOODWIN.flowtype.reinit('.bnr[data-fontratio]');
					$('.slick-initialized').slick('setPosition');
					$.each(productGalleryArray, function (i) {
						productGalleryArray[i].elevateZoomReInit();
						productGalleryArray[i].previewsReInit();
					});
				}, 500);
			}
		}
	};
	var $body = $('body'),
		$window = $(window),
		$document = $(document),
		w = window.innerWidth || $window.width(),
		resizeTimer,
		scrollWidth = calcScrollWidth(),
		promoToplineHeight = 0,
		productGalleryArray = [],
		swipemode = false,
		maxXS = 480,
		maxSM = 768,
		maxMD = 992,
		mobileMenuBreikpoint = 991,
		isMobile = w < mobileMenuBreikpoint,
		productGallery;
	GOODWIN.beforeReady.init();
	$document.on('ready', GOODWIN.documentReady.init);
	$window.on('load', GOODWIN.documentLoad.init);
	$window.on('resize', GOODWIN.documentResize.init);
})(jQuery)