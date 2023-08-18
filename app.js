// Function to equalize the heights of service items
function equalizeServiceItemHeights() {
    const serviceItems = document.querySelectorAll(".service-item");
    let maxHeight = 0;
    serviceItems.forEach(item => {
        item.style.height = ""; // Reset height before recalculating
        const height = item.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    });
    serviceItems.forEach(item => {
        item.style.height = maxHeight + "px";
    });
}

// Initial equalization on page load
document.addEventListener("DOMContentLoaded", equalizeServiceItemHeights);

// Equalize heights when the window is resized
window.addEventListener("resize", equalizeServiceItemHeights);