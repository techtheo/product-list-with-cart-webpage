// Select the HTML element with the ID "container-desserts" to display desserts
const containerDesserts = document.querySelector("#container-desserts");

// Select the HTML element with the ID "carts" to display the cart
const containerCarts = document.querySelector("#carts");

// Initialize an empty array to hold cart items
let cart = [];

// Function to initialize the application
function initApp() {
    // Retrieve the cart from local storage and assign it to the cart variable
    cart = getCartLocalStorage();
    // Fetch and display desserts (function definition not provided here)
    getDesserts();
    // Display the cart (function definition not provided here)
    showCart();
}

// Function to display desserts on the page
function showDesserts(results) {
    // Loop through each result (dessert) in the results array
    results.forEach(result => {
        // Destructure the properties from each result
        const {image, name, category, price, id} = result;    
        // Create a dessert element using the destructured properties
        const dessert = createDessert(image, name, category, price, id);
        
        // Append the created dessert element to the containerDesserts element
        containerDesserts.appendChild(dessert);
    });
}

// Function to create a dessert element
function createDessert(image, name, category, price, id) {
    // Create a DIV element to represent the dessert
    const divDessert = document.createElement("DIV");
    // Add a class to the DIV for styling
    divDessert.classList.add('dessert');
    // Set a data attribute with the dessert's id for easy reference
    divDessert.dataset.id = id;

    // Create another DIV element to contain the dessert's image and buttons
    const div = document.createElement("DIV");

    // Create an IMG element for the dessert's image
    const imgDessert = document.createElement("IMG");
    // Add a class to the image based on whether it is in the cart
    imgDessert.classList.add(`${cart.some(dessert => dessert.id === id) ? 'img-dessert-red' : 'img-dessert'}`);
    // Set the image source based on the screen size
    imgDessert.src = `${verifySize(image)}`;
    // Set alternative text for the image
    imgDessert.alt = `image ${name}`;
    // Append the image to the inner DIV
    div.appendChild(imgDessert);

    // Check if the dessert is already in the cart
    if (cart.some(dessert => dessert.id === id)) {
        // If in the cart, create and append the options for quantity adjustment
        const divBtns = showOptions(id);
        div.appendChild(divBtns);
    } else {
        // If not in the cart, create and append an "Add to Cart" button
        const button = showButton(name, price, id, div, image.mobile);
        div.appendChild(button);
    }
    
    // Create a DIV element to hold the dessert's information
    const divInfo = document.createElement("DIV");
    divInfo.classList.add('info-dessert');
    
    // Create an H4 element for the dessert's name
    const h4 = document.createElement("H4");
    h4.classList.add('info-name-dessert');
    h4.textContent = name;

    // Create an H3 element for the dessert's category
    const h3 = document.createElement("H3");
    h3.classList.add('info-title-dessert');
    h3.textContent = category;

    // Create a SPAN element for the dessert's price
    const span = document.createElement("SPAN");
    span.classList.add('info-price-dessert');
    span.textContent = `$${price}`;

    // Append the name, category, and price elements to the information DIV
    divInfo.appendChild(h4);
    divInfo.appendChild(h3);
    divInfo.appendChild(span);

    // Append both the inner DIV (image and buttons) and the info DIV to the main dessert DIV
    divDessert.appendChild(div);
    divDessert.appendChild(divInfo);

    // Return the complete dessert element
    return divDessert;
}

// Function to add a dessert to the cart
function addToCart(name, price, id, img) {
    // Create an object to represent the dessert in the cart
    let objDessert = {
        id,
        name,
        price,
        cant: 1, // Initial quantity
        total: price, // Initial total price
        img
    };
    
    // Add the new dessert object to the cart array
    cart = [...cart, objDessert];
    // Update the cart display
    showCart();
}

