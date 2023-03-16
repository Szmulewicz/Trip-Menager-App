// ./src/Excursions.js
import API from './ExcursionsAPI';
// import './../css/admin.css'

class ExcursionsAPI {
    constructor(api) {
        this.apiService = api;
    }

    load() {
        this.apiService.loadData()
            .then(data => {
                this.insert(data);
            })
            .catch(err => console.error(err));
    }

    insert(data) {
        const ulEl = this._findUl();
        this._clearElement(ulEl);

        data.forEach(item => {
            const liEl = this._createLi(item);
            ulEl.appendChild(liEl);
        });
    }

    remove() {
        const ulEl = this._findUl();
        ulEl.addEventListener('click', e => {
            const targetEl = e.target;
            if ((this._isElementType(targetEl, 'INPUT') && (targetEl.value === "usuń"))) {
                const id = this._getIdFromRoot(targetEl);
                this.apiService.removeData(id)
                    .catch(err => console.error(err))
                    .finally(() => this.load());
            }
        })
    }

    add() {

        const form = document.querySelector('.form');
        form.addEventListener('submit', e => {
            e.preventDefault();

            const {
                name,
                description,
                adults,
                children
            } = e.target.elements;
            const data = {
                name: name.value,
                description: description.value,
                adults: adults.value,
                children: children.value
            };

            this.apiService.addData(data)
                .catch(err => console.error(err))
                .finally(() => this.load());
        });
    }

    update() {
        const ulEl = this._findUl();
        ulEl.addEventListener('click', e => {
            const targetEl = e.target;
            if ((this._isElementType(targetEl, 'INPUT') && (targetEl.className != 'adultNumber') && (targetEl.className != 'childrenNumber'))) {
                if (this._isItemEditable(targetEl)) {
                    const id = this._getIdFromRoot(targetEl);
                    const data = this._createDataToUpdate(targetEl);

                    this.apiService.updateData(id, data)
                        .catch(err => console.error(err))
                        .finally(() => {
                            targetEl.value = 'edytuj';
                            this._setItemEditable(targetEl, false);
                        });

                } else {
                    targetEl.value = 'zapisz';
                    this._setItemEditable(targetEl, true);
                }
            }
        });
    }

    _isElementType(element, type) {
        return element.tagName === type;
    }

    _findUl() {
        return document.querySelector('.excursions');
    }

    _getIdFromRoot(targetElement) {
        return this._findItemRoot(targetElement).dataset.id;
    }

    _findItemRoot(targetElement) {
        return targetElement.parentElement;
    }

    _findItemSpan(itemRoot) {
        return itemRoot.querySelectorAll('span');
    }

    _isItemEditable(targetElement) {
        const rootItem = this._findItemRoot(targetElement);
        const inputList = this._findItemSpan(rootItem);
        const isEditable = [...inputList].every(
            content => content.isContentEditable
        );

        return isEditable
    }

    _setItemEditable(targetElement, innerText) {
        const rootItem = this._findItemRoot(targetElement);
        const inputList = this._findItemSpan(rootItem);
        inputList.forEach(
            input => input.contentEditable = innerText
        );
    }

    _createDataToUpdate(targetElement) {
        const rootItem = this._findItemRoot(targetElement);
        const [nameEl, descriptionEl, adultsEl, childrenEl] = [...this._findItemSpan(rootItem)];

        return {
            name: nameEl.innerText,
            description: descriptionEl.innerText,
            adults: adultsEl.innerText,
            children: childrenEl.innerText
        }
    }

    _clearElement(element) {
        element.innerHTML = '';
    }

    _createLi(itemData) {
        const liEl = document.createElement('li');
        liEl.dataset.id = itemData.id;
        liEl.classList.add('excursions__item');
        [...liEl.children].forEach(item => {
            item.classList.add('excursions__field')
        })
        liEl.innerHTML = `           
        <header class="excursions__header">
        <h2 class="excursions__title"><span class="title">${itemData.name}</span></h2>
        <p class="excursions__description"><span class="description">${itemData.description}</span></p>
    </header>
    <form class="excursions__form">
        <div class="excursions__field">
            <label class="excursions__field-name">
                Dorosły:<span class="adultPrice">${itemData.adults}</span>PLN<input class="adultNumber" type="number">
            </label>
        </div>
        <div class="excursions__field">
            <label class="excursions__field-name">
                Dziecko:<span class="childrenPrice">${itemData.children}</span>PLN<input class="childrenNumber" type="number">
            </label>
        </div>
        <div class="excursions__field excursions__field--submit">

        </div>
    </form>
    <input 
    class="excursions__field-input excursions__field-input--update" 
    value="edytuj"
    type="submit"
/>
<input 
    class="excursions__field-input excursions__field-input--remove" 
    value="usuń"
    type="submit"
/>
<input 
    class="excursions__field-input excursions__field-input--bucket" 
    value="dodaj do zamówienia"
    type="submit"
/>
    `;
        return liEl;
    }
}

export default ExcursionsAPI;


document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('DOM');

    const api = new API();
    const excursions = new ExcursionsAPI(api);
    excursions.load();
    excursions.remove();
    excursions.add();
    excursions.update();
}