document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'theme-preference';
  
  const SVG_SUN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM6.166 18.894a.75.75 0 01-1.06 1.06l-1.59-1.591a.75.75 0 111.06-1.061l1.59 1.59zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM6.166 5.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 101.061-1.06l-1.59-1.591z"/></svg>`;
  
  const SVG_MOON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/></svg>`;

  const getSystemPreference = () => window.matchMedia('(prefers-color-scheme: dark)').matches? 'dark' : 'light';

  const getInitialTheme = () => localStorage.getItem(STORAGE_KEY) |

| getSystemPreference();

  let activeTheme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', activeTheme);

  const toggleContainer = document.createElement('button');
  toggleContainer.id = 'theme-toggle-btn';
  toggleContainer.setAttribute('aria-label', `Switch to ${activeTheme === 'dark'? 'light' : 'dark'} mode`);
  toggleContainer.setAttribute('aria-live', 'polite');
  toggleContainer.innerHTML = activeTheme === 'dark'? SVG_SUN : SVG_MOON;
  
  document.body.appendChild(toggleContainer);

  const updateInterface = (newTheme) => {
    activeTheme = newTheme;
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem(STORAGE_KEY, activeTheme);
    toggleContainer.innerHTML = activeTheme === 'dark'? SVG_SUN : SVG_MOON;
    toggleContainer.setAttribute('aria-label', `Switch to ${activeTheme === 'dark'? 'light' : 'dark'} mode`);
  };

  toggleContainer.addEventListener('click', () => {
    updateInterface(activeTheme === 'dark'? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      updateInterface(event.matches? 'dark' : 'light');
    }
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -20px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, observerOptions);

  document.querySelectorAll('tr').forEach(card => {
    observer.observe(card);
  });

  const tH1 = document.querySelector('body > div[align="center"]:first-of-type > h1');
  const tP = document.querySelector('body > div[align="center"]:first-of-type > p');
  
  if (tH1 && tP) {
    const tB = tP.querySelector('b');
    if (tB) {
      const txt1 = tH1.innerText;
      const txt2 = tB.innerText;
      
      tH1.innerHTML = '<span class="cursor"></span>';
      tB.innerText = '';
      tH1.classList.add('active');
      tP.classList.add('active');
      
      let i = 0;
      const t1 = () => {
        if (i < txt1.length) {
          tH1.innerHTML = txt1.substring(0, i + 1) + '<span class="cursor"></span>';
          i++;
          setTimeout(t1, 40);
        } else {
          tH1.innerHTML = txt1;
          tB.innerHTML = '<span class="cursor"></span>';
          
          let j = 0;
          const t2 = () => {
            if (j < txt2.length) {
              tB.innerHTML = txt2.substring(0, j + 1) + '<span class="cursor"></span>';
              j++;
              setTimeout(t2, 40);
            }
          };
          setTimeout(t2, 200);
        }
      };
      setTimeout(t1, 400);
    }
  }
});
