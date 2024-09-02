window.onload = function() {
    const links = document.querySelectorAll('.link-list li');
    links.forEach((link, index) => {
        setTimeout(() => {
            link.style.animation = `fadeInButtons 1s ease forwards`;
        }, index * 300);
    });
};