// Function to display the cart contents
function showCart() {
    // Remove all child elements from the containerCarts element
    while(containerCarts.firstChild) {
        containerCarts.removeChild(containerCarts.firstChild);
    }
    // Create and append a title for the cart
    const h2 = document.createElement("H2");
    h2.classList.add('carts-title');
    h2.textContent = `Your Cart (${cart.length})`;
    containerCarts.appendChild(h2);

    // If the cart is empty, show a message and an empty cart image
    if (cart.length === 0) {
        const img = document.createElement("IMG");
        img.classList.add('cart-img');
        img.src = 'assets/images/illustration-empty-cart.svg';
        img.alt = 'empty cart';

        const p = document.createElement("P");
        p.classList.add('cart-text');
        p.textContent = 'Your added items will appear here';

        containerCarts.appendChild(h2);
        containerCarts.appendChild(img);
        containerCarts.appendChild(p);
        return;   
    }

    // Create a DIV to hold cart items
    const divCart = document.createElement("DIV");
    divCart.classList.add('cart-container');
    // Add an event listener to handle clicks on the remove button or its image
    divCart.onclick = (e) => {
        // Check if the clicked target is the remove button or its image
        if (e.target && (e.target.id === 'btn-removeItem' || e.target.id === 'btn-img')){
            // Find the closest remove button and get the dessert id
            let button = e.target.closest('button#btn-removeItem');
            let id = button.parentElement.dataset.id;
            // Remove the dessert from the cart
            removeDessertCart(id);
        }
    };

    // Loop through each dessert in the cart and create a cart item element
    cart.forEach(dessert => {
        const {id, name, price, cant, total} = dessert;
        // Append cart item details to the cart container
        divCart.innerHTML += `
        <div class="cart" data-id="${id}">
            <div>
            <h3 class="cart-title">${name}</h3>
            <div class="cart-info">
                <span>${cant}x</span>
                <h4>$${price}</h4>
                <span>$${total}</span>
            </div>
            </div>
            <button class="cart-button" id="btn-removeItem"><img id="btn-img" src="assets/images/icon-remove-item.svg" alt="remove item"></button>
        </div>
        `;
    });

    // Create a DIV to show the order total and other details
    const divResults = document.createElement("DIV");
    divResults.classList.add('carts-result');
    divResults.innerHTML = ` 
      <h3>Order total</h3>
      <span>$${getTotalCart(cart)}</span>
    `;

    // Create an H3 element for additional message
    const h3 = document.createElement("H3");
    h3.classList.add('carts-msj');
    h3.innerHTML = `This is a <span>carbon-neutral</span> delivery`;

    // Create a button to confirm the order
    const btnConfirm = document.createElement("BUTTON");
    btnConfirm.classList.add('carts-button');
    btnConfirm.textContent = 'Confirm Order';
    btnConfirm.onclick = () => {
        // Call the confirmOrder function when the button is clicked
        confirmOrder();  
    };

    // Append the cart items, results, message, and confirm button to the container
    containerCarts.appendChild(divCart);
    containerCarts.appendChild(divResults);
    containerCarts.appendChild(h3);
    containerCarts.appendChild(btnConfirm);
}  

// Function to create quantity adjustment buttons for desserts
function showOptions(id) {
    // Create a DIV to hold the quantity adjustment buttons
    const divBtns = document.createElement("DIV");
    divBtns.classList.add('menuButton-dessert');

    // Create a SPAN to display the current quantity
    const span = document.createElement("SPAN");
    span.textContent = `${getQuantity(id)}`;

    // Create a button to decrement the quantity
    const btnDecrement = document.createElement("BUTTON");
    btnDecrement.onclick = () => {
        // Call the function to decrement quantity and update display
        incrementOrDecrement(id, "decrement");
        span.textContent = `${getQuantity(id)}`;
    };

    // Create an IMG element for the decrement button icon
    const imgDecrement = document.createElement("IMG");
    imgDecrement.src = 'assets/images/icon-decrement-quantity.svg';
    imgDecrement.alt = 'decrement quantity';
    btnDecrement.appendChild(imgDecrement);

    // Create a button to increment the quantity
    const btnIncrement = document.createElement("BUTTON");
    btnIncrement.onclick = () => {
        // Call the function to increment quantity and update display
        incrementOrDecrement(id, "increment");
        span.textContent = `${getQuantity(id)}`;
    };

    // Create an IMG element for the increment button icon
    const imgIncrement = document.createElement("IMG");
    imgIncrement.src = 'assets/images/icon-increment-quantity.svg';
    imgIncrement.alt = 'increment quantity';
    btnIncrement.appendChild(imgIncrement);

    // Append the buttons and quantity SPAN to the DIV
    divBtns.appendChild(btnDecrement);
    divBtns.appendChild(span);
    divBtns.appendChild(btnIncrement);

    // Return the DIV containing the buttons and quantity display
    return divBtns;
}

