window.onload = function () {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';

  const button = document.getElementById('speak');
  const userText = document.getElementById('user-text');
  const responseBox = document.getElementById('response');
  let isRecognizing = false;

  button.addEventListener('click', () => {
    if (!isRecognizing) {
      isRecognizing = true;
      button.disabled = true;
      recognition.start();
    }
  });

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    if (userText) {
      userText.textContent = `You: ${transcript}`;
    }

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
      if (responseBox) {
        responseBox.textContent = `Jessica: ${reply}`;
      }
      speak(reply);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      const errorMsg = "Something went wrong while connecting to the server.";
      if (responseBox) {
        responseBox.textContent = `Jessica: ${errorMsg}`;
      }
      speak(errorMsg);
    });
  };

  recognition.onend = function () {
    isRecognizing = false;
    button.disabled = false;
  };

  function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }
}
