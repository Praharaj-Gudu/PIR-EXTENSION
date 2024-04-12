// Variable to keep track of whether the data is unlocked or not
let isUnlocked = false;

// Function to unlock the data with the entered password
function unlockData() {
  const password = document.getElementById("passwordInput").value.trim();
  if (!password) {
    alert("Please enter your password to unlock.");
    return;
  }

  chrome.storage.sync.get("password", (data) => {
    const savedPassword = data.password;
    if (savedPassword && savedPassword === password) {
      isUnlocked = true;
      updateDisplay();
      alert("Bingo Data unlocked!");
    } else {
      alert("Imposter, Invalid password.");
    }
  });
}

// Function to set the password in Chrome storage
function setPassword() {
  chrome.storage.sync.get("password", (data) => {
    const savedPassword = data.password;
    if (!savedPassword) {
      const defaultPassword = "0000"; // Set the default password here
      chrome.storage.sync.set({ password: defaultPassword }, () => {
        isUnlocked = true;
        updateDisplay();
        alert(
          "Password set successfully! You can now access your personal information."
        );
      });
    } else {
      const newPassword = prompt("Set a password for your data:");
      if (newPassword) {
        const confirmPassword = prompt("Confirm your password:");
        if (newPassword === confirmPassword) {
          chrome.storage.sync.set({ password: newPassword }, () => {
            isUnlocked = true;
            updateDisplay();
            alert(
              "Password set successfully! You can now access your personal information."
            );
          });
        } else {
          alert("Passwords do not match. Please try again.");
        }
      } else {
        alert("Password not set. Data will remain locked.");
      }
    }
  });
}

// Function to change the password in Chrome storage
function changePassword() {
  const oldPassword = prompt("Enter your current password:");
  if (oldPassword) {
    chrome.storage.sync.get("password", (data) => {
      const savedPassword = data.password;
      if (savedPassword && savedPassword === oldPassword) {
        const newPassword = prompt("Enter your new password:");
        if (newPassword) {
          chrome.storage.sync.set({ password: newPassword }, () => {
            alert("Password changed successfully!");
          });
        } else {
          alert("Password not changed. Please try again.");
        }
      } else {
        alert("Incorrect password. Please try again.");
      }
    });
  } else {
    alert("Password not changed. Please try again.");
  }
}

// Function to reset the password and clear stored data
function resetPasswordAndData() {
  if (
    confirm(
      "Are you sure you want to reset your password? This action will erase all your stored data and cannot be undone."
    )
  ) {
    chrome.storage.sync.remove(["password", "userInfo"], () => {
      alert("Password and stored data have been reset.");
      setPassword(); // Prompt the user to set a new password
    });
  }
}

// Event listener to reset the password and clear stored data
document
  .getElementById("resetPasswordBtn")
  .addEventListener("click", resetPasswordAndData);

// Function to display the personal information when unlocked
function displayUnlocked() {
  document.getElementById("infoForm").style.display = "block";
  document.getElementById("setPasswordBtn").style.display = "none";
  document.getElementById("changePasswordBtn").style.display = "inline-block";
  document.getElementById("unlockBtn").style.display = "none";
  document.getElementById("lockedMessage").style.display = "none";
}

// Function to display the locked message when data is locked
function displayLocked() {
  document.getElementById("infoForm").style.display = "none";
  document.getElementById("setPasswordBtn").style.display = "none";
  document.getElementById("changePasswordBtn").style.display = "none";
  document.getElementById("unlockBtn").style.display = "inline-block";
  document.getElementById("lockedMessage").style.display = "block";
}

// Update the display based on the isUnlocked flag
function updateDisplay() {
  if (isUnlocked) {
    displayUnlocked();
  } else {
    displayLocked();
  }
}

// Call updateDisplay when the popup is loaded
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("password", (data) => {
    const savedPassword = data.password;
    if (!savedPassword) {
      document.getElementById("setPasswordBtn").style.display = "none";
    }
    updateDisplay();
  });
});

// Event listener to unlock the data
document.getElementById("unlockBtn").addEventListener("click", unlockData);

// Event listener to set the password
document
  .getElementById("setPasswordBtn")
  .addEventListener("click", setPassword);

// Event listener to change the password
document
  .getElementById("changePasswordBtn")
  .addEventListener("click", changePassword);

// Function to save the user's personal information to Chrome storage
function saveInfo() {
  if (!isUnlocked) {
    alert("Please unlock the data before saving.");
    return;
  }

  const githubLink = document.getElementById("githubLink").value;
  const resumeLink = document.getElementById("resumeLink").value;
  const linkedinProfile = document.getElementById("linkedinProfile").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const driveLink = document.getElementById("driveLink").value;

  const userInfo = {
    githubLink,
    resumeLink,
    linkedinProfile,
    email,
    phone,
    driveLink,
  };

  chrome.storage.sync.set({ userInfo }, () => {
    alert("Personal information saved!");
  });
}

// Function to open the drive link in a new tab
function openDriveLink() {
  const driveLink = document.getElementById("driveLink").value;
  if (driveLink) {
    window.open(driveLink, "_blank");
  } else {
    alert("No drive link provided.");
  }
}

// Function to copy the individual information to the clipboard
function copyInfo(event) {
  const inputField = event.target.parentElement.querySelector("input");
  const infoText = inputField.value.trim();

  if (infoText) {
    // Create a temporary input element
    const tempInput = document.createElement("input");
    tempInput.type = "text";
    tempInput.value = infoText;
    document.body.appendChild(tempInput);

    // Select the text in the input field
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text to the clipboard
    document.execCommand("copy");

    // Remove the temporary input
    document.body.removeChild(tempInput);

    alert(`${inputField.placeholder} copied to clipboard!`);
  } else {
    alert("Please enter valid information before copying.");
  }
}

// Add event listener to each copy icon
const copyIcons = document.querySelectorAll(".copy-icon");
copyIcons.forEach((icon) => {
  icon.addEventListener("click", copyInfo);
});

// Function to display the saved personal information
function displayInfo() {
  chrome.storage.sync.get("userInfo", (data) => {
    const userInfo = data.userInfo;
    if (userInfo) {
      document.getElementById("githubLink").value = userInfo.githubLink || "";
      document.getElementById("resumeLink").value = userInfo.resumeLink || "";
      document.getElementById("linkedinProfile").value =
        userInfo.linkedinProfile || "";
      document.getElementById("email").value = userInfo.email || "";
      document.getElementById("phone").value = userInfo.phone || "";
    }
  });
}

// Call displayInfo when the popup is loaded
document.addEventListener("DOMContentLoaded", displayInfo);

// Event listener to save the personal information
document.getElementById("saveBtn").addEventListener("click", saveInfo);

// Event listener to open the drive link in a new tab
document.getElementById("driveLink").addEventListener("click", openDriveLink);

// Event listener for Enter key press on password input field
document
  .getElementById("passwordInput")
  .addEventListener("keyup", function (event) {
    // Check if Enter key is pressed (key code 13)
    if (event.key === "Enter") {
      // Call the unlockData function when Enter key is pressed
      unlockData();
    }
  });
