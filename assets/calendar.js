const date = new Date();
const calendar = document.getElementById('calendar');
const dayFields = document.querySelectorAll('.day');

function init() {
	changeMonth(date.getMonth(), date.getFullYear());
	dayFields.forEach(el => el.addEventListener('click', (e) => showModal('addTask', e.currentTarget)));
	document.querySelector('#modal-overlay').addEventListener('click', closeModals);
	document.querySelectorAll('.clsBtn').forEach(el => el.addEventListener('click', closeModals));
	document.onkeydown = (e) => {
    if (e.keyCode == 27) {
			closeModals();
    }
	};
}
init();

function changeMonth(newMonth, newYear) {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
	const weekdayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
	const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
	const monthField = document.querySelector('#month');
	calendar.setAttribute('data-year', newYear);
	calendar.setAttribute('data-month', newMonth);
	monthField.innerText = monthNames[newMonth] + ' ' + newYear;
	const startDay = (new Date(newYear, newMonth).getDate() % 7) - new Date(newYear, newMonth).getDay() + 1;
	for (let i = 0; i < dayFields.length; i++) {
		const calculatedDate = new Date(newYear, newMonth, (startDay > 1 ? startDay-7 : startDay) + i);
		const dateForField = calculatedDate.getDate();
		const currentField = dayFields[i].querySelector('.dayNumber');
		currentField.innerText = i < 7 ? `${weekdayNames[i]}, ${dateForField}` : dateForField;
		dayFields[i].classList.remove('related', 'today', 'filled');
		clearField(dayFields[i]);
		dayFields[i].setAttribute('data-fulldate', `${calculatedDate.getDate()}.${calculatedDate.getMonth()+1}.${calculatedDate.getFullYear()}`);
		if (tasks.hasOwnProperty(newYear) && tasks[newYear].hasOwnProperty(newMonth+1) && tasks[newYear][newMonth+1].hasOwnProperty(dateForField) && calculatedDate.getMonth() === newMonth) {
			showTask(dayFields[i], tasks[newYear][newMonth+1][dateForField]);
		}
		if (Math.abs(dateForField - i) > 5) {
			dayFields[i].classList.add('related');
		}
		if (newYear == date.getFullYear() && newMonth == date.getMonth() && dateForField == date.getDate() && Math.abs(dateForField - i) < 7) {
			dayFields[i].classList.add('today');
		}
	}
}

function nextMonth() {
	const prevYear = Number(calendar.getAttribute('data-year'));
	const targetMonth = Number(calendar.getAttribute('data-month')) + 1;
	targetMonth < 12 ? changeMonth(targetMonth, prevYear) : changeMonth(0, prevYear+1);
}

function prevMonth() {
	const prevYear = Number(calendar.getAttribute('data-year'));
	const targetMonth = Number(calendar.getAttribute('data-month')) - 1;
	targetMonth > -1 ? changeMonth(targetMonth, prevYear) : changeMonth(11, prevYear-1);
}

function getToday() {
	changeMonth(date.getMonth(), date.getFullYear());
}

function closeModals() {
	document.querySelectorAll('.modal:not(.close)').forEach(el => el.classList.add('close'));
	document.querySelector('#modal-overlay').classList.add('close');
	removeClassIfExist('selected');
	removeClassIfExist('activeBtn');
	clearInputs();
}

function removeClassIfExist(classname) {
	const el = document.querySelector(`.${classname}`);
	if (el) {
		el.classList.remove(classname);
	}		
}

function showModal(idToShow, target) {
	const arrowEl = document.querySelector('.arrow');
	const modalEl = document.querySelector(`#${idToShow}`);
	modalEl.classList.remove('close', 'toEdit');
	arrowEl.classList.remove('close');
	setArrowPosition(arrowEl, modalEl, target, idToShow);
	document.querySelector('#modal-overlay').classList.remove('close');
	if (idToShow === 'quickAdd') {
		document.querySelector('#showQuickAdd').classList.add('activeBtn');
	}
	if (idToShow === 'addTask') {
		target.classList.add('selected');
		document.querySelector('#taskDate').value = target.getAttribute('data-fulldate');
		if (target.classList.contains('filled')) {
			modalEl.classList.add('toEdit');
			document.querySelector('#taskTitle').value = target.querySelector('.taskTitle').innerText;
			document.querySelector('#taskPeoples').value = target.querySelector('.taskDescr .people').innerText;
			document.querySelector('#taskDescr').value = target.querySelector('.taskDescr .descr').innerText;
		}
	}
}

