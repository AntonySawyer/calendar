const date = new Date();
const calendar = document.getElementById('calendar');
const dayFields = document.querySelectorAll('.day');

(function init() {
	changeMonth(date.getMonth(), date.getFullYear());
})()

function changeMonth(newMonth, newYear) {
	const weekdayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
	const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
	const monthField = document.querySelector('#month');
	calendar.setAttribute('data-year', newYear);
	calendar.setAttribute('data-month', newMonth);
	monthField.innerText = monthNames[newMonth] + ' ' + newYear;
	const startDay = (new Date(newYear, newMonth).getDate() % 7) - new Date(newYear, newMonth).getDay() + 1;
	for (let i = 0; i < dayFields.length; i++) {
		const dateForField = new Date(newYear, newMonth, (startDay > 1 ? startDay-7 : startDay) + i).getDate();
		const currentField = dayFields[i].querySelector('.dayNumber');
		currentField.innerText = i < 7 ? `${weekdayNames[i]}, ${dateForField}` : dateForField;
		dayFields[i].classList.remove('related', 'today', 'filled');
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
