"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-02T23:36:17.929Z",
    "2020-07-01T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";

  let movements;
  if (sort) {
    movements = account.movements.sort((a, b) => a - b);
  } else {
    movements = account.movements;
  }

  movements.forEach((movement, index) => {
    const movementType = movement > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.movementsDates[index]);
    const locale = navigator.language;

    const dateStr = `${new Intl.DateTimeFormat(locale).format(date)}`;

    // Currency formatting
    const options = {
      style: "currency",
      currency: "USD",
    };

    const currencyFormat = new Intl.NumberFormat(locale, options).format(
      movement
    );

    const movementsHTML = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
        <div class="movements__date">${dateStr}</div>
        <div class="movements__value">${currencyFormat}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", movementsHTML);
  });
};

// Calculating and updating balance for the user
const updateBalance = function (account) {
  account.balance = account.movements.reduce((acc, deposit) => acc + deposit);

  const locale = navigator.language;
  const options = {
    style: "currency",
    currency: "USD",
  };

  const balanceFormat = new Intl.NumberFormat(locale, options).format(
    account.balance
  );
  labelBalance.textContent = `${balanceFormat}`;
};

const updateAccountSummary = function (account) {
  const totalDeposits = account.movements
    .filter((movement) => movement > 0)
    .reduce((acc, deposit) => acc + deposit, 0);

  const locale = navigator.language;
  const options = {
    style: "currency",
    currency: "USD",
  };

  labelSumIn.textContent = `${new Intl.NumberFormat(locale, options).format(
    totalDeposits
  )}`;

  const totalWidthdrawals = account.movements
    .filter((movement) => movement < 0)
    .reduce((acc, widthdrawal) => acc + widthdrawal, 0);
  labelSumOut.textContent = `${new Intl.NumberFormat(locale, options).format(
    totalWidthdrawals
  )}`;

  const interest = account.movements
    .filter((movement) => movement > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, deposit) => acc + deposit, 0);

  labelSumInterest.textContent = `${new Intl.NumberFormat(
    locale,
    options
  ).format(interest)}`;
};

// Creating usernames based on accounts owner property
const createUserNames = function (accounts) {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUserNames(accounts);

const updateUI = function (account) {
  displayMovements(account);
  updateBalance(account);
  updateAccountSummary(account);
};

// Event handlers
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    const accountName = currentAccount.owner.split(" ")[0];
    labelWelcome.textContent = `Welcome back, ${accountName}`;

    // Clear the input fields
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();
    containerApp.style.opacity = 1;

    updateUI(currentAccount);
  }
  // Creating the current date
  const date = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };

  const locale = currentAccount.locale;
  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(date);
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );

  // Clearing the input fields
  inputTransferAmount.value = "";
  inputTransferTo.value = "";
  inputTransferAmount.blur();

  // Making sure the transfer is valid and pushing it into the movements array
  if (
    transferAmount > 0 &&
    recieverAccount &&
    currentAccount.balance >= transferAmount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmount);
    recieverAccount.movements.push(transferAmount);

    // Adding the transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());
  }

  updateUI(currentAccount);
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  const isValidRequest = currentAccount.movements.some(
    (movement) => movement >= loanAmount * 0.1
  );

  if (loanAmount > 0 && isValidRequest) {
    currentAccount.movements.push(loanAmount);

    // Adding the loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    // Clear the input fields
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const indexDeleteAccount = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );
    accounts.splice(indexDeleteAccount, 1);

    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }
});

let isSorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
