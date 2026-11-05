document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('.navbar-burger');
  var menu = document.querySelector('.navbar-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-active');
    });
  }

  // Top Demonstration Carousel (VMAS-balance <-> SMAX 5m_vs_6m)
  var demoCarousel = document.getElementById('demo-carousel');
  if (demoCarousel) {
    var demoSlides = Array.prototype.slice.call(demoCarousel.querySelectorAll('.demo-slide'));
    var demoDots = Array.prototype.slice.call(demoCarousel.querySelectorAll('.demo-dot'));
    var demoPrev = document.getElementById('demo-prev');
    var demoNext = document.getElementById('demo-next');
    var currentDemo = 0;
    var advanceTimer = null;

    function clearAdvanceTimer() {
      if (advanceTimer) {
        clearTimeout(advanceTimer);
        advanceTimer = null;
      }
    }

    function showDemoSlide(index) {
      var total = demoSlides.length;
      if (!total) return;
      clearAdvanceTimer();
      currentDemo = (index + total) % total;

      demoSlides.forEach(function (slide, i) {
        var active = i === currentDemo;
        slide.classList.toggle('is-active', active);
        var videos = Array.prototype.slice.call(slide.querySelectorAll('video'));
        videos.forEach(function (v) {
          v._hasEnded = false;
          if (active) {
            try {
              v.currentTime = 0;
            } catch (e) {}
            v.play().catch(function () {});
          } else {
            v.pause();
          }
        });
      });

      demoDots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === currentDemo);
      });
    }

    // Auto-advance to the next slide when all videos in the active slide finish playing
    demoSlides.forEach(function (slide, slideIdx) {
      var videos = Array.prototype.slice.call(slide.querySelectorAll('video'));
      videos.forEach(function (v) {
        v.addEventListener('ended', function () {
          if (slideIdx !== currentDemo) return;
          v._hasEnded = true;
          var allEnded = videos.every(function (vid) {
            return vid._hasEnded || vid.ended;
          });
          if (allEnded) {
            clearAdvanceTimer();
            advanceTimer = setTimeout(function () {
              showDemoSlide(currentDemo + 1);
            }, 500);
          }
        });
      });
    });

    demoDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-demo'), 10);
        if (!isNaN(idx)) showDemoSlide(idx);
      });
    });

    if (demoPrev) {
      demoPrev.addEventListener('click', function () {
        showDemoSlide(currentDemo - 1);
      });
    }
    if (demoNext) {
      demoNext.addEventListener('click', function () {
        showDemoSlide(currentDemo + 1);
      });
    }

    // Initialize first slide playback state
    showDemoSlide(0);
  }

  // Sliding card carousels (Method components, Results). The method carousel also swaps its overview figure.
  Array.prototype.slice.call(document.querySelectorAll('.slide-carousel')).forEach(function (root) {
    var figs = Array.prototype.slice.call(root.querySelectorAll('.method-figure img'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.demo-dot'));
    var track = root.querySelector('.slide-track');
    var total = track.children.length;
    var idx = 0;

    function show(index) {
      var prevIdx = idx;
      idx = (index + total) % total;
      if (idx === prevIdx) return;
      track.style.transform = 'translateX(' + (-100 * idx) + '%)';
      // The outgoing figure stays opaque underneath while the incoming one fades in on top.
      figs.forEach(function (img, i) {
        img.classList.toggle('is-prev', i === prevIdx);
        img.classList.toggle('is-active', i === idx);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === idx);
      });
    }

    dots.forEach(function (btn) {
      btn.addEventListener('click', function () {
        show(parseInt(btn.getAttribute('data-slide'), 10));
      });
    });
    Array.prototype.slice.call(root.querySelectorAll('.demo-circle-btn')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        show(idx + parseInt(btn.getAttribute('data-step'), 10));
      });
    });

    var touchStartX = null;
    var viewport = root.querySelector('.slide-viewport');
    viewport.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    });
  });

  // Ablation Study Carousel
  var carousel = document.getElementById('ablation-carousel');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.ablation-slide'));
    var tabs = Array.prototype.slice.call(carousel.querySelectorAll('.ablation-tab'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.ablation-dot'));
    var prevBtn = document.getElementById('ablation-prev');
    var nextBtn = document.getElementById('ablation-next');
    var counter = document.getElementById('ablation-counter');
    var currentIdx = 0;

    function showSlide(index) {
      var total = slides.length;
      if (!total) return;
      currentIdx = (index + total) % total;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === currentIdx);
      });
      tabs.forEach(function (tab, i) {
        var active = i === currentIdx;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === currentIdx);
      });
      if (counter) {
        counter.textContent = (currentIdx + 1) + ' / ' + total;
      }
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var idx = parseInt(tab.getAttribute('data-slide'), 10);
        if (!isNaN(idx)) showSlide(idx);
      });
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-slide'), 10);
        if (!isNaN(idx)) showSlide(idx);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        showSlide(currentIdx - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        showSlide(currentIdx + 1);
      });
    }
  }
});
