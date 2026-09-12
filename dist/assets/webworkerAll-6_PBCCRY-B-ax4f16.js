import{D as b,r as B,K as w,L as A,n as M,A as T,W as v,z as P,m as U,h as z,V as E,d as D,e as V,O as L,x as W,f as Y,_ as R}from"./index-Sjo91Lps.js";const y=new P;function G(g,e){e.clear();const t=e.matrix;for(let r=0;r<g.length;r++){const i=g[r];if(i.globalDisplayStatus<7)continue;const s=i.renderGroup??i.parentRenderGroup;s!=null&&s.isCachedAsTexture?e.matrix=y.copyFrom(s.textureOffsetInverseTransform).append(i.worldTransform):s!=null&&s._parentCacheAsTextureRenderGroup?e.matrix=y.copyFrom(s._parentCacheAsTextureRenderGroup.inverseWorldTransform).append(i.groupTransform):e.matrix=i.worldTransform,e.addBounds(i.bounds)}return e.matrix=t,e}function S(g){return typeof g.getCanvasFilterString=="function"}class q{constructor(){this.skip=!1,this.useClip=!1,this.filters=null,this.container=null,this.bounds=new R,this.cssFilterString=""}}class I{constructor(e){this._filterStack=[],this._filterStackIndex=0,this._savedStates=[],this._alphaMultiplier=1,this._warnedFilterTypes=new Set,this.renderer=e}push(e){const t=this._pushFilterFrame(),r=e.filterEffect.filters;if(t.skip=!1,t.useClip=!1,t.filters=r,t.container=e.container,t.cssFilterString="",r.every(o=>!o.enabled)){t.skip=!0;return}const i=[],s=1;for(const o of r){if(!o.enabled)continue;if(!S(o)){this._warnUnsupportedFilter(o);continue}const u=o.getCanvasFilterString();if(u===null){this._warnUnsupportedFilter(o);continue}u&&i.push(u)}if(i.length===0&&s===1){t.skip=!0;return}t.cssFilterString=i.join(" "),this._calculateFilterArea(e,t.bounds),t.useClip=!!e.filterEffect.filterArea;const n=this.renderer.canvasContext.activeContext,a=n.filter||"none";if(this._savedStates.push({filter:a,alphaMultiplier:this._alphaMultiplier}),t.useClip&&Number.isFinite(t.bounds.width)&&Number.isFinite(t.bounds.height)&&t.bounds.width>0&&t.bounds.height>0){const o=this.renderer.canvasContext.activeResolution||1;n.save(),n.setTransform(1,0,0,1,0,0),n.beginPath(),n.rect(t.bounds.x*o,t.bounds.y*o,t.bounds.width*o,t.bounds.height*o),n.clip()}else t.useClip=!1;t.cssFilterString&&(n.filter=a!=="none"?`${a} ${t.cssFilterString}`:t.cssFilterString)}pop(){const e=this._popFilterFrame();if(e.skip)return;const t=this._savedStates.pop();if(!t)return;const r=this.renderer.canvasContext.activeContext;e.useClip?r.restore():r.filter=t.filter,this._alphaMultiplier=t.alphaMultiplier}generateFilteredTexture({texture:e,filters:t}){if(!(t!=null&&t.length)||t.every(d=>!d.enabled))return e;const r=[],i=1;for(const d of t){if(!d.enabled)continue;if(!S(d)){this._warnUnsupportedFilter(d);continue}const F=d.getCanvasFilterString();if(F===null){this._warnUnsupportedFilter(d);continue}F&&r.push(F)}if(r.length===0&&i===1)return e;const s=E.getCanvasSource(e);if(!s)return e;const n=e.frame,a=e.source._resolution??e.source.resolution??1,o=n.width,u=n.height,c=D.getOptimalCanvasAndContext(o,u,a),{canvas:f,context:l}=c;l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,f.width,f.height),r.length&&(l.filter=r.join(" "));const p=n.x*a,h=n.y*a,x=o*a,_=u*a;return l.drawImage(s,p,h,x,_,0,0,x,_),l.filter="none",l.globalAlpha=1,V(f,o,u,a)}_calculateFilterArea(e,t){if(e.renderables?G(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const r=e.container.renderGroup||e.container.parentRenderGroup,i=r==null?void 0:r.cacheToLocalTransform;i&&t.applyMatrix(i)}}_warnUnsupportedFilter(e){var t;const r=((t=e==null?void 0:e.constructor)==null?void 0:t.name)||"Filter";this._warnedFilterTypes.has(r)||(this._warnedFilterTypes.add(r),console.warn(`CanvasRenderer: filter "${r}" is not supported in Canvas2D and will be skipped.`))}get alphaMultiplier(){return this._alphaMultiplier}_pushFilterFrame(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new q),this._filterStackIndex++,e}_popFilterFrame(){return this._filterStackIndex<=0?this._filterStack[0]:(this._filterStackIndex--,this._filterStack[this._filterStackIndex])}destroy(){this._filterStack=null,this._savedStates=null,this._warnedFilterTypes=null,this._alphaMultiplier=1}}I.extension={type:[b.CanvasSystem],name:"filter"};var X=`in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`,$=`in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
void main() {
    finalColor = texture(uTexture, vTextureCoord);
}
`,k=`struct GlobalFilterUniforms {
  uInputSize: vec4<f32>,
  uInputPixel: vec4<f32>,
  uInputClamp: vec4<f32>,
  uOutputFrame: vec4<f32>,
  uGlobalFrame: vec4<f32>,
  uOutputTexture: vec4<f32>,
};

@group(0) @binding(0) var <uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;

struct VSOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>
};

fn filterVertexPosition(aPosition: vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord(aPosition: vec2<f32>) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

@vertex
fn mainVertex(
  @location(0) aPosition: vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {
    return textureSample(uTexture, uSampler, uv);
}
`;class j extends L{constructor(){const e=W.from({vertex:{source:k,entryPoint:"mainVertex"},fragment:{source:k,entryPoint:"mainFragment"},name:"passthrough-filter"}),t=Y.from({vertex:X,fragment:$,name:"passthrough-filter"});super({gpuProgram:e,glProgram:t})}}class C{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}C.extension={type:[b.WebGLPipes,b.WebGPUPipes,b.CanvasPipes],name:"filter"};const N=new B({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:2*4,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class H{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new R,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.globalFrame={x:0,y:0,width:0,height:0},this.firstEnabledIndex=-1,this.lastEnabledIndex=-1}}class O{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new A({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new M({}),this.renderer=e}get activeBackTexture(){var e;return(e=this._activeFilterData)==null?void 0:e.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,i=this._pushFilterData();i.skip=!1,i.filters=r,i.container=e.container,i.outputRenderSurface=t.renderTarget.renderSurface;const s=t.renderTarget.renderTarget.colorTexture.source,n=s.resolution,a=s.antialias;if(r.every(p=>!p.enabled)){i.skip=!0;return}const o=i.bounds;if(this._calculateFilterArea(e,o),this._calculateFilterBounds(i,t.renderTarget.rootViewPort,a,n,1),i.skip)return;const u=this._getPreviousFilterData(),c=this._findFilterResolution(n);let f=0,l=0;u&&(f=u.bounds.minX,l=u.bounds.minY),this._calculateGlobalFrame(i,f,l,c,s.width,s.height),this._setupFilterTextures(i,o,t,u)}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const i=e.source,s=i.resolution,n=i.antialias;if(t.every(c=>!c.enabled))return r.skip=!0,e;const a=r.bounds;if(a.addRect(e.frame),this._calculateFilterBounds(r,a.rectangle,n,s,0),r.skip)return e;const o=s;this._calculateGlobalFrame(r,0,0,o,i.width,i.height),r.outputRenderSurface=T.getOptimalTexture(a.width,a.height,r.resolution,r.antialias),r.backTexture=v.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const u=r.outputRenderSurface;return u.source.alphaMode="premultiplied-alpha",u}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&T.returnTexture(t.backTexture),T.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const i=e.colorTexture.source._resolution,s=T.getOptimalTexture(t.width,t.height,i,!1);let n=t.minX,a=t.minY;r&&(n-=r.minX,a-=r.minY),n=Math.floor(n*i),a=Math.floor(a*i);const o=Math.ceil(t.width*i),u=Math.ceil(t.height*i);return this.renderer.renderTarget.copyToTexture(e,s,{x:n,y:a},{width:o,height:u},{x:0,y:0}),s}applyFilter(e,t,r,i){const s=this.renderer,n=this._activeFilterData,a=n.outputRenderSurface===r,o=s.renderTarget.rootRenderTarget.colorTexture.source._resolution,u=this._findFilterResolution(o);let c=0,f=0;if(a){const p=this._findPreviousFilterOffset();c=p.x,f=p.y}this._updateFilterUniforms(t,r,n,c,f,u,a,i);const l=e.enabled?e:this._getPassthroughFilter();this._setupBindGroupsAndRender(l,t,s)}calculateSpriteMatrix(e,t){const r=this._activeFilterData,i=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),s=t.worldTransform.copyTo(P.shared),n=t.renderGroup||t.parentRenderGroup;return n&&n.cacheToLocalTransform&&s.prepend(n.cacheToLocalTransform),s.invert(),i.prepend(s),i.scale(1/t.texture.orig.width,1/t.texture.orig.height),i.translate(t.anchor.x,t.anchor.y),i}destroy(){var e;(e=this._passthroughFilter)==null||e.destroy(!0),this._passthroughFilter=null}_getPassthroughFilter(){return this._passthroughFilter??(this._passthroughFilter=new j),this._passthroughFilter}_setupBindGroupsAndRender(e,t,r){if(r.renderPipes.uniformBatch){const i=r.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);this._globalFilterBindGroup.setResource(i,0)}else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,r.encoder.draw({geometry:N,shader:e,state:e._state,topology:"triangle-list"}),r.type===U.WEBGL&&r.renderTarget.finishRenderPass()}_setupFilterTextures(e,t,r,i){if(e.backTexture=v.EMPTY,e.inputTexture=T.getOptimalTexture(t.width,t.height,e.resolution,e.antialias),e.blendRequired){r.renderTarget.finishRenderPass();const s=r.renderTarget.getRenderTarget(e.outputRenderSurface);e.backTexture=this.getBackTexture(s,t,i==null?void 0:i.bounds)}r.renderTarget.bind({target:e.inputTexture,clear:!0}),r.globalUniforms.push({offset:t})}_calculateGlobalFrame(e,t,r,i,s,n){const a=e.globalFrame;a.x=t*i,a.y=r*i,a.width=s*i,a.height=n*i}_updateFilterUniforms(e,t,r,i,s,n,a,o){const u=this._filterGlobalUniforms.uniforms,c=u.uOutputFrame,f=u.uInputSize,l=u.uInputPixel,p=u.uInputClamp,h=u.uGlobalFrame,x=u.uOutputTexture;a?(c[0]=r.bounds.minX-i,c[1]=r.bounds.minY-s):(c[0]=0,c[1]=0),c[2]=e.frame.width,c[3]=e.frame.height,f[0]=e.source.width,f[1]=e.source.height,f[2]=1/f[0],f[3]=1/f[1],l[0]=e.source.pixelWidth,l[1]=e.source.pixelHeight,l[2]=1/l[0],l[3]=1/l[1],p[0]=.5*l[2],p[1]=.5*l[3],p[2]=e.frame.width*f[2]-.5*l[2],p[3]=e.frame.height*f[3]-.5*l[3];const _=this.renderer.renderTarget.rootRenderTarget.colorTexture;h[0]=i*n,h[1]=s*n,h[2]=_.source.width*n,h[3]=_.source.height*n,t instanceof v&&(t.source.resource=null);const d=this.renderer.renderTarget.getRenderTarget(t);this.renderer.renderTarget.bind({target:t,clear:!!o}),t instanceof v?(x[0]=t.frame.width,x[1]=t.frame.height):(x[0]=d.width,x[1]=d.height),x[2]=d.isRoot?-1:1,this._filterGlobalUniforms.update()}_findFilterResolution(e){let t=this._filterStackIndex-1;for(;t>0&&this._filterStack[t].skip;)--t;return t>0&&this._filterStack[t].inputTexture?this._filterStack[t].inputTexture.source._resolution:e}_findPreviousFilterOffset(){let e=0,t=0,r=this._filterStackIndex;for(;r>0;){r--;const i=this._filterStack[r];if(!i.skip){e=i.bounds.minX,t=i.bounds.minY;break}}return{x:e,y:t}}_calculateFilterArea(e,t){if(e.renderables?G(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const r=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;r&&t.applyMatrix(r)}}_applyFiltersToTexture(e,t){const r=e.inputTexture,i=e.bounds,s=e.filters,n=e.firstEnabledIndex,a=e.lastEnabledIndex;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),n===a)s[n].apply(this,r,e.outputRenderSurface,t);else{let o=e.inputTexture;const u=T.getOptimalTexture(i.width,i.height,o.source._resolution,!1);let c=u;for(let f=n;f<a;f++){const l=s[f];if(!l.enabled)continue;l.apply(this,o,c,!0);const p=o;o=c,c=p}s[a].apply(this,o,e.outputRenderSurface,t),T.returnTexture(u)}}_calculateFilterBounds(e,t,r,i,s){var n;const a=this.renderer,o=e.bounds,u=e.filters;let c=1/0,f=0,l=!0,p=!1,h=!1,x=!0,_=-1,d=-1;for(let F=0;F<u.length;F++){const m=u[F];if(m.enabled){if(_===-1&&(_=F),d=F,c=Math.min(c,m.resolution==="inherit"?i:m.resolution),f+=m.padding,m.antialias==="off"?l=!1:m.antialias==="inherit"&&l&&(l=r),m.clipToViewport||(x=!1),!(m.compatibleRenderers&a.type)){h=!1;break}if(m.blendRequired&&!(((n=a.backBuffer)==null?void 0:n.useBackBuffer)??!0)){z("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),h=!1;break}h=!0,p||(p=m.blendRequired)}}if(!h){e.skip=!0;return}if(x&&o.fitBounds(0,t.width/i,0,t.height/i),o.scale(c).ceil().scale(1/c).pad((f|0)*s),!o.isPositive){e.skip=!0;return}e.antialias=l,e.resolution=c,e.blendRequired=p,e.firstEnabledIndex=_,e.lastEnabledIndex=d}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>0&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new H),this._filterStackIndex++,e}}O.extension={type:[b.WebGLSystem,b.WebGPUSystem],name:"filter"};w.add(O,I);w.add(C);
