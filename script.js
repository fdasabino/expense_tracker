"use strict";

/**
 * Initialize the expenses array by loading data from localStorage.
 * If no data is found, initialize as an empty array.
 */
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

/**
 * Get references to DOM elements and set up event listeners.
 */
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const summary = document.getElementById("summary");

expenseForm.addEventListener("submit", addExpense);

/**
 * On window load, display the expenses and update the summary.
 */
window.onload = () => {
  displayExpenses();
  updateSummary();
};

/**
 * Handles the submission of the expense form.
 * Validates input fields, creates a new expense object,
 * updates the expenses array, and resets the form.
 */
function addExpense(event) {
  event.preventDefault();

  // Retrieve and validate input values
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");
  const descriptionInput = document.getElementById("description");

  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value.trim();
  const description = descriptionInput.value.trim();

  if (isNaN(amount) || amount <= 0 || !category || !description) {
    alert("Please fill out all fields correctly.");
    return;
  }

  /**
   * Create a new expense object with sanitized input.
   */
  const expense = {
    amount: amount,
    category: category,
    description: description,
    date: new Date().toISOString(),
  };

  /**
   * Add the new expense to the expenses array and update localStorage.
   */
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  /**
   * Update the UI and reset the form.
   */
  displayExpenses();
  updateSummary();
  expenseForm.reset();
}

/**
 * Renders the list of expenses in the DOM.
 * Clears the existing list and populates it based on the expenses array.
 */
function displayExpenses() {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML = "<p>No expenses recorded yet.</p>";
    return;
  }

  /**
   * Use a DocumentFragment for better performance when updating the DOM.
   */
  const fragment = document.createDocumentFragment();

  expenses.forEach((expense, index) => {
    /**
     * Create a list item for each expense.
     */
    const listItem = document.createElement("li");
    listItem.textContent = `${expense.description} - ${formatAmount(expense.amount)} (${
      expense.category
    }) - ${new Date(expense.date).toLocaleDateString()}`;

    /**
     * Create a delete button for each expense.
     */
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "<i class='fas fa-trash'></i>";
    deleteBtn.onclick = () => deleteExpense(index);

    /**
     * Append the delete button to the list item, and the list item to the fragment.
     */
    listItem.appendChild(deleteBtn);
    fragment.appendChild(listItem);
  });

  /**
   * Append the fragment to the expense list in the DOM.
   */
  expenseList.appendChild(fragment);
}

/**
 * Updates the summary section in the DOM.
 * Calculates the total expenses and the total per category.
 */
function updateSummary() {
  summary.innerHTML = "";

  if (expenses.length === 0) {
    summary.innerHTML = "<p>No summary to show.</p>";
    return;
  }

  /**
   * Calculate the total expenses.
   */
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  /**
   * Calculate totals per category.
   */
  const categories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  /**
   * Format the category totals.
   */
  for (const category in categories) {
    categories[category] = formatAmount(categories[category]);
  }

  /**
   * Generate the summary HTML content.
   */
  let summaryHTML = `
    <p>Total Expenses: ${formatAmount(total)}</p>
    <small>Expenses by Category:</small>
    <ul>
      ${Object.entries(categories)
        .map(([category, amount]) => `<li>${category}: ${amount}</li>`)
        .join("")}
    </ul>
  `;

  /**
   * Update the summary section in the DOM.
   */
  summary.innerHTML = summaryHTML;
}

/**
 * Deletes an expense from the expenses array based on its index.
 * Updates the expenses display and saves the changes to localStorage.
 */
function deleteExpense(index) {
  /**
   * Remove the expense from the array.
   */
  expenses.splice(index, 1);

  /**
   * Update localStorage and the UI.
   */
  localStorage.setItem("expenses", JSON.stringify(expenses));
  displayExpenses();
  updateSummary();
}

/**
 * Formats amount as currency using the Swedish Krona (SEK) currency code.
 * @param {number} amount - The amount to format.
 */
function formatAmount(amount) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
  }).format(amount);
}
