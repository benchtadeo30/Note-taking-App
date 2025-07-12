const notebooks_container = document.querySelector('.notebooks-container')
const notebook_lists = document.querySelector('.notebooks-container .notebooks-list')
const notes_lists = document.querySelector('.notes-container .notes-lists')
const editor = document.querySelector('#editor')
const editorTitle = document.querySelector('.editor h3')
const note = document.querySelector('.notes-list .note')
const addNewNotebook = document.querySelector('.notebooks-container .notebooks-title span')
const addNewNotes = document.querySelector('.notes-container .notes-title span:nth-child(2)')

let isClickedAgain = true;
let prevId;
let notebooked, notedd, idd;
const quill = new Quill('#editor', {
    theme: 'snow',
  });

let notebooks = JSON.parse(localStorage.getItem('notebooks')) || []
console.log(notebooks)
function renderNotebooks(){
   notebook_lists.innerHTML = ""
   const isNoteBooksEmpty = notebooks.length > 0 ? true : false

if(isNoteBooksEmpty){
       notebooks.forEach(notebook => {
    const notes = document.createElement('div')
    notes.className = "notes"
    notes.dataset.id = notebook.id
    notes.innerHTML = `
         <p>${notebook.notebook}</p>
            <span>${notebook.notes.length}</span>
    `
    notebook_lists.appendChild(notes)
   })  
}
else{
    notebook_lists.innerHTML = "<p class='create'>Create New Notebook</p>"
}
}


notebooks_container.addEventListener('click', e => {

    const note = e.target.className === "notes" ? e.target : e.target.parentNode
      const notebook = notebooks.find(notes => notes.id === parseInt(note.dataset.id))
    console.log(note.className === "notes")
    if(note.className === "notes" && isClickedAgain ){
            renderNotes(parseInt(note.dataset.id), notebook)
             
    }else if(note.className === "notes" && !isClickedAgain && parseInt(e.target.dataset.id) !== prevId){
         renderNotes(parseInt(note.dataset.id), notebook)
         isClickedAgain = true;
    }else{
        notes_lists.innerHTML = `<p class="no-notes">There's No Notes Available.</p>`
    }
  isClickedAgain = !isClickedAgain
        prevId = parseInt(e.target.dataset.id)

})        

renderNotebooks()

function renderNotes(ids, notebook){
    notes_lists.innerHTML = ""
    notebooked = notebook
    idd = ids
    console.log(notebooks)
    notebooks.forEach(notebook => {
       if(notebook.id === ids){
        notebook.notes.forEach(note => {
             const notes = document.createElement('div')
             const temp = document.createElement('div')
             const noteContent = document.createElement('div')
             noteContent.className = 'note-contents'
            
             temp.innerHTML = note.description
             const h1 = temp.contains(temp.querySelector('h1')) ? temp.querySelector('h1').textContent : temp.textContent
                notes.className = `note`
                notes.dataset.id = note.id
                 noteContent.innerHTML = `
                <h3>${note.title}</h3>
                <div class="note-details">
                <p>${note.date}</p>
                </div>
                <p>${h1.length >= 48 ? h1.slice(0, 48) + '...' : h1}</p>
                `
                notes.appendChild(noteContent)
            notes_lists.appendChild(notes)
        })
       
       }
    })

    const notess = document.querySelectorAll('.notes-lists .note')
     let isClicked = true;
      let prevId;
    notess.forEach((note, index) => note.addEventListener('click', e => {
        const id = parseInt(note.dataset.id)

        if(e.target.tagName == 'ION-ICON'){
       const isDeleted = confirm('Are you sure you want to delete this note?')

       if(isDeleted){
        notebooks = notebooks.map(note => {
        if(note.id !== ids) return note;

        const updatedNotes = note.notes.filter(note => note.id !== id)

        return {
            ...note,
            notes: updatedNotes
        }
       })

       localStorage.setItem('notebooks', JSON.stringify(notebooks))
        renderNotes(ids, notebook)
        renderNotebooks()
       }else{
        alert('Delete has been cancelled.')
    }
        }
      notess.forEach((notee, i) => {
        if(parseInt(notee.dataset.id) === id && notee.className !== 'note note-clicked'){
                notee.classList.add('note-clicked')
                const deleteBtn = document.createElement('div')
                deleteBtn.innerHTML = '<ion-icon name="trash-outline"></ion-icon>'
                deleteBtn.className = 'trash-btn'
                notee.appendChild(deleteBtn)
        }else{
             notee.classList.remove('note-clicked')
             if(notee.contains(notee.querySelector('.trash-btn'))){
                notee.removeChild(notee.querySelector('.trash-btn'))
             }
        }
      })
    const notes = notebook.notes.find(note => note.id === id)
      
        renderContents(notes, notebook)
        prevId = id
    }))
}



