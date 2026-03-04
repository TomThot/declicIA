/* ── Formulaire AJAX Web3Forms ────────────────── */
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn    = document.getElementById('submitBtn');
  const okMsg  = document.getElementById('feedbackOk');
  const errMsg = document.getElementById('feedbackErr');

  // Reset messages
  okMsg.classList.remove('show');
  errMsg.classList.remove('show');

  // Validation simple
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    errMsg.textContent = '⚠️ Merci de remplir tous les champs obligatoires.';
    errMsg.classList.add('show');
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.classList.add('loading');

  try {
    const formData = new FormData(this);
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (data.success) {
      okMsg.classList.add('show');
      this.reset();
    } else {
      throw new Error(data.message || 'Erreur inconnue');
    }
  } catch (err) {
    console.error(err);
    errMsg.textContent = '❌ Une erreur est survenue. Veuillez réessayer ou écrire directement à tom.thot@gmail.com';
    errMsg.classList.add('show');
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
  }
});
