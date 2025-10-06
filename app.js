// app.js

// Import necessary Firebase SDK functions
// We import getApps and getApp to safely retrieve the already initialized Firebase app instance.
import { getApps, getApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User, // For TypeScript type hinting
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Import Cloud Firestore functions
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


// --- Get Firebase App and Service Instances ---
// Safely get the already initialized Firebase app instance
const firebaseApp = getApps().length > 0 ? getApp() : null; // This will get the app initialized in index.html

if (!firebaseApp) {
  console.error("Firebase App not initialized. Please ensure initializeApp is called in index.html.");
  // Handle this error appropriately in your UI if firebaseApp is null
}

let auth, db;
if (firebaseApp) {
  auth = getAuth(firebaseApp); // Get the Auth service instance from the app
  db = getFirestore(firebaseApp); // Get the Firestore service instance from the app
} else {
  // Optionally, handle the error or set auth/db to null
  auth = null;
  db = null;
}


// --- UI Element References ---
const authMessage = document.getElementById('auth-message'); // For general auth messages

// Main Sections
const marketingContent = document.getElementById('marketing-content');
const authFormsSection = document.getElementById('auth-forms-section');
const dashboardSection = document.getElementById('dashboard-section');

// Marketing Content Buttons
const showAuthFormsButton = document.getElementById('show-auth-forms');

// Login Form Elements
const loginForm = document.getElementById('login-form');
/** @type {HTMLInputElement} */
const loginEmailInput = document.getElementById('login-email');
/** @type {HTMLInputElement} */
const loginPasswordInput = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const showRegisterLink = document.getElementById('show-register-link');
const showResetPasswordLink = document.getElementById('show-reset-password-link');
const backToMarketingFromAuth = document.getElementById('back-to-marketing-from-auth');

// Register Section Elements
const registerSection = document.getElementById('register-section');
/** @type {HTMLInputElement} */
const registerEmailInput = document.getElementById('register-email');
/** @type {HTMLInputElement} */
const registerPasswordInput = document.getElementById('register-password');
const registerButton = document.getElementById('register-button');
const showLoginLinkFromRegister = document.getElementById('show-login-link-from-register');
const backToMarketingFromRegister = document.getElementById('back-to-marketing-from-register');

// Reset Password Section Elements
const resetPasswordSection = document.getElementById('reset-password-section');
/** @type {HTMLInputElement} */
const resetEmailInput = document.getElementById('reset-email');
const sendResetEmailButton = document.getElementById('send-reset-email-button');
const showLoginLinkFromReset = document.getElementById('show-login-link-from-reset');
const backToMarketingFromReset = document.getElementById('back-to-marketing-from-reset');


// Dashboard Section Elements
const userDisplayName = document.getElementById('user-display-name');
const userEmail = document.getElementById('user-email');
const signOutButton = document.getElementById('sign-out-button');
/** @type {HTMLTextAreaElement} */
const firebaseAppDataTextarea = document.getElementById('firebase-app-data');
const saveFirebaseDataButton = document.getElementById('save-firebase-data-button');


// LocalStorage Demonstration Elements
const localStorageDataSection = document.getElementById('localStorage-data-section');
const currentLocalStorageDataTextarea = document.getElementById('current-localStorage-data');
const saveLocalStorageDataButton = document.getElementById('save-localstorage-data-button');
const migrateLocalStorageButton = document.getElementById('migrate-localstorage-to-firebase-button');
const clearLocalStorageButton = document.getElementById('clear-localstorage-button');
const localStorageMigrationMessage = document.getElementById('localStorage-migration-message');


// --- Helper Functions ---

/** Displays a message to the user */
function displayAuthMessage(message, isError) {
  if (authMessage) {
    authMessage.textContent = message;
    authMessage.className = isError ? 'message error-message' : 'message success-message';
    authMessage.style.display = 'block';
    setTimeout(() => { authMessage.style.display = 'none'; }, 5000); // Hide after 5 seconds
    }
}

/** Hides all main content sections */
function hideAllContentSections() {
    if (marketingContent) marketingContent.style.display = 'none';
    if (authFormsSection) authFormsSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'none';
    // Always show localStorage demo for this example, hide if you want it conditional
    if (localStorageDataSection) localStorageDataSection.style.display = 'block';
}

/** Hides all auth sub-forms */
function hideAuthSubForms() {
    if (loginForm) loginForm.style.display = 'none';
    if (registerSection) registerSection.style.display = 'none';
    if (resetPasswordSection) resetPasswordSection.style.display = 'none';
    if (authMessage) authMessage.style.display = 'none'; // Clear any messages
}


// --- Auth State Change Listener ---

// This is the core function that updates the UI based on login status
onAuthStateChanged(auth, async (user) => {
  hideAllContentSections(); // Start by hiding everything

  if (user) {
    // User is signed in
    console.log("User signed in:", user.email, "UID:", user.uid);
    if (dashboardSection) dashboardSection.style.display = 'block';

    if (userDisplayName) userDisplayName.textContent = user.displayName || user.email || 'MCATable User';
    if (userEmail) userEmail.textContent = user.email || 'N/A';

    // --- Load User Data from Firebase Firestore ---
    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            // Assuming your data is stored under a field like 'studyNotes'
            firebaseAppDataTextarea.value = JSON.stringify(userDocSnap.data().studyNotes || '', null, 2);
        } else {
            firebaseAppDataTextarea.value = 'No study notes in the cloud yet. Save some below!';
        }
    } catch (error) {
        console.error("Error loading Firebase data:", error);
        firebaseAppDataTextarea.value = 'Error loading study notes from the cloud.';
    }

    // --- Setup Realtime Sync for Quiz Progress ---
    setupRealtimeSync(user.uid);

  } else {
    // No user is logged in
    console.log("No user signed in.");
    if (marketingContent) marketingContent.style.display = 'block'; // Show initial marketing content
    hideAuthSubForms(); // Make sure only marketing or login is shown initially
  }
  loadLocalStorageData(); // Always refresh localStorage display regardless of auth state
});


