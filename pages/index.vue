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
      class="absolute top-5 right-0 h-10 w-64 rounded-lg pl-3 bg-mydark outline-none z-50">
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
    <!-- Display when there is notes save -->
    <div class="notes absolute left-0 top-20 z-20" v-show="notes.length !== 0">
      <div class="notes-list relative container mx-auto pt-16 pl-10 flex flex-wrap">
        <div class="notes-item w-56 p-4 ml-2 mt-2 rounded-xl" :class="`bg-${item.bgColor}`" v-for="(item, index) in notes" :key="index">
          <h2 class="text-2xl font-medium leading-6">
            {{ item.title }}
          </h2>
          <p class="text-lg text-mydark font-medium mt-2">{{ item.date }}</p>
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
      color: 'myfade-brown',
      notes: []
    }
  },
  mounted () {
    if (localStorage.getItem('notes')) {
      this.notes = JSON.parse(localStorage.getItem('notes'))
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
      // const hour = today.getHours()
      // const minutes = today.getMinutes()
      // let normalHour = hour
      // let normalMinutes = minutes
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
      // check time frame
      // if (hour <= 9) {
      //   normalHour = `0${hour}`
      // }
      // if (minutes <= 9) {
      //   normalMinutes = `0${minutes}`
      // }
      // set note item color
      note.id = Math.random() * 10
      note.title = title.value
      note.content = content.value
      note.date = mm + '/' + dd + '/' + yyyy
      //  + ', ' + normalHour + ':' + normalMinutes
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
</style>
