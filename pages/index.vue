<template>
  <div class="relative h-screen">
    <div class="header bg-myblack fixed flex items-center h-16 w-full z-50">
      <div class="container mx-auto flex items-center">
        <!-- Navbar -->
        <div class="navbar relative top-0 container h-10 mx-auto flex items-center justify-between z-10">
          <h2 class="text-4xl text-white">
            Notes
          </h2>
        </div>
        <!-- Button to add new note -->
        <div class="filter-note-btn relative h-10 -top-20 container mx-auto z-10">
          <input
            id="search"
            v-model="searchValue"
            type="text"
            name="search"
            placeholder="Search a note..."
            autocomplete="off"
            class="absolute top-6 right-0 h-10 w-64 rounded-lg pl-3 bg-mydark outline-none z-50"
            :class="{ 'hide' : showSearch }"
            @keyup="filterNote"
          >
          <div class="search-icon absolute right-0 mr-5 mt-16 top-5 h-10 w-10 rounded-lg bg-mydark flex items-center justify-center" @click="showSearchBar">
            <svg viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M349.714 347.937l93.714 109.969-16.254 13.969-93.969-109.969q-48.508 36.825-109.207 36.825-36.826 0-70.476-14.349t-57.905-38.603-38.603-57.905-14.349-70.476 14.349-70.476 38.603-57.905 57.905-38.603 70.476-14.349 70.476 14.349 57.905 38.603 38.603 57.905 14.349 70.476q0 37.841-14.73 71.619t-40.889 58.921zM224 377.397q43.428 0 80.254-21.461t58.286-58.286 21.461-80.254-21.461-80.254-58.286-58.285-80.254-21.46-80.254 21.46-58.285 58.285-21.46 80.254 21.46 80.254 58.285 58.286 80.254 21.461z" fill="#fff" fill-rule="#fff"></path></svg>
          </div>
        </div>
      </div>
    </div>
    <button class="add-new-note-btn fixed flex items-center bottom-12 text-white font-semibold bg-mydark px-5 py-2 rounded-xl z-50" @click="createNote">
      New note <span class="text-xl ml-3">+</span>
    </button>
    <button class="add-new-note-mob-btn fixed flex items-center justify-center bottom-10 text-white font-medium bg-mydark px-4 py-2 rounded-full z-50" @click="createNote">
      <span class="text-4xl">+</span>
    </button>
    <!-- Form to diplay when typing new note -->
    <div v-show="newNote" class="new-note fixed top-0 left-0 h-screen flex items-center justify-center bg-mygreen z-50">
      <div class="form-field border border-mydark bg-myblack rounded-xl">
        <div class="form-nav w-full h-12 mt-4 flex items-center justify-between">
          <div class="cancel-btn ml-4">
            <button class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl" @click="cancelCreateNote">
              cancel
            </button>
          </div>
          <div class="save-btn mr-4">
            <button class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl" @click="saveNote">
              save
            </button>
          </div>
        </div>
        <div class="form px-5 mt-8">
          <input
            id="title"
            type="text"
            name="title"
            autocomplete="off"
            placeholder="Title"
            class="outline-none w-full h-12 bg-transparent text-3xl text-white"
          >
          <textarea id="text" name="text" placeholder="Type something..." class="outline-none w-full h-72 text-white text-lg pt-2 mt-4 bg-transparent"></textarea>
        </div>
        <div class="color-palette flex w-full px-5">
          <div class="green w-7 h-7 rounded-full border border-white bg-mygreen" @click="chooseColorGreen"></div>
          <div class="red w-7 h-7 rounded-full border border-white bg-myred ml-4" @click="chooseColorRed"></div>
          <div class="fade-brown w-7 h-7 rounded-full border border-white bg-myfade-brown ml-4" @click="chooseColorFade"></div>
          <div class="bold-brown w-7 h-7 rounded-full border border-white bg-mybold-brown ml-4" @click="chooseColorBold"></div>
        </div>
      </div>
    </div>
    <!-- Display when there is no note to display -->
    <div
      v-show="notes.length === 0"
      class="empty-note absolute top-0 left-0 h-screen w-screen flex flex-col items-center justify-center"
    >
      <img src="~/assets/icons/warning.svg" alt="warming icon" class="w-14">
      <p class="text-white text-lg mt-4">
        No note saved.
      </p>
    </div>
    <!-- Display when there is notes saved -->
    <div v-show="notes.length !== 0" class="notes absolute left-0 top-20 z-20">
      <div class="notes-list relative sm:container w-11/12 mx-auto pt-16 sm:pl-3 lg:pl-10 flex flex-wrap">
        <div v-for="(item, index) in filterResult" :key="index" class="notes-item relative sm:w-72 md:w-60 lg:w-56 p-4 mr-2 sm:mr-0 sm:ml-2 mt-2 rounded-xl z-10" :class="`bg-${item.bgColor}`" @click="showDetail(item.title, index)">
          <h2 class="note-item-title text-2xl font-medium leading-6">
            {{ item.title }}
          </h2>
          <p class="text-lg text-mydark font-medium mt-2">{{ item.date }}</p>
        </div>
      </div>
    </div>
    <!-- Display the note details -->
    <div v-show="showNoteDetail" class="new-note fixed top-0 left-0 h-screen flex items-center justify-center bg-mygreen z-50">
      <div class="form-field border border-mydark bg-myblack rounded-xl">
        <div class="form-nav w-full h-12 mt-4 flex items-center justify-between">
          <div class="cancel-btn ml-4">
            <button class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl" @click="closeNote">
              close
            </button>
          </div>
          <div class="save-btn mr-4 flex items-center">
            <button class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl" @click="deleteNote(indexInNotes, indexInFilter)">
              <img src="~/assets/icons/trash.svg" alt="trash icon" class="w-6 h-6 py-1">
            </button>
            <button
              class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl ml-2"
              @click="editNote(indexInNotes)"
            >
              edit
            </button>
          </div>
        </div>
        <div class="form relative px-5 mt-8">
          <h2 class="title text-3xl text-white font-medium">
            {{ noteDetail.title }}
          </h2>
          <p class="date text-mydark text-lg font-medium mt-4">
            {{ noteDetail.date }}
          </p>
          <p class="content h-72 text-lg text-mygray font-normal mt-4">
            {{ noteDetail.content }}
          </p>
        </div>
      </div>
    </div>
    <!-- Form to edit the note create -->
    <div v-show="edit" class="new-note fixed top-0 left-0 h-screen flex items-center justify-center bg-mygreen z-50">
      <div class="form-field border border-mydark bg-myblack rounded-xl">
        <div class="form-nav w-full h-12 mt-4 flex items-center justify-between">
          <div class="cancel-btn ml-4">
            <button class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl" @click="cancelEditNote">
              cancel
            </button>
          </div>
          <div class="save-btn mr-4">
            <button class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl" @click="saveEditNote(indexInNotes, indexInFilter)">
              save
            </button>
          </div>
        </div>
        <div class="form px-5 mt-8">
          <input
            id="editTitle"
            type="text"
            name="title"
            autocomplete="off"
            placeholder="Title"
            class="outline-none w-full h-12 bg-transparent text-3xl text-white"
          >
          <textarea id="editText" name="text" placeholder="Type something..." class="outline-none w-full h-72 text-white text-lg pt-2 mt-4 bg-transparent"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      newNote: false,
      edit: false,
      color: 'myfade-brown',
      notes: [],
      noteDetail: '',
      noteIndex: 0,
      indexInFilter: 0,
      indexInNotes: 0,
      showNoteDetail: false,
      searchValue: '',
      filterResult: '',
      showSearch: true
    }
  },
  mounted () {
    if (localStorage.getItem('notes')) {
      this.showSearch = true
      this.notes = JSON.parse(localStorage.getItem('notes'))
      this.filterResult = JSON.parse(localStorage.getItem('notes'))
    }
  },
  methods: {
    // filter function
    filterNote () {
      if (this.searchValue === '') {
        this.filterResult = this.notes
        // this.notes = JSON.parse(localStorage.getItem('notes'))
      }
      this.filterResult = this.filterResult.filter(item => item.title.toLowerCase().includes(this.searchValue))
    },
    // funtion to show new note form
    createNote () {
      this.newNote = !this.newNote
      this.color = 'myfade-brown'
      const title = document.querySelector('#title')
      const content = document.querySelector('#text')
      title.value = ''
      content.value = ''
    },
    chooseColorGreen () {
      this.color = 'mygreen'
      const green = document.querySelector('.green')
      const red = document.querySelector('.red')
      const fadeBrown = document.querySelector('.fade-brown')
      const BoldBrown = document.querySelector('.bold-brown')
      green.style.borderWidth = '3px'
      red.style.borderWidth = '1px'
      fadeBrown.style.borderWidth = '1px'
      BoldBrown.style.borderWidth = '1px'
    },
    chooseColorRed () {
      this.color = 'myred'
      const green = document.querySelector('.green')
      const red = document.querySelector('.red')
      const fadeBrown = document.querySelector('.fade-brown')
      const BoldBrown = document.querySelector('.bold-brown')
      green.style.borderWidth = '1px'
      red.style.borderWidth = '3px'
      fadeBrown.style.borderWidth = '1px'
      BoldBrown.style.borderWidth = '1px'
    },
    chooseColorFade () {
      this.color = 'myfade-brown'
      const green = document.querySelector('.green')
      const red = document.querySelector('.red')
      const fadeBrown = document.querySelector('.fade-brown')
      const BoldBrown = document.querySelector('.bold-brown')
      green.style.borderWidth = '1px'
      red.style.borderWidth = '1px'
      fadeBrown.style.borderWidth = '3px'
      BoldBrown.style.borderWidth = '1px'
    },
    chooseColorBold () {
      this.color = 'mybold-brown'
      const green = document.querySelector('.green')
      const red = document.querySelector('.red')
      const fadeBrown = document.querySelector('.fade-brown')
      const BoldBrown = document.querySelector('.bold-brown')
      green.style.borderWidth = '1px'
      red.style.borderWidth = '1px'
      fadeBrown.style.borderWidth = '1px'
      BoldBrown.style.borderWidth = '3px'
    },
    // function to save new note
    saveNote () {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      const title = document.querySelector('#title')
      const content = document.querySelector('#text')
      // new note object
      const note = {
        id: '',
        title: '',
        content: '',
        date: '',
        bgColor: ''
      }
      note.id = Math.random() * 10
      note.title = title.value
      note.content = content.value
      note.date = mm + '/' + dd + '/' + yyyy
      note.bgColor = this.color
      // check if note field is empty
      if (note.title !== '' || note.content !== '') {
        this.notes.push(note)
        this.filterResult = this.notes
        this.newNote = !this.newNote
        this.color = ''
        // save notes array to local storage
        localStorage.setItem('notes', JSON.stringify(this.notes))
      } else if (note.title === '' && note.content === '') {
        this.newNote = !this.newNote
        this.color = ''
      }
    },
    // funtion to cancel new note creation
    cancelCreateNote () {
      this.newNote = !this.newNote
    },
    // function to show note detail
    showDetail (itemTitle, index) {
      for (let i = 0; i < this.notes.length; i++) {
        if (this.notes[i].title === itemTitle) {
          this.indexInNotes = i
        }
      }
      for (let i = 0; i < this.filterResult.length; i++) {
        if (this.filterResult[i].title === itemTitle) {
          this.indexInFilter = i
        }
      }
      this.showNoteDetail = !this.showNoteDetail
      this.noteDetail = this.filterResult[index]
    },
    // function to close note detail
    closeNote () {
      this.showNoteDetail = !this.showNoteDetail
    },
    // function to edit note when it already create
    editNote (index) {
      const title = document.querySelector('#editTitle')
      const content = document.querySelector('#editText')
      this.edit = !this.edit
      this.showNoteDetail = !this.showNoteDetail
      title.value = this.notes[index].title
      content.value = this.notes[index].content
    },
    saveEditNote (index1, index2) {
      const title = document.querySelector('#editTitle')
      const content = document.querySelector('#editText')
      this.notes[index1].title = title.value
      this.notes[index1].content = content.value
      this.filterResult[index2].title = title.value
      this.filterResult[index2].content = content.value
      localStorage.setItem('notes', JSON.stringify(this.notes))
      this.edit = !this.edit
      this.showNoteDetail = !this.showNoteDetail
    },
    cancelEditNote () {
      this.edit = !this.edit
      this.showNoteDetail = !this.showNoteDetail
    },
    // function to delete note
    deleteNote (index1) {
      this.showNoteDetail = !this.showNoteDetail
      if (index1 > -1) {
        this.notes.splice(index1, 1)
        this.filterResult = this.notes
        localStorage.setItem('notes', JSON.stringify(this.notes))
      }
    },
    showSearchBar () {
      this.showSearch = !this.showSearch
    }
  }
}
</script>

