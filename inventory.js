let playerInventory = [
    {name: 'Crown', category: 'Helmet'},
    {name: 'Golden Necklace', category: 'Necklace'},
    {name: 'Dragon Shoulders', category: 'Shoulders'},
    {name: 'Cloak of Invisibility', category: 'Back'},
    {name: 'Plate Armor', category: 'Chest'},
    {name: 'Excalibur', category: 'Weapon'},
    {name: 'Arm Guards', category: 'Arms'},
    {name: 'Ring of Strength', category: 'Rings'},
    {name: 'Chainmail Leggings', category: 'Legs'},
    {name: 'Boots of Speed', category: 'Feet'},
    {name: 'Thorny Armor', category: 'Chest'}
];
let categories = ['Helmet', 'Necklace', 'Shoulders', 'Back', 'Chest', 'Weapon', 'Arms', 'Rings', 'Legs', 'Feet'];

let overlay = document.getElementById('overlay');
let inventoryPanel = document.getElementById('inventory');
let characterPanel = document.getElementById('character');
let characterContent = document.getElementById('character-content');

function createInventoryItem(item) {
    let div = document.createElement('div');
    div.textContent = item.name;
    div.classList.add('item');
    div.setAttribute('draggable', true);
    div.dataset.category = item.category;
    div.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.category);
        event.dataTransfer.setData('text/name', event.target.textContent);
    });
    div.addEventListener('dblclick', function (event) {
        let categoryDiv = [...characterPanel.getElementsByClassName('category')].find(el => el.textContent.startsWith(item.category));
        if (categoryDiv) {
            inventoryPanel.removeChild(div);
            let equippedItem = document.createElement('div');
            equippedItem.classList.add('item');
            equippedItem.setAttribute('draggable', true);
            equippedItem.textContent = item.name;
            equippedItem.dataset.category = item.category;
            if (categoryDiv.childNodes.length > 1) {
                let unequippedItem = categoryDiv.childNodes[1].textContent;
                categoryDiv.removeChild(categoryDiv.childNodes[1]);
                createInventoryItem({name: unequippedItem, category: item.category});
            }
            categoryDiv.appendChild(equippedItem);
            equippedItem.addEventListener('dragstart', function (event) {
                event.dataTransfer.setData('text/plain', event.target.dataset.category);
                event.dataTransfer.setData('text/name', event.target.textContent);
            });
        }
    });
    inventoryPanel.appendChild(div);
    return div;
}

playerInventory.forEach(createInventoryItem);

// Populate character categories
categories.forEach(category => {
    let div = document.createElement('div');
    div.textContent = category;
    div.classList.add('category');
    div.addEventListener('dragover', function (event) {
        event.preventDefault();
    });
    div.addEventListener('drop', function (event) {
        event.preventDefault();
        let itemCategory = event.dataTransfer.getData('text/plain');
        let itemName = event.dataTransfer.getData('text/name');
        if (itemCategory === category) {
            let itemElement = [...inventoryPanel.getElementsByClassName('item')].find(el => el.textContent === itemName);
            if (itemElement) {
                inventoryPanel.removeChild(itemElement);
                let equippedItem = document.createElement('div');
                equippedItem.classList.add('item');
                equippedItem.setAttribute('draggable', true);
                equippedItem.textContent = itemName;
                equippedItem.dataset.category = itemCategory;
                if (div.childNodes.length > 1) {
                    let unequippedItem = div.childNodes[1].textContent;
                    div.removeChild(div.childNodes[1]);
                    createInventoryItem({name: unequippedItem, category: itemCategory});
                }
                div.appendChild(equippedItem);
                equippedItem.addEventListener('dragstart', function (event) {
                    event.dataTransfer.setData('text/plain', event.target.dataset.category);
                    event.dataTransfer.setData('text/name', event.target.textContent);
                });
            }
        }
    });
    div.addEventListener('dblclick', function (event) {
        if (div.childNodes.length > 1) {
            let unequippedItem = div.childNodes[1].textContent;
            div.removeChild(div.childNodes[1]);
            createInventoryItem({name: unequippedItem, category: category});
        }
    });
    characterContent.appendChild(div);
});

inventoryPanel.addEventListener('dragover', function (event) {
    event.preventDefault();
});
inventoryPanel.addEventListener('drop', function (event) {
    event.preventDefault();
    let itemCategory = event.dataTransfer.getData('text/plain');
    let itemName = event.dataTransfer.getData('text/name');
    let itemElement = [...characterPanel.getElementsByClassName('item')].find(el => el.textContent === itemName);
    if (itemElement) {
        let parent = itemElement.parentElement;
        parent.removeChild(itemElement);
        createInventoryItem({name: itemName, category: itemCategory});
    }
});

// Listen for 'i' key press
window.addEventListener('keydown', function (event) {
    if (event.key === 'i') {
        overlay.classList.toggle('visible');
    }
});
let unequipAllButton = document.getElementById('unequipAllButton');
unequipAllButton.addEventListener('click', function () {
    let equippedItems = [...characterPanel.getElementsByClassName('item')];
    equippedItems.forEach(item => {
        createInventoryItem({name: item.textContent, category: item.dataset.category});
        item.parentElement.removeChild(item);
    });
});