<template>
  <div v-show="$store.state.mainView">
    <div style="position:fixed; top:60px; width:80%; left: 10%">
      <h3>Enter verses to look up below:</h3>
      <b-form-textarea
        id="textarea"
        v-model="text"
        placeholder="Example: Matt. 1; Matthew 2:4; Matt. 5:18-20; Psa. 145-146; Psalm 140:12-141:9"
        rows="3"
        max-rows="6">
      </b-form-textarea>
      <b-button block variant="primary" @click="getVerseList(text)">Get Verses!</b-button>
    </div>
  </div>
</template>


<script>
export default {
  name:"Lookup",
  data() {
    return {
      text: "",
    };
  },
  
  mounted() { 
  },

  methods:{
    getVerseList(verseList){
      if (verseList == '') {
        verseList = '1 Cor. 15:45'
      }
      this.$store.commit("PLAN_SELECTED")
      this.$store.dispatch("getVerseList", verseList);
      this.$gtag.event('LOOKUP_SELECTED', {
           'event_category' : 'Lookup',
           'event_label' : verseList,
      });
    },
  },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
