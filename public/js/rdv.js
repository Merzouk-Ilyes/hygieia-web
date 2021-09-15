mobiscroll.setOptions({
  // Specify language like: locale: mobiscroll.localePl or omit setting to use default
  theme: "ios", // Specify theme like: theme: 'ios' or omit setting to use default
  themeVariant: "light", // More info about themeVariant: https://docs.mobiscroll.com/5-9-1/javascript/eventcalendar#opt-themeVariant
});
let data = [];

let ajouterData;
var oldEvent,
  tempEvent = {},
  deleteEvent,
  restoreEvent,
  titleInput = document.getElementById("event-title"),
  descriptionTextarea = document.getElementById("event-desc"),
  allDaySwitch = document.getElementById("event-all-day"),
  freeSegmented = document.getElementById("event-status-free"),
  busySegmented = document.getElementById("event-status-busy"),
  deleteButton = document.getElementById("event-delete"),
  datePickerResponsive = {
    medium: {
      controls: ["calendar", "time"],
      touchUi: false,
    },
  },
  datetimePickerResponsive = {
    medium: {
      controls: ["calendar", "time"],
      touchUi: false,
    },
  },
  now = new Date(),
  myData = [];

// let data = [
//   {
//     id: 1,
//     start: now.toISOString(),
//     end: now.toISOString(),
//     title: "i.merzouk@esi-sba.dz ",
//     description: "description",
//     color: "#26c57d",
//   },

// ];
var calendar;
$("#loaderId").css("display", "block");

$.ajax({
  url: "http://localhost:3000/users/medecin/rdvdata",
  type: "GET",
  dataType: "json",

  success: function (dat) {
    console.log("success: ", dat);
    data.push(...dat);
    $("#loaderId").css("display", "none");

    calendar = mobiscroll.eventcalendar("#demo-add-delete-event", {
      clickToCreate: "double",
      dragToCreate: true,
      dragToMove: true,
      dragToResize: true,
      view: {
        calendar: { labels: true },
      },
      data: data,
      onEventClick: function (args) {
        oldEvent = Object.assign({}, args.event);
        tempEvent = args.event;

        if (!popup.isVisible()) {
          // createEditPopup(args);
        }
      },
      onEventCreated: function (args) {
        popup.close();
        // store temporary event
        tempEvent = args.event;
        createAddPopup(args.target);
      },
      onEventDeleted: function () {
        mobiscroll.snackbar({
          button: {
            action: function () {
              calendar.addEvent(args.event);
            },
            text: "Undo",
          },
          message: "Event deleted",
        });
      },
    });
  },
  error: function (error) {
    console.log(`Error ${error}`);
  },
});

function createAddPopup(elm) {
  // hide delete button inside add popup
  deleteButton.style.display = "none";

  deleteEvent = true;
  restoreEvent = false;

  // set popup header text and buttons for adding
  popup.setOptions({
    headerText: "Nouveau RDV",
    buttons: [
      "cancel",
      {
        text: "Ajouter",
        keyCode: "enter",
        handler: function () {
          calendar.updateEvent({
            id: tempEvent.id,
            title: tempEvent.title,
            description: tempEvent.description,
            allDay: tempEvent.allDay,
            start: tempEvent.start,
            end: tempEvent.end,
            color: tempEvent.color,
          });

          // THIS IS WHERE WE GONNA ADD THE DATA INCHALLAH (POST)
          ajouterData = tempEvent;
          console.log("AJOUTER DATA =>>", ajouterData);
          $("#loaderId").css("display", "block");

          $.ajax({
            type: "POST",
            url: "/users/medecin/makeRDV",
            data: {
              rdv_patient: ajouterData.title,
              rdv_description: ajouterData.description,
              rdv_date: ajouterData.start,
            },

            success: function (data) {
              $("#loaderId").css("display", "none");

              //code here
              console.log("success !!!!", data);
              // closeNav(arrayData[5].value);
              if (data.message == "error") {
                document.getElementById("alertId2").append(data.error);
                document.getElementById("alertId2").classList.add("showAlert");

                setTimeout(function () {
                  document
                    .getElementById("alertId2")
                    .classList.remove("showAlert");
                }, 2000);
                setTimeout(function () {
                  document.location.reload();
                }, 2100);
              } else {
                document.getElementById("alertId").classList.add("showAlert");

                setTimeout(function () {
                  document
                    .getElementById("alertId")
                    .classList.remove("showAlert");
                }, 2000);
                setTimeout(function () {
                  document.location.reload();
                }, 2100);
              }
            },
            error: function () {
              console.log("error !!!!");
              // document.getElementById("alertId2").classList.add("showAlert");

              // setTimeout(function () {
              //   document.getElementById("alertId2").classList.remove("showAlert");
              // }, 2000);
            },
          });

          // navigate the calendar to the correct view
          calendar.navigate(tempEvent.start);

          deleteEvent = false;
          popup.close();
        },
        cssClass: "mbsc-popup-button-primary",
      },
    ],
  });

  // fill popup with a new event data
  mobiscroll.getInst(titleInput).value = "";
  mobiscroll.getInst(descriptionTextarea).value = "";
  mobiscroll.getInst(allDaySwitch).checked = true;
  range.setVal([tempEvent.start, tempEvent.end]);
  mobiscroll.getInst(busySegmented).checked = true;
  range.setOptions({ controls: ["date"], responsive: datePickerResponsive });

  // set anchor for the popup
  popup.setOptions({ anchor: elm });

  popup.open();
}
var popup = mobiscroll.popup("#demo-add-popup", {
  display: "bottom",
  contentPadding: false,
  fullScreen: true,
  onClose: function () {
    if (deleteEvent) {
      calendar.removeEvent(tempEvent);
    } else if (restoreEvent) {
      calendar.updateEvent(oldEvent);
    }
  },
  responsive: {
    medium: {
      display: "anchored",
      width: 400,
      fullScreen: false,
      touchUi: false,
    },
  },
});

titleInput.addEventListener("input", function (ev) {
  // update current event's title
  tempEvent.title = ev.target.value;
});

descriptionTextarea.addEventListener("change", function (ev) {
  // update current event's title
  tempEvent.description = ev.target.value;
});

var range = mobiscroll.datepicker("#event-date", {
  controls: ["date"],
  select: "range",
  startInput: "#start-input",
  endInput: "#end-input",
  showRangeLabels: false,
  touchUi: true,
  responsive: datePickerResponsive,
  onChange: function (args) {
    var date = args.value;
    // update event's start date
    tempEvent.start = date[0];
    tempEvent.end = date[1];
  },
});

document.querySelectorAll("input[name=event-status]").forEach(function (elm) {
  elm.addEventListener("change", function () {
    // update current event's free property
    tempEvent.free = mobiscroll.getInst(freeSegmented).checked;
  });
});

function collapse(id) {
  var icon = document.getElementById(id);
  var rdvInfo = document.getElementById(id + id);
  if (rdvInfo.style.display === "block") {
    rdvInfo.style.display = "none";
    icon.style.transform = "rotate(180deg)";
  } else {
    rdvInfo.style.display = "block";
    icon.style.transform = "rotate(0deg)";
  }
}
