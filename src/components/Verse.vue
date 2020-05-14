<template>
  <div>
    <div v-if="verse.chapter" class="chapter">{{verse.chapter}}</div>
    <div class="row">
      <span class="number">{{verseNumber}}</span>
      <span class="text">{{verseText}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Verse",
  props: ["verse"],
  data() {
    return {
      verseNumber: this.verse.ref.split(":")[1],
      verseText:
        this.verse.ref == "Rom. 16:24" ||
        this.verse.ref == "Mark 9:44" ||
        this.verse.ref == "Mark 9:46"
          ? this.verse.text.replace(/\\/g, "").replace(/\//g, "")
          : this.verse.text.replace(/\[/g, "").replace(/\]/g, "")
    };
  }
};
</script>

<style scoped>
.row {
  margin: 17px 10px;
}
.chapter {
  font-size: 20px;
  margin: 0 10px;
  margin-top: 17px;
  font-weight: bold;
}
.number {
  font-size: 12px;
  font-weight: bold;
  vertical-align: top;
  text-align: left;
  margin-right: 5px;
}
/* .text {
  
} */
</style>