// store/index.js

import Vue from "vue";
import Vuex from "vuex";
import plan from '@/store/plan.json';

Vue.use(Vuex);

const axios = require("axios");

export default new Vuex.Store({
  state: {
    // Visibilty states
    mainView: true,
    isChapter: false,
    buttonVisible: false,
    // current book & chapter
    bookName: "",
    chapterNum: 0,
    // data for plan, bibleBook, and verseView components
    sections: [],
    plan: plan,
    today: 0,
    books: [
      { name: "Genesis", chapters: 50, abbrev: "Gen"},
      { name: "Exodus", chapters: 40, abbrev: "Exo"},
      { name: "Leviticus", chapters: 27, abbrev: "Lev"},
      { name: "Numbers", chapters: 36, abbrev: "Num"},
      { name: "Deuteronomy", chapters: 34, abbrev: "Deut"},
      { name: "Joshua", chapters: 24, abbrev: "Josh"},
      { name: "Judges", chapters: 21, abbrev: "Judg"},
      { name: "Ruth", chapters: 4, abbrev: "Ruth"},
      { name: "1 Samuel", chapters: 31, abbrev: "1 Sam"},
      { name: "2 Samuel", chapters: 24, abbrev: "2 Sam"},
      { name: "1 Kings", chapters: 22, abbrev: "1 Kings"},
      { name: "2 Kings", chapters: 25, abbrev: "2 Kings"},
      { name: "1 Chronicles", chapters: 29, abbrev: "1 Chron"},
      { name: "2 Chronicles", chapters: 36, abbrev: "2 Chron"},
      { name: "Ezra", chapters: 10, abbrev: "Ezra"},
      { name: "Nehemiah", chapters: 13, abbrev: "Neh"},
      { name: "Esther", chapters: 10, abbrev: "Esth"},
      { name: "Job", chapters: 42, abbrev: "Job"},
      { name: "Psalms", chapters: 150, abbrev: "Psa"},
      { name: "Proverbs", chapters: 31, abbrev: "Prov"},
      { name: "Ecclesiastes", chapters: 12, abbrev: "Eccl"},
      { name: "Song of Solomon", chapters: 8, abbrev: "SS"},
      { name: "Isaiah", chapters: 66, abbrev: "Isa"},
      { name: "Jeremiah", chapters: 52, abbrev: "Jer"},
      { name: "Lamentations", chapters: 5, abbrev: "Lam"},
      { name: "Ezekiel", chapters: 48, abbrev: "Ezek"},
      { name: "Daniel", chapters: 12, abbrev: "Dan"},
      { name: "Hosea", chapters: 14, abbrev: "Hosea"},
      { name: "Joel", chapters: 3, abbrev: "Joel"},
      { name: "Amos", chapters: 9, abbrev: "Amos"},
      { name: "Obadiah", chapters: 1, abbrev: "Oba"},
      { name: "Jonah", chapters: 4, abbrev: "Jonah"},
      { name: "Micah", chapters: 7, abbrev: "Micah"},
      { name: "Nahum", chapters: 3, abbrev: "Nahum"},
      { name: "Habakkuk", chapters: 3, abbrev: "Hab"},
      { name: "Zephaniah", chapters: 3, abbrev: "Zeph"},
      { name: "Haggai", chapters: 2, abbrev: "Hag"},
      { name: "Zechariah", chapters: 14, abbrev: "Zech"},
      { name: "Malachi", chapters: 4, abbrev: "Mal"},
      { name: "Matthew", chapters: 28, abbrev: "Matt"},
      { name: "Mark", chapters: 16, abbrev: "Mark"},
      { name: "Luke", chapters: 24, abbrev: "Luke"},
      { name: "John", chapters: 21, abbrev: "John"},
      { name: "Acts", chapters: 28, abbrev: "Acts"},
      { name: "Romans", chapters: 16, abbrev: "Rom"},
      { name: "1 Corinthians", chapters: 16, abbrev: "1 Cor"},
      { name: "2 Corinthians", chapters: 13, abbrev: "2 Cor"},
      { name: "Galatians", chapters: 6, abbrev: "Gal"},
      { name: "Ephesians", chapters: 6, abbrev: "Eph"},
      { name: "Philippians", chapters: 4, abbrev: "Phil"},
      { name: "Colossians", chapters: 4, abbrev: "Col"},
      { name: "1 Thessalonians", chapters: 5, abbrev: "1 Thes"},
      { name: "2 Thessalonians", chapters: 3, abbrev: "2 Thes"},
      { name: "1 Timothy", chapters: 6, abbrev: "1 Tim"},
      { name: "2 Timothy", chapters: 4, abbrev: "2 Tim"},
      { name: "Titus", chapters: 3, abbrev: "Titus"},
      { name: "Philemon", chapters: 1, abbrev: "Philem"},
      { name: "Hebrews", chapters: 13, abbrev: "Heb"},
      { name: "James", chapters: 5, abbrev: "James"},
      { name: "1 Peter", chapters: 5, abbrev: "1 Pet"},
      { name: "2 Peter", chapters: 3, abbrev: "2 Pet"},
      { name: "1 John", chapters: 5, abbrev: "1 John"},
      { name: "2 John", chapters: 1, abbrev: "2 John"},
      { name: "3 John", chapters: 1, abbrev: "3 John"},
      { name: "Jude", chapters: 1, abbrev: "Jude"},
      { name: "Revelation", chapters: 22, abbrev: "Rev"},
    ],
  },

  actions: {
  // async Break verse list sections by book & chapter then getVerses()
  // "Matt. 1; Matthew 2:4; Matt. 5:18-20; Psa. 145-146; Psalm 140:12-141:9"
  async getVerseList({dispatch, state}, verseString){
    
    var bookName = 'John' // Default John

    // Split into sectons: [Matt. 1, ..., Psalm 140:12-141:9] and remove spaces & switch commas to ;* & lowercase everything
    var verseList = verseString.replace(/ /g, "").replace(/;/g, ";").replace(/\./g, "").replace(/,/g, ";*").toLowerCase().split(';');

    // Loop through verseList
    for (var i = 0; i < verseList.length; i++) {

      // Split by first non alphabetic character into bookstring and section
      var str = verseList[i]
      var splitIndex = str.substring(1).search(/[^A-Za-z]/) + 1
      if (splitIndex == 1) {
        splitIndex = 0
      }
      var bookString = str.substr(0, splitIndex)
      var section = str.substr(splitIndex, str.length);
      
      // Replace any abbreviations
      if (bookString == 'Psalm') {
        bookName = 'Psalms'
      }
      state.books.forEach(book => {
        if (bookString == book.abbrev.replace(/ /g, "").toLowerCase()) {
          bookName = book.name
        } else if (bookString == book.name.replace(/ /g, "").toLowerCase()) {
          bookName = bookString
        }
      });

      // If section has a * replace with chapter number and ":"
      if (section.includes('*')) {
        section = section.replace(/\*/g, chapterNum+":")
      }

      // Check if colons and dashes in section
      var countDash =  (section.match(/-/g)||[]).length;
      var countColon = (section.match(/:/g)||[]).length;

      // Initialize vars
      var chapterNum
      var start
      var end
      var sectionTitle = true

      // John 5:12-6:10
      if (countDash == 1 && countColon == 2) {
        // Split into chapter and verse
        [chapterNum, start] = section.split("-")[0].split(':');
        await dispatch("getVerses", {bookName,chapterNum,start,sectionTitle});
        [chapterNum, end] = section.split("-")[1].split(':');
        start = 1
        await dispatch("getVerses", {bookName,chapterNum,start,end,sectionTitle});
      }

      // Matt. 5:18-20
      else if (countDash == 1 && countColon == 1) {
        [chapterNum, start] = section.split("-")[0].split(':');
        end = section.split("-")[1];
        await dispatch("getVerses", {bookName,chapterNum,start,end,sectionTitle});
      }

      // John 3-4
      else if (countDash == 1 && countColon == 0) {
        var chapterStart = parseInt(section.split("-")[0])
        var chapterEnd   = parseInt(section.split("-")[1])
        for (chapterNum = chapterStart; chapterNum<=chapterEnd; chapterNum++) {
          await dispatch("getVerses", {bookName,chapterNum}); 
        }
      }

      // Matthew 2:4;
      else if (countDash == 0 && countColon == 1) {
        [chapterNum, start] = section.split(":");
        end = start
        await dispatch("getVerses", {bookName,chapterNum,start,end,sectionTitle});
      }
      
      // Matt. 1
      else if (countDash == 0 && countColon == 0) {
        chapterNum = section;
        await dispatch("getVerses", {bookName,chapterNum});
      }
    }
  },

  async getVerses({commit}, payload) {
    // Set default values
    var {bookName, chapterNum, start=1, end, sectionTitle=false, resetVerses=false} = payload
    if (resetVerses) {
      commit('RESET_Verses')
    }
    
    // make sure proper integer formats
    chapterNum = parseInt(chapterNum)
    start = parseInt(start)

    // last possible verse Psa. 119:176  // Second longest book Numbers 7:89
    if (end === undefined) {
      if (bookName == 'Psalms' && chapterNum == '119'){
        end = 176
      } else {
        end = 89
      }
    } else {
      end = parseInt(end)
    }

    // If section title requested (true: Genesis 1:1-26) else print Genesis 1
    if (sectionTitle == false){
      var title = bookName + " "+chapterNum
    }
    else {
      title = bookName + " "+chapterNum+":"+start
      if (end != start) {
        title += "-"+end
      }
    }

    //Try catch block to log and capture errors
    try {
      /*
        * Takes a specific api request to get a certain range of verses. Only 30 verses can be fetched
        * at a time. The await keyword is crucial as it allows each axios request to complete before
        * moving to the next one. Storing the requests inside an array assures the verses are printed in
        * the proper order
        */

    // Make requests in sections or 30 or less verses i.e. 1-29
    // If next == end, we have finished looping else
    // Select next 30 verses unless end is reached
    var next = 0
    while (next != end ) {
      next = start+29
      if (next > end) {
        next = end
      }
      // Make axios request ie. Genesis 4:5-20 https://api.lsm.org/recver.php?String=Genesis 4:5-20&Out=json
      const response = await axios.get(`https://api.lsm.org/recver.php?String=${bookName} ${chapterNum}:${start}-${next}&Out=json`)
      var data = response.data

      // The response format is a "\[ *verse* \]" string returned for "Rom. 16:24", "Mark 9:44", and "Mark 9:46" for json parsing
      // The replace function will look for all backslashes and replace them with nothing
      // Then the JSON.parse function will turn the json string variable into an array
      if(typeof data == "string") {
        console.log(data)
        var removeSlash = data.replace(/\\/g, "").replace(/\//g, "")
        data = JSON.parse(removeSlash)
      }

      // For each verse remove [ and ] except for "Rom. 16:24", "Mark 9:44", and "Mark 9:46"
      // Find then remove all verses that do not exist: "No such verse..."
      for (var index = 0; index < data.verses.length; index++) {
        var verse = data.verses[index];
        if (verse.ref !="Rom. 16:24" && verse.ref !="Mark 9:44" && verse.ref !="Mark 9:46") {
          verse.text = verse.text.replace(/\[/g, "").replace(/\]/g, "")
        }
        if (verse.text.startsWith("No such verse")) {
          break
        }
      }
      data.verses = data.verses.slice(0,index)

      // Create payload for mutation: object with title & verses
      var section = {
        title: title,
        verses: data.verses
      }
      // Commit if request is not empty ie. no verses
      if (section.verses.length != 0) {
        commit('SET_VERSES', section)
      }
      
      // Disable title for the following requests ie. for Genesis 1:1-35 disable for 1:31-35
      title = ""
      start += 30;
    }
    } catch (error) {
      console.log(error)
    }
    commit('FINISHED_LOADING_SECTION')
  },
  },

  mutations: {
    RELOAD_PAGE(state) {
      state.isChapter=false
      state.mainView=true
      state.buttonVisible=false
      state.sections = []
    },

    RESET_Verses(state) {
      state.buttonVisible = false
      state.sections = []
    },

    SET_TODAYSREADING(state,today) {
      state.today = today
    },

    SET_VERSES(state, section){
      state.sections.push(section)
    },
    
    // When a user presses the button of a chapter number this variable sets to false and hides
    // the Bible book component
    CHAPTER_SELECTED(state, payload) {
      var {bookName, chapterNum} = payload
      state.bookName = bookName
      state.chapterNum = chapterNum
      state.mainView = false
      state.isChapter = true
    },

    PLAN_SELECTED(state) {
      state.mainView = false
    },

    FINISHED_LOADING_SECTION(state){
      state.buttonVisible = true
    }
  },

});
