document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.textContent = 'Save Selection';
    button.className = 'save-selection';
    document.body.appendChild(button);
    button.addEventListener('click', saveSelection);
  
    function saveSelection() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const mark = document.createElement('mark');
  
        try {
          range.surroundContents(mark);
          selection.removeAllRanges();

          const html = mark.outerHTML;
          const container = unique(range.startContainer);
          const path = window.location.pathname;  
          const savedSelections = JSON.parse(localStorage.getItem('selections')) || [];
          savedSelections.push({ html, container, path });
          localStorage.setItem('selections', JSON.stringify(savedSelections));
        } catch (e) {
          document.body.classList.add('error');
          setTimeout(() => {
            document.body.classList.remove('error');
          }, 1000);
        }
      }
    }
  
    function loadSelections() {
      const path = window.location.pathname;
      const savedSelections = JSON.parse(localStorage.getItem('selections')) || [];
      savedSelections.forEach(({ html, container, path: savedPath }) => {
        if (savedPath === path) {
          const element = document.querySelector(container);
          if (element) {
            element.innerHTML = element.innerHTML.replace(html.replace(/<\/?mark>/g, ''), html);
          }
        }
      });
    }
  
    loadSelections();
  });
  