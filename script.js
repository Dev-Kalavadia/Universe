let allMarkers = [];
let markersCluster;

let map = L.map('map').setView([21.505, 35.09], 3);

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
    minZoom: 1,
    maxZoom: 16,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'jpg'
}).addTo(map);

let body = document.querySelector('body');
body.onload = loadData;

var markerIcon = L.icon({
    iconUrl: 'https://universe.heritagelab.center/wp-content/uploads/2023/03/icons8-white-circle-48.png',
    iconSize: [32, 32], // size of the icon
    iconAnchor: [22, 22], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function loadData() {
    filterMarkers(function (output) {
        if (markersCluster) {
            map.removeLayer(markersCluster);
        }
        console.log(output)
        allMarkers = [];
        for (var i = 0; i < output.length; i++) {
            allMarkers.push(JSON.parse(output[i].replace(/[\u0000-\u001F\u007F-\u009F]/g, "")));
        }
        markersCluster = new L.MarkerClusterGroup();
        for (var j = 0; j < allMarkers.length; j++) {
            let m = new L.marker(allMarkers[j].position, { icon: markerIcon });
            console.log(allMarkers[j].thumbnail)
            m.bindPopup(popupContent(allMarkers[j].title, allMarkers[j].thumbnail, allMarkers[j].link, allMarkers[j].excerpt))
            markersCluster.addLayer(m);
        }

        map.addLayer(markersCluster);
    });
}

function popupContent(title, thumbnail, link, excerpt) {
    return '<h5>' + title + '</h5><img width="25%" src="' + thumbnail + '" alt="' + title + '"/><p>' + excerpt + '</p><a href="' + link + '">Read More</a>'
}

// Set active tree type
var btns1 = document.getElementsByClassName("btn1");
for (var i = 0; i < btns1.length; i++) {
    btns1[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active1");
        current[0].className = current[0].className.replace(" active1", "");
        this.className += " active1";
    });
}

var treeItems = document.querySelectorAll('.dropup .dropup-content .btn1');
treeItems.forEach(function (item) {
    item.addEventListener('click', handleTreeDropdownClick);
});

function handleTreeDropdownClick(event) {
    var selectedText = event.target.textContent;
    var button = document.querySelector('.dropup .dropbtn');
    button.textContent = selectedText + ' ›';
}

document.getElementById('search-btn').addEventListener('click', function () {
    document.getElementById('filter-sidebar').classList.toggle('active');
    

});

// Set active theme
var btns2 = document.getElementsByClassName("btn2");
for (var i = 0; i < btns2.length; i++) {
    btns2[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active2");
        current[0].className = current[0].className.replace(" active2", "");
        this.className += " active2";
    });
}

function handleThemeDropdownClick(event) {
    var selectedText = event.target.textContent;
    var button = document.querySelector('.dropup2 .dropbtn2');
    button.textContent = selectedText + ' ›';
}

var themeItems = document.querySelectorAll('.dropup2 .dropup-content2 .btn2');
themeItems.forEach(function (item) {
    item.addEventListener('click', handleThemeDropdownClick);
});

function filterMarkers(handleData) {
    return $.ajax({
        method: 'POST',
        dataType: 'json',
        url: my_var.ajaxurl,
        data: {
            _wpnonce: my_var.nonce,
            action: 'my_php_ajax_function'
        },
        success: function (msg) {
            handleData(msg);
            $.ajax({
                type: 'POST',
                data: {
                    updated: 'yes',
                },
                success: function (data) {
                },
                error: function () {
                }
            })
        }
    })
}

///Submenu Section///

function toggle(element) {
    element.classList.toggle("change");
}

// Select all labels
var labels = document.querySelectorAll('.submenu-label');

// Select all checkboxes
var checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));


// Function to toggle all checkboxes
function toggleAllCheckboxes() {
    // Check if all checkboxes are checked
    var areAllChecked = checkboxes.every(function (checkbox) {
        return checkbox.checked;
    });

    // Toggle all checkboxes
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = !areAllChecked;
    });
}

// Function to toggle all labels
function toggleAllLabels() {
    // Check if all checkboxes are checked
    var areAllChecked = checkboxes.every(function (checkbox) {
        return checkbox.checked === true;
    });

    // Toggle all labels
    labels.forEach(function (label) {
        label.classList.toggle('active', !areAllChecked);
    });
}

// // Add an event listener to each label
// labels.forEach(function (label) {
//     label.addEventListener('click', function (event) {
//         // Get the checkbox associated with this label
//         var checkbox = document.querySelector('#' + this.getAttribute('for'));

//         if (checkbox.checked) {
//             checkbox.checked = !checkbox.checked;

//         }

//         // Toggle the submenu

//     });
// });

// Function to toggle the visibility of a submenu
function toggleSubmenu(submenuId, show) {
    var submenu = document.getElementById(submenuId);
    submenu.style.display = show ? "block" : "none";
}

// Event listener for labels
labels.forEach(function (label) {
    label.addEventListener('click', function (event) {
        // Prevent the default action and stop propagation
        event.preventDefault();
        event.stopPropagation();

        // Get the associated checkbox
        var checkbox = document.querySelector('#' + this.getAttribute('for'));

        // Toggle the checkbox
        checkbox.checked = !checkbox.checked;

        // Get the associated submenu ID
        var submenuId = this.getAttribute('data-submenu-id');

        // Determine the current state of the submenu
        var isSubmenuVisible = document.getElementById(submenuId).style.display === "block";

        // Toggle the submenu visibility
        toggleSubmenu(submenuId, !isSubmenuVisible);
    });
});

// Event listener for checkboxes (if needed)
document.querySelectorAll('.topic-toggle').forEach(function (checkbox) {
    checkbox.addEventListener('click', function (event) {
        // Let the checkbox do its thing (check/uncheck)
        event.stopPropagation();

        // You can add additional functionality here if needed
    });
});
