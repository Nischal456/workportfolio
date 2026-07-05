function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");

  // Lock body scroll when mobile menu is open
  if (menu.classList.contains("open")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

// Sticky Desktop Navbar Scroll Shadow Effect
const desktopNav = document.getElementById('desktop-nav');
window.addEventListener('scroll', () => {
  if (desktopNav) {
    if (window.scrollY > 30) {
      desktopNav.classList.add('nav-scrolled');
    } else {
      desktopNav.classList.remove('nav-scrolled');
    }
  }
});
const galleryContainer = document.querySelector('.gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryControls = ['previous', 'next'];
const galleryItems = document.querySelectorAll('.gallery-item');

class Carousel {
    constructor(container, items, controls) {
        this.carouselContainer = container;
        this.carouselControls = controls;
        this.carouselArray = [...items];
    }

    updateGallery() {
        this.carouselArray.forEach(el => {
            el.classList.remove('gallery-item-1');
            el.classList.remove('gallery-item-2');
            el.classList.remove('gallery-item-3');
            el.classList.remove('gallery-item-4');
            el.classList.remove('gallery-item-5');
        });

        this.carouselArray.slice(0, 5).forEach((el, i) => {
            el.classList.add(`gallery-item-${i + 1}`);
        });
    }
    setCurrentState(direction){
      if (direction.className == 'gallery-controls-previous'){
          this.carouselArray.unshift(this.carouselArray.pop());
      }else{
          this.carouselArray.push(this.carouselArray.shift());
      }
      this.updateGallery();
      }

      setControls() {
        this.carouselControls.forEach(control => {
          galleryControlsContainer.appendChild(document.createElement('button')).className = `gallery-controls-${control}`;
          document.querySelector(`.gallery-controls-${control}`).innertext = control;
      });
  }
  useControls(){
    const triggers = [...galleryControlsContainer.childNodes];
    triggers.forEach(control => {
      control.addEventListener('click', e => {
      e.preventDefault();
      this.setCurrentState(control);
    });
  });
  }
}
const exampleCarousel = new Carousel(galleryContainer, galleryItems, galleryControls);

exampleCarousel.setControls();
exampleCarousel.useControls();

// ==========================================================================
// GAUTHALI MOVIE RELEASE POPUP LOGIC
// ==========================================================================

const gauthaliPopup = document.getElementById('gauthali-popup');
const gauthaliVideoContainer = document.getElementById('gauthali-video-container');

// Store initial HTML of video container to restore it on close (resets trailer play button)
const gauthaliOriginalVideoHtml = gauthaliVideoContainer ? gauthaliVideoContainer.innerHTML : '';

// 1. Open the popup with a slight delay on page load (once per user to preserve UX across reloads)
window.addEventListener('DOMContentLoaded', () => {
  if (gauthaliPopup) {
    // Check if shown in localStorage
    const hasBeenShown = localStorage.getItem('gauthali_popup_displayed');
    
    if (!hasBeenShown) {
      setTimeout(() => {
        gauthaliPopup.showModal();
        localStorage.setItem('gauthali_popup_displayed', 'true');
      }, 1500); // 1.5 seconds delay
    }
  }
});

// 2. Load YouTube Trailer on click (Lazy Loading)
function loadGauthaliTrailer() {
  if (gauthaliVideoContainer) {
    gauthaliVideoContainer.innerHTML = `
      <iframe 
        class="gauthali-iframe" 
        src="https://www.youtube.com/embed/M_m79wmYX6w?si=DUlnS9Dal7UestIu&autoplay=1" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen>
      </iframe>
    `;
  }
}

// 3. Close the popup with a smooth exit animation and suspend video audio
function closeGauthaliPopup() {
  if (gauthaliPopup) {
    gauthaliPopup.classList.add('gauthali-closing');
    
    // Stop video playback by resetting the video container structure
    if (gauthaliVideoContainer) {
      gauthaliVideoContainer.innerHTML = gauthaliOriginalVideoHtml;
    }
    
    // Wait for the exit animation to finish before closing native dialog
    setTimeout(() => {
      gauthaliPopup.close();
      gauthaliPopup.classList.remove('gauthali-closing');
    }, 400); // Matches the 0.4s CSS closing animation
  }
}

// 4. Click Outside / Light Dismiss Fallback for Safari/Firefox (native closedby="any" fallback)
if (gauthaliPopup) {
  // If the browser doesn't natively support closedBy on dialog, add fallback click handler
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    gauthaliPopup.addEventListener('click', (event) => {
      // Clicks directly on the dialog element itself target the backdrop (outside the main content block)
      if (event.target === gauthaliPopup) {
        closeGauthaliPopup();
      }
    });
  }

  // Also handle esc key press to suspend video audio properly
  gauthaliPopup.addEventListener('cancel', (event) => {
    // Prevent default immediate close so we can animate it out
    event.preventDefault();
    closeGauthaliPopup();
  });
}

