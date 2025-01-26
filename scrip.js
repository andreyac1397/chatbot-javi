const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
// Aquí debes insertar tu API Key obtenida desde OpenAI, justo donde están las comillas
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Crear un elemento de chat <Li> con el mensaje pasado y el nombre de clase
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Puedes cambiar este modelo a GPT-4 si lo prefieres
            messages: [{ role: "user", content: userMessage }]
        })
    };

    // Enviar solicitud POST a la API, obtener respuesta
    fetch(API_URL, requestOptions)
        .then((res) => res.json())
        .then((data) => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement.classList.add("error");
            messageElement.textContent = "Ooop!, Parece que algo salio mal, intentalo de nuevo.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Adjuntar el mensaje del usuario al cuadro
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Mostrar el mensaje "Pensando..." mientras espera la respuesta
        const incomingChatLi = createChatLi("Pensando...", "entrante");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Utilizar el enter como ingreso de input
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

