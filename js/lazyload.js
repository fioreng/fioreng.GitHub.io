// 图片懒加载功能
(function() {
  // 检测是否支持IntersectionObserver
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove('lazy');
          imageObserver.unobserve(image);
        }
      });
    });

    // 观察所有带有lazy类的图片
    document.addEventListener('DOMContentLoaded', () => {
      const lazyImages = document.querySelectorAll('img.lazy');
      lazyImages.forEach(image => {
        imageObserver.observe(image);
      });
    });
  } else {
    // 降级方案：使用滚动事件
    let lazyImages = [];
    let lazyImageObserver;

    document.addEventListener('DOMContentLoaded', () => {
      lazyImages = document.querySelectorAll('img.lazy');
      lazyImageObserver = new MutationObserver(() => {
        lazyImages = document.querySelectorAll('img.lazy');
      });
      
      lazyImageObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      // 初始检查
      lazyLoad();
      
      // 滚动时检查
      window.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
      window.addEventListener('orientationchange', lazyLoad);
    });

    function lazyLoad() {
      for (let i = 0; i < lazyImages.length; i++) {
        if (isInViewport(lazyImages[i])) {
          lazyImages[i].src = lazyImages[i].dataset.src;
          lazyImages[i].classList.remove('lazy');
          lazyImages = Array.from(lazyImages).filter(img => img !== lazyImages[i]);
        }
      }
      
      if (lazyImages.length === 0) {
        window.removeEventListener('scroll', lazyLoad);
        window.removeEventListener('resize', lazyLoad);
        window.removeEventListener('orientationchange', lazyLoad);
        lazyImageObserver.disconnect();
      }
    }

    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  }
})();

// 页面加载完成后执行
window.addEventListener('load', () => {
  // 预加载非关键资源
  preloadNonCriticalResources();
});

function preloadNonCriticalResources() {
  // 预加载图片
  const images = [
    '/images/日出.jpg',
    '/images/头像.jpg'
  ];
  
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}