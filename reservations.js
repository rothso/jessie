const $table = document.querySelector(".calendar-body");
const $header = document.querySelector(".calendar-header");
const $time = document.querySelector(".calendar-time");

const RESERVATION_ID = 105;
const INITIAL_START_OF_MONTH = dayjs().startOf("month");

let state = {
  startOfMonth: INITIAL_START_OF_MONTH,
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

  // Workaround for some weeks in December that wrap around
  const endWeek =
    endOfMonth.week() === 1
      ? endOfMonth.subtract(1, "week").week() + 1
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
        resourceIDRes: RESERVATION_ID,
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

  const [$backArrow, $nextArrow] = $header.querySelectorAll(".calendar-arrow");

  if (INITIAL_START_OF_MONTH.month() === startOfMonth.month()) {
    $backArrow.classList.add("calendar-arrow-disabled");
    $backArrow.removeEventListener("click", onPreviousMonth);
    $nextArrow.addEventListener("click", onNextMonth);
  } else {
    $backArrow.classList.remove("calendar-arrow-disabled");
    $backArrow.addEventListener("click", onPreviousMonth);
    $nextArrow.addEventListener("click", onNextMonth);
  }
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

function renderTimes() {
  const startTime = dayjs("7:00", "HH:mm");
  const endTime = dayjs("22:00", "HH:mm");

  const [$start, $end] = $time.querySelectorAll(".calendar-time-dropdown");

  [$start, $end].forEach(($select) => {
    for (var time = startTime; time <= endTime; time = time.add(15, "m")) {
      $select.add(new Option(time.format("hh:mma"), time.format("HH:mm")));
    }
  });

  $start.value = startTime.format("HH:mm");
  $end.value = endTime.format("HH:mm");
}

// Initialize calendar to current month
onMonthChange(state.startOfMonth);

// Initialize time select dropdowns
renderTimes();
