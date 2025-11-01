

// document.addEventListener('DOMContentLoaded', function() {
//     if (document.getElementById('particles-js')) {
//         particlesJS('particles-js', {
//             "particles": {
//                 "number": {
//                     "value": 80,
//                     "density": {
//                         "enable": true,
//                         "value_area": 800
//                     }
//                 },
//                 "color": {
//                     "value": "#8B5CF6"
//                 },
//                 "shape": {
//                     "type": "circle",
//                     "stroke": {
//                         "width": 0,
//                         "color": "#000000"
//                     },
//                     "polygon": {
//                         "nb_sides": 5
//                     }
//                 },
//                 "opacity": {
//                     "value": 0.3,
//                     "random": true,
//                     "anim": {
//                         "enable": true,
//                         "speed": 1,
//                         "opacity_min": 0.1,
//                         "sync": false
//                     }
//                 },
//                 "size": {
//                     "value": 3,
//                     "random": true,
//                     "anim": {
//                         "enable": false,
//                         "speed": 40,
//                         "size_min": 0.1,
//                         "sync": false
//                     }
//                 },
//                 "line_linked": {
//                     "enable": true,
//                     "distance": 150,
//                     "color": "#8B5CF6",
//                     "opacity": 0.2,
//                     "width": 1
//                 },
//                 "move": {
//                     "enable": true,
//                     "speed": 1,
//                     "direction": "none",
//                     "random": true,
//                     "straight": false,
//                     "out_mode": "out",
//                     "bounce": false,
//                     "attract": {
//                         "enable": false,
//                         "rotateX": 600,
//                         "rotateY": 1200
//                     }
//                 }
//             },
//             "interactivity": {
//                 "detect_on": "canvas",
//                 "events": {
//                     "onhover": {
//                         "enable": true,
//                         "mode": "grab"
//                     },
//                     "onclick": {
//                         "enable": true,
//                         "mode": "push"
//                     },
//                     "resize": true
//                 },
//                 "modes": {
//                     "grab": {
//                         "distance": 140,
//                         "line_linked": {
//                             "opacity": 0.5
//                         }
//                     },
//                     "bubble": {
//                         "distance": 400,
//                         "size": 40,
//                         "duration": 2,
//                         "opacity": 8,
//                         "speed": 3
//                     },
//                     "repulse": {
//                         "distance": 200,
//                         "duration": 0.4
//                     },
//                     "push": {
//                         "particles_nb": 4
//                     },
//                     "remove": {
//                         "particles_nb": 2
//                     }
//                 }
//             },
//             "retina_detect": true
//         });
//     }
// });

// uiInteractions.ts
import { useEffect } from "react";

export function interacaoUI() {
  useEffect(() => {
    // Menu do celular 
    const mobileMenuButton = document.getElementById("mobile-menu-button") as HTMLButtonElement | null;
    const mobileMenu = document.getElementById("mobile-menu") as HTMLElement | null;

    if (mobileMenuButton && mobileMenu) {
      const toggleMenu = () => mobileMenu.classList.toggle("hidden");
      mobileMenuButton.addEventListener("click", toggleMenu);
      return () => mobileMenuButton.removeEventListener("click", toggleMenu);
    }
  }, []);

  useEffect(() => {
    // Botão de voltar ao topo 
    const backToTopButton = document.getElementById("back-to-top") as HTMLButtonElement | null;

    if (!backToTopButton) return;

    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.remove("opacity-0", "invisible");
        backToTopButton.classList.add("opacity-100", "visible");
      } else {
        backToTopButton.classList.remove("opacity-100", "visible");
        backToTopButton.classList.add("opacity-0", "invisible");
      }
    };

    const handleClick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("scroll", handleScroll);
    backToTopButton.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      backToTopButton.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    // Links com rolagem suave 
    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const mobileMenu = document.getElementById("mobile-menu");

    const handleAnchorClick = (e: MouseEvent) => {
      e.preventDefault();
      const anchor = e.currentTarget as HTMLAnchorElement;
      const targetId = anchor.getAttribute("href");
      if (!targetId) return;

      const targetElement = document.querySelector(targetId) as HTMLElement | null;
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
        }
      }
    };

    anchors.forEach((anchor) => anchor.addEventListener("click", handleAnchorClick));

    return () => {
      anchors.forEach((anchor) => anchor.removeEventListener("click", handleAnchorClick));
    };
  }, []);

  useEffect(() => {
    // Efeito de glitch no logo 
    const logoContainer = document.getElementById("logo-container") as HTMLElement | null;
    if (!logoContainer) return;

    let isGlitching = false;

    const handleMouseEnter = () => {
      if (isGlitching) return;
      isGlitching = true;

      logoContainer.classList.add("animate-text-glitch");

      setTimeout(() => {
        logoContainer.classList.add("text-glitch-active");
      }, 100);

      setTimeout(() => {
        logoContainer.classList.remove("animate-text-glitch", "text-glitch-active");
        isGlitching = false;
      }, 1000);
    };

    logoContainer.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      logoContainer.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);
}



export default function Animacoes() {
  // const canvas = document.getElementById("particles");
  // const ctx = canvas.getContext("2d");
}

// Perfil de usuario (PC/CELL)

// function setUserLoggedIn(user) {
//     document.getElementById('loginOuCadas').style.display = 'none';
//     document.getElementById('fotoPerfil').style.display = 'inline-block';
//     document.getElementById('logout').style.display = 'inline-block';
//     document.getElementById('fotoPerfilImg').src = user.avatarUrl || '/assets/imgs/genPfp.png';

//     document.getElementById('mobileLoginOuCadas').style.display = 'none';
//     document.getElementById('mobileFotoPerfil').style.display = 'block';
//     document.getElementById('mobileLogout').style.display = 'block';
//     document.getElementById('mobileFotoPerfilImg').src = user.avatarUrl || '/assets/imgs/genPfp.png';
// }

// function logout() {
//     document.getElementById('loginOuCadas').style.display = 'inline-flex';
//     document.getElementById('fotoPerfil').style.display = 'none';
//     document.getElementById('logout').style.display = 'none';

//     document.getElementById('mobileLoginOuCadas').style.display = 'block';
//     document.getElementById('mobileFotoPerfil').style.display = 'none';
//     document.getElementById('mobileLogout').style.display = 'none';
// }