function setArrowPosition(arrowEl, modalEl, dayEl, idToShow) {
	if (idToShow !== 'addTask') {
		arrowEl.style.top = `${modalEl.offsetTop-20}px`;
		arrowEl.style.left = `${modalEl.offsetLeft+10}px`;
		arrowEl.style.transform = 'rotate(0deg)';
	} else {
		modalEl.style.top = `${dayEl.offsetTop+100}px`;
		arrowEl.style.top = `${dayEl.offsetTop+10}px`;
		if (dayEl.offsetLeft > window.innerWidth*0.6) {
			modalEl.style.left = `${dayEl.offsetLeft-154}px`;
			arrowEl.style.left = `${modalEl.offsetLeft+140}px`;
			arrowEl.style.transform = 'rotate(90deg)';
		} else {
			modalEl.style.left = `${dayEl.offsetLeft+300}px`;
			arrowEl.style.left = `${modalEl.offsetLeft-191}px`;
			arrowEl.style.transform = 'rotate(270deg)';
		}
	}
}

function clearInputs() {
	document.querySelectorAll('input').forEach(el => el.value = '');
	document.querySelector('textarea').value = '';
}

function clearField(target) {
	target.querySelector('.taskTitle').innerText = '';
	target.querySelector('.taskDescr').innerHTML = '';
}

function parseDate(dateStr) {
	const dateArr = dateStr.split(/[.,\/ -]+/);
	const year = dateArr[2];
	const month = Number(dateArr[1]);
	const date = Number(dateArr[0]);
	return [year, month, date];
}

function quickAdd() {
	const values = document.querySelector('#quickTask').value.split(',');
	const date = parseDate(values[0]);
	const title = values.splice(1).join(',');
	if (title === '' || date === '') {
		alert('Fill date and title!');
		return;
	}
	const result = {'title': title,
									'peoples': '',
									'descr': ''};
	updateStorage(date[0], date[1], date[2], result);
	showTask(document.querySelector(`.day[data-fulldate="${date[2]}.${date[1]}.${date[0]}"]`), result);
	closeModals();
}

function addTask() {
	const title = document.querySelector('#taskTitle').value;
	const date = parseDate(document.querySelector('#taskDate').value);
	const peoples = document.querySelector('#taskPeoples').value;
	const descr = document.querySelector('#taskDescr').value;
	if (title === '' || date === '') {
		alert('Title and date is mandatory!');
		return;
	}
	const result = {'title': title,
									'peoples': peoples,
									'descr': descr};
	updateStorage(date[0], date[1], date[2], result);
	showTask(document.querySelector(`.day[data-fulldate="${date[2]}.${date[1]}.${date[0]}"]`), result);
	closeModals();
}

function deleteTask() {
	const date = parseDate(document.querySelector('#taskDate').value);
	const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
	delete tasks[date[0]][date[1]][date[2]];
	localStorage.setItem('tasks', JSON.stringify(tasks));
	showTask(document.querySelector(`.day[data-fulldate="${date[2]}.${date[1]}.${date[0]}"]`), null);
	closeModals();
}

function updateStorage(year, month, date, item) {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
	if (tasks[year] === undefined) {
		tasks[year] = {[month]: {
											[date]: item}};
	} else if (tasks[year][month] === undefined) {
		tasks[year][month] = {[date]: item};
	} else {
		tasks[year][month][date] = item;
	}
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showTask(target, taskData) {
	const taskTitleValue = target.querySelector('.taskTitle');
	const taskDescrValue = target.querySelector('.taskDescr');
	if (taskData !== null) {
		target.classList.add('filled');
		taskTitleValue.innerText = taskData.title;
		taskDescrValue.innerHTML = `<span class="people">${taskData.peoples}</span><br><span class="descr">${taskData.descr}</span>`;
	} else {
		target.classList.remove('filled');
		taskTitleValue.innerText = '';
		taskDescrValue.innerHTML = '';
	}
}

function makeSearch() {
	showModal('searchTask');
	const searchResult = document.querySelector('#searchTask ul');
	searchResult.innerHTML = '';
	const strToSearch = document.querySelector('#searchValue').value;
	const tasks = JSON.parse(localStorage.getItem('tasks'));
	for (const year in tasks) {
		for (const month in tasks[year]) {
			for (const date in tasks[year][month]) {
				const strToCompare = tasks[year][month][date].title;
				if (strToCompare.toLowerCase().includes(strToSearch.toLowerCase())) {
					const fullDate = `${date}.${month}.${year}`;
					const linkedEl = findDateField(fullDate);
					const li = document.createElement('li');
					li.innerText = strToCompare;
					li.classList.add('searchOption');
					li.setAttribute('data-fulldate', fullDate);
					li.addEventListener("click", () => {closeModals(); showModal('addTask', linkedEl)});
					searchResult.appendChild(li);
				}
			}
		}
	}
	if (searchResult.childElementCount === 0) {
		searchResult.innerHTML = '<li>С таким названием ничего не найдено =(</li>';
	}
}

function findDateField(fullDate) {
	return document.querySelector(`.day[data-fulldate="${fullDate}"]`);
}
