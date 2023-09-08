function sendMail(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    let params = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        message: document.querySelector("#message").value,
    };

    if (params.name === "" || params.email === "" || params.message === "") {
        console.log("FILL IT OUT");
        return;
    }
    // submitBtn.value = 'Sending...';
    console.log(params);

    const serviceID = "service_lirdqis";
    const templateID = "template_l6qeefq";

    emailjs.send(serviceID, templateID, params)
        .then(res => {
            document.querySelector("#name").value = "";
            document.querySelector("#email").value = "";
            document.querySelector("#message").value = "";
            console.log(res);
            alert("Your message sent successfully!!");
        })
        .catch(err => console.log(err));
}

const submitBtn = document.querySelector(".submitBtn");
submitBtn.addEventListener('click', sendMail);


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


//toggle hamburger
document.addEventListener("DOMContentLoaded", function () {
    // Initially hide the navLinks
    navLinks.classList.add('hidden');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
});

const navLinks = document.querySelector('.hamburgerNavLinks');
const hamburgerNavLinks = document.querySelectorAll('.hamburgerNavLinks a');
const hamburger = document.querySelector('.hamburger');

// Function to remove the 'active' class from the hamburger button
function removeActiveClass() {
    navLinks.classList.remove('active');
    hamburger.classList.toggle('active');
}

// Add a click event listener to each link within .hamburgerNavLinks
hamburgerNavLinks.forEach(function (link) {
    link.addEventListener('click', removeActiveClass);
});

document.addEventListener('click', function (event) {
    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
        // Click occurred outside of navLinks and hamburger, so remove 'active' class
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});
