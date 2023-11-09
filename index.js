import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-69cca-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsListInDB = ref(database, "endorsementsList")

const publishBtn = document.getElementById("publish-button")

const inputField = document.getElementById("input-field")
const inputFieldTo = document.getElementById("to-field")
const inputFieldFrom = document.getElementById("from-field")
let likesCounterNumber = 0

const endorsementsList = document.getElementById("endorsements-list")

publishBtn.addEventListener("click", function() {
    let inputValue = inputField.value
    let inputValueTo = inputFieldTo.value
    let inputValueFrom = inputFieldFrom.value
    let likesNumber = likesCounterNumber
    let likesButtonValue = "off"
    
    if (inputValue.trim() === "" || inputValueTo.trim() === "" || inputValueFrom.trim() === "") {
        alert("Please fill in ALL of the empty fields.")
        return
    }
    
    let combinedValue = {
        toRecipient: inputValueTo,
        description: inputValue,
        fromRecipient: inputValueFrom,
        likesCounter: likesNumber,
        likesButtonVal: likesButtonValue
    }
    
    push(endorsementsListInDB, combinedValue)
    
    clearInputField()
    clearInputFieldTo()
    clearInputFieldFrom()
})

onValue(endorsementsListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        
        clearEndorsementsList()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToEndorsementsList(currentItem)
        }
    } else {
        endorsementsList.innerHTML = "Nothing to see here..."
        endorsementsList.style.color = "white";
    }
})

function clearEndorsementsList() {
    endorsementsList.innerHTML = ""
}

function clearInputField() {
    inputField.value = ""
}

function clearInputFieldTo() {
    inputFieldTo.value = ""
}

function clearInputFieldFrom() {
    inputFieldFrom.value = ""
}

function appendItemToEndorsementsList(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    let toEl = document.createElement("h3")
    let deleteButtonEl = document.createElement("button")
    let descriptionEl = document.createElement("p")
    let fromEl = document.createElement("h3")
    let likesButtonEl = document.createElement("button")
    
    let likesCounterEl = document.createElement("h3")
    
    toEl.style.display = "inline-block"
    
    fromEl.style.display = "inline-block"
    likesButtonEl.style.display = "inline-block"
    likesCounterEl.style.display = "inline-block"
    
    likesButtonEl.id = "likes-button"
    likesCounterEl.id = "likes-number"
    deleteButtonEl.id = "delete-li"
    
    newEl.appendChild(toEl)
    newEl.appendChild(deleteButtonEl)
    newEl.appendChild(descriptionEl)
    newEl.appendChild(fromEl)
    newEl.appendChild(likesButtonEl)
    newEl.appendChild(likesCounterEl)
    
    toEl.textContent = itemValue.toRecipient
    descriptionEl.textContent = itemValue.description
    fromEl.textContent = itemValue.fromRecipient
    likesButtonEl.textContent = "❤"
    likesCounterEl.textContent = itemValue.likesCounter
    deleteButtonEl.textContent = "⌫"
    
    deleteButtonEl.style.display = "none"
    
    newEl.addEventListener("mouseover", function() {
        let deleteButton = deleteButtonEl
        deleteButton.style.display = "inline-block"
    })
    
    likesButtonEl.hasEventListener = true
        
    deleteButtonEl.addEventListener("click", function() {
        let deleteButton = deleteButtonEl
        let exactLocationOfItemInDB = ref(database, `endorsementsList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
        
    if (itemValue.likesButtonVal === "on") {
        likesButtonEl.style.color = "red";
    } else {
        likesButtonEl.style.color = "black";
    }    
        
    likesButtonEl.addEventListener("click", function() {
        
        let exactLocationOfItemInDB = ref(database, `endorsementsList/${itemID}`)
        let currentLikeCounter = itemValue.likesCounter 
        
        if (itemValue.likesButtonVal === "off") {
            
            update(exactLocationOfItemInDB, { likesButtonVal: "on" })
            likesButtonEl.style.color = "red"
            
            currentLikeCounter++
            update(exactLocationOfItemInDB, { likesCounter: currentLikeCounter })
            
        } else if (itemValue.likesButtonVal === "on") {
            
            update(exactLocationOfItemInDB, { likesButtonVal: "off" })
            likesButtonEl.style.color = "black"
            
            currentLikeCounter--
            update(exactLocationOfItemInDB, { likesCounter: currentLikeCounter })
        }
        
    })
    
    newEl.addEventListener("mouseout", function() {
        let deleteButton = newEl.querySelector("ul li #delete-li")
        deleteButton.style.display = "none"
    }) 
    
    endorsementsList.prepend(newEl)
}
