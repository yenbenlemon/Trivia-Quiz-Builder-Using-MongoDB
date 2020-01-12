# Trivia-Quiz-Builder-Using-MongoDB

Updated: 1/10/2020

The following project requires an installation of **MongoDB** on your computer. You can download and install MongoDB from the following link: https://docs.mongodb.com/manual/administration/install-community/

This project focuses on database integration with Node.js as well as the ability to use templates to generate HTML on the fly. The program allows the user to search for various questions through the database and create their own collection of these questions to be used for trivia.

###### Project Assets:

- Node.js
- XMLHttpRequest
- Express
- HTML
- JSON
- PUG
- MongoDB

## Instructions

1. Run "npm install" in the project directory
   - Express will install
   - MongoDB will install
   - Pug will install

2. Run "node database-initializer.js"
   - We will now have a database of questions
   
3. Run "node server.js"

4. Navigate to "http://localhost:3000/questions" in your browser
   - All questions and their data will be listed
   - Only a maximum of 25 will be listed
   - You can edit the accept header to test JSON and HTML (defaults to HTML)
   - Uses the questions.pug template for html
   - Queries are "category" and "difficulty" (ex "questions?difficulty=medium&category=Science:%20Mathematics")

5. Click one of the question links
   - You will be taken to the specific page of the question in the same window/tab
   - If you edit the ID in the url tp an incorrect ID, you will get a 404 message

6. Navigate to "http://localhost:3000/createquiz" in your browser
   - Creator name and Tag boxes exist
   - There is a Current Questions Div and a Search DIV
   - The page will do an initial search for 25 Questions
   - Requires Name, tags, and at least one question, will produce a specific alert otherwise
   - Selecting an drop-down option will re-run the search with the proper parameters
   - Adding a questions will add it to the Currents questions and remove it from the search
   - Removing a question will add it back to the search pool
   - Drop-downs are dynamically generated
   - Tags are added to an array, separated by spaces
   - Creating a quiz alerts the user with the quiz ID
   - Question links open in new window/tab
   - Saving a quiz will generate a link
   - Clicking the link will open the quiz in a new window/tab (might need to refresh it)

7. Navigate to "http://localhost:3000/quizzes" in your browser
   - All quizzes are listed here as links with creator name and all Tags
   - Queries are "name" and "tag" (ex. "http://localhost:3000/quizzes?name=keith&tag=dance")
   - name is partial matching with case-insensitivity
   - tag is full matching with case-insensitivity

8. Click one of the quiz links
   - Quiz details are listed as are all quiz questions as links
   - Links lead to the questions page based on ID
