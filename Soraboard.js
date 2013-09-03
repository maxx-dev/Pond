/** Soraboard, having all the functions for lilyPad layer. @author conanshang */

//Get canvas
var box2dCanvas = document.getElementById("canvas_pad");
var box2dContext = box2dCanvas.getContext("2d");
var canvasPosition = getElementPosition(document.getElementById("canvas_pad"));

ScreenX = window.innerWidth;
ScreenY = window.innerHeight;
box2dCanvas.width = ScreenX;
box2dCanvas.height = ScreenY;

var LayerCanvas = document.getElementById('LayerCanvas');
var LayerCanvasContext = LayerCanvas.getContext('2d');
$('#LayerCanvas').attr('width',window.innerWidth);
$('#LayerCanvas').attr('height',window.innerHeight);


//Get Images
var lilyPadImageArray = new Array();
var flowersImageArray = new Array();

function getAllImages(){

    flower_texture = THREE.ImageUtils.loadTexture( 'textures/flower1.png' );
    flower_texture.offset.x = 0.07;
    flower_texture.offset.y = 0;
    flower_texture.repeat.set( 1.8, 1 );
    flower_material = new THREE.MeshLambertMaterial( { map: flower_texture,transparent:true } );
    flowersImageArray.push(flower_material);

    flower_texture = THREE.ImageUtils.loadTexture( 'textures/flower2.png' );
    flower_texture.offset.x = 0.07;
    flower_texture.offset.y = 0;
    flower_texture.repeat.set( 1.8, 1 );
    flower_material = new THREE.MeshLambertMaterial( { map: flower_texture,transparent:true } );
    flowersImageArray.push(flower_material);

    flower_texture = THREE.ImageUtils.loadTexture( 'textures/flower3.png' );
    flower_texture.offset.x = 0.07;
    flower_texture.offset.y = 0;
    flower_texture.repeat.set( 1.8, 1 );
    flower_material = new THREE.MeshLambertMaterial( { map: flower_texture,transparent:true } );
    flowersImageArray.push(flower_material);

    flower_texture = THREE.ImageUtils.loadTexture( 'textures/flower4.png' );
    flower_texture.offset.x = 0.07;
    flower_texture.offset.y = 0;
    flower_texture.repeat.set( 1.8, 1 );
    flower_material = new THREE.MeshLambertMaterial( { map: flower_texture,transparent:true } );
    flowersImageArray.push(flower_material);


    for (var x = 0;x<24;x++)
    {
        lily_texture = THREE.ImageUtils.loadTexture( 'textures/lily1.png' );
        lily_texture.offset.x = -0.1;
        lily_texture.offset.y = -0.15;
        lily_texture.repeat.set( 1.2, 1.2 );
        //lily_texture.repeat.set( 2.4, 1.2 );
        //lily_material = new THREE.MeshLambertMaterial( { map: lily_texture,color:'0x000000' } );
        lily_material = new THREE.MeshLambertMaterial( { map: lily_texture, transparent:true } );
        lilyPadImageArray.push(lily_material);
    }

    lily_shadow = new THREE.MeshLambertMaterial( {transparent:true, opacity:0 } );

}

//User changeable data.
var initialDistance = 130; var closeDistance = 130; var expandDistance = 200; var maxDistance = 350; var minDistance = 130;

/*** All the code below is write for box2d. */
//Code for Box2D ---> Define names.
var b2Vec2 = Box2D.Common.Math.b2Vec2
 	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
 	,	b2Body = Box2D.Dynamics.b2Body
 	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,	b2World = Box2D.Dynamics.b2World
    ,	b2ContactListener = Box2D.Dynamics.b2ContactListener
    ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,   b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,	b2MassData = Box2D.Collision.Shapes.b2MassData
    ,   b2DistanceJointDef =  Box2D.Dynamics.Joints.b2DistanceJointDef
    ,   b2RevoluteJointDef=Box2D.Dynamics.Joints.b2RevoluteJointDef
    ,   b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ,	b2Fixture = Box2D.Dynamics.b2Fixture
    ,   b2AABB = Box2D.Collision.b2AABB;

//Create the world
var world = new b2World(new b2Vec2(0, 0), true);  //Gravity 
var box2dScale = 30.0;
var collisionListener = new b2ContactListener;
this.world.SetContactListener(collisionListener);

//Define all the varibles in Box2D
var touchX, touchY, touchPVec, isTapped,isDblTapped, tappedBody;
var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, movingBody,RealMouseX,RealMouseY; //For mouse joint.
var reloadDistance, reloadGroup, movingLilyPad, movingFlower; //For distance joint.
var group1 = 0, group2 = 1, group3 = 2, group4 = 3, group5 = 4, group6 = 5; //For lilyPads' groups.
var groupMember1 = 0, groupMember2 = 1, groupMember3 = 2, groupMember4 = 3, groupMember5 = 4, groupMember6 = 5; //For lilyPads' group members.
var expandBody, expandStatus0 = false, expandStatus1 = true, closeOtherGroup, currentGroup;
var lilyPadArray = new Array();
var flowersArray = new Array();
var pondBoundaryArray = new Array();
var distanceJointArray = new Array();


// APPEARANCE
var SHADOW = false;
var NightMode = false;

 
//Help functions.
function calVec2Length(theVec1, theVec2){
	this.vector00 = theVec1.x;
	this.vector01 = theVec1.y;
	this.vector10 = theVec2.x;
	this.vector11 = theVec2.y;
	
	this.length1 = Math.pow(Math.abs(this.vector00 - this.vector10), 2);
	this.length2 = Math.pow(Math.abs(this.vector01 - this.vector11), 2);
	
	return Math.sqrt(this.length1 + this.length2);
}

//Get group number, and group members' number
function getGroupNo(theBody){
	this.number = theBody.GetUserData();
	return this.number;
}

function getGpMemberNo(theBody){
	this.number = theBody.GetFixtureList().GetUserData();
	return this.number;
}

function setGroupNo(theBody, theData){
	theBody.SetUserData(theData);
}

function setGpMemberNo(theBody, theData){
	theBody.GetFixtureList().SetUserData(theData);
}

//Translate pixel world to box2d world.
function pixelToWorld(pPosition){
	this.newPosition = pPosition/box2dScale * 1.0;
	return this.newPosition;
}

function pixelToWorldVec2(pPosition){
	pPosition.x = pixelToWorld(pPosition.x);
	pPosition.y = pixelToWorld(pPosition.y);
	return pPosition;
}

//Translate box2d world to pixel world.
function worldToPixel(pPosition){
	this.newPosition = pPosition * box2dScale * 1.0;
	return this.newPosition;
}

function DBPosXToWebGL (pos)
{
   this.Pos = pos - window.innerWidth/2;
   return this.Pos;
}

function DBPosYToWebGL (pos)
{
    this.Pos = pos - window.innerHeight/2;
    return this.Pos;
}

function worldToPixelVec2(pPosition){
	pPosition.x = worldToPixel(pPosition.x);
	pPosition.y = worldToPixel(pPosition.y);
	return pPosition;
}

//Define lilyPad body.
function lilyPad(PosX,PosY,thePosition, pR, realRadius, iM, title, value ,gP, gPM,sphere,shadow,info){
	this.PosX = PosX;
    this.PosY = PosY;
    this.pLocationWidth = pixelToWorld(thePosition.x);
	this.pLocationHeight = pixelToWorld(thePosition.y);
    this.realRadius = realRadius;
	this.pRadius = pixelToWorld(pR);
	this.imageNumber = iM;
	this.group = gP;
	this.groupMember = gPM;
	this.title = title;
	this.value = value;
    this.sphere = sphere;
    this.shadow = shadow;
    this.info = info;

	this.lilyPadItem = undefined;

	this.definePad();	
	
}

lilyPad.prototype.definePad = function(){
	//Create lily pad.
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.Set(this.pLocationWidth, this.pLocationHeight);
	bodyDef.linearDamping = 25.0; //Liner damping
	bodyDef.angularDamping = 1.0;
	bodyDef.userData = this.group;
	
	var fixDef = new b2FixtureDef;
	fixDef.density = 10.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.1;
	fixDef.userData = this.groupMember;

	
	fixDef.shape = new b2CircleShape;
	fixDef.shape.SetRadius(this.pRadius);
	
	this.lilyPadItem = world.CreateBody(bodyDef);
	this.lilyPadItem.CreateFixture(fixDef);
	this.lilyPadItem.SetMassData(new b2MassData(new b2Vec2(0, 0), 0, 100));
}

