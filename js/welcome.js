window.addEventListener('DOMContentLoaded', () => {
    const welcome = document.querySelector('.welcome');
    const welcomeLogos = welcome.querySelectorAll('.logo');
    const welcomeSlides = [].slice.call(welcome.querySelectorAll('.slide'));
    const welcomeBtn = welcome.querySelector('.welcome__footer__btn');
    const bubbles = [].slice.call(welcome.querySelectorAll('.bubble'));

    const bgLayer1 = welcome.querySelector('.welcome__background-layer-1');
    const bgLayer2 = welcome.querySelector('.welcome__background-layer-2');
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

            state = 2;
        } else if (state === 2) {
            welcomeSlides[2].classList.add('slide--fade-out');
            welcomeSlides[2].classList.remove('slide--view');

            welcome.classList.add('welcome--close');
            state = 3;
        }
    })
});