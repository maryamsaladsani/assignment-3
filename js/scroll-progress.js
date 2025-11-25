// Scroll Progress Bar
// Displays a visual indicator showing how far the user has scrolled down the page

(function(){
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    function update(){
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
        bar.style.width = pct + '%';
    }

    // run on load/scroll/resize
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    document.addEventListener('DOMContentLoaded', update);
    update();
})();