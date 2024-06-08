document.addEventListener("DOMContentLoaded", function () {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");
  const MAX_IMAGES = 5;
  const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

  // Function to handle drag over event
  dropzone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  // Function to handle drag leave event
  dropzone.addEventListener("dragleave", function () {
    dropzone.classList.remove("dragover");
  });

  // Function to handle drop event
  dropzone.addEventListener("drop", function (e) {
    e.preventDefault();
    dropzone.classList.remove("dragover");

    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  // Function to handle file input change event
  fileInput.addEventListener("change", function () {
    const files = fileInput.files;
    handleFiles(files);
  });

  // Function to handle files and display them
  function handleFiles(files) {
    if (files.length + fileList.children.length > MAX_IMAGES) {
      alert("Maximum images allowed is " + MAX_IMAGES);
      return;
    }

    [...files].forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert("File size exceeds 1 MB limit: " + file.name);
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed: " + file.name);
        return;
      }

      displayFile(file);
    });
  }

  // Function to display the uploaded file with description
  function displayFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const div = document.createElement("div");
      div.className = "file-name";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = file.name;
      img.className = "thumbnail";
      div.appendChild(img);

      const descriptionInput = document.createElement("textarea");
      descriptionInput.className = "description";
      descriptionInput.placeholder = "Enter description...";
      div.appendChild(descriptionInput);

      // Add check icon
      const checkIcon = document.createElement("i");
      checkIcon.className = "fas fa-check";
      checkIcon.style.color = "green";
      checkIcon.style.cursor = "pointer";
      checkIcon.addEventListener("click", () => {
        alert("Description has been added.");
        descriptionInput.disabled = true;
        updateLocalStorage();
      });
      div.appendChild(checkIcon);

      // Add delete icon
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash-alt";
      deleteIcon.style.color = "red";
      deleteIcon.style.cursor = "pointer";
      deleteIcon.addEventListener("click", () => {
        div.remove();
        updateLocalStorage();
      });
      div.appendChild(deleteIcon);

      fileList.appendChild(div);
      updateLocalStorage();
    };

    reader.readAsDataURL(file);
  }

  // Function to load data from localStorage
  function loadFromLocalStorage() {
    const storedImagesData = JSON.parse(
      localStorage.getItem("storedImagesData") || "[]"
    );
    console.log("Loaded from localStorage:", storedImagesData);
    storedImagesData.forEach((data) => {
      const div = document.createElement("div");
      div.className = "file-name";

      const img = document.createElement("img");
      img.src = data.src;
      img.className = "thumbnail";
      div.appendChild(img);

      const descriptionInput = document.createElement("textarea");
      descriptionInput.className = "description";
      descriptionInput.value = data.description;
      descriptionInput.disabled = true; // Disable input as it's loaded from localStorage
      div.appendChild(descriptionInput);

      // Add check icon
      const checkIcon = document.createElement("i");
      checkIcon.className = "fas fa-check";
      checkIcon.style.color = "green";
      checkIcon.style.cursor = "pointer";
      checkIcon.addEventListener("click", () => {
        alert("Description has been added.");
        descriptionInput.disabled = true;
        updateLocalStorage();
      });
      div.appendChild(checkIcon);

      // Add delete icon
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash-alt";
      deleteIcon.style.color = "red";
      deleteIcon.style.cursor = "pointer";
      deleteIcon.addEventListener("click", () => {
        div.remove();
        updateLocalStorage();
      });
      div.appendChild(deleteIcon);

      fileList.appendChild(div);
    });
  }

  // Function to update localStorage
  function updateLocalStorage() {
    const imagesData = [];
    fileList.childNodes.forEach((child) => {
      if (child.nodeType === 1) {
        const img = child.querySelector(".thumbnail");
        const description = child.querySelector(".description").value;
        imagesData.push({ src: img.src, description });
      }
    });
    localStorage.setItem("storedImagesData", JSON.stringify(imagesData));
  }

  // Load data from localStorage on page load
  loadFromLocalStorage();
});
