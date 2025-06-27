const btn = document.getElementById('start-btn');
const transcriptDiv = document.getElementById('transcript');
const responseDiv = document.getElementById('response');

const renderWebhookURL = "https://jessica-mayo.onrender.com/webhook";

const synth = window.speechSynthesis;

btn.onclick = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = async (event) => {
    const userSpeech = event.results[0][0].transcript;
    transcriptDiv.textContent = "You: " + userSpeech;

    const dialogflowRequest = {
      queryInput: {
        text: {
          text: userSpeech,
          languageCode: "en-US"
        }
      }
    };

    const res = await fetch(renderWebhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dialogflowRequest)
    });

    const data = await res.json();
    const botReply = data.fulfillmentText || "Sorry, I didn't get that.";
    responseDiv.textContent = "Jessica: " + botReply;

    const utter = new SpeechSynthesisUtterance(botReply);
    synth.speak(utter);
  };

  recognition.onerror = (e) => {
    transcriptDiv.textContent = "Error: " + e.error;
  };
};
