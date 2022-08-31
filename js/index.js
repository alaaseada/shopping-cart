const prod_imgs = document.querySelectorAll('.img');
const cart_links = document.querySelectorAll('.cart-link');

const itemsInCart =
  JSON.parse(localStorage.getItem('ItemsInCart')) | JSON.stringify([]);

function handleOverlay(e) {
  const after = e.target.children[1];
  // if (itemsInCart.after.children[0].getAttribute('id'))
  after.classList.toggle('hidden');
}

function addToCart(e) {
  e.preventDefault();
  const id = e.currentTarget.getAttribute('id');
  console.log(typeof itemsInCart);
  itemsInCart.push({ id: `product-${id}` });
  localStorage.setItem('ItemsInCart', [...itemsInCart]);
}

prod_imgs.forEach((img) => {
  img.addEventListener('mouseleave', handleOverlay);
});

cart_links.forEach((link) => {
  link.addEventListener('click', addToCart);
});
