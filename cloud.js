  // Import Firebase modules
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
      import {
        getAuth,
        onAuthStateChanged,
        signInWithPopup,
        GoogleAuthProvider,
        signOut,
      } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
      import {
        getFirestore,
        doc,
        setDoc,
        getDoc,
        onSnapshot,
      } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

      // Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyAxvvxY1q9CmPB5YoS-cFzfSwkjVqYQ5s0",
        authDomain: "percentyle.firebaseapp.com",
        databaseURL: "https://percentyle-default-rtdb.firebaseio.com",
        projectId: "percentyle",
        storageBucket: "percentyle.firebasestorage.app",
        messagingSenderId: "601930251108",
        appId: "1:601930251108:web:987d2d7b5ba9ca30f75871",
        measurementId: "G-L97LGZSXS5",
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);

      let currentUser = null;
      let isInitialized = false;
      let realtimeListener = null;

      // Create sync status indicator
      const createSyncStatus = () => {
        const syncStatus = document.createElement("div");
        syncStatus.id = "sync-status";
        syncStatus.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background:#25a2a8;
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding: 8px 16px;
      font-family: Arial, sans-serif;
      font-size: 13px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 50px;
    `;

        syncStatus.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; color: white;">
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        ">⚕</div>
        <div>
          <div style="font-weight: bold; font-size: 14px;">MCATable</div>
          <div id="sync-message" style="font-size: 11px; opacity: 0.9;"></div>
        </div>
      </div>

      <div id="auth-section">
        <div id="signed-out-state" style="display: flex; align-items: center; gap: 8px;">
          <div style="color: white; font-size: 12px; opacity: 0.9;">
            🔒 <span style="font-weight: 600;">Not Syncing</span>
          </div>
          <button id="sign-in-btn" style="
            padding: 6px 16px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s ease;
            backdrop-filter: blur(5px);
          " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
             onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            Sign In to Sync
          </button>
        </div>

        <div id="signed-in-state" style="display: none; align-items: center; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px; color: white;">
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: rgba(255,255,255,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
              border: 2px solid rgba(255,255,255,0.3);
            " id="user-avatar"></div>
            <div>
              <div id="user-name" style="font-weight: bold; font-size: 12px;"></div>
              <div style="font-size: 10px; opacity: 0.8;"></div>
            </div>
          </div>
          <button id="sign-out-btn" style="
            padding: 4px 12px;
            background: blueviolet;
            color: white;
            border: 1px solid teal;
            border-radius: 15px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.2s ease;
          " onmouseover="this.style.background='blueviolet'" 
             onmouseout="this.style.background='blueviolet'">
            Sign Out
          </button>
        </div>
      </div>
    `;

        document.body.appendChild(syncStatus);

        // Add padding to body to prevent content from hiding behind fixed header
        document.body.style.paddingTop = "60px";

        return syncStatus;
      };

      // Create sync UI
      const syncUI = createSyncStatus();

      // Show status message
      const showStatus = (message, isError = false) => {
        const syncMessage = document.getElementById("sync-message");
        const statusMessage = document.getElementById("status-message");

        const color = isError ? "#ef4444" : "#666";

        if (syncMessage) {
          syncMessage.textContent = message;
          syncMessage.style.color = color;
          setTimeout(() => {
            syncMessage.textContent = "Ready";
            syncMessage.style.color = "white";
          }, 3000);
        }

        if (statusMessage && !currentUser) {
          statusMessage.textContent = message;
          statusMessage.style.color = color;
          setTimeout(() => {
            statusMessage.textContent = "Progress saved locally";
            statusMessage.style.color = "white";
          }, 3000);
        }

        console.log(message);
      };

      // Get current answers
      const getCurrentAnswers = () => {
        const answers = {};
        document
          .querySelectorAll('input[type="radio"]:checked')
          .forEach((input) => {
            answers[input.name] = input.value;
          });
        return answers;
      };

      // Apply answers to the quiz
      const applyAnswers = (answers) => {
        Object.entries(answers).forEach(([questionName, value]) => {
          const input = document.querySelector(
            `input[name="${questionName}"][value="${value}"]`
          );
          if (input && !input.checked) {
            input.checked = true;
            // Trigger score update if available
            if (window.updateScore) window.updateScore();
          }
        });
      };

      // Save to Firebase (only when authenticated)
      const saveToFirebase = async (answers) => {
        if (!currentUser) {
          showStatus("⚠️ Not signed in - no cloud sync");
          return false;
        }

        try {
          showStatus("☁️ Syncing to cloud...");

          await setDoc(
            doc(db, "users", currentUser.uid, "quizzes", "genchem"),
            {
              answers: answers,
              lastUpdated: new Date(),
              quizName: "General Chemistry",
              userEmail: currentUser.email,
              userName: currentUser.displayName,
              url: window.location.pathname,
              totalQuestions: Object.keys(answers).length,
            },
            { merge: true }
          );

          showStatus("Synced to cloud");
          return true;
        } catch (error) {
          console.error("Firebase save failed:", error);
          showStatus(`Sync failed: ${error.message}`, true);
          return false;
        }
      };

      // Load from Firebase
      const loadFromFirebase = async () => {
        if (!currentUser) return {};

        try {
          showStatus("Loading from cloud...");

          const docRef = doc(
            db,
            "users",
            currentUser.uid,
            "quizzes",
            "genchem"
          );
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            showStatus("Loaded from cloud");
            return data.answers || {};
          } else {
            showStatus("No cloud data found");
            return {};
          }
        } catch (error) {
          console.error("Firebase load failed:", error);
          showStatus(`Cloud load failed: ${error.message}`, true);
          return {};
        }
      };

      // Auto-save function
      const autoSave = async () => {
        const answers = getCurrentAnswers();

        if (Object.keys(answers).length === 0) return; // No answers to save

        // Save to Firebase if authenticated
        if (currentUser) {
          await saveToFirebase(answers);
        } else {
          showStatus("Progress not synced - sign in to sync");
        }
      };

      // Setup real-time sync for cross-device updates
      const setupRealtimeSync = () => {
        if (!currentUser || realtimeListener) return;

        try {
          const docRef = doc(
            db,
            "users",
            currentUser.uid,
            "quizzes",
            "genchem"
          );

          realtimeListener = onSnapshot(
            docRef,
            (docSnap) => {
              if (!isInitialized) return; // Don't sync during initial load

              if (docSnap.exists()) {
                const data = docSnap.data();
                const answers = data.answers || {};
                const lastUpdated = data.lastUpdated?.toDate();

                // Only sync if data is newer than 5 seconds (avoid sync loops)
                const timeDiff = lastUpdated
                  ? Date.now() - lastUpdated.getTime()
                  : Infinity;
                if (timeDiff > 5000) {
                  applyAnswers(answers);
                  showStatus("Updated");
                }
              }
            },
            (error) => {
              console.error("Real-time sync error:", error);
              showStatus(`Real-time sync error: ${error.message}`, true);
            }
          );

          showStatus("Real-time sync enabled");
        } catch (error) {
          console.error("Failed to setup real-time sync:", error);
          showStatus(`Real-time setup failed: ${error.message}`, true);
        }
      };

      // Cleanup real-time listener
      const cleanupRealtimeSync = () => {
        if (realtimeListener) {
          realtimeListener();
          realtimeListener = null;
        }
      };

      // Sign in handler
      document.getElementById("sign-in-btn").onclick = async () => {
        try {
          showStatus("Signing in...");
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
        } catch (error) {
          console.error("Sign-in error:", error);
          showStatus(`Sign-in failed: ${error.message}`, true);

          // Show helpful error messages
          if (error.code === "auth/popup-blocked") {
            alert(
              "Popup blocked! Please allow popups for this site and try again."
            );
          } else if (error.code === "auth/cancelled-popup-request") {
            showStatus("Sign-in cancelled");
          } else {
            alert(`Sign-in failed: ${error.message}`);
          }
        }
      };

      // Sign out handler
      document.getElementById("sign-out-btn").onclick = async () => {
        try {
          // Save current progress before signing out
          const answers = getCurrentAnswers();
          if (currentUser && Object.keys(answers).length > 0) {
            await saveToFirebase(answers);
          }

          await signOut(auth);
          showStatus("Signed out");
        } catch (error) {
          console.error("Sign-out error:", error);
          showStatus(`Sign-out failed: ${error.message}`, true);
        }
      };

      // Auth state change handler
      onAuthStateChanged(auth, async (user) => {
        currentUser = user;

        if (user) {
          // User signed in
          document.getElementById("signed-out-state").style.display = "none";
          document.getElementById("signed-in-state").style.display = "block";

          // Update UI with user info
          document.getElementById("user-name").textContent =
            user.displayName || "User";
          document.getElementById("user-avatar").textContent =
            (user.displayName || "U")[0].toUpperCase();

          showStatus("Welcome back!");

          // Load progress from cloud and apply it
          const cloudAnswers = await loadFromFirebase();
          if (Object.keys(cloudAnswers).length > 0) {
            applyAnswers(cloudAnswers);
            showStatus("Progress restored from cloud");
          }

          // Setup real-time sync for cross-device updates
          setupRealtimeSync();

          console.log("User signed in:", user.email);
        } else {
          // User signed out
          document.getElementById("signed-out-state").style.display = "block";
          document.getElementById("signed-in-state").style.display = "none";

          // Cleanup real-time sync
          cleanupRealtimeSync();

          console.log("User signed out");
          showStatus("Not syncing");
        }

        isInitialized = true;
      });

      // Auto-save when answers change
      document.addEventListener("change", (e) => {
        if (e.target.type === "radio" && isInitialized) {
          clearTimeout(window.autoSaveTimeout);
          window.autoSaveTimeout = setTimeout(autoSave, 1000); // Save 1 second after change
        }
      });

      // Periodic auto-save every 30 seconds for authenticated users
      setInterval(() => {
        if (isInitialized && currentUser) {
          autoSave();
        }
      }, 30000);

      // Save when tab becomes visible (user returns to page)
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && isInitialized && currentUser) {
          autoSave();
        }
      });

      // Save before page unload
      window.addEventListener("beforeunload", () => {
        if (isInitialized && currentUser) {
          const answers = getCurrentAnswers();
          if (Object.keys(answers).length > 0) {
            // Use sendBeacon for reliable save before unload
            navigator.sendBeacon &&
              navigator.sendBeacon("/save-progress", JSON.stringify(answers));
          }
        }
      });

      console.log("🚀 Quiz sync system initialized");
