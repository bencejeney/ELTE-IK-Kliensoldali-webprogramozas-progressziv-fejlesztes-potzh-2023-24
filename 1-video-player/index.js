document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('video');
    const videoContainer = document.querySelector('.video-container');
    const videoPlaceholder = document.querySelector('.video-placeholder');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (videoContainer.classList.contains('fixed')) {
            videoContainer.classList.add('fixed');
            videoPlaceholder.style.height = '';
          }
        } else {
          if (!video.paused) {
            videoContainer.classList.add('fixed');
            videoPlaceholder.style.height = `${videoContainer.offsetHeight}px`;
          }
        }
      });
    }, { threshold: 0.1 });
  
    observer.observe(video);
  
    videoContainer.addEventListener('click', (event) => {
      if (videoContainer.classList.contains('fixed') && event.target.innerText === 'x') {
        videoContainer.classList.remove('fixed');
        videoPlaceholder.style.height = '';
      }
    });
  });
  