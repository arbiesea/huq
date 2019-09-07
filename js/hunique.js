var serverBaseURL = "http://127.0.0.1:8080/api/";



var counter = 1;
var totalSteps = 28;

var leap = null;

var noLeftHand = false;
var norightHand = false;

//Image being taken
var imageCode = null;

function doBegin() {
    $('#splash').fadeOut();
    $('#form').fadeIn();

    //do nextClick so we show panel 1
    nextClick(0);
}



function nextClick(step) {
    //Validate the currentPanel and move to the next
    ////TODO: Write the real code

    if (leap != null) {
        step = leap - 1;
    }

    //save the current panel elements to localStorage
    savePanelData(counter);

    $('#' + String(counter)).hide();
    counter = counter + step;

    

    $('#' + String(counter)).fadeIn();

    //now load the panel elements for this panel
    //loadPanelData(counter);

    setupHelp(counter);

    if (counter == totalSteps) {
        //Hide the next button
        $('#btnNext').hide();
    }
    else if (counter < totalSteps) {
        //Show both buttons
        $('#btnNext').show();
        $('#btnPrevious').show();
    }

    if (counter == 1) {
        //hide previous if at start
        $('#btnPrevious').hide();
    }

    //finally if the panel has the hideNext class, hide next!
    if ($('#' + String(counter)).hasClass("hideNext")) {
        $("#btnNext").hide();
    }
}

function keypad(key) {
    //controls the keypad for age entry
    if (key >= 0) {
        //entering a number key
        if ($('#txtAge').text() == "age...") {
            //this is first key entry
            $('#txtAge').text(String(key));
        }
        else {
            $('#txtAge').text($('#txtAge').text() + String(key));
        }
    }
    else {
        //key is either -1 (back) or -2 (clear)
        if (key == -2) {
            clearKeypad()
        }
        else {
            // -1 - backspace
            var textVal = $('#txtAge').text()
            if (textVal.length > 1) {
                //trim right character
                $('#txtAge').text($('#txtAge').text().slice(0, -1));
            }
            else {
                clearKeypad();
            }
        }
    }
}

function clearKeypad() {
    $('#txtAge').text("age...");
}


function togglePanel(cbxElement, sectionFields) {
    if (document.getElementById(cbxElement).checked) {
        document.getElementById(sectionFields).style.display = 'inline-block';
    }
    else {
        document.getElementById(sectionFields).style.display = 'none';
    }
}


function startPhoto(Reference) {

    //nastyHack - set the photo being taken
    imageCode = Reference;

    //photo is being taken - show the viewFinder
    $('#viewFinder').fadeIn();


    // Start the video stream when the window loads
    cameraStart();

}

function endPhoto() {
    //Photo has been taken, process and close viewFinder
}

function previewImage(Reference, source) {
    //show the next button if not visible - we now have an image so 

    $('#' + String(counter)).removeClass("hideNext");
    $("#btnNext").fadeIn();

    document.getElementById(Reference).style.backgroundImage = "url(" + source + ")";
}


function validateConsent() {
    //get consent objects
    var items = $(".cbxConsent:checkbox:checked");

    if (items.length == 6) {
        showNext();
    }
    else {
        hideNext();
    }
}

function showNext() {
    $('#' + String(counter)).removeClass("hideNext");
    $("#btnNext").fadeIn();
}
function hideNext() {
    $('#' + String(counter)).addClass("hideNext");
    $("#btnNext").fadeOut();
}

