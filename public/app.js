/*let ping = async () => {
    let status = false;
    if (navigator.onLine) {
        let res = await $.ajax({
            url: "https://cdn.jsdelivr.net/gh/kabeer11000/notes/ping.txt",
            async: true,
        });
        res != null || undefined ? status = true : "";
    }
    return status;
};*/
let ping = async () => {
    return navigator.onLine;
};
window.e = document.querySelector.bind(document);
const asyncLocalStorage = {
    setItem: async function (key, value) {
        await null;
        return localStorage.setItem(key, value);
    },
    getItem: async function (key) {
        await null;
        return localStorage.getItem(key);
    }
};
try {
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (e) {
    console.error(e);
    document.querySelector('.no-browser-support').classList.add('d-block');
}

let user_id = undefined;
const setUserID = async () => {
    null == localStorage.getItem("user") ? window.location.href = '/login' : (user_id = JSON.parse(localStorage.getItem("user")).user_id);
};
setUserID();
let noteTextarea = $('#note-textarea'),
    instructions = $('#recording-instructions'),
    notesList = $('div#notes'),
    noteContent = '';

async function checkSave_Del_list () {
    if (await asyncLocalStorage.getItem('delete-list'), await asyncLocalStorage.getItem('save-list') == null) {
        await asyncLocalStorage.setItem('delete-list', JSON.stringify([]));
        await asyncLocalStorage.setItem('save-list', JSON.stringify([]));
    }
checkDraft();
    let del_arr = JSON.parse(await asyncLocalStorage.getItem('delete-list'));
    if (del_arr.length > -1) {
        if (await ping()) {
            for (let i = 0; i < del_arr.length; i++) {
                await deleteFromServer(del_arr[i].date, user_id, del_arr[i].note_id)
            }
            await asyncLocalStorage.setItem('delete-list', JSON.stringify([]));
        }
    }
    let save_arr = JSON.parse(await asyncLocalStorage.getItem('save-list'));
    save_arr.length > -1 ? (await ping() ? (await saveToServer(), await asyncLocalStorage.setItem('save-list', JSON.stringify([]))) : "") : "";
}

async function checkDraft() {
    if (await asyncLocalStorage.getItem('draft') == null) {
    } else {
        //await asyncLocalStorage.getItem('draft').length ?  "" : displayNotification({body:"Complete your drafts now!", title:"You have Draft(s) Saved"});
    }
}

/*Char Count*/
document.querySelector('.char-counter').addEventListener('keyup', () => {
    let characterCount = e('.char-counter').value.length,
        current = e('#current'),
        maximum = e('#maximum'),
        theCount = e('#the-count');

    current.innerHTML = characterCount;

    /*This isn't entirely necessary, just playin around*/
    characterCount < 70 && document.querySelectorAll('#current').forEach(function(el) {el.style.color = "#666666";}),
    characterCount > 70 && characterCount < 90 && document.querySelectorAll('#current').forEach(function(el) {el.style.color = "#6d5555";}),
    characterCount > 90 && characterCount < 200 && document.querySelectorAll('#current').forEach(function(el) {el.style.color = "#793535";}),
    characterCount > 100 && characterCount < 520 && document.querySelectorAll('#current').forEach(function(el) {el.style.color = "#841c1c";}),
    characterCount > 120 && characterCount < 700 && document.querySelectorAll('#current').forEach(function(el) {el.style.color = "#8f0001";}),
        characterCount >= 140 ? (document.querySelectorAll('#maxium').forEach(function(el) {el.style.color = "#8f0001";}), document.querySelectorAll('#current').forEach(function(el) {el.style.color = "#8f0001";}),
            document.querySelectorAll('#maxium').forEach(function(el) {el.style.fontWeight="900";})) : (maximum.style.color = "#666", document.querySelectorAll('#maxium').forEach(function(el) {el.style.fontWeight="900";}))

});

/*----------------------------
        Read More
------------------------------*/
function showReadMore() {
    var maxLength = 200;
    $(".show-read-more").each(function () {
        var myStr = $(this).html();
        if ($.trim(myStr).length > maxLength) {
            var newStr = myStr.substring(0, maxLength);
            var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
            $(this).empty().html(newStr);
            $(this).append('<a href="javascript:void(0);" class="read-more link">More</a>');
            $(this).append('<span class="more-text">' + removedStr + '</span>');
        }
    });
    $(".read-more").click(function () {
        $(this).siblings(".more-text").contents().unwrap();
        $(this).remove();
    });
}

var ajax = {};
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];
    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};
