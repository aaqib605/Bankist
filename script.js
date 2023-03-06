"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";

  movements.forEach((movement, index) => {
    const movementType = movement > 0 ? "deposit" : "withdrawal";

    const movementsHTML = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
        <div class="movements__value">${movement}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", movementsHTML);
  });
};

// Calculating and updating balance for the user
const updateBalance = function (account) {
  account.balance = account.movements.reduce((acc, deposit) => acc + deposit);
  labelBalance.textContent = `${account.balance} €`;
};

const updateAccountSummary = function (account) {
  const totalDeposits = account.movements
    .filter((movement) => movement > 0)
    .reduce((acc, deposit) => acc + deposit, 0);

  labelSumIn.textContent = `${totalDeposits}€`;

  const totalWidthdrawals = account.movements
    .filter((movement) => movement < 0)
    .reduce((acc, widthdrawal) => acc + widthdrawal, 0);
  labelSumOut.textContent = `${Math.abs(totalWidthdrawals)}€`;

  const interest = account.movements
    .filter((movement) => movement > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, deposit) => acc + deposit, 0);

  labelSumInterest.textContent = `${interest}€`;
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
  displayMovements(account.movements);
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

  // Making sure the transfer is valid
  if (
    transferAmount > 0 &&
    recieverAccount &&
    currentAccount.balance >= transferAmount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmount);
    recieverAccount.movements.push(transferAmount);
  }

  updateUI(currentAccount);
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

currencies.forEach((value, key, map) => {
  // console.log(key, value);
});

const currenciesUnique = new Set(["USD", "USD", "EUR", "GBP", "EUR"]);

currenciesUnique.forEach((currency) => {
  // console.log(currency);
});

// Coding Challenge #1

const dogsJulia = new Array(3, 5, 2, 12, 7);
const dogsKate = new Array(4, 1, 15, 8, 3);

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrect = dogsJulia;
  dogsJuliaCorrect.splice(0, 1);
  dogsJuliaCorrect.splice(-2);

  const dogAges = [...dogsJuliaCorrect, ...dogsKate];

  dogAges.forEach((dogAge, index) => {
    if (dogAge >= 3) {
      console.log(
        `Dog number ${index + 1} is an adult, and is ${dogAge} years old`
      );
    } else {
      console.log(`Dog number ${index + 1} is still a puppy.`);
    }
  });
};

// checkDogs(dogsJulia, dogsKate);

// map, filter, reduce

const nums = [1, 2, 3, 4, 5];

const doubleNums = nums.map((num) => num * 2);
// console.log(doubleNums);

const oddNums = nums.filter((num) => num % 2 != 0);
// console.log(oddNums);

const numsSum = nums.reduce((acc, num) => acc + num);
// console.log(numsSum);

const maxNum = nums.reduce((acc, num) => Math.max(acc, num), -Infinity);
// console.log(maxNum);

// Coding Challenge #2
// Convert dog age into human equivalent age and then calculate the average

const calcAvgHumanAge = function (dogAges) {
  // Human age based on dog age
  const humanAges = dogAges.map((dogAge) => {
    if (dogAge <= 2) {
      return 2 * dogAge;
    } else {
      return 16 + dogAge * 4;
    }
  });

  // Filtering out the dogs with age < 18
  const adultDogs = humanAges.filter((dogAge) => dogAge >= 18);
  let adultDogsAvgAge =
    adultDogs.reduce((acc, dogAge) => acc + dogAge) / adultDogs.length;

  console.log(adultDogsAvgAge);
};

// calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);

// Chaining map, filter, reduce
const output = [1, 2, 3, 4, 5]
  .filter((num) => num % 2 === 0)
  .map((num) => num * 2)
  .reduce((acc, num) => acc + num, 0);
// console.log(output);

// Coding Challenge #3

const calcAvgHumanAgeNew = function (dogAges) {
  // Human age based on dog age
  const humanAges = dogAges.map((dogAge) => {
    if (dogAge <= 2) {
      return 2 * dogAge;
    } else {
      return 16 + dogAge * 4;
    }
  });

  // Filtering out the dogs with age < 18
  const adultDogsAvgAge = humanAges
    .filter((dogAge) => dogAge >= 18)
    .reduce((acc, dogAge, index, arr) => acc + dogAge / arr.length, 0);

  console.log(adultDogsAvgAge);
};

// calcAvgHumanAgeNew([5, 2, 4, 1, 15, 8, 3]);

// find method
const findResult = [1, 2, 3, 4, 5].find((num) => num % 2 === 0);
// console.log(findResult);

const accountObj = accounts.find(
  (account) => account.owner === "Jessica Davis"
);
// console.log(accountObj);