//Define flowers body.
/*
function flower(thePosition, pR, iM, gP){
	this.pLocationWidth = pixelToWorld(thePosition.x); 
	this.pLocationHeight = pixelToWorld(thePosition.y);
	this.pRadius = pixelToWorld(pR);
	this.group = gP;
	this.imageNumber = iM;
	this.flowerItem = undefined;

	this.defineFlower();	
	
}*/

function flower(thePosition, pR, iM, gP, theEStatus,sphere){
    this.pLocationWidth = pixelToWorld(thePosition.x);
    this.pLocationHeight = pixelToWorld(thePosition.y);
    this.pRadius = pixelToWorld(pR);
    this.group = gP;
    this.imageNumber = iM;
    this.expandStatus = theEStatus;
    this.flowerItem = undefined;
    this.sphere = sphere;

    this.defineFlower();

}

flower.prototype.defineFlower = function(){
    //Create flower.
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_kinematicBody;
    bodyDef.position.Set(this.pLocationWidth, this.pLocationHeight);
    bodyDef.linearDamping = 5.0; //Liner damping
    bodyDef.angularDamping = 1.0;
    bodyDef.userData = this.group;

    var fixDef = new b2FixtureDef;
    fixDef.density = 10.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.1;
    if(resetPond){
        fixDef.userData = expandStatus0;
    }
    else if(!resetPond){
        if(this.expandStatus != null){
            if(this.expandStatus == true){
                fixDef.userData = expandStatus1;
            }
            else if(this.expandStatus == false){
                fixDef.userData = expandStatus0;
            }
        }
        else{
            fixDef.userData = expandStatus0;
        }
    }

    fixDef.shape = new b2CircleShape;
    fixDef.shape.SetRadius(this.pRadius);

    this.flowerItem = world.CreateBody(bodyDef);
    this.flowerItem.CreateFixture(fixDef);
    this.flowerItem.SetMassData(new b2MassData(new b2Vec2(0, 0), 0, this.flowerItem.GetMass() * 10));

}


//Define boundary body.
function pondBoundary(bLW, bLH, bW, bH){
	this.bLocationWidth = bLW;
	this.bLocationHeight = bLH;
	this.bWidth = bW;
	this.bHeight = bH;
	this.boundaryItem = undefined;
	
	this.defineBoundary();
	
}

pondBoundary.prototype.defineBoundary = function(){
	//Create Boundary.	
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.Set(this.bLocationWidth, this.bLocationHeight);
	
	var fixDef = new b2FixtureDef;
	fixDef.density = 10.0;
	fixDef.friction = 1;
	fixDef.restitution = 0.3;
	
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(this.bWidth, this.bHeight);
	
	this.boundaryItem = world.CreateBody(bodyDef);
	this.boundaryItem.CreateFixture(fixDef);
	
}


//Define distance joint
function lilyPad_Flower_Joint(theLilyPad, theFlower, theLength){
    this.connectionDef = new b2DistanceJointDef();
    this.lilyPadBody = theLilyPad.lilyPadItem;
    this.flowerBody = theFlower.flowerItem;
    this.length = theLength;
    this.connection = undefined;

    this.defineConnection();
}

lilyPad_Flower_Joint.prototype.defineConnection = function(){
    this.connectionDef.Initialize(this.lilyPadBody, this.flowerBody, this.lilyPadBody.GetWorldCenter(), this.flowerBody.GetWorldCenter()); //Must use Initialize() to set.
    if(resetPond){
        this.connectionDef.length = pixelToWorld(initialDistance);
    }
    else if(!resetPond){
        if(this.length){
            this.connectionDef.length = pixelToWorld(this.length);
        }
        else{
            this.connectionDef.length = pixelToWorld(initialDistance);
        }
    }
    this.connectionDef.dampingRatio = 15;
    this.connectionDef.frequencyHz = 5;

    this.connection = world.CreateJoint(this.connectionDef);
}


//Create All the parts.
function createBoundary(){

    var boundaryDisplay = new pondBoundary(pixelToWorld(0), pixelToWorld(0), pixelToWorld(box2dCanvas.width), pixelToWorld(1));
    pondBoundaryArray.push(boundaryDisplay); // TOP

    var boundaryDisplay = new pondBoundary(pixelToWorld(box2dCanvas.width), pixelToWorld(0), pixelToWorld(1), pixelToWorld(box2dCanvas.height));
    pondBoundaryArray.push(boundaryDisplay); // RIGHT

    var boundaryDisplay = new pondBoundary(pixelToWorld(0), pixelToWorld(box2dCanvas.height), pixelToWorld(box2dCanvas.width), pixelToWorld(1));
    pondBoundaryArray.push(boundaryDisplay); // LEFT

    var boundaryDisplay = new pondBoundary(pixelToWorld(0), pixelToWorld(0), pixelToWorld(1), pixelToWorld(box2dCanvas.height));
    pondBoundaryArray.push(boundaryDisplay); // BOTTOM
}



function createLilyPads(){
    var COUNT = 0;
	for(x in lilyPadsJsonArray){
		var groupLilyPadArray = new Array();
		for(y in lilyPadsJsonArray[x]){
			this.PosX = lilyPadsJsonArray[x][y].PosX;
			this.PosY = lilyPadsJsonArray[x][y].PosY;
			this.thePos = new b2Vec2(this.PosX, this.PosY);
			this.theRadius = lilyPadsJsonArray[x][y].Radius -20;
            this.realRadius = lilyPadsJsonArray[x][y].Radius;
			this.ImageNo = lilyPadsJsonArray[x][y].ImageNo;
            this.rotate = Math.random()*360;
            this.title = lilyPadsJsonArray[x][y].Title;
            this.value = parseInt(lilyPadsJsonArray[x][y].Value);
            this.oldValue = parseInt(lilyPadsJsonArray[x][y].OldValue);

            //console.log(this.oldValue);
            //this.oldValue = this.value * (Math.random()+0.5);


            var Health = LilyPadHealth(this.value,this.oldValue);
            this.theRadius = Health.Size -Health.Size*0.2;
            this.realRadius = Health.Size;

            //var sphere = new THREE.Mesh(new THREE.SphereGeometry(this.realRadius,50,200,0,Math.PI*2,0,Math.PI), lilyPadImageArray[COUNT]);
            var sphere = new THREE.Mesh(new THREE.CircleGeometry(this.realRadius, 400, 0, 2*Math.PI),lilyPadImageArray[COUNT]);
            sphere.overdraw = true;
            sphere.position.x = DBPosXToWebGL(this.PosX);
            sphere.position.y = DBPosYToWebGL(this.PosY);
            sphere.position.z = 100;
            sphere.material.color = Health.Color;
            sphere.receiveShadow = false;
            this.sphere = sphere;
            scene2.add(sphere);

            /*var shadow = new THREE.Mesh(new THREE.SphereGeometry(this.realRadius*0.8, 20,20, 0, Math.PI*2, 0, Math.PI),lily_shadow);
            shadow.position.x = DBPosXToWebGL(this.PosX);
            shadow.position.y = DBPosYToWebGL(this.PosY);
            sphere.position.z = -50;
            shadow.castShadow = true;
            shadow.receiveShadow = false;
            this.shadow = shadow;
            scene2.add(shadow);*/

            //console.log(sphere.material.color);

            this.Info = CreateLilyPadInfo(this.title,this.value,this.PosX,this.PosY);

			var lilyPadDisplay = new lilyPad(this.PosX,this.PosY,this.thePos, this.theRadius,this.realRadius ,this.ImageNo,this.title,this.value,x, y,this.sphere,this.shadow,this.Info);

			groupLilyPadArray.push(lilyPadDisplay);
			COUNT++;

		}
		lilyPadArray.push(groupLilyPadArray);

	}

}