function renderContents(noted, notebook){
notedd = noted
editorTitle.innerHTML = noted.title
quill.clipboard.dangerouslyPasteHTML(noted.description)


const button = document.querySelector('.markdown-container .markdown-preview .markdown-title button')
const title = document.querySelector('.editor h3')
const description = document.querySelector('#editor')
}

const markdown = document.querySelector('.markdown-container')

markdown.addEventListener('click', e => {
    if(e.target.matches('button')){
        const title = markdown.querySelector('.markdown-preview .editor .editor-title h3')
        const description = markdown.querySelector('.markdown-preview .editor #editor')
          notedd.title = title.textContent
    notedd.description = description.querySelector('.ql-editor').innerHTML
    notedd.date = new Date().toLocaleString("default",{
                month: "2-digit",
                day: "2-digit",
                year: "2-digit"
            })
localStorage.setItem('notebooks', JSON.stringify(notebooks))
  renderNotebooks()
     renderNotes(idd, notebooked)
 alert('Note has been saved successfully!')
    }
})


addNewNotebook.addEventListener('click', e => {
    const addNotebook_container = document.createElement('div')
    const addNotebook = document.createElement('div')
    addNotebook.className = "addNotebook"
    addNotebook.innerHTML = `
    <div class="addNotebook-title">
     <h3>Add New Notebook</h3>
     <ion-icon name="close-outline"></ion-icon>
    </div>
    <input type=text placeholder="Notebook Name"/>
    <button>Add Notebook</button>
    
    `
    addNotebook_container.className = 'addNotebook-container'
    addNotebook_container.appendChild(addNotebook)
    document.body.querySelector('script').insertAdjacentElement('beforebegin', addNotebook_container)

   renderNewNotebook()
})

function renderNewNotebook(){
    document.querySelector('.addNotebook-container .addNotebook').addEventListener('click', e => {
        if(e.target.tagName === "ION-ICON"){
            e.target.closest('.addNotebook-container').remove()
        }
        if(e.target.tagName === "BUTTON"){
            const notebookInput = e.target.parentNode.querySelector('input').value.trim()
            
            if(notebookInput !== ""){
            const newId = notebooks.length > 0 ? notebooks[notebooks.length - 1].id+1 : 1
            notebooks.push({
                id: newId,
                notebook: notebookInput,
                notes: []
            })
            localStorage.setItem('notebooks', JSON.stringify(notebooks))
            alert('Added Successfully!')
            e.target.closest('.addNotebook-container').remove()
            renderNotebooks()
            }else{
                alert('Please type a notebook name.')
            }

        }
    })
}

addNewNotes.addEventListener('click', e => {
    if(idd){
    const addNotes_container = document.createElement('div')
    const addNotes = document.createElement('div')
    addNotes.className = 'addNotes'
    addNotes.innerHTML = `
      <div class="addNotes-title">
     <h3>Add New Note</h3>
     <ion-icon name="close-outline"></ion-icon>
    </div>
    <div class="addNotes-input">
    <label for="title">Title Of Note:</label>
    <input type=text placeholder="Note Title" id="title"/>
    <label for="desc">Description Of Note:</label>
    <input type=text placeholder="Note Description" id="desc"/>
    </div>
    <button>Add Note</button>
    `
   addNotes_container.className = 'addNotes-container'
   addNotes_container.appendChild(addNotes)
   document.body.querySelector('script').insertAdjacentElement('beforebegin', addNotes_container)
    }else{
        alert('Choose a notebook first.')
    }

    renderNewNotes()
})

