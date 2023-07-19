class ReservationsWidget extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Append without using shadow root in order to access FontAwesome classes
    this.innerHTML = `
      <style>
        .calendar {
          display: inline-block;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .calendar-month {
          font-size: 16px;
          font-weight: 500;
          color: #4d616c;
        }

        .calendar-arrows {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 60px;
        }

        .calendar-arrow {
          font-size: 18px;
          color: #575757;
          cursor: pointer;
        }

        .calendar-arrow-disabled {
          visibility: hidden;
        }

        .calendar-body {
          display: table;
          border-collapse: collapse;
        }

        .calendar-row {
          display: table-row;
        }

        .calendar-cell {
          display: table-cell;
          width: 45px;
          height: 45px;
          vertical-align: middle;
          text-align: center;
          border: 1px solid #d5d4df;
        }

        .calendar-week .calendar-cell:not(.calendar-cell-disabled) {
          cursor: pointer;
        }

        .calendar-weekdays {
          color: #4d616c;
          font-weight: 500;
        }

        .calendar-cell-weekday {
          border: none;
        }

        .calendar-cell-disabled {
          background: #f2f3f7;
          color: #a8a8a8;
          cursor: not-allowed;
        }

        .calendar-cell-low-availability {
          background: #e9f0f5;
        }

        .calendar-cell-active {
          background: #45539d;
          color: #ffffff;
        }

        .calendar-legend {
          display: flex;
          column-gap: 15px;
          margin: 15px 0 25px;
        }

        .calendar-legend-item {
          display: flex;
          align-items: center;
          column-gap: 10px;
          flex: 1;
        }

        .calendar-legend-cell {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 26px;
          height: 26px;
          font-size: 12px;
          border: 1px solid #d5d4df;
        }

        .calendar-legend-label {
          font-weight: 300;
        }

        .calendar-time {
          display: flex;
          column-gap: 15px;
          margin-bottom: 25px;
        }

        .calendar-time-item {
          flex: 1;
        }

        .calendar-time-label {
          font-size: 16px;
          font-weight: 500;
          color: #4d616c;
          margin-bottom: 15px;
        }

        .calendar-time-dropdown-wrapper {
          position: relative;
        }

        .calendar-time-dropdown-wrapper:after {
          content:"\f107";
          position: absolute;
          z-index: 1;
          font: 18px FontAwesome;
          color: #afafaf;
          right: 20px;
          top: 18px;
          pointer-events: none;
        }

        .calendar-time-dropdown {
          display: flex;
          width: 100%;
          justify-content: space-between;
          font: inherit;
          font-weight: 300;
          color: #464646;
          padding: 15px 20px;
          border: 2px solid #c0cadb;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
          outline: none;
          appearance: none;
        }

        .calendar-time-dropdown:active {
          border: 2px solid #c0cadb;
        }

        .calendar-availability {
          padding: 15px 35px;
          background: #7dc242;
          font-weight: 500;
          color: #ffffff;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
      </style>
      <div class="calendar">
        <div class="calendar-header">
          <div class="calendar-month"></div>
          <div class="calendar-arrows">
            <i class="fa-solid fa-angle-left calendar-arrow"></i>
            <i class="fa-solid fa-angle-right calendar-arrow"></i>
          </div>
        </div>
        <div class="calendar-body">
          <div class="calendar-row calendar-weekdays">
            <div class="calendar-cell calendar-cell-weekday">Su</div>
            <div class="calendar-cell calendar-cell-weekday">Mo</div>
            <div class="calendar-cell calendar-cell-weekday">Tu</div>
            <div class="calendar-cell calendar-cell-weekday">We</div>
            <div class="calendar-cell calendar-cell-weekday">Th</div>
            <div class="calendar-cell calendar-cell-weekday">Fr</div>
            <div class="calendar-cell calendar-cell-weekday">Sa</div>
          </div>
        </div>
        <div class="calendar-legend">
          <div class="calendar-legend-item">
            <div class="calendar-legend-cell">1</div>
            <div class="calendar-legend-label">High availability</div>
          </div>
          <div class="calendar-legend-item">
            <div class="calendar-legend-cell calendar-cell-low-availability">1</div>
            <div class="calendar-legend-label">Low availability</div>
          </div>
        </div>
        <div class="calendar-time">
          <div class="calendar-time-item">
            <div class="calendar-time-label">From</div>
            <div class="calendar-time-dropdown-wrapper">
              <select class="calendar-time-dropdown"></select>
            </div>
          </div>
          <div class="calendar-time-item">
            <div class="calendar-time-label">To</div>
            <div class="calendar-time-dropdown-wrapper">
              <select class="calendar-time-dropdown"></select>
            </div>
          </div>
        </div>
        <div class="calendar-availability">Check availability</div>
      </div>
    `;

    this.$table = document.querySelector(".calendar-body");
    this.$header = document.querySelector(".calendar-header");
    this.$time = document.querySelector(".calendar-time");

    // Bind callbacks
    this.onPreviousMonth.bind(this);
    this.onNextMonth.bind(this);
    this.onDateSelect.bind(this);

    this.state = {
      startOfMonth: dayjs().startOf("month"),
      calendar: null,
      availability: null,
      selectedDate: null,
    };

    // Initialize calendar to current month
    this.onMonthChange(this.state.startOfMonth);

    // Initialize time select dropdowns
    this.renderTimes();
  }

  get reservationId() {
    return this.getAttribute("reservationId");
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.renderCalendar(this.state);
    this.renderHeader(this.state);
  }

  async onNextMonth() {
    await this.onMonthChange(this.state.startOfMonth.add(1, "month"));
  }

  async onPreviousMonth() {
    await this.onMonthChange(this.state.startOfMonth.subtract(1, "month"));
  }

  async onDateSelect(selectedDate) {
    this.setState({ selectedDate });
  }

  async onMonthChange(startOfMonth) {
    const endOfMonth = startOfMonth.endOf("month");

    // Workaround for some weeks in December that wrap around
    const endWeek = endOfMonth.week() === 1 ? endOfMonth.subtract(1, "week").week() + 1 : endOfMonth.week();

    // Build calendar data
    const calendar = [];
    for (let week = startOfMonth.week(); week < endWeek + 1; week++) {
      for (let weekday = 0; weekday < 7; weekday++) {
        calendar.push(startOfMonth.week(week).weekday(weekday));
      }
    }

    // Fetch availability data
    const response = await fetch("https://portal.dupontcenter.org/api/calendarAvailability", {
      method: "POST",
      body: JSON.stringify({
        date: startOfMonth.format("YYYY-MM-DD"),
        resourceIDRes: this.reservationId,
      }),
    });
    const jsonData = await response.json();
    const availability = jsonData.day_availability;

    this.setState({ startOfMonth, calendar, availability, selectedDate: null });
  }

  renderHeader({ startOfMonth }) {
    this.$header.querySelector(".calendar-month").innerText = startOfMonth.format("MMMM YYYY");

    const [$backArrow, $nextArrow] = this.$header.querySelectorAll(".calendar-arrow");

    if (dayjs().startOf("month").month() === startOfMonth.month()) {
      $backArrow.classList.add("calendar-arrow-disabled");
      $backArrow.removeEventListener("click", this.onPreviousMonth);
      $nextArrow.addEventListener("click", this.onNextMonth);
    } else {
      $backArrow.classList.remove("calendar-arrow-disabled");
      $backArrow.addEventListener("click", this.onPreviousMonth);
      $nextArrow.addEventListener("click", this.onNextMonth);
    }
  }

  renderCalendar({ startOfMonth, calendar, availability, selectedDate }) {
    // Remove the previous calendar
    this.$table?.querySelectorAll(".calendar-week").forEach((el) => el.remove());

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
        $cell.classList.toggle("calendar-cell-low-availability", isLowAvailability);
        $cell.innerText = day.date();

        if (isCurrentMonth) {
          $cell.addEventListener("click", (event) => this.onDateSelect(event.target.innerText));
        }

        $row.appendChild($cell);
      }

      this.$table?.appendChild($row);
    }
  }

  renderTimes() {
    const startTime = dayjs("7:00", "HH:mm");
    const endTime = dayjs("22:00", "HH:mm");

    const [$start, $end] = this.$time.querySelectorAll(".calendar-time-dropdown");

    [$start, $end].forEach(($select) => {
      for (var time = startTime; time <= endTime; time = time.add(15, "m")) {
        $select.add(new Option(time.format("hh:mma"), time.format("HH:mm")));
      }
    });

    $start.value = startTime.format("HH:mm");
    $end.value = endTime.format("HH:mm");
  }
}

// Define the new element
customElements.define("reservations-widget", ReservationsWidget);
