const addBox = document.querySelector('.add-box'),
      popupBox = document.querySelector('.popup-box'),
      popupTitle = popupBox.querySelector('header p')
      closeIcon = popupBox.querySelector('header i'),
      titleTag = popupBox.querySelector('input'), // инпут тайтла
      descTag = popupBox.querySelector('textarea'), // текстареа
      addBtn = popupBox.querySelector('button');

const months = ["January", "February", "Marh", "April", "May", "June", "July", "August", "Septemeber", "October", "November", "December"] // массив месяцев
const notes = JSON.parse(localStorage.getItem('notes') || '[]') // по ключевому слову 'notes' которое используем внизу в setItem('notes') получаем объект. Благодоря именно такой записи (localStorage.getItem('notes') || '[]') у нас каждая заметка добавляется в массив под новым индексом. Без такой записи при создании новой заметки просто перезаписывается нулевой индекс и не добавляется новая заметка
let isUpdate = false, updateId; // без этой записи при редактировании заметки будет создаваться новая заметка --(2)--

addBox.addEventListener('click', () => {
    titleTag.focus() // при открытии попапа фокус сразу идет на тайтл
    popupBox.classList.add('show') // открыли попап 
})

closeIcon.addEventListener('click', () => { // жмем на крестик
    isUpdate = false; // здесь тоже не забыть поставить false   --(2)--
    titleTag.value = ''; // очистили инпут тайтла 
    descTag.value = ''; // очистили текстареа 
    addBtn.innerText = 'Add Note'
    popupTitle.innerText = 'Add a new Note'
    popupBox.classList.remove('show') // закрыли попап
})

function showNotes() { // покажем заметки
    if(!notes) return
    document.querySelectorAll('.note').forEach(note => note.remove()); // удалили все предыдущие заметки перед добавлением новых, по этому избавились от дублей
    notes.forEach((note, index) => {
        let liTag = ` 
                    <li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick='updateNote(${index}, "${note.title}", "${note.description}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteNote(${index})'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    `;
        addBox.insertAdjacentHTML("afterend", liTag) // при клике будем добавлять заметки вправо, liTag - заметка с разметкой
    });
}

showNotes() // вызываем показ заметок здесь и при нажатии на кнопку в addBtn  --(1)--

function showMenu(elem) { // функция showMenu вызывается выше в переменной liTag - <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
    elem.parentElement.classList.add('show') // при клике на 3 точки открываем меню
    document.addEventListener('click', e => {
        if (e.target.tagName != 'I' || e.target != elem) { // получаем любое место кроме трех точек, в том числе и кнопки удалить и изменить
            elem.parentElement.classList.remove('show') // закрываем меню
        }
    })
}

function deleteNote(noteId) { // функция обрабаывается в переменной liTag выше
    let confirmDel = confirm('Вы уверены что хотите удалить это?')
    if (!confirmDel) return;
    notes.splice(noteId, 1) // удаляем из массива заметку соответствующую индексу
    localStorage.setItem("notes", JSON.stringify(notes)) // обновлям локалстораж, т.е. удаляем из него заметку
    showNotes() // отображаем заметки  --(1)--
}

function updateNote(noteId, title, desc) { // редактируем заметку, функция обрабатывается в переменной liTag
    updateId = noteId
    isUpdate = true // --(2)--
    addBox.click() // снова каким-то образом открывается попап а меню закрывается, хз как это устроено
    titleTag.value = title // при открытии в попапе в тайтле остается старый тайтл
    descTag.value = desc // при открытии в попапе в тексарее остается старая текстаера
    addBtn.innerText = 'Update Note' // поменяли текст в кнопке
    popupTitle.innerText = 'Update Note' // поменяли текст в тайтле
    showNotes()
}

addBtn.addEventListener('click', e => {
    e.preventDefault()
    let noteTitle = titleTag.value, // получили данные из инпута тайтла
        noteDesc = descTag.value; // данные из текстареа

    if (noteTitle || noteDesc) {
        let dateObj = new Date(),
            // получили месяц, день, год согласно текущей дате
            month = months[dateObj.getMonth()], // месяц выводится теперь словом а не цифрой
            day = dateObj.getDate(),
            year = dateObj.getFullYear();

        let noteInfo = { // создаем объект с полученным тайтлом, дескрипшином и датой, т.е. создаем новую заметку
            title: noteTitle,
            description: noteDesc,
            date: `${month} ${day}, ${year}`
        }
        if (!isUpdate) { // --(2)-=
            notes.push(noteInfo) // добавить новую заметку в notes
        } else {
            isUpdate = false // без этого присваения будут создаватся дубли   --(2)--
            notes[updateId] = noteInfo // обновляем заметку без добавления новой
        }
        localStorage.setItem("notes", JSON.stringify(notes)) // сохраняем массив заметок в локастораж, распарсивая через стрингифай, иначе получим просто [Object, object]
        showNotes() // и здесь  --(1)--
        closeIcon.click() // понятия не имею как это работает, но при нажатии кнопки 'Add note' - форма отправляет в локал стораж объект, а затем закрывается
    }
})



