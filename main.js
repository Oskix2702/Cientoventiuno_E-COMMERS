window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(13, 13, 13, 0.95)'; 
        header.style.borderBottom = '1px solid var(--morado-claro)';
        header.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
        header.style.padding = '15px 5%';
    } else {
        header.style.backgroundColor = 'transparent'; 
        header.style.borderBottom = '1px solid transparent';
        header.style.boxShadow = 'none';
        header.style.padding = '20px 5%';
    }
});