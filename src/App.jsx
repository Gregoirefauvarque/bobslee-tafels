import { useState, useCallback, useEffect } from "react";

const TOTAL_GATES = 10;
const ALL_TABLES  = [2,3,4,5,6,7,8,9,10];
const rnd = arr => arr[Math.floor(Math.random()*arr.length)];

function genQ(tables, withDivision) {
  const a = rnd(tables);
  const b = Math.floor(Math.random()*10)+1;
  const product = a * b;
  if (withDivision && Math.random() < 0.4) {
    if (Math.random() < 0.5) return { text:`${product} ÷ ${a}`, answer:b };
    else                      return { text:`${product} ÷ ${b}`, answer:a };
  }
  return { text:`${a} × ${b}`, answer:product };
}

// ── Snow ──────────────────────────────────────────────────────────────────────
const FLAKES = Array.from({length:30},(_,i)=>({
  id:i, x:Math.random()*100, size:2+Math.random()*4,
  delay:Math.random()*7, dur:4+Math.random()*5,
}));
function Snow() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      {FLAKES.map(f=>(
        <div key={f.id} style={{
          position:"absolute",left:`${f.x}%`,top:"-8px",
          width:f.size,height:f.size,borderRadius:"50%",
          background:"rgba(255,255,255,0.85)",
          animation:`snowfall ${f.dur}s ${f.delay}s linear infinite`,
        }}/>
      ))}
    </div>
  );
}

