THREE.HeightMapShader = {
    uniforms:{
        tData:{
            type:"t",
            value:0,
            texture:null
        },
        mousePoint:{
            type:"v2",
            value:new THREE.Vector2(-1, -1)
        },
        mouseActive:{
            type:"i",
            value:0
        },
        texelSize:{
            type:"v2",
            value:new THREE.Vector2(0, 0)
        },
        radius:{
            type:"f", value:0.01
        },
        strength:{
            type:"f",
            value:0.1
        }
    },
    vertexShader:"varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x, 1. - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader:"const float v=3.14159;uniform sampler2D tData;uniform vec2 texelSize,mousePoint;uniform int mouseActive;uniform float radius,strength;varying vec2 vUv;void main(){vec4 t=texture2D(tData,vUv);if(mouseActive>=1){float m=max(0.,1.-length(mousePoint-vUv)/radius);m=.5-cos(m*v)*.5;t.r-=m*strength;}vec2 m=vec2(texelSize.r,0.),r=vec2(0.,texelSize.g);float f=(texture2D(tData,vUv-m).r+texture2D(tData,vUv-r).r+texture2D(tData,vUv+m).r+texture2D(tData,vUv+r).r)*.25;t.g+=(f-t.r)*2.;t.g*=.995;t.r+=t.g;t.r*=.995;gl_FragColor=vec4(t.r,t.g,t.b,1.);}"
};

THREE.NormalMapShader = {
    uniforms:{
        tData:{
            type:"t",
            value:0,
            texture:null
        },
        texelSize:{
            type:"v2",
            value:new THREE.Vector2(0, 0)
        }
    },
    vertexShader:"varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x,  1. - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader:"uniform sampler2D tData;uniform float deltaNormal;uniform vec2 texelSize;varying vec2 vUv;void main(){vec3 t=vec3(2.,max(texture2D(tData,vUv+vec2(texelSize.r,0.)).r,texture2D(tData,vUv+vec2(texelSize.r,0.)).b)-max(texture2D(tData,vUv-vec2(texelSize.r,0.)).r,texture2D(tData,vUv-vec2(texelSize.r,0.)).b),0.),v=vec3(0.,max(texture2D(tData,vUv+vec2(0.,texelSize.g)).r,texture2D(tData,vUv+vec2(0.,texelSize.g)).b)-max(texture2D(tData,vUv-vec2(0.,texelSize.g)).r,texture2D(tData,vUv-vec2(0.,texelSize.g)).b),2.),r=cross(t,v);gl_FragColor=vec4(r,1.);}"
};

THREE.Pass2Shader = {
    uniforms:{
        tDataSampler:{
            type:"t",
            value:0,
            texture:null
        },
        texelSize:{
            type:"v2",
            value:new THREE.Vector2(0, 0)
        },
        divCaustic:{
            type:"f", value:3550
        }
    },
    vertexShader:"varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x,  1. - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader:"uniform sampler2D tDataSampler;uniform float divCaustic;uniform vec2 texelSize;varying vec2 vUv;void main(){float v=0.;v+=mod(texture2D(tDataSampler,vUv+vec2(0.,-3.*texelSize.g)).r,1000.)/255.;v+=mod(texture2D(tDataSampler,vUv+vec2(0.,-2.*texelSize.g)).g,1000.)/255.;v+=mod(texture2D(tDataSampler,vUv+vec2(0.,-1.*texelSize.g)).b,1000.)/255.;v+=floor(texture2D(tDataSampler,vUv).r/1e+06)/255.;v+=floor(texture2D(tDataSampler,vUv+vec2(0.,texelSize.g)).r/1000.)/255.;v+=floor(texture2D(tDataSampler,vUv+vec2(0.,2.*texelSize.g)).g/1000.)/255.;v+=floor(texture2D(tDataSampler,vUv+vec2(0.,3.*texelSize.g)).b/1000.)/255.;v/=divCaustic;gl_FragColor=vec4(v,v,v,1.);}"
};

