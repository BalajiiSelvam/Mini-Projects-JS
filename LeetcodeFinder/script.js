// Primary API: RESTful LeetCode Stats (CORS-enabled)
const PRIMARY_API = 'https://leetcode-restful-api.vercel.app/profile';

// Fallback: LeetCode GraphQL via public CORS proxy
const FALLBACK_PROXY = 'https://api.allorigins.win/raw?url=';
const GRAPHQL_URL = 'https://leetcode.com/graphql';

document.getElementById('searchBtn').addEventListener('click', searchUser);
document.getElementById('username').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchUser();
});

async function searchUser() {
  const username = document.getElementById('username').value.trim();
  const resultBox = document.getElementById('result');
  const btn = document.getElementById('searchBtn');

  resultBox.innerHTML = '';
  if (!username) {
    showError('Please enter a username!');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Loading...';
  resultBox.innerHTML = '<p class="loading">Fetching profile...</p>';

  try {
    // Try primary API first
    let data = await fetchPrimaryAPI(username);
    if (!data) {
      // Fallback to GraphQL via proxy
      data = await fetchGraphQL(username);
    }

    if (!data || data.status === 'error') {
      throw new Error('User not found');
    }

    displayProfile(data, username);
  } catch (err) {
    showError(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Search';
  }
}

async function fetchPrimaryAPI(username) {
  try {
    const response = await fetch(PRIMARY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchGraphQL(username) {
  const query = `
    query {
      matchedUser(username: "${username}") {
        username
        profile { ranking }
        userSlug
      }
      userProfileUserQuestionStats(userSlug: "${username}") {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userProfilePublicProfile(userSlug: "${username}") {
        contributionPoints
      }
    }
  `;

  const url = `${FALLBACK_PROXY}${encodeURIComponent(GRAPHQL_URL)}`;
  const body = { query };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) return null;
  const { data } = await response.json();

  if (!data?.matchedUser) return null;

  const stats = data.userProfileUserQuestionStats?.acSubmissionNum || [];
  const easy = stats.find(s => s.difficulty === 'EASY')?.count || 0;
  const medium = stats.find(s => s.difficulty === 'MEDIUM')?.count || 0;
  const hard = stats.find(s => s.difficulty === 'HARD')?.count || 0;
  const total = easy + medium + hard;
  const acceptanceRate = total > 0 ? Math.round((total / 2000) * 100) : 0; // Approx (LeetCode has ~2000 problems)

  return {
    username: data.matchedUser.username,
    ranking: data.matchedUser.profile?.ranking || 'N/A',
    totalSolved: total,
    easySolved: easy,
    mediumSolved: medium,
    hardSolved: hard,
    acceptanceRate,
    contributionPoints: data.userProfilePublicProfile?.contributionPoints || 0
  };
}

function displayProfile(data, fallbackUsername) {
  const resultBox = document.getElementById('result');
  const username = data.username || fallbackUsername;
  const ranking = typeof data.ranking === 'number' ? data.ranking.toLocaleString() : data.ranking;
  const acceptance = data.acceptanceRate ? `${data.acceptanceRate}%` : 'N/A';

  resultBox.innerHTML = `
    <div class="profile">
      <h2>@${username}</h2>
      <p><strong>Global Ranking:</strong> #${ranking}</p>
      <p><strong>Total Solved:</strong> ${data.totalSolved || 0}</p>
      <p><strong>Easy:</strong> ${data.easySolved || 0} | <strong>Medium:</strong> ${data.mediumSolved || 0} | <strong>Hard:</strong> ${data.hardSolved || 0}</p>
      <p><strong>Acceptance Rate:</strong> ${acceptance}</p>
      <p><strong>Contribution Points:</strong> ${data.contributionPoints || 0}</p>
    </div>
  `;
}

function showError(message) {
  document.getElementById('result').innerHTML = `<p class="error">❌ ${message}</p>`;
}