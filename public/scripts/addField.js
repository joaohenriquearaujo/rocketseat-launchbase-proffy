// 1. Search for the button
document
  .querySelector("#add-time")

  // 2. When the button is clicked
  .addEventListener("click", cloneField);

// 3. Execute an action
function cloneField() {
  // 3.1 Duplicating the fields. Which fields?
  const newFieldContainer = document.querySelector(".schedule-item").cloneNode(true);

  // 3.2 Cleaning field values
  const fields = newFieldContainer.querySelectorAll("input");

  // 3.3 For each field, clean.
  fields.forEach(function (currentField) {
    // 3.3.1 Get current field and clean it
    currentField.value = "";
  });

  // 3.4 Adding the new field in the page.
  document.querySelector("#schedule-items").appendChild(newFieldContainer);
}
