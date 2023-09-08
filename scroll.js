//scroll link elements
document.addEventListener("DOMContentLoaded", function () {
    // Select all anchor links with hash (#) in their href attribute
    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    for (const scrollLink of scrollLinks) {
        scrollLink.addEventListener("click", smoothScroll);
    }

    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offset = targetElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: offset,
                behavior: "smooth"
            });
        }
    }
});

//arrow up hidden
window.addEventListener("scroll", function () {
    const hiddenElement = document.querySelector(".scrollContainer");

    const scrollThreshold = 350; // Adjust this value as needed

    // Check if the user has scrolled past the threshold
    if (window.scrollY > scrollThreshold) {
        // Add the "visibleElement" class to show the element with opacity transition
        hiddenElement.classList.add("visibleElement");
    } else {
        // Remove the "visibleElement" class to hide the element with opacity transition
        hiddenElement.classList.remove("visibleElement");
    }

});


window.addEventListener('scroll', () => {
    const header = document.querySelector("header");
    if (window.scrollY > 80) { // Adjust the value as needed
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});



// Scroll-to-top button for all elements with the class "scrollToTop"
const scrollToTopButtons = document.querySelectorAll(".scrollToTop");

scrollToTopButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});


