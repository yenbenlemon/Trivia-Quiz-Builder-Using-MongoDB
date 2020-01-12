Instructions: ======================================

1. Run "npm install" in the project directory
  1a. Express will install
  1b. MongoDB will install
  1c. Pug will install

2. Run "node database-initializer.js"

3. Navigate to "http://localhost:3000/questions" in your browser
  3a. All questions and their data will be listed
  3b. Only a maximum of 25 will be listed
  3c. You can edit the accept header to test JSON and HTML (defaults to HTML)
  3d. Uses the questions.pug template for html
  3e. Queries are "category" and "difficulty"

4. Click one of the question links
  4a. You will be taken to the specific page of the question in the same window/tab
  4b. If you edit the ID in the url tp an incorrect ID, you will get a 404 message

5. Navigate to "http://localhost:3000/createquiz" in your browser
  5a. Creator name and Tag boxes exist
  5b. There is a Current Questions Div and a Search DIV
  5c. The page will do an initial search for 25 Questions
  5d. Requires Name, tags, and at least one question, will produce a specific alert otherwise
  5e. Selecting an drop-down option will re-run the search with the proper parameters
  5f. Adding a questions will add it to the Currents questions and remove it from the search
  5g. Removing a question will add it back to the search pool
  5h. Drop-downs are dynamically generated
  5i. Tags are added to an array, separated by spaces
  5j. Creating a quiz alerts the user with the quiz ID
  5k. Question links open in new window/tab
  5l. Saving a quiz will generate a link
  5m. Clicking the link will open the quiz in a new window/tab (might need to refresh it)

6. Navigate to "http://localhost:3000/quizzes" in your browser
  6a. All quizzes are listed here as links with creator name and all Tags
  6b. Queries are "name" and "tag"
  6c. name is partial matching with case-insensitivity
  6d. tag is full matching with case-insensitivity

7. Click one of the quiz links
  7a. Quiz details are listed as are all quiz questions as links
  7b. Links lead to the questions page based on ID
