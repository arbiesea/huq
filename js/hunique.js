

var counter = 1;
var totalSteps = 14;

var leap = 14;

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

    if (leap != null)
    {
        step = leap -1;
    }

    $('#' + String(counter)).hide();
    counter = counter + step;
    $('#' + String(counter)).fadeIn();

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
}

function keypad(key) {
    //controls the keypad for age entry
    if (key >= 0) {
        //entering a number key
        if ($('#txtAge').text() == "age...") {
            //this is first key entry
            $('#txtAge').text(String(key));
        }
        else
        {
            $('#txtAge').text($('#txtAge').text() + String(key));
        }
    }
    else {
        //key is either -1 (back) or -2 (clear)
        if (key == -2){
            clearKeypad()
        }
        else {
            // -1 - backspace
            var textVal = $('#txtAge').text()
            if (textVal.length>1){
                //trim right character
                $('#txtAge').text($('#txtAge').text().slice(0, -1));
            }
            else
            {
                clearKeypad();
            }
        }
    }
}

function clearKeypad()
{
    $('#txtAge').text("age...");
}


function togglePanel(cbxElement, sectionFields)
{
    if (document.getElementById(cbxElement).checked)
    {
        document.getElementById(sectionFields).style.display = 'inline-block';
    }
    else
    {
        document.getElementById(sectionFields).style.display = 'none';
    }
}


function startPhoto (Reference)
{

    //nastyHack - set the photo being taken
    imageCode = Reference;
    
    //photo is being taken - show the viewFinder
    $('#viewFinder').fadeIn();


    // Start the video stream when the window loads
    cameraStart();

}

function endPhoto()
{
    //Photo has been taken, process and close viewFinder
}