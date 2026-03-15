/**
 * DéclicIA - FAQ IA en classe
 * Gestion de l'accordéon accessible (ARIA)
 */

document.addEventListener('DOMContentLoaded', function () {

  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Fermer tous les autres (comportement accordéon)
      questions.forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherAnswer = other.nextElementSibling;
          if (otherAnswer) otherAnswer.hidden = true;
        }
      });

      // Basculer l'élément cliqué
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (answer) answer.hidden = isOpen;
    });
  });

  // Ouvrir automatiquement la question si l'URL contient une ancre de section
  const hash = window.location.hash;
  if (hash) {
    const section = document.querySelector(hash);
    if (section) {
      const firstQuestion = section.querySelector('.faq-question');
      if (firstQuestion) {
        firstQuestion.setAttribute('aria-expanded', 'true');
        const firstAnswer = firstQuestion.nextElementSibling;
        if (firstAnswer) firstAnswer.hidden = false;
      }
    }
  }

});