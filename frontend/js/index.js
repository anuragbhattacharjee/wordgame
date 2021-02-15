$(function () {
  "use strict";

  $("[type='number']").keypress(function (evt) {
    evt.preventDefault();
  });

  var body = $("body");
  let charsSize = $("#numChars").val();
  let idx = 0;
  while (idx < charsSize) {
    $("#form").append(
      `<input type="text" id="char_${idx}" maxLength="1" size="1" placeholder="*"/>`
    );
    idx++;
  }

  $("#numChars").change(() => {
    let totalChars = $("#numChars").val();
    let lastid = $("#form input:last").attr("id");
    let lastindex = lastid ? Number(lastid.split("_")[1]) : 0;

    if (totalChars > lastindex) {
      $("#form input:last").after(
        `<input type="text" id="char_${
          lastindex + 1
        }" maxLength="1" size="1" placeholder="*"/>`
      );
    } else {
      $(`#char_${lastindex}`).remove();
    }
  });

  function goToNextInput(e) {
    var key = e.which,
      t = $(e.target),
      sib = t.next("#form input");
    if (key === 16 || key === 8) {
      e.preventDefault();
      return false;
    }
    if (key === 9) {
      return true;
    }
    if (!sib || !sib.length) {
      sib = body.find("#form input").eq(0);
    }

    sib.select().focus();
  }

  function onFocus(e) {
    $(e.target).select();
  }

  body.on("keyup", "#form input", goToNextInput);
  // body.on("keydown", "#form input", onKeyDown);
  body.on("click", "input", onFocus);
});

function findWords() {
  let lastid = $("#form input:last").attr("id");
  let lastindex = lastid ? Number(lastid.split("_")[1]) : 0;
  let idx = 0;
  let word = "";
  var letters = /^[0-9a-zA-Z]+$/;
  while (idx <= lastindex) {
    charc = $(`#char_${idx}`).val();
    if (charc && charc.match(letters)) {
      word += charc;
    } else {
      word += "*";
    }
    idx++;
  }

  const url = "http://127.0.0.1:5000/wordgame";
  $.post({
    url,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    type: "POST",
    data: JSON.stringify({
      chars: word,
    }),
    success: (res) => {
      divs = "";
      res.map((x) => {
        divs += `<div class="alert alert-primary" role="alert">${x}</div>`;
      });
      $(".words").html(divs);
    },
    error: (e) => {
      console.log(e);
    },
  });

  console.log("Word: ", word);
}
