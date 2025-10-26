function generateCard() {
  const name = document.getElementById("name").value.trim();
  const dept = document.getElementById("dept").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const dob = document.getElementById("dob").value;
  const image = document.getElementById("image").files[0];
  const idCard = document.getElementById("idCard");

  if (!name || !dept || !roll || !dob || !image) {
    alert("Please fill all fields!");
    return;
  }

  // Update text fields
  document.getElementById("displayName").textContent = name;
  document.getElementById("displayRoll").textContent = roll;
  document.getElementById("displayDept").textContent = dept;

  // Load image
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("profilePic").src = e.target.result;
  };
  reader.readAsDataURL(image);

  // Show card
  idCard.classList.remove("hidden");
}
