var FishArray = [];
var FishPattern = [];

var ScreenX = window.innerWidth;
var ScreenY = window.innerHeight

function AFish (geometry)
{

    this.mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true,transparent: true, opacity: 0.7 } ) );
    //this.Start = parseInt(Math.random()*4);
    this.Start = 0;
    this.PathX = [];
    this.PathY = [];
    this.PathStat = 0;

    this.PosZ = 40;
    this.Speed = 1;
    this.MoveX = Math.random()*3-1*this.Speed;
    this.MoveY = Math.random()*3-1*this.Speed;;
    this.OldMoveX = 0;
    this.OldMoveY = 0;
    this.DirChange = 0;
    this.AnimDur = parseInt(1500/this.Speed);
    console.log(this.Speed+' '+this.AnimDur);

    switch (this.Start)
    {
        case 0: // LEFT
            this.PosX = -window.innerWidth/2;
            this.PosY = Math.random()* window.innerHeight - window.innerHeight/2;
            break;

        case 1: // BOTTOM
            this.PosX = Math.random()*window.innerWidth - window.innerWidth/2;
            this.PosY = -window.innerHeight/2;
            break;

        case 2: // RIGHT
            this.PosX = window.innerWidth/2+50;
            this.PosY = Math.random()* window.innerHeight- window.innerHeight/2;
            break;

        case 3: // TOP
            this.PosX =  Math.random()*window.innerWidth - window.innerWidth/2;
            this.PosY = window.innerHeight/2+50;
            break;

    }

    this.mesh.scale.set( 60,60,60 );
    this.mesh.position.x = 0;
    this.mesh.position.y = 0;
    this.mesh.position.z = 40;
    this.mesh.rotation.x = 1.4;


    this.DirChange = function ()
    {
        setTimeout(function(){


            });
    }

    this.swim = function ()
    {

        this.mesh.position.x += this.MoveX;
        this.mesh.position.y += this.MoveY;
        //this.mesh.rotation.y  = -this.mesh.position.x/this.mesh.position.y;

        if (this.mesh.position.x < -ScreenX || this.mesh.position.x > ScreenX )
        {
            console.log('SIDE BORDERS');
            this.MoveX *= -1;

        }

        else if (this.mesh.position.y < -ScreenY || this.mesh.position.y > ScreenY )
        {
            console.log('TOP/BOTTOM BORDER');
            this.MoveY *= -1;
        }

        this.OldMoveX = this.MoveX;
        this.OldMoveY = this.MoveY;
    }

    scene.add( this.mesh );
    FishArray.push(this);
}


function CreateFishes()
{
    var loader = new THREE.JSONLoader( true );
    loader.load( "fishes/model2_v7.js", function( geometry ) {
    var Fish = new AFish(geometry);
    //var Fish = new AFish(geometry);



     console.log(FishArray);
    } );



}


var lastKeyframe = 0, currentKeyframe = 0;


function FishAnimation ()
{




   if (FishArray.length > 0)
    {
    for (var x = 0;x<FishArray.length;x++)
    {

        var duration =  FishArray[x].AnimDur;
        var keyframes = 10, interpolation = duration / keyframes;
        FishArray[x].swim();
        var time = Date.now() % duration;

        var keyframe = Math.floor( time / interpolation );

        if ( keyframe != currentKeyframe ) {

            FishArray[x].mesh.morphTargetInfluences[ lastKeyframe ] = 0;
            FishArray[x].mesh.morphTargetInfluences[ currentKeyframe ] = 1;
            FishArray[x].mesh.morphTargetInfluences[ keyframe ] = 0;

            lastKeyframe = currentKeyframe;
            currentKeyframe = keyframe;
        }

        FishArray[x].mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
        FishArray[x].mesh.morphTargetInfluences[ lastKeyframe ] = 1 - FishArray[x].mesh.morphTargetInfluences[ keyframe ];
        //console.log(currentKeyframe);
    }
    }

}

/*


 this.setPattern = function (){

 var fish_text = THREE.ImageUtils.loadTexture( 'pattern1.jpg' );
 fish_text.repeat.set( 0.15, 0.11 );
 fish_text.offset.x = 0.39; // 0.0 - 1.0
 fish_text.offset.y = 0.5;

 return fish_text;
 }
 */

 /*var fish_text = THREE.ImageUtils.loadTexture( 'pattern1.jpg' );
 fish_text.repeat.set( 0.15, 0.11 );
 fish_text.offset.x = 0.39; // 0.0 - 1.0
 fish_text.offset.y = 0.5;

 var loader = new THREE.JSONLoader( true );
 loader.load( "new7.js", function( geometry ) {

 mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true,transparent: true, opacity: 0.7 } ) );
 mesh.scale.set( 60,60,60 );

 mesh.position.y = 0;
 mesh.position.x = 100;
 mesh.position.z = 0;
 mesh.rotation.x = 1.4;

 scene.add( mesh );
 FishArray.push(mesh);

 } );


  var duration =  3000;;
  var keyframes = 10, interpolation = duration / keyframes;

  var time = Date.now() % duration;

  var keyframe = Math.floor( time / interpolation );

  if ( keyframe != currentKeyframe ) {

  mesh.morphTargetInfluences[ lastKeyframe ] = 0;
  mesh.morphTargetInfluences[ currentKeyframe ] = 1;
  mesh.morphTargetInfluences[ keyframe ] = 0;

  lastKeyframe = currentKeyframe;
  currentKeyframe = keyframe;
  }

  mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
  mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];
  //console.log(currentKeyframe);
 */