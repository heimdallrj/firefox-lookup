(function () {
  const body = document.body;
  let lookupDialog;
  let initializedOnce = false;
  const maxWidth = 350;

  const getDefRequestUrl = (term, lang='en') => `https://api.dictionaryapi.dev/api/v1/entries/${lang}/${term}`;

  const lookupDialogDefaultHtml = 
    '<div>\
      <p>requesting...</p>\
    </div>';

  const initLookupDialog = () => {
    lookupDialog = document.createElement('div');
    lookupDialog.id = "incite-lookup-dialog";
    lookupDialog.style.cssText = `position:absolute;max-width:${maxWidth}px;z-index:999999;background:#e3d6d6;box-shadow: 5px 5px 5px #888;padding: 10px;`;
    lookupDialog.style.top = 0;
    lookupDialog.style.left = 0;
    lookupDialog.innerHTML = lookupDialogDefaultHtml;
    lookupDialog.style.display = "none";
    document.body.appendChild(lookupDialog);

    initializedOnce = true;
  };
  
  const init = () => {
    lookupDialog = document.getElementById("incite-lookup-dialog");
    if (lookupDialog) initializedOnce = true;

    // Initialize lookupDialog (if not already)
    if (!initializedOnce) initLookupDialog();
  };

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

  const getDialogOffset = (target) => {
    const region = target.getRangeAt(0).getBoundingClientRect();

    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const lookupDialogHeight = lookupDialog.innerHeight;

    const dialogPadding = 10;
    let leftOffset;
    let topOffset;

    leftOffset = region.left + region.width + 1 + dialogPadding;
    if (maxWidth + leftOffset > pageWidth - dialogPadding) {
      leftOffset = pageWidth - maxWidth - dialogPadding;
    }
    topOffset = region.top;
    if (topOffset + lookupDialogHeight > pageHeight) {
        topOffset -= lookupDialogHeight;
    }
    leftOffset += window.scrollX;
    topOffset += window.scrollY;

    return { top: `${topOffset}px`, left: `${leftOffset}px` };
  }

  const composeLookupDialogHtml = (data) => {
    const word = data[0].word;
    const phonetic = data[0].phonetic.join(', ');
    const meaningObj = data[0].meaning;
    const keys = Object.keys(meaningObj);

    const meaningHtml = keys.map((key) => {
      const meaning = meaningObj[key];
      const definition = meaning[0].definition;
      const example = meaning[0].example;

      return `
        <div>
          <p>${key}</p>
          <p>${definition}</p>
          <p>${example}</p>
        </div>
      `;
    });

    console.log(meaningHtml);

    const html = `
      <p>${word}, ${phonetic}</p>
      <div>${meaningHtml.join("")}</div>
    `;
    return `<div>${html}</div>`;
  };

  const dblClickHandler = async (evt) => {
    const target = getSelectedTarget();

    let searchTerm = getSearchTerm(target);
    if (!searchTerm || searchTerm.length === 0 || /\s+/.test(searchTerm)) return;

    // Set lookupDialog position
    const offset = getDialogOffset(target);
    lookupDialog.style.top = offset.top;
    lookupDialog.style.left = offset.left;

    // Fetch definition data
    const defRequestUrl = getDefRequestUrl(searchTerm)
    const response = await window.fetch(defRequestUrl);

    // TODO Handle errors and revert the code
    const data = await response.json();
    // const data = [
    //   {
    //     "word": "hello",
    //     "phonetic": [
    //       "həˈləʊ",
    //       "hɛˈləʊ"
    //     ],
    //     "meaning": {
    //       "exclamation": [
    //         {
    //           "definition": "used as a greeting or to begin a telephone conversation.",
    //           "example": "hello there, Katie!"
    //         }
    //       ],
    //       "noun": [
    //         {
    //           "definition": "an utterance of ‘hello’; a greeting.",
    //           "example": "she was getting polite nods and hellos from people"
    //         }
    //       ],
    //       "verb": [
    //         {
    //           "definition": "say or shout ‘hello’.",
    //           "example": "I pressed the phone button and helloed"
    //         }
    //       ]
    //     }
    //   }
    // ];

    const lookupDialogHtml = composeLookupDialogHtml(data);
    lookupDialog.innerHTML = lookupDialogHtml;

    lookupDialog.style.display = "block";
  };
  document.body.addEventListener("dblclick", dblClickHandler);

  init();
})();