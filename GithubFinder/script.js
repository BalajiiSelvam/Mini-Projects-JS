const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('username');
const profileEl = document.getElementById('profile');
const reposEl = document.getElementById('repos');
const landingEl = document.getElementById('landing');
const backBtn = document.getElementById('backBtn');
const token = '';

function headers() {
  return token ? { Authorization: `token ${token}` } : {};
}

searchBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert('Please enter a GitHub username');
    return;
  }
  fetchUser(username);
});

backBtn.addEventListener('click', () => {
  resetUI();
});

async function fetchUser(username) {
  resetUI();
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, { headers: headers() });
    if (!res.ok) throw new Error('User not found');
    const user = await res.json();
    showProfile(user);
    await fetchRepos(username);
    landingEl.classList.add('hidden');
    backBtn.classList.remove('hidden');
  } catch (err) {
    alert(err.message);
  }
}

function showProfile(user) {
  profileEl.classList.remove('hidden');
  profileEl.innerHTML = `
    <div class="profile-box">
      <img src="${user.avatar_url}" alt="${user.login} avatar"/>
      <div class="profile-info">
        <h2>${user.name || user.login}</h2>
        <div class="bio">${user.bio || 'No bio available'}</div>
        <div class="profile-stats">
          <span><i class="fas fa-users"></i> Followers: ${user.followers}</span>
          <span><i class="fas fa-user-friends"></i> Following: ${user.following}</span>
          <span><i class="fas fa-code"></i> Public Repos: ${user.public_repos}</span>
        </div>
      </div>
    </div>
  `;
}

async function fetchRepos(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch repositories');
    const repos = await res.json();
    showRepos(username, repos);
  } catch (err) {
    alert(err.message);
  }
}

function showRepos(username, repos) {
  reposEl.classList.remove('hidden');
  if (!Array.isArray(repos) || repos.length === 0) {
    reposEl.innerHTML = `<div class="card glassy">No public repos</div>`;
    return;
  }
  const list = repos.map(r => `
    <div class="repo">
      <a href="${r.html_url}" target="_blank">${r.name}</a>
      <div class="repo-details">
        <span class="small"><i class="fas fa-star"></i> ${r.stargazers_count}</span>
        <button data-repo="${r.name}" data-owner="${username}"><i class="fas fa-chart-line"></i></button>
      </div>
      <div class="chart-container hidden" data-chart="${r.name}">
        <canvas id="commitChart-${r.name}"></canvas>
      </div>
    </div>
  `).join('');
  reposEl.innerHTML = `<div class="repo-list">${list}</div>`;
  reposEl.querySelectorAll('button[data-repo]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const repo = btn.dataset.repo;
      const owner = btn.dataset.owner;
      const chartContainer = reposEl.querySelector(`.chart-container[data-chart="${repo}"]`);
      const isHidden = chartContainer.classList.contains('hidden');
      btn.innerHTML = isHidden ? '<i class="fas fa-spinner fa-spin"></i>' : '<i class="fas fa-chart-line"></i>';
      if (isHidden) {
        try {
          await buildCommitGraph(owner, repo, chartContainer.querySelector('canvas'));
          btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
          chartContainer.classList.remove('hidden');
        } catch (err) {
          btn.innerHTML = '<i class="fas fa-chart-line"></i>';
          alert(err.message);
        }
      } else {
        chartContainer.classList.add('hidden');
        const canvas = chartContainer.querySelector('canvas');
        const chart = Chart.getChart(canvas);
        if (chart) chart.destroy();
      }
    });
  });

  // Initialize typing effect
  initTypingEffect();
}

function resetUI() {
  profileEl.classList.add('hidden');
  reposEl.classList.add('hidden');
  landingEl.classList.remove('hidden');
  backBtn.classList.add('hidden');
  reposEl.querySelectorAll('.chart-container').forEach(container => {
    const canvas = container.querySelector('canvas');
    const chart = Chart.getChart(canvas);
    if (chart) chart.destroy();
    container.classList.add('hidden');
  });
}

async function fetchAllCommits(owner, repo) {
  const commits = [];
  let url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`;
  try {
    while (url) {
      const res = await fetch(url, { headers: headers() });
      if (!res.ok) throw new Error('Failed to fetch commits (is the repo large or private?)');
      const part = await res.json();
      commits.push(...part);
      const link = res.headers.get('link');
      if (link) {
        const nextMatch = link.match(/<([^>]+)>;\s*rel="next"/);
        url = nextMatch ? nextMatch[1] : null;
      } else {
        url = null;
      }
      if (commits.length > 1000) break;
    }
    return commits;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function buildCommitGraph(owner, repo, canvas) {
  try {
    const commits = await fetchAllCommits(owner, repo);
    const counts = {};
    commits.forEach(c => {
      const dateStr = (c.commit && c.commit.author && c.commit.author.date) ? c.commit.author.date.split('T')[0] : null;
      if (dateStr) counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    const keys = Object.keys(counts).sort();
    const values = keys.map(k => counts[k]);
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: keys,
        datasets: [{
          label: 'Commits per Day',
          data: values,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent'),
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent') + '33',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { maxRotation: 45, minRotation: 45 },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border') }
          }
        },
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: { backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--card') }
        }
      }
    });
  } catch (err) {
    throw new Error('Error fetching commits: ' + err.message);
  }
}

function initTypingEffect() {
  const phrases = [
    'Find any account instantly',
    'Explore projects easily',
    'Track recent commits',
    'Discover GitHub profiles'
  ];
  let currentPhrase = 0;
  let isDeleting = false;
  let text = '';
  const typingSpeed = 80;
  const deletingSpeed = 40;
  const pauseTime = 1200;

  function type() {
    const typingText = document.getElementById('typing-text');
    const fullText = phrases[currentPhrase];

    if (!isDeleting) {
      text = fullText.substring(0, text.length + 1);
    } else {
      text = fullText.substring(0, text.length - 1);
    }

    typingText.textContent = text;
    typingText.style.borderRight = '2px solid var(--accent)';

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && text === fullText) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && text === '') {
      isDeleting = false;
      currentPhrase = (currentPhrase + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}