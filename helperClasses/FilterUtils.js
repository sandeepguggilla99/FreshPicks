export function moveSliderValue() {
    const filterDistance = document.getElementById("filterDistance");
    const sliderValue = document.getElementById("sliderValue");

    filterDistance.addEventListener("input", () => {
        sliderValue.textContent = filterDistance.value;
    });

    return filterDistance;
}

export function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}