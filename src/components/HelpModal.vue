<script setup lang="ts">
import ComboSquare from "./ComboSquare.vue";

const emits = defineEmits(["resetStats", "closeModal"]);

/********************************************************
 * METHODS
 *********************************************************/

/**
 * Resets a user's games tates from localStorage
 */
function handleClearStats() {
  localStorage.removeItem("combarrowStats");

  emits("resetStats");
}
</script>

<template>
  <div class="help-modal">
    <h1 class="modal-header">
      <span>How to Play</span>
      <span class="close-modal" @click="emits('closeModal')">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </h1>

    <div class="modal-body">
      <h5>Introduction</h5>
      <p>Enter the <strong>Combo</strong> as quickly as possible.</p>
      <p>Each <strong>miss</strong> counts against you.</p>
      <p>The quicker you are the better your <strong>score</strong>.</p>

      <div class="divider" />

      <h5>Guide</h5>
      <p>
        When you see an arrow:

        <ComboSquare :direction="38" size="small" />
      </p>
      <p>
        Press the matching arrow on your keyboard to light it up:

        <ComboSquare :direction="38" :active="true" size="small" />
      </p>
      <p>Keep going until you make a <strong>Combo</strong>!</p>

      <div class="divider" />
      <h5>Tips</h5>
      <p>
        Press <strong><code>[return]</code></strong> or
        <strong><code>[space]</code></strong> to start the game.
      </p>

      <div class="divider" />

      <h5>Can you find the secret?</h5>
      <p>
        You must <strong><code>shift</code></strong> your view of
        <strong><code>DOWN</code></strong> <strong><code>DOWN</code></strong
        >&nbsp; <strong><code>UP</code></strong
        >.
      </p>

      <div class="divider" />

      <h5>Want to start fresh?</h5>
      <button @click="handleClearStats">Reset game stats</button>
    </div>
  </div>
</template>

<style scoped>
.help-modal {
  position: fixed;
  padding: 15px;
  top: calc(100vh / 5);
  left: calc(100vw / 3);
  right: calc(100vw / 3);
  background-color: white;
  color: black;
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.75);
}

.close-modal {
  float: right;
}
.close-modal:hover {
  cursor: pointer;
}

.modal-header {
  margin: 0;
  text-align: center;
}

.modal-body p {
  margin: 0;
}

.divider {
  border-top: 1px solid rgb(201, 201, 201);
  margin: 15px 0px;
}

h5 {
  margin: 0;
}
</style>
