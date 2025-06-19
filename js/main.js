window.onload = function() {
    const links = document.querySelectorAll('.link-list li');
    links.forEach((link, index) => {
        setTimeout(() => {
            link.style.animation = `fadeInButtons 1s ease forwards`;
        }, index * 300);
    });
};

document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isOpen = header.classList.contains('open');

        // すべて閉じる
        document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));
        document.querySelectorAll('.accordion-content').forEach(c => {
            c.style.maxHeight = null;
        });

        // クリックしたパネルを開く
        if (!isOpen) {
            header.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});
