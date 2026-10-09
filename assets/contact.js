const staticContactForm = document.querySelector('[data-static-contact-form]');

if (staticContactForm) {
  staticContactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const feedback = document.querySelector('#contact-feedback');
    feedback.textContent = 'Messages cannot be delivered from this static export. Please use the contact form on the live WordPress site.';
    feedback.hidden = false;
  });
}
