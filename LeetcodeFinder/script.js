document.getElementById('searchBtn').addEventListener('click', getLeetCodeUser);

async function getLeetCodeUser() {
  const username = document.getElementById('username').value.trim();
  const resultBox = document.getElementById('result');
  resultBox.innerHTML = '';

  if (!username) {
    resultBox.innerHTML = '<p class="error">Please enter a username!</p>';
    return;
  }

  try {
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);

    if (!response.ok) {
      throw new Error('User not found');
    }

    const data = await response.json();

    if (data.status === 'error') {
      resultBox.innerHTML = `<p class="error">User not found!</p>`;
      return;
    }

    resultBox.innerHTML = `
      <div class="profile">
        <h2>${username}</h2>
        <p><strong>Ranking:</strong> ${data.ranking}</p>
        <p><strong>Total Solved:</strong> ${data.totalSolved}</p>
        <p><strong>Easy Solved:</strong> ${data.easySolved}</p>
        <p><strong>Medium Solved:</strong> ${data.mediumSolved}</p>
        <p><strong>Hard Solved:</strong> ${data.hardSolved}</p>
        <p><strong>Acceptance Rate:</strong> ${data.acceptanceRate}%</p>
        <p><strong>Contribution Points:</strong> ${data.contributionPoints}</p>
      </div>
    `;
  } catch (error) {
    resultBox.innerHTML = `<p class="error">❌ Could not fetch user data.</p>`;
  }
}
