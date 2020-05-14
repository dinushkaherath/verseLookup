<template>
  <div id="app">
    <div class="tabs">
      <div v-if="tabs" class="tab">Select Verses</div>
      <div v-if="!tabs" @click="reset()">
        <img src="@/ic_chevron_right_48px.svg" alt />
      </div>
      <div v-if="verseBar" class="bar">Selected Verses</div>
    </div>
    <form v-if="tabs" id="app" @submit.prevent="submitVerseList">
      <p>Example: Matt. 1; Matthew 2:4; Matt. 5:18-20; Psa. 145-146; Psalm 140:12-141:9</p>
      <p>
        <label for="verseList">Enter Verses:</label>
        <input v-model="verseList" type="text" name="verseList" />
      </p>
      <p>
        <input type="submit" value="Submit" />
      </p>
    </form>
    <Verses v-if="!tabs" :verseList="verse" />
  </div>
</template>

<script>
import Verses from "@/components/Verses.vue";
export default {
  name: "App",
  components: {
    Verses
  },
  data: () => {
    return {
      tabs: true,
      verseBar: false,
      verse: "Isaiah 24:21-25:12"
    };
  },
  methods: {
    submitVerseList() {
      this.verse = this.verseList;
      this.tabs = false;
      this.verseBar = true;
    },
    reset() {
      this.tabs = true;
      this.verseBar = false;
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  font-family: "Lora", "Georgia", "Times New Roman", serif;
}
body {
  margin: 0;
  position: relative;
  top: 52px;
  background-color: rgb(246, 246, 246);
}
.tabs {
  position: fixed;
  background-color: #0b1b27;
  display: flex;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100%;
}

.tab {
  color: #26ffd4;
  font-size: 1.2rem;
  font-weight: bold;
  justify-content: center;
  padding: 15px;
  width: 100%;
  display: flex;
}
.bar {
  position: relative;
  color: #26ffd4;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 15px;
  justify-content: center;
  width: 100%;
  display: flex;
}
form {
  align-items: center;
}
</style>

<style scoped>
img {
  width: 30px;
  height: 30px;
  margin: 10px;
  transform: translateY(0%) rotate(180deg);
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(10deg) brightness(104%)
    contrast(102%);
}
</style>