// --- Authentication Action Handlers ---

// Login
loginButton?.addEventListener('click', async () => {
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;
  displayAuthMessage("Logging in...", false);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    displayAuthMessage("Logged in successfully!", false);
    // onAuthStateChanged will handle UI update
  } catch (error) {
    displayAuthMessage(`Login failed: ${error.message}`, true);
  }
});

// Register
registerButton?.addEventListener('click', async () => {
  const email = registerEmailInput.value;
  const password = registerPasswordInput.value;
  displayAuthMessage("Registering...", false);
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    displayAuthMessage("Account created and logged in successfully!", false);
    // Optional: send email verification here
    // await sendEmailVerification(auth.currentUser);
    // displayAuthMessage("Verification email sent! Please check your inbox.", false);
    // onAuthStateChanged will handle UI update
  } catch (error) {
    displayAuthMessage(`Registration failed: ${error.message}`, true);
  }
});

// Sign Out
signOutButton?.addEventListener('click', async () => {
  displayAuthMessage("Signing out...", false);
  try {
    await signOut(auth);
    displayAuthMessage("Signed out successfully.", false);
    // onAuthStateChanged will handle UI update
  } catch (error) {
    displayAuthMessage(`Sign out failed: ${error.message}`, true);
  }
});

// Send Password Reset Email
sendResetEmailButton?.addEventListener('click', async () => {
  const email = resetEmailInput.value;
  if (!email) {
    displayAuthMessage("Please enter your email address to reset password.", true);
    return;
  }
  displayAuthMessage("Sending password reset email...", false);
  try {
    await sendPasswordResetEmail(auth, email);
    displayAuthMessage("Password reset email sent (if account exists). Check your inbox!", false);
    resetEmailInput.value = ''; // Clear input
    hideAuthSubForms();
    if (loginForm) loginForm.style.display = 'block'; // Go back to login form
  } catch (error) {
    displayAuthMessage(`Error sending reset email: ${error.message}`, true);
  }
});


// --- UI Navigation Handlers ---

showAuthFormsButton?.addEventListener('click', (e) => {
    e.preventDefault();
    if (marketingContent) marketingContent.style.display = 'none';
    if (authFormsSection) authFormsSection.style.display = 'block';
    hideAuthSubForms(); // Hide all, then show login
    if (loginForm) loginForm.style.display = 'block';
});

backToMarketingFromAuth?.addEventListener('click', (e) => {
    e.preventDefault();
    if (authFormsSection) authFormsSection.style.display = 'none';
    if (marketingContent) marketingContent.style.display = 'block';
});
backToMarketingFromRegister?.addEventListener('click', (e) => {
    e.preventDefault();
    if (authFormsSection) authFormsSection.style.display = 'none';
    if (marketingContent) marketingContent.style.display = 'block';
});
backToMarketingFromReset?.addEventListener('click', (e) => {
    e.preventDefault();
    if (authFormsSection) authFormsSection.style.display = 'none';
    if (marketingContent) marketingContent.style.display = 'block';
});


showRegisterLink?.addEventListener('click', (e) => {
  e.preventDefault();
  hideAuthSubForms();
  if (registerSection) registerSection.style.display = 'block';
});

showLoginLinkFromRegister?.addEventListener('click', (e) => {
  e.preventDefault();
  hideAuthSubForms();
  if (loginForm) loginForm.style.display = 'block';
});