ajax.send = function (d) {
    if (d.async === undefined) {
        d.async = !0;
    }
    var x = ajax.x();
    x.open(d.method, d.url, d.async);
    x.onreadystatechange = function () {
        if (x.readyState === 4) {
            callback(x.response)
        }
    };
    if (d.method === 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(d.data)
};
ajax.get = function (d) {
    var query = [];
    for (var key in d.data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(d.data[key]));
    }
    ajax.send(d.url + (query.length ? '?' + query.join('&') : ''), d.callback, 'GET', null, d.async)
};
ajax.post = function (d) {
    var query = [];
    for (var key in d.data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(d.data[key]));
    }
    ajax.send(d.url, d.callback, 'POST', query.join('&'), d.async)
};
/*-----------------------------
ajax.get({
    url : 'https://hosted-kabeersnetwork.000webhostapp.com/notes/server/alternate/getnotes.php?user_id=123456',
    async : true,
    callback : function (a) {
        console.log(a)
    }
});
*/

/*-----------------------------
      Voice Recognition
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses.
recognition.continuous = true;

// This block is called every time the Speech APi captures a line.
recognition.onresult = (event) => {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far.
    // We only need the current one.
    // Get a transcript of what was said.
    let current = event.resultIndex, transcript = event.results[current][0].transcript;
    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    let mobileRepeatBug = (current === 1 && transcript === event.results[0][0].transcript);
    !mobileRepeatBug ? (noteContent += transcript, noteTextarea.val(noteContent)) : "";
};

recognition.onstart = async () => {
    instructions.text('Speak Now');
};

recognition.onspeechend = async () => {
    $('#start-record-btn').html('mic');
    instructions.text("Didn't get that");
};

recognition.onerror = async (event) => {
    if (event.error === 'no-speech') {
        instructions.text("Didn't get that");
    }
};
$('#addNewNote').on('hidden.bs.modal', function () {
    location.hash = '';
    instructions.text("Tap to enable voice");
});

/*-----------------------------
      App buttons and input
------------------------------*/
let r_btn = $("#start-record-btn");
r_btn.on('click', function () {
    noteContent.length ? noteContent += ' ' : "";
    r_btn.html('mic_off').attr('onclick', 'stopRecogBTNK()');
    recognition.start();
    Snackbar({message: `Recording Started`});

});

const stopRecogBTNK = () => {
    r_btn.html('mic').removeAttr('onclick');
    recognition.stop();
};

$('#pause-record-btn').on('click', () => {
    recognition.stop();
    instructions.text('Voice recognition paused.');
    r_btn.html('mic');
});

function isNullOrEmpty(str) {
    return !str || !str.trim();
}

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function () {
    noteContent = $(this).val();
});
asyncLocalStorage.getItem('user').then(value => {
    e('.user_name').innerHTML = JSON.parse(value).username;
});
$('#save-note-btn').on('click', () => {
    recognition.stop();
    if (!noteContent.length || isNullOrEmpty(noteContent.toString())) {
        instructions.text('Empty note discarded');
        Snackbar({message: "Empty Note Discarded"})
    } else {
        function escapeHtml_Render(text) {
            var map = {
                '\n': ' '
            };
            return text.replace(/\n/g, async (m) => {
                return map[m];
            });
        }

        // Save note to localStorage.
        // The key is the dateTime with seconds, the value is the content of the note.
        let noteContentJSON = {
            content: noteContent,
            uniqid: uniqid()
        };
        let date = new Date().toLocaleString();
        saveNote(date, escapeHtml_Render(JSON.stringify(noteContentJSON)));

        // Reset variables and update UI.
        noteContent = '';
        noteTextarea.val('');
        instructions.text('Note saved');
        Snackbar({message: "Note Saved!", actiontext: "Undo"}, async () => {
            deleteFromServer(date, user_id, noteContentJSON.uniqid);
            let savelist = JSON.parse(localStorage.getItem('save-list')), i = 0;
            for (i = savelist.length - 1; i >= 0; i--) {
                if (savelist[i].uniqid === noteContentJSON.uniqid) {
                    savelist.splice(i, 1);
                    break;
                }
            }
            await asyncLocalStorage.setItem('save-list', JSON.stringify(savelist));
        });
    }
});
if(window.location.href.indexOf('#settings') !== -1) {
    $('.settings-modal').modal('show');
}
if(window.location.href.indexOf('#new') !== -1) {
    $('#addNewNote').modal('show');
}
if(window.location.href.indexOf('#search') !== -1) {
    $('#search').modal('show');
}