<style scoped>
.add-note-btn input, button {
  font-family: 'Poppins', sans-serif;
  color: white;
  outline: none;
}

textarea {
  resize: none;
  overflow-y: hidden;
  color: #eaeaea;
}

.navbar h2 {
  padding-left: 20px;
}

.filter-note-btn input {
  margin-right: 20px;
  top: 83px;
  color: white;
}

.search-icon {
  visibility: hidden;
}

.add-new-note-mob-btn {
  visibility: hidden;
}

.empty-note {
  z-index: 0;
}

.new-note {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.notes {
  width: 100%;
  padding-bottom: 100px;
}

.form-field {
  width: 450px;
  height: 500px;
}

.red, .green, .fade-brown, .bold-brown {
  cursor: pointer;
}

.notes-item {
  cursor: pointer;
}

.content {
  overflow-y: auto;
}

.trash {
  z-index: 99 !important;
}

@media (min-width: 1536px) {
  .add-new-note-btn {
    right: 150px;
  }
}

@media (min-width: 1280px) and (max-width: 1536px) {
  .add-new-note-btn {
    right: 100px;
  }
}

@media (min-width: 1024px) and (max-width: 1280px) {
  .add-new-note-btn {
    right: 100px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .add-new-note-btn {
    right: 90px;
  }
}

@media (min-width: 640px) and (max-width: 768px) {
  .add-new-note-btn {
    right: 60px;
  }
}

@media (max-width: 768px) {
  .add-new-note-btn {
    visibility: hidden;
  }

  .add-new-note-mob-btn {
    right: 60px;
    visibility: visible;
  }
}

@media (max-width: 640px) {
  .add-new-note-btn {
    right: 40px;
  }

  .add-new-note-mob-btn {
    right: 30px;
  }

  .form-field {
    width: 380px;
  }
}

@media (max-width: 420px) {
  .search-icon {
    visibility: visible;
  }

  .filter-note-btn input {
    top: 130px;
    transition: .1s all ease-in-out;
  }

  .filter-note-btn input.hide {
    visibility: hidden;
    top: 100px;
  }

  .add-new-note-mob-btn {
    right: 20px;
  }

  .form-field {
    width: 350px;
  }
}

@media (max-width: 410px) {
  .form-field {
    width: 90%;
  }
}
</style>
