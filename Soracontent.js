var resetPond = false; //Reset the pond in order to restore to initial status. (Such as not load position from local storage.)
var saveToRemote = false; //If save position data to database, save to HTML5 local storage is always on.
var loadRemoteSavedData = true; //If load saved data from database instead of loading from HTML5 loacl storage.


/**Soracontent, get data from database or save data to database, convert the format of data. @author conanshang */
var lilyPadsReady = false, flowersReady = false, needInitial = true;  //When these three variables all be true, the pond can be start. (Only using for start pond with database's data.)
var powerX = window.innerWidth; powerY = window.innerHeight;   //Because using relative position, so set the screen size here.
var lilyPadsContent, flowerContent;  //The original Json data got from php post. 1-dimensions.
var lilyPadsJsonArray = new Array();  //lilyPadsJsonArray is used to store the format data of lilyPadsContent. Use for creating the lilypads. 3-dimensions.
var flowersJsonArray = new Array();  //flowersJsonArray is used to store the format data of flowerContent. 2-dimensions.
var saveLilyPadsReady = false, saveFlowersReady = false;  //Seems no use, just skip it.
var savedLilyPadsJsonArray = new Array(); var savedFlowersJsonArray = new Array();  //The arrays converted for saving to databse. 1-dimension.


 function startPond(){
 if(resetPond){
 getRemoteData("Original");
 }
 else if(!resetPond){
 if(loadRemoteSavedData == true){
 try{
 getRemoteData("Saved");
 }
 catch(err){
 alert("No Remote Saved Data");
 console.log(err);
 }
 }
 else if(loadRemoteSavedData == false){
 if((localStorage.flowers != null) && (localStorage.lilyPads != null)){
 //lilyPadsJsonArray = JSON.parse(localStorage.lilyPads);
 //lilyPadsReady = true;
 //flowersJsonArray = JSON.parse(localStorage.flowers);
 //flowersReady = true;

// dataLoaded();
 }
 else{
 getRemoteData("Original");
 }
 }
 }
 }


function getRemoteData(theSource){
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "getData.php",
        data: {action:"getPads", dataSource: theSource},
        success: function(dataBack) {
            lilyPadsContent = dataBack;
            console.log("Load Lilypads Successed");
            //console.log(lilyPadsContent);
            rebuildLilyPadData();
        }
    });

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "getData.php",
        data: {action:"getFlowers", dataSource: theSource},
        success: function(dataBack) {
            flowerContent = dataBack;
            console.log("Load Flowers Successed");
            //console.log(flowerContent);
            rebuildFlowerData();
        }
    });

}

function rebuildLilyPadData(){  //Build the lilyPad's array from 1-dimension to  3-dimensions.  [lilyPad Group][lilyPad Item in the Group][Attributes of lilyPad Item]
    $.each(lilyPadsContent, function(index, element){
        if(lilyPadsJsonArray[element.Group] != undefined){
            lilyPadsJsonArray[element.Group][element.GroupMember] = new Array();
            lilyPadsJsonArray[element.Group][element.GroupMember] = {
                "ID" : element.ID,
                "PosX" : element.PosX * powerX,
                "PosY" : element.PosY * powerY,
                "Radius" : element.Radius,
                "ImageNo" : element.Image,
                "Title" : element.Title,
                "Value" : element.Val,
                "OldValue" : element.OldVal,
                "Rotate" : element.Rotate,
                "Group" : element.Group,
                "GroupMember" : element.GroupMember,
                "jointDistance" : getSavedJoint(element.jointDistance),	  //Add attributes here if adding more areas in the database. This should keep same with the database.
            };
        }
        else if(lilyPadsJsonArray[element.Group] == undefined){
            lilyPadsJsonArray[element.Group] = new Array();
            lilyPadsJsonArray[element.Group][element.GroupMember] = new Array();
            lilyPadsJsonArray[element.Group][element.GroupMember] = {
                "ID" : element.ID,
                "PosX" : element.PosX * powerX,
                "PosY" : element.PosY * powerY,
                "Radius" : element.Radius,
                "ImageNo" : element.Image,
                "Title" : element.Title,
                "Value" : element.Val,
                "OldValue" : element.OldVal,
                "Rotate" : element.Rotate,
                "Group" : element.Group,
                "GroupMember" : element.GroupMember,
                "jointDistance" : getSavedJoint(element.jointDistance),
            };
        }
    });
    //console.log("Pad Array Ready");
    //console.log(lilyPadsJsonArray);
    lilyPadsReady = true;
    dataLoaded();
}