THREE.Pass1Shader = {
    uniforms:{
        tData:{
            type:"t",
            value:0,
            texture:null
        },
        tNormalMap:{
            type:"t",
            value:1,
            texture:null
        },
        texelSize:{
            type:"v2",
            value:new THREE.Vector2(0, 0)
        },
        P_G:{
            type:"v2",
            value:new THREE.Vector2(0.5, 0.5)
        }
    },
    vertexShader:"varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x, 1. - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader:"#define N 7\n#define N_HALF 3\nvec2 getIntersection(sampler2D normalMap,sampler2D heightMap,vec2 uvCoord,vec2 texelSize){vec3 normal=texture2D(normalMap,uvCoord).rgb;float P_Y=texture2D(heightMap,uvCoord).r,k=P_Y*normal.g*64.;return vec2(normal.r*k*texelSize.r,normal.b*k*texelSize.g);}uniform sampler2D tData,tNormalMap;uniform vec2 texelSize,P_G;varying vec2 vUv;void main(){vec2 P_C=vUv,P_G=vec2(.5,.5);float intensity[N];for(int ii=0;ii<N;ii++)intensity[ii]=0.;float P_Gy[N];for(int iii=-N_HALF;iii<=N_HALF;iii++)P_Gy[iii+N_HALF]=P_G.g+float(iii)*texelSize.g;for(int i=0;i<N;i++){vec2 pN=P_C+float(i-N_HALF)*texelSize,intersection=getIntersection(tNormalMap,tData,pN,texelSize);float ax=max(0.,1.-abs(P_G.r-intersection.r));for(int j=0;j<N;j++){float ay=max(0.,1.-abs(P_Gy[j]-intersection.g));intensity[j]+=ax*ay;}}float rChannel=floor(intensity[3]*255.)*1e+06+floor(intensity[4]*255.)*1000.+floor(intensity[0]*255.),gChannel=floor(intensity[5]*255.)*1000.+floor(min(intensity[1],3.9)*255.),bChannel=floor(intensity[6]*255.)*1000.+floor(min(intensity[2],3.9)*255.);gl_FragColor=vec4(rChannel,gChannel,bChannel,1.);}"
};

THREE.FresnelShader = {
    uniforms:{
        tData:{
            type:"t",
            value:0,
            texture:null
        },
        tGround:{
            type:"t",
            value:3,
            texture:null
        },
        tSky:{
            type:"t",
            value:4,
            texture:null
        },
        tCaustic:{
            type:"t",
            value:2,
            texture:null
        },
        tNormalMap:{
            type:"t",
            value:1,
            texture:null
        },
        uGroundRepeat:{
            type:"v2",
            value:new THREE.Vector2(1, 1)
        },
        texelSize:{
            type:"v2",
            value:new THREE.Vector2(1, 1)
        },
        lightDir:{
            type:"v3",
            value:new THREE.Vector3(0, 1, 1)
        },
        heightMapFactor:{
            type:"v3",
            value:new THREE.Vector3(256, 32, 256)
        },
        viewPosition:{
            type:"v3",
            value:new THREE.Vector3(0, 256, 0)
        },
        caustics:{
            type:"i",
            value:1
        },
        dirLight:{
            type:"i",
            value:1
        }
    },
    vertexShader:"varying vec2 vUv;\nvarying mat4 mvm;\nvoid main() {\nvUv = vec2( uv.x,  uv.y );\nmvm = modelViewMatrix;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader:"uniform float causticRatio;uniform vec2 uGroundRepeat;uniform vec3 viewPosition,heightMapFactor,lightDir;uniform sampler2D tData,tNormalMap,tGround,tSky,tCaustic;uniform int caustics,dirLight;uniform vec2 texelSize;varying vec2 vUv;varying mat4 mvm;void main(){vec3 v=vec3(vUv.r*heightMapFactor.r,texture2D(tData,vUv).r*heightMapFactor.g,vUv.g*heightMapFactor.b),t=vec3(vUv.r*256.-128.,texture2D(tData,vUv).r*heightMapFactor.g,vUv.g*256.-128.),r=-normalize(texture2D(tNormalMap,vUv).rgb),b=v-vec3(heightMapFactor.r/2.,256.,heightMapFactor.b/2.),n=t-vec3(0.,300.,0.),h=reflect(-normalize(b),r),u;u=refract(normalize(b),r,1.);vec3 m=refract(normalize(n),r,1.);vec4 a=texture2D(tSky,vec2(h.r,h.b)),g=texture2D(tGround,vec2(u.r,u.b)/u.g*uGroundRepeat+.5);if(caustics==1)g*=pow(max(texture2D(tCaustic,vec2(m.r,m.b)+.5).r,.35)+.5,4.);g.a=1.;gl_FragColor=mix(g,a,.2);if(dirLight==1){float d=pow(max(dot(r,normalize(lightDir))+.2,1.),8.);vec3 c=vec3(d,d,d);gl_FragColor.rgb*=c;}}"
};

