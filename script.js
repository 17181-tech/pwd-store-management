
// ===== PWD STORE MANAGEMENT SYSTEM =====

let materials = JSON.parse(localStorage.getItem("materials")) || [];
let stockEntries = JSON.parse(localStorage.getItem("stockEntries")) || [];

function saveData() {
    localStorage.setItem("materials", JSON.stringify(materials));
    localStorage.setItem("stockEntries", JSON.stringify(stockEntries));
}

function addMaterial() {

    const name = document.getElementById("materialName").value.trim();
    const unit = document.getElementById("unit").value;

    if (name === "" || unit === "") {
        alert("Please enter Material Name and Unit");
        return;
    }

    let exists = materials.find(m =>
        m.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        alert("Material already exists.");
        return;
    }

    materials.push({
        name: name,
        unit: unit,
        balance: 0
    });

    saveData();

    document.getElementById("materialName").value = "";
    document.getElementById("unit").selectedIndex = 0;

    loadMaterials();
    loadBalanceTable();
    updateDashboard();
}

function loadMaterials() {

    const select = document.getElementById("materialSelect");

    select.innerHTML =
        '<option value="">Select Material</option>';

    materials.forEach((m, index) => {

        let option = document.createElement("option");

        option.value = index;

        option.textContent = m.name;

        select.appendChild(option);

    });

}

document.getElementById("materialSelect").addEventListener("change", function () {

    if (this.value === "") return;

    let material = materials[this.value];

    document.getElementById("unitDisplay").value = material.unit;

    document.getElementById("opening").value = material.balance;

});
function saveEntry() {

    let index = document.getElementById("materialSelect").value;

    if (index === "") {
        alert("Please select a material.");
        return;
    }

    let date = document.getElementById("date").value;
    let received = Number(document.getElementById("received").value) || 0;
    let issued = Number(document.getElementById("issued").value) || 0;
    let remarks = document.getElementById("remarks").value;

    let material = materials[index];

    let opening = material.balance;

    let closing = opening + received - issued;

    if (closing < 0) {
        alert("Issued quantity cannot exceed available stock.");
        return;
    }

    stockEntries.push({
        date: date,
        material: material.name,
        unit: material.unit,
        opening: opening,
        received: received,
        issued: issued,
        closing: closing,
        remarks: remarks
    });

    material.balance = closing;

    saveData();

    document.getElementById("received").value = "";
    document.getElementById("issued").value = "";
    document.getElementById("remarks").value = "";
    document.getElementById("opening").value = closing;

    loadBalanceTable();
    loadStockTable();
    updateDashboard();

}

function loadBalanceTable() {

    let table = document.getElementById("balanceTable");

    table.innerHTML = "";

    materials.forEach(function(material){

        table.innerHTML += `
        <tr>
            <td>${material.name}</td>
            <td>${material.unit}</td>
            <td>${material.balance}</td>
        </tr>
        `;

    });

}
function loadStockTable() {

    let table = document.getElementById("stockTable");

    table.innerHTML = "";

    stockEntries.forEach(function(entry, index){

        table.innerHTML += `
        <tr>
            <td>${entry.date}</td>
            <td>${entry.material}</td>
            <td>${entry.unit}</td>
            <td>${entry.opening}</td>
            <td>${entry.received}</td>
            <td>${entry.issued}</td>
            <td>${entry.closing}</td>
            <td>${entry.remarks}</td>
            <td>
                <button onclick="deleteEntry(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    });

}

function deleteEntry(index){

    if(confirm("Delete this record?")){

        stockEntries.splice(index,1);

        saveData();

        loadStockTable();

    }

}

function updateDashboard(){

    document.getElementById("totalMaterials").innerHTML =
        materials.length;

    let received = 0;

    let issued = 0;

    let stock = 0;

    materials.forEach(function(m){

        stock += Number(m.balance);

    });

    stockEntries.forEach(function(e){

        received += Number(e.received);

        issued += Number(e.issued);

    });

    document.getElementById("receivedToday").innerHTML = received;

    document.getElementById("issuedToday").innerHTML = issued;

    document.getElementById("currentStock").innerHTML = stock;

}

function printReport(){

    window.print();

}

function exportData(){

    alert("Excel Export will be added in the next version.");

}

function clearAll(){

    if(confirm("Delete all materials and stock records?")){

        materials=[];

        stockEntries=[];

        localStorage.clear();

        loadMaterials();

        loadBalanceTable();

        loadStockTable();

        updateDashboard();

    }

}

loadMaterials();

loadBalanceTable();

loadStockTable();

updateDashboard();
