/**
 * 
 * - Object to store references from DOM elements.
 * - These elements are used for bookmark name, URL input, submit button, and table body.
 */
var DOMElements = {
    bookmarkName: document.getElementById('bookmarkName'), // Input field for bookmark name
    bookmarkURL: document.getElementById('bookmarkURL'),   // Input field for bookmark URL
    btnSubmit: document.getElementById('btnSubmit'),       // Submit button
    tableBody: document.getElementById('tableBody'),       // Table body to display bookmarks
};

/**
 * 
 * - Object to store predefined messages used for validation and user feedback.
 * - Each nested object represents a specific context or rule set for displaying messages.
 */
var issueMessage = {
    messagesSiteRule: {
        title: 'Site Name or URL is not valid, Please follow the rules below:', // General validation message
        firstRule: 'Site name must contain at least 3 characters',              // Rule for site name validation
        secondRule: 'Site URL must be a valid',                                 // Rule for site URL validation
    },
    messagesIsSiteExists: {
        title: 'The site already exists...!',                                   // Message for duplicate site entry
    }
};

/**
 * 
 * - Array to store the list of sites.
 * - Data is retrieved from local storage and used to display site information.
 */
var sitesList = [];

/**
 * 
 * - Checks if local storage contains site data, If data exists, it loads the sites and displays them.
 */
(function () {
    if (localStorage.getItem('Sites')) {
        sitesList = JSON.parse(localStorage.getItem('Sites'));
        displaySites();
    }
})();

/**
 * 
 * - Checks if the site name or URL already exists in the list.
 * @returns {boolean} True if the site name and URL are unique, otherwise False.
 */
function isSiteNameExists() {
    for (var index = 0; index < sitesList.length; index++) {
        if (sitesList[index].siteName == DOMElements.bookmarkName.value || sitesList[index].siteURL.toLowerCase() == DOMElements.bookmarkURL.value.toLowerCase()) {
            return false;
        }
    }
    return true;
}

/**
 * That Function To Check is Valid Data, That Function Take argument ( Input ) To Check Values From it inputs
 * @param {*} input 
 * @returns 
 */
function validationData(input) {
    var regExp = {
        bookmarkName: /^[A-Z][a-z]{3,9}\s?([A-Z][a-z]{0,9})?$/,
        bookmarkURL: /^(http:\/\/|https:\/\/)?([w|W]{1,3}[.])?[a-zA-Z0-9]+[.](com|org|net)$/,
    }

    if (regExp[input.id].test(input.value)) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        return true;
    } else {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        return false;
    }
}

/**
 * 
 * - Displays a modal with a title and two messages.
 * - This function is typically used to show validation or error messages related to inputs.
 *  
 * @param {string} titleMessage - The title of the modal.
 * @param {string} firstMessage - The first message to display in the modal body.
 * @param {string} secondMessage - The second message to display in the modal body.
 */
function showModal(titleMessage, firstMessage, secondMessage) {
    document.getElementById('titleMessage').textContent = titleMessage;
    document.getElementById('modalFirstMessage').textContent = firstMessage;
    document.getElementById('modalSecondMessage').textContent = secondMessage;
    var myModal = new bootstrap.Modal(document.getElementById('exampleModalCenter'));
    myModal.show();
}

/**
 * 
 * - Function to catch input values from the form.
 * - This function performs the following:
 *      1. Checks if the site name or URL already exists to avoid duplicates.
 *      2. Validates the site name and URL against defined rules.
 *      3. Adds the site object to the list and saves it to localStorage if valid and not duplicate.
 *      4. Shows appropriate modal messages for validation errors or duplicate entries.
 */
