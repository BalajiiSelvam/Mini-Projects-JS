async function searchUser() {
  const username = document.getElementById("username").value.trim();
  const resultDiv = document.getElementById("result");

  if (!username) {
    resultDiv.innerHTML = "<p>Please enter a username!</p>";
    return;
  }

  resultDiv.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`http://localhost:5000/leetcode/${username}`);
    const data = await res.json();

    if (data.error) {
      resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
      return;
    }

    resultDiv.innerHTML = `
      <h3>${data.name || username}</h3>
      <p>Ranking: ${data.ranking}</p>
      <p>Total Solved: ${data.totalSolved}</p>
      <p>Easy: ${data.easySolved}/${data.totalEasy}</p>
      <p>Medium: ${data.mediumSolved}/${data.totalMedium}</p>
      <p>Hard: ${data.hardSolved}/${data.totalHard}</p>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p>Server Error: ${error.message}</p>`;
  }
}
