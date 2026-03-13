document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll("section, article,.card, main > div,.container > div,.wrapper > div");
    
    containers.forEach(container => {
        container.classList.add("terminal-window");
    });

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const typeNode = (node, onComplete) => {
        const textNodes =;
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        let currentNode;
        
        while (currentNode = walker.nextNode()) {
            if (currentNode.nodeValue.trim()!== "") {
                textNodes.push({
                    node: currentNode,
                    original: currentNode.nodeValue,
                    length: 0
                });
                currentNode.nodeValue = "";
            }
        }

        let index = 0;
        
        const processNextChar = () => {
            if (index >= textNodes.length) {
                if (onComplete) onComplete();
                return;
            }
            
            const currentData = textNodes[index];
            
            if (currentData.length < currentData.original.length) {
                currentData.length++;
                currentData.node.nodeValue = currentData.original.substring(0, currentData.length);
                setTimeout(processNextChar, 10 + Math.random() * 25);
            } else {
                index++;
                setTimeout(processNextChar, 30);
            }
        };
        
        processNextChar();
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add("is-open");
                
                const cursor = document.createElement("span");
                cursor.className = "terminal-cursor";
                target.appendChild(cursor);

                typeNode(target, () => {
                    cursor.style.animation = "blink 1s step-end infinite";
                    
                    const style = document.createElement("style");
                    style.innerHTML = "@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }";
                    document.head.appendChild(style);
                });
                
                obs.unobserve(target);
            }
        });
    }, observerOptions);

    containers.forEach(container => {
        observer.observe(container);
    });
});
