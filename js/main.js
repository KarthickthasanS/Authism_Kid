const objects = document.querySelectorAll(".object-container img");
const images = document.querySelectorAll(".image-container");

objects.forEach((object) => {
  object.addEventListener("dragstart", dragStart);
});

images.forEach((image) => {
  image.addEventListener("dragover", dragOver);
  image.addEventListener("drop", drop);
});

function dragStart(e) {
  const animal = e.target.dataset.animal;
  console.log("Drag started:", animal);
  e.dataTransfer.setData("text/plain", animal);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const draggedAnimal = e.dataTransfer.getData("text/plain");
  const dropzone = e.target.closest(".image-container");

  if (!dropzone) {
    console.error("Drop zone not found");
    return;
  }

  const targetAnimal = dropzone.dataset.animal;

  console.log("Dropped:", draggedAnimal, "onto", targetAnimal);

  if (draggedAnimal === targetAnimal) {
    const draggableElement = document.querySelector(
      `.object-container img[data-animal="${draggedAnimal}"]`
    );

    if (!draggableElement) {
      console.error("Draggable element not found");
      return;
    }

    dropzone.style.border = "4px solid green";
    draggableElement.parentElement.style.display = "none";

    playSound(draggedAnimal).then(() => {
      const successMessage = document.createElement("div");
      successMessage.textContent = "Great job! You found a match!";
      successMessage.className = "success-message";
      dropzone.appendChild(successMessage);

      showName(draggedAnimal, dropzone);
    });
  } else {
    console.log("Mismatch:", draggedAnimal, "!==", targetAnimal);

    dropzone.style.border = "2px solid red";
    setTimeout(() => {
      dropzone.style.border = "2px dashed #ddd";
    }, 1000);
  }
}

function playSound(animal) {
  return new Promise((resolve, reject) => {
    const sound = document.getElementById(`${animal}-sound`);
    if (sound) {
      console.log("Playing sound for:", animal);
      sound
        .play()
        .then(() => {
          sound.addEventListener("ended", resolve);
        })
        .catch((e) => {
          console.error("Error playing sound:", e);
          reject(e);
        });
    } else {
      console.error("Sound not found for:", animal);
      reject("Sound not found");
    }
  });
}

function showName(animal, container) {
  console.log("Showing name for:", animal);
  const nameElement = document.createElement("div");
  nameElement.textContent = animal.charAt(0).toUpperCase() + animal.slice(1);
  nameElement.className = "animal-name";
  container.appendChild(nameElement);
}
