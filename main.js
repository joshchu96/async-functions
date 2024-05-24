async function favNumFact(num) {
    try {
        let res = await axios.get(`http://numbersapi.com/${num}/?json`);
        console.log(res.data.text);
    } 
    catch(err) {
        console.log(err,'Something went wrong with your numbers') 
    }
};

async function multiNumFacts(nums) {
    try {
        let facts = [];
        let promises = nums.map(async (num) => {
            let res = await axios.get(`http://numbersapi.com/${num}/?json`);
            facts.push(res.data.text)
        });
        await Promise.all(promises);
        console.log(facts);

        displayFacts(facts);
        
    } catch (error) {
        console.error("Error fetching number facts:", error);
    }
}

//create the display onto the html page
function displayFacts(facts) {
    let h2 = document.querySelector("h2");
    for(let i=0; i<facts.length; i++) {
        $(h2).append(`<p>${facts[i]}</p>`);
    };
};

async function oneNumManyFacts(num, numOfFacts) {
    try {
        let promises = [];
        
        for (let i = 0; i < numOfFacts; i++) {
            promises.push(axios.get(`http://numbersapi.com/${num}/?json`));
        }
        
        let responses = await Promise.all(promises);
    
        let facts = responses.map(res => res.data.text);
        
        displayFacts(facts);

        
    } catch (err) {
        console.error("Error fetching number facts:", err);
    }
}

//Deck of Cards API
async function getCard() {
    try{

        let res = await axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
        let deck_id = res.data.deck_id;
        await drawCard(deck_id);
        await drawCard(deck_id);
    }
    catch(error) {
        console.log(error);
    }
};
async function drawCard(deck_id) {
    try{
    //draw one card from the shuffled deck
    let response = await axios.get(`https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`);
    let card = response.data.cards[0];
    console.log(`${card.value} of ${card.suit}`);
    }
    catch(error){
        console.log(error)
    }
}

$(document).ready(async () => {
    // Create a new deck of cards.
    console.log("Loading new deck!");
    let deck_id = await getDeck();
    console.log("New deck has been shuffled and loaded!");
    console.log(`Deck: ${deck_id}`);

    $("button").click(async () => {
        let result = await drawCard(deck_id);
        if (result) {
            let { card, remaining } = result;
            console.log(`${card.value} of ${card.suit}`);
            console.log("Posting it on HTML...");
            console.log(`Cards remaining in the deck: ${remaining}`);
            let ul = document.querySelector("ul");
            $(ul).append(`<li>${card.value} of ${card.suit}</li>`);
        }
    });
});

async function getDeck() {
    try {
        let response = await axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
        let deck_id = response.data.deck_id;
        return deck_id;
    } catch (err) {
        console.log("Error fetching new deck!", err);
    }
}

async function drawCard(deck_id) {
    try {
        console.log("Fetching card...");
        let res = await axios.get(`https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`);
        let card = res.data.cards[0];
        let remaining = res.data.remaining;
        return { card, remaining }; // Return card and remaining as an object
    } catch (err) {
        console.log("Error: Could not draw a card!", err);
    }
}