function createFlowers(){
	for(x in flowersJsonArray){
		this.PosX = flowersJsonArray[x].PosX;
		this.PosY = flowersJsonArray[x].PosY;
		this.thePos = new b2Vec2(this.PosX, this.PosY);
		this.theRadius = flowersJsonArray[x].Radius;
		this.ImageNo = flowersJsonArray[x].ImageNo;
        this.expandStatus = flowersJsonArray[x].expandStatus;  //This changed


        var sphere = new THREE.Mesh(new THREE.SphereGeometry(80,80, 40), flowersImageArray[x]);
        sphere.overdraw = true;
        sphere.position.x = this.PosX - window.innerWidth/2;
        sphere.position.y = this.PosY - window.innerHeight/2;
        sphere.position.z = 50;
        sphere.castShadow = true;
        sphere.receiveShadow = false;
        this.sphere = sphere;
        scene2.add(sphere);


        var flowerDisplay = new flower(this.thePos, this.theRadius, this.ImageNo, x, this.expandStatus,this.sphere);  //This changed
		flowersArray.push(flowerDisplay);
		//console.log("Create Flowers");
	}
}

function createDistanceJoint(){
    for(x in lilyPadArray){
        var groupConnArray = new Array();
        for(y in lilyPadArray[x]){
            this.jointLength = lilyPadsJsonArray[x][y].jointDistance;  //This changed
            var createAJoint = new lilyPad_Flower_Joint(lilyPadArray[x][y], flowersArray[x], this.jointLength);  //This changed
            groupConnArray.push(createAJoint);
            //console.log("Joint Created");
        }
        distanceJointArray.push(groupConnArray);
    }
}



//Code for Initial Draw.
function initialDraw(){
	//Initial draw function.
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite( box2dContext );
	debugDraw.SetDrawScale(box2dScale);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	
	world.SetDebugDraw(debugDraw);	
}

//Function for draw lilyPads.
function drawLilyPads(){
	for(var x in lilyPadArray){
		for(var y in lilyPadArray[x]){
			imageNo = lilyPadArray[x][y].imageNumber; 
			imageRadius = lilyPadArray[x][y].pRadius;
            realradius = lilyPadArray[x][y].realRadius;
			b = lilyPadArray[x][y].lilyPadItem;
            sphere = lilyPadArray[x][y].sphere;
            shadow = lilyPadArray[x][y].shadow;
            info = lilyPadArray[x][y].info;
			var pos = b.GetPosition();
			this.theFlower = flowersArray[x].flowerItem;
			this.ifExpanded = getGpMemberNo(this.theFlower);
			
			box2dContext.save();
			box2dContext.translate(worldToPixel(pos.x), worldToPixel(pos.y));
			box2dContext.rotate(b.GetAngle());

            var PosX = worldToPixel(pos.x);
            var PosY = worldToPixel(pos.y);
            sphere.position.x = DBPosXToWebGL(PosX);
            sphere.position.y = DBPosYToWebGL(PosY)*-1;
            //shadow.position.x = DBPosXToWebGL(PosX);
            //shadow.position.y = DBPosYToWebGL(PosY)*-1;
            info.position.x =   DBPosXToWebGL(PosX)+120;
            info.position.y =   DBPosYToWebGL(PosY)*-1-60;

			if(this.ifExpanded)
            {
                info.material.visible = true;
			}
            else
            {
                info.material.visible = false;
            }
			
			box2dContext.restore();
		}
	}
}

//Function for draw flowers.
function drawFlowers(){
	for(var x in flowersArray){
		imageNo = flowersArray[x].imageNumber;
		imageRadius = flowersArray[x].pRadius; 
		b = flowersArray[x].flowerItem;
        sphere = flowersArray[x].sphere;
		var pos = b.GetPosition();

		box2dContext.save();
		box2dContext.translate(worldToPixel(pos.x), worldToPixel(pos.y));
		box2dContext.rotate(b.GetAngle());

        var PosX = worldToPixel(pos.x);
        var PosY = worldToPixel(pos.y);
        sphere.position.x = PosX -window.innerWidth/2;
        sphere.position.y = (PosY -window.innerHeight/2)*-1;

        /*var PosX = worldToPixel(pos.x)-80;
        var PosY = worldToPixel(pos.y)-80;
        $('.Flower[data-group="'+x+'"]').css({left:PosX,top:PosY})*/

        if (NightMode)
        {
            MoveNightLight();
        }

		//box2dContext.drawImage(flowersImageArray[x], -worldToPixel(imageRadius), -worldToPixel(imageRadius),180,180);
		box2dContext.restore();
	}
}

function LilyPadHealth (Val,OldVal)
{
    // SIZE INDICATES CHANGE FROM LAST REFRESH
    // APPEARANACE SHOWS IF CHANGE IS POSITIVE OR NEGATIVE
    var intense = 2;

    if (Val == OldVal)
    {
        newRadius = 90
        var color = new THREE.Color( 0x000000 );
        color.setRGB( 1, 1, 1 );
    }

    if (Val > OldVal)
    {
        var saturate = (Val/OldVal)*100*intense;
        var newRadius  = 50 * Val/OldVal;
        if (newRadius > 100)
        {
            newRadius = 90;
            saturate = (Val/OldVal)*100*1.1;
        }

        var color = new THREE.Color( 0x000000 );
        color.setRGB( 0.1, 1, 1 );
    }
    if (Val < OldVal)
    {
        var sepia = (Val/OldVal)*100;
        var newRadius  = 50 * Val/OldVal;
        if (newRadius < 50)
        {
            newRadius = 70;

        }
        if (Val/OldVal < 0.5)
        {
          // sepia = 100;
        }
        var color = new THREE.Color( 0x000000 );
        color.setRGB( 1, 0.5, 0.5 );

    }


    return {Size:newRadius,Color:color};
}




function CreateLilyPadInfo (title,value,PosX,PosY)
{
    this.PosX = DBPosXToWebGL(PosX);
    this.PosY = DBPosYToWebGL(PosY);

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    context.font = "Bold 18px OswaldRegular";
    context.fillStyle = "rgba(255,255,255,1)";
    context.fillText(value, 30, 20);

    context.font = "14px OswaldRegular";
    if (title.length > 18){
        var index = title.indexOf(" ");
        var part1 = title.slice(0, index);
        var part2 = title.slice(index, title.length);

        context.fillText(part1, 0, 40);
        context.fillText(part2, 0, 65);
    }
    else{
        context.fillText(title, 0, 40);
    }

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial( {map: texture, side:THREE.DoubleSide, visible:true } );
    material.transparent = true;

    var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas.width, canvas.height),
        material
    );
    mesh.position.set(this.PosX,this.PosY,120);
    scene2.add( mesh );

    return mesh;
}




//Mouse moving.
function mouseMove(){
	//Make sure the moving item, lilyPads or flowers.

	if(isMouseDown && (!movingLilyPad) && (!movingFlower)) {
		movingBody = getBodyAtMouse();
        //console.log(movingBody)
		//If it's dynamicBody, it's lilyPads.
		if((movingBody != null) && (movingBody.GetType() == b2Body.b2_dynamicBody)){
			movingLilyPad = movingBody;
            //console.log('MOVING LILY');
		}
		//If it's kinematicBody, it's flowers.
		else if((movingBody != null) && (movingBody.GetType() == b2Body.b2_kinematicBody)){
			movingFlower = movingBody;
		}
	}
	//Moving the lilyPads.
	else if((movingLilyPad) && (!movingFlower)){
		if(isMouseDown){
			movingLilyPad.SetPosition(new b2Vec2(mouseX, mouseY));
			setSpecificLimDist(movingLilyPad, (new b2Vec2(mouseX, mouseY))); //If pull back.

            //console.log(lilyPadArray[getGroupNo(movingLilyPad)][getGpMemberNo(movingLilyPad)]);
            //var Lily = lilyPadArray[getGroupNo(movingLilyPad)][getGpMemberNo(movingLilyPad)]

			reloadDistance = true;
			reloadGroup = getGroupNo(movingLilyPad);
		}
		else{
			movingLilyPad = null;
			movingBody = null;
		}
	}
	//Moving the flowers.
	else if((!movingLilyPad) && (movingFlower)){
		if(isMouseDown){
			setDistDamping(getGroupNo(movingFlower), 1); //When moving the flowers, lilyPads will be easier to move.
			movingFlower.SetPosition(new b2Vec2(mouseX, mouseY));
			
			reloadDistance = true;
			reloadGroup = getGroupNo(movingFlower);
		}
		else{
			setDistDamping(getGroupNo(movingFlower), 15);
			movingFlower = null;
			movingBody = null;

		}
	}
}

