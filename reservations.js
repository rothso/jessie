const $table = document.querySelector(".calendar-body");
const $header = document.querySelector(".calendar-header");
const reservationId = 105;

let state = {
  startOfMonth: dayjs().startOf("month"),
  calendar: null,
  availability: null,
  selectedDate: null,
};

function setState(newState) {
  state = { ...state, ...newState };
  renderCalendar(state);
  renderHeader(state);
}

async function onNextMonth() {
  await onMonthChange(state.startOfMonth.add(1, "month"));
}

async function onPreviousMonth() {
  await onMonthChange(state.startOfMonth.subtract(1, "month"));
}

async function onDateSelect() {
  setState({ selectedDate: this.innerText });
}

async function onMonthChange(startOfMonth) {
  const endOfMonth = startOfMonth.endOf("month");

  // Workaround for some cold weeks in December that wrap around
  const endWeek =
    endOfMonth.week() === 1
      ? endOfMonth.week(endOfMonth.subtract(1, "week").week() + 1).week()
      : endOfMonth.week();

  // Build calendar data
  const calendar = [];
  for (let week = startOfMonth.week(); week < endWeek + 1; week++) {
    for (let weekday = 0; weekday < 7; weekday++) {
      calendar.push(startOfMonth.week(week).weekday(weekday));
    }
  }

  // Fetch availability data
  const response = await fetch(
    "https://portal.dupontcenter.org/api/calendarAvailability",
    {
      method: "POST",
      body: JSON.stringify({
        date: startOfMonth.format("YYYY-MM-DD"),
        resourceIDRes: reservationId,
      }),
    }
  );
  const jsonData = await response.json();
  const availability = jsonData.day_availability;

  setState({ startOfMonth, calendar, availability, selectedDate: null });
}

function renderHeader({ startOfMonth }) {
  $header.querySelector(".calendar-month").innerText =
    startOfMonth.format("MMMM YYYY");
}

function renderCalendar({
  startOfMonth,
  calendar,
  availability,
  selectedDate,
}) {
  // Remove the previous calendar
  $table?.querySelectorAll(".calendar-week").forEach((el) => el.remove());

  for (let week = 0; week < calendar.length / 7; week++) {
    const $row = document.createElement("div");
    $row.classList.add("calendar-row", "calendar-week");

    for (let weekday = 0; weekday < 7; weekday++) {
      const day = calendar[week * 7 + weekday];
      const isCurrentMonth = day.month() === startOfMonth.month();
      const isLowAvailability = isCurrentMonth && !!availability[day.date()];
      const isSelected = isCurrentMonth && selectedDate == day.date();

      const $cell = document.createElement("div");
      $cell.classList.add("calendar-cell", "calendar-week");
      $cell.classList.toggle("calendar-cell-active", isSelected);
      $cell.classList.toggle("calendar-cell-disabled", !isCurrentMonth);
      $cell.classList.toggle(
        "calendar-cell-low-availability",
        isLowAvailability
      );
      $cell.innerText = day.date();

      if (isCurrentMonth) {
        $cell.addEventListener("click", onDateSelect);
      }

      $row.appendChild($cell);
    }

    $table?.appendChild($row);
  }
}

// Initialize calendar to current month
onMonthChange(state.startOfMonth);
