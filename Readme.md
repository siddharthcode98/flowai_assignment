# FLOW.AI ASSIGNMENT

I have completed the project successfully. I would like to thank flow.ai and nxtwave for this opportunity.Let's get started

All the code is written in the `server.js` file

To run the file,please enter in the terminal
`npm run start`

As Per Intructions I have created two tables in SQL one is `categories` and one `transactions`

- `categories` contains 3 columns **_id_**,**_name_** and **_type_**
- `transactions` contains 5 columns **_id_**,**_category_**,**_amount_**,**_type_**,**_date_** and **_description_**

### API Endpoints

- `POST /transactions`: Adds a new transaction (income or expense).
- `GET /transactions`: Retrieves all transactions.
- `GET /transactions/:id`: Retrieves a transaction by ID.
- `PUT /transactions/:id`: Updates a transaction by ID.
- `DELETE /transactions/:id`: Deletes a transaction by ID.
- `GET /summary`: Retrieves a summary of transactions, such as total income, total expenses, and balance

**Provided error handling to manage common issues like invalid transaction IDs, etc**