//Stop Object
function stopBody(){
	if(movingBody){
		movingBody.SetLinearDamping(25.0);	//Hard to move by itself.
	    movingBody.SetLinearVelocity(new b2Vec2(0, 0));
		movingBody.SetAngularVelocity(0);
	    movingBody = undefined;
    }
}

//Set the Distance Joint's distance.
function setDistance(theGroup, newDistance){
	this.group = theGroup;
	this.length = newDistance;
	for(x in distanceJointArray[this.group]){
		distanceJointArray[this.group][x].connection.SetLength(pixelToWorld(this.length));
	}
	reloadGroup = this.group;
}

//Set distance damping.
function setDistDamping(theGroup, dampValue){
	for(x in distanceJointArray[theGroup]){
		distanceJointArray[theGroup][x].connection.SetDampingRatio(dampValue);
	}
}

//Set specific item distance with limitation.
function setSpecificLimDist(theBody, theMouse){
	this.group = getGroupNo(theBody);
	this.gPMember = getGpMemberNo(theBody);

	this.flowerPosition = flowersArray[this.group].flowerItem.GetPosition();
	this.mousePosition = theMouse;
	this.newDist = calVec2Length(this.flowerPosition, this.mousePosition);

	if(this.newDist > pixelToWorld(maxDistance)){
		this.newDist = pixelToWorld(maxDistance);
		//console.log("Large");
	}
	else if(this.newDist < pixelToWorld(minDistance)){
		this.newDist = pixelToWorld(minDistance);
		//console.log("Small");
	}

	distanceJointArray[this.group][this.gPMember].connection.SetLength(this.newDist);
}

//Expand or close lilyPad group when tapped flowers.
function expandGroup(){
	if(isTapped){
		expandBody = getBodyAtTouch();
		if(expandBody){
			if(expandBody.GetType() == b2Body.b2_kinematicBody){

				var group = getGroupNo(expandBody);
				var status = getGpMemberNo(expandBody);
				if(!status){ //If closed, then open.
			 		setDistance(group, expandDistance);
			 		setGpMemberNo(expandBody, expandStatus1);
			 		currentGroup = group;
			 		closeOtherGroup = true;
			 		expandBody.SetAwake(true);
			 		//console.log("Open");
				}
				else if(status){ //If opened, then close.
			 		setDistance(group, closeDistance);
			 		setGpMemberNo(expandBody, expandStatus0);
			 		expandBody.SetAwake(true);
			 		//console.log("Close");					
				}
			}			
		}
		
		isTapped = false;
		expandBody = undefined;
		tappedBody = undefined;
		touchX = undefined;
		touchY = undefined;
	}
}

function closeOtherGp(){
	if(closeOtherGroup){
		for( innerGp = 0; innerGp < flowersArray.length; innerGp++ ){
			if(innerGp != currentGroup){
				var innerBd = flowersArray[innerGp].flowerItem;
				setDistance(innerGp, closeDistance);
				setGpMemberNo(innerBd, expandStatus0);
				innerBd.SetAwake(true);
			}
		}
		closeOtherGroup = false;
		currentGroup = null;
	}
}

//Reload the lilyPads items in order to change the position right after key pressed. Keep this function in loop.
function reloadDistItems(){
	if((reloadDistance == true) && (reloadGroup != null)){
		for(x in lilyPadArray[reloadGroup]){
			lilyPadArray[reloadGroup][x].lilyPadItem.SetAwake(true);
		}
		reloadDistance = false;
		reloadGroup = null;
	}
}

//Get selected Body at touch position.
function getBodyAtMouse() {

	mousePVec = new b2Vec2(mouseX, mouseY);
	var aabb = new b2AABB();

	aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
	aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
	
	// Query the world for overlapping shapes.
	
	selectedBody = null;
	world.QueryAABB(getBodyCB, aabb);
	return selectedBody;
}

function getBodyCB(fixture){
	if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
	   if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
	      selectedBody = fixture.GetBody();
	      return false;
	   }
	}
	return true;
}

function getBodyAtTouch() {
	this.touchPointX = pixelToWorld(touchX);
	this.touchPointY = pixelToWorld(touchY);
	touchPVec = new b2Vec2(this.touchPointX, this.touchPointY);

	var aabb = new b2AABB();
	aabb.lowerBound.Set(this.touchPointX - 0.001, this.touchPointY - 0.001);
	aabb.upperBound.Set(this.touchPointX + 0.001, this.touchPointY + 0.001);
	
	// Query the world for overlapping shapes.
	tappedBody = null;
	world.QueryAABB(getBodyCBT, aabb);
	return tappedBody;
}

function getBodyCBT(fixture){
	if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
	   if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), touchPVec)) {
	      tappedBody = fixture.GetBody();
	      return false;
	   }
	}
	return true;
}

//Handle contact events for Box2D.
collisionListener.BeginContact = function(contact) {
    //console.log(contact.GetFixtureA().GetBody());

}
collisionListener.EndContact = function(contact) {
	
}
collisionListener.PostSolve = function(contact, impulse) {
	impulse = 0;
    
}
collisionListener.PreSolve = function(contact, oldManifold) {

}

//Helpers
function getElementPosition(element) {
	var elem=element, tagname="", x=0, y=0;
	
	while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
	   y += elem.offsetTop;
	   x += elem.offsetLeft;
	   tagname = elem.tagName.toUpperCase();
	
	   if(tagname == "BODY")
	      elem=0;
	
	   if(typeof(elem) == "object") {
	      if(typeof(elem.offsetParent) == "object")
	         elem = elem.offsetParent;
	   }
	}
	
	return {x: x, y: y};
}



/* Ends code block for box2d. */

var LayerActive = false;

function OpenLayer ()
{
    if(isDblTapped){
        expandBody = getBodyAtTouch();
        //console.log(expandBody);
        if(expandBody)
        {
            if(expandBody.GetType() == b2Body.b2_dynamicBody)
            {
                if (!LayerActive)
                {
                    var LilyX = worldToPixel(expandBody.GetPosition().x);
                    var LilyY = worldToPixel(expandBody.GetPosition().y);

                    var lilypad = lilyPadArray[getGroupNo(expandBody)][getGpMemberNo(expandBody)];
                    //console.log(lilypad);

                    DetailLayer(LilyX,LilyY,lilypad.realRadius*1.3);

                    LayerActive = true;
                    isDblTapped = false;
                    touchX = undefined;
                    touchY = undefined;
                    //console.log(LayerActive);
                }
            }
        }
    }
}



function DestroyBoundary ()
{
    for (var x=0;x<pondBoundaryArray.length;x++)
    {
        world.DestroyBody(pondBoundaryArray[x].boundaryItem);
    }
}


function MoveNightLight ()
{
    var TempFlowerPos = [];
    for (var x = 0;x<flowersArray.length;x++)
    {
        var imageRadius = flowersArray[x].pRadius;
        var b = flowersArray[x].flowerItem;
        var x = worldToPixel(b.GetPosition().x);
        var y = worldToPixel(b.GetPosition().y);

        TempFlowerPos.push(x);
        TempFlowerPos.push(y);
    }


    //$('.TimeOfDay').css('background-image','-webkit-radial-gradient('+(worldToPixel(flowersArray[1].flowerItem.GetPosition().x)/ScreenX)*100+'% '+(worldToPixel(flowersArray[1].flowerItem.GetPosition().y)/ScreenY)*100+'%, circle contain, rgba(255, 255, 255, 0.8), transparent 250px)');
    $('.TimeOfDay').css('background-image','-webkit-radial-gradient('+(worldToPixel(flowersArray[0].flowerItem.GetPosition().x)/ScreenX)*100+'% '+(worldToPixel(flowersArray[0].flowerItem.GetPosition().y)/ScreenY)*100+'%, circle contain, rgba(255, 255, 255, 0.8), transparent 350px), -webkit-radial-gradient('+(worldToPixel(flowersArray[1].flowerItem.GetPosition().x)/ScreenX)*100+'% '+(worldToPixel(flowersArray[1].flowerItem.GetPosition().y)/ScreenY)*100+'%, circle contain, rgba(255, 255, 255, 0.8), transparent 350px),   -webkit-radial-gradient('+(worldToPixel(flowersArray[2].flowerItem.GetPosition().x)/ScreenX)*100+'% '+(worldToPixel(flowersArray[2].flowerItem.GetPosition().y)/ScreenY)*100+'%, circle contain, rgba(255, 255, 255, 0.8), transparent 350px),   -webkit-radial-gradient('+(worldToPixel(flowersArray[3].flowerItem.GetPosition().x)/ScreenX)*100+'% '+(worldToPixel(flowersArray[3].flowerItem.GetPosition().y)/ScreenY)*100+'%, circle contain, rgba(255, 255, 255, 0.8), transparent 350px)');

}