function rebuildFlowerData(){  //Build the flower's array from 1-dimension to  2-dimensions.  [flower Group][Attributes of flower Item]
    $.each(flowerContent, function(index, element){
        if(flowersJsonArray[element.Group] != undefined){
            flowersJsonArray[element.Group] = {
                "ID" : element.ID,
                "PosX" : element.PosX * powerX,
                "PosY" : element.PosY * powerY,
                "Radius" : element.Radius,
                "ImageNo" : element.Image,
                "Rotate" : element.Rotate,
                "Group" : element.Group,
                "expandStatus" : intToBool(element.expandStatus),	//Add attributes here if adding more areas in the database. This should keep same with the database.
            };
        }
        else if(flowersJsonArray[element.Group] == undefined){
            flowersJsonArray[element.Group] = new Array();
            flowersJsonArray[element.Group] = {
                "ID" : element.ID,
                "PosX" : element.PosX * powerX,
                "PosY" : element.PosY * powerY,
                "Radius" : element.Radius,
                "ImageNo" : element.Image,
                "Rotate" : element.Rotate,
                "Group" : element.Group,
                "expandStatus" : intToBool(element.expandStatus),
            };
        }
    });
    //console.log("Flower Array Ready");
    //console.log(flowersJsonArray);
    flowersReady = true;
    dataLoaded();
}


function saveDataToRemote(){
    rebuildLilyPadDataForRemote();
    rebuildFlowerDataForRemote();

    $.ajax({
        type: "POST",
        url: "setData.php",
        async : false,
        data: {
            action:"setPads",
            dataArray: JSON.stringify(savedLilyPadsJsonArray),
        },
        success: function(dataBack) {
            //console.log("Save lilyPads Success");
            //console.log(dataBack);
        }
    });

    $.ajax({
        type: "POST",
        url: "setData.php",
        async : false,
        data: {
            action:"setFlowers",
            dataArray: JSON.stringify(savedFlowersJsonArray),
        },
        success: function(dataBack) {
            //console.log("Save flowers Success");
            //console.log(dataBack);
        }
    });
}

function rebuildLilyPadDataForRemote(){ //Build the lilyPad's array from 3-dimensions to  1-dimensions.
    savedLilyPadsJsonArray = new Array();
    $.each(lilyPadsJsonArray, function(index, element){
        $.each(element, function(index, element){
            var rebuildTuple = {
                "ID" : element.ID,
                "PosX" : element.PosX / powerX,
                "PosY" : element.PosY / powerY,
                "Radius" : element.Radius,
                "Image" : element.ImageNo,
                "Title" : element.Title,
                "Val" : element.Value,
                "Rotate" : element.Rotate,
                "Group" : element.Group,
                "GroupMember" : element.GroupMember,
                "jointDistance" : element.jointDistance,
            }
            savedLilyPadsJsonArray.push(rebuildTuple);
        });
    });
    //console.log(savedLilyPadsJsonArray);
}

function rebuildFlowerDataForRemote(){  //Build the flower's array from 2-dimensions to  1-dimension.
    savedFlowersJsonArray = new Array();
    $.each(flowersJsonArray, function(index, element){
        var rebuildTuple = {
            "ID" : element.ID,
            "PosX" : element.PosX / powerX,
            "PosY" : element.PosY / powerY,
            "Radius" : element.Radius,
            "Image" : element.ImageNo,
            "Rotate" : element.Rotate,
            "Group" : element.Group,
            "expandStatus" : boolToInt(element.expandStatus),	//Becasue MySQL cannot save boolean directly, so using 1 or 0 instead.
        }
        savedFlowersJsonArray.push(rebuildTuple);
    });
    //console.log(savedFlowersJsonArray);
}

function boolToInt(theBool){
    if(theBool == true){
        return 1;
    }
    else if(theBool == false){
        return 0;
    }
}

function intToBool(theInt){
    if(theInt){
        if(theInt == 1){
            return true;
        }
        else if(theInt == 0){
            return false;
        }
    }
    else{
        return false;
    }
}

function getSavedJoint(theJoint){
    if(theJoint){
        return theJoint;
    }
    else{
        return null;
    }
}






























