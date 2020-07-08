(function () {
  console.log("incite-lookup started...");

  const body = document.body;
  let latestTarget = null;
  let searchTerm = null;
  let lookupDialog;
  let initializedOnce = false;

  const defaultStyles = 
    '<style>\
      div#incite-lookup-dialog {\
        position: absolute;\
        background-color: #e3d6d6;\
      }\
    </style>';

  const lookupDialogHtml = 
    `${defaultStyles}\
    <div id="incite-lookup-dialog-container">\
      <p>lookupDialog</p>\
    </div>`;

  lookupDialog = document.getElementById("incite-lookup-dialog");
    if (lookupDialog) initializedOnce = true;

  const getSelectedTarget = () => {
    let target;
    if (window.getSelection) {
      target = window.getSelection();
    } else if (document.getSelection) {
      target = document.getSelection();
    } else if (document.selection) {
      target = document.selection.createRange().text;
    }
    return target;
  }

  const getSearchTerm = (target) => target ? target.toString().trim() : null;

  const initLookupDialog = () => {
    lookupDialog = document.createElement('div');
    lookupDialog.id = "incite-lookup-dialog";
    lookupDialog.innerHTML = lookupDialogHtml;
    body.appendChild(lookupDialog);

    initializedOnce = true;
  };

  const dblClickHandler = (evt) => {
    //Initialize lookupDialog (if not already)
    if (!initializedOnce) initLookupDialog();

    requestDefinition(getSelectedTarget(), evt);
  };
  body.addEventListener("dblclick", dblClickHandler);

  const requestDefinition = async (target, evt) => {
    latestTarget = target;

    searchTerm = getSearchTerm(target);
    if (!searchTerm || searchTerm.length === 0 || /\s+/.test(searchTerm)) return;

    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    console.log("$ ", response);
  };

})();