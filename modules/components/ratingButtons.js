function createRatingButtons(minValue, maxValue, buttonContainer, hiddenInput, entryForm) {
  if (!buttonContainer || !hiddenInput || !entryForm) return;
  // Function to update button highlight based on hidden input value
  function updateButtonSelection() {
    const currentValue = hiddenInput.value;
    Array.from(buttonContainer.children).forEach(btn => {
      btn.classList.toggle('selected', btn.value === currentValue);
    });
  }  
  // Create buttons
  for (let i = minValue; i <= maxValue; i++) {
    const button = document.createElement('button');
    button.type = 'button';   
    button.textContent = i;
    button.value = i;
    button.className = 'rating-btn';
    button.addEventListener('click', () => {
      hiddenInput.value = button.value;
      hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
      updateButtonSelection();
    });
    buttonContainer.appendChild(button);
  }
  // Update button selection on form reset
  entryForm.addEventListener('reset', () => {
    updateButtonSelection();
  });
  // Initialize hidden input
  hiddenInput.value = '';
  hiddenInput.required = true;
  // Call initially to synchronize buttons with hidden input's initial value
  updateButtonSelection();
  // Update button selection on hidden input change
  const observer = new MutationObserver(updateButtonSelection);
  observer.observe(hiddenInput, { attributes: true, attributeFilter: ['value'] });
}

export { createRatingButtons };