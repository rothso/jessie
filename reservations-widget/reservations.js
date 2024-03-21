class ReservationsWidget extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Append without using shadow root in order to access FontAwesome classes
    this.innerHTML = `
      <style>
        .calendar {
          text-align: center;
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
          color: #484c5b;
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

        .calendar-arrow-loading {
          cursor: wait;
        }

        .calendar-arrow-disabled {
          visibility: hidden;
        }

        .calendar-body {
          display: inline-block;
        }

        .calendar-grid {
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
          color: #484c5b;
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
          color: #484c5b;
          text-align: left;
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

        .availability-button {
          padding: 15px 35px;
          background: #7dc242;
          font-weight: 500;
          color: #ffffff;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }

        .availability-button-loading {
          cursor: wait;
        }

        .availability-add-icon {
          margin-left: 4px;
        }

        .availability-title {
          font-size: 16px;
          font-weight: 500;
          color: #484c5b;
          text-align: center;
          margin: 25px 0;
        }

        .availability-fees {
          display: flex;
          flex-direction: column;
          row-gap: 10px;
        }

        .availability-fee {
          display: flex;
          flex-direction: column;
          row-gap: 4px;
          padding: 5px 0;
          border-bottom: 1px dotted #c0cadb;
        }

        .line-item-row {
          display: flex;
          width: 100%;
          justify-content: space-between;
        }

        .line-item-name {
          color: #484c5b;
        }

        .line-item-price {
          color: #484c5b;
          font-weight: 300;
        }

        .line-item-description {
          color: #969696;
          font-weight: 300;
        }

        .availability-total {
          padding: 15px 0;
        }

        .availability-total .line-item-name {
          font-weight: 700;
          text-transform: uppercase;
        }

        .availability-total .line-item-price {
          text-decoration: underline
        }

        .availability-footnote {
          font-size: 14px;
          font-weight: 300;
          color: #575757;
          margin: 0 0 25px;
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
          <div class="calendar-grid">
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
        <div class="calendar-availability">
          <div class="availability-button availability-check">Check availability</div>
          <div class="availability-details"></div>
        </div>
      </div>
    `;

    this.$table = document.querySelector(".calendar-grid");
    this.$header = document.querySelector(".calendar-header");
    this.$time = document.querySelector(".calendar-time");
    this.$availability = document.querySelector(".calendar-availability");

    // Bind callbacks
    this.onPreviousMonth = this.onPreviousMonth.bind(this);
    this.onNextMonth = this.onNextMonth.bind(this);
    this.onDateSelect = this.onDateSelect.bind(this);
    this.onCheckAvailability = this.onCheckAvailability.bind(this);

    this.state = {
      startOfMonth: dayjs().startOf("month"),
      calendar: null,
      dayAvailability: null,
      loadingCalendar: true,
      selectedDate: null,
      timeAvailability: null,
      loadingAvailability: false,
    };

    // Initialize calendar to current month
    this.onMonthChange(this.state.startOfMonth);

    // Initialize time select dropdowns
    this.renderTimes();
  }

  get resourceId() {
    return this.getAttribute("resourceId");
  }

  get reservationId() {
    return this.getAttribute("reservationId");
  }

  isThisMonth(date) {
    return dayjs().isSame(date, "month") && dayjs().isSame(date, "year");
  }

  setState(newState, callback = () => {}) {
    this.state = { ...this.state, ...newState };
    this.renderCalendar(this.state);
    this.renderHeader(this.state);
    this.renderAvailability(this.state);
    callback();
  }

  onNextMonth() {
    this.onMonthChange(this.state.startOfMonth.add(1, "month"));
  }

  onPreviousMonth() {
    this.onMonthChange(this.state.startOfMonth.subtract(1, "month"));
  }

  onDateSelect(selectedDate) {
    this.setState({ selectedDate, timeAvailability: null });
  }

  onMonthChange(startOfMonth) {
    if (!!this.state.calendar && this.state.loadingCalendar) return;

    this.setState({ loadingCalendar: true, timeAvailability: null }, () => {
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

      // Select today's date if we're on the current month
      const selectedDate = this.isThisMonth(startOfMonth) ? dayjs() : null;

      // Fetch availability data
      fetch("https://portal.dupontcenter.org/api/calendarAvailability", {
        method: "POST",
        body: JSON.stringify({
          resourceIDRes: this.resourceId,
          date: startOfMonth.format("YYYY-MM-DD"),
        }),
      })
        .then((response) => response.json())
        .then((jsonData) => {
          this.setState({
            startOfMonth,
            calendar,
            loadingCalendar: false,
            dayAvailability: jsonData.day_availability,
            selectedDate,
          });
        });
    });
  }

  onCheckAvailability() {
    const dateString = this.state.selectedDate.format("YYYY-MM-DD");
    const [$start, $end] = this.$time.querySelectorAll(".calendar-time-dropdown");

    this.setState({ timeAvailability: null, loadingAvailability: true }, () => {
      fetch("https://portal.dupontcenter.org/api/resources/getAvailability", {
        method: "POST",
        body: JSON.stringify({
          resourceIDRes: this.resourceId,
          fromDateTime: `${dateString} ${$start.value}`,
          toDateTime: `${dateString} ${$end.value}`,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            timeAvailability: {
              isAvailable: response.available,
              errorMessage: response.error_message,
              errorCode: response.errors.length ? Math.max(...response.errors) : null,
              fees: Object.entries(response.feesForRequest).map(([item, price]) => {
                const [_, name, description] = /(.*) (\(.*\))/.exec(item) || [null, item];
                return { name, description, price };
              }),
            },
            loadingAvailability: false,
          });
        });
    });
  }

  renderHeader({ startOfMonth, loadingCalendar }) {
    this.$header.querySelector(".calendar-month").innerText = startOfMonth.format("MMMM YYYY");

    const $arrows = this.$header.querySelectorAll(".calendar-arrow");
    $arrows.forEach(($arrow) => $arrow.classList.toggle("calendar-arrow-loading", loadingCalendar));

    const [$backArrow, $nextArrow] = $arrows;

    if (dayjs().isSame(startOfMonth, "month") && dayjs().isSame(startOfMonth, "year")) {
      $backArrow.classList.add("calendar-arrow-disabled");
      $backArrow.removeEventListener("click", this.onPreviousMonth);
      $nextArrow.addEventListener("click", this.onNextMonth);
    } else {
      $backArrow.classList.remove("calendar-arrow-disabled");
      $backArrow.addEventListener("click", this.onPreviousMonth);
      $nextArrow.addEventListener("click", this.onNextMonth);
    }
  }

  renderCalendar({ startOfMonth, calendar, loadingCalendar, dayAvailability, selectedDate }) {
    if (loadingCalendar) return;

    // Remove the previous calendar
    this.$table?.querySelectorAll(".calendar-week").forEach((el) => el.remove());

    for (let week = 0; week < calendar.length / 7; week++) {
      const $row = document.createElement("div");
      $row.classList.add("calendar-row", "calendar-week");

      for (let weekday = 0; weekday < 7; weekday++) {
        const day = calendar[week * 7 + weekday];
        const isCurrentMonth = day.month() === startOfMonth.month();
        const isLowAvailability = isCurrentMonth && !!dayAvailability[day.date()];
        const isSelected = isCurrentMonth && selectedDate?.date() === day.date();

        const $cell = document.createElement("div");
        $cell.classList.add("calendar-cell", "calendar-week");
        $cell.classList.toggle("calendar-cell-active", isSelected);
        $cell.classList.toggle("calendar-cell-disabled", !isCurrentMonth);
        $cell.classList.toggle("calendar-cell-low-availability", isLowAvailability);
        $cell.innerText = day.date();

        if (isCurrentMonth) {
          $cell.addEventListener("click", () => this.onDateSelect(day));
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

  renderAvailability({ selectedDate, timeAvailability, loadingAvailability }) {
    const $availabilityButton = this.$availability.querySelector(".availability-check");
    $availabilityButton.classList.toggle("availability-button-loading", loadingAvailability);

    if (!selectedDate) {
      $availabilityButton.removeEventListener("click", this.onCheckAvailability);
    } else {
      $availabilityButton.addEventListener("click", this.onCheckAvailability);
    }

    // Remove the previous availabilities
    const $availabilityDetails = this.$availability.querySelector(".availability-details");
    $availabilityDetails.replaceChildren();

    if (timeAvailability) {
      // Get the current selected times
      const [$start, $end] = this.$time.querySelectorAll(".calendar-time-dropdown");
      const startTime = dayjs($start.value, "HH:mm").format("h:mma");
      const endTime = dayjs($end.value, "HH:mm").format("h:mma");

      const $availabilityTitle = document.createElement("div");
      $availabilityTitle.classList.add("availability-title");
      $availabilityTitle.innerText = `${selectedDate.format("MMMM DD, YYYY")} - ${startTime} to ${endTime}`;

      const $availabilityFees = document.createElement("div");
      $availabilityFees.classList.add("availability-fees");
      $availabilityFees.innerHTML = timeAvailability.fees
        .filter((fee) => fee.price > 0)
        .map((fee) => {
          const descriptionHtml = fee.description
            ? `
              <div class="line-item-row">
                <div class="line-item-description">${fee.description}</div>
              </div>
            `
            : "";
          return `
            <div class="availability-fee">
              <div class="line-item-row">
                <div class="line-item-name">${fee.name}${fee.name === "Tax" ? "*" : ""}</div>
                <div class="line-item-price">$${fee.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
              </div>
              ${descriptionHtml}
            </div>
          `;
        })
        .join("");

      const total = timeAvailability.fees.reduce((total, fee) => (total += fee.price), 0);
      const $availabilityTotal = document.createElement("div");
      $availabilityTotal.classList.add("availability-total");
      $availabilityTotal.innerHTML = `
        <div class="line-item-row">
          <div class="line-item-name">Total</div>
          <div class="line-item-price">$${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
        </div>
      `;

      const $availabilityFootnote = document.createElement("div");
      $availabilityFootnote.classList.add("availability-footnote");
      $availabilityFootnote.innerText =
        "* Tax Exemption and discounted room rates will apply on final invoice after reservation approval.";

      const date = selectedDate.format("YYYY-MM-DD");
      const formUrl = `https://portal.dupontcenter.org/events/public?resID=${this.reservationId}&from=${date} ${$start.value}&to=${date} ${$end.value}`;
      const $availabilityAdd = document.createElement("div");
      $availabilityAdd.classList.add("availability-button", "availability-add");
      $availabilityAdd.addEventListener("click", () => (location.href = formUrl));
      $availabilityAdd.innerHTML = `
        Add to request
        <i class="fa-solid fa-plus availability-add-icon"></i>
      `;

      $availabilityDetails.replaceChildren(
        $availabilityTitle,
        $availabilityFees,
        $availabilityTotal,
        $availabilityFootnote,
        $availabilityAdd
      );
    }
  }
}

// Define the new element
customElements.define("reservations-widget", ReservationsWidget);
