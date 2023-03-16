import './../css/client.css';
import API from './ExcursionsAPI';
let bucket = [];
let counter = 0;
window.onload = function (e) {
    order(e);
    let trip = {};

    const btn = [...document.querySelectorAll('.excursions__field-input--bucket')];
    btn.forEach(item => {
        item.addEventListener('click', (e) => {
            // console.log(e.target.parentNode)
            e.preventDefault();
            if ((e.target.parentNode.querySelector('.adultNumber').value != '') && (e.target.parentNode.querySelector('.childrenNumber').value != '')) {
                trip.title = e.target.parentNode.querySelector('.title').textContent;
                trip.adultNumber = e.target.parentNode.querySelector('.adultNumber').value;
                trip.childrenNumber = e.target.parentNode.querySelector('.childrenNumber').value;
                trip.adultPrice = e.target.parentNode.querySelector('.adultPrice').innerText;
                trip.childrenPrice = e.target.parentNode.querySelector('.childrenPrice').innerText;
                bucket.push(trip);
                console.log(bucket)
                counter++;
                console.log(counter);
                displayBucket();
                order(e);

            } else alert("Wprowadż liczbę osób")

        })

    })
}

function displayBucket() {
    const ul = document.querySelector('.panel__summary');
    const liRoot = document.querySelector('.summary__item');
    let i = bucket.length - 1;
    while (i < bucket.length) {
        const li = liRoot.cloneNode(true);
        li.classList.remove('summary__item--prototype');
        li.querySelector('.summary__name').textContent = bucket[0].title;
        li.querySelector('.summary__total-price').textContent = bucket[0].adultNumber * bucket[0].adultPrice + bucket[0].childrenNumber * bucket[0].childrenPrice + "PLN";
        li.querySelector('.summary__prices').textContent = `dorośli: ${bucket[0].adultNumber} x ${bucket[0].adultPrice}PLN, dzieci: ${bucket[0].childrenNumber} x ${bucket[0].childrenPrice}PLN`;
        ul.appendChild(li);
        i++;
        const numberInput = document.querySelectorAll('.childrenNumber', '.adultNumber');
        numberInput.forEach(function (item) {
            item.innerText = '';
        })
    }
    const x = document.querySelectorAll('.summary__btn-remove');
    x.forEach(function (item) {
        item.addEventListener('click', deleteBucket);
    })

}

function deleteBucket(e) {
    e.preventDefault();
    e.target.parentNode.parentNode.remove();
    order(e);
    counter--;
}

const orderForm = document.querySelector('.panel__order');
orderForm.addEventListener("submit", orderCondition);

function orderCondition(e) {
    e.preventDefault();
    if (counter <= 0) {
        alert("Twój koszyk jest pusty!")
        return;
    }
    if (!orderForm.elements.email.value.includes('@')) {
        alert("Niepoprawny adres e-mail")
        return;
    }
    if ((orderForm.elements.name.value == '') || (orderForm.elements.email.value == '')) {
        alert("Pola formularza nie mogą być puste")
    } else {
        orderForm.elements.name.value = '';
        orderForm.elements.email.value = '';
        document.querySelector('.order__total-price-value').textContent = '0PLN';
        const ul = document.querySelector('.panel__summary');
        let children = [...ul.children];
        children.forEach(function (item, i) {
            if (i !== 0) item.remove();
        })
        alert("Zamówienie zostało złożone poprawnie");

    }
}


function order(e) {
    e.preventDefault();
    let sum = 0;
    const price = document.querySelectorAll('.summary__total-price');
    price.forEach((item) => {
        sum = sum + Number(item.textContent.replace('PLN', ''));
    })
    document.querySelector('.order__total-price-value').textContent = Number(sum) - 199 + "PLN";
}