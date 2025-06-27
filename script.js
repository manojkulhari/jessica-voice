const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

const button = document.getElementById('speak');
const userText = document.getElementById('user-text');

button.addEventListener('click', () => {
  recognition.start();
});

recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript;
  userText.textContent = `You: ${transcript}`;

  fetch('https://jessica-mayo.onrender.com/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: transcript })
  })
  .then(response => response.json())
  .then(data => {
    const reply = data.reply || "Sorry, I didn't understand that.";
    speak(reply);
  })
  .catch(error => {
    console.error('Fetch error:', error);
    speak("Something went wrong while connecting to the server.");
  });
};

function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}