notesList.on('click', (e) => {
    e.preventDefault();
    const target = $(e.target);
    // Listen to the selected note.
    if (target.hasClass('listen-note')) {
        const content = target.closest('.note').find('.note-Content').text();
        $(target).addClass('btn-disabled');
        readOutLoud(content, () => {
            $('.listen-note').removeClass('btn-disabled')
        });
    }

    /*  // Delete note.
      if(target.hasClass('delete-note')) {
        var dateTime = target.siblings('.date').text();
        deleteNote(dateTime);
        target.closest('.note').remove();
      }
     */
});

/* Snackbar Function Start */

let Snackbar = (data, callback) => {
    !data.time ? data.time = 4000 : "";
    let div = document.createElement("DIV"), fab = document.querySelector('.k_fab');
    div.className = "snackbar";
    div.innerHTML = '<div class="content"><div class="msg">' + data.message + "</div></div></div>";
    if (data.actiontext) {
        let btn = document.createElement("DIV");
        btn.className = "action";
        btn.innerText = data.actiontext;
        btn.addEventListener("click", callback);
        div.querySelector(".content").appendChild(btn);
    }
    fab.classList.add('k-slide-down');
    document.body.appendChild(div);

    div.offsetTop;
    div.classList.add("show");
    setTimeout(() => {
        document.addEventListener("click", (e) => {
            if (e.target !== div && !div.contains(e.target)) {
                close()
            }
        })
    });
    setTimeout(() => {
        close()
    }, data.time);

    const close = () => {
        div.classList.remove("show");
        div.addEventListener("transitionend", () => {
            div.remove();
            fab.classList.remove('k-slide-down');
        });
    }
};

const urlify = (text) => {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
};

/* Snackbar Function End */

/* How to use?
Snackbar({messange: "Snackbar message", actiontext: 'Button Text'}, CallbackFunction)

document.querySelector(".one").addEventListener("click", () => {
  Snackbar({ message: "Hello! I am a Simple & Plain Snackbar!"});
  });


document.querySelector(".two").addEventListener("click", () => {
  Snackbar({ message: "Hello! I am a Snackbar with Action Button!", actiontext: "Open" }, () => {
    alert("Snackbar Action Button Clicked");
  });
});
*/
const contentEditableSaveHelper = async (e) => {
    if ((e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey)) {
        $(this).html(unescape($(this).html()));
        let target = $(e.target);
        let noteContent = target.closest('.note').find('.note-Content').text().substring(0, 1600);
        let date = target.closest('.note').find('.date').text();
        let id = target.closest('.note').find('.id').text();
        let data = {noteContent: noteContent, date: date, id: id};
        contentEditable(data).then(()=>{
            addEventListener_OnKeyDown();
        })
    }
};

const addEventListener_OnKeyDown = async () => {
    $(".note-Content").on('keydown', function (e) {
        contentEditableSaveHelper(e);
    });
};
addEventListener_OnKeyDown();

/*-----------------------------
      Speech Synthesis
------------------------------*/

const readOutLoud = (message, callback) => {
    let speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 0.8;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
    speech.onend = callback()
};

const replaceAll = (string, search, replace) => {
    return string.split(search).join(replace);
};
/*-----------------------------
      Helper Functions
------------------------------*/
const escapeHtml = (text) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
};

