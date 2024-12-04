const btnUp = document.querySelector(".up");
const leftCursor = document.querySelector('.cursor__left');
const rightCursor = document.querySelector('.cursor__right');
const slider = document.querySelector('.slider');
//const sliderFirst = document.querySelector('.slider__first-pack')
//const sliderSecond = document.querySelector('.slider__second-pack');
const sliderPacks = document.querySelectorAll('.slider__pack');
const partnersIcons = document.querySelectorAll(".partners__slider");
const visualLeft = document.querySelector(".visual__left-arrow");
const visualRight = document.querySelector(".visual__right-arrow");
const visualFirstItem = document.querySelector(".visual__blocks");
const visualSecondItem = document.querySelector(".visual__blocks-2");
const visualPoint = document.querySelector(".visual__point");
const visualPoint2 = document.querySelector(".visual__point-active");
const visualModal = document.querySelector(".visual__modal");
//const visualModalEsc = document.querySelector(".visual__modal-esc");
const visualContainer = document.querySelector('.visual__container');


const modal = document.getElementById('myModal');
const modal2 = document.getElementById('myModal2');
const modal3 = document.getElementById('myModal3');
const img = document.querySelector('.cert1');
const img2 = document.querySelector('.cert2');
//const img3 = document.querySelector('.visual-one');
const modalImg = document.getElementById("img01");
const modalImg2 = document.getElementById("img02");
//const modalImg3 = document.getElementById("img03");
const captionText = document.getElementById("caption");
const captionText2 = document.getElementById("caption2");
const captionText3 = document.getElementById("caption3");

const boxArrowLeft = document.querySelector(".box-left");
const boxArrowRigth = document.querySelector(".box-right");

const numYear = document.querySelector('.info__num-year');
const numProjects = document.querySelector('.info__num-projects');
const numLicence = document.querySelector('.info__num-licence');

const closeElems = document.querySelectorAll('.closeElem');

img.addEventListener("click", () => getModal(modal, modalImg, captionText, img));
img2.addEventListener("click", () => getModal(modal2, modalImg2, captionText2, img2));

function getModal(modalElem, modalImg, text, originalImg) {
    modalElem.style.display = "block";
    modalImg.src = originalImg.src;
    text.innerHTML = originalImg.alt;
}

const span = document.getElementsByClassName("close")[0];
const span2 = document.getElementsByClassName("close2")[0];
    
span.addEventListener('click', () => closeModal(modal));
span2.addEventListener('click', () =>  closeModal(modal2));


document.querySelector("body").addEventListener("keydown", e => {
    if(e.key === "Escape") {
        close(closeElems);
    }
});

const close = elements => {
    elements.forEach(element => {
        closeModal(element);
    });
}

const closeModal = closeElement => closeElement.style.display = "none";

btnUp.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

visualRight.addEventListener("click", () => {
    if(visualSecondItem.style.display = "none") {
        visualSecondItem.style.display = "block";
        visualFirstItem.style.display = "none";
        visualPoint.classList.remove("visual__point");
        visualPoint.classList.add("visual__point-active");
        visualPoint2.classList.remove("visual__point-active");
        visualPoint2.classList.add("visual__point");
        visualRight.style.display = "none";
        visualLeft.style.display = "flex";
        visualContainer.style.marginLeft = "-100px";
    }
});

visualLeft.addEventListener("click", () => {
    if(visualFirstItem.style.display = "none") {
        visualFirstItem.style.display = "block";
        visualSecondItem.style.display = "none";
        visualPoint2.classList.remove("visual__point");
        visualPoint2.classList.add("visual__point-active");
        visualPoint.classList.remove("visual__point-active");
        visualPoint.classList.add("visual__point");
        visualLeft.style.display = "none";
        visualRight.style.display = "flex";
        visualContainer.style.marginLeft = "8px";
    }
});

const infoBlocks = document.querySelector('.info__blocks');

const callback = (entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            animate(numYear, 20);
            animate(numProjects, 2);
            animate(numLicence, 1);
            observer.unobserve(entry.target);
        }
    });
}

const options = {
    rootMargin: "0px",
    threshold: 1
};

const observer = new IntersectionObserver(callback, options);
observer.observe(infoBlocks);

function animate(domElement, timeInterval) {
    let start = Number(domElement.innerHTML);
    const end = domElement.dataset.max;
    let interval = setInterval(() => {
        domElement.innerHTML = ++start;
        if(start == end) {
            clearInterval(interval);
        }
    }, timeInterval);
}

//leftCursor.addEventListener('click', moveLeftCarousel);
//rightCursor.addEventListener('click', moveRightCarousel)

function moveRightCarousel() {
    if(sliderSecond.style.display = "none") {
        sliderSecond.style.display = "flex";
        sliderSecond.style.justifyContent = "space-between";
        sliderSecond.style.alignItems = "center";
        sliderFirst.style.display = "none";
        slider.style.maxWidth = "100%";
    }
}

function moveLeftCarousel() {
    if(sliderFirst.style.display = "none") {
        sliderFirst.style.display = "flex";
        sliderFirst.style.justifyContent = "space-between";
        sliderFirst.style.alignItems = "center";
        sliderSecond.style.display = "none";
        slider.style.maxWidth = "712px";
    }
}

class Slider {
    constructor(ribbon, prev, next) {
      this.ribbon = document.getElementById(ribbon);
      this.prev = document.getElementById(prev);
      this.next = document.getElementById(next);
      this.clone = document.createElement(this.ribbon.lastElementChild.cloneNode(true).tagName);
      this.direction = 0;
      
      this.runSlider = function() {
        this.prev.addEventListener('click', this.switchSlide);
        this.next.addEventListener('click', this.switchSlide);
        this.ribbon.addEventListener('transitionend', this.onTransitionEnd);
        }
      }
   
      onTransitionEnd = () => {
        if ( this.direction === -1 ) {
          this.ribbon.appendChild(this.ribbon.firstElementChild)
          this.ribbon.style.transition = 'none';          
          this.ribbon.style.transform = 'translateX(-186%)';        
          setTimeout(() => {
              this.ribbon.style.transition = 'all ease 0.5s';
          });
          
        } else if ( this.direction === 1 ) {
            this.ribbon.prepend(this.ribbon.lastElementChild);
           
            this.ribbon.style.transition = 'none';
           
            this.ribbon.style.transform = 'translateX(-186%)';
            setTimeout(() => {
               this.ribbon.style.transition = 'all ease 0.5s';
            })
        }
      };
    
      switchSlide = (e) => {
        if ( e.currentTarget.id === this.next.id ) {
          this.direction = -1;
          this.ribbon.style.transform = `translateX(-${296}%)`;
          
       } else if ( e.currentTarget.id === this.prev.id ) {
          this.direction = 1;
          this.ribbon.style.transform = `translateX(-${76}%)`;
          console.log(this.ribbon.style.transform)
         
      }
    }
}
  
const createSlider = new Slider('ribbon', 'prev', 'next').runSlider();