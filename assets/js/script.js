document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'theme-preference';
  
  const SVG_SUN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM6.166 18.894a.75.75 0 01-1.06 1.06l-1.59-1.591a.75.75 0 111.06-1.061l1.59 1.59zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM6.166 5.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 101.061-1.06l-1.59-1.591z"/></svg>`;
  const SVG_MOON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/></svg>`;

  const getSystemPreference = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const getInitialTheme = () => localStorage.getItem(STORAGE_KEY) || getSystemPreference();

  let activeTheme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', activeTheme);

  const toggleContainer = document.createElement('button');
  toggleContainer.id = 'theme-toggle-btn';
  toggleContainer.setAttribute('aria-label', 'Toggle theme');
  toggleContainer.innerHTML = activeTheme === 'dark' ? SVG_SUN : SVG_MOON;
  document.body.appendChild(toggleContainer);

  const updateInterface = (newTheme) => {
    activeTheme = newTheme;
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem(STORAGE_KEY, activeTheme);
    toggleContainer.innerHTML = activeTheme === 'dark' ? SVG_SUN : SVG_MOON;
  };

  toggleContainer.addEventListener('click', () => updateInterface(activeTheme === 'dark' ? 'light' : 'dark'));

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!localStorage.getItem(STORAGE_KEY)) updateInterface(event.matches ? 'dark' : 'light');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        typeTerminalRow(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });

  document.querySelectorAll('tr').forEach((row, index) => {
    row.style.transitionDelay = `${(index % 2) * 0.15}s`;
    
    const cells = Array.from(row.querySelectorAll('td'));
    const cellData = cells.map(td => {
      const link = td.querySelector('a');
      const text = td.textContent.trim();
      const href = link ? link.getAttribute('href') : null;
      td.innerHTML = '';
      return { td, text, href };
    });
    
    row._terminalData = cellData;
    observer.observe(row);
  });

  function typeTerminalRow(row) {
    const data = row._terminalData;
    if (!data) return;

    let cIdx = 0;
    let cCh = 0;
    const cur = document.createElement('span');
    cur.className = 'cursor';

    const typeNext = () => {
      if (cIdx >= data.length) {
        if (cur.parentNode) cur.parentNode.removeChild(cur);
        return;
      }

      const curData = data[cIdx];
      const td = curData.td;

      if (cCh < curData.text.length) {
        td.innerHTML = '';
        const textToType = curData.text.substring(0, cCh + 1);
        
        if (curData.href) {
          const a = document.createElement('a');
          a.href = curData.href;
          a.textContent = textToType;
          td.appendChild(a);
        } else {
          td.appendChild(document.createTextNode(textToType));
        }
        
        td.appendChild(cur);
        cCh++;
        setTimeout(typeNext, Math.random() * 20 + 10);
      } else {
        cIdx++;
        cCh = 0;
        setTimeout(typeNext, 150);
      }
    };

    const delay = (parseFloat(row.style.transitionDelay) || 0) * 1000 + 400;
    setTimeout(typeNext, delay);
  }

  const terminal = document.querySelector('div[align="center"]:first-of-type');
  if (terminal) {
    const h1 = terminal.querySelector('h1');
    const p = terminal.querySelector('p');
    
    if (h1 && p) {
      const text1 = h1.textContent;
      const text2 = p.textContent;
      
      h1.textContent = '';
      p.textContent = '';
      
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      h1.appendChild(cursor);

      let i = 0;
      const typeH1 = () => {
        if (i < text1.length) {
          h1.textContent = text1.substring(0, i + 1);
          h1.appendChild(cursor);
          i++;
          setTimeout(typeH1, Math.random() * 40 + 20);
        } else {
          p.appendChild(cursor);
          let j = 0;
          const typeP = () => {
            if (j < text2.length) {
              p.textContent = text2.substring(0, j + 1);
              p.appendChild(cursor);
              j++;
              setTimeout(typeP, Math.random() * 40 + 20);
            }
          };
          setTimeout(typeP, 400);
        }
      };
      setTimeout(typeH1, 600);
    }
  }
});
