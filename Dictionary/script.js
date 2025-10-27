document.getElementById('searchBtn').addEventListener('click', searchWord);

async function searchWord() {
  const word = document.getElementById('wordInput').value.trim();
  const result = document.getElementById('result');
  result.innerHTML = '';

  if (!word) {
    result.innerHTML = '<p class="error">⚠️ Please enter a word!</p>';
    return;
  }

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (!res.ok) {
      throw new Error('Word not found');
    }

    const data = await res.json();
    const meaning = data[0].meanings[0].definitions[0].definition;
    const phonetic = data[0].phonetic || data[0].phonetics[0]?.text || '';
    const audio = data[0].phonetics[0]?.audio || '';

    result.innerHTML = `
      <div class="word">
        <h2>${word}</h2>
        ${audio ? `<span class="audio" onclick="playAudio('${audio}')">🔊</span>` : ''}
      </div>
      <p><strong>Phonetic:</strong> ${phonetic || 'N/A'}</p>
      <p><strong>Meaning:</strong> ${meaning}</p>
    `;
  } catch (error) {
    result.innerHTML = `<p class="error">❌ Word not found!</p>`;
  }
}

function playAudio(url) {
  const audio = new Audio(url);
  audio.play();
}
