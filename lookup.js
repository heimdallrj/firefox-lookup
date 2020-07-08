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
        width: 400px;\
        height: 100px;\
        overflow: scroll;\
        left: 0\
        top: 100px\
        display: none\
        z-index: 999999;\
        box-shadow: 5px 5px 5px #888;\
        padding: 10px;\
        maxWidth: 350px;\
        minWidth: 200px;\
        minHeight: 60px;\
      }\
    </style>';

  const lookupDialogHtml = 
    `${defaultStyles}\
    <div id="incite-lookup-dialog-container">\
      <p>requesting...</p>\
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
    lookupDialog.style.display = "none";
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

    const reqUrl = `https://api.dictionaryapi.dev/api/v1/entries/en/${searchTerm}`;

    var oRect = target.getRangeAt(0).getBoundingClientRect();

    console.log(oRect);

    const response = await window.fetch(reqUrl);
    const data = await response.json()
    document.getElementById("incite-lookup-dialog-container").innerHTML = `<pre>${JSON.stringify(data)}</pre>`;
    lookupDialog.style.display = "block";
  
    lookupDialog.style.zIndex = 99999;
    lookupDialog.style.top = 0;
    lookupDialog.style.left = 0;
  };

})();