// Function to create an "Add to Cart" button
function showButton(name = '', price = 0, id = 0, location, img) {
    // Create a button element
    const button = document.createElement("BUTTON");
    button.classList.add('button-dessert');
    button.innerHTML = `<img src="assets/images/icon-add-to-cart.svg" alt="icon-add-to-cart"><span>Add to Cart</span>`;
    // Set up the button's click event handler
    button.onclick = () => {
        // Check if the dessert is already in the cart
        if (cart.some(dessert => dessert.id === id)) return;
        // Remove the "Add to Cart" button
        button.remove();
        // Add the dessert to the cart
        addToCart(name, price, id, img);
        // Save the cart to local storage
        saveLocalStorage();
        // Create and display quantity adjustment buttons
        const divBtns = showOptions(id);
        location.appendChild(divBtns);
        // Change the image class to indicate it's in the cart
        location.children[0].classList.add('img-dessert-red');
    };
    // Return the button element
    return button;
}

// Function to remove a dessert from the cart
function removeDessertCart(id) {
    // Find the dessert element in the DOM based on its ID
    let element = document.querySelector(`[data-id="${id}"]`);
    let img = element.children[0].children[0];

    // Get the dessert's name and price from the DOM
    let name = element.children[1].children[0].textContent;
    let price = element.children[1].children[2].textContent;

    // Create and display a new "Add to Cart" button
    const button = showButton(name, Number(price.replace('$', '')), Number(id), element.children[0], img.src);
    // Remove the quantity adjustment buttons from the DOM
    element.children[0].children[1].remove();
    // Add the new "Add to Cart" button
    element.children[0].appendChild(button);

    // Change the image class back to its original state
    img.classList.add('img-dessert');
    img.classList.remove('img-dessert-red');
    
    // Remove the dessert from the cart array
    cart = cart.filter(dessert => dessert.id !== Number(id));
    // Save the updated cart to local storage
    saveLocalStorage();
    // Update the cart display
    showCart();
}

// Function to increment or decrement the quantity of a dessert in the cart
function incrementOrDecrement(id, action) {
    // Check if the dessert is in the cart
    if (cart.some(dessert => dessert.id === id)) {
        // Update the cart based on the action (increment or decrement)
        const actCart = cart.map(element => {
            if (element.id === id && action === 'increment') {
                element.cant++; // Increase quantity
                element.total += element.price; // Update total price
                return element;
            } else if (element.id === id && action === 'decrement') {
                element.cant--; // Decrease quantity
                if (element.cant < 1) {
                    // If quantity is less than 1, remove quantity adjustment buttons
                    const dessertDiv = document.querySelector(`[data-id="${element.id}"]`);
                    const button = dessertDiv.firstChild.lastChild;
                    button.remove();
        
                    // Recreate and display the "Add to Cart" button
                    const id = dessertDiv.dataset.id;
                    const img = dessertDiv.firstChild.firstChild;
                    const name = dessertDiv.lastChild.firstChild.textContent;
                    const price = dessertDiv.lastChild.lastChild.textContent;
                    
                    const btn = showButton(name, Number(price.replace('$', '')), Number(id), dessertDiv.children[0], img.src);
                    dessertDiv.children[0].appendChild(btn);
        
                    // Change the image class back to its original state
                    img.classList.add('img-dessert');
                    img.classList.remove('img-dessert-red');
                    return element;
                }
                element.total -= element.price; // Update total price
                return element;
            } else {
                return element;
            }
        });
        // Remove any elements with zero quantity
        const eliminate = actCart.filter(element => element.cant !== 0);
        cart = [...eliminate];
        // Update the cart display
        showCart();
        // Save the updated cart to local storage
        saveLocalStorage();
    }
}

// Function to confirm the order
function confirmOrder() {
    // Copy the current cart to confirm order
    const cartConfirm = [...cart];
    // Clear the cart
    const clearCart = [];
    cart = [...clearCart];
    // Reset styles for desserts
    resetStyles();
    // Update the cart display
    showCart();
    // Save the updated cart to local storage
    saveLocalStorage();
    // Show the order summary
    showResume(cartConfirm);
}

