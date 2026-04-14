function openFolder(element) {
    const container = document.getElementById('main_layout');
    
    // Toggle the split view
    container.classList.add('active-split');

    // Reset all cards
    document.querySelectorAll('.folder-card').forEach(card => {
        card.style.height = "100px"; // Shrink others
        card.classList.remove('expanded');
    });

    // Expand the clicked card
    element.style.height = "400px";
    element.classList.add('expanded');
    
    // Logic to load specific images/videos into the right_side
    const mediaView = document.getElementById('right_side');
    // mediaView.innerHTML = `... dynamic content based on folder ...`;
}