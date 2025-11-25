"use strict";

// === GLOBALS ===

const apiUrl =
  "https://script.google.com/macros/s/AKfycbxFkuUCicPuGRH4JXykY-_zB0rLiC6IR__2RPfEz7rlmU3E79euDyMGOVmHWthgAIflEg/exec";
var id;

const snowflakeContainer = document.querySelector("#snowflakes");

/**
 * Runs at the start of the session. Gets and displays ID, and handles some setup
 */
function onLoad() {
  // Get data from URL parameters
  const params = new URLSearchParams(window.location.search);
  id = params.get("id") ?? "[ID NOT FOUND]";

  // Set content
  document.querySelector("#idContainer").innerText = id;

  // Start spawning snowflakes
  spawnSnowflake();
}

/**
 * Runs when the "Get name"-button is pressed. Contacts the backend and displays the recieved name
 */
async function onGetName() {
  const button = document.querySelector("#inputButton"),
    result = document.querySelector("#resultContent"),
    loadingAnim = document.querySelector("#loadingAnimation");

  // Enable loading animation
  button.classList.add("hidden");
  loadingAnim.classList.remove("hidden");

  try {
    // Request and await result from backend
    const resp = await fetch(apiUrl + "?id=" + id);

    // Set result text
    if (resp.ok) {
      // Get JSON
      const answerJson = await resp.json();

      if (answerJson.status == "success") {
        result.innerHTML = `<p>Hello ${answerJson.santaName},</p><p>You will be giving a present to ${answerJson.targetName}!</p><p>${answerJson.message}</p>`;
      } else {
        result.innerHTML = `<p>Backend error: ${answerJson.message}</p>`;
      }
    } else {
      result.innerHTML =
        "<p>Error in GET, please contact the organizer or try again later.</p>";
    }
  } catch (e) {
    result.innerHTML = `<p>Error in script. This is usually caused by the web API being shaky, try reloading and clicking again.<br/><br><i>Full error message: ${e.message}</i></p>`;
  }

  // Toggle visibility of button/content
  loadingAnim.classList.add("hidden");
  result.classList.remove("hidden");
}

/**
 * Creates a decorative snowflake, then calls itself after a while again
 */
function spawnSnowflake() {
  // Create the basic element
  const flake = document.createElement("img");
  flake.src = "snowflake_white.svg";
  flake.classList.add("snowflake");

  // Place in a random spot
  flake.style.left = Math.random() * snowflakeContainer.offsetWidth + "px";
  flake.style.top = Math.random() * snowflakeContainer.offsetHeight + "px";

  // Schedule destruction after animation finishes
  flake.addEventListener("animationend", () => flake.remove());

  // Add to snowflakes node
  snowflakeContainer.appendChild(flake);

  // Add another one in a while
  setTimeout(spawnSnowflake, 1000);
}

// Run the onLoad method
onLoad();