showResetPasswordLink?.addEventListener('click', (e) => {
  e.preventDefault();
  hideAuthSubForms();
  if (resetPasswordSection) resetPasswordSection.style.display = 'block';
});

showLoginLinkFromReset?.addEventListener('click', (e) => {
  e.preventDefault();
  hideAuthSubForms();
  if (loginForm) loginForm.style.display = 'block';
});


// --- LocalStorage & Firebase App Data Handling ---

/** Loads data from localStorage into the textarea */
function loadLocalStorageData() {
  const data = localStorage.getItem('mcatStudyNotes'); // Using a specific key
  if (currentLocalStorageDataTextarea) {
    currentLocalStorageDataTextarea.value = data || 'No local study notes yet.';
  }
}

// Saves data from the textarea to localStorage
saveLocalStorageDataButton?.addEventListener('click', () => {
  localStorage.setItem('mcatStudyNotes', currentLocalStorageDataTextarea.value);
  displayAuthMessage("Study notes saved to this browser's localStorage.", false);
  loadLocalStorageData(); // Refresh display
});

// Clears data from localStorage
clearLocalStorageButton?.addEventListener('click', () => {
  localStorage.removeItem('mcatStudyNotes');
  displayAuthMessage("Study notes cleared from this browser's localStorage.", false);
  loadLocalStorageData(); // Refresh display
});

// Migrate data from localStorage to Firebase Firestore
migrateLocalStorageButton?.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) {
    if (localStorageMigrationMessage) {
      localStorageMigrationMessage.textContent = "You must be logged in to migrate study notes to the cloud.";
      localStorageMigrationMessage.className = 'message error-message';
      localStorageMigrationMessage.style.display = 'block';
    }
    return;
  }

  const localData = localStorage.getItem('mcatStudyNotes');
  if (!localData || localData === 'No local study notes yet.') {
    if (localStorageMigrationMessage) {
      localStorageMigrationMessage.textContent = "No local study notes found to migrate.";
      localStorageMigrationMessage.className = 'message error-message';
      localStorageMigrationMessage.style.display = 'block';
    }
    return;
  }

  try {
    // --- Actual Firestore write operation ---
    const userDocRef = doc(db, 'users', user.uid);
    // You might want to parse localData if it's JSON, or store it as a string
    await setDoc(userDocRef, { studyNotes: localData }, { merge: true });

    if (localStorageMigrationMessage) {
      localStorageMigrationMessage.textContent = "Migration successful! Your local notes are now in the cloud.";
      localStorageMigrationMessage.className = 'message success-message';
      localStorageMigrationMessage.style.display = 'block';
    }

    // After successful migration, update the Firebase textarea
    firebaseAppDataTextarea.value = localData;

    // Optional: After successful migration, you might want to clear it from local storage
    // localStorage.removeItem('mcatStudyNotes');
    // loadLocalStorageData();
  } catch (error) {
    console.error("Migration to Firestore failed:", error);
    if (localStorageMigrationMessage) {
      localStorageMigrationMessage.textContent = `Migration failed: ${error.message}`;
      localStorageMigrationMessage.className = 'message error-message';
      localStorageMigrationMessage.style.display = 'block';
    }
  }
});


// Save Firebase Data Button Handler
saveFirebaseDataButton?.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) {
        displayAuthMessage("You must be logged in to save study notes to the cloud.", true);
        return;
    }
    const dataToSave = firebaseAppDataTextarea.value;
    displayAuthMessage("Saving study notes to the cloud...", false);
    try {
        // --- Actual Firestore write operation ---
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { studyNotes: dataToSave }, { merge: true });
        displayAuthMessage("Study notes saved to the cloud!", false);
    } catch (error) {
        console.error("Error saving to Firestore:", error);
        displayAuthMessage(`Error saving to cloud: ${error.message}`, true);
    }
});

// --- Auto-Save Setup ---

function setupAutoSave() {
  // Auto-save quiz progress
  document.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
      saveQuizProgress();
    }
  });
}

async function saveQuizProgress() {
  const answers = {};
  document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
    answers[input.name] = input.value;
  });
  
  // Save to localStorage always
  localStorage.setItem('quiz_progress', JSON.stringify(answers));
  
  // Save to Firebase if authenticated
  const user = auth.currentUser;
  if (user) {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { quizProgress: answers }, { merge: true });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }
}

// --- Realtime Sync Setup ---

function setupRealtimeSync(userId) {
  const userDocRef = doc(db, 'users', userId);
  
  return onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.quizProgress) {
        // Apply progress to current quiz
        Object.entries(data.quizProgress).forEach(([name, value]) => {
          const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
          if (input) input.checked = true;
        });
      }
    }
  });
}

// --- Initial Load ---
loadLocalStorageData();
 // Load any existing local notes on page load

setupAutoSave();
