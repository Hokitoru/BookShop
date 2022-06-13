import books from "./books.js";

// Создание HTML-элемента
const createElementFromHTML = htmlString => {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
};
//

// Создание Шаблонов
const createBookTemplate = (title, price) => `
<div class="product">
    <div class="book"></div>
    <div class="book-info">
        <p>${title}</p>
        <div class="buy">
            <p>${price} руб.</p>
            <button class="add-to-cart-btn">В корзину</button>
        </div>
    </div>
</div>`;

const createSumTemplate = (money) => `
<p class="money">${money} руб.</p>
`

const createCartTemplate = (title, price, amount) => `
<div class="cart-product">
    <div class="cart-book-info">
        <p>${title}</p>
        <div class="cart-buy">
            <p>${price} руб.</p>
            <p>${amount} шт.</p>
            <button class="delete-from-cart-btn">Из корзины</button>
        </div>
    </div>
</div>
`;
//

// Удаление из корзины
const deleteFromCart = key => {
    if(cartOfBooks[key].amount === 1){
        delete cartOfBooks[key];
    }
    else{
        cartOfBooks[key].amount--;
    }
    console.log(cartOfBooks);

    let money = 0;

    if (Object.keys(cartOfBooks).length === 0){
        renderMoney(0);
    }
    else{
        for(const key in cartOfBooks){
            money = money + cartOfBooks[key].price * cartOfBooks[key].amount;
            renderMoney(money);
        }
    }

    renderCart();
}
//

// Добавление в корзину
const addToCartOfBooks = book => {
    if (cartOfBooks[book.title]){
        cartOfBooks[book.title].amount++;
    }
    else{
        cartOfBooks[book.title] = {
            ...book,
            amount: 1
        }
    }
    console.log(cartOfBooks);

    let money = 0;

    for(const key in cartOfBooks){
        money = money + cartOfBooks[key].price * cartOfBooks[key].amount;
        renderMoney(money);
    }
}
//

// Рендер корзины
const cartOfBooks = {};

const cartElem = document.querySelector(".product-cart");

const renderCart = () => {
    document.querySelector(".product-cart").innerHTML = "";
    for(const key in cartOfBooks){
        const str = createCartTemplate(cartOfBooks[key].title, cartOfBooks[key].price, cartOfBooks[key].amount);
        const elem = createElementFromHTML(str);
        const deleteFromCartBtn = elem.querySelector(".delete-from-cart-btn");
        deleteFromCartBtn.addEventListener("click", () => {
            deleteFromCart(key);
        })
        cartElem.append(elem);
    }
}
//

// Рендер суммы за товары
const renderMoney = money => {
    document.querySelector(".money").innerHTML = "";
    const str = createSumTemplate(money);
    const elem = createElementFromHTML(str);
    document.querySelector(".money").append(elem);
}
//

// Рендер каталога
const productsElem = document.querySelector('.products');

const renderBooks = books => {
    productsElem.innerHTML = '';
    for (let i = 0; i < books.length; i++){
        const book = books[i];
        const str = createBookTemplate(book.title, book.price);
        const elem = createElementFromHTML(str);
        const addToCartBtn = elem.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            addToCartOfBooks(book);
            renderCart();
        });
        productsElem.append(elem);
    }
}
//

// Сортировка по цене
const getSortPrice = books =>{
    if(sortCounter % 2 === 1){
        books.sort(function (a, b){
            return a.price - b.price;
        });
    }
    else{
        books.sort(function (a, b){
            return b.price - a.price;
        });
    }
    sortCounter++;
    renderBooks(books);
}

const sortPriceButton = document.querySelector("#sort-by-price");

let sortCounter = 1;

sortPriceButton.addEventListener("click", (books) => {
    getSortPrice(books);
})
//

// Сортировка по жанру
const sortCategory = document.querySelector("#sort-by-category");
const choseCategory = document.querySelector(".category-block");

sortCategory.addEventListener("click", () => {
    choseCategory.classList.toggle("category-block-visible");

    const sortComedy = document.querySelector(".category:first-child");
    const sortHorror = document.querySelector(".category:nth-child(2)")
    const sortScience = document.querySelector(".category:nth-child(3)")
    const sortAdventure = document.querySelector(".category:last-child")

    sortComedy.addEventListener("click", () => {
        const sortTitle = "comedy";
        sort(sortTitle);
    })

    sortHorror.addEventListener("click", () => {
        const sortTitle = "horror";
        sort(sortTitle);
    })

    sortScience.addEventListener("click", () => {
        const sortTitle = "science";
        sort(sortTitle);
    })

    sortAdventure.addEventListener("click", () => {
        const sortTitle = "adventure";
        sort(sortTitle);
    })
})


const sort = sortTitle => {
    let booksSorted = [];

    booksSorted = [...books];

    for (let i = 0; i < booksSorted.length; i++){
        if(booksSorted[i].category === sortTitle){
        }
        else if(booksSorted[i].category !== sortTitle){
            booksSorted.splice(i, 1);
            i--;
        }
    }

    const sortPrice = document.querySelector("#sort-by-price");

    renderBooks(booksSorted);

    sortPrice.addEventListener("click", () => {
        getSortPrice(booksSorted);
    })
}
//

// Поиск по названию
const startSearch = document.querySelector(".search > input");

startSearch.addEventListener("keypress", (event) => {
    const keyName = "Enter";
    if(keyName === event.key){
        let booksSorted = [];
        let search = document.querySelector(".search > input").value;
        const regex = new RegExp(search, "i");

        for(let i = 0; i < books.length; i++){
            if(regex.test(books[i].title)){
                booksSorted.push(books[i]);
            }
        }

        if(booksSorted.length === 0){
            document.querySelector(".products").innerHTML = "Ничего не найдено :(";
            return;
        }
        renderBooks(booksSorted);
    }
})
//

renderBooks(books);
