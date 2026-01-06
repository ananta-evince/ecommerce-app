import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Slider.css";

function Slider({ 
  slides = [], 
  autoplay = true,
  autoplayDelay = 5000,
  showNavigation = true,
  showPagination = false,
  className = "",
  breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 0 },
    768: { slidesPerView: 1, spaceBetween: 0 },
    1024: { slidesPerView: 1, spaceBetween: 0 }
  }
}) {
  if (slides.length === 0) {
    return null;
  }

  return (
    <div className={`custom-swiper-container ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Keyboard]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={showNavigation && slides.length > 1}
        pagination={showPagination && slides.length > 1 ? { 
          clickable: true,
          dynamicBullets: true
        } : false}
        autoplay={autoplay && slides.length > 1 ? {
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        } : false}
        keyboard={{
          enabled: true,
          onlyInViewport: true
        }}
        loop={slides.length > 1}
        breakpoints={breakpoints}
        className="custom-swiper"
        grabCursor={true}
        touchEventsTarget="container"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id || index} className="custom-swiper-slide">
            {slide.content}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Slider;