function getValuesFromInputs() {
    if (isSiteNameExists()) {
        // Validate both bookmark name and URL
        if (validationData(DOMElements.bookmarkName) && validationData(DOMElements.bookmarkURL)) {
            var siteObj = {
                siteName: DOMElements.bookmarkName.value, // Get site name from input.
                siteURL: DOMElements.bookmarkURL.value,  // Get site URL from input.
            }
            // Add the new site to the list and update localStorage.
            sitesList.push(siteObj);
            localStorage.setItem('Sites', JSON.stringify(sitesList));
        } else {
            // Show validation error modal.
            showModal(issueMessage.messagesSiteRule.title, issueMessage.messagesSiteRule.firstRule, issueMessage.messagesSiteRule.secondRule);
        }
    } else {
        // Show duplicate entry modal.
        showModal(issueMessage.messagesIsSiteExists.title);

        // Hide Arrow icons in the modal body.
        var iconsArrow = document.querySelectorAll('.modal-body .fa-circle-right');
        for (var i = 0; i < iconsArrow.length; i++) {
            iconsArrow[i].classList.add('d-none');
        }
    }
}

/**
 * 
 * - Clears input fields and resets their validation states.
 * - This function performs the following:
 *      1. Clears the values of `bookmarkName` and `bookmarkURL` input fields.
 *      2. Removes validation classes (`is-valid`, `is-invalid`) from both input fields to reset their visual state.
 *  
 * - Use this function after successfully adding a new site or resetting the form.
 */
function clearInputs() {
    DOMElements.bookmarkName.value = '';
    DOMElements.bookmarkURL.value = '';
    // Reset validation states for inputs
    DOMElements.bookmarkName.classList.remove('is-valid', 'is-invalid');
    DOMElements.bookmarkURL.classList.remove('is-valid', 'is-invalid');
}

/**
 * 
 * - Displays the list of saved sites in the table, This function generates table rows
 *   dynamically based on the `sitesList` array.
 * - Each row includes:
 *      1. The index of the site (starting from 1).
 *      2. The name of the site.
 *      3. A "Visit" button to open the site URL in a new tab.
 *      4. A "Delete" button to remove the site from the list.
 *      5. Updates the table body (`DOMElements.tableBody`) with the generated HTML.
 */
function displaySites() {
    var row = ``;
    for (var index = 0; index < sitesList.length; index++) {
        row +=
            `
            <tr>
                <td>${index + 1}</td>
                <td>${sitesList[index].siteName}</td>
                <td><button type="button" class="btn btn-success" onclick="visitSite('${sitesList[index].siteURL}')"><i class="fa-solid fa-eye pe-2"></i>Visit</button></td>
                <td><button type="button" class="btn btn-danger" onclick="deleteSite(${index})"><i class="fa-solid fa-trash-can pe-2"></i>Delete</button></td>
            </tr>
        `;
    }
    DOMElements.tableBody.innerHTML = row;
}

/**
 * 
 * - Submits site data and stores it in local storage.
 * - This function performs the following steps:
 *      1. Collects input values using `getValuesFromInputs()`.
 *      2. Clears the input fields and resets their validation states using `clearInputs()`.
 *      3. Updates the displayed list of sites using `displaySites()`.
 *  
 * - Use this function when the user submits a new site to ensure
 * - the data is validated, stored, and reflected in the interface.
 */
function addSite() {
    getValuesFromInputs();
    clearInputs();
    displaySites();
}

/**
 * 
 * - Opens a new tab to visit the provided site URL.
 * - This function uses the `window.open()` method to open the site in a new browser tab.
 *  
 * @param {string} siteURL - The URL of the site to visit.
 * @example visitSite('example.com'); // Opens https://example.com in a new tab.
 */
function visitSite(siteURL) {
    window.open(`https://${siteURL}`, "_blank");
}

/**
 * 
 * - Deletes a site record from the `sitesList` and updates the local storage.
 * - This function removes the site at the specified index from the list, updates the displayed site list,
 *   and then stores the updated list back into the local storage.
 * 
 * @param {number} index - The index of the site in the `sitesList` array to be deleted.
 * @example deleteSite(2); // Removes the site at index 2 from the list.
 */
function deleteSite(index) {
    sitesList.splice(index, 1);
    displaySites();
    localStorage.setItem('Sites', JSON.stringify(sitesList));
}
