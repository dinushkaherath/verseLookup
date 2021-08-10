<template>
  <!--buttonVisible variable becomes true after Bible text is rendered. This
      ensures that all the buttons won't appear before the text does-->
  <div v-show="buttonVisible">
    <b-button
      class="return_button" 
      block variant="primary" 
      v-on:click="reloadPage()">
      <i class="fa fa-angle-left" style="float:left"></i>
    Main Page
    </b-button>
    
    <br> 
    <div v-for="section in sections" :key="section.id">
      <span v-if="section.title != ''">
    <h3>{{section.title}}</h3>
    </span>
    <p 
      style="" 
      v-for="(verse, i) in section.verses" 
      :key="i+verse.ref">
      <sup>{{verse.ref.split(':')[1]}}</sup>
      {{" "+ verse.text}}
    </p>
    </div>

    <br>
    <div v-show="isChapter" class="navbuttons">
      <transition name ="fade">
      <b-button-toolbar 
          class="center" 
          key-nav aria-label="Toolbar with button groups">
        <b-button-group class="mx-1">
          <b-button pill class="rounded" 
            v-on:click.passive="navigate('previousBook');">&laquo;
          </b-button>
        
          <b-button pill class="rounded" 
            v-on:click.passive="navigate('previousChapter');">&lsaquo;
          </b-button>
        </b-button-group>
        
        <b-button-group class="mx-2">
          <b-button pill class="rounded" 
            v-on:click.passive="navigate('nextChapter');">&rsaquo;
          </b-button>
        
          <b-button pill class="rounded" 
            v-on:click.passive="navigate('nextBook');">&raquo;
          </b-button>
        </b-button-group>
      </b-button-toolbar>     
      </transition>
    </div>
    <div class="copyright">
      Verses accessed from the Holy Bible Recovery Version (text-only edition) ©
      2021 Living Stream Ministry www.lsm.org
    </div>
  </div>
</template>


<script>
import {mapState} from 'vuex'

  export default {
  name:"VerseView",

  computed: {
    ...mapState([
      'sections',
      'buttonVisible',
      'isChapter',
      ])
    },

  methods:{
    // navigate previous or next book or chapter
    async navigate(instruction) {
      var books = this.$store.state.books
      var bookName = this.$store.state.bookName
      var chapterNum = this.$store.state.chapterNum
      var index = books.findIndex(book => book.name === bookName)
      var totalChapters = books[index].chapters
      var resetVerses = true

      // Set Book & Chapter depending on instruction
      // Instructions: previousChapter, previousBook, nextBook, nextChapter
      
      // Switch statements behave just like an if /else statement 
      switch (instruction) {
        case 'previousChapter':
	// If not the first chapter go previous chapter
        if (chapterNum != 1) {
          chapterNum -= 1
        }
        
	else if (bookName=='Genesis' && chapterNum == 1){
	
	bookName = 'Revelation'
	chapterNum = 22
	}
	else {
	index -= 1
            bookName = books[index].name
            chapterNum = 1
          chapterNum = books[index].chapters

          
        }
	break; 
      case 'nextChapter':
        // If not the last chapter go next chapter
        if (chapterNum != totalChapters) {
          chapterNum += 1
        }
        
        else if (bookName == 'Revelation' && chapterNum==books[index].chapters){
		bookName = 'Genesis'
		chapterNum = 1

	}
	else {
          
            index += 1
            bookName = books[index].name
            chapterNum = 1
 
        }
      break;
      case 'previousBook':
        // If not Genesis go to previous book
        if(bookName == 'Genesis') {
            bookName = 'Revelation'
          chapterNum = 1
          }

	else{
          index -= 1
          bookName = books[index].name
          chapterNum = 1
	//chapterNum = books[index].chapters
        }

      break;
      case 'nextBook': 
        // If not Revelation go to next book
        if (bookName != 'Revelation') {
          index += 1
          bookName = books[index].name
          chapterNum = 1
        }
	// If book is Revelation go to Genesis
        else {
          bookName = 'Genesis'
	chapterNum = 1
        }
      }
      this.$store.commit('CHAPTER_SELECTED', {bookName, chapterNum})
      await this.$store.dispatch("getVerses", {bookName, chapterNum, resetVerses})
    },

  reloadPage(){
    this.$store.commit('RELOAD_PAGE')
    }
  }
} 


</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active, .fade-leave-active {
       transition: opacity 10s;
     }
     .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
       opacity: 0;
     }

div.navbuttons
{
  position: fixed;
  bottom: 60px;
  display:flex;
  align-items:flex-end;
  left: 15px;
}

.mx-2{
left:175px;
}

.return_button{
  background-color:gray;
  color:white;
  border-style:none;
  height: 42px;
  position: sticky;
  top: 0;
}

.rounded{
margin-right: 10px;
}

button{
   background-color: rgb(48, 65, 72, 1.0) !important;

}

h3, p{
  text-align:left; margin-left:15px; margin-right:10px;
}
</style>
