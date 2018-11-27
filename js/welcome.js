window.addEventListener('DOMContentLoaded', () => {
    const welcome = document.querySelector('.welcome');
    const welcomeLogos = welcome.querySelectorAll('.logo');
    const welcomeSlides = [].slice.call(welcome.querySelectorAll('.slide'));
    const welcomeBtn = welcome.querySelector('.welcome__footer__btn');
    const bubbles = [].slice.call(welcome.querySelectorAll('.bubble'));
    const lightbox = document.querySelector('#welcome-lightbox');

    const bgLayer1 = welcome.querySelector('.welcome__background-layer-1');
    const bgLayer2 = welcome.querySelector('.welcome__background-layer-2');
    const bgLayer1Path = welcome.querySelector('#background');
    const bgLayer2Path = welcome.querySelector('#foreground');
    let state = 0;

    welcomeBtn.addEventListener('click', () => {
        if (state === 0) {
            welcome.children[0].classList.add('welcome__background-state-2-changed');

            welcomeLogos[0].classList.toggle('welcome__header__logo--show');
            welcomeLogos[1].classList.toggle('welcome__header__logo--show');

            bgLayer1.classList.add('welcome__background-layer--fade-in');
            bgLayer2.classList.add('welcome__background-layer--fade-in');

            welcomeSlides[0].classList.add('slide--fade-out');
            welcomeSlides[0].classList.remove('slide--view');
            welcomeSlides[1].classList.add('slide--view');

            bubbles[0].classList.remove('active');
            bubbles[1].classList.add('active');

            state = 1;
        } else if (state === 1) {
            welcomeSlides[1].classList.add('slide--fade-out');
            welcomeSlides[1].classList.remove('slide--view');
            welcomeSlides[2].classList.add('slide--view');
            bubbles[1].classList.remove('active');
            bubbles[2].classList.add('active');
            welcomeBtn.innerText = 'Get started!';
            bgLayer1Path.style.fill="#8b3ad2"
            bgLayer2Path.style.fill='#8b3ad2';
            state = 2;
        } else if (state === 2) {
            welcomeSlides[2].classList.add('slide--fade-out');
            welcomeSlides[2].classList.remove('slide--view');

            welcome.classList.add('welcome--close');
            lightbox.classList.add('close');
            setTimeout(() => {
                welcome.style.display = 'none';
                lightbox.style.display = 'none';
            }, 300)
            state = 3;
        }
    })
});
