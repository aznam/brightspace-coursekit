/** CourseKit semantic palette resolution. Derived values never overwrite explicit site choices. */
export const COLOR_KEYS = Object.freeze([
    'accent', 'accent-light', 'structure', 'text-main', 'text-dark', 'border',
    'bg-base', 'surface', 'surface-muted', 'color-info', 'color-warning',
    'color-error', 'color-success'
]);
export const DEFAULT_LIGHT = Object.freeze({
    accent:'#c2410c', 'accent-light':'#ffedd5', structure:'#1e293b',
    'text-main':'#334155', 'text-dark':'#0f172a', border:'#e2e8f0',
    'bg-base':'#fafaf9', surface:'#ffffff', 'surface-muted':'#f8fafc',
    'color-info':'#185fa5', 'color-warning':'#854f0b',
    'color-error':'#a32d2d', 'color-success':'#3b6d11'
});
const NAME = /^[a-z][a-z0-9-]*$/;
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const clamp = (v, a=0, b=1) => Math.min(b,Math.max(a,v));
function rgb(value) {
    const digits = value.slice(1);
    const hex = digits.length === 3 ? [...digits].map(x=>x+x).join('') : digits;
    return [0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255);
}
const encoded = v => v <= .0031308 ? 12.92*v : 1.055*Math.pow(v,1/2.4)-.055;
const linear = v => v <= .04045 ? v/12.92 : Math.pow((v+.055)/1.055,2.4);
function toOKLCH(color) {
    const [r,g,b] = rgb(color).map(linear);
    const l = Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b);
    const m = Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b);
    const s = Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
    const L = .2104542553*l+.793617785*m-.0040720468*s;
    const a = 1.9779984951*l-2.428592205*m+.4505937099*s;
    const bb = .0259040371*l+.7827717662*m-.808675766*s;
    return [L,Math.hypot(a,bb),Math.atan2(bb,a)];
}
function fromOKLCH([L,C,h]) {
    const a=C*Math.cos(h), b=C*Math.sin(h);
    const l=(L+.3963377774*a+.2158037573*b)**3;
    const m=(L-.1055613458*a-.0638541728*b)**3;
    const s=(L-.0894841775*a-1.291485548*b)**3;
    const raw=[4.0767416621*l-3.3077115913*m+.2309699292*s,
        -1.2684380046*l+2.6097574011*m-.3413193965*s,
        -.0041960863*l-.7034186147*m+1.707614701*s];
    return raw.map(encoded);
}
function hexColor(channels) {
    return '#'+channels.map(x=>Math.round(clamp(x)*255).toString(16).padStart(2,'0')).join('');
}
// Reduce chroma to remain in sRGB rather than independently clipping each channel.
function make(L,C,h) {
    let lo=0,hi=C;
    for(let i=0;i<18;i++) {
        const mid=(lo+hi)/2;
        const v=fromOKLCH([clamp(L),mid,h]);
        if (v.every(x=>Number.isFinite(x)&&x>=0&&x<=1)) lo=mid;
        else hi=mid;
    }
    return hexColor(fromOKLCH([clamp(L),lo,h]));
}
function move(color,L,scale=1) {
    const [,C,h]=toOKLCH(color);
    return make(L,C*scale,h);
}
function blend(a,b,t) {
    const A=toOKLCH(a),B=toOKLCH(b);
    const x=(1-t)*A[1]*Math.cos(A[2])+t*B[1]*Math.cos(B[2]);
    const y=(1-t)*A[1]*Math.sin(A[2])+t*B[1]*Math.sin(B[2]);
    return make(A[0]*(1-t)+B[0]*t,Math.hypot(x,y),Math.atan2(y,x));
}
export function contrast(a,b) {
    if (!HEX.test(a||'') || !HEX.test(b||'')) return null;
    const lum = x => rgb(x).map(linear).reduce((v,n,i)=>v+n*[.2126,.7152,.0722][i],0);
    const A=lum(a),B=lum(b);
    return (Math.max(A,B)+.05)/(Math.min(A,B)+.05);
}
function readable(color,bg,minimum=4.5) {
    if (contrast(color,bg)>=minimum) return color;
    const light=contrast('#ffffff',bg)>=contrast('#050a10',bg);
    const [L,C,h]=toOKLCH(color);
    let candidate=color;
    for(let i=1;i<=100;i++) {
        candidate=make(L+( (light?1:0)-L)*i/100,C,h);
        if (contrast(candidate,bg)>=minimum) return candidate;
    }
    return light?'#ffffff':'#050a10';
}
function validateOverrides(source,location) {
    const valid={};
    if (source == null) return valid;
    if (typeof source !== 'object'||Array.isArray(source)) throw new TypeError(`${location} must be an object`);
    for(const [key,value] of Object.entries(source)) {
        if (!COLOR_KEYS.includes(key)) {
            console.warn(`[CourseKit] Unknown palette role ${location}.${key}; ignored.`);
            continue;
        }
        if(typeof value !== 'string'||!HEX.test(value)) {
            console.warn(`[CourseKit] ${location}.${key} must be a hex RGB color; ignored.`);
            continue;
        }
        valid[key]=value;
    }
    return valid;
}
export function resolvePalettes(theme={}) {
    const lightOverrides={...validateOverrides(theme.palette,'theme.palette'),
        ...validateOverrides(theme.palettes?.light,'theme.palettes.light')};
    const overrides={...validateOverrides(theme.dark,'theme.dark'),
        ...validateOverrides(theme.palettes?.dark,'theme.palettes.dark')};
    const light={...DEFAULT_LIGHT,...lightOverrides};
    const base=light['bg-base'];
    const dark={
        'bg-base': move(base,.135,.55),
        surface:move(light.surface,.205,.50),
        'surface-muted':move(light['surface-muted'],.275,.5),
        structure:move(light.structure,.17,.6),
        accent:move(light.accent,.76,.95),
        'text-main':move(light['text-main'],.85,.35),
        'text-dark':move(light['text-dark'],.97,.15),
        border:move(light.border,.49,.4),
        'color-info':move(light['color-info'],.8,.8),
        'color-warning':move(light['color-warning'],.83,.8),
        'color-error':move(light['color-error'],.8,.8),
        'color-success':move(light['color-success'],.79,.8)
    };
    // Derived colors are recomputed after resolving explicit inputs.
    Object.assign(dark,overrides);
    if(!Object.hasOwn(overrides,'surface')) dark.surface=blend(dark['bg-base'],move(light.surface,.24,.5),.8);
    if(!Object.hasOwn(overrides,'surface-muted')) dark['surface-muted']=blend(dark.surface,move(light['surface-muted'],.33,.5),.6);
    if(!Object.hasOwn(overrides,'structure')) dark.structure=blend(dark['bg-base'],move(light.structure,.2,.5),.6);
    if(!Object.hasOwn(overrides,'accent')) dark.accent=readable(dark.accent,dark.surface);
    if(!Object.hasOwn(overrides,'accent-light')) dark['accent-light']=blend(dark.surface,dark.accent,.2);
    for(const key of ['text-main','text-dark','color-info','color-warning','color-error','color-success']) {
        if(!Object.hasOwn(overrides,key)) dark[key]=readable(dark[key],dark.surface);
    }
    // Derived strong boundaries are intentionally separate from `structure`:
    // the latter is also used as a dark background (notably by the navbar).
    // This is a calculated design token, not another configurable palette key.
    // Site-defined palette colors remain untouched.
    light['outline-strong'] = readable(light.structure, light.surface, 3);
    dark['outline-strong'] = readable(dark.structure, dark.surface, 3);
    return {light,dark};
}
export function auditPalettes(palettes) {
    const problems=[];
    const pairs=[['text-main','surface',4.5],['text-dark','surface',4.5],
        ['text-main','bg-base',4.5],['text-dark','bg-base',4.5],
        ['accent','surface',3],['border','surface',3],
        ['outline-strong','surface',3],
        ...['color-info','color-warning','color-error','color-success'].map(s=>[s,'surface',3])];
    for(const [mode,palette] of Object.entries(palettes)) for(const [fg,bg,min] of pairs) {
        const ratio=contrast(palette[fg],palette[bg]);
        if(ratio===null || ratio<min) problems.push({mode,fg,bg,ratio,minimum:min});
    }
    return problems;
}
