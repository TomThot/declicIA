const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const overlay = document.getElementById('overlay');
const navLinks = document.querySelectorAll('.nav-list a');
const menuItems = document.querySelectorAll('.menu-item');

// Toggle menu burger
burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
});

// Fermer le menu en cliquant sur l'overlay
overlay.addEventListener('click', () => {
    closeMenu();
});

// Gestion des sous-menus
menuItems.forEach(item => {
    const menuLink = item.querySelector('.menu-link');
    
    menuLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Empêche la propagation pour éviter la fermeture immédiate



        // En mode desktop, fermer les autres sous-menus
        if (window.innerWidth > 768) {
            menuItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        }







        
        // Toggle le sous-menu
        item.classList.toggle('active');
    });
});




// Fermer les sous-menus en cliquant ailleurs
document.addEventListener('click', (e) => {
    // Si on clique en dehors du menu et du burger
    if (!e.target.closest('.nav') && !e.target.closest('.burger')) {
        // En mode desktop, fermer uniquement les sous-menus
        if (window.innerWidth > 768) {
            menuItems.forEach(item => {
                item.classList.remove('active');
            });
        } 
        // En mode mobile, fermer tout le menu burger
        else if (nav.classList.contains('active')) {
            closeMenu();
        }
    }
});






// Fermer le menu en cliquant sur un lien de sous-menu
document.querySelectorAll('.submenu a').forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Fonction pour fermer le menu
function closeMenu() {
    burger.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Fermer tous les sous-menus
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
}

















// // Sélectionner tous les éléments de menu avec sous-menu
// const menuItems = document.querySelectorAll('.menu-item');

// menuItems.forEach(item => {
//     const menuLink = item.querySelector('.menu-link');
    
//     menuLink.addEventListener('click', (e) => {
//         e.preventDefault(); // Empêche la navigation
        
//         // Fermer les autres sous-menus
//         menuItems.forEach(otherItem => {
//             if (otherItem !== item) {
//                 otherItem.classList.remove('active');
//             }
//         });
        
//         // Toggle le sous-menu actuel
//         item.classList.toggle('active');
//     });
// });

// // Fermer le sous-menu si on clique ailleurs
// document.addEventListener('click', (e) => {
//     if (!e.target.closest('.menu-item')) {
//         menuItems.forEach(item => {
//             item.classList.remove('active');
//         });
//     }
// });