let contentEditableSaveHelperEle = async (e) => {
    $(e).text($(e).text());
    let target = $(e),
        noteContent = target.closest('.note').find('.note-Content').text(),
        date = target.closest('.note').find('.date').text(),
        id = target.closest('.note').find('.id').text(),
        data = {noteContent: noteContent, date: date, id: id};
    if (!noteContent.length || isNullOrEmpty(noteContent.toString())) {
        Snackbar({message: "Empty note deleted"});
    } else {
        contentEditable(data);
        Snackbar({message: "Note Saved!"});
    }
    addEventListener_OnKeyDown();
};
const renderNotes = (notes) => {
    const escapeHTML_r = (unsafe) => {
        return unsafe
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    };
    let html = '';
    if (notes.length) {
        for (let i = 0; i < notes.length; i++) {
            let note = notes[i], heading = note.content.split('\n')[0]; // lines is an array of strings
            note.content = note.content.substring(heading.length);
            html += `<div class="col-md-6 col-xl-4 col-xs-12 col-sm-6 mt-3 note pt-2 ${note.uniqid}">
            <div class=" card h-100 w-100">
            <p class="header d-flex p-3" style="justify-content:space-around">
                <span class="d-none id">${note.uniqid}</span>
                <span class="date">${note.date}</span>
                <a href="#" class="listen-note material-icons" title="Listen to Note">volume_up</a>
                <a onclick="deleteFromServer('${note.date}','${user_id}', '${note.uniqid}')" href="#" class="delete-note material-icons" title="Delete">delete</a>
            </p>
            <span class="note-Content p-4" onclick="this.contentEditable=true;$(this).closest('h3').remove()" onblur="this.contentEditable=false;contentEditableSaveHelperEle(this);" contenteditable="false">
            <h3>${heading}</h3><div class="pb-2"><p class="-show-read-more" style="word-wrap: break-word; white-space: pre-wrap;">${urlify(escapeHTML_r(note.content))}</p></div></span></div></div>`;
        }
    } else {
        html = `<div class="col-md-12 d-flex justify-content-center" style="margin-top: 25%">
              <img src="assets/icons/ic_launcher.png" style="width: 10rem;height: auto;opacity:100%"></div>
            <div class="col-md-12"><p class="text-center text-muted">Notes you add appear here</p></div>
            </div></div>`;
    }
    notesList.html(html);
};
const contentEditable = async (data) => {
    let noteContentJSON = {
        content: data.noteContent,
        uniqid: uniqid()
    };
    await deleteFromServer(data.date, user_id, data.id).then(()=>{
        saveNote(data.date, JSON.stringify(noteContentJSON));
    });
};
const saveNote = async (dateTime, content) => {
    asyncLocalStorage.setItem('note-' + dateTime, content).then(function () {
        ping() ? sync_now(false) : sync_now();
        getFromServer(user_id, renderNotes);
    });
};
const deleteNote = (dateTime) => {
    localStorage.removeItem('note-' + dateTime);
};
play_sound = async () => {
    let audio = {};
    audio["walk"] = new Audio();
    try {
        audio["walk"].src = "assets/sounds/notification.mp3";
    }catch (e) {
        console.warn(e)
    }
    audio["walk"].play()

};
const refresh = async () => {
    await getFromServer(user_id, renderNotes).then(() => {
        checkSave_Del_list();
    });
    Snackbar({message: 'Refreshed!'});
    await play_sound()
};

/*Util Functions*/
Array.prototype.inArray = function (comparer) {
    for (let i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
    }
    return false;
};
Array.prototype.pushIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};

function Utils() {
}

Utils.prototype = {
    constructor: Utils,
    isElementInView: function (element, fullyInView) {
        let pageTop = $(window).scrollTop(), pageBottom = pageTop + $(window).height(),
            elementTop = $(element).offset().top, elementBottom = elementTop + $(element).height();
        if (fullyInView === true) {
            return ((pageTop < elementTop) && (pageBottom > elementBottom));
        } else {
            return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
        }
    }
};
Utils = new Utils();

let uniqid = (a = "", b = false) => {
    const c = Date.now() / 1000;
    let d = c.toString(16).split(".").join("");
    while (d.length < 14) d += "0";
    let e = "";
    if (b) {
        e = ".";
        e += Math.round(Math.random() * 100000000);
    }
    return a + d + e;
};

