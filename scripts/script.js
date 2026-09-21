/* ============================================================
   AU MASCULIN — interactions
   Vanilla JS, sans dépendance. Tout est progressif : la page
   reste utilisable si le script ne se charge pas.
   ============================================================ */
(function () {
	'use strict';

	var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ---- En-tête : état « collé » au défilement ---- */
	var header = document.querySelector('.site-header');

	if (header) {
		var ticking = false;

		var syncHeader = function () {
			header.classList.toggle('is-stuck', window.scrollY > 24);
			ticking = false;
		};

		window.addEventListener('scroll', function () {
			if (!ticking) {
				ticking = true;
				window.requestAnimationFrame(syncHeader);
			}
		}, { passive: true });

		syncHeader();
	}

	/* ---- Tiroir mobile ---- */
	var burger = document.querySelector('.burger');
	var drawer = document.getElementById('drawer');

	function setDrawer(open) {
		if (!burger || !drawer) return;
		burger.setAttribute('aria-expanded', open ? 'true' : 'false');
		drawer.classList.toggle('is-open', open);
		document.body.classList.toggle('is-locked', open);
		drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
	}

	if (burger && drawer) {
		burger.addEventListener('click', function () {
			setDrawer(burger.getAttribute('aria-expanded') !== 'true');
		});

		// Un lien du tiroir referme toujours le tiroir
		drawer.addEventListener('click', function (e) {
			if (e.target.closest('a')) setDrawer(false);
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') setDrawer(false);
		});

		// Retour au bureau : on nettoie l'état
		var wide = window.matchMedia('(min-width: 1101px)');
		var onWide = function (e) { if (e.matches) setDrawer(false); };
		if (wide.addEventListener) wide.addEventListener('change', onWide);
		else wide.addListener(onWide);
	}

	/* ---- Sous-menus desktop sur écran tactile ----
	   Le survol ouvre déjà le menu en CSS ; sur tactile, le premier
	   appui ouvre, le second suit le lien. */
	var touchOnly = window.matchMedia('(hover: none)');
	var ddItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item.has-dd'));

	ddItems.forEach(function (item) {
		var link = item.querySelector('.nav-link');
		if (!link) return;

		link.addEventListener('click', function (e) {
			if (!touchOnly.matches) return;
			if (!item.classList.contains('is-open')) {
				e.preventDefault();
				ddItems.forEach(function (o) { o.classList.remove('is-open'); });
				item.classList.add('is-open');
				link.setAttribute('aria-expanded', 'true');
			}
		});
	});

	if (ddItems.length) {
		document.addEventListener('click', function (e) {
			if (e.target.closest('.nav-item.has-dd')) return;
			ddItems.forEach(function (item) {
				item.classList.remove('is-open');
				var l = item.querySelector('.nav-link');
				if (l) l.setAttribute('aria-expanded', 'false');
			});
		});
	}

	/* ---- Accordéons FAQ ---- */
	Array.prototype.forEach.call(document.querySelectorAll('.faq'), function (faq) {
		var single = faq.hasAttribute('data-single');

		faq.addEventListener('click', function (e) {
			var btn = e.target.closest('.faq-q');
			if (!btn || !faq.contains(btn)) return;

			var item = btn.closest('.faq-item');
			var open = !item.classList.contains('is-open');

			if (single && open) {
				Array.prototype.forEach.call(faq.querySelectorAll('.faq-item.is-open'), function (o) {
					o.classList.remove('is-open');
					o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
				});
			}

			item.classList.toggle('is-open', open);
			btn.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
	});

	/* ---- Révélation au défilement ---- */
	var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

	if (revealables.length && 'IntersectionObserver' in window && !reduced) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-in');
				io.unobserve(entry.target);
			});
		}, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

		revealables.forEach(function (el, i) {
			// Cadence les éléments d'une même rangée
			var group = el.closest('[data-stagger]');
			if (group) {
				var sibs = Array.prototype.slice.call(group.querySelectorAll('.reveal'));
				el.style.setProperty('--d', (sibs.indexOf(el) * 90) + 'ms');
			}
			io.observe(el);
		});
	} else {
		revealables.forEach(function (el) { el.classList.add('is-in'); });
	}

	/* ---- Bandeau défilant : duplication du contenu ---- */
	Array.prototype.forEach.call(document.querySelectorAll('.marquee-track'), function (track) {
		track.appendChild(track.firstElementChild.cloneNode(true));
	});

	/* ---- Formulaire de rendez-vous ----
	   Validation côté client uniquement. Le traitement réel
	   (courriel / CRM) doit être branché sur l'attribut action
	   du <form> une fois l'hébergement choisi. */
	var form = document.getElementById('rdv-form');

	if (form) {
		var status = form.querySelector('.form-status');

		var showError = function (field, msg) {
			var wrap = field.closest('.field') || field.closest('.consent');
			if (!wrap) return;
			wrap.classList.add('has-error');
			var err = wrap.querySelector('.err');
			if (err) err.textContent = msg;
		};

		var clearError = function (field) {
			var wrap = field.closest('.field') || field.closest('.consent');
			if (!wrap) return;
			wrap.classList.remove('has-error');
			var err = wrap.querySelector('.err');
			if (err) err.textContent = '';
		};

		form.addEventListener('input', function (e) {
			if (e.target.matches('input, select, textarea')) clearError(e.target);
		});

		form.addEventListener('submit', function (e) {
			var fields = Array.prototype.slice.call(form.querySelectorAll('[required]'));
			var firstBad = null;

			fields.forEach(function (field) {
				clearError(field);

				var empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();

				if (empty) {
					showError(field, 'Ce champ est requis.');
					firstBad = firstBad || field;
				} else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(field.value.trim())) {
					showError(field, 'Adresse courriel invalide.');
					firstBad = firstBad || field;
				} else if (field.type === 'tel' && field.value.replace(/\D/g, '').length < 10) {
					showError(field, 'Numéro de téléphone incomplet.');
					firstBad = firstBad || field;
				}
			});

			if (firstBad) {
				e.preventDefault();
				firstBad.focus();
				return;
			}

			// Aucun back-end branché : on confirme visuellement sans recharger.
			if (!form.getAttribute('action')) {
				e.preventDefault();
				if (status) {
					status.hidden = false;
					status.textContent = 'Merci. Votre demande a été enregistrée — nous vous rappelons sous 24 h ouvrables.';
					status.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
				}
				form.reset();
			}
		});
	}

	/* ---- Carrousel du héros ----
	   Défilement automatique des visuels, mise en pause au survol
	   et au focus. Sans JS, la première image reste affichée. */
	var slider = document.querySelector('[data-slider]');

	if (slider) {
		var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
		var dotsWrap = slider.querySelector('.hero-dots');
		var index = 0;
		var timer = null;
		var delay = 5200;

		if (slides.length) {
			var show = function (i) {
				index = (i + slides.length) % slides.length;
				slides.forEach(function (slide, n) {
					slide.classList.toggle('is-active', n === index);
				});
				if (dotsWrap) {
					Array.prototype.forEach.call(dotsWrap.children, function (dot, n) {
						dot.setAttribute('aria-current', n === index ? 'true' : 'false');
					});
				}
			};

			if (dotsWrap) {
				slides.forEach(function (slide, n) {
					var dot = document.createElement('button');
					dot.type = 'button';
					dot.setAttribute('aria-label', 'Visuel ' + (n + 1));
					dot.addEventListener('click', function () {
						show(n);
						restart();
					});
					dotsWrap.appendChild(dot);
				});
			}

			var stop = function () { window.clearInterval(timer); };
			var start = function () {
				if (reduced || slides.length < 2) return;
				timer = window.setInterval(function () { show(index + 1); }, delay);
			};
			var restart = function () { stop(); start(); };

			slider.addEventListener('mouseenter', stop);
			slider.addEventListener('mouseleave', start);
			slider.addEventListener('focusin', stop);
			slider.addEventListener('focusout', start);
			document.addEventListener('visibilitychange', function () {
				if (document.hidden) { stop(); } else { start(); }
			});

			show(0);
			start();
		}
	}

	/* ---- Héros de l'accueil : fondu enchaîné des affiches ----
	   Une affiche toutes les six secondes, en fondu. Le cadre suit le
	   format de l'affiche affichée : les affiches du client n'ont pas
	   toutes les mêmes proportions et aucune n'est rognée pour entrer
	   dans le format d'une autre. Sans JS, la première reste seule. */
	var affiches = document.querySelector('[data-affiches]');

	if (affiches) {
		var vues = Array.prototype.slice.call(affiches.querySelectorAll('img'));

		if (vues.length > 1) {
			var vue = 0;
			var minuterie = null;

			var montrer = function (i) {
				vue = (i + vues.length) % vues.length;
				vues.forEach(function (img, n) {
					img.classList.toggle('is-active', n === vue);
				});
				affiches.style.setProperty('--affiche-ratio', vues[vue].dataset.ratio);
				affiches.style.setProperty('--affiche-ratio-full', vues[vue].dataset.ratioFull);
			};

			var arreter = function () { window.clearInterval(minuterie); };
			var demarrer = function () {
				if (reduced) return;
				arreter();
				minuterie = window.setInterval(function () { montrer(vue + 1); }, 6000);
			};

			document.addEventListener('visibilitychange', function () {
				if (document.hidden) { arreter(); } else { demarrer(); }
			});

			montrer(0);
			demarrer();
		}
	}

	/* ---- Année courante dans le pied de page ---- */
	Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
		el.textContent = new Date().getFullYear();
	});
})();
