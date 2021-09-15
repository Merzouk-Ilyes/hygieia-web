$(document).ready(function () {
  $(".preventSubmit").submit(function (e) {
    $("#loaderId").css("display", "block");

    console.log($(this).serializeArray());
    var arrayData = $(this).serializeArray();

    var url;
    if (arrayData[0].name == "patient14") {
      url = "/users/medecin/makeCas14";
    } else if (arrayData[0].name == "patient18") {
      url = "/users/medecin/makeCas18";
    } else if (arrayData[0].name == "patient11") {
      url = "/users/medecin/makeCas11";
    } else if (arrayData[0].name == "patient19") {
      url = "/users/medecin/makeCas19";
    } else if (arrayData[0].name == "patient3") {
      url = "/users/medecin/makeCas3";
    } else if (arrayData[0].name == "patient6") {
      url = "/users/medecin/makeCas6";
    } else if (arrayData[0].name == "patient7") {
      url = "/users/medecin/makeCas7";
    }
    console.log(url);
    var formData = {
      [arrayData[0].name]: arrayData[0].value,
      [arrayData[1].name]: arrayData[1].value,
      [arrayData[2].name]: arrayData[2].value,
      [arrayData[3].name]: arrayData[3].value,
      [arrayData[4].name]: arrayData[4].value,
    };

    $.ajax({
      type: "POST",
      url: url,
      data: formData,

      success: function (data) {
        $("#loaderId").css("display", "none");

        //code here
        console.log("success !!!!", data.message);
        closeNav(arrayData[5].value);
        if (data.message == "error") {
          document.getElementById("alertId2").classList.add("showAlert");

          setTimeout(function () {
            document.getElementById("alertId2").classList.remove("showAlert");
          }, 2000);
        } else {
          document.getElementById("alertId").classList.add("showAlert");

          setTimeout(function () {
            document.getElementById("alertId").classList.remove("showAlert");
          }, 2000);
          setTimeout(function () {
            document.location.reload();
          }, 2000);
        }
      },
      error: function () {
        console.log("error !!!!");
        document.getElementById("alertId2").classList.add("showAlert");

        setTimeout(function () {
          document.getElementById("alertId2").classList.remove("showAlert");
        }, 2000);
      },
    });

    e.preventDefault();
    // breaks this
  });

  // CAS0 & CAS17
  $(".preventSubmit2").submit(function (e) {
    $("#loaderId").css("display", "block");

    console.log($(this).serializeArray());
    var arrayData = $(this).serializeArray();

    var url = "/users/medecin/makeCas0";

    // if (arrayData[0].name == "patient14") {
    //   url = "/users/medecin/makeCas14";
    // }
    // /users/medecin/makeCas0
    console.log(url);
    var formData = {
      [arrayData[0].name]: arrayData[0].value,
      [arrayData[1].name]: arrayData[1].value,
      [arrayData[2].name]: arrayData[2].value,
      [arrayData[3].name]: arrayData[3].value,
      [arrayData[4].name]: arrayData[4].value,
      [arrayData[5].name]: arrayData[5].value,
      [arrayData[6].name]: arrayData[6].value,
      [arrayData[7].name]: arrayData[7].value,
    };
    console.log(arrayData);

    $.ajax({
      type: "POST",
      url: url,
      data: formData,

      success: function (data) {
        $("#loaderId").css("display", "none");

        //code here
        console.log("success !!!!", data);
        closeNav(arrayData[7].value);
        if (data.message == "error") {
          document.getElementById("alertId2").classList.add("showAlert");

          setTimeout(function () {
            document.getElementById("alertId2").classList.remove("showAlert");
          }, 2000);
          // setTimeout(function () {
          //   document.location.reload();
          // }, 2000);
        } else {
          document.getElementById("alertId").classList.add("showAlert");

          setTimeout(function () {
            document.getElementById("alertId").classList.remove("showAlert");
          }, 2000);
          setTimeout(function () {
            document.location.reload();
          }, 2000);
        }
      },
      error: function (error) {
        console.log("error !!!!", error);
        document.getElementById("alertId2").classList.add("showAlert");

        setTimeout(function () {
          document.getElementById("alertId2").classList.remove("showAlert");
        }, 2000);
        setTimeout(function () {
          document.location.reload();
        }, 2000);
      },
    });

    e.preventDefault();
    // breaks this
  });

  $(".preventSubmit17").submit(function (e) {
    $("#loaderId").css("display", "block");

    console.log($(this).serializeArray());
    var arrayData = $(this).serializeArray();

    var url = "/users/medecin/makeCas17";

    console.log(url);
    var formData = {
      [arrayData[0].name]: arrayData[0].value,
      [arrayData[1].name]: arrayData[1].value,
      [arrayData[2].name]: arrayData[2].value,
      [arrayData[3].name]: arrayData[3].value,
      [arrayData[4].name]: arrayData[4].value,
      [arrayData[5].name]: arrayData[5].value,
      [arrayData[6].name]: arrayData[6].value,
      [arrayData[7].name]: arrayData[7].value,
    };
    console.log(arrayData);

    $.ajax({
      type: "POST",
      url: url,
      data: formData,

      success: function (data) {
        $("#loaderId").css("display", "none");

        //code here
        console.log("success !!!!", data);
        closeNav(arrayData[7].value);
        if (data.message == "error") {
          document.getElementById("alertId2").classList.add("showAlert");

          setTimeout(function () {
            document.getElementById("alertId2").classList.remove("showAlert");
          }, 2000);
          // setTimeout(function () {
          //   document.location.reload();
          // }, 2000);
        } else {
          document.getElementById("alertId").classList.add("showAlert");

          setTimeout(function () {
            document.getElementById("alertId").classList.remove("showAlert");
          }, 2000);
          setTimeout(function () {
            document.location.reload();
          }, 2000);
        }
      },
      error: function (error) {
        console.log("error !!!!", error);
        document.getElementById("alertId2").classList.add("showAlert");

        setTimeout(function () {
          document.getElementById("alertId2").classList.remove("showAlert");
        }, 2000);
        setTimeout(function () {
          document.location.reload();
        }, 2000);
      },
    });

    e.preventDefault();
    // breaks this
  });

  $(".deleteSubmit").submit(function (e) {
    $("#loaderId").css("display", "block");

    console.log($(this).serializeArray());
    var arrayData = $(this).serializeArray();

    var url = "/users/medecin/delRow";

    console.log(url);
    var formData = {
      [arrayData[0].name]: arrayData[0].value,
      [arrayData[1].name]: arrayData[1].value,
    };
    console.log(arrayData);

    $.ajax({
      type: "POST",
      url: url,
      data: formData,

      success: function (data) {
        $("#loaderId").css("display", "none");

        //code here
        console.log("success !!!!", data);

        if (data.message == "error") {
          document.getElementById("alertId2").classList.add("showAlert");

          setTimeout(function () {
            document.getElementById("alertId2").classList.remove("showAlert");
          }, 2000);
          // setTimeout(function () {
          //   document.location.reload();
          // }, 2000);
        } else {
          document.getElementById("alertId").classList.add("showAlert");

          setTimeout(function () {
            document.getElementById("alertId").classList.remove("showAlert");
          }, 2000);
          setTimeout(function () {
            document.location.reload();
          }, 2000);
        }
      },
      error: function (error) {
        console.log("error !!!!", error);
        document.getElementById("alertId2").classList.add("showAlert");

        setTimeout(function () {
          document.getElementById("alertId2").classList.remove("showAlert");
        }, 2000);
        setTimeout(function () {
          document.location.reload();
        }, 2000);
      },
    });

    e.preventDefault();
    // breaks this
  });

  $(".submitModal").submit(function (e) {
    $("#modalLoader").css("display", "block");
    console.log($(this).serializeArray());
    var arrayData = $(this).serializeArray();

    var url = `/users/medecin/makeRDVind/?id=${arrayData[2].value}`;

    console.log(url);
    var formData = {
      [arrayData[0].name]: arrayData[0].value,
      [arrayData[1].name]: arrayData[1].value,
      [arrayData[2].name]: arrayData[2].value,
    };
    console.log(arrayData);

    $.ajax({
      type: "POST",
      url: url,
      data: formData,

      success: function (data) {
        $("#modalLoader").css("display", "none");
        //code here
        console.log("success !!!!", data);

        if (data.message == "error") {
          if ($("#modalAlert2").is(":empty")) {
            document.getElementById("modalAlert2").append(data.error);
          }
          document.getElementById("modalAlert2").classList.add("showAlert");

          setTimeout(function () {
            document
              .getElementById("modalAlert2")
              .classList.remove("showAlert");
          }, 2000);
          // setTimeout(function () {
          //   document.location.reload();
          // }, 2000);
        } else {
          document.getElementById("modalAlert").classList.add("showAlert");

          setTimeout(function () {
            document.getElementById("modalAlert").classList.remove("showAlert");
          }, 2000);
          setTimeout(function () {
            document.location.reload();
          }, 2000);
        }
      },
      error: function (error) {
        console.log("error !!!!", error);
        document.getElementById("alertId2").classList.add("showAlert");

        setTimeout(function () {
          document.getElementById("alertId2").classList.remove("showAlert");
        }, 2000);
        setTimeout(function () {
          document.location.reload();
        }, 2000);
      },
    });

    e.preventDefault();
    // breaks this
  });
});
