// Vars ========================================
const product_cells = document.querySelectorAll('.product-cell');
const items_count = document.querySelector('.items-count');
const cart_btn = document.querySelector('#cart-btn');
const cart_side_panel = document.querySelector('#cart-side-panel');
const close_cart_btn = document.querySelector('#close-cart');
const overlay_div = document.querySelector('#overlay');
const cart_wrapper = document.querySelector('#cart-wrapper');
let itemsInCart =
  localStorage.getItem('ItemsInCart') === null
    ? []
    : JSON.parse(localStorage.getItem('ItemsInCart'));

// Functions ==================================
function updateInCartCount() {
  if (itemsInCart.length > 0) {
    items_count.innerText = itemsInCart.length;
    items_count.classList.remove('hidden');
  } else {
    if (!items_count.classList.contains('hidden')) {
      items_count.classList.add('hidden');
    }
  }
}

function showOverlay(e) {
  const after = e.target.firstElementChild.lastElementChild;
  after.classList.add('visible');
  after.classList.remove('hidden');
  handleCartLink(after.children[0]);
}

function hideOverlay(e) {
  const after = e.target.firstElementChild.lastElementChild;
  after.classList.add('hidden');
  after.classList.remove('visible');
  handleCartLink(after.children[0]);
}

function handleCartLink(child) {
  if (child.classList.contains('cart-link')) {
    const item = itemsInCart.find(
      (item) => item.id == child.getAttribute('id')
    );
    if (item) {
      const span = document.createElement('span');
      span.id = `span-${item.id}`;
      span.innerText = 'In Cart';
      span.className = 'cart-span';
      child.parentElement.replaceChild(span, child);
    }
  }
}

function handleCartSpan(id) {
  const span = document.getElementById(`span-${id}`);
  const link = document.createElement('a');
  link.className = 'cart-link';
  link.href = '#';
  link.innerText = 'Add to cart';
  if (span) {
    span.parentElement.replaceChild(link, span);
  }
}

function addToCart(e) {
  e.preventDefault();
  if (e.target.classList.contains('cart-link')) {
    const id = e.target.getAttribute('id');
    const name =
      e.target.parentElement.parentElement.nextElementSibling.innerText;
    const price =
      e.target.parentElement.parentElement.nextElementSibling.nextElementSibling
        .innerText;
    itemsInCart.push({
      id: id,
      name: name,
      price: price,
      img: `product-${id}`,
      quantity: 1,
    });
    localStorage.setItem('ItemsInCart', JSON.stringify([...itemsInCart]));
    updateInCartCount();
    handleCartLink(e.target);
    showCart();
  } else {
    return;
  }
}

function fillCart() {
  if (itemsInCart.length === 0) {
    cart_wrapper.innerHTML = `<p class="empty"> Your cart is empty.<p>`;
  } else {
    cart_wrapper.innerHTML = '';
    itemsInCart.forEach((item) => {
      cart_wrapper.innerHTML += `
          <div class="cart-prod">
            <div class="left-col">
              <div class="thumb">
                <img class="thumb"
                  src="images/${item.img}.jpeg"
                />
              </div>
              <div class="info">
                <p>${item.name}</p>
                <p>${item.price}</p>
                <a class="remove-link" data-id=${item.id} href="#">Remove</a>
              </div>
            </div>
            <div class="right-col">
              <i data-id=${item.id} class="fa-solid fa-angle-up increase"></i>
              <p class="quantity">${item.quantity}</p>
              <i data-id=${item.id} class="fa-solid fa-angle-down decrease"></i>
            </div>
          </div>
          `;
    });
    cart_wrapper.innerHTML += `<button id="clear_all" class="btn">Clear All</button>`;
    calculate_total();
  }
}

function showCart(e) {
  cart_side_panel.className = 'visible';
  overlay_div.className = 'visible';
  fillCart();
}

function hideCart(e) {
  cart_side_panel.className = 'hidden';
  overlay_div.className = 'hidden';
}

function updateCart(e) {
  e.preventDefault();
  const event_target = e.target;
  const id = event_target.dataset.id;
  const classList = event_target.classList;

  if (classList.contains('remove-link')) {
    removeItem(id);
    handleCartSpan(id);
  }
  if (classList.contains('increase') || classList.contains('decrease')) {
    updateQuantity(id, event_target);
    calculate_total();
  }
  if (event_target.getAttribute('id') === 'clear_all') {
    const ids = itemsInCart.map((item) => item.id);
    itemsInCart = [];
    localStorage.setItem('ItemsInCart', JSON.stringify(itemsInCart));
    fillCart();
    updateInCartCount();
    ids.forEach((id) => handleCartSpan(id));
  }
}

function updateQuantity(id, target) {
  const item_index = itemsInCart.findIndex((item) => item.id === id);
  let quantity_p;

  if (target.classList.contains('increase')) {
    itemsInCart[item_index].quantity += 1;
    quantity_p = target.nextElementSibling;
  }
  if (target.classList.contains('decrease')) {
    itemsInCart[item_index].quantity -= 1;
    quantity_p = target.previousElementSibling;
  }

  if (itemsInCart[item_index].quantity <= 0) {
    removeItem(itemsInCart[item_index].id);
  } else {
    localStorage.setItem('ItemsInCart', JSON.stringify(itemsInCart));
    quantity_p.innerText = itemsInCart[item_index].quantity;
  }
}

function removeItem(id) {
  const item_index = itemsInCart.findIndex((item) => item.id === id);
  itemsInCart.splice(item_index, 1);
  localStorage.setItem('ItemsInCart', JSON.stringify(itemsInCart));
  fillCart();
  updateInCartCount();
  calculate_total();
  handleCartSpan(id);
}

function calculate_total() {
  const total = itemsInCart.reduce((total, item) => {
    const price = parseFloat(item.price.slice(1));
    const quantity = parseInt(item.quantity);
    total += price * quantity;
    return total;
  }, 0);
  let h4_total = document.getElementById('total');
  if (h4_total) {
    cart_wrapper.removeChild(h4_total);
  }
  h4_total = document.createElement('h4');
  h4_total.id = 'total';
  h4_total.innerText = `Your total: $ ${total.toFixed(2)}`;
  const clear_btn = document.getElementById('clear_all');
  cart_wrapper.insertBefore(h4_total, clear_btn);
}

updateInCartCount();

// Event handlers=================================

product_cells.forEach((cell) => {
  cell.addEventListener('click', addToCart);
  cell.addEventListener('mouseenter', showOverlay);
  cell.addEventListener('mouseleave', hideOverlay);
});

cart_btn.addEventListener('click', showCart);

close_cart_btn.addEventListener('click', hideCart);

cart_wrapper.addEventListener('click', updateCart);