var Search = false;
var SearchResults = 0;

Event.add(document, 'keyup', function(e,self)
{
    //console.log(e);

    if (e.keyCode == 13)  // ENTER
    {
        LayerCanvasContext.clearRect(0, 0, LayerCanvas.width, LayerCanvas.height);
        SearchResults = 6;
        Search = true;
        //$('#SearchInput').show();
    }

    if (e.keyCode == 78) // N
    {
        NightMode = true;
        $('.TimeOfDay').animate({opacity: 0.8},4000);
        $('.Lily').find('.Text').css('text-shadow', '0 0 40px #f5f5f5;');
       //$('.TimeOfDay').css({backgroundImage: "-webkit-radial-gradient(50% 50%, circle contain, rgba(255, 255, 255, 0.5), #000000 43%"});
    }


    if (e.keyCode == 83)  // S
    {
        var d = new Date();
        var Time = d.getHours()*60+d.getMinutes();
        console.log(Time);
        var Time = 770;
        ShadowOffsetX = Time*(1/48)-15;
        console.log(ShadowOffsetX);

    }

    if (e.keyCode == 70)  // S
    {

        if (!FireFly_Circle)
        {
            FireFly_Circle = true;
        }
        else
        {
            FireFly_Circle = false;
        }

    }




});




Event.add(document, 'click', function(e,self)
{
    isTapped = true;

    tapWater(e);
    ScareFishes(e);

});


// EXCEPTION TO GET DOUBLE TAP
// EVENT.JS DBL EVENTS ARE TRIGGERED ON SINGLE TAPS ON SURFACE
document.addEventListener("dblclick", DoubleClick, false);
function DoubleClick(e){

    console.log("DOUBLE");
    //tapWater(e);
    isDblTapped = true; // FOR DETAIL LAYER
    handleTouchPosition(e);
}

Event.add(document, 'mousedown', function(e,self)
{
    isMouseDown = true;
    mouseDown = !0;
});

Event.add(document, 'mousemove', function(e,self)
{


    if (isMouseDown)
    {
        //waveWater(e);
    }
});

Event.add(document, 'drag', function(e,self)
{
    //console.log('DRAG')
    handleMouseMove(e);
    waveWater(e);
},
{
        maxFingers: 1
});
// DRAGEND AND MOUSEUP
Event.add(document, 'mouseup', function(e,self)
{
    stopBody();
    isMouseDown = false;
    mouseDown = !1;
    mouseX = undefined;
    mouseY = undefined;
    WaterComposer.heightMapMaterial.uniforms.mouseActive.value = 0;
});


Event.add(window, "gesture", function(event, self) {

    console.log(self);
    StartSearch(event,self);
},

    {
        minFingers: 4
});

Event.add(window, "swipe", function(event, self) {

        if (self.fingers == 2 && Search == true)
        {
         NewSearch();
        }
});



function handleMouseMove(e) {

    mouseX = pixelToWorld(e.pageX - canvasPosition.x);
    mouseY = pixelToWorld(e.pageY - canvasPosition.y);

    RealMouseX = e.pageX;
    RealMouseY = e.pageY;

    if (e.touches) // IF TOUCH
    {
        mouseX = pixelToWorld(e.touches[0].pageX - canvasPosition.x);
        mouseY = pixelToWorld(e.touches[0].pageY - canvasPosition.y);

        RealMouseX = e.touches[0].pageX;
        RealMouseY = e.touches[0].pageY;
    }
};

function handleTouchPosition(e){
    touchX = e.pageX - canvasPosition.x;
    touchY = e.pageY - canvasPosition.y;
}

/*** PLAY WITH WATER*/

function waveWater(e){

    if (e.touches)
    {
        this.mouseCliX = e.touches[0].pageX - canvasPosition.x;
        this.mouseCliY = e.touches[0].pageY - canvasPosition.y;
    }
    else
    {
        this.mouseCliX = e.pageX - canvasPosition.x;
        this.mouseCliY = e.pageY - canvasPosition.y;
    }

    WaterComposer.heightMapMaterial.uniforms.mousePoint.value.set(this.mouseCliX / window.innerWidth, this.mouseCliY / window.innerHeight);
    if (1 > Math.abs(WaterComposer.heightMapMaterial.uniforms.mousePoint.value.x) && 1 > Math.abs(WaterComposer.heightMapMaterial.uniforms.mousePoint.value.y)) WaterComposer.heightMapMaterial.uniforms.mouseActive.value = mouseDown ? 2 : 0
}

function tapWater(e){

    if (e.touches)
    {
	this.mouseCliX = e.touches[0].pageX - canvasPosition.x;
	this.mouseCliY = e.touches[0].pageY - canvasPosition.y;
    }
    else
    {
        this.mouseCliX = e.pageX - canvasPosition.x;
        this.mouseCliY = e.pageY - canvasPosition.y;
    }

    //console.log(this.mouseCliX+' '+this.mouseCliY)



	WaterComposer.heightMapMaterial.uniforms.mousePoint.value.set(this.mouseCliX / window.innerWidth, this.mouseCliY / window.innerHeight);
	WaterComposer.heightMapMaterial.uniforms.mouseActive.value = 2;

    console.log(WaterComposer.heightMapMaterial.uniforms.mousePoint.value);
}


/* Ends code block for starting water pond. */



function ScareFishes (e) {

    var pro = Processing.getInstanceById('FishCanvas');
    pro.mousePressed(e.pageX, e.pageY);
}

var SearchRes_ID = 0;
function FishArrived (arrivedBoid)
{
    //console.log('ARRIVED');
    //console.log(arrivedBoid.location.x);

    var SearchRes = '<h2>HANA</h2>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam';
    SearchRes_ID++;
    CreateSearchResLayers(arrivedBoid.location.x,arrivedBoid.location.y,SearchRes,SearchRes_ID);
}


function closeLayer(){

    $('#LayerCanvas').hide();
    $('#DetailLayer').hide();

    $('.SearchResult').hide();
    LayerCanvasContext.clearRect(0, 0, LayerCanvas.width, LayerCanvas.height);
    LayerActive = false;
}


$('#LayerCanvas').find('.Hide').click(function(){

    closeLayer();
})

$('#LayerCanvas').click(function(){

    closeLayer();
})


