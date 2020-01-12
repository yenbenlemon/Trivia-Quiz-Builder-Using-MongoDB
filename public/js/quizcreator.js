// Get text boxes
let nameBox = document.getElementById("nameBox");
let tagBox  = document.getElementById("tagBox");

// Get buttons
let submitBtn = document.getElementById("submitBtn");

// Get Drop-dropdowns
let diffSelect = document.getElementById("diffSelect");
let catSelect = document.getElementById("catSelect");

// Get divs
let selectDiv = document.getElementById("selectDiv");
let searchDiv = document.getElementById("searchDiv");
let resultDiv = document.getElementById("resultDiv");

// Arrays for selected and searched questions
let selectArr = [];
let searchArr = [];

// Initialize our dropdowns
function initialize()
{
  let req = new XMLHttpRequest();
  req.onreadystatechange = () =>
  {
    if(req.readyState==4)
    {
      // Grab our response values
      let jObj = JSON.parse(req.responseText);

      // For each difficulty
      jObj.difficulties.forEach((diff) =>
      {
        // Add the difficulty
        let option = document.createElement("option");
        option.text = diff;
        diffSelect.add(option);
      });

      // For each category
      jObj.categories.forEach((cat)   =>
      {
        // Add the category
        let option = document.createElement("option");
        option.text = cat;
        catSelect.add(option);
      });
    }
  }

  // Request our search criteria options
  req.open("GET", "http://localhost:3000/criteria");
  req.send();

  // Initial search with no criteria
  search();
}

function search()
{
  let url   = "http://localhost:3000/questions?"
  let dText = diffSelect.options[diffSelect.selectedIndex].text;
  let cText = catSelect.options[catSelect.selectedIndex].text;

  // If we need to use searchc riteria, append our url
  if(dText != "None") { url += "difficulty=" + dText; }
  if(cText != "None") { url += "&category="  + encodeURIComponent(cText); }

  let req = new XMLHttpRequest();
  req.onreadystatechange = () =>
  {
    if(req.readyState==4)
    {
      // Populate our search array with questions
      searchArr = JSON.parse(req.responseText);
      populateSearch();
    }
  }

  // Request our question
  req.open("GET", url);
  req.setRequestHeader('Accept', 'application/json');
  req.send();
}

function populateSearch()
{
  // Clear the results section
  resultDiv.innerHTML = "";

  searchArr.forEach((searchQ) =>
  {
    let selected = false;
    let url = "http://localhost:3000/questions/"

    // See if we already have the question selected
    selectArr.forEach((selectQ) => { if(selectQ._id === searchQ._id) { selected = true; } });

    if(!selected)
    {
      // Set a label and a link element
      let label  = document.createElement('label'),
          addBtn = document.createElement('button'),
          link   = document.createElement('a'),
          txt    = document.createTextNode("      ");

      // Set up our button for adding to the selected questions
      addBtn.innerHTML = 'Add';
      addBtn.onclick = () =>
      {
        // Add the searched question to our selection array and refresh our lists
        selectArr.push(searchQ);
        populateSelect();
        search();
      }

      // Set our url and make it open in a new window
      link.setAttribute('href', url + searchQ._id);
      link.setAttribute('target', '_blank');

      // Set text for the url
      link.innerHTML = html_unescape(searchQ.question);

      // Append everything to our results DIV
      label.appendChild(addBtn);
      label.appendChild(txt);
      label.appendChild(link);
      label.appendChild(document.createElement('br'));
      label.appendChild(document.createElement('br'));
      resultDiv.appendChild(label);
    }
  });
}

function populateSelect()
{
  selectDiv.innerHTML = "";

  let url = "http://localhost:3000/questions/"

  selectArr.forEach((selectQ) =>
  {
    // Set a label and a link element
    let label     = document.createElement('label'),
        removeBtn = document.createElement('button'),
        link      = document.createElement('a'),
        txt       = document.createTextNode("      ");

    // Set up our button for adding to the selected questions
    removeBtn.innerHTML = 'Remove';
    removeBtn.onclick = () =>
    {
      // Remove the question from our selection array and refresh our lists
      let index = selectArr.indexOf(selectQ);
      selectArr.splice(index, 1);
      populateSelect();
      search();
    }

    // Set our url and make it open in a new window
    link.setAttribute('href', url + selectQ._id);
    link.setAttribute('target', '_blank');

    // Set text for the url
    link.innerHTML = html_unescape(selectQ.question);

    // Append everything to our results DIV
    label.appendChild(removeBtn);
    label.appendChild(txt);
    label.appendChild(link);
    label.appendChild(document.createElement('br'));
    label.appendChild(document.createElement('br'));
    selectDiv.appendChild(label);
  });
}

function saveQuiz()
{
  let url = "http://localhost:3000/quizzes";

  // If the name box is not empty
  if(nameBox.value.trim().length > 0)
  {
    if(tagBox.value.trim().length > 0)
    {
      if(selectArr.length > 0)
      {
        // Set tags as an array and create our json object to send
        let tagArr = tagBox.value.split(" ");
        let jObj = {_id: "", creator: nameBox.value, tags: tagArr, questions: selectArr};

        let req = new XMLHttpRequest();
        req.onreadystatechange = () =>
        {
          // Redirect the user to the created quiz
          if(req.readyState==4 && req.status == 200) { window.location.assign(req.responseText) }
        }

        // POST our quiz
        req.open("POST", url);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(jObj));
      }
      else { alert("You need to add at least one question."); }
    }
    else { alert("You need to add at least one tag.") }
  }
  else { alert("You need to add a name, dummy.") }
}

// Generic function used for removing encoding from html
function html_unescape(s)
{
  var div = document.createElement("div");
  div.innerHTML = s;
  return div.textContent || div.innerText;
}
