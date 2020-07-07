(function () {
  console.log("incite-lookup started...");

  const body = document.body;
  body.addEventListener("dblclick", (evt) => {
    let target;

    if (window.getSelection) {
      target = window.getSelection();
    } else if (document.getSelection) {
      target = document.getSelection();
    } else if (document.selection) {
      target = document.selection.createRange().text;
    }

    const searchTerm = target.toString().trim();
    console.log("$lookup term:", searchTerm);
  });
})();