function DetailLayer(LilyX,LilyY,HoleRadius) {

    var LayerRadius = 550;
    var Side;

    $('#LayerCanvas').show();


    if (touchX < window.innerWidth/2 && touchY < window.innerHeight/2) // LEFT-TOP QUARTER
    {
        console.log('LEFT-TOP QUARTER');
         var LayerX = LilyX+LayerRadius-HoleRadius*1.5;
         var LayerY = LilyY+100;
        $('#DetailLayer').css({left:LilyX+LayerRadius*0.8, top:LilyY-LayerRadius*0.65});

        Side = 'LeftTop';
    }
    else if (touchX > window.innerWidth/2 && touchY < window.innerHeight/2) // RIGHT-TOP QUARTER
    {
        console.log('RIGHT-TOP QUARTER');
        var LayerX = LilyX-LayerRadius+HoleRadius*1.5;
        var LayerY = LilyY+100;
        $('#DetailLayer').css({left:LilyX-LayerRadius*0.8, top:LilyY-LayerRadius*0.65});
        Side = 'RightTop';
    }
    else if (touchX < window.innerWidth/2 && touchY > window.innerHeight/2) // LEFT-BOTTOM QUARTER
    {
        console.log('LEFT-BOTTOM QUARTER');
        var LayerX = LilyX+LayerRadius-HoleRadius*1.5;
        var LayerY = LilyY-100;
        $('#DetailLayer').css({left:LilyX+LayerRadius*0.8, top:LilyY-LayerRadius*1.3});
        Side = 'LeftBottom';
    }
    else if (touchX > window.innerWidth/2 && touchY > window.innerHeight/2) // RIGHT-BOTTOM QUARTER
    {
        console.log('RIGHT-BOTTOM QUARTER');
        var LayerX = LilyX-LayerRadius+HoleRadius*1.5;
        var LayerY = LilyY-100;
        $('#DetailLayer').css({left:LilyX-LayerRadius*0.8, top:LilyY-LayerRadius*1.3});
        Side = 'RightBottom';
    }

    // LAYER ANIMATION INTERVAL
    var x = 0;
    var time = setInterval(function(){

        LayerCanvasContext.clearRect(0, 0, LayerCanvas.width, LayerCanvas.height);
        LayerCanvasContext.beginPath();
        LayerCanvasContext.fillStyle = "rgba(9, 137, 4,"+x/50+")";


        if (Side == 'LeftTop')
        {
            LayerCanvasContext.arc((LilyX-HoleRadius)+LayerRadius/20*x,LilyY+Math.abs(LilyY-LayerY)/20*x,LayerRadius/20*x, 0, 2 * Math.PI, false);
        }
        else if (Side == 'RightTop')
        {
            LayerCanvasContext.arc((LilyX+HoleRadius)-LayerRadius/20*x,LilyY+Math.abs(LilyY-LayerY)/20*x,LayerRadius/20*x, 0, 2 * Math.PI, false);
        }
        else if (Side == 'LeftBottom')
        {
            LayerCanvasContext.arc((LilyX-HoleRadius)+LayerRadius/20*x,LilyY-Math.abs(LilyY-LayerY)/20*x,LayerRadius/20*x, 0, 2 * Math.PI, false);

        }
        else if (Side == 'RightBottom')
        {
            LayerCanvasContext.arc((LilyX+HoleRadius)-LayerRadius/20*x,LilyY-Math.abs(LilyY-LayerY)/20*x,LayerRadius/20*x, 0, 2 * Math.PI, false);

        }
        LayerCanvasContext.fill();
        LayerCanvasContext.closePath();
        x++;

        if (x >= 20)
        {
            clearInterval(time);
            LayerCanvasContext.clearRect(0, 0, LayerCanvas.width, LayerCanvas.height);
            $('#DetailLayer').fadeIn(400);

            // SMALL CIRCLE
            LayerCanvasContext.beginPath()
            LayerCanvasContext.fillStyle = "#000000";
            LayerCanvasContext.arc(LilyX,LilyY,HoleRadius, 0, Math.PI*2,true);
            LayerCanvasContext.fill();
            LayerCanvasContext.closePath()

            LayerCanvasContext.clearRect(0, 0, LayerCanvas.width, LayerCanvas.height);

            // BIG CIRCLE
            LayerCanvasContext.fillStyle = "rgba(9, 137, 4,0.4)";
            LayerCanvasContext.arc(LayerX, LayerY, LayerRadius, 0, 2 * Math.PI, false);
            LayerCanvasContext.fill();


            // FRAME
            LayerCanvasContext.beginPath()
            LayerCanvasContext.lineWidth = '6';
            LayerCanvasContext.strokeStyle = "rgba(255, 146, 28, 1.0)";
            LayerCanvasContext.arc(LilyX,LilyY,HoleRadius-10, 0, Math.PI*2,true);
            LayerCanvasContext.stroke();
            LayerCanvasContext.closePath();
        }
    },30);



}


function CreateSearchResLayers (Sx,Sy,SearchRes,SearchRes_ID)
{
    var SearchResDis = $('<div onclick="DisplaySearchResLayers(this)" data-id="'+SearchRes_ID+'" data-Sx="'+Sx+'" data-Sy="'+Sy+'" data-SearchRes="'+SearchRes+'" class="SearchResult_Displayer"></div>').appendTo('body');
    $(SearchResDis).css({left:Sx-40,top:Sy-40});
}

function DisplaySearchResLayers (el)
{

    LayerCanvasContext.clearRect(0, 0, LayerCanvas.width, LayerCanvas.height);
    $('#LayerCanvas').show();
    $('.SearchResult').hide();
    var ID = $(el).attr('data-id')
    $('.SearchResult[data-id="'+ID+'"]').show();
    var Sx = parseFloat($(el).attr('data-Sx'));
    var Sy = parseFloat($(el).attr('data-Sy'));
    var SearchRes = $(el).attr('data-SearchRes');



    if (Sx < window.innerWidth/2)
    {
        LayerCanvasContext.strokeStyle = "rgba(171, 95, 31, 0.6)";
        LayerCanvasContext.fillStyle = "rgba(171, 95, 31, 0.6)";
        LayerCanvasContext.lineWidth = '3';
        LayerCanvasContext.beginPath();
        LayerCanvasContext.arc(Sx, Sy, 9, 0, 2 * Math.PI, false);
        LayerCanvasContext.fill();
        LayerCanvasContext.closePath();
        LayerCanvasContext.beginPath();
        LayerCanvasContext.arc(Sx, Sy, 12, 0, 2 * Math.PI, false);
        LayerCanvasContext.stroke();
        LayerCanvasContext.closePath();
        LayerCanvasContext.beginPath();
        LayerCanvasContext.moveTo(Sx, Sy);
        LayerCanvasContext.lineTo(Sx-50, Sy-100);
        LayerCanvasContext.lineTo(Sx-150, Sy-100);
        LayerCanvasContext.stroke();
        LayerCanvasContext.closePath();

        var SearchEl = $('<div data-id="'+ID+'" class="SearchResult"><div>'+SearchRes+'</div></div>').appendTo('body');
        $(SearchEl).css({left:Sx-500,top:Sy-210});
    }
    else
    {

        LayerCanvasContext.strokeStyle = "rgba(171, 95, 31, 0.6)";
        LayerCanvasContext.fillStyle = "rgba(171, 95, 31, 0.6)";
        LayerCanvasContext.lineWidth = '3';
        LayerCanvasContext.beginPath();
        LayerCanvasContext.arc(Sx, Sy, 9, 0, 2 * Math.PI, false);
        LayerCanvasContext.fill();
        LayerCanvasContext.closePath();
        LayerCanvasContext.beginPath();
        LayerCanvasContext.arc(Sx, Sy, 12, 0, 2 * Math.PI, false);
        LayerCanvasContext.stroke();
        LayerCanvasContext.closePath();
        LayerCanvasContext.beginPath();
        LayerCanvasContext.moveTo(Sx, Sy);
        LayerCanvasContext.lineTo(Sx+50, Sy-100);
        LayerCanvasContext.lineTo(Sx+150, Sy-100);
        LayerCanvasContext.stroke();
        LayerCanvasContext.closePath();

        var SearchEl = $('<div data-id="'+ID+'" class="SearchResult"><div>'+SearchRes+'</div></div>').appendTo('body');
        $(SearchEl).css({left:Sx+150,top:Sy-210});
    }
}

