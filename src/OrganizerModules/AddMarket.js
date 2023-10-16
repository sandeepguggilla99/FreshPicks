import { DragAndDropHandler, previewImage, previewVideo } from '/helperClasses/DragAndDropHandler.js'
import { initMap } from '/helperClasses/map.js'

const imageDragAndDrop = new DragAndDropHandler('imageDropZone', 'imagePreview', 'image', previewImage)
const videoDragAndDrop = new DragAndDropHandler('videoDropZone', 'videoPreview', 'video', previewVideo)
const location = document.getElementById('location')
const mapContainer = document.getElementById('map-container')
const closeMapButton = document.getElementById('close-map')

document.getElementById('addFaq').addEventListener('click', function () {
    const faqContainer = document.getElementById('faqContainer')
    const faq = document.createElement('div')
    faq.className = 'faq'
    faq.innerHTML = `
        <input type="text" name="question" placeholder="Question">
        <input type="text" name="answer" placeholder="Answer">`
    faqContainer.appendChild(faq)
})

location.addEventListener('click', () => {
    mapContainer.style.display = 'block'
    initMap('map')
})

// Close the map pop-up when the close button is clicked
closeMapButton.addEventListener('click', () => {
    mapContainer.style.display = 'none'
})

// Close the map pop-up when clicking outside the map container
window.addEventListener('click', (event) => {
    if (event.target === mapContainer) {
        mapContainer.style.display = 'none'
    }
})