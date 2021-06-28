<template>
  <div class="relative h-screen">
    <!-- Navbar -->
    <div class="navbar relative top-0 container h-20 mx-auto flex items-center justify-between z-10">
      <h2 class="text-4xl text-white">
        Notes
      </h2>
    </div>
    <!-- Button to add new note -->
    <div class="add-note-btn relative h-20 -top-20 container mx-auto z-10">
      <input
      type="text"
      name="search"
      id="search"
      placeholder="Search a note..."
      autocomplete="off"
      class="absolute top-5 right-0 h-10 w-64 rounded-lg pl-3 bg-mydark outline-none z-50"
      v-model="searchValue">
    </div>
    <button class="fixed bottom-12 right-10 text-white bg-black px-6 py-3 rounded-xl z-50" @click="createNote">
      New note +
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
          type="text"
          name="title"
          id="title"
          autocomplete="off"
          placeholder="Title"
          class="outline-none w-full h-12 bg-transparent text-3xl text-white">
          <textarea name="text" id="text" placeholder="Type something..." class="outline-none w-full h-72 text-white text-lg pt-2 mt-4 bg-transparent"></textarea>
        </div>
        <div class="color-palette flex w-full px-5">
          <div class="green w-7 h-7 rounded-full border border-white bg-mygreen" @click="chooseColor"></div>
          <div class="red w-7 h-7 rounded-full border border-white bg-myred ml-4" @click="chooseColor"></div>
          <div class="fade-brown w-7 h-7 rounded-full border border-white bg-myfade-brown ml-4" @click="chooseColor"></div>
          <div class="bold-brown w-7 h-7 rounded-full border border-white bg-mybold-brown ml-4" @click="chooseColor"></div>
        </div>
      </div>
    </div>
    <!-- Display when there is no note to display -->
    <div
    class="empty-note absolute top-0 left-0 h-screen w-screen flex flex-col items-center justify-center"
    v-show="notes.length === 0">
      <img src="~/assets/icons/warning.svg" alt="warming icon" class="w-14">
      <p class="text-white text-lg mt-4">
        No note saved.
      </p>
    </div>
    <!-- Display when there is notes saved -->
    <div class="notes absolute left-0 top-20 z-20" v-show="notes.length !== 0">
      <div class="notes-list relative container mx-auto pt-16 pl-10 flex flex-wrap">
        <div class="notes-item relative w-56 p-4 ml-2 mt-2 rounded-xl z-10" :class="`bg-${item.bgColor}`" v-for="(item, index) in searchNote" :key="index" @click="showDetail(index)">
          <h2 class="note-item-title text-2xl font-medium leading-6">
            {{ item.title }}
          </h2>
          <p class="text-lg text-mydark font-medium mt-1">{{ item.date }}</p>
          <p>{{ index }}</p>
        </div>
      </div>
    </div>
    <!-- Display the note details -->
    <div class="new-note fixed top-0 left-0 h-screen flex items-center justify-center bg-mygreen z-50" v-show="showNoteDetail">
      <div class="form-field border border-mydark bg-myblack rounded-xl">
        <div class="form-nav w-full h-12 mt-4 flex items-center justify-between">
          <div class="cancel-btn ml-4">
            <button class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl" @click="closeNote">
              close
            </button>
          </div>
          <div class="save-btn mr-4 flex items-center">
            <button class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl" @click="deleteNote">
              <img src="~/assets/icons/trash.svg" alt="trash icon" class="w-6 h-6 py-1">
            </button>
            <button
            class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl ml-2"
            @click="editNote(noteDetail, noteIndex)">
              edit
            </button>
          </div>
        </div>
        <div class="form relative px-5 mt-8">
          <h2 class="title text-3xl text-white font-semibold">
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
            <button class="font-medium text-lg text-white bg-mydark px-3 py-1 rounded-xl" @click="saveEditNote(noteIndex)">
              save
            </button>
          </div>
        </div>
        <div class="form px-5 mt-8">
          <input
          type="text"
          name="title"
          id="editTitle"
          autocomplete="off"
          placeholder="Title"
          class="outline-none w-full h-12 bg-transparent text-3xl text-white">
          <textarea name="text" id="editText" placeholder="Type something..." class="outline-none w-full h-72 text-white text-lg pt-2 mt-4 bg-transparent"></textarea>
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
      showNoteDetail: false,
      searchValue: '',
      filterResult: ''
    }
  },
  mounted () {
    if (localStorage.getItem('notes')) {
      this.notes = JSON.parse(localStorage.getItem('notes'))
    }
  },
  computed: {
    searchNote () {
      if (!this.searchValue) {
        return this.notes
      }
      return this.notes.filter(item => item.title.toLowerCase().includes(this.searchValue))
      // return this.filterResult
    }
  },
  watch: {
    searchNote: {
      deep: true,
      handler: function (newVal) {
        this.filterResult = newVal
      }
    }
  },
  methods: {
    // funtion to show new note form
    createNote () {
      this.newNote = !this.newNote
      this.color = 'myfade-brown'
      const title = document.querySelector('#title')
      const content = document.querySelector('#text')
      title.value = ''
      content.value = ''
    },
    // funtion to choose note color
    chooseColor () {
      const red = document.querySelector('.red')
      const green = document.querySelector('.green')
      const fadeBrown = document.querySelector('.fade-brown')
      const BoldBrown = document.querySelector('.bold-brown')
      red.addEventListener('click', () => {
        this.color = 'myred'
        red.style.borderWidth = '3px'
        green.style.borderWidth = '1px'
        fadeBrown.style.borderWidth = '1px'
        BoldBrown.style.borderWidth = '1px'
      })
      green.addEventListener('click', () => {
        this.color = 'mygreen'
        green.style.borderWidth = '3px'
        red.style.borderWidth = '1px'
        fadeBrown.style.borderWidth = '1px'
        BoldBrown.style.borderWidth = '1px'
      })
      fadeBrown.addEventListener('click', () => {
        this.color = 'myfade-brown'
        fadeBrown.style.borderWidth = '3px'
        green.style.borderWidth = '1px'
        red.style.borderWidth = '1px'
        BoldBrown.style.borderWidth = '1px'
      })
      BoldBrown.addEventListener('click', () => {
        this.color = 'mybold-brown'
        BoldBrown.style.borderWidth = '3px'
        green.style.borderWidth = '1px'
        fadeBrown.style.borderWidth = '1px'
        red.style.borderWidth = '1px'
      })
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
    showDetail (index) {
      this.showNoteDetail = !this.showNoteDetail
      this.noteIndex = index
      this.noteDetail = this.notes[index]
    },
    // function to close note detail
    closeNote () {
      this.showNoteDetail = !this.showNoteDetail
    },
    // function to edit note when it already create
    editNote (item, index) {
      const title = document.querySelector('#editTitle')
      const content = document.querySelector('#editText')
      // const noteIndex = document.querySelector('#index')
      // this.newNote = !this.newNote
      this.edit = !this.edit
      this.showNoteDetail = !this.showNoteDetail
      title.value = item.title
      content.value = item.content
      // noteIndex.innerHTML = index
    },
    saveEditNote (index) {
      const title = document.querySelector('#editTitle')
      const content = document.querySelector('#editText')
      this.notes[index].title = title.value
      this.notes[index].content = content.value
      localStorage.setItem('notes', JSON.stringify(this.notes))
      this.edit = !this.edit
      this.showNoteDetail = !this.showNoteDetail
    },
    cancelEditNote () {
      this.edit = !this.edit
      this.showNoteDetail = !this.showNoteDetail
    },
    // function to delete note
    deleteNote () {
      this.showNoteDetail = !this.showNoteDetail
      if (this.noteIndex > -1) {
        this.notes.splice(this.noteIndex, 1)
        localStorage.setItem('notes', JSON.stringify(this.notes))
      }
      this.noteIndex = 0
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

.empty-note {
  z-index: 0;
}

.new-note {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.notes {
  width: 100%;
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
</style>