function renderNewNotes(){
    document.querySelector('.addNotes-container .addNotes').addEventListener('click', e => {

        if(e.target.tagName === "ION-ICON"){
            e.target.closest('.addNotes-container').remove()
        }

        if(e.target.tagName === "BUTTON"){
             const addNewNote = notebooks.find(note => note.id === idd)
        const titleInput = e.target.parentNode.querySelector('#title').value.trim()
        const descInput = e.target.parentNode.querySelector('#desc').value.trim()

            if(titleInput !== "" && descInput !== ""){
                addNewNote.notes.push({
                    id: addNewNote.notes.length > 0 ?  addNewNote.notes[addNewNote.notes.length -1].id + 1 : 1,
                    title: titleInput,
                    date: new Date().toLocaleString("default",{
                month: "2-digit",
                day: "2-digit",
                year: "2-digit"
            }),
            description: descInput
                })

                console.log(notebooks)
                localStorage.setItem('notebooks', JSON.stringify(notebooks))
                renderNotebooks()
                renderNotes(idd, notebooked)
                alert('Added Successfully!')
                 e.target.closest('.addNotes-container').remove()
            }else{
                alert('Title and Description must no be empty. Please try again.')
            }
        }
    })
}

document.querySelector('.notes-container .filter p').addEventListener('click', e => {
   const filters = document.createElement('div')
   filters.className = 'filter-container'
   filters.innerHTML = `
                <p>Ascending</p>
                <p>Descending</p>
   `
  
   if(document.querySelectorAll('.notes-container .filter-container').length >= 1){
    document.querySelector('.notes-container .filter-container').remove()
   }else{
    document.querySelector('.notes-container').appendChild(filters)
   }

    document.querySelectorAll('.notes-container .filter-container p').forEach(filter => filter.addEventListener('click', e => {
       if(e.target.textContent === 'Ascending'){
        notebooks = notebooks.map(note => {
            if(note.id !== idd) return note;

            const sortAscendingNotes = note.notes.sort((a, b) => a.title.localeCompare(b.title))

            return {
                ...note,
                notes: sortAscendingNotes
            }
        })
        localStorage.setItem('notebooks', JSON.stringify(notebooks))
        e.target.closest('.filter-container').remove()
        renderNotebooks()
        renderNotes(idd, notebooked)
       }else   if(e.target.textContent === 'Descending'){
          notebooks = notebooks.map(note => {
            if(note.id !== idd) return note;

            const sortDescendingNotes = note.notes.sort((a, b) => b.title.localeCompare(a.title))

            return {
                ...note,
                notes: sortDescendingNotes
            }
        })
        localStorage.setItem('notebooks', JSON.stringify(notebooks))
        e.target.closest('.filter-container').remove()
        renderNotebooks()
        renderNotes(idd, notebooked)
       }
    }))
       if(document.querySelector('.notes-container').contains(document.querySelector('.notes-container .filter-container'))){
window.addEventListener('click', (e) => {
   if(e.target.parentNode.className !== "filter"){
    e.target.closest('body').querySelector('.filter-container').remove()
   }
})
   }
})

let toggleNotebook = true;

document.querySelector('.notebooks-container').addEventListener('click', e => {
   const notes = e.target.parentNode === 'notes' || e.target.closest('.notes')
  const id = parseInt(notes.dataset.id)

   document.querySelectorAll('.notebooks-container .notebooks-list .notes').forEach(note => {
        
    if(parseInt(note.dataset.id) === id){
      if(note.contains(note.querySelector('span'))){
          const span = note.querySelector('span');
        const deleteBtn = document.createElement('ion-icon')
        deleteBtn.name = "trash-outline"
        note.replaceChild(deleteBtn, span)
      }
        
    }else{
     if(note.contains(note.querySelector('ion-icon'))){
        console.log('doest have delete button')
        const notesLength = notebooks.find(noted => {
            if(noted.id === parseInt(note.dataset.id)){
                return noted
            }
        })
      const span = document.createElement('span')
      span.innerHTML = notesLength.notes.length
      note.replaceChild(span, note.querySelector('ion-icon'))
     }
    }
   })

   if(e.target.tagName === 'ION-ICON'){
    const isDeleted = confirm('Are you sure you want to delete this notebook?')
    if(isDeleted){
        notebooks = notebooks.filter(note => note.id !== parseInt(e.target.closest('.notes').dataset.id))
    localStorage.setItem('notebooks', JSON.stringify(notebooks))
    renderNotebooks()
    }else{
        alert('Delete has been cancelled.')
    }
   }

    toggleNotebook = !toggleNotebook
})