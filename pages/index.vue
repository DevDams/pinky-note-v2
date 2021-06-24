<template>
  <div class="relative h-screen">
    <!-- Navbar -->
    <div class="navbar relative top-0 container h-20 mx-auto flex items-center justify-between z-50">
      <h2 class="text-4xl text-white">
        Notes
      </h2>
      <input
      type="text"
      name="search"
      id="search"
      placeholder="Chercher une note..."
      autocomplete="off"
      class="h-10 w-64 rounded-lg pl-3 bg-mydark outline-none">
    </div>
    <!-- Button to add new note -->
    <div class="add-note-btn relative h-screen -top-20 container mx-auto z-50">
      <button class="absolute bottom-12 right-4 text-white bg-black px-6 py-3 rounded-xl" @click="createNote">
        Nouvelle note +
      </button>
    </div>
    <!-- Form to diplay when typing new note -->
    <div v-show="newNote" class="new-note absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-mygreen z-50">
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
          placeholder="Titre"
          class="outline-none w-full h-12 bg-transparent text-3xl text-white">
          <textarea name="text" id="text" placeholder="Saisir quelque chose..." class="outline-none w-full h-72 text-white text-lg pt-2 mt-4 bg-transparent"></textarea>
        </div>
      </div>
    </div>
    <!-- Display when there is no note to display -->
    <div class="absolute top-0 left-0 h-screen w-screen flex flex-col items-center justify-center" v-show="notes.length === 0">
      <img src="~/assets/icons/warning.svg" alt="warming icon" class="w-14">
      <p class="text-white text-lg mt-4">
        Aucune note enregistré.
      </p>
    </div>
    <!-- Display when there is notes save -->
    <div class="notes absolute w-screen top-0" v-show="notes.length !== 0">
      <div class="notes-list relative w-4/5 mx-auto pt-32 pl-10 flex flex-wrap">
        <div class="notes-item w-60 p-4 ml-2 mt-2 rounded-xl" :class="`bg-${item.bgColor}`" v-for="(item, index) in notes" :key="index">
          <h2 class="text-2xl font-medium leading-6">
            {{ item.title }}
          </h2>
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
      const title = document.querySelector('#title')
      const content = document.querySelector('#text')
      title.value = ''
      content.value = ''
    },
    // function to save new note
    saveNote () {
      const today = new Date()
      const hour = today.getHours()
      const minutes = today.getMinutes()
      let normalHour = hour
      let normalMinutes = minutes
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      const title = document.querySelector('#title')
      const content = document.querySelector('#text')
      const colorId = parseInt(Math.random() * 4)
      let colorName = ''
      // new note object
      const note = {
        id: '',
        title: '',
        content: '',
        date: '',
        bgColor: ''
      }
      // check time frame
      if (hour <= 9) {
        normalHour = `0${hour}`
      }
      if (minutes <= 9) {
        normalMinutes = `0${minutes}`
      }
      // set note item color
      if (colorId === 1) {
        colorName = 'myred'
      } else if (colorId === 2) {
        colorName = 'myfade-brown'
      } else if (colorId === 3) {
        colorName = 'mybold-brown'
      } else if (colorId === 4) {
        colorName = 'mygreen'
      } else if (colorId === 0) {
        colorName = 'myred'
      }
      note.id = Math.random() * 10
      note.title = title.value
      note.content = content.value
      note.date = mm + '/' + dd + '/' + yyyy + ', ' + normalHour + ':' + normalMinutes
      note.bgColor = colorName
      // check if note field is empty
      if (note.title !== '' || note.content !== '') {
        this.notes.push(note)
        this.newNote = !this.newNote
        // save notes array to local storage
        localStorage.setItem('notes', JSON.stringify(this.notes))
      } else if (note.title === '' && note.content === '') {
        this.newNote = !this.newNote
      }
      console.log(colorId)
    },
    // funtion to cancel new note creation
    cancelCreateNote () {
      this.newNote = !this.newNote
    }
  }
}
</script>

<style scoped>
.navbar input, button {
  font-family: 'Poppins', sans-serif;
  color: white;
  outline: none;
}

textarea {
  resize: none;
  overflow-y: hidden;
}

.new-note {
  background: rgba(0, 0, 0, 0.3);
}

.form-field {
  width: 450px;
  height: 500px;
}
</style>
