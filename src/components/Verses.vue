<template>
  <div>
    <div v-if="loading"></div>
    <Verse v-else v-for="verse in verses" :key="verse.ref" :verse="verse"></Verse>
    <div
      class="copyright"
      v-if="!loading"
    >Verses accessed from the Holy Bible Recovery Version (text-only edition) © 2012 Living Stream Ministry www.lsm.org</div>
  </div>
</template>

<script>
import Bible from "@/components/bible.json";
import Abbreviation from "@/components/abbreviation.json";
import Verse from "@/components/Verse.vue";
export default {
  name: "Verses",
  props: ["verseList"],
  components: {
    Verse
  },
  data() {
    return {
      verses: [],
      loading: false,
      chunkList: {}
    };
  },
  created() {
    this.loading = true;
    this.load();
  },
  methods: {
    async load() {
      await this.format(this.verseList);
      // await console.log(this.chunkList);
      await this.getFirstChunk();
      this.loading = false;
      // console.log(this.chunkList);
      var loop = Object.keys(this.chunkList).length;
      for (var i = 0; i < loop; i++) {
        await this.getFirstChunk();
      }
    },
    async getFirstChunk() {
      var firstKey = Object.keys(this.chunkList)[0];
      var chunkData = this.chunkList[firstKey];
      delete this.chunkList[firstKey];
      var chunks = chunkData.chunks;
      var verseList = [];
      for (var i = 0; i < chunks.length; i++) {
        var data = await this.requestApi(chunks[i]);
        verseList = await [...verseList, ...data.verses];
      }
      verseList[0].chapter = chunkData.title;
      this.verses = [...this.verses, ...verseList];
    },
    // "Matt. 1; Matthew 2:4; Matt. 5:18-20; Psa. 145-146; Psalm 140:12-141:9",
    format(verseList) {
      verseList = verseList.split("; ");
      var numChunks = 0;
      for (var i = 0; i < verseList.length; i++) {
        var str = verseList[i];
        var book = str.substr(0, str.lastIndexOf(" "));
        str = str.substr(str.lastIndexOf(" ") + 1, str.length);
        if (book.includes(".")) {
          book = Abbreviation[book];
        } else if (book == "Psalms") {
          book = "Psalm";
        }
        var countColon = str.split(":").length - 1;
        var countDash = str.split("-").length - 1;

        // Matt. 5:18-20; John 3-4; John 5:12-6:10
        if (countDash == 1) {
          // John 5:12-6:10
          if (countColon == 2) {
            var strDash = str.split("-");
            var strColon1 = strDash[0].split(":");
            var strColon2 = strDash[1].split(":");
            this.chunkify(
              numChunks,
              book,
              strColon1[0],
              strColon1[1],
              true,
              true
            );
            this.chunkify(
              numChunks + 1,
              book,
              strColon2[0],
              1,
              strColon2[1],
              true
            );
            numChunks += 2;
            // Matt. 5:18-20
          } else if (countColon == 1) {
            strDash = str.split("-");
            strColon1 = strDash[0].split(":");
            this.chunkify(
              numChunks,
              book,
              strColon1[0],
              strColon1[1],
              strDash[1],
              true
            );
            numChunks++;
            // John 3-4
          } else {
            strDash = str.split("-");
            this.chunkify(numChunks, book, strDash[0]);
            this.chunkify(numChunks + 1, book, strDash[1]);
            numChunks += 2;
          }
          // Matt. 1; Matthew 2:4;
        } else {
          if (countColon == 1) {
            var strColon = str.split(":");
            this.chunkify(
              numChunks,
              book,
              strColon[0],
              strColon[1],
              strColon[1],
              true
            );
            numChunks++;
            // Matt. 1
          } else {
            this.chunkify(numChunks, book, str);
            numChunks++;
          }
        }
      }
    },
    chunkify(order, book, chapter, begin = 1, end = true, title = false) {
      var chunks = [];
      if (book == "Psalms") {
        book = "Psalm";
      }
      if (end == true) {
        end = Bible[book][chapter];
      }
      var start = begin;
      if (end - start >= 30) {
        while (start + 29 < end) {
          chunks = [...chunks, `${book} ${chapter}:${start}-${start + 29}`];
          start += 30;
        }
      }
      chunks = [...chunks, `${book} ${chapter}:${start}-${end}`];

      if (title) {
        if (begin == end) {
          title = `${book} ${chapter}:${begin}`;
        } else {
          title = `${book} ${chapter}:${begin}-${end}`;
        }
      } else {
        title = `${book} ${chapter}`;
      }
      this.chunkList[order] = {
        numVerses: `${end - begin + 1}`,
        title: title,
        chunks: chunks
      };
    },

    async requestApi(section) {
      const urlBase = "https://api.lsm.org/recver.php?String='";
      const option = "'&Out=json";

      try {
        const response = await fetch(`${urlBase}${section}${option}`);

        try {
          const data = await response.clone().json();
          return data;
        } catch (error) {
          const resText = await response.text();

          const data = JSON.parse(
            resText
              .toString()
              .replace(/"\\\[/gi, '"[')
              .replace(/\\\]"/gi, ']"')
          );
          return data;
        }
      } catch (error) {
        console.log(error);
        alert("Refresh page, internet connection lost.");
      }
    }
  }
};
</script>
<style scoped>
.copyright {
  font-size: 12px;
  text-align: center;
}
</style>