var delayTimer;
var delayState;

var clearTimer;

function update() {
  var mp = document.getElementById("mp").value;
  var domain = document.getElementById("d").value;
  if (mp + domain == delayState) return;

  delayState = mp + domain;

  if (delayTimer !== undefined) {
    clearTimeout(delayTimer);
  }
  document.getElementById("out").innerHTML = "";
  delayTimer = setTimeout(delayed_update, 400);
}

function delayed_update() {
  var mp = document.getElementById("mp").value;
  var domain = document.getElementById("d").value;

  passwords = generate_list(mp, domain, 12, 1);
  display(passwords, true)
  memory(mp);
  setTimeout(clear, 3 * 60 * 1000);
}

function clear() {
  document.getElementById("mp").value = "";
  document.getElementById("d").value = "";
  document.getElementById("out").innerHTML = "";
  document.getElementById("memory").innerHTML = "";
  document.getElementById("memory").style.color = "black";
  document.getElementById("memory").style.backgroundColor = "white";
}

function memory(mp) {
  var colors = [
    ["#464646", "white"],
    ["#FF3939", "white"],
    ["#51E841", "white"],
    ["#1F1FFF", "white"],
    ["#60FDFD", "black"],
    ["#FD60FD", "black"],
    ["#FFF98C", "black"],
    ["#FDF3E7", "black"]
  ];
  var element = document.getElementById("memory");
  hash = expensify(mp);
  var indicator = 0;
  for (var i = 0; i < 8; i++) {
    indicator ^= hash[i];
  }
  texts = "QWERTYUIOPASDFGHJKLZXCVBNM";
  color_indicator = indicator % colors.length;
  if (color_indicator < 0) color_indicator += colors.length;
  element.style.backgroundColor = colors[color_indicator][0];
  element.style.color = colors[color_indicator][1];
  element.innerHTML = texts[((indicator % texts.length) + texts.length) % texts.length];
}

function select(id) {
  var text = document.getElementById(id);

  if (document.body.createTextRange) {
    var range = document.body.createTextRange();
    range.moveToElementText(text);
    range.select();
    } else if (window.getSelection) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function display(passwords, tooltips) {
  if (tooltips == null) {
    tooltips = false;
  }

  var output = document.getElementById("out");

  output.innerHTML = "";

  table = document.createElement("table");
  output.appendChild(table);

  header = document.createElement("tr");
  table.appendChild(header);

  element = document.createElement("td");
  header.appendChild(element);
  element.appendChild(document.createTextNode("No."));

  element = document.createElement("td");
  header.appendChild(element);
  element.appendChild(document.createTextNode("Full"));

  element = document.createElement("td");
  header.appendChild(element);
  element.appendChild(document.createTextNode("Simplified"));

  for (var i = 0; i < passwords.length; i++) {
    header = document.createElement("tr");
    table.appendChild(header);
    header.innerHTML = "<td class=\"password\">" + passwords[i][0] + "</td>";
    header.innerHTML += "<td class=\"password\">" + displayPassword(passwords[i][1], "e", i) + "</td>";
    header.innerHTML += "<td class=\"password\">" + displayPassword(passwords[i][2], "s", i) + "</td>";
  }
}

function displayPassword(password, type, index) {
  var id = "p" + type + index;
  output = "<span id=\"" + id + "\" onclick='select(\""+id+"\");'>" + password + "</span>";
  return output;
}

window.addEventListener("load", listeners);

function listeners() {
  document.getElementById("mp").addEventListener("keyup", update);
  document.getElementById("mp").addEventListener("change", update);

  document.getElementById("d").addEventListener("keyup", update);
  document.getElementById("d").addEventListener("change", update);
}
