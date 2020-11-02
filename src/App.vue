<template>
  <div id="app">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <!--isVisible variable ensures that either the BibleBook or the Plan components will be visible at a time-->
    <button
      class="buttontab"
      style="left:0"  
      v-on:click="show = 'Bible';scrollTop()" 
      v-show="$store.state.mainView">
    
      Bible
     
    </button>

    <button 
      class="buttontab" 
      style="left:33.4%"  
      v-on:click="show = 'Plan';readToday()" 
      v-show="$store.state.mainView">
      Reading Plan
    </button>   

    <button 
      class="buttontab" 
      style="right:0"  
      v-on:click="show = 'Lookup'" 
      v-show="$store.state.mainView">
      Lookup-Verses
    </button>


      <!--Use v-show instead of v-if for faster rendering-->
      <div v-show="show=='Bible'"><BibleBook/><VerseView/></div>
      <div v-show="show=='Plan'"><Plan ref="plan-ref"/><VerseView/></div>
      <div v-show="show=='Lookup'"><Lookup/><VerseView/></div>
    
  </div>
</template>

<script>
import BibleBook from './components/BibleBook.vue'
import Plan from './components/Plan.vue'
import Lookup from './components/Lookup.vue'
import VerseView from './components/VerseView.vue'
export default {
  name: 'App',
  data:function(){
    return{
    show: 'Lookup'
    }
  },
  components: {
   BibleBook,
   Plan,
   Lookup,
   VerseView,
  },
  methods: {
    scrollTop() {
      window.scrollTo(0,0);
    },
    readToday() {
        var element = this.$refs["plan-ref"].$refs["day-ref-"+this.$store.state.today];
        this.$nextTick(function () {
          var top = element[0].offsetTop;
          window.scrollTo({
            top: top,
            behavior: 'smooth'
          });
        })
    }
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
div {
  top:52px;
}
.buttontab{
  position: fixed;
  top:0;
  z-index: 100;
  width:33%;
  color: white;
  height: 50px;
  background-color: #4F5378 !important;
  border-style:solid !important;
  border-width: thin !important;
  outline: none;
}

</style>
