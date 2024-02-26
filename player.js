var Player = {
    maximumHealth: 100,
    currentHealth: 1,
    maximumMana: 50,
    currentMana: 1,
    healthRegen:1,
    manaRegen:1,
    outOfCombatHealthRegen: 1,
    outOfCombatManaRegen: 1
};

var inCombat = false;
// global health regen 


function startHealthIncrement() {
    if (inCombat || Player.currentHealth >= Player.maximumHealth) {
        return;
    }

    Player.currentHealth += Player.healthRegen;
    console.log("Current Health:", Player.currentHealth);

    updateBar(`health`);

    if (Player.currentHealth < Player.maximumHealth) {
        setTimeout(startHealthIncrement, 1000);
    }
}

function startManaIncrement() {
    
    if (inCombat || Player.currentMana >= Player.maximumMana) {
        return;
    }

    Player.currentMana += Player.healthRegen;
    console.log("Current Mana:", Player.currentMana);

    updateBar(`mana`);

    if (Player.currentMana < Player.maximumMana) {
        setTimeout(startManaIncrement, 1000);
    }
}

startManaIncrement()
startHealthIncrement()


//out of combat health regen 
function startOutOfCombatHealthIncrement() {
    if (inCombat || Player.currentHealth >= Player.maximumHealth) {
        return;
    }

    Player.currentHealth += Player.outOfCombatHealthRegen;
    console.log("Current Health:", Player.currentHealth);

    updateBar(`health`);

    if (Player.currentHealth < Player.maximumHealth) {
        setTimeout(startOutOfCombatHealthIncrement, 100);
    }
}

function startOutOfCombatManaIncrement() {
    if (inCombat || Player.currentMana >= Player.maximumMana) {
        return;
    }

    Player.currentMana += Player.outOfCombatHealthRegen;
    console.log("Current Mana:", Player.currentMana);

    updateBar(`mana`);

    if (Player.currentMana < Player.maximumMana) {
        setTimeout(startOutOfCombatManaIncrement, 100);
    }
}

if (!inCombat){
    setTimeout(function () {
        startOutOfCombatHealthIncrement();
    }, 15000)    
    setTimeout(function () {
        startOutOfCombatManaIncrement();
    }, 15000);
}





window.onload = function () {
    var numSquares = 10; // Number of squares to create

    for (var i = 0; i < numSquares; i++) {
        // Create button element
        var button = document.createElement("button");
        button.textContent = i + 1;
        button.classList.add("square-button");

        // Create dialogue box element
        var dialogueBox = document.createElement("div");
        dialogueBox.classList.add("dialogue-box");
        dialogueBox.textContent = getSquareName(i + 1); // Set the dialogue box text

        button.appendChild(dialogueBox); // Append the dialogue box to the square button
        document.querySelector('.squares-container').appendChild(button);
    }

    function getSquareName(number) {
        // Function to get the square name in English based on its number
        switch (number) {
            case 1:
                return "One";
            case 2:
                return "Two";
            case 3:
                return "Three";
            case 4:
                return "Four";
            case 5:
                return "Five";
            case 6:
                return "Six";
            case 7:
                return "Seven";
            case 8:
                return "Eight";
            case 9:
                return "Nine";
            case 10:
                return "Ten";
            default:
                return "";
        }
    }

    // Update the health and mana bars
    updateBar('health');
    updateBar('mana');
};

function updateBar(type) {
    // Function to update the bars
    var current = Player['current' + capitalizeFirstLetter(type)];
    var maximum = Player['maximum' + capitalizeFirstLetter(type)];

    var greyBarElement = document.querySelector('#grey-bar-' + type);
    greyBarElement.querySelector('span').textContent = maximum;

    var coloredBarElement = document.querySelector('#' + (type === 'health' ? 'red' : 'blue') + '-bar-' + type);
    coloredBarElement.querySelector('span').textContent = current;

    var widthPercentage = (current / maximum) * 100;
    coloredBarElement.style.width = widthPercentage + '%';
}

function capitalizeFirstLetter(string) {
    // Function to capitalize the first letter of a string
    return string.charAt(0).toUpperCase() + string.slice(1);
}