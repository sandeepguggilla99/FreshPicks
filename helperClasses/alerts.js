export default class Alert {
    constructor() {
        this.alertContainer = document.createElement('div');
        this.alertContainer.className = 'alert-container';
        document.body.appendChild(this.alertContainer);
    }

    showAlert(message, type) {
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type}`;
        alertElement.textContent = message;

        this.alertContainer.appendChild(alertElement);

        // Automatically remove the alert after a few seconds
        setTimeout(() => {
            alertElement.remove();
        }, 3000); // Adjust the time as needed
    }
}
