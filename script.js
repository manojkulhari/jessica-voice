const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

const button = document.getElementById('speak');
const transcriptDiv = document.getElementById('transcript');
const responseDiv = document.getElementById('response');

// Simulated session ID (unique per tab load)
const sessionId = Date.now().toString();

button.addEventListener('click', () => {
  recognition.start();
});

recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript;
  transcriptDiv.textContent = `You: ${transcript}`;

  fetch('https://jessica-mayo.onrender.com/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: transcript, sessionId })
  })
    .then(response => response.json())
    .then(data => {
      const reply = data.reply || "Sorry, I didn't understand that.";
      responseDiv.textContent = `Jessica: ${reply}`;
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
