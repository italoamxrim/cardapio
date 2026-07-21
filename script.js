const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn") 


let cart = [];

// abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

// fechar o modal ao clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }

})


// função para adicionar ao carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}


// atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.className = "flex justify-between items-center border-b py-2"

        cartItemElement.innerHTML = `
            <div class="flex items-center gap-4">
                <p class="font-bold">${item.name}</p>
                <p class="text-sm">Qtd: ${item.quantity}</p>
                <p class="text-sm">R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-item-btn text-red-500" data-name="${item.name}">
                Remover
            </button>
        `

        cartItemsContainer.appendChild(cartItemElement)
        
        total += item.price * item.quantity;
    })

    // Atualiza o total
    cartTotal.textContent = total.toFixed(2)

    // Atualiza o contador
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
    cartCounter.textContent = totalItems

    // Adiciona evento de remover para cada botão
    document.querySelectorAll(".remove-item-btn").forEach(button => {
        button.addEventListener("click", function() {
            const name = this.getAttribute("data-name")
            removeItemFromCart(name)
        })
    })
}

// Função para remover item do carrinho
function removeItemFromCart(name) {
    const index = cart.findIndex(item => item.name === name)
    
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1
        } else {
            cart.splice(index, 1)
        }
        updateCartModal()
    }
}


//finalizar pedido
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
              text: "Ops, o restaurante está fechado!",
              duration: 3000,
              close: true,
              gravity: "top", // `top` or `bottom`
              position: "right", // `left`, `center` or `right`
              stopOnFocus: true, // Prevents dismissing of toast on hover
              style: {
              background: "#ef4444",
           },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar o pedido para api whats

    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "19978107196"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();

})


//verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //true = restaurante esta aberto
}

const spanItem = document.getElementById("data-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500")
}