var status = 'active';
var InitialPos = true;
function StartSearch (event,self)
{


    var Sensitivity = window.innerWidth*0.2;

    DestroyBoundary();

    // GET ALL FLOWERS AND LILYS
    var bodylist = world.GetBodyList();
    var z = 0;
    var FlowerArray  = [];
    var LilyArray  = []
    while (bodylist != null)
    {
        //console.log(z)
        //console.log(x);
        if (z < 4)
        {
            FlowerArray.push(bodylist);
        }
        if (z >= 4 && z < 28)
        {
            LilyArray.push(bodylist);

        }
        bodylist.GetNext();
        bodylist =  bodylist.GetNext();
        z++;
    }

    //console.log(FlowerArray);

    // SAVE ACTIVE POSITIONS ON START
    if (self.state == 'start' && status == 'active' && InitialPos)
    {
        console.log('START');
        FlowerArray_ActivePos = [];
        LilyArray_ActivePos = [];

        for (var k = 0;k<FlowerArray.length;k++)
        {
            FlowerArray_ActivePos.push(FlowerArray[k].GetPosition().x);
        }

        for (var k = 0;k<LilyArray.length;k++)
        {
            LilyArray_ActivePos.push(LilyArray[k].GetPosition().x);
        }

        InitialPos = false;
    }

    // SAVE INACTIVE POSITIONS ON START
    if ( self.state == 'start' && status == 'inactive')
    {
        console.log('START');
        FlowerArray_InactivePos = [];
        LilyArray_InactivePos = [];

        for (var k = 0;k<FlowerArray.length;k++)
        {
            FlowerArray_InactivePos.push(FlowerArray[k].GetPosition().x);
        }

        for (var k = 0;k<LilyArray.length;k++)
        {
            LilyArray_InactivePos.push(LilyArray[k].GetPosition().x);
        }
    }

       // var MaxTouch = Math.max(self.touches[0].x,self.touches[1].x);
       // var MinTouch = Math.min(self.touches[0].x,self.touches[1].x);

        var MaxTouch = Math.max(self.touches[0].x,self.touches[1].x,self.touches[2].x,self.touches[3].x);
        var MinTouch = Math.min(self.touches[0].x,self.touches[1].x,self.touches[2].x,self.touches[3].x);

    // MOVING THE FLOWERS
    if (self.fingers == 4 && self.state != 'end')
    {
        for (var k =0;k<FlowerArray.length;k++)
        {
            if (worldToPixel(FlowerArray[k].GetPosition().x) < window.innerWidth/2)
            {
                var Move_Small = pixelToWorld(MinTouch-350);
                FlowerArray[k].SetPosition(new b2Vec2(Move_Small, FlowerArray[k].GetPosition().y));
            }
            else
            {
                var Move_Big = pixelToWorld(MaxTouch+350);
                FlowerArray[k].SetPosition(new b2Vec2(Move_Big, FlowerArray[k].GetPosition().y));
            }
        }

        /* for (var k =0;k<(All.length);k++)
         {
         if (worldToPixel(All[k].GetPosition().x) < window.innerWidth/2)
         {
         var Move_Small = pixelToWorld(MinTouch-350);
         All[k].SetPosition(new b2Vec2(Move_Small, All[k].GetPosition().y));
         }
         else
         {
         var Move_Big = pixelToWorld(MaxTouch+350);
         All[k].SetPosition(new b2Vec2(Move_Big, All[k].GetPosition().y));
         }
         }*/
    }

    //console.log(MaxTouch);
    //console.log(MinTouch);

    // CHECK IF GESTURE "SLIDE OUT" WAS PERFOMED TO AT LEAST 70%
    if (self.state == 'end' && status == 'active')
    {
        if( MaxTouch > window.innerWidth- Sensitivity || MinTouch < Sensitivity )
        {
            console.log('SLIDE OUT SUCCESS');


            setTimeout(function(){

            for (var k =0;k<FlowerArray.length;k++)
            {
                if (worldToPixel(FlowerArray[k].GetPosition().x) < window.innerWidth/2)
                {
                    FlowerArray[k].SetPosition(new b2Vec2(-20, FlowerArray[k].GetPosition().y));
                }
                else
                {
                    FlowerArray[k].SetPosition(new b2Vec2(100, FlowerArray[k].GetPosition().y));
                }
            }

            },300)
            status = 'inactive';
            $('#SearchInput').fadeIn();
            $('#SearchInput').find('input').focus();

        }
        else
        {
            // SEND BACK TO ORIGIN POS
            console.log(' SLIDE OUT FAILED');
            $('#SearchInput').fadeOut();
            //$('#Layer').fadeOut();

            for (var k = 0;k<FlowerArray.length;k++)
            {
                FlowerArray[k].SetPosition(new b2Vec2(FlowerArray_ActivePos[k],FlowerArray[k].GetPosition().y));
            }

            for (var k = 0;k<LilyArray.length;k++)
            {
                LilyArray[k].SetPosition(new b2Vec2(LilyArray_ActivePos[k],LilyArray[k].GetPosition().y));
            }
        }
    }

    // CHECK IF GESTURE "SLIDE IN" WAS PERFOMED TO AT LEAST 70%
    else if(self.state == 'end' && status == 'inactive')
    {
        if( MaxTouch < window.innerWidth/2+Sensitivity || MinTouch > window.innerWidth/2-Sensitivity )
        {
            console.log('SLIDE IN SUCESS');

            for (var k = 0;k<FlowerArray.length;k++)
            {
                FlowerArray[k].SetPosition(new b2Vec2(FlowerArray_ActivePos[k],FlowerArray[k].GetPosition().y));
            }

            for (var k = 0;k<LilyArray.length;k++)
            {
                LilyArray[k].SetPosition(new b2Vec2(LilyArray_ActivePos[k],LilyArray[k].GetPosition().y));
            }
            status = 'active';
            $('#SearchInput').fadeOut();
            CloseSearch();
            createBoundary();
        }
        else  // SEND BACK TO ORIGIN POS
        {
            console.log(' SLIDE IN FAILED');

            for (var k = 0;k<FlowerArray.length;k++)
            {
                FlowerArray[k].SetPosition(new b2Vec2(FlowerArray_InactivePos[k],FlowerArray[k].GetPosition().y));
            }

            for (var k = 0;k<LilyArray.length;k++)
             {
             LilyArray[k].SetPosition(new b2Vec2(LilyArray_InactivePos[k],LilyArray[k].GetPosition().y));
             }
        }
    }

    $('#DetailLayer').hide(); // TO AVOID ACCIDENTLE DETAIL LAYER POPUP
}


function NewSearch()
{
    console.log('SWIPE');
    Search = false;
    var pro = Processing.getInstanceById('FishCanvas');
    pro.SwimToRelease();
    $('#LayerCanvas').hide();
    $('.SearchResult').remove();
    $('.SearchResult_Displayer').remove();
    $('#SearchInput').find('input').val('');
    $('#SearchInput').find('input').focus();
}

function CloseSearch()
{
    Search = false;
    var pro = Processing.getInstanceById('FishCanvas');
    pro.SwimToRelease();
    $('#LayerCanvas').hide();
    $('.SearchResult').remove();
    $('.SearchResult_Displayer').remove();
    $('#SearchInput').find('input').val('');
    $('#SearchInput').hide();
}




function decorations(){
    rain =0;
    caustics = 0;
    WaterComposer.heightMapMaterial.uniforms.strength.value = 0.2;
}


var fishes = [];
function init_Fish ()
{
    var light = new THREE.DirectionalLight( 0xefefff, 2 );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );



    var loader = new THREE.JSONLoader( true );
    loader.load( "libraries/fish5.js", function( geometry ) {

        var texture = THREE.ImageUtils.loadTexture( 'textures/scales.jpg' );
        texture.repeat.set(0.5,0.5);
        fish = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true, map:texture, opacity:0.9 } ) );
        fish.scale.set( 60,60,60 );

        fish.position.y = 0;
        fish.position.x = -60;
        fish.position.z = -5;
        fish.rotation.x = 1.2;
        scene.add( fish );

        fishes.push(fish);


        var texture = THREE.ImageUtils.loadTexture( 'textures/fish.jpg' );
        texture.repeat.set(0.6,0.6);
        fish = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true, map:texture, opacity:0.9 } ) );
        fish.scale.set( 60,60,60 );

        fish.position.y = 160;
        fish.position.x = -60;
        fish.position.z = -5;
        fish.rotation.x = 1.2;
        scene.add( fish );

        fishes.push(fish);

    } );


}

speed = 1;
var duration = 5000/speed;
var keyframes = 40, interpolation = duration / keyframes;
var lastKeyframe = 40, currentKeyframe = 10;


var duration2 = 5000/speed;
var keyframes2 = 40, interpolation2 = duration2 / keyframes2;
var lastKeyframe2 = 40, currentKeyframe2 = 10;

function animate_Fish ()
{


        if ( fishes[0] ) {
        var time = Date.now() % duration;
          fishes[0].position.x -= speed;
        // fishes[0].rotation.y = Math.sin(time*0.0008)*0.2;
        var keyframe = Math.floor( time / interpolation );

        if ( keyframe != currentKeyframe ) {

            fishes[0].morphTargetInfluences[ lastKeyframe ] = 0;
            fishes[0].morphTargetInfluences[ currentKeyframe ] = 1;
            fishes[0].morphTargetInfluences[ keyframe ] = 0;

            lastKeyframe = currentKeyframe;
            currentKeyframe = keyframe;

            // console.log( fishes[0].morphTargetInfluences );

        }
        fishes[0].morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
        fishes[0].morphTargetInfluences[ lastKeyframe ] = 1 - fishes[0].morphTargetInfluences[ keyframe ];
        //console.log(currentKeyframe);

        }

            if ( fishes[1] ) {
                var time = Date.now() % duration2;
                fishes[1].position.x -= speed;
                // fishes[1].rotation.y = Math.sin(time*0.0008)*0.2;
                var keyframe = Math.floor( time / interpolation2 );

                if ( keyframe != currentKeyframe2 ) {

                    fishes[1].morphTargetInfluences[ lastKeyframe2 ] = 0;
                    fishes[1].morphTargetInfluences[ currentKeyframe2 ] = 1;
                    fishes[1].morphTargetInfluences[ keyframe ] = 0;

                    lastKeyframe2 = currentKeyframe2;
                    currentKeyframe2 = keyframe;

                    // console.log( fishes[1].morphTargetInfluences );

                }
                fishes[1].morphTargetInfluences[ keyframe ] = ( time % interpolation2 ) / interpolation2;
                fishes[1].morphTargetInfluences[ lastKeyframe2 ] = 1 - fishes[1].morphTargetInfluences[ keyframe ];
                //console.log(currentKeyframe);
           }


}

