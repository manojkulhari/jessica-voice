const button = document.getElementById('speakBtn');
const transcriptBox = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

button.addEventListener('click', () => {
  recognition.start();
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  transcriptBox.textContent = `You: ${transcript}`;

  try {
    const response = await fetch('https://jessica-mayo.onrender.com/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        queryInput: {
          text: {
            text: transcript,
            languageCode: 'en-US'
          }
        }
      })
    });

    const data = await response.json();
    const reply = data.fulfillmentText || 'Sorry, I didn\'t get that.';

    speak(reply);
  } catch (error) {
    speak('There was an error connecting to the server.');
  }
};

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}
