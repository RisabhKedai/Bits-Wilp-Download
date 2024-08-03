// Open (or create) a database
let request = window.indexedDB.open("myDatabase", 1);
let db;

request.onerror = function(event) {
  console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log("Database opened successfully");
};

request.onupgradeneeded = function(event) {
  db = event.target.result;
  
  // Create an object store (like a table in SQL databases)
  let objectStore = db.createObjectStore("customers", { keyPath: "id" });

  // Define the schema of the object store
  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("email", "email", { unique: true });

  console.log("Database setup complete");
};

// Function to add data to the database
function addCustomer(id, name, email) {
  let transaction = db.transaction(["customers"], "readwrite");
  let objectStore = transaction.objectStore("customers");
  let customer = { id: id, name: name, email: email };
  let request = objectStore.add(customer);

  request.onsuccess = function(event) {
    console.log("Customer added to the database");
  };

  request.onerror = function(event) {
    console.log("Error adding customer to the database: " + event.target.errorCode);
  };
}

// Function to retrieve data from the database
function getCustomer(id) {
  let transaction = db.transaction(["customers"], "readonly");
  let objectStore = transaction.objectStore("customers");
  let request = objectStore.get(id);

  request.onsuccess = function(event) {
    let customer = event.target.result;
    if (customer) {
      console.log("Customer found: ", customer);
    } else {
      console.log("Customer not found");
    }
  };

  request.onerror = function(event) {
    console.log("Error retrieving customer from the database: " + event.target.errorCode);
  };
}

// Function to delete data from the database
function deleteCustomer(id) {
  let transaction = db.transaction(["customers"], "readwrite");
  let objectStore = transaction.objectStore("customers");
  let request = objectStore.delete(id);

  request.onsuccess = function(event) {
    console.log("Customer deleted from the database");
  };

  request.onerror = function(event) {
    console.log("Error deleting customer from the database: " + event.target.errorCode);
  };
}

// Usage example
addCustomer(1, "John Doe", "john@example.com");
addCustomer(2, "Jane Doe", "jane@example.com");
getCustomer(1);
deleteCustomer(2);