function  init_TopScene()
{
    clock = new THREE.Clock();

    scene2 = new THREE.Scene;

    camera2 = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -1E4, 1E4);
    scene2.add(camera2);
    renderer2 = new THREE.WebGLRenderer({});
    renderer2.shadowMapEnabled = true;
    renderer2.shadowMapSoft = true;
    renderer2.setClearColor(0);
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.width = window.innerWidth;
    renderer2.domElement.height =window.innerHeight;
    renderer2.autoClear = !1;
    container2 = document.createElement( 'div' );
    container2.id = "WebGL_TOP";
    document.body.appendChild( container2 );
    container2.appendChild(renderer2.domElement);

    // GROUND
    ground = new THREE.Mesh(
    new THREE.PlaneGeometry( 10000, 10000 ),
    new THREE.MeshLambertMaterial( { color: 0x000000, transparent:true, opacity:0 } ) );
    ground.position.z = 0;
    ground.castShadow = false;
    ground.receiveShadow = false;
    scene2.add(ground);

    // SHADOW RECEIVER
    shadow_rec = new THREE.Mesh(
    new THREE.PlaneGeometry( 10000, 10000 ),
    new THREE.MeshLambertMaterial( { color: 0xffffff, transparent:true, opacity:0.05 } ) );
    shadow_rec.position.z = 0;
    shadow_rec.castShadow = false;
    shadow_rec.receiveShadow = true;
    scene2.add(shadow_rec);

    light = new THREE.DirectionalLight(0xffffff,0.9);
    light.position.set(0,0, 400);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    //light.shadowCameraVisible = true;
    light.shadowDarkness = 0.8;
    scene2.add( light );

    light2 = new THREE.DirectionalLight(0xffffff,0.4);
    light2.position.set(0,0, 400);
    light2.target.position.set(0, 0, 0);
    light2.castShadow = true;
    //light2.shadowCameraVisible = true;
    scene2.add( light2 );


    var sp = new THREE.SphereGeometry( 50, 30, 15 );
    var spm = new THREE.Mesh( sp, new THREE.MeshLambertMaterial({color:0xff0000}) );
    spm.position.set(0, 0, 0);
    //scene2.add( spm );

    //var light = new THREE.PointLight( 0xffffff, 10, 1010 );
    //light.position.set( 0, 20, 150 );
    //scene2.add( light );
}

// 1s = 6
var DayLength = 86400/6;
function render_TopScene() {

    var d = new Date();

    var date = (d.getHours()*60*60 + d.getMinutes()*60 +d.getSeconds()+1000*60*60)/-86400;
    var time = (d.getHours()*60*60 + d.getMinutes()*60)-43200;
    console.log(time);
    time = ((time/86400) *(2*Math.PI));

    //console.log(date);

    light.position.x = Math.sin(time) * 500.0;
    light.position.z = Math.cos(time) * 500.0;
    ground.material.opacity = Math.abs(Math.sin(time*0.5))*0.6;
    Active_FireFlies = parseInt(Math.abs(Math.sin(time*0.5) * Total_FireFlies));

    console.log(Active_FireFlies);

    if (time <= -0.5*Math.PI || time >= 0.5*Math.PI)
    {
    for (var x =0;x<Active_FireFlies;x++)
    {
        ParticlesArray[x].night = true;
    }

    for (var x=Active_FireFlies;x<Total_FireFlies;x++)
    {
        ParticlesArray[x].night = false;
    }
    }
    else
    {
        for (var x=0;x<Total_FireFlies;x++)
        {
            ParticlesArray[x].night = false;
        }
    }


    // DEMO
    /*light.position.x = Math.sin(clock.getElapsedTime()*0.1) * 500.0;
    light.position.z = Math.cos(clock.getElapsedTime()*0.1) * 500.0;
    ground.material.opacity = Math.abs(Math.sin(clock.getElapsedTime()*0.05))*0.6;
    Active_FireFlies = parseInt(Math.abs(Math.sin(clock.getElapsedTime()*0.05)) * Total_FireFlies);

    //console.log(Active_FireFlies);

    for (var x =0;x<Active_FireFlies;x++)
    {
        ParticlesArray[x].night = true;
    }

    for (var x=Active_FireFlies;x<Total_FireFlies;x++)
    {
        ParticlesArray[x].night = false;
    }*/

    renderer2.render(scene2, camera2);
}

/*******************************************  INITIATION  ***************************************************/


//When all the data all processed,
function dataLoaded(){
    if(lilyPadsReady && flowersReady && needInitial){
        startBox2D();
        needInitial = false;
    }
}

//Code for Initial Pond and create lilyPad.
function startBox2D(){
    init();	//Initial the water.

    decorations(); //If add rain.

    getAllImages();
    createBoundary();

    init_TopScene();
    init_FireFlies();
    //init_Fish();
    createLilyPads();
    createFlowers();

    createDistanceJoint();

    initialDraw();
    animate();

    console.log("Initial Finished");
    console.log(quad);
}


//RequestAnimationFrame for browsers.
if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
                window.setTimeout( callback, 1000 / 60 );
            };
    } )();
}

function animate() {
    requestAnimationFrame(animate);
    render(); //Render the water.
    render_TopScene();
    renderPond(); //Render the box2d canvas with lilyPads.
}


//Render Pond.
function renderPond(){
    reloadDistItems();
    mouseMove();
    OpenLayer();
    expandGroup();
    closeOtherGp();

    world.Step(1 / 60, 10, 10);
    box2dContext.clearRect(0, 0, box2dCanvas.width, box2dCanvas.height); //Every time needs clear the canvas.


    drawLilyPads();
    drawFlowers();
    Animate_FireFlies();
    //animate_Fish ();

    world.ClearForces();


    //quad.material.visible = false;



}


window.onload = function(){
    startPond();
}

window.onunload = function(){
  if (status == 'active') //CHECK IF NO SEARCH IS IN PROGRESS
  {
      saveAllItemsPosition();
  }
}


//Save the current location to HTML5 local storage.
function saveAllItemsPosition(){
    localStorage.flowers = null;
    localStorage.lilyPads = null;

    for(b = world.GetBodyList(); b != null; b = b.GetNext()){
        this.bodyType = b.GetType();

        if(this.bodyType == b2Body.b2_kinematicBody){
            flowersJsonArray[getGroupNo(b)].PosX = worldToPixel(b.GetPosition().x);
            flowersJsonArray[getGroupNo(b)].PosY = worldToPixel(b.GetPosition().y);

            flowersJsonArray[getGroupNo(b)].expandStatus = getGpMemberNo(b);
        }
        else if(this.bodyType == b2Body.b2_dynamicBody){
            lilyPadsJsonArray[getGroupNo(b)][getGpMemberNo(b)].PosX = worldToPixel(b.GetPosition().x);
            lilyPadsJsonArray[getGroupNo(b)][getGpMemberNo(b)].PosY = worldToPixel(b.GetPosition().y);

            lilyPadsJsonArray[getGroupNo(b)][getGpMemberNo(b)].jointDistance = worldToPixel(distanceJointArray[getGroupNo(b)][getGpMemberNo(b)].connection.GetLength());
        }
    }

    localStorage.lilyPads = JSON.stringify(lilyPadsJsonArray);
    localStorage.flowers = JSON.stringify(flowersJsonArray);

    if(saveToRemote == true){
        saveDataToRemote();
    }
}

















































