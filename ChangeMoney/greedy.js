const addEditBtn = document.getElementById("addEditBtn");
const findResult = document.getElementById("findResult");

// Initial Data
let tableEntries = []; // [{500:3}, {100:4}....]
let tableEnteriesCopy = [...tableEntries];

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
    
    let change = given - expense;

    let result = []; // store the result in this array

    //iterate over array
    for (let i = 0; i < tableEntries.length && change > 0; i++) {
      let amount = Number(Object.keys(tableEntries[i])[0]);

      // change is >= amount (note) AND no. of notes is > 0 => then only go inside if
      if (change >= amount && tableEntries[i][amount] > 0) {
        change -= amount; // minus the change with amount
        
        if (--tableEntries[i][amount] == 0) {
          tableEntries.splice(i, 1);
        } // minus number of notes in array

        let index = result.findIndex((i) => Object.keys(i)[0] == amount);

        if (index == -1) {
          const amountCount = {};
          amountCount[amount] = 1;
          result.push(amountCount);
        } else {
          result[index][amount]++;
        }

        //check same note again
        i--;
      }
    }

    if (change == 0) {
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