// Initial Data
let tableEntries = []; // [{500:3}, {100:4}....]

//Added Data into tableEnteries
function addData(e) {
  let currency = Number(document.getElementById("currency").value);
  let numNotes = Number(document.getElementById("numNotes").value);

  // check for currency and numNotes
  if (currency == NaN || numNotes == NaN) {
    return alert("Invalid input for currency or numNotes");
  }
  if (currency <= 0 || numNotes <= 0) {
    return alert("currency or numNotes cannot be negative or Empty");
  }

  const noteCount = {};
  noteCount[currency] = Number(numNotes);

  if (e.target.dataset["type"] == "edit") {
    // get index of row in table to be deleted
    let index = Number(e.target.dataset["index"]);

    // remove the element at index from tableEnteries
    tableEntries.splice(index, 1);

    // rename the edit button to add
    e.target.innerHTML = "Add";
    e.target.dataset["type"] = "add";

    // provide addEditBtn with data-index = -1
    e.target.dataset["index"] = -1;
  }

  // add the new note and no. of notes to tableEnteries
  tableEntries.push(noteCount);

  // sort tableEntries
  tableEntries.sort((a, b) => Object.keys(b)[0] - Object.keys(a)[0]);

  // update the ui table
  updateUITable();
}

function updateUITable() {
  // get the tBody of tableEntries
  let table = document.getElementById("table");
  let tBody = table.getElementsByTagName("tbody")[0];

  // clear tBody
  tBody.innerHTML = "";

  // populate tBody based on tableEntries structure
  for (let i = 0; i < tableEntries.length; i++) {
    // create a row
    let row = tBody.insertRow();

    // create 4 cell in above row => currency, notes, delete, update
    let cell0 = row.insertCell();
    let cell1 = row.insertCell();
    let cell2 = row.insertCell();
    let cell3 = row.insertCell();

    // now feed data inside each cell
    let note = Object.keys(tableEntries[i])[0];
    cell0.innerHTML = note;
    cell1.innerHTML = tableEntries[i][note];
    cell2.innerHTML = `<button class="delete" data-index=${i} onclick="deleteRowData(event)">Delete</button>`;
    cell2.classList.add("zoom");
    cell3.innerHTML = `<button class="edit" data-index=${i} onclick="editDataEntry(event);">Edit</button>`;
    cell3.classList.add("zoom");
  }

  // clear inputs field from ui
  document.getElementById("currency").value = "";
  document.getElementById("numNotes").value = "";
}

//Delete particular row
function deleteRowData(e) {
  // get index to be deleted
  let index = Number(e.target.dataset["index"]);

  // delete element at index from tableEntries
  tableEntries.splice(index, 1);

  // update table ui
  updateUITable();
}

//Edit Particular Row
function editDataEntry(e) {
  // get index to be updated
  let index = Number(e.target.dataset["index"]);

  // access the inputs
  let currencyInput = document.getElementById("currency");
  let numNotsInput = document.getElementById("numNotes");

  // tableEnteries mathi note and no. of notes lai ne inputs ma
  let note = Object.keys(tableEntries[index])[0];
  let numOfNote = tableEntries[index][note];

  // update the ui (inputs)
  currencyInput.value = note;
  numNotsInput.value = numOfNote;

  // rename add button to edit button
  let addEditButton = document.getElementById("addEditBtn");
  addEditButton.innerHTML = "Edit";
  addEditButton.dataset["type"] = "edit";

  // provide edit button index of row to be edited
  addEditBtn.dataset["index"] = index;
}

