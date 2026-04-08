let prompt = document.querySelector("#prompt");
let container = document.querySelector(".container");
let btn = document.querySelector("#btn");
let chatContainer = document.querySelector(".chat-container")
let userMessage = null;
let Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY";

function createChatBox(html,className){
    let div = document.createElement("div");
    div.classList.add(className)
    div.innerHTML = html
    return div
}

async function getApiResponse(aiChatBox) {
    const textElement = aiChatBox.querySelector(".text");
    const loadingImg = aiChatBox.querySelector(".loading");

    try {
        let response = await fetch(Api_Url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMessage }]
                }]
            })
        });

        // 1. Check if the network request itself was successful
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        let data = await response.json();

        // 2. Use optional chaining to safely access deep properties
        // Some errors (like safety blocks) can result in empty candidates
        const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (apiResponse) {
            textElement.innerHTML = apiResponse;
        } else {
            textElement.innerHTML = "Sorry, I couldn't generate a response. Please try again.";
            console.warn("Unexpected API structure:", data);
        }

    } catch (error) {
        // 3. Handle 503 or other network errors gracefully in the UI
        console.error("Fetch Error:", error);
        textElement.innerHTML = "The service is currently overloaded (503). Please wait a moment and try again.";
    } finally {
        // Always remove the loading indicator regardless of success/fail
        if (loadingImg) loadingImg.remove();
    }
}


function showLoading(){
    let html = `<div class="img">
                <img src="ai.jpg" alt="" width="50" style="border-radius: 30px;">
            </div>
            <p class="text"></p>
            <img class="loading" src="loading.gif" alt="loading" height="50" style="border-radius: 30px;">`
            let aiChatBox = createChatBox(html,"ai-chat-box")
            chatContainer.appendChild(aiChatBox);
            getApiResponse(aiChatBox)
}

btn.addEventListener("click",()=>{
    userMessage = prompt.value;
    if(userMessage==""){
        container.style.display="flex";
    }{
        container.style.display="none";
    }
    if(!userMessage) return;
    let html = `<div class="img">
                <img src="user.png" alt="" width="50" style="border-radius: 30px"> 
            </div>
            <p class="text"></p>`;
    let userChatBox = createChatBox(html,"user-chat-box")
    userChatBox.querySelector(".text").innerHTML = userMessage
    chatContainer.appendChild(userChatBox);
    prompt.value = ""
    setTimeout(showLoading,500)

})