function savePanelData(panel) {
    try {
        //get a list of fields to save from the panel manifest json and set them in localStorage
        var pFields = panelManifest.filter(function (entry) { return entry.panel === panel; });

        //now we have the array want to  process each item in turn
        count = pFields[0].fields.length;

        for (i = 0; i < count; i++) {
            switch (pFields[0].fields[i].type) {
                case 'checkbox':
                    localStorage.setItem(pFields[0].fields[i].id, $("#" + pFields[0].fields[i].id).is(":checked"));
                    break;
                case 'cbxarray':
                    var ids = [];

                    $('input[name="' + pFields[0].fields[i].name + '"]:checked').each(function () {
                        ids.push(this.value);
                    });

                    localStorage.setItem(pFields[0].fields[i].name, ids);
                    break;
                case 'radio':
                    localStorage.setItem(pFields[0].fields[i].name, $("input[name='" + pFields[0].fields[i].name + "']:checked").val());
                    break;
                case 'displaybox':
                    localStorage.setItem(pFields[0].fields[i].id, $("#" + pFields[0].fields[i].id).text());
                    break;
                case 'text':
                    localStorage.setItem(pFields[0].fields[i].id, $("#" + pFields[0].fields[i].id).val());
                    break;
                case 'image':

                    break;
                default:
                //need a default behaviour
            }
        }


    }
    catch (error) {
        // alert (error);
        console.log (error);
    }
}

function loadPanelData(panel) {
    try {
            //alert (panel);

        //get a list of fields to load from the localStorage nd set them in the panel
        var pFields = panelManifest.filter(function (entry) { return entry.panel === panel; });
        
        //now want to process each array item in turn
        count = pFields[0].fields.length;

        for (i=0; i < count; i++)
        {
            switch (pFields[0].fields[i].type) {
                case 'checkbox':
                    $("#" + pFields[0].fields[i].id).prop("checked", localStorage.getItem(pFields[0].fields[i].id));
                    break;
                case 'cbxarray':
                    var name = pFields[0].fields[i].name;
                    var ids = localStorage.getItem(name).split(",");
                    
                    var arraycount = ids.length;

                    //get the relevant checkbox array and then check items in the selected array
                    $(':checkbox[name="' +name + '"]').each(function(){
                        //alert (("a:") + ($(this).prop("id")) +""+ ($(this).val()) + "," + ($.inArray($(this).val(), ids)) +"," + ($.inArray($(this).val(), ids) != -1));
                        if ($.inArray($(this).val(), ids) != -1)
                        {
                            document.getElementById ($(this).prop("id")).checked = true;
                        }
                        
                        //$(this).prop("checked", ($.inArray($(this).val(), ids) != -1));
                    });
                    
                    
                    break;
                case 'radio':
                    
                    break;
                case 'displaybox':
                    break;
                case 'text':
                    break;
                case image:
                    break;
                default:
                    //need a default behaviour
            }
        }

    }
    catch (error) {
        //should do something with this
        //alert (error);
        console.log (error);
    }

}

function setupHelp(panel) {
    //see if help exists for the relevant panel - if it does set the panel, if not, hide the help button
    var helpText = helpTexts.filter(function (entry) { return entry.panel === panel; });

    if (helpText.length == 0) {
        //no Help item found - hide the button
        $("#helpIcon").hide();
    }
    else {
        $("#helpTitle").text(helpText[0].title);
        $("#helpContent").html(helpText[0].text);
        $("#helpIcon").show();

    }

}

function showHelp(panel) {
    //Search the helpText JSON for this panel - if it's not found set the panel text to a no help available message 

    //var helpText = helpTexts.filter (function (entry) { return entry.panel === panel;});

    $("#form").fadeOut();
    $("#helpPage").fadeIn();
}

function hideHelp() {
    $("#form").fadeIn();
    $("#helpPage").fadeOut();
}

function toggleEth(source) {
    if ($("#" + source).css("display") == "none") {
        $("#" + source).css("display", "inline");
        $("#icon_" + source).attr("src", "images/collapse16.png");

    }
    else {
        $("#" + source).css("display", "none");
        $("#icon_" + source).attr("src", "images/expand16.png");
    }
}

