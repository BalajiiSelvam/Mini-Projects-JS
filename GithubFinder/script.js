// script.js
const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('username');
const profileEl = document.getElementById('profile');
const reposEl = document.getElementById('repos');
const commitGraphEl = document.getElementById('commitGraph');
const ctx = document.getElementById('commitChart').getContext('2d');
let commitChart = null;

// Optional: If you have a GitHub Personal Access Token (PAT) to raise rate limit, put it here.
// If not, leave token = ''.
const token = ''; // <-- OPTIONAL: 'ghp_xxx...'

function headers() {
  return token ? { Authorization: `token ${token}` } : {};
}

searchBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (!username) return alert('Enter username');
  fetchUser(username);
});

async function fetchUser(username) {
  resetUI();
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, { headers: headers() });
    if (!res.ok) throw new Error('User not found');
    const user = await res.json();
    showProfile(user);
    fetchRepos(username);
  } catch (err) {
    alert(err.message);
  }
}

function showProfile(user) {
  profileEl.classList.remove('hidden');
  profileEl.innerHTML = `
    <div style="display:flex;gap:12px;align-items:center">
      <img src="${user.avatar_url}" width="80" height="80" style="border-radius:8px"/>
      <div>
        <h2 style="margin:0">${user.name || user.login}</h2>
        <div class="small">${user.bio || ''}</div>
        <div class="small">Followers: ${user.followers} • Following: ${user.following} • Public repos: ${user.public_repos}</div>
        <div class="small">Location: ${user.location || '—'}</div>
      </div>
    </div>
  `;
}

async function fetchRepos(username) {
  // fetch public repos sorted by updated date (desc)
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers: headers() });
  const repos = await res.json();
  showRepos(username, repos);
}

function showRepos(username, repos) {
  reposEl.classList.remove('hidden');
  if (!Array.isArray(repos) || repos.length === 0) {
    reposEl.innerHTML = `<div class="card">No public repos</div>`;
    return;
  }
  const list = repos.map(r => `
    <div class="repo">
      <div>
        <a href="${r.html_url}" target="_blank">${r.name}</a>
        <div class="small">${r.description || ''}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span class="small">★ ${r.stargazers_count}</span>
        <button data-repo="${r.name}" data-owner="${username}">Show Commits</button>
      </div>
    </div>
  `).join('');
  reposEl.innerHTML = `<div class="repo-list">${list}</div>`;
  // add click handlers for commit buttons
  reposEl.querySelectorAll('button[data-repo]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const repo = btn.dataset.repo;
      const owner = btn.dataset.owner;
      btn.textContent = 'Loading...';
      await buildCommitGraph(owner, repo);
      btn.textContent = 'Show Commits';
    });
  });
}

function resetUI() {
  profileEl.classList.add('hidden');
  reposEl.classList.add('hidden');
  commitGraphEl.classList.add('hidden');
  if (commitChart) {
    commitChart.destroy();
    commitChart = null;
  }
}

// Fetch all commits via pagination (may be slow for huge repos)
// We'll request per_page=100 and follow Link header
async function fetchAllCommits(owner, repo) {
  const commits = [];
  let url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`;
  while (url) {
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch commits (is the repo large or private?)');
    const part = await res.json();
    commits.push(...part);
    // parse Link header
    const link = res.headers.get('link');
    if (link) {
      const nextMatch = link.match(/<([^>]+)>;\s*rel="next"/);
      url = nextMatch ? nextMatch[1] : null;
    } else {
      url = null;
    }
    // safety: don't fetch more than 10 pages (1000 commits) by default
    if (commits.length > 1000) break;
  }
  return commits;
}

async function buildCommitGraph(owner, repo) {
  commitGraphEl.classList.remove('hidden');
  commitGraphEl.querySelector('h3').textContent = `Commits per day: ${owner}/${repo}`;
  try {
    const commits = await fetchAllCommits(owner, repo);
    // commit.author may be null (e.g., if commit author is not linked) — fallback to commit.commit.author
    const counts = {};
    commits.forEach(c => {
      const dateStr = (c.commit && c.commit.author && c.commit.author.date) ? c.commit.author.date.split('T')[0] : null;
      if (dateStr) counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    const keys = Object.keys(counts).sort(); // ascending dates
    const values = keys.map(k => counts[k]);
    if (commitChart) commitChart.destroy();
    commitChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: keys,
        datasets: [{
          label: 'Commits per day',
          data: values,
          borderWidth: 0
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { maxRotation: 90, minRotation: 45 } }
        }
      }
    });
  } catch (err) {
    alert('Error fetching commits: ' + err.message);
  }
}
