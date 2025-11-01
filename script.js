const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const list = document.getElementById("list");
const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const addBtn = document.getElementById("addBtn");
const msg = document.getElementById("motivationalText");
const ctx = document.getElementById("chart").getContext("2d");

let income = 0;
let expense = 0;
let balance = 0;
let transactions = [];

const chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expense"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#22c55e", "#ef4444"],
      borderWidth: 1,
    }],
  },
  options: {
    responsive: true,
    cutout: "70%",
  },
});

function updateChart() {
  chart.data.datasets[0].data = [income, expense];
  chart.update();
}

function updateSummary() {
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${expense}`;
  balance = income - expense;
  balanceEl.textContent = `₹${balance}`;
  updateChart();

  msg.textContent =
    balance > 0
      ? "💪 Great job! You’re saving well!"
      : "⚠️ Careful! Try to reduce expenses!";
}

function addTransaction() {
  const descText = desc.value.trim();
  const amountVal = parseFloat(amount.value);
  if (!descText || isNaN(amountVal)) return;

  const transaction = {
    id: Date.now(),
    desc: descText,
    amount: amountVal,
    date: new Date().toLocaleString(),
  };

  transactions.push(transaction);
  renderTransactions();
  updateValues();
  desc.value = "";
  amount.value = "";
}

function renderTransactions() {
  list.innerHTML = "";
  transactions.forEach((t) => {
    const li = document.createElement("li");
    li.classList.add(t.amount > 0 ? "income" : "expense");
    li.innerHTML = `
      <span>${t.desc} (${t.amount > 0 ? "+" : ""}${t.amount})<br><small>${t.date}</small></span>
      <button onclick="deleteTransaction(${t.id})">✖</button>
    `;
    list.appendChild(li);
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateValues();
  renderTransactions();
}

function updateValues() {
  income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);
  updateSummary();
}

addBtn.addEventListener("click", addTransaction);
