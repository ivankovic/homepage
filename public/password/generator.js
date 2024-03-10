var simple_charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var extended_charset = simple_charset + "!@#$%^&*()_+-=[];,.~{}|:?";

function expensify(data) {
  for (var i = 0; i < 1337; i++) {
    data = sjcl.hash.sha256.hash(data);
  }
  return data;
}

function extract_bits(value, offset, length) {
  if (offset + length >= 32)
    length = 32 - offset;
  return (value >> (32 - offset - length)) & ((1<<length) - 1);
}

function humanify(code, charset, length) {
  var bits_per_char = ~~(256 / length);
  var current = 0;
  var current_bits = 0;

  var human_form = "";

  for (var i = 0; i < code.length; i++) {
    var offset = 0;
    while (bits_per_char - current_bits + offset < 32) {
      current ^= extract_bits(code[i], offset, bits_per_char - current_bits);
      offset += bits_per_char - current_bits;
      human_form += charset[current % charset.length];
      current_bits = 0;
      current = 0;
    }
    current = extract_bits(code[i], offset, 32 - offset) << (bits_per_char - (32 - offset));
    current_bits += 32 - offset;
  }

  return human_form;
}

function generate_pair(mp, domain, index) {
  var x = expensify(mp + domain + index);
  extended = humanify(x, extended_charset, 21);
  simple = humanify(x, simple_charset, 12);
  return [index, extended, simple];
}

function generate_list(mp, domain, num, offset) {
  passwords = new Array();

  for (var i = 0; i < num; i++) {
    password_pair = generate_pair(mp, domain, i + offset);
    passwords.push(password_pair);
  }

  return passwords;
}