/*Server Functions*/
const saveToServer = async () => {
    function escapeH_S(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/\\/g, "&#92;")
            .replace(/'/g, "&#039;");
    }

    let ajaxSave = async (data) => {
        const options = {
            method: 'POST',
            body: JSON.stringify({
                date: data.date,
                user_id: data.user_id,
                content: btoa(encodeURIComponent(escapeH_S(data.content))),
                uniqid: data.uniqid
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        await fetch("api/save", options)
            .then(()=>{
                console.log('Saved to Server');
            })
    };
    let key = undefined,
        i = 0;
    await getFromServer(user_id, async (save_arr) => {
        for (i = localStorage.length - 1; i >= 0; i--) {
            key = await localStorage.key(i);
            if (key.substring(0, 5) === 'note-') {
                const main = await JSON.parse(await localStorage.getItem(await localStorage.key(i)));
                let data = {
                    date: key.replace('note-', ''),
                    user_id: user_id,
                    content: main.content,
                    uniqid: main.uniqid,
                };
                let index = save_arr.findIndex(m => m.uniqid === data.uniqid);
                if (index <= -1) {
                    if (!await ping()) {
                        let save_arr = await JSON.parse(await localStorage.getItem('save-list')),
                            index = save_arr.findIndex(m => m.uniqid === data.uniqid);
                        if (index !== -1) {
                            save_arr.push({
                                date: data.date,
                                user_id: data.user_id,
                                content: data.content,
                                uniqid: data.uniqid,
                            });
                        }
                        await localStorage.setItem('save-list', JSON.stringify(save_arr));
                    }else{
                        await ajaxSave(data);
                    }//Else Statement
                }
            }
        }
    });
//    if (sessionStorage.getItem('last_synced'))
};
let getFromServer = async (user_id, callback = renderNotes) => {
    let notes = [];
    const ajaxGetNotes = async () => {
        await fetch("api/get/all/" + user_id)
            .then(res => res.json())
            .then(jqXHR => {
                let i;
                for (i = 0; i < jqXHR.length; i++) {
                    notes.push({
                        date: jqXHR[i].date,
                        content: jqXHR[i].content,
                        uniqid: jqXHR[i].uniqid,
                    })
                }
            });
        return notes.reverse();
    };
    !await ping() ? (callback(await getNotesFromLocalStorage()), console.warn('Cannot Fetch No Connection')) : (callback(await ajaxGetNotes()));
};
let deleteFromServer = async (datetime, user_id = user_id, note_id) => {
    if (!await ping()) {
        let del_arr = JSON.parse(localStorage.getItem('delete-list'));
        del_arr.push({
            note_id: note_id,
            date: datetime
        });
        await asyncLocalStorage.setItem('delete-list', JSON.stringify(del_arr));
    }
    let ajaxDelete = async (data) => {
        await fetch(`api/delete/one/${data.user_id}/${data.uniqid}`)
            .then(() => {
                console.log('Deleted Note From The Server');
            });
    };
    if (await ping()) {
        await ajaxDelete({
            user_id: user_id,
            uniqid: note_id
        });
    } else {
        console.warn('Cannot Delete No Connection!')
    }
    deleteNote(datetime);
    $('.' + note_id).remove();
    Snackbar({message: "Deleted!"});
};
let sync_now = async (ms = true) => {
    checkSave_Del_list();
    if (await ping()) {
        if (ms) {
            Snackbar({message: 'Synced!'});
            getFromServer(user_id, saveToDeviceFromServerHelper)
        } else {
        }
    } else {
        if (ms) {
            Snackbar({message: "Sync Failed, No Connection!", actiontext: "Retry"}, () => {
                sync_now();
            });
        } else {
        }
    }
    saveToServer();
};
const getNotesFromLocalStorage = () => {
    const escapeHTML_GET = (text) => {
        const map = {
            '<': '&lt;',
            '>': '&gt;',
        };
        return text.replace(/[<>]/g, function (m) {
            return map[m];
        });
    };
    let key = undefined, notes = [];
    for (let i = localStorage.length - 1; i >= 0; i--) {
        key = localStorage.key(i);
        if (key.substring(0, 5) === 'note-') {
            notes.push({
                date: key.replace('note-', ''),
                content: JSON.parse(escapeHTML_GET(localStorage.getItem(localStorage.key(i)))).content,
                uniqid: JSON.parse(escapeHTML_GET(localStorage.getItem(localStorage.key(i)))).uniqid
            });
        }
    }
    return notes;
};
const dE = async () => {
    localStorage.clear();
    await fetch("api/delete/all/" + user_id)
        .then(()=>{
            fetch("account/logout")
                .then(()=>{
                    window.location.href = '/login';
                });
            });
};
const saveToDeviceFromServerHelper = (p) => {
    saveToDeviceFromServer(p, getNotesFromLocalStorage());
};

let getPredictiveTextHelper = async (callback = smartCompose) => {
    let offline = async () => {
        return [];
    };
    const ajaxGetWords = async () => {
        let words = [];
        await fetch("https://hosted-kabeersnetwork.000webhostapp.com/notes/server/alternate/alternate/predictive/getArray.php?n=" + 5000)
            .then(res => res.json())
            .then(res => {
                    words = res;
            });
        return words;
    };
    !await ping() ? (await callback(await offline()), console.warn('Cannot Fetch No Connection')) : (await callback(await ajaxGetWords()));
};
let saveToDeviceFromServer = async (server, local) => {
    function arr_diff(a1, a2) {
        return a1.filter(x => !a2.includes(x));
    }
    let items = server;
    if (items.length > -1) {
        for (let i = items.length - 1; i >= 0; i--) {

            let noteContentJSON = {
                content: items[i].content,
                uniqid: items[i].uniqid
            };
            let save_arr = local,
                index = save_arr.filter(m => m.uniqid === noteContentJSON.uniqid);
            if (index > -1){
                await saveNote(items[i].date, JSON.stringify(noteContentJSON));
            }
        }
    }
};
//SYNC Each Hour
let dayInMilliseconds = 1000 * 60 * 60 * 0.5;
setInterval(function () {
    sync_now();
    getFromServer(user_id, saveToDeviceFromServerHelper);
}, dayInMilliseconds);

/*Style Functions*/
function focusTextarea() {
    $('#note-textarea').focus();
}

e('.year').innerHTML = new Date().getFullYear();
/*Testing Calls*/

/*        $.ajax({
            url: "https://hosted-kabeersnetwork.000webhostapp.com/notes/server/alternate/getnotes.php?user_id=" +user_id,
            type: 'GET',
            async: true,
        }).then((val)=>console.log(val));


https://hosted-kabeersnetwork.000webhostapp.com/tinyFileManager.php?p=notes%2F12
https://filemanager.ai/new/#
https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers
https://material.io/resources/icons/?search=new&style=baseline
http://jsfiddle.net/zVu8R/
http://auth.kabeersnetwork.rf.gd/js-sdk/
https://codepen.io/dagalti/pen/BELagK
https://www.webqc.org/balance.php
https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/
http://185.27.134.10/sql.php?db=epiz_26104846_auth&table=clients&pos=0
https://pk.godaddy.com/community/GoDaddy-Web-Hosting/Spring-Boot-hosting/td-p/54316
*/
// $('.mdc-drawer').addClass('mdc-drawer--closing')

//    saveToDeviceFromServer(getFromServer(user_id), getNotesFromLocalStorage())
/*let prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.querySelector(".bottom-nav").style.bottom = "0";
    } else {
        document.querySelector(".bottom-nav").style.bottom = "-50px";
    }
    prevScrollpos = currentScrollPos;
};
*/
const options = {
    shouldSort: true,
    findAllMatches: false,
    keys: [
        "content",
        "date",
        "id"
    ]
};
/*$(window).scroll(function() {
    document.querySelector('#docs-nav .active').scrollIntoView({ behavior: 'smooth', block: 'center'  })
});
*/
const escapeHTML_r = (unsafe) => {
    return unsafe
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
};
let data = undefined, search_input = $('.search-input');
search_input.on('focus', () => {
    data = getNotesFromLocalStorage();
});
search_input.on('keyup', () => {
    $('.search-container').html('');
    const fuse = new Fuse(data, options), pattern = search_input.val();
    let p = fuse.search(pattern);
    console.log(p)
    p.length < 1 ? $('.search-container').html(`<div class="col-md-12 text-center"><div style="margin-top: 3rem!important;padding: 1rem!important;">Your Search Matched Nothing</div></div>`) : "";
    for (let i = p.length - 1; i >= 0; i--) {
        let note = p[i].item, heading = note.content.split('\n')[0]; // lines is an array of strings
        $('.search-container').append(`<div class="col-md-6 col-xl-4 col-xs-12 col-sm-6 mx-3 note pt-2 ${note.uniqid}" style="margin-top: 1.5rem!important;"><div class=" card border text-left h-100 w-100"><p class="header d-flex p-3" style="justify-content:space-around"><span class="d-none id">${note.uniqid}</span><span class="date">${note.date}</span><a href="#" class="listen-note material-icons" title="Listen to Note">volume_up</a><a onclick="deleteFromServer('${note.date}','${user_id}', '${note.uniqid}')" href="#" class="delete-note material-icons" title="Delete">delete</a></p><span class="note-Content p-4" onclick="this.contentEditable=true;$(this).closest('h3').remove()" onblur="this.contentEditable=false;contentEditableSaveHelperEle(this);" contenteditable="false"><h3>${heading}</h3><div class="pb-2"><p class="-show-read-more" style="word-wrap: break-word; white-space: pre-wrap;">${urlify(escapeHTML_r(note.content.substring(heading.length)))}</p></div></span></div></div>`);
    }
});
/*
let swRegistration = undefined;
if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('sw.js').then(function (swReg) {
        console.log("Service Worker Registered");
        swRegistration = swReg;
    })
}
// Then later, request a one-off sync:
navigator.serviceWorker.ready.then(function (swRegistration) {
    return swRegistration.sync.register('bg-sync');
});*/
getFromServer(user_id, renderNotes).then(() => {
    $('#preloader').remove();
});
mouseMoveEventListener = () => {
    document.querySelector('#note-textarea').addEventListener('blur', async () => {
        if ($.trim($('#note-textarea').val()).length > 0) {
            await localStorage.setItem('draft', $('#note-textarea').val());
        }
        mouseMoveEventListener();
    });
};
mouseMoveEventListener();
document.querySelector('.add-new-note').addEventListener('click', async () => {
    $('#addNewNote').modal('show', {focus: false});
    if (await localStorage.getItem('draft') !== null) {
        $('#note-textarea').val(unescape(await localStorage.getItem('draft')));
        $('#note-textarea').focus()
        localStorage.removeItem('draft');
    }
});
$('.settings-show').click(function () {
    $('#settings').modal('show');
});
smartCompose_save = async () => {
    let checkBox = document.getElementById("cbx");
    if (checkBox.checked) {
        asyncLocalStorage.setItem('smartcompose', JSON.stringify('true'))
    } else {
        asyncLocalStorage.setItem('smartcompose', JSON.stringify('false'))
    }
    Snackbar({message: "Saved, Refresh to see changes!", actiontext: "Refresh", time: 9999}, () => {
        window.location.reload()
    })
};
smartCompose_check = async () => {
    if (localStorage.getItem('smartcompose') === null) {
        localStorage.setItem('smartcompose', JSON.stringify('true'));
    }
    let smartcompose = JSON.parse(localStorage.getItem('smartcompose'));
    JSON.parse(smartcompose) ? document.querySelector("#cbx").checked = true : document.querySelector("#cbx").checked = false;
};
smartCompose_check();
window.addEventListener('offline', function () {
    Snackbar({message: "Connection Lost"})
});
window.addEventListener('online', function () {
    Snackbar({message: "Reconnected !"})
});

function notification(data) {
    const options = {
        body: data.body,
        icon: 'assets/icons/ic_launcher.png'
    };
    swRegistration.showNotification(data.title, options);
}

function displayNotification(data) {
    //Ask user if we show notifications
    if (window.Notification && Notification.permission === 'granted') {
        notification({body: data.body, title: data.title})
    } else if (window.Notification && Notification.permission !== 'denied') {
        Notification.requestPermission(status => {
            if (status === 'granted') {
                notification({body: data.body, title: data.title})
            } else {
                // If the user refuses to get notified
                Snackbar({message: 'You denied permissions to notifications.', actiontext: 'Allow'}, () => {
                    displayNotification({body: 'Important Events will appear here', title: "Notification Enabled!"});
                });
            }
        });
    } else {
        // If the user refuses to get notified
        Snackbar({message: 'You denied permissions to notifications.', actiontext: 'Allow'}, () => {
            displayNotification({body: 'Important Events will appear here', title: "Notification Enabled!"});
        });
    }
}
$('#settings').on('hidden.bs.modal', function () {
    location.hash = '';
});

window.onpopstate = function () {
    $('.modal').modal('hide');
    history.go(1);
};/*
function animate_modal(x) {
    $('.modal .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
}
$('.modal').on('hide.bs.modal', function (e) {
    animate_modal('slideOutDown');
});
*/
