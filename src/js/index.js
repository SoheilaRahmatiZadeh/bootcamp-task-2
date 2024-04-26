const btnTransactionsLoaded = document.querySelector(".btn__load-transactions");
const searchInput = document.querySelector(".input__search");
const transactionsList = document.querySelector(".list__content");
const transactionListSection = document.querySelector(
  ".transactions-list__section"
);

let sortDateOrder = "acs";
let sortPriceOrder = "acs";

btnTransactionsLoaded.addEventListener("click", () => buildForm());

//=============================================
async function buildForm() {
  try {
    const allTrsnsactions = await axios
      .get("http://localhost:3000/transactions")
      .then((res) => {
        setFormView();
        renderTransactionsList(res.data);
        searchInput.addEventListener("input", (e) => searchTransactions(e));
      });
  } catch {
    (err) => console.log(err.response.data.message);
  }
}

// ============================================
function renderTransactionsList(trsnsactions) {
  let htmlText = "";
  htmlText = createHeaderList();

  if (trsnsactions.length) {
    trsnsactions.forEach((item) => {
      htmlText += createList(item);
      //Add to DOM
      transactionsList.innerHTML = htmlText;
    });
  } else {
    transactionsList.innerHTML = htmlText;
    return;
  }

  const sortClick = [...document.querySelectorAll(".clickable")];
  sortClick.forEach((item) => {
    item.addEventListener("click", (e) => {
      sort(e);
      changeChevron(e);
    });
  });
}

// ===========================================
function createHeaderList() {
  return ` 
  <tr class="list__content-header">
    <th>ردیف</th>
    <th>نوع تراکنش</th>
    
    <th class="clickable" data-sortFilter="price">
      <span>مبلغ</span>
      <span class="chevron">
        <i class="fa-solid fa-chevron-down"></i>
      </span>
    </th>
    
    <th>شماره پیگیری</th>
    
    <th class="clickable" data-sortFilter="date">
      <span>تاریخ تراکنش</span>
      <span class="chevron">
        <i class="fa-solid fa-chevron-down"></i>
      </span>
    </th>
  
  </tr>`;
}

// ===========================================
function createList(transItem) {
  let result = "";
  result = `           
      <tr class="list__content-item">
        <td>${transItem.id}</td>`;

  if (transItem.type.includes("افزایش اعتبار"))
    result += `<td class="transaction-type green">${transItem.type}</td>`;
  else result += `<td class="transaction-type red">${transItem.type}</td>`;

  result += `
        <td>${transItem.price}</td>
        <td>${transItem.refId}</td>
        <td>${new Date(transItem.date).toLocaleString("fa-IR", {
          dateStyle: "short",
          timeStyle: "short",
        })}</td>
        </tr>
        `;

  return result;
}

// ===========================================
function setFormView() {
  btnTransactionsLoaded.classList.add("hidden");
  searchInput.classList.remove("hidden");
  transactionListSection.classList.remove("hidden");
  createHeaderList();
}

// ===========================================
async function searchTransactions(e) {
  e.preventDefault();
  const filter = e.target.value.trim();
  const newQuery = "http://localhost:3000/transactions?refId_like=" + filter;
  try {
    const filteredTrancaction = await axios.get(newQuery);
    {
      renderTransactionsList(filteredTrancaction.data);
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
}

// ===========================================
function changeChevron(e) {
  // e.target.classList.add("reverse-chevron");
}

// ===========================================
async function sort(e) {
  let url = "";
  let order = "";
  const sortFilter = e.target.dataset.sortfilter;
  //set order
  order = setOrder(sortFilter);

  //set url
  if (searchInput.value) {
    const searchValue = searchInput.value.trim();
    url = `http://localhost:3000/transactions?refId_like=${searchValue}&_sort=${sortFilter}&_order=${order}`;
  } else
    url = `http://localhost:3000/transactions?_sort=${sortFilter}&_order=${order}`;

  try {
    await axios.get(url).then((res) => {
      renderTransactionsList(res.data);
    });
  } catch {
    (err) => console.log(err.response.data.message);
  }
}

// ===========================================
function setOrder(filter) {
  let order = "";
  if (filter === "price") {
    if (sortPriceOrder.includes("asc")) sortPriceOrder = "desc";
    else sortPriceOrder = "asc";
    order = sortPriceOrder;
  } else {
    if (sortDateOrder.includes("asc")) sortDateOrder = "desc";
    else sortDateOrder = "asc";
    order = sortDateOrder;
  }
  return order;
}

// ===========================================
