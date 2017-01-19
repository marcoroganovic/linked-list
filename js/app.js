var LinkedList = (function() {

  
  var bookmForm = document.querySelector(".new-link");
  var urlTitle  = document.querySelector("#new-bookmark-title");
  var url       = document.querySelector("#new-bookmark-url");
  var addButton = document.querySelector("#add-bookmark");
  var linksContainer = document.querySelector(".links");

  var DATA = fetchData();

  function Bookmark(title, url, read) {
    this.id = DATA.length + 1;
    this.title = title;
    this.url = url;
    this.read = read;
  }

  function addToLocalStorage(data) {
    localStorage.setItem("bookmarks", JSON.stringify(data));
  }

  function addBookmark(obj) {
    DATA.push(obj);
    addToLocalStorage(DATA);
    displayResults(DATA);
  }

  function isValidUrl(str) {
    if(!str.length) return;
    return /^https?:\/\/.+/.test(str);
  }

  function checkForValues(title, url) {
    if(title.length > 0 && isValidUrl(url)) {
      addBookmark(new Bookmark(title, url, false));
      return true;
    }
    return false;
  }
  
  function fetchData() {
    return JSON.parse(localStorage.getItem("bookmarks")) || [];
  }

  function saveAndDisplay(data) {
    addToLocalStorage(data);
    displayResults(data);
  }

  function markAsRead(id) {
    DATA = DATA.map(function(bookmark) {
      if(bookmark.id === id) {
        bookmark.read = true;
      }
      return bookmark;
    });

    saveAndDisplay(DATA);
  }

  function removeItem(id) {
    DATA = DATA.filter(function(bookmark) {
      if(bookmark.id !== id) {
        return bookmark;
      }
    });
    
    saveAndDisplay(DATA);
  }

  function setupListeners() {
    addButton.addEventListener("click", function(e) {
      e.preventDefault();
      if(checkForValues(urlTitle.value, url.value)) {
        bookmForm.reset();
      }
    });

    linksContainer.addEventListener("click", function(e) {
      if(e.target.nodeName.toLowerCase() === "a") {
        var el = e.target;
        var id = +el.dataset.id;
        if(el.getAttribute("class") === "read") {
          markAsRead(id);
        } else {
          removeItem(id);
        }
      }
    });
  }

  function bookmarkItem(state) {
    return (
      `<div class="bookmark">
         <h2>${state.title}</h2>
         <a target="_blank" href="${state.url}">${state.url}</a>
         <div class="bookmark-buttons">
           <${state.read ? "span" : "a"} class="read" href="#" data-id="${state.id}">
             Read
           </${state.read ? "span" : "a"} >
           <a class="delete" href="#" data-id="${state.id}">Delete</a>
         </div>
       </div>`
    );
  }

  function displayResults(data) {
    if(!data.length) {
      linksContainer.innerHTML = (
          "<span>Currently there is no bookmarks...</span>"
      );
      return;
    }

    var output = "";

    data.forEach(function(bookmark) {
      output += bookmarkItem(bookmark);
    });

    return linksContainer.innerHTML = output;
  }


  function init() {
    setupListeners();
    displayResults(DATA);
  }

  return {
    init: init
  }

})();

LinkedList.init();