// ── TOP-DOWN Bobsled ──────────────────────────────────────────────────────────
// Sled moves DOWNWARD → nose points DOWN, tail at TOP.
// ViewBox: 0 0 60 110  (60 wide, 110 tall)
function Sled({ color, hlColor, uid }) {
  return (
    <svg viewBox="0 0 60 110" width="60" height="110" overflow="visible">
      <defs>
        <linearGradient id={`hullG${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#5a8aaa"/>
          <stop offset="20%"  stopColor={hlColor}/>
          <stop offset="60%"  stopColor={color}/>
          <stop offset="100%" stopColor={color}/>
        </linearGradient>
        <radialGradient id={`shineG${uid}`} cx="50%" cy="30%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.25)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <linearGradient id={`runG${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#b0d4ee"/>
          <stop offset="40%"  stopColor="#e8f6ff"/>
          <stop offset="100%" stopColor="#7ab0cc"/>
        </linearGradient>
        <filter id={`shadow${uid}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.6)"/>
        </filter>
      </defs>

      <g filter={`url(#shadow${uid})`}>

        {/* ─── RUNNER LEFT ─── */}
        <path d="M 4 12 L 2 18 L 2 90 Q 2 96 5 98 L 9 98 L 9 18 L 11 12 Z"
          fill={`url(#runG${uid})`} stroke="#3a6888" strokeWidth="0.7"/>
        <line x1="5" y1="14" x2="5" y2="96"
          stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ─── RUNNER RIGHT ─── */}
        <path d="M 49 12 L 51 18 L 51 90 Q 51 96 55 98 L 58 98 L 58 18 L 56 12 Z"
          fill={`url(#runG${uid})`} stroke="#3a6888" strokeWidth="0.7"/>
        <line x1="57" y1="14" x2="57" y2="96"
          stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ─── MAIN HULL ─── */}
        {/* Tail (top) → wide, Nose (bottom) → pointed */}
        <path d={`
          M 9  12
          Q 9   4  30   4
          Q 51  4  51  12
          L 53  85
          Q 53  96  30 104
          Q  7  96   7  85
          Z
        `} fill={`url(#hullG${uid})`} stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>

        {/* Hull shine overlay */}
        <path d={`
          M 9 12 Q 9 4 30 4 Q 51 4 51 12
          L 50 38 Q 30 34 10 38 Z
        `} fill={`url(#shineG${uid})`}/>

        {/* Side stripes */}
        <path d="M 9 22 Q 30 20 51 22" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2"/>
        <path d="M 8 78 Q 30 76 52 78" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1"/>

        {/* Center spine */}
        <line x1="30" y1="5" x2="30" y2="103"
          stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeDasharray="7,5"/>

        {/* Axle bars */}
        <rect x="9"  y="24" width="42" height="5" rx="2.5" fill="rgba(0,0,0,0.25)"/>
        <rect x="9"  y="78" width="42" height="5" rx="2.5" fill="rgba(0,0,0,0.25)"/>

        {/* ─── NOSE TIP ─── */}
        <ellipse cx="30" cy="103" rx="5" ry="3"
          fill={hlColor} stroke="rgba(0,0,0,0.3)" strokeWidth="0.8"/>
        <ellipse cx="30" cy="102" rx="3" ry="1.5" fill="rgba(255,255,255,0.35)"/>

        {/* ─── TAIL FIN ─── */}
        <path d="M 20 4 Q 22 -5 30 -7 Q 38 -5 40 4"
          fill={color} stroke={hlColor} strokeWidth="1.2"/>
        <path d="M 24 4 Q 26 -2 30 -4 Q 34 -2 36 4"
          fill={hlColor} opacity="0.6"/>

        {/* ─── COCKPIT RECESS ─── */}
        <path d={`
          M 14 30
          Q 14 26  30 26
          Q 46 26  46 30
          L 46 78
          Q 46 82  30 82
          Q 14 82  14 78
          Z
        `} fill="#08121e" stroke="rgba(80,160,220,0.35)" strokeWidth="1"/>

        {/* ── ATHLETE 1 (rear / top) ── */}
        {/* Suit body */}
        <ellipse cx="30" cy="44" rx="9.5" ry="11"
          fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth="0.8"/>
        {/* Arms tucked tight */}
        <path d="M 20.5 41 Q 18 44 19 49 Q 20 51 22 50"
          stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M 39.5 41 Q 42 44 41 49 Q 40 51 38 50"
          stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Helmet shell */}
        <circle cx="30" cy="40" r="9"
          fill="#0d1e30" stroke={hlColor} strokeWidth="1.8"/>
        {/* Helmet top colour panel */}
        <path d="M 21 40 Q 21 31.5 30 31 Q 39 31.5 39 40"
          fill={hlColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8"/>
        {/* Helmet side stripes */}
        <path d="M 21 40 Q 21 44 30 44.5 Q 39 44 39 40"
          fill="none" stroke={hlColor} strokeWidth="1.2" opacity="0.5"/>
        {/* Visor (dark wide oval at front = lower half of helmet) */}
        <path d="M 22 41 Q 22 47 30 47.5 Q 38 47 38 41"
          fill="#0a1928" stroke="rgba(100,200,255,0.6)" strokeWidth="0.9"/>
        {/* Visor reflection */}
        <path d="M 24 42 Q 30 40.5 36 42"
          fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M 25.5 44.5 Q 30 43.5 34.5 44.5"
          fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" strokeLinecap="round"/>
        {/* Helmet number */}
        <text x="30" y="38" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.7)"
          fontFamily="'Bangers',cursive">1</text>

        {/* ── ATHLETE 2 (front / bottom) ── */}
        <ellipse cx="30" cy="67" rx="9.5" ry="11"
          fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth="0.8"/>
        <path d="M 20.5 64 Q 18 67 19 72 Q 20 74 22 73"
          stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M 39.5 64 Q 42 67 41 72 Q 40 74 38 73"
          stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <circle cx="30" cy="63" r="9"
          fill="#0d1e30" stroke={hlColor} strokeWidth="1.8"/>
        <path d="M 21 63 Q 21 54.5 30 54 Q 39 54.5 39 63"
          fill={hlColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8"/>
        <path d="M 21 63 Q 21 67 30 67.5 Q 39 67 39 63"
          fill="none" stroke={hlColor} strokeWidth="1.2" opacity="0.5"/>
        <path d="M 22 64 Q 22 70 30 70.5 Q 38 70 38 64"
          fill="#0a1928" stroke="rgba(100,200,255,0.6)" strokeWidth="0.9"/>
        <path d="M 24 65 Q 30 63.5 36 65"
          fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M 25.5 67.5 Q 30 66.5 34.5 67.5"
          fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" strokeLinecap="round"/>
        <text x="30" y="61" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.7)"
          fontFamily="'Bangers',cursive">2</text>

        {/* ─── ICE SPRAY at nose ─── */}
        {[-9,-5,0,5,9].map((dx,i)=>(
          <line key={i}
            x1={30+dx} y1="104" x2={30+dx*1.5} y2={110+i%2*3}
            stroke="rgba(190,230,255,0.75)" strokeWidth="1.1" strokeLinecap="round"/>
        ))}

        {/* ─── SPEED LINES at tail ─── */}
        {[-10,-5,0,5,10].map((dx,i)=>(
          <line key={i}
            x1={30+dx} y1="-8" x2={30+dx} y2={-16-Math.abs(dx)*0.3}
            stroke="rgba(255,255,255,0.55)" strokeWidth={i===2?2.2:1.6}
            strokeLinecap="round"/>
        ))}

      </g>
    </svg>
  );
}

// ── Vertical Race Lane ────────────────────────────────────────────────────────
function Lane({ progress, color, hlColor, label, accent }) {
  // Very tall viewBox so the track looks long
  const VW = 170, VH = 700;
  const LW = 80;               // ice lane inner width
  const CX = VW / 2;
  const START_Y  = 60;
  const FINISH_Y = 630;
  const TRACK_H  = FINISH_Y - START_Y;  // 570px of track

  // sled centre Y — big jump per correct answer
  const sledY = START_Y + (progress / TOTAL_GATES) * TRACK_H;

  const uid = label;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%" style={{display:"block"}}>
      <defs>
        <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#071526"/>
          <stop offset="100%" stopColor="#0e2238"/>
        </linearGradient>
        <linearGradient id={`iceL${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#4a90b8" stopOpacity="0.3"/>
          <stop offset="25%"  stopColor="#9ad0ee" stopOpacity="0.5"/>
          <stop offset="50%"  stopColor="#d8f2ff" stopOpacity="0.65"/>
          <stop offset="75%"  stopColor="#9ad0ee" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#4a90b8" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id={`snowL${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#b8d8f0"/>
          <stop offset="100%" stopColor="#e2f0fa"/>
        </linearGradient>
        <clipPath id={`clip${uid}`}>
          <rect x={CX-LW/2} y={START_Y-2} width={LW} height={TRACK_H+4}/>
        </clipPath>
        <filter id={`glow${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* BG */}
      <rect x="0" y="0" width={VW} height={VH} fill={`url(#bg${uid})`}/>

      {/* Stars */}
      {[[8,10],[25,5],[50,18],[80,7],[110,14],[145,9],[18,38],[90,28],[150,35],[12,55],[140,55]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={0.5+Math.random()*1.1} fill="white"
          opacity={0.2+Math.random()*0.5}/>
      ))}

      {/* Mountains */}
      <polygon points={`0,200 30,100 60,200`}        fill="#061320" opacity="0.95"/>
      <polygon points={`40,200 85,78 130,200`}       fill="#071828" opacity="0.95"/>
      <polygon points={`110,200 152,92 170,135 170,200`} fill="#061320" opacity="0.95"/>
      <polygon points="30,100 40,120 20,120"  fill="#cce4f5" opacity="0.5"/>
      <polygon points="85,78 96,103 74,103"   fill="#cce4f5" opacity="0.5"/>
      <polygon points="152,92 163,116 141,116" fill="#cce4f5" opacity="0.5"/>

      {/* Aurora */}
      <path d={`M 0 50 Q ${VW/2} 30 ${VW} 48`}  fill="none" stroke="#00e5a0" strokeWidth="14" opacity="0.07"/>
      <path d={`M 0 65 Q ${VW/2} 46 ${VW} 62`}  fill="none" stroke="#5599ff" strokeWidth="9"  opacity="0.08"/>

      {/* ── SNOW BANKS ── */}
      <rect x={CX-LW/2-18} y={START_Y} width={20} height={TRACK_H} rx="8"
        fill={`url(#snowL${uid})`} opacity="0.92"/>
      <rect x={CX+LW/2-1}  y={START_Y} width={20} height={TRACK_H} rx="8"
        fill={`url(#snowL${uid})`} opacity="0.92"/>
      {/* Inner wall shadow */}
      <rect x={CX-LW/2-2} y={START_Y} width={5} height={TRACK_H}
        fill="rgba(0,0,0,0.2)" rx="3"/>
      <rect x={CX+LW/2-2} y={START_Y} width={5} height={TRACK_H}
        fill="rgba(0,0,0,0.2)" rx="3"/>

      {/* ── ICE ── */}
      <rect x={CX-LW/2} y={START_Y} width={LW} height={TRACK_H}
        fill={`url(#iceL${uid})`}/>
      {/* Subtle horizontal ice striations */}
      {Array.from({length:40},(_,i)=>(
        <line key={i}
          x1={CX-LW/2+2} y1={START_Y+8+i*14}
          x2={CX+LW/2-2} y2={START_Y+11+i*14}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
      ))}
      {/* Centre dashes */}
      {Array.from({length:42},(_,i)=>(
        <rect key={i} x={CX-1.2} y={START_Y+5+i*14} width={2.4} height={8}
          rx="1.2" fill="rgba(255,255,255,0.22)"/>
      ))}

      {/* ── GATE FLAGS ── */}
      {Array.from({length:TOTAL_GATES-1},(_,i)=>{
        const gy = START_Y + ((i+1)/TOTAL_GATES)*TRACK_H;
        return (
          <g key={i}>
            <line x1={CX-LW/2} y1={gy} x2={CX+LW/2} y2={gy}
              stroke={accent} strokeWidth="2.5" strokeDasharray="6,5" opacity="0.6"/>
            {/* Left pole */}
            <rect x={CX-LW/2-7} y={gy-22} width={5} height={24} rx="2.5" fill="#aaa"/>
            <rect x={CX-LW/2-7} y={gy-22} width={5} height={12}  rx="2" fill={accent}/>
            {/* Right pole */}
            <rect x={CX+LW/2+3} y={gy-22} width={5} height={24} rx="2.5" fill="#aaa"/>
            <rect x={CX+LW/2+3} y={gy-22} width={5} height={12}  rx="2" fill={accent}/>
            {/* Gate number */}
            <text x={CX} y={gy-5} textAnchor="middle" fontSize="9"
              fill={accent} fontFamily="'Bangers',cursive" opacity="0.7">{i+1}</text>
          </g>
        );
      })}

      {/* ── START ── */}
      <rect x={CX-LW/2-18} y={START_Y-28} width={LW+36} height={28} rx="7"
        fill="#081828" stroke={accent} strokeWidth="2"/>
      <text x={CX} y={START_Y-9} textAnchor="middle" fontSize="14" fill={accent}
        fontFamily="'Bangers',cursive" letterSpacing="4">▼ START ▼</text>

      {/* ── FINISH ── */}
      <rect x={CX-LW/2-18} y={FINISH_Y} width={LW+36} height={30} rx="7"
        fill="#081828" stroke="#ffd700" strokeWidth="2"/>
      {/* Checkered */}
      {Array.from({length:10},(_,i)=>(
        <rect key={i} x={CX-LW/2-18+i*((LW+36)/10)} y={FINISH_Y}
          width={(LW+36)/10} height={10}
          fill={i%2===0?"white":"black"} opacity="0.8"/>
      ))}
      <text x={CX} y={FINISH_Y+26} textAnchor="middle" fontSize="14" fill="#ffd700"
        fontFamily="'Bangers',cursive" letterSpacing="4">★ FINISH ★</text>

      {/* ── SLED (top-down, clipped to ice, moves down) ── */}
      <g clipPath={`url(#clip${uid})`}>
        {/* Glow under sled */}
        <g style={{transition:"transform 0.65s cubic-bezier(0.34,1.15,0.64,1)"}}
           transform={`translate(${CX},${sledY+68})`}>
          <ellipse cx="0" cy="0" rx="24" ry="10"
            fill={accent} opacity="0.32" filter={`url(#glow${uid})`}/>
        </g>
        {/* Sled — centred horizontally, nose pointing down */}
        <g style={{transition:"transform 0.65s cubic-bezier(0.34,1.15,0.64,1)"}}
           transform={`translate(${CX-30},${sledY})`}>
          <Sled color={color} hlColor={hlColor} uid={uid}/>
        </g>
      </g>

      {/* Team label */}
      <text x={CX} y={VH-8} textAnchor="middle" fontSize="14" fill={accent}
        fontFamily="'Bangers',cursive" letterSpacing="4">TEAM {label}</text>
    </svg>
  );
}

// ── Number Pad ────────────────────────────────────────────────────────────────
function NumberPad({ onAnswer, disabled, accent }) {
  const [input, setInput] = useState("");
  const press = n => { if (!disabled) setInput(p=>(p+n).slice(0,3)); };
  const submit = () => { if (!input||disabled) return; onAnswer(parseInt(input)); setInput(""); };
  const del = () => setInput(p=>p.slice(0,-1));

  // onPointerDown fires immediately on both touch AND mouse, no delay
  // stopPropagation prevents the other team's panel from stealing the event
  const makeHandler = (fn) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  const DigitBtn = ({ n }) => {
    const is1 = n === 1;
    const is7 = n === 7;
    return (
      <button
        onPointerDown={makeHandler(()=>press(n))}
        disabled={disabled}
        style={{
          height:64, borderRadius:14, border:"none",
          background:"rgba(255,255,255,0.1)",
          color:"#e8f4ff",
          cursor:disabled?"not-allowed":"pointer",
          boxShadow:disabled?"none":"0 4px 0 rgba(0,0,0,0.45)",
          transition:"all 0.1s",
          opacity:disabled?0.38:1,
          position:"relative",
          overflow:"hidden",
          padding:0,
          touchAction:"manipulation",
          userSelect:"none",
          WebkitUserSelect:"none",
        }}>
        {is1 && (
          <svg viewBox="0 0 40 44" width="40" height="44" style={{display:"block",margin:"0 auto",pointerEvents:"none"}}>
            <line x1="12" y1="8"  x2="20" y2="8"  stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="20" y1="8"  x2="20" y2="36" stroke="#e8f4ff" strokeWidth="5" strokeLinecap="round"/>
            <line x1="12" y1="36" x2="28" y2="36" stroke="#e8f4ff" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        )}
        {is7 && (
          <svg viewBox="0 0 40 44" width="40" height="44" style={{display:"block",margin:"0 auto",pointerEvents:"none"}}>
            <line x1="10" y1="8"  x2="30" y2="8"  stroke="#e8f4ff" strokeWidth="5" strokeLinecap="round"/>
            <line x1="14" y1="22" x2="24" y2="22" stroke="rgba(255,255,255,0.65)" strokeWidth="3" strokeLinecap="round"/>
            <line x1="30" y1="8"  x2="18" y2="36" stroke="#e8f4ff" strokeWidth="5" strokeLinecap="round"/>
          </svg>
        )}
        {!is1 && !is7 && (
          <span style={{fontSize:30,fontWeight:900,fontFamily:"'Bangers',cursive",letterSpacing:1,pointerEvents:"none"}}>
            {n}
          </span>
        )}
      </button>
    );
  };

  const ActionBtn = ({ch, onPress, special}) => (
    <button
      onPointerDown={makeHandler(onPress)}
      disabled={disabled}
      style={{
        height:64, borderRadius:14, border:"none",
        background: special==="ok"
          ? (input?`linear-gradient(145deg,${accent},${accent}cc)`:"rgba(255,255,255,0.05)")
          : "rgba(255,255,255,0.1)",
        color:"#e8f4ff", fontSize:special==="ok"?28:22, fontWeight:900,
        cursor:(disabled||(special==="ok"&&!input))?"not-allowed":"pointer",
        boxShadow:(disabled||(special==="ok"&&!input))?"none":"0 4px 0 rgba(0,0,0,0.45)",
        transition:"all 0.1s", fontFamily:"'Bangers',cursive",
        opacity:(disabled||(special==="ok"&&!input))?0.38:1,
        touchAction:"manipulation",
        userSelect:"none",
        WebkitUserSelect:"none",
      }}>{ch}</button>
  );

  return (
    <div
      style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}
      onPointerDown={e=>e.stopPropagation()}
    >
      <div style={{
        background:"rgba(0,0,0,0.42)", border:`2px solid ${accent}77`,
        borderRadius:12, padding:"10px 0", textAlign:"center",
        fontSize:52, fontFamily:"'Courier New', 'Lucida Console', monospace",
        fontWeight:900, letterSpacing:10,
        color:input?"#fff":"rgba(255,255,255,0.18)", minHeight:70,
        boxShadow:"inset 0 2px 12px rgba(0,0,0,0.4)",
      }}>{input||"···"}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {[7,8,9,4,5,6,1,2,3].map(n=><DigitBtn key={n} n={n}/>)}
        <ActionBtn ch="⌫" onPress={del}/>
        <DigitBtn n={0}/>
        <ActionBtn ch="✓" onPress={submit} special="ok"/>
      </div>
    </div>
  );
}

// ── Start Menu ────────────────────────────────────────────────────────────────
function StartMenu({ onStart }) {
  const [selected, setSelected] = useState(new Set(ALL_TABLES));
  const [withDiv,  setWithDiv]  = useState(false);
  const allOn = selected.size === ALL_TABLES.length;

  const toggle = t => setSelected(s => {
    const n = new Set(s);
    n.has(t) ? n.delete(t) : n.add(t);
    return n;
  });
  const toggleAll = () => setSelected(allOn ? new Set() : new Set(ALL_TABLES));

  const canStart = selected.size > 0;

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:300,
      background:"linear-gradient(170deg,#050d1a,#0a1628 50%,#061020)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      gap:0,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@700;900&display=swap');
        @keyframes shimmer{0%,100%{opacity:.7}50%{opacity:1}}
        @keyframes snowfall{from{transform:translateY(-8px) rotate(0);opacity:.9}to{transform:translateY(100vh) rotate(360deg);opacity:.15}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
      `}</style>
      <Snow/>

      <div style={{
        position:"relative", zIndex:1,
        background:"rgba(10,22,45,0.92)",
        border:"2px solid rgba(100,180,255,0.2)",
        borderRadius:28, padding:"36px 40px", maxWidth:480, width:"90%",
        boxShadow:"0 0 60px rgba(100,160,255,0.12)",
        backdropFilter:"blur(10px)",
      }}>
        {/* Title */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <h1 style={{
            margin:0, fontFamily:"'Bangers',cursive", fontSize:32, letterSpacing:5,
            color:"transparent",
            backgroundImage:"linear-gradient(90deg,#88ccff,#ffd700,#88ccff)",
            backgroundClip:"text", WebkitBackgroundClip:"text",
            animation:"shimmer 3s ease infinite",
          }}>❄️ WINTEROLYMPICS TAFELS ❄️</h1>
          <div style={{fontSize:12,color:"rgba(180,210,255,0.45)",fontFamily:"'Bangers',cursive",letterSpacing:4,marginTop:4}}>
            KIES JE INSTELLINGEN
          </div>
        </div>

        {/* Table selection */}
        <div style={{marginBottom:20}}>
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            marginBottom:12,
          }}>
            <div style={{fontSize:13,color:"rgba(200,230,255,0.7)",fontFamily:"'Bangers',cursive",letterSpacing:3}}>
              📋 TAFELS
            </div>
            {/* Select all */}
            <button onClick={toggleAll} style={{
              background: allOn?"rgba(100,180,255,0.2)":"rgba(255,255,255,0.07)",
              border:`1.5px solid ${allOn?"#66aaff":"rgba(255,255,255,0.15)"}`,
              borderRadius:10, padding:"5px 14px",
              color: allOn?"#88ccff":"rgba(255,255,255,0.55)",
              fontSize:11, fontFamily:"'Bangers',cursive", letterSpacing:2,
              cursor:"pointer",
            }}>
              {allOn?"✓ ALLES AAN":"ALLES SELECTEREN"}
            </button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
            {ALL_TABLES.map(t=>{
              const on = selected.has(t);
              return (
                <button key={t} onClick={()=>toggle(t)} style={{
                  height:52, borderRadius:12,
                  border:`2px solid ${on?"#66aaff":"rgba(255,255,255,0.12)"}`,
                  background: on?"linear-gradient(145deg,rgba(68,153,238,0.35),rgba(30,80,160,0.25))":"rgba(255,255,255,0.05)",
                  color: on?"#88ccff":"rgba(255,255,255,0.4)",
                  fontSize:22, fontFamily:"'Bangers',cursive",
                  cursor:"pointer",
                  boxShadow: on?"0 0 12px rgba(68,153,238,0.3)":"none",
                  transition:"all 0.15s",
                  transform: on?"scale(1.05)":"scale(1)",
                }}>
                  {on?"✓ ":""}{t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Division toggle */}
        <div style={{marginBottom:28}}>
          <button onClick={()=>setWithDiv(v=>!v)} style={{
            width:"100%", height:52, borderRadius:14,
            border:`2px solid ${withDiv?"#ffd700":"rgba(255,255,255,0.12)"}`,
            background: withDiv?"linear-gradient(145deg,rgba(255,215,0,0.2),rgba(180,140,0,0.15))":"rgba(255,255,255,0.05)",
            color: withDiv?"#ffd700":"rgba(255,255,255,0.45)",
            fontSize:15, fontFamily:"'Bangers',cursive", letterSpacing:3,
            cursor:"pointer",
            boxShadow: withDiv?"0 0 16px rgba(255,215,0,0.25)":"none",
            transition:"all 0.15s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          }}>
            <span style={{fontSize:20}}>{withDiv?"✓":"○"}</span>
            OOK DEELTAFELS INBEGRIJPEN  ÷
          </button>
        </div>

        {/* Start button */}
        <button
          onClick={()=>canStart && onStart([...selected], withDiv)}
          disabled={!canStart}
          style={{
            width:"100%", height:64, borderRadius:18,
            border:"none",
            background: canStart
              ?"linear-gradient(135deg,#ffd700,#ffaa00)"
              :"rgba(255,255,255,0.08)",
            color: canStart?"#1a0800":"rgba(255,255,255,0.2)",
            fontSize:26, fontFamily:"'Bangers',cursive", letterSpacing:5,
            cursor:canStart?"pointer":"not-allowed",
            boxShadow: canStart?"0 6px 0 #aa7700, 0 0 30px rgba(255,200,0,0.3)":"none",
            transition:"all 0.15s",
            animation: canStart?"pulse 2s ease infinite":"none",
          }}>
          🛷 START RACE! 🛷
        </button>

        {!canStart && (
          <div style={{textAlign:"center",marginTop:10,fontSize:11,color:"rgba(255,100,100,0.6)",fontFamily:"'Bangers',cursive",letterSpacing:2}}>
            SELECTEER MINSTENS ÉÉN TAFEL
          </div>
        )}
      </div>
    </div>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────
function Countdown({ onDone }) {
  const [count, setCount] = useState(3);

  useEffect(()=>{
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(()=>setCount(c=>c-1), 900);
    return ()=>clearTimeout(t);
  },[count]);

  const label = count > 0 ? String(count) : "GO!";
  const col   = count === 3?"#e63946": count===2?"#ffd700":"#2ecc71";

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:250,
      background:"rgba(2,8,20,0.82)", backdropFilter:"blur(6px)",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <div key={label} style={{
        fontFamily:"'Bangers',cursive",
        fontSize:count>0?180:120,
        color:col,
        textShadow:`0 0 60px ${col}, 0 0 120px ${col}88`,
        animation:"countPop 0.55s cubic-bezier(0.34,1.56,0.64,1)",
        letterSpacing:label==="GO!"?10:0,
      }}>{label}</div>
      <style>{`
        @keyframes countPop{0%{transform:scale(0.3);opacity:0}100%{transform:scale(1);opacity:1}}
      `}</style>
    </div>
  );
}

// ── Team Panel ────────────────────────────────────────────────────────────────
function TeamPanel({ num, question, onAnswer, disabled, progress, flash, accent }) {
  return (
    <div style={{
      flex:1, display:"flex", flexDirection:"column", gap:10,
      padding:"14px 12px",
      background: `linear-gradient(160deg,${accent}12,rgba(6,15,30,0.94))`,
      borderRadius:20, border:`2px solid ${accent}44`,
      position:"relative", overflow:"hidden",
      boxShadow:`0 0 30px ${accent}18, inset 0 0 30px rgba(0,0,0,0.3)`,
      animation: flash==="wrong" ? "wrongShake 0.35s ease" : "none",
    }}>

      {/* ✅ Correct: grote groene vink die snel verschijnt en verdwijnt */}
      {flash==="correct" && (
        <div style={{
          position:"absolute", inset:0, borderRadius:18,
          display:"flex", alignItems:"center", justifyContent:"center",
          pointerEvents:"none", zIndex:10,
          background:"rgba(20,180,80,0.18)",
          animation:"correctFade 0.55s ease-out forwards",
        }}>
          <svg viewBox="0 0 100 100" width="120" height="120"
               style={{filter:"drop-shadow(0 0 18px #2ecc71)", animation:"checkPop 0.35s cubic-bezier(0.34,1.7,0.64,1) forwards"}}>
            <circle cx="50" cy="50" r="46" fill="rgba(46,204,113,0.25)" stroke="#2ecc71" strokeWidth="4"/>
            <polyline points="22,52 42,72 78,30"
              fill="none" stroke="#2ecc71" strokeWidth="9"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                strokeDasharray:90,
                strokeDashoffset:0,
                animation:"drawCheck 0.25s 0.05s ease-out both",
              }}/>
          </svg>
        </div>
      )}

      {/* ❌ Wrong: subtiele rode rand, geen achtergrond (verwarring vermijden) */}
      {flash==="wrong" && (
        <div style={{
          position:"absolute", inset:0, borderRadius:18, pointerEvents:"none",
          boxShadow:"inset 0 0 0 4px rgba(220,50,50,0.7)",
          animation:"flashRing 0.35s ease-out forwards",
        }}/>
      )}

      <div style={{textAlign:"center"}}>
        <div style={{fontSize:15,color:`${accent}cc`,fontFamily:"'Bangers',cursive",letterSpacing:4}}>
          {num===1?"🔴":"🔵"} TEAM {num}
        </div>
        <div style={{margin:"6px 0 2px",background:"rgba(0,0,0,0.32)",borderRadius:20,
          height:11,overflow:"hidden",border:`1px solid ${accent}44`}}>
          <div style={{
            height:"100%",borderRadius:20,width:`${(progress/TOTAL_GATES)*100}%`,
            background:`linear-gradient(90deg,${accent},${accent}99)`,
            transition:"width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow:`0 0 10px ${accent}`,
          }}/>
        </div>
        <div style={{fontSize:11,color:`${accent}88`,fontFamily:"'Bangers',cursive",letterSpacing:2}}>
          {progress} / {TOTAL_GATES} POORTEN
        </div>
      </div>

      <div style={{
        background:"rgba(0,0,0,0.38)", border:`1.5px solid ${accent}33`,
        borderRadius:14, padding:"12px 8px", textAlign:"center",
      }}>
        <div style={{fontSize:11,color:"rgba(180,210,255,0.38)",fontFamily:"'Bangers',cursive",
          letterSpacing:3,marginBottom:4}}>BEREKEN</div>
        <div style={{fontSize:50,color:"#fff",letterSpacing:3,
          fontFamily:"'Courier New','Lucida Console',monospace", fontWeight:900,
          textShadow:`0 0 20px ${accent}99`}}>
          {question.text} = ?
        </div>
      </div>

      <NumberPad onAnswer={onAnswer} disabled={disabled} accent={accent}/>
    </div>
  );
}

// ── Main Game ─────────────────────────────────────────────────────────────────
export default function BobsleeGame() {
  const [phase,     setPhase]     = useState("menu"); // "menu"|"countdown"|"playing"
  const [tables,    setTables]    = useState(ALL_TABLES);
  const [withDiv,   setWithDiv]   = useState(false);
  const [progress,  setProgress]  = useState([0,0]);
  const [questions, setQuestions] = useState([null,null]);
  const [flashes,   setFlashes]   = useState([null,null]);
  const [disabled,  setDisabled]  = useState([false,false]);
  const [winner,    setWinner]    = useState(null);
  const [confetti,  setConfetti]  = useState(false);

  const handleStartMenu = (selTables, selDiv) => {
    setTables(selTables);
    setWithDiv(selDiv);
    setPhase("countdown");
  };

  const startGame = () => {
    setProgress([0,0]);
    setQuestions([genQ(tables,withDiv), genQ(tables,withDiv)]);
    setFlashes([null,null]);
    setDisabled([false,false]);
    setWinner(null);
    setConfetti(false);
    setPhase("playing");
  };

  const flash = (i,t) => {
    setFlashes(f=>{const n=[...f];n[i]=t;return n;});
    setTimeout(()=>setFlashes(f=>{const n=[...f];n[i]=null;return n;}),500);
  };

  const handleAnswer = useCallback((idx,ans)=>{
    if (winner||disabled[idx]) return;
    if (ans===questions[idx].answer) {
      flash(idx,"correct");
      setDisabled(d=>{const n=[...d];n[idx]=true;return n;});
      setProgress(p=>{
        const n=[...p]; n[idx]++;
        if (n[idx]>=TOTAL_GATES) setTimeout(()=>{setWinner(idx+1);setConfetti(true);},500);
        return n;
      });
      setTimeout(()=>{
        setQuestions(qs=>{const nq=[...qs];nq[idx]=genQ(tables,withDiv);return nq;});
        setDisabled(d=>{const n=[...d];n[idx]=false;return n;});
      },700);
    } else {
      flash(idx,"wrong");
    }
  },[questions,winner,disabled,tables,withDiv]);

  const goMenu = ()=>{
    setWinner(null); setConfetti(false); setPhase("menu");
  };

  const pieces = Array.from({length:50},(_,i)=>({
    id:i, x:Math.random()*100,
    col:["#e63946","#ffd700","#2d6abf","#2ecc71","#ff6b35","#c77dff"][i%6],
    delay:Math.random()*2, dur:2.5+Math.random()*2.5, size:7+Math.random()*10,
  }));

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(170deg,#050d1a 0%,#0a1628 50%,#061020 100%)",
      display:"flex", flexDirection:"column",
      padding:"8px", boxSizing:"border-box",
      position:"relative", overflow:"hidden",
      touchAction:"none",
      userSelect:"none",
      WebkitUserSelect:"none",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@700;900&display=swap');
        @keyframes snowfall{from{transform:translateY(-8px) rotate(0);opacity:.9}to{transform:translateY(100vh) rotate(360deg);opacity:.15}}
        @keyframes flashRing{from{opacity:1}to{opacity:0}}
        @keyframes correctFade{0%{opacity:1}70%{opacity:1}100%{opacity:0}}
        @keyframes checkPop{0%{transform:scale(0.4);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes drawCheck{from{stroke-dashoffset:90}to{stroke-dashoffset:0}}
        @keyframes wrongShake{0%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(4px)}100%{transform:translateX(0)}}
        @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes winPop{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
        @keyframes shimmer{0%,100%{opacity:.7}50%{opacity:1}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        * { -webkit-tap-highlight-color: transparent; }
        button { touch-action: manipulation; }
        button:not(:disabled):hover{filter:brightness(1.2);transform:translateY(-2px)!important}
        button:not(:disabled):active{transform:translateY(2px)!important;box-shadow:none!important}
      `}</style>

      {/* Overlays */}
      {phase==="menu"      && <StartMenu onStart={handleStartMenu}/>}
      {phase==="countdown" && <Countdown onDone={startGame}/>}

      <Snow/>

      {confetti&&pieces.map(p=>(
        <div key={p.id} style={{
          position:"fixed",left:`${p.x}%`,top:"-20px",
          width:p.size,height:p.size*0.55,background:p.col,borderRadius:2,
          animation:`confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
          zIndex:200,pointerEvents:"none",
        }}/>
      ))}

      {/* Title */}
      <div style={{textAlign:"center",marginBottom:8,position:"relative",zIndex:1}}>
        <h1 style={{
          margin:0, fontFamily:"'Bangers',cursive", fontSize:28, letterSpacing:5,
          color:"transparent",
          backgroundImage:"linear-gradient(90deg,#88ccff,#ffd700,#88ccff)",
          backgroundClip:"text", WebkitBackgroundClip:"text",
          animation:"shimmer 3s ease infinite",
        }}>❄️ WINTEROLYMPICS TAFELS ❄️</h1>
        <div style={{fontSize:10,color:"rgba(200,220,255,0.32)",fontFamily:"'Bangers',cursive",letterSpacing:4}}>
          BOBSLEE RACE — EERSTE AAN DE FINISH WINT
          {withDiv && <span style={{color:"#ffd70088"}}> &nbsp;+÷</span>}
        </div>
      </div>

      {/* 3-panel — only render when playing */}
      {phase==="playing" && questions[0] && (
        <div style={{display:"flex",gap:8,flex:1,minHeight:0,position:"relative",zIndex:1}}>

          <TeamPanel num={1} question={questions[0]}
            onAnswer={a=>handleAnswer(0,a)}
            disabled={disabled[0]||!!winner}
            progress={progress[0]} flash={flashes[0]}
            accent="#e63946"/>

          <div style={{
            width:250, flexShrink:0, display:"flex", gap:0,
            borderRadius:20, overflow:"hidden",
            border:"1.5px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{flex:1}}>
              <Lane progress={progress[0]} color="#c1121f" hlColor="#ff8896"
                label="1" accent="#e63946"/>
            </div>
            <div style={{width:3,background:"rgba(255,255,255,0.07)",flexShrink:0}}/>
            <div style={{flex:1}}>
              <Lane progress={progress[1]} color="#1d5fa4" hlColor="#66aaff"
                label="2" accent="#4499ee"/>
            </div>
          </div>

          <TeamPanel num={2} question={questions[1]}
            onAnswer={a=>handleAnswer(1,a)}
            disabled={disabled[1]||!!winner}
            progress={progress[1]} flash={flashes[1]}
            accent="#4499ee"/>
        </div>
      )}

      {/* Winner overlay */}
      {winner&&(
        <div style={{
          position:"fixed",inset:0,background:"rgba(0,5,15,0.88)",
          backdropFilter:"blur(8px)",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:150,
        }}>
          <div style={{
            textAlign:"center",padding:"40px 55px",borderRadius:28,
            animation:"winPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
            background:winner===1
              ?"linear-gradient(135deg,rgba(230,57,70,0.22),rgba(6,14,30,0.96))"
              :"linear-gradient(135deg,rgba(45,106,191,0.22),rgba(6,14,30,0.96))",
            border:`2px solid ${winner===1?"#e63946":"#4499ee"}`,
            boxShadow:`0 0 70px ${winner===1?"#e63946":"#4499ee"}44`,
          }}>
            <div style={{fontSize:76}}>🏅</div>
            <div style={{
              fontFamily:"'Bangers',cursive",fontSize:56,letterSpacing:4,
              color:winner===1?"#ff6677":"#66aaff",
              textShadow:`0 0 30px ${winner===1?"#e63946":"#4499ee"}`,
            }}>TEAM {winner} WINT!</div>
            <div style={{color:"rgba(200,220,255,0.55)",fontSize:15,fontWeight:700,marginBottom:22}}>
              🎿 Geweldig gerekend! 🎿
            </div>
            <div style={{fontFamily:"'Bangers',cursive",letterSpacing:3,color:"rgba(200,220,255,0.4)",fontSize:13,marginBottom:28}}>
              🔴 {progress[0]} POORTEN &nbsp;|&nbsp; {progress[1]} POORTEN 🔵
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>{
                // Rematch: same settings, new countdown
                setProgress([0,0]); setWinner(null); setConfetti(false);
                setPhase("countdown");
              }} style={{
                background:"linear-gradient(135deg,#ffd700,#ffaa00)",
                color:"#1a0800",border:"none",borderRadius:16,
                padding:"14px 32px",fontSize:20,fontWeight:900,
                cursor:"pointer",fontFamily:"'Bangers',cursive",letterSpacing:3,
                boxShadow:"0 5px 0 #aa7700",
              }}>🔄 HERKANSING</button>
              <button onClick={goMenu} style={{
                background:"rgba(255,255,255,0.1)",
                color:"rgba(200,220,255,0.8)",border:"2px solid rgba(100,160,255,0.3)",
                borderRadius:16, padding:"14px 32px",fontSize:20,fontWeight:900,
                cursor:"pointer",fontFamily:"'Bangers',cursive",letterSpacing:3,
              }}>⚙️ INSTELLINGEN</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