THREE.WaterComposer = function (a) {
    this.renderer = a;
    this.renderTargetNearestFloatParams = {
        minFilter:THREE.NearestFilter,
        magFilter:THREE.NearestFilter,
        wrapS:THREE.RenderTargetWrapping,
        wrapT:THREE.RenderTargetWrapping,
        format:THREE.RGBFormat,
        stencilBuffer:!1,
        depthBuffer:!1,
        type:THREE.FloatType
    };
    this.renderTargetLinearParams = {
        minFilter:THREE.LinearFilter,
        magFilter:THREE.LinearFilter,
        wrapS:THREE.RenderTargetWrapping,
        wrapT:THREE.RenderTargetWrapping,
        format:THREE.RGBFormat,
        stencilBuffer:!1,
        depthBuffer:!1
    };

    this.renderTargetLinearFloatParams = {
        minFilter:THREE.LinearFilter,
        magFilter:THREE.LinearFilter,
        wrapS:THREE.RenderTargetWrapping,
        wrapT:THREE.RenderTargetWrapping,
        format:THREE.RGBFormat,
        stencilBuffer:!1,
        depthBuffer:!1,
        type:THREE.FloatType
    };

    if (!a.context.getExtension("OES_texture_float")) {
        throw document.getElementById("error").style.display = "block", document.getElementById("error").innerHTML = "Requires OES_texture_float extension<br/>", "Requires OES_texture_float extension";
    }
    if (!a.context.getParameter(a.context.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) {
        document.getElementById("error").style.display = "block", document.getElementById("error").innerHTML += "Your graphic card doesn't support vertex shader textures.";
    }

    this.initShader()
};

THREE.WaterComposer.prototype = {

    render:function () {
        this.renderPassHeightMap();
        this.renderPassHeightMap();
        this.renderPassNormalMap();
        caustics && (this.renderPass1(), this.renderPass2())
    },


    swapHeightMapBuffers:function () {
        var a = this.renderTargetHeightMap;
        this.renderTargetHeightMap = this.renderTargetHeightMap2;
        this.renderTargetHeightMap2 = a
    },


    renderPassHeightMap:function () {
        this.heightMapMaterial.uniforms.tData.value = this.renderTargetHeightMap;
        THREE.WaterComposer.quad.material = this.heightMapMaterial;
        this.renderer.render(THREE.WaterComposer.scene,
            THREE.WaterComposer.camera, this.renderTargetHeightMap2, !1);
        this.swapHeightMapBuffers();
        if (1 <= this.heightMapMaterial.uniforms.mouseActive.value)this.heightMapMaterial.uniforms.mouseActive.value = 0
    },

    renderPassNormalMap:function () {
        THREE.WaterComposer.quad.material = this.normalMapMaterial;
        this.renderer.render(THREE.WaterComposer.scene, THREE.WaterComposer.camera, this.renderTargetNormalMap, !1)
    },

    renderPass1:function () {
        THREE.WaterComposer.quad.material = this.material1;
        this.renderer.render(THREE.WaterComposer.scene,
            THREE.WaterComposer.camera, this.renderTargetPass1, !1)
    },


    renderPass2:function () {
        THREE.WaterComposer.quad.material = this.material2;
        this.renderer.render(THREE.WaterComposer.scene, THREE.WaterComposer.camera, this.renderTargetPass2, !1)
    },


    initRenderTargets:function (a, b) {
        this.renderTargetPass1 = new THREE.WebGLRenderTarget(a, b, this.renderTargetNearestFloatParams);
        this.renderTargetHeightMap = new THREE.WebGLRenderTarget(a, b, this.renderTargetLinearFloatParams);
        this.renderTargetHeightMap2 = this.renderTargetHeightMap.clone();
        this.renderTargetNormalMap = this.renderTargetHeightMap.clone();
        this.renderTargetPass2 = this.renderTargetHeightMap.clone();
        this.fresnelMaterial.uniforms.tData.value= this.renderTargetHeightMap;
        this.fresnelMaterial.uniforms.tNormalMap.value= this.renderTargetNormalMap;
        this.fresnelMaterial.uniforms.tCaustic.value= this.renderTargetPass2;
        this.material2.uniforms.tDataSampler.value= this.renderTargetPass1;
        this.material1.uniforms.tData.value= this.renderTargetHeightMap;
        this.material1.uniforms.tNormalMap.value=
            this.renderTargetNormalMap;
        this.normalMapMaterial.uniforms.tData.value= this.renderTargetHeightMap;
        this.heightMapMaterial.uniforms.tData.value= this.renderTargetHeightMap
    },


    initShader:function () {
        var a = THREE.HeightMapShader;
        var b = THREE.UniformsUtils.clone(a.uniforms);
        this.heightMapMaterial = new THREE.ShaderMaterial({
            uniforms:b,
            vertexShader:a.vertexShader,
            fragmentShader:a.fragmentShader
        });

        a = THREE.NormalMapShader;
        b = THREE.UniformsUtils.clone(a.uniforms);
        this.normalMapMaterial = new THREE.ShaderMaterial({
            uniforms:b,
            vertexShader:a.vertexShader,
            fragmentShader:a.fragmentShader
        });

        a = THREE.Pass1Shader;
        b = THREE.UniformsUtils.clone(a.uniforms);
        this.material1 = new THREE.ShaderMaterial({
            uniforms:b,
            vertexShader:a.vertexShader,
            fragmentShader:a.fragmentShader
        });

        a = THREE.Pass2Shader;
        b = THREE.UniformsUtils.clone(a.uniforms);
        this.material2 = new THREE.ShaderMaterial({
            uniforms:b,
            vertexShader:a.vertexShader,
            fragmentShader:a.fragmentShader
        });

        THREE.WaterComposer.quad.material = this.material1;

        a = THREE.FresnelShader;
        b = THREE.UniformsUtils.clone(a.uniforms);
        b.tGround.value= THREE.ImageUtils.loadTexture("textures/background.jpg");
        b.tGround.value.wrapS = THREE.RepeatWrapping;
        b.tGround.value.wrapT = THREE.RepeatWrapping;
        b.tSky.value= THREE.ImageUtils.loadTexture("textures/sky.jpg");
        b.tSky.value.wrapS = THREE.RepeatWrapping;
        b.tSky.value.wrapT = THREE.RepeatWrapping;
        this.fresnelMaterial = new THREE.ShaderMaterial({
            uniforms:b,
            vertexShader:a.vertexShader,
            fragmentShader:a.fragmentShader
        });
    }
};


THREE.WaterComposer.resolution = 256;
THREE.WaterComposer.geometry = new THREE.PlaneGeometry(1, 1);
THREE.WaterComposer.quad = new THREE.Mesh(THREE.WaterComposer.geometry, null);
THREE.WaterComposer.scene = new THREE.Scene();
THREE.WaterComposer.scene.add(THREE.WaterComposer.quad);

THREE.WaterComposer.camera = new THREE.OrthographicCamera(
    THREE.WaterComposer.resolution / -2,
    THREE.WaterComposer.resolution / 2,
    THREE.WaterComposer.resolution / 2,
    THREE.WaterComposer.resolution / -2,
    -1E4,
    1E4);
THREE.WaterComposer.scene.add(THREE.WaterComposer.camera);

var camera, scene, renderer;
var charCloud, WaterComposer;
var time, oldTime, delta, stats, quad, computeQuadWidth, computeQuadHeight;
var mouseDown = !1, rain = !0, caustics = !0;


var WaterUI = function () {
    this.RippleStrength = 0.12;
    this.Rain = this.DirectionnalLight = this.Caustics = !0
};

function init() {
    new THREE.PlaneGeometry(1, 1);
    quad = new THREE.Mesh(THREE.WaterComposer.geometry, null);
    quad.scale.set(window.innerWidth, window.innerHeight, 1);
    scene = new THREE.Scene;
    scene.add(quad);
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -1E4, 1E4);
    scene.add(camera);
    renderer = new THREE.WebGLRenderer({});
    renderer.setClearColor(0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.width = window.innerWidth;
    renderer.domElement.height =
        window.innerHeight;
    renderer.autoClear = !1;
    stats = new window.Stats;
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = "0px";
    document.body.appendChild(stats.domElement);
    container = document.createElement( 'div' );
    container.id = "WebGL";
    document.body.appendChild( container );
    container.appendChild(renderer.domElement);
    WaterComposer = new THREE.WaterComposer(renderer);
    quad.material = WaterComposer.fresnelMaterial;
    window.onresize = resize;





    window.onload = function () {

        var a = new WaterUI,
            b = new window.dat.gui;

      /*  b.add(a, "RippleStrength", 0.05, 0.5).onChange(function (a) {
            WaterComposer.heightMapMaterial.uniforms.strength.value =
                a
        });
        b.add(a, "Caustics").onChange(function (a) {
            caustics = a;
            WaterComposer.fresnelMaterial.uniforms.caustics.value = a
        });
        b.add(a, "DirectionnalLight").onChange(function (a) {
           // WaterComposer.fresnelMaterial.uniforms.dirLight.value = a
        });
        b.add(a, "Rain").onChange(function (a) {
            rain = a
        });*/
       /* renderer.domElement.onmouseout = function () {
            mouseDown = !1;
            WaterComposer.heightMapMaterial.uniforms.mouseActive.value = 0
        };
        renderer.domElement.onmousedown = function () {
            mouseDown = !0
        };
        renderer.domElement.onmouseup = function () {
            mouseDown = !1;
            WaterComposer.heightMapMaterial.uniforms.mouseActive.value =
                0
        };
        renderer.domElement.onclick = function () {
            WaterComposer.heightMapMaterial.uniforms.mouseActive.value = 2
        };
        renderer.domElement.onmousemove = function (a) {
            WaterComposer.heightMapMaterial.uniforms.mousePoint.value.set(a.offsetX / window.innerWidth, a.offsetY / window.innerHeight);
            if (1 > Math.abs(WaterComposer.heightMapMaterial.uniforms.mousePoint.value.x) && 1 > Math.abs(WaterComposer.heightMapMaterial.uniforms.mousePoint.value.y))WaterComposer.heightMapMaterial.uniforms.mouseActive.value = mouseDown ? 2 : 1
        }*/
    };
    resize()
}


function resize() {
    quad.scale.set(window.innerWidth, window.innerHeight, 1);
    renderer.domElement.width = window.innerWidth;
    renderer.domElement.height = window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.left = -window.innerWidth / 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = -window.innerHeight / 2;
    camera.updateProjectionMatrix();
    window.innerWidth > window.innerHeight ? (computeQuadHeight = 256, computeQuadWidth = parseInt(256 * (window.innerWidth / window.innerHeight))) :
        (computeQuadWidth = 256, computeQuadHeight = parseInt(256 * (window.innerHeight / window.innerWidth)));
    WaterComposer.heightMapMaterial.uniforms.texelSize.value.set(1 / computeQuadWidth, 1 / computeQuadHeight);
    WaterComposer.normalMapMaterial.uniforms.texelSize.value.set(1 / computeQuadWidth, 1 / computeQuadHeight);
    WaterComposer.fresnelMaterial.uniforms.texelSize.value.set(1 / computeQuadWidth, 1 / computeQuadHeight);
    WaterComposer.material1.uniforms.texelSize.value.set(1 / computeQuadWidth, 1 / computeQuadHeight);
    WaterComposer.material2.uniforms.texelSize.value.set(1 /
        computeQuadWidth, 1 / computeQuadHeight);
    WaterComposer.fresnelMaterial.uniforms.heightMapFactor.value.x = computeQuadWidth;
    WaterComposer.fresnelMaterial.uniforms.heightMapFactor.value.z = computeQuadHeight;
    window.innerHeight > window.innerWidth ? WaterComposer.fresnelMaterial.uniforms.uGroundRepeat.value.set(window.innerWidth / 2048, window.innerWidth / (4096 / 3)) : WaterComposer.fresnelMaterial.uniforms.uGroundRepeat.value.set(window.innerHeight / 2048, window.innerHeight / (4096 / 3));
    THREE.WaterComposer.quad.scale.set(computeQuadWidth,
        computeQuadHeight, 1);
    THREE.WaterComposer.camera.left = -computeQuadWidth / 2;
    THREE.WaterComposer.camera.right = computeQuadWidth / 2;
    THREE.WaterComposer.camera.top = computeQuadHeight / 2;
    THREE.WaterComposer.camera.bottom = -computeQuadHeight / 2;
    THREE.WaterComposer.camera.updateProjectionMatrix();
    WaterComposer.initRenderTargets(computeQuadWidth, computeQuadHeight)
}


function render() {
    oldTime || (oldTime = (new Date).getTime());
    time = (new Date).getTime();
    delta = 0.1 * (time - oldTime);
    oldTime = time;

    var a = WaterComposer.heightMapMaterial.uniforms.strength.value;

    if (rain && 0 == time % 2) {
        WaterComposer.heightMapMaterial.uniforms.strength.value = 0.05;
        WaterComposer.heightMapMaterial.uniforms.mousePoint.value.set(Math.random(), Math.random());
        WaterComposer.heightMapMaterial.uniforms.mouseActive.value = 1;
    }

    WaterComposer.render(delta);
    WaterComposer.heightMapMaterial.uniforms.strength.value = a;
    WaterComposer.fresnelMaterial.uniforms.dirLight.value = 0;
    renderer.render(scene, camera);
}