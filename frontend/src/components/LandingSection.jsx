// src/components/LandingSection.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper';

// Importa las imágenes que estar en src/assets/images/
import banner6 from '../assets/images/banner-image-6.jpg';
import banner1 from '../assets/images/banner-image-1.jpg';
import banner2 from '../assets/images/banner-image-2.jpg';
import cat1 from '../assets/images/cat-item1.jpg';
import cat2 from '../assets/images/cat-item2.jpg';
import cat3 from '../assets/images/cat-item3.jpg';
import logo1 from '../assets/images/logo1.png';
import logo2 from '../assets/images/logo2.png';
import logo3 from '../assets/images/logo3.png';

SwiperCore.use([Autoplay, Pagination, Navigation]);

export default function LandingSection() {
  return (
    <div>
      {/* HERO / BANNER */}
      <section id="billboard" className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <h1 className="section-title text-center mt-4">New Collections</h1>
            <div className="col-md-6 text-center">
              <p>
                Bienvenido a la plataforma de proyectos — presentación con estilo.
                Aquí puedes adaptar este texto a la introducción de tu proyecto.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="py-4 w-100">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 4000 }}
                pagination={{ clickable: true }}
                navigation={true}
              >
                <SwiperSlide>
                  <div className="banner-item image-zoom-effect">
                    <div className="image-holder">
                      <img src={banner6} alt="banner 6" className="img-fluid" />
                    </div>
                    <div className="banner-content py-4">
                      <h5 className="element-title text-uppercase">
                        <span>Soft leather jackets</span>
                      </h5>
                      <p>Adapt this text for your project's highlight or call to action.</p>
                      <div className="btn-left">
                        <a className="btn-link fs-6 text-uppercase text-decoration-none">Discover Now</a>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide>
                  <div className="banner-item image-zoom-effect">
                    <div className="image-holder">
                      <img src={banner1} alt="banner 1" className="img-fluid" />
                    </div>
                    <div className="banner-content py-4">
                      <h5 className="element-title text-uppercase">
                        <span>Featured projects</span>
                      </h5>
                      <p>Una breve frase que invite a explorar los proyectos destacados.</p>
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide>
                  <div className="banner-item image-zoom-effect">
                    <div className="image-holder">
                      <img src={banner2} alt="banner 2" className="img-fluid" />
                    </div>
                    <div className="banner-content py-4">
                      <h5 className="element-title text-uppercase">
                        <span>Join our community</span>
                      </h5>
                      <p>Información rápida sobre el objetivo de la plataforma.</p>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-3 text-center">
              <div className="py-5">
                <svg width="38" height="38" viewBox="0 0 24 24">
                  <use xlinkHref="#calendar"></use>
                </svg>
                <h4 className="element-title text-capitalize my-3">Book An Appointment</h4>
                <p>Reserva demostraciones o revisiones de proyectos con el equipo.</p>
              </div>
            </div>

            <div className="col-md-3 text-center">
              <div className="py-5">
                <svg width="38" height="38" viewBox="0 0 24 24">
                  <use xlinkHref="#shopping-bag"></use>
                </svg>
                <h4 className="element-title text-capitalize my-3">Pick up in store</h4>
                <p>Información de contacto o recolección si aplica.</p>
              </div>
            </div>

            <div className="col-md-3 text-center">
              <div className="py-5">
                <svg width="38" height="38" viewBox="0 0 24 24">
                  <use xlinkHref="#gift"></use>
                </svg>
                <h4 className="element-title text-capitalize my-3">Special packaging</h4>
                <p>Servicios especiales o presentaciones de proyectos.</p>
              </div>
            </div>

            <div className="col-md-3 text-center">
              <div className="py-5">
                <svg width="38" height="38" viewBox="0 0 24 24">
                  <use xlinkHref="#arrow-cycle"></use>
                </svg>
                <h4 className="element-title text-capitalize my-3">Free Returns</h4>
                <p>Política o nota sobre revisiones y entregas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES (3 columnas) */}
      <section className="categories overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="cat-item image-zoom-effect">
                <div className="image-holder">
                  <img src={cat1} alt="cat 1" className="product-image img-fluid" />
                </div>
                <div className="category-content">
                  <div className="product-button">
                    <a className="btn btn-common text-uppercase">Section 1</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="cat-item image-zoom-effect">
                <div className="image-holder">
                  <img src={cat2} alt="cat 2" className="product-image img-fluid" />
                </div>
                <div className="category-content">
                  <div className="product-button">
                    <a className="btn btn-common text-uppercase">Section 2</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="cat-item image-zoom-effect">
                <div className="image-holder">
                  <img src={cat3} alt="cat 3" className="product-image img-fluid" />
                </div>
                <div className="category-content">
                  <div className="product-button">
                    <a className="btn btn-common text-uppercase">Section 3</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO BAR (simplificado) */}
      <section className="logo-bar py-5 my-5">
        <div className="container">
          <div className="row">
            <div className="logo-content d-flex flex-wrap justify-content-between align-items-center">
              <img src={logo1} alt="logo1" className="logo-image img-fluid" style={{maxWidth:120}}/>
              <img src={logo2} alt="logo2" className="logo-image img-fluid" style={{maxWidth:120}}/>
              <img src={logo3} alt="logo3" className="logo-image img-fluid" style={{maxWidth:120}}/>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER simplificado */}
      <footer className="bg-dark text-white pt-5 pb-3">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Contact Us</h5>
              <p>contact@yourcompany.com</p>
            </div>
            <div className="col-md-6 text-end">
              <p>© {new Date().getFullYear()} Kaira (template) — adaptado para tu proyecto</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
