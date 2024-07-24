const cartModal = document.getElementById("cart-modal");
const cartTotal = document.getElementById("cart-total");
const cart = document.getElementById("cart");
const addressWarn = document.getElementById("address-warn");
const checkoutBtn = document.getElementById("checkout-btn");
const meuCart = document.getElementById("meu-cart");
const address = document.getElementById("address");
const fecharBtn = document.getElementById("fechar-btn");
const menu = document.getElementById("menu");
const quantidadeCart = document.getElementById("quantidade-cart");
const paymentMethod = document.getElementById("payment-method");
const descriptionLanche = document.getElementById("description-lanche");

let cartt = JSON.parse(localStorage.getItem('carrinho')) || [];

// Atualizar carrinho na inicialização
window.onload = function() {
    updateCart();
    atualizarQuantidadeCarrinho();
};

// abrir o modal do carrinho
meuCart.addEventListener("click", function() {
    updateCart();
    cartModal.style.display = "flex";
});

// fechar o modal do carrinho
cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

fecharBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
});

// adicionar ao carrinho

menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".cor-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price").replace(',', '.'));

        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existingItem = cartt.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartt.push({
            name,
            price,
            quantity: 1,
        });
    }
    updateCart();
    atualizarQuantidadeCarrinho();
}

function updateCart() {
    cart.innerHTML = "";
    let total = 0;
    cartt.forEach(item => {
        total += item.price * item.quantity;
        cart.innerHTML += `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4 class="item-name">${item.name}</h4>
                <h4 class="item-price">R$ ${item.price.toFixed(2)}</h4>
                <h5 class="item-quantidade">Quantidade: ${item.quantity}</h5>
            </div>
            <div class="cart-item-remove">
                <button class="remove-btn" data-name="${item.name}">Remover</button>
            </div>
        </div>
        `;
    });
    cartTotal.innerHTML = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    quantidadeCart.innerHTML = cartt.length;

    if (cartt.length === 0) {
        cartTotal.innerHTML = "Carrinho Vazio";
    }

    localStorage.setItem('carrinho', JSON.stringify(cartt));
}

function atualizarQuantidadeCarrinho() {
    quantidadeCart.innerHTML = cartt.reduce((total, item) => total + item.quantity, 0);
}

// função para remover item do carrinho
cart.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItem(name);
    }
});

function removeItem(name) {
    const index = cartt.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cartt[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cartt.splice(index, 1);
        }
        updateCart();
        atualizarQuantidadeCarrinho();
    }
}

address.addEventListener("input", function(event) {
    let inputValue = event.target.value;
    addressWarn.style.display = inputValue === "" ? "block" : "none";
});

checkoutBtn.addEventListener("click", function() {
    if (cartt.length === 0) return;

    if (address.value === "") {
        addressWarn.style.display = "block";
        return;
    }

    if (paymentMethod.value === "") {
        alert("Por favor, selecione um método de pagamento.");
        return;
    }

    const cartItems = cartt.map((item) => {
        return `${item.name} Quantidade: (${item.quantity}) |`;
    }).join("");

    const totalOrder = cartt.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    const message = encodeURIComponent(
        cartItems + 
        ` Total do Pedido: R$ ${totalOrder}` + 
        ` Método de Pagamento: ${paymentMethod.options[paymentMethod.selectedIndex].text}` +
        ` Descrição do Lanche: ${descriptionLanche.options[descriptionLanche.selectedIndex].text}`
    );
    const phone = "5587981551925";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${encodeURIComponent(address.value)}`);

    cartt = [];
    updateCart();
    atualizarQuantidadeCarrinho();
});