// Function to display the order summary in a modal
function showResume(cartConfirm) {
    // Select and show the modal element
    const modal = document.querySelector(".modal");
    modal.classList.add('modal-show');

    // Select the modal container and insert the confirmation content
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.insertAdjacentHTML("beforeend", `
        <img class="modal-img" src="assets/images/icon-order-confirmed.svg" alt="order confirmed">
        <h2 class="modal-title">Order Confirmed</h2>
        <p class="modal-subtitle">We hope you enjoy your food!</p>
    `);
    
    // Create a DIV to hold the list of desserts in the modal
    const modalDesserts = document.createElement("DIV");
    modalDesserts.classList.add('modal-desserts');

    // Create a DIV to show the order total
    const modalTotal = document.createElement("DIV");
    modalTotal.classList.add('modal-total');
    modalTotal.insertAdjacentHTML("beforeend", `
        <p>Order Total</p>
        <span>$${getTotalCart(cartConfirm)}</span>
    `);

    // Loop through each dessert in the confirmed order and add it to the modal
    cartConfirm.forEach(dessert => {
        const {name, price, img, total, cant} = dessert;
        const dessertDiv = document.createElement("DIV");
        dessertDiv.classList.add('modal-dessert');
        dessertDiv.insertAdjacentHTML("beforeend", `
            <div class="modal-img-info">
              <img src="${img}" alt="dessert ${name}">
              <div class="modal-dessert-info">
                <h3>${name}</h3>
                <div>
                  <span>${cant}x</span>
                  <p>$${price}</p>
                </div>
              </div>
            </div>
            <span>$${total}</span>    
        `);
        modalDesserts.appendChild(dessertDiv);
    });

    // Create a button to start a new order
    const modalButton = document.createElement('BUTTON');
    modalButton.classList.add('modal-button');
    modalButton.textContent = 'Start New Order';
    // Set up the button's click event handler to hide the modal and clear its content
    modalButton.onclick = () => {
        const modal = document.querySelector(".modal");
        modal.classList.remove("modal-show");
        modalContainer.innerHTML = "";
    };

    // Append the desserts list, order total, and the new order button to the modal container
    modalDesserts.appendChild(modalTotal);
    modalContainer.appendChild(modalDesserts);
    modalContainer.appendChild(modalButton);
}

// Function to reset the styles of desserts
function resetStyles() {
    // Select all dessert elements
    const dessertsDiv = document.querySelectorAll('.dessert');
    // Loop through each dessert and reset its style if it has quantity adjustment buttons
    for(dessert of dessertsDiv) {
        if(dessert.firstChild.lastChild.classList.contains('menuButton-dessert')) {
            const button = dessert.firstChild.lastChild;
            button.remove();

            // Get the dessert's details
            const id = dessert.dataset.id;
            const img = dessert.firstChild.firstChild;
            const name = dessert.lastChild.firstChild.textContent;
            const price = dessert.lastChild.lastChild.textContent;
            
            // Create and display a new "Add to Cart" button
            const btn = showButton(name, Number(price.replace('$', '')), Number(id), dessert.children[0], img.src);
            dessert.children[0].appendChild(btn);

            // Reset the image class
            img.classList.add('img-dessert');
            img.classList.remove('img-dessert-red');
        }
    }
}

// Function to determine the appropriate image size based on screen width
function verifySize(images) {
    // Get the current screen width
    const width = window.innerWidth;
    // Return the appropriate image URL based on screen width
    if (width >= 1440) {
        return images.desktop;
    } else if (width >= 768) {
        return images.tablet;
    } else {
        return images.mobile;
    }
}

// Function to get the quantity of a specific dessert in the cart
function getQuantity(id) {
    // Find the dessert in the cart and return its quantity
    let element = cart.find(dessert => dessert.id === id);
    return element ? element.cant : 0;
}

// Function to calculate the total cost of the cart
function getTotalCart(cart) {
    // Reduce the cart array to sum up the total price of all desserts
    let total = cart.reduce((ttl, dessert) => ttl + dessert.total, 0);
    return total; // Return the total cost
}

// Function to save the current cart to local storage
function saveLocalStorage() {
    // Convert the cart array to a JSON string and save it to local storage
    localStorage.setItem('DessertsCart', JSON.stringify(cart));
}

// Function to retrieve the cart from local storage
function getCartLocalStorage() {
    // Parse the JSON string from local storage into an array, or return an empty array if no data is found
    return JSON.parse(localStorage.getItem('DessertsCart')) ?? [];
}

// Function to fetch dessert data from the server
async function getDesserts() {
    try {
        // Make a fetch request to get dessert data from a JSON file
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("Error fetching data"); // Check if the response is successful
        const result = await response.json(); // Parse the JSON response
        showDesserts(result); // Display the desserts
    } catch (error) {
        console.log(error); // Log any errors that occur during the fetch
    }
}

// Initialize the app when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", initApp);