//change Logic
function CalPayHandler(e) {
  const expense = Number(document.getElementById("expense").value);
  const given = Number(document.getElementById("give").value);

  if (given < expense) {
    document.getElementById("expense").value = "";
    document.getElementById("give").value = "";
    alert("You not give Full amount...");
    return;
  } else if (given === NaN || expense === NaN || given <= 0 || expense <= 0) {
    document.getElementById("expense").value = "";
    document.getElementById("give").value = "";
    alert("Please Enter Proper amounts");
    return;
  } else {
    let change = given - expense; // What value to return give
    let tableEnteriesCopy = JSON.parse(JSON.stringify(tableEntries)); // make copy of tableEntries
    let result = []; // store the main result in this array

    let minCount1 = Infinity; // store the minimum notes for all time.

    // brute force approach
    for (let i = 0; i < tableEntries.length; i++) {
      //outer loop

      // save the state of two arrays
      let tableEnteriesCopyState = JSON.parse(JSON.stringify(tableEntries));
      let resultState = [];
      let changeState = change;

      let minCount2 = 0;

      // check if note at index i <= change AND note.count >= 1
      let key = Number(Object.keys(tableEnteriesCopyState[i])[0]);
      let value = Number(tableEnteriesCopyState[i][key]);

      // jo aam thai to next iteration ma check karse
      if (key > changeState) {
        continue;
      }
      if (value <= 0) {
        continue;
      }

      let isDeleted = 0;
      if (--tableEnteriesCopyState[i][key] === 0) {
        isDeleted = 1;
        tableEnteriesCopyState.splice(i, 1); // jo koi note 0 thai to delete it
      }
      minCount2++;

      // check karo ke note(key), resultState ma peli thi to nathi?
      // if yes => then just increment noOfNotes(value) part
      // if no => create a NoteCount object with key and value=1
      let index = resultState.findIndex(
        (noteCount, k) => Number(Object.keys(noteCount)[0]) == key
      );
      if (index == -1) {
        // no
        const noteCount = {};
        noteCount[key] = 1;
        resultState.push(noteCount);
      } else {
        resultState[index][key]++;
      }

      changeState -= key; // amount minus kari changeState mathi.

      // iterate through inner loop
      for (let j = i; j < tableEnteriesCopyState.length; j++) {
        let keyInner = Number(Object.keys(tableEnteriesCopyState[j])[0]);
        let valueInner = Number(tableEnteriesCopyState[j][keyInner]);
        if (keyInner > changeState) {
          continue;
        }
        if (valueInner <= 0) {
          continue;
        }

        if (--tableEnteriesCopyState[j][keyInner] == 0) {
          tableEnteriesCopyState.splice(j, 1);
        }
        minCount2++;

        // check karo ke note(key), resultState ma peli thi to nathi?
        // if yes => then just increment noOfNotes(value) part
        // if no => create a NoteCount object with key and value=1
        let indexInner = resultState.findIndex(
          (noteCount, k) => Number(Object.keys(noteCount)[0]) == keyInner
        );
        if (indexInner == -1) {
          // no
          const noteCount = {};
          noteCount[keyInner] = 1;
          resultState.push(noteCount);
        } else {
          resultState[indexInner][keyInner]++;
        }
        changeState -= keyInner;  // amount minus kari changeState mathi.
        j--;  // pachi note check karo 
      }
      if (changeState == 0 && minCount2 < minCount1) {
        tableEnteriesCopy = JSON.parse(JSON.stringify(tableEnteriesCopyState));
        result = JSON.parse(JSON.stringify(resultState));
        minCount1 = minCount2;
      }
      console.log("minCOunt2: "+ minCount2);
    }
    console.log("tableEnteriesCopy:", tableEnteriesCopy);
    console.log("result:", result);
    console.log("minCount1:", minCount1);

    if (minCount1 != Infinity) {
      // update the tableEnteries array
      tableEntries = tableEnteriesCopy;
      const resultTable = document.getElementById("result");
      const resultTBody = resultTable.getElementsByTagName("tbody")[0];

      for (let i = 0; i < result.length; i++) {
        // create a row
        let row = resultTBody.insertRow();

        // create 2 cell in above row => currency, notes
        let cell0 = row.insertCell();
        let cell1 = row.insertCell();

        // now feed data inside each cell
        let note = Object.keys(result[i])[0];
        cell0.innerHTML = note;
        cell1.innerHTML = result[i][note];
      }
      updateUITable();
      // clear inputs field from ui
      document.getElementById("expense").value = "";
      document.getElementById("give").value = "";
    } else {
      alert("No Change Found");
      return;
    }
  }
}
addEditBtn.addEventListener("click", addData);
findResult.addEventListener("click", CalPayHandler);
