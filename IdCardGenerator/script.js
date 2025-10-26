function generateCard() {
  const name = document.getElementById('name').value;
  const dept = document.getElementById('dept').value;
  const roll = document.getElementById('roll').value;
  const dob = document.getElementById('dob').value;
  const imageInput = document.getElementById('image');

  if (!name || !dept || !roll || !dob || !imageInput.files[0]) {
    alert("Please fill all details!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('profilePic').src = e.target.result;
  };
  reader.readAsDataURL(imageInput.files[0]);

  document.getElementById('displayName').textContent = name;
  document.getElementById('displayDept').textContent = dept;
  document.getElementById('displayRoll').textContent = "Roll No: " + roll;

  document.getElementById('idCard').style.display = 'block';
}
