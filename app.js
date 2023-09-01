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







