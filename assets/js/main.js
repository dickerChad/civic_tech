'use strict'

const openModel = () => document.getElementById('model').classList.add('active')

const closeModel = () => {
    clearFields()
    document.getElementById('model').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_student'))??[]
const setLocalStorage = (db_student) => localStorage.setItem('db_student', JSON.stringify(db_student))

const readStudent = () => getLocalStorage()

const createStudent = (student) => {
    const db_student = getLocalStorage()
    db_student.push(student)
    setLocalStorage(db_student)
}

const updateStudent = (index, student) => {
    const db_student = readStudent()
    db_student[index] = student
    setLocalStorage(db_student)
}


const deleteStudent = (index) => {
    const db_student = readStudent()
    db_student.splice(index, 1)
    setLocalStorage(db_student)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.model-field')
    fields.forEach(field => field.value = "")
}

const saveStudent = () => {
    if (isValidFields()) {
        const student = {
                nom: document.getElementById('nom').value,
                organisme: document.getElementById('organisme').value,
                secteur: document.getElementById('secteur').value,
                budget: document.getElementById('budget').value,
                pourcentage: document.getElementById('pourcentage').value,
                date_Debut: document.getElementById('date_Debut').value,
                date_Fin: document.getElementById('date_Fin').value,
                avis: document.getElementById('avis').value,
            }
            //console.log('The Cadastral student: ' + student)
        const index = document.getElementById('nom').dataset.index
        if (index == 'new') {
            createStudent(student)
            listStudent()
            closeModel()
        } else {
            updateStudent(index, student)
            listStudent()
            closeModel()
        }
    }
}


const createRow = (student, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
				<td>${student.nom}</td>
				<td>${student.organisme}</td>
				<td>${student.secteur}</td>
				<td>${student.budget}</td>
				<td>${student.pourcentage}</td>
				<td>${student.date_Debut}</td>
                <td>${student.date_Fin}</td>
                <td>${student.avis}</td>
				<td>
					<button type="button" class="button green" id="edit-${index}">Edit</button>
					<button type="button" class="button red" id="delete-${index}">Delete</button>
				</td>
			`
    document.querySelector('#tblStudent>tbody').appendChild(newRow)
}

const crearTable = () => {
    const rows = document.querySelectorAll('#tblStudent>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const listStudent = () => {
    const students = readStudent()
        // console.log(students)
    crearTable()
    students.forEach(createRow)
}

const fillFields = (student) => {
    document.getElementById('nom').value = student.nom
    document.getElementById('organisme').value = student.organisme
    document.getElementById('secteur').value = student.secteur
    document.getElementById('budget').value = student.budget
    document.getElementById('pourcentage').value = student.pourcentage
    document.getElementById('date_Debut').value = student.date_Debut
    document.getElementById('date_Fin').value = student.date_Fin
    document.getElementById('avis').value = student.avis

    document.getElementById('nom').dataset.index = student.index
}

const editStudent = (index) => {
    const student = readStudent()[index]
    student.index = index
    fillFields(student)
    openModel()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')
        if (action == 'edit') {
            editStudent(index)
        } else {
            const student = readStudent()[index]
            const response = confirm(`Are you sure to delete the student ${student.name}`)
            if (response) {
                deleteStudent(index)
                listStudent()
            }
        }
    }
}

listStudent()

document.getElementById('idStudent').addEventListener('click', openModel)
document.getElementById('cancel').addEventListener('click', closeModel)
document.getElementById('save').addEventListener('click', saveStudent)
document.querySelector('#tblStudent>tbody').addEventListener('click', editDelete)