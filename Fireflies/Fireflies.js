
// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};



function init_FireFlies ()
{
    particleGroup = new THREE.Object3D();
    ParticlesArray = [];
    FireFly_Circle = false;

    Total_FireFlies = 500;
    for( var i = 0; i < Total_FireFlies; i++ )
    {
        var particle = new Particle();
    }
    scene2.add( particleGroup );
}

function Animate_FireFlies ()
{
    for ( var c = 0; c < Total_FireFlies; c ++ )
    {
        var particle = ParticlesArray[c];
        particle.sprite.velocity.add(particle.sprite.acceleration);
        particle.sprite.position.add(particle.sprite.velocity);
        particle.sprite.acceleration.multiplyScalar(0);
        particle.wander();
        particle.illuminate();

        if (FireFly_Circle)
        {
            particle.Circle();
        }
    }
}





function Particle ()
{
    this.BorderX_Min =  -window.innerWidth/2;
    this.BorderX_Max =  window.innerWidth/2;
    this.BorderY_Min =  -window.innerHeight/2;
    this.BorderY_Max =  window.innerHeight/2;
    this.arrived = false;
    this.PathStep = 0;
    this.CircleRadius = Math.random()*140+100;
    this.illum = Math.random();
    this.active = true;
    this.night = true;

    this.canWander = true;
    var LimitX = this.BorderX_Min+Math.random()*(Math.abs(this.BorderX_Min)+this.BorderX_Max);
    var LimitY = this.BorderY_Min+Math.random()*(Math.abs(this.BorderY_Min)+this.BorderY_Max);
    this.target = new THREE.Vector3(LimitX,LimitY,0);
    this.maxspeed = 0.4;
    this.size = Math.random()*0.03;
    this.growth =  Math.random();

    var particleTexture = THREE.ImageUtils.loadTexture( 'textures/particle3.png' );
    var spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, useScreenCoordinates: false, color: 0xffffff } );

    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set( 0.05, 0.05, 0.05 );

    sprite.position.x = this.BorderX_Min+Math.random()*(Math.abs(this.BorderX_Min)+this.BorderX_Max);
    sprite.position.y = this.BorderY_Min+Math.random()*(Math.abs(this.BorderY_Min)+this.BorderY_Max);
    sprite.position.z = 200;
    sprite.velocity = new THREE.Vector3(0,0,0);
    sprite.acceleration = new THREE.Vector3(0,0,0);

    sprite.material.color.setRGB( 1,  1, 1);
    sprite.opacity = 1; // translucent particles
    sprite.material.blending = THREE.AdditiveBlending; // "glowing" particle

    this.sprite = sprite;

    particleGroup.add( sprite );
    ParticlesArray.push(this);

    this.steer = function (target)
    {
        var desired = new THREE.Vector3();
        desired.subVectors(target,this.sprite.position);  // A vector pointing from the location to the target

        if (desired.length() > 0)
        {
            if (desired.length() >= this.maxspeed) // LIMIT TO MAXSPEED
            {
                //console.log('limit');
                desired.normalize(); // UNIT VECTOR
                desired.multiplyScalar(this.maxspeed);
            }
        }
        else
        {
            //console.log('ARRIVED');
            this.arrived = true;
            this.sprite.velocity = new THREE.Vector3(0,0,0);
            return new THREE.Vector3(0,0,0);
        }
        // Steering = Desired minus velocity
        var steer = new THREE.Vector3();
        steer.subVectors(desired,this.sprite.velocity);

        // this.sprite.acceleration.add(steer);
        // this.checkBorder();
        //console.log(this.sprite.position.x);
        return steer;
    }

    this.seek = function (target)
    {
        this.sprite.acceleration.add(this.steer(target));
    }

    this.wander = function ()
    {
        if (this.canWander)
        {
            //console.log(this.canWander);
            if (this.arrived == true)
            {
                //console.log('Arrived');
                this.arrived = false;
                var LimitX = this.BorderX_Min+Math.random()*(Math.abs(this.BorderX_Min)+this.BorderX_Max);
                var LimitY = this.BorderY_Min+Math.random()*(Math.abs(this.BorderY_Min)+this.BorderY_Max);
                this.target = new THREE.Vector3(LimitX,LimitY,0);
                //this.maxspeed  = Math.random()*1.8+0.2;
            }
            this.seek(this.target);
        }
    }

    this.stop = function ()
    {
        this.sprite.velocity = new THREE.Vector3(0,0,0);
        this.sprite.acceleration =  new THREE.Vector3(0,0,0);
    }

    this.Focus = function (BorderX_Min,BorderX_Max,BorderY_Min,BorderY_Max)
    {
        this.maxspeed = 5;
        this.BorderX_Min = BorderX_Min;
        this.BorderX_Max = BorderX_Max;
        this.BorderY_Min = BorderY_Min;
        this.BorderY_Max = BorderY_Max;
    }

    this.checkBorder = function ()
    {
        if ( this.sprite.position.x < this.BorderX_Min ) {
            //console.log('LEFT BORDER');
            return false;
        }
        if ( this.sprite.position.x >  this.BorderX_Max ) {
            //console.log('RIGHT BORDER');
            return false;
        }

        if ( this.sprite.position.y <  this.BorderY_Min ) {
            //console.log('BOTTOM BORDER');
            return false;
        }
        if ( this.sprite.position.y >  this.BorderY_Max ) {
            //console.log('TOP BORDER');
            return false;
        }
        return true;
    }

    this.illuminate = function ()
    {
        if (this.night)
        {
            var time = Date.now();
            this.sprite.material.color.setRGB( 1,  1,this.illum+Math.abs(Math.sin(time*0.0001))*0.5);
            this.sprite.scale.set(Math.sin(time*this.size*0.001)*this.size,Math.sin(time*this.size*0.001)*this.size, 1.0 );
        }
        else
        {
            this.sprite.scale.set(0,0,1);
        }

    }

    this.Circle = function() {

        var Path_CircleX = [];
        var Path_CircleY = [];
        var Steps = 20;
        var centerX = -140;
        var centerY = -320;
        var Radius = this.CircleRadius;
        var Inc  = 360/Steps;

        for (var k =0;k<Steps;k++)
        {
            Path_CircleX.push(centerX-(Math.cos(Math.radians(k*Inc))*Radius));
            Path_CircleY.push(centerY+(Math.sin(Math.radians(k*Inc))*Radius));
        }

        this.maxspeed = 4;
        this.canWander = false;
        this.stop();

        if (this.arrived == true)
        {
            //console.log(this.PathStep);
            this.arrived = false;

            this.target = new THREE.Vector3(Path_CircleX[this.PathStep],Path_CircleY[this.PathStep],0);
            this.PathStep++;

            if (this.PathStep == Path_CircleX.length)
            {
                this.PathStep = 0;
            }
        }
        this.seek(this.target);
    }

    return sprite;
}
