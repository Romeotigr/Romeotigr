// Маски для форм
$(document).ready(function() {
	 $(".phone").mask("+7 (999) 999-99-99");
});

// Спойлеры

$(document).ready(function() {
	$('.item-question__title').click(function(event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});
});

// Попапы

let popupLinks = document.querySelectorAll('.popup__link');
	
	
let unlock = true;
const timeout = 800;


for(let popupLink of popupLinks){
	popupLink.addEventListener('click', function(e) {
		let popupName = popupLink.getAttribute('href').replace('#', '');
		let curentPopup = document.getElementById(popupName);
		popupOpen(curentPopup);
		e.preventDefault();
	})
}

let popupCloseIcons = document.querySelectorAll('.close-popup');
for(let popupCloseIcon of popupCloseIcons){
	popupCloseIcon.addEventListener('click', function(e) {
		popupClose(this.closest('.popup'));
		e.preventDefault();
	})
}

function popupOpen(curentPopup) {
	if(curentPopup && unlock){
		const popupActive = document.querySelector('.popup.open');
		curentPopup.classList.add('open');
		curentPopup.addEventListener('click', function(e) {
			if(!e.target.closest('.popup__content')){
				popupClose(e.target.closest('.popup'));
			};
		})
	}
}

function popupClose(popupActive) {
	popupActive.classList.remove('open');
}

(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();



// Определение вьюпорта для бургер-меню

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}
};

if (isMobile.any()) {
	document.body.classList.add('_touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let index = 0; index < menuArrows.length; index++) {
			const menuArrow = menuArrows[index];
			menuArrow.addEventListener("click", function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}

} else {
	document.body.classList.add('_pc');
}

// Меню бургер
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}


// Прокрутка при клике в меню
const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('.header__top').offsetHeight;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('menu__body__active');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}
			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}

// Плавное появление всех объектов


const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll() {
		for (let index = 0; index < animItems.length; index++) {
			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 4;

			let animItemPoint = window.innerHeight - animItemHeight / animStart;
			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
				animItem.classList.add('_active');
			} else {
				if (!animItem.classList.contains('_anim-no-hide')) {
					animItem.classList.remove('_active');
				}
			}
		}
		// Прилипающее меню
		//-----------------------------------------------//
		let menu = document.querySelector('.header__top');
		let menuHeight = menu.offsetHeight;
		let fullscreen = document.querySelector('.how');
		let fullscreenHeight = offset(fullscreen).top;
		const scrollY = window.scrollY || window.pageYOffset;
		function menuFixed() {
			if(scrollY > fullscreenHeight){
				menu.classList.add('act');
				}else{menu.classList.remove('act');
			}
		}
		menuFixed();
		//-----------------------------------------------//
	}
	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}

	setTimeout(() => {
		animOnScroll();
	}, 300);
}



// Отправка форм

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.forms')
    .forEach(form => form
      .addEventListener('submit', async (e) => {
        e.preventDefault();

        form = e.target;
		console.log(form);
        const error = formValidate(form);
        if (error !== 0) {
          alert('Заполните обязательные поля');
          return;
        }

        form.classList.add('_sending');
        const response = await fetch('sendmail.php', {
          method: 'POST',
          body: new FormData(form),
        });

        if (!response.ok) {
          alert("Ошибка");
          form.classList.remove('_sending');
          return;
        }

        const result = await response.json();
        alert(result.message);
        form.reset();
        form.classList.remove('_sending');
      })
    )
});

function formValidate(form) {
  let error = 0;
  console.info('form = ', form);
  let input = form.querySelector('._req');
  formRemoveError(input);

  if (input.value === '') {
    formAddError(input);
    error++;
  }
  console.log(error);
  return error;
}

function formAddError(input) {
  input.parentElement.classList.add('_error');
  input.classList.add('_error');
}

function formRemoveError(input) {
  input.parentElement.classList.remove('_error');
  input.classList.remove('_error');
}