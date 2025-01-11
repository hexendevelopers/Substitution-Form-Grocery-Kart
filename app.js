import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGm1mZObECZzi8r1MA7gamJW_v_7v0tZw",
    authDomain: "substitution-form-shopify-app.firebaseapp.com",
    databaseURL: "https://substitution-form-shopify-app-default-rtdb.firebaseio.com",
    projectId: "substitution-form-shopify-app",
    storageBucket: "substitution-form-shopify-app.firebasestorage.app",
    messagingSenderId: "857195381141",
    appId: "1:857195381141:web:310d7854d9db510486369c"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get elements
const submissionsTable = document.getElementById('submissions-list');
const modal = document.getElementById('submission-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeModalButton = document.getElementById('close-modal');

// Fetch data from Firebase
const fetchSubmissions = () => {
  const submissionsRef = ref(database, 'submissions');
  onValue(submissionsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const submissionsArray = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      populateTable(submissionsArray);
    }
  });
};

// Populate the table with submissions
const populateTable = (submissions) => {
  submissionsTable.innerHTML = '';
  submissions.forEach((submission) => {
    const row = document.createElement('tr');
    row.className = 'cursor-pointer hover:bg-gray-50 transition-colors';
    row.onclick = () => openModal(submission);
    row.innerHTML = `
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">${submission.fullName}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${submission.email}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${new Date(submission.timestamp).toLocaleString()}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${submission.currentBox}</td>
    `;
    submissionsTable.appendChild(row);
  });
};

// Open modal with submission details
const openModal = (submission) => {
  modalTitle.textContent = 'Submission Details';
  modalContent.innerHTML = `
    <div><dt class="text-sm font-medium text-gray-500">Name</dt><dd class="mt-1 text-sm text-gray-900">${submission.fullName}</dd></div>
    <div><dt class="text-sm font-medium text-gray-500">Email</dt><dd class="mt-1 text-sm text-gray-900">${submission.email}</dd></div>
    <div><dt class="text-sm font-medium text-gray-500">Current Box</dt><dd class="mt-1 text-sm text-gray-900">${submission.currentBox}</dd></div>
    <div><dt class="text-sm font-medium text-gray-500">New Box</dt><dd class="mt-1 text-sm text-gray-900">${submission.newBox}</dd></div>
    <div><dt class="text-sm font-medium text-gray-500">Item to Remove</dt><dd class="mt-1 text-sm text-gray-900">${submission.itemToRemove}</dd></div>
    <div><dt class="text-sm font-medium text-gray-500">Item to Add</dt><dd class="mt-1 text-sm text-gray-900">${submission.itemToAdd}</dd></div>
    <div><dt class="text-sm font-medium text-gray-500">Timestamp</dt><dd class="mt-1 text-sm text-gray-900">${new Date(submission.timestamp).toLocaleString()}</dd></div>
  `;
  modal.classList.remove('hidden');
};

// Close the modal
closeModalButton.onclick = () => {
  modal.classList.add('hidden');
};

// Initialize and fetch data
fetchSubmissions();
