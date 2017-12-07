$(function() {
  
  init();
  
  $(".add-row").on("click", add_row);
  $(".btn-parse").on("click", submit);
  
});

 // initialize with a new row
function init() {
  add_row();
}
// add a new row
function add_row() {
  // add new row for a new email address
  let source   = $("#tpl-row").html(),
      template = Handlebars.compile(source),
      html     = template({});
  $("form .rows").append(html);
}
// submit the emails
function submit() {
  let emails = is_valid();
  if(emails) {
    parse(emails);
  } else {
    log("form is NOT VALID!");
  }
}
// parse the given emails into SparkPost specs
function parse(emails) {
  let json = [], toEmail = emails.filter(function(e) { return e.type === "To"; })[0].email;
  for(var i=0; i < emails.length; i++) {
    let email = emails[i];
    
    /*
    structure example:
    [
      {"address":{"email":"info@domain.com"},"substitution_data":{"recipient_type":"Original"}},
      {"address":{"email":"bcc1@domain.com","header_to":"info@domain.com"},"substitution_data":{"recipient_type":"BCC"}},
      {"address":{"email":"bcc2@domain.com","header_to":"info@domain.com"},"substitution_data":{"recipient_type":"BCC"}},
      {"address":{"email":"cc@domain.com","header_to":"info@domain.com"},"substitution_data":{"recipient_type":"CC"}}]
    */
    
    if(email.type === "To") {
      json.push({
        "address": { "email": email.email },
        "substitution_data": { "recipient_type": "Original" }
      });
    }
    else {
      json.push({
        "address": { "email": email.email, "header_to": toEmail },
        "substitution_data": { "recipient_type" : email.type.toUpperCase() }
      });
    }    
  }
  write_response("recipients:" + JSON.stringify(json), false);
}
/* VALIDATION */
function is_valid() {
  let emails = [];
  $("form .rows .row").each((i, e) => {
    let row = $(e),
        type = row.find("select").val(),
        email = row.find("input.email-address").val();
 
    if(is_email_valid(email)) {
      emails.push({"type": type, "email": email});
    }
  });
  
  if(emails.filter((e) => e.type === "To").length === 0) {
    log('At least one of the emails has to be set as TO');
    return null;
  }
  return emails;
}
function is_email_valid(email) {
  let valid = email !== undefined && email.length > 0 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  if(!valid) { log("email '" + email + "' is not valid"); }
  return valid;
}
/* UTILITIES */
function write_response(msg, appendToExisting = true) {  
  let previous = "";
  if(appendToExisting) { previous = $(".response").html().trim() + "\n"; }
  $(".response").html(previous + msg).closest("div").show();
}