function toggleScarInjuryDetail(hand, type) {
    if ($("#" + type + hand).is(":checked") || $("#" + type + hand + "Surgical").is(":checked") || $("#" + type + hand + "Accidental").is(":checked")) {
        //at least one of the relevant checkboxes is checked
        $("#" + hand + type + "Detail").fadeIn();
    }
    else {
        //none of the relevant checkboxes is checked
        $("#" + hand + type + "Detail").fadeOut();
    }
}

function submitContribution ()
{
    //TAKE THIS OUT!
    // alert ("doing upload");

    // //initial calls need to be done synchronously
    // $.ajaxSetup({async:false});

    // //call 1: contribution reference - required in all future calls
    // var cRef = getContributionReference();
    // localStorage.setItem ("ContributionReference", cRef);
    
    // //call 2: contribution reference - id is required in all future calls
    // var contID = createContribution (cRef);
    // localStorage.setItem ("ContributionID", contID);

    //call 3: upload consent statements
    var cRef = "DXCFRSH5S"; //temp vars
    var contID = "10056";
    uploadConsent (cRef, contID);

    //call 4:  upload sharing consent statements
    uploadSharingConsent (cRef, contID);

    //TAKE THIS OUT
    alert ("done");


    
}

function getContributionReference ()
{
    //1st service call get the contribution ref
    //step 1: get the contribution reference

    
    var contributionReference;

    try {
        alert ("step1");
        $.get (serverBaseURL + 'ContributionReference',
        {},
        function(data, status){
            alert("Data: " + data + "\nStatus: " + status); 
            //set the contribution reference into localStorage
            contributionReference =  data.ReferenceCode;

        });
    } catch (error) {
        alert ("Get Contribution Reference Error: " + error);
        console.log ("Get Contribution Reference Error: " + error);
    }

    return (contributionReference);
}

function createContribution (RefCode)
{
    var contributionID;

    //Step 2: create a contribution record
    try {
        alert ("step2");
        //var postData = {};
        //postData["ReferenceCode"] = RefCode;

        $.post (serverBaseURL + 'Contribution',
         {'': RefCode},
        function(data, status){
            alert("Data2: " + data + "\nStatus: " + status); 
            //set the contribution reference into localStorage
            contributionID =  data.ID;
        });
    } catch (error) {
        alert ("Create Contribution  Error: " + error);
        console.log ("Create Contribution  Error: " + error);
    }
}

function uploadConsent (RefCode, ContributionID)
{
    var postData = {};
    var consentArray = localStorage.getItem("cbxConsent").split(",");
    var ConsentStatementArray = [];


    //Add fields to the postdata
    postData ["ContributionID"] = ContributionID;
    postData ["ReferenceCode"] = RefCode;
   

    for (i =0; i < consentArray.length; i++)
    {
        ConsentStatementArray.push ({"StatementID" : consentArray[i]});
    }

    postData ["ConsentStatements"] = ConsentStatementArray;

    //now we've built the consent model object, call the service
    try {
        alert ("step2");
        //var postData = {};
        //postData["ReferenceCode"] = RefCode;

        $.post (serverBaseURL + 'Consent',
        postData,
        function(data, status){
            alert("Data2: " + data + "\nStatus: " + status); 
            //set the contribution reference into localStorage
            //contributionID =  data.ID;
        });
    } catch (error) {
        alert ("upload consent  Error: " + error);
        console.log ("upload consent  Error: " + error);
    }

    alert (postData);
}


var helpTexts = [
    {
        "panel": 99,
        "title": "This is the title",
        "text": "This is a sample panel"
    },
    {
        "panel": 5,
        "title": "Gender",
        "text": "<p>We collect gender information to help researchers train AI models to identify if there are physical differences in hand markings between men and women.</p><p>This information is optional.</p>"
    },
    {
        "panel": 8,
        "title": "Ethnic Group",
        "text": "<p>We collect ethnicity information to help researchers train AI models to identify if there are differences in the biometric information that can be obtained from hands of varying skin colour</p><p>Ethnic groupings are based on groupings used in the 2011 British Census.</p><p>This information is optional.</p>"
    }
];

