document.addEventListener("DOMContentLoaded", function () {
    const openOverlay = document.getElementById("openOverlay");
    const overlay = document.getElementById("overlay");
    const closeOverlay = document.getElementById("closeOverlay");
    const agreeCheckbox = document.getElementById("agreeCheckbox");
    const confirmBooking = document.getElementById("confirmBooking");

    // Open overlay
    openOverlay.addEventListener("click", () => {
        overlay.classList.remove("hidden");
    });

    // Close overlay
    closeOverlay.addEventListener("click", () => {
        overlay.classList.add("hidden");
    });

    // Enable/Disable Book Now button based on checkbox
    agreeCheckbox.addEventListener("change", () => {
        if (agreeCheckbox.checked) {
            confirmBooking.classList.remove("bg-gray-400", "cursor-not-allowed");
            confirmBooking.classList.add("bg-blue-600", "hover:bg-blue-700");
            confirmBooking.removeAttribute("disabled");
        } else {
            confirmBooking.classList.add("bg-gray-400", "cursor-not-allowed");
            confirmBooking.classList.remove("bg-blue-600", "hover:bg-blue-700");
            confirmBooking.setAttribute("disabled", true);
        }
    });

    // Redirect to Cal.com booking page
    confirmBooking.addEventListener("click", () => {
        window.location.href = "https://cal.com/mattosurf"; // Replace with your actual Cal.com URL
    });
});