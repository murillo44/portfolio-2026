import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PointMaterial, Points } from '@react-three/drei'

// --- 1. DICCIONARIO DE IDIOMAS ---
const translations = {
  es: {
    nav: { home: 'Inicio', about: 'Perfil', portfolio: 'Proyectos', contact: 'Contacto' },
    home: {
      status: 'OPEN TO WORK',
      roles: ["Estudiante de Ingeniería en Sistemas.", "Desarrollador .NET Core.", "Entusiasta de Ciberseguridad."],
      desc: "> Inicializando perfil profesional.",
      cvBtn: 'Descargar CV',
      workBtn: 'Ver Proyectos'
    },
    about: {
      title: "Acerca de",
      titleHighlight: "Mí",
      desc: "Soy estudiante avanzado de Ingeniería en Sistemas de Información, con enfoque en análisis, diseño y desarrollo de software. Trabajo bajo principios de arquitectura en capas, separación de responsabilidades y buenas prácticas, buscando soluciones escalables, mantenibles y orientadas a la calidad.",
      subDesc: "Construyo backends sólidos con .NET, integrando buenas prácticas de seguridad desde el primer commit. Mi objetivo no es solo programar, sino diseñar sistemas que perduren y sean seguros."
    },
    portfolio: {
      title: "Proyectos_",
      p1: {
        tag: "Arquitectura de Sistemas",
        title: "Parking Management System",
        desc: "Sistema integral de gestión vehicular desarrollado en C# y SQL Server. Implementa algoritmos de control de capacidad en tiempo real y lógica transaccional para tickets.",
        linkText: "VER PROYECTO"
      },
      p2: {
        tag: "Arquitectura de Software",
        title: "Gestión Académica N-Capas",
        desc: "Aplicación de escritorio con Arquitectura en Capas (UI, BLL, DAL). Uso de ADO.NET puro para control total de transacciones SQL y alto rendimiento sin ORMs.",
        linkText: "VER CÓDIGO"
      }
    },
    contact: {
      title: "/iniciar_conexión",
      desc: "Esperando solicitud de enlace. Disponible para primera experiencia en IT.",
      btn: "Enviar Correo"
    }
  },
  en: {
    nav: { home: 'Home', about: 'About', portfolio: 'Portfolio', contact: 'Contact' },
    home: {
      status: 'OPEN TO WORK',
      roles: ["Information Systems Engineering Student.", ".NET Core Developer.", "Cybersecurity Enthusiast."],
      desc: "> Initializing professional profile.",
      cvBtn: 'Download CV',
      workBtn: 'View Work'
    },
    about: {
      title: "About",
      titleHighlight: "Me",
      desc: "I am an advanced student of Information Systems Engineering, with a focus on software analysis, design, and development, I work under the principles of layered architecture, separation of responsibilities, and best practices, seeking scalable, maintainable, and quality-oriented solutions.",
      subDesc: "I build solid backends with .NET, integrating security best practices from the first commit. My goal is not just to code, but to design systems that endure and are secure."
    },
    portfolio: {
      title: "Projects_",
      p1: {
        tag: "Systems Architecture",
        title: "Parking Management System",
        desc: "Comprehensive vehicle management system built with C# and SQL Server. Implements real-time capacity control algorithms and transactional logic for tickets.",
        linkText: "VIEW PROJECT"
      },
      p2: {
        tag: "Software Architecture",
        title: "N-Tier Academic Management",
        desc: "Desktop application with Layered Architecture (UI, BLL, DAL). Uses raw ADO.NET for full control of SQL transactions and high performance without ORMs.",
        linkText: "VIEW CODE"
      }
    },
    contact: {
      title: "/init_connection",
      desc: "Waiting for link request. Available for my first IT experience.",
      btn: "Send Email"
    }
  }
};

// --- 2. ICONOS SOCIALES ---
const GithubIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>)
const LinkedinIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>)
const InstagramIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>)

const toolStack = [
  { name: 'C#', src: '/csharp.png' },
  { name: 'SQL Server', src: '/MSSQL.png' },
  { name: 'Power BI', src: '/powerbi.png' },
  { name: 'Enterprise Architect', src: '/EA.png' },
  { name: 'Python', src: '/Python-.png' },
  { name: 'Visual Studio', src: '/visualstudio.png' },
  { name: 'VS Code', src: '/visualcode.png' },
];

// --- 3. LOGICA DE COMPONENTES ---
const TypewriterRotating = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => { setIndex(0); setSubIndex(0); setReverse(false); }, [texts]);
  useEffect(() => { const t = setTimeout(() => setBlink((p) => !p), 500); return () => clearTimeout(t); }, [blink]);
  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) { setTimeout(() => setReverse(true), 2500); return; }
    if (subIndex === 0 && reverse) { setReverse(false); setIndex((p) => (p + 1) % texts.length); return; }
    const t = setTimeout(() => setSubIndex((p) => p + (reverse ? -1 : 1)), reverse ? 30 : 50); return () => clearTimeout(t);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="font-mono text-cyan-400 text-lg md:text-xl h-8 block">
      {`${texts[index].substring(0, subIndex)}`}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} text-white ml-1`}>|</span>
    </span>
  );
};

const TypewriterParagraph = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => { setDisplayedText(""); }, [text]);
  useEffect(() => {
    if (displayedText.length < text.length) {
      const t = setTimeout(() => setDisplayedText(text.slice(0, displayedText.length + 1)), 20); return () => clearTimeout(t);
    }
  }, [displayedText, text]);
  return (<span className="inline-block">{displayedText}<span className="animate-pulse text-cyan-400 font-bold ml-1">_</span></span>);
};

// --- 4. MOTOR 3D ---
const getSpherePositions = (count) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 1.8 + Math.random() * 0.6; 
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
};
const getCubePositions = (count) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 4;
    const y = (Math.random() - 0.5) * 4;
    const z = (Math.random() - 0.5) * 4;
    positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
  }
  return positions;
};
const getHelixPositions = (count) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i * 0.05; const r = 1.8; 
    const x = r * Math.cos(t) + (Math.random() - 0.5) * 0.5;
    const y = (i * 0.008) - 3; 
    const z = r * Math.sin(t) + (Math.random() - 0.5) * 0.5;
    positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
  }
  return positions;
};
const getTorusPositions = (count) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2; const v = Math.random() * Math.PI * 2;
    const R = 3; const r = 0.8;
    positions[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    positions[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
    positions[i * 3 + 2] = r * Math.sin(v);
  }
  return positions;
};

const MorphingParticles = ({ currentShape }) => {
  const ref = useRef();
  const count = 3500; 
  const sphere = useMemo(() => getSpherePositions(count), []);
  const cube = useMemo(() => getCubePositions(count), []);
  const helix = useMemo(() => getHelixPositions(count), []);
  const torus = useMemo(() => getTorusPositions(count), []);
  const currentPositions = useMemo(() => new Float32Array(sphere), [sphere]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    let target = sphere;
    if (currentShape === 'about') target = helix;
    else if (currentShape === 'portfolio') target = cube;
    else if (currentShape === 'contact') target = torus;

    const speed = 0.025; 
    const positions = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count * 3; i++) {
      positions[i] += (target[i] - positions[i]) * speed;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += delta * 0.08;
    ref.current.rotation.x += delta * 0.02;
  });

  return (
    <group>
      <Points ref={ref} positions={currentPositions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#22d3ee" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
      </Points>
    </group>
  );
};

const Scene3D = ({ section }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={['#050505', 5, 15]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#22d3ee" />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <MorphingParticles currentShape={section} />
        </Float>
      </Canvas>
    </div>
  );
};

// --- 5. APP PRINCIPAL ---
function App() {
  const [scrolled, setScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [lang, setLang] = useState('es');

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = ['home', 'about', 'portfolio', 'contact'];
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.4) {
            setCurrentSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-[#050505] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      <Scene3D section={currentSection} />
      <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#050505]/90 border-b border-white/5 py-4' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
          
          <div onClick={() => scrollToSection('home')} className="text-white font-mono font-bold tracking-tight text-sm cursor-pointer hover:opacity-80 transition-opacity z-50">
            MATEO<span className="text-cyan-400">.DEV</span>
          </div>

          <div className="hidden md:flex gap-8 text-[11px] font-medium tracking-[0.15em] text-slate-400 uppercase absolute left-1/2 transform -translate-x-1/2">
            {Object.keys(t.nav).map((key) => (
              <button key={key} onClick={() => scrollToSection(key)} className={`hover:text-white transition-colors relative group ${currentSection === key ? 'text-white' : ''}`}>
                {t.nav[key]}
              </button>
            ))}
          </div>
          
          <div className="flex gap-4 md:gap-6 items-center z-50">
             <div className="flex items-center gap-1 border border-white/10 rounded-sm px-2 py-1 bg-black/40 backdrop-blur-md">
                <button onClick={() => setLang('es')} className={`text-[10px] font-bold ${lang === 'es' ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}>ES</button>
                <span className="text-slate-700 text-[10px]">/</span>
                <button onClick={() => setLang('en')} className={`text-[10px] font-bold ${lang === 'en' ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}>EN</button>
             </div>

             <div className="flex gap-3 md:gap-5 items-center scale-90 md:scale-100">
                <a href="https://github.com/murillo44" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-all transform hover:scale-110"><GithubIcon /></a>
                <a href="https://www.linkedin.com/in/mateo-murillo-/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-all transform hover:scale-110"><LinkedinIcon /></a>
                
             </div>
          </div>
        </div>
      </motion.nav>

      {/* --- HOME --- */}
      <section id="home" className="min-h-screen flex flex-col justify-center px-6 relative z-10 pt-20 pointer-events-none">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pointer-events-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            
            <div className="inline-flex items-center gap-2 mb-6 border border-white/10 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">{t.home.status}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">Mateo Murillo</h1>

            <div className="mb-8 min-h-[30px] flex items-center border-l-2 border-cyan-500/50 pl-4">
              <TypewriterRotating texts={t.home.roles} />
            </div>

            <div className="text-slate-400 leading-relaxed max-w-lg mb-10 text-base font-light font-mono">
              <TypewriterParagraph text={t.home.desc} />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <motion.a href="/cv.pdf" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 bg-white text-black text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-cyan-400 transition-colors inline-block text-center cursor-pointer">
                {t.home.cvBtn}
              </motion.a>
              <motion.button onClick={() => scrollToSection('portfolio')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 border border-white/20 text-slate-300 text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-white/5 transition-colors">
                {t.home.workBtn}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- ABOUT --- */}
      <motion.section id="about" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="min-h-screen flex flex-col justify-center py-20 px-6">
           <div className="max-w-5xl mx-auto text-center mb-16 z-10">
             <h2 className="text-3xl font-bold text-white mb-6">{t.about.title} <span className="text-cyan-400">{t.about.titleHighlight}</span></h2>
             
             <p className="text-slate-400 text-base font-light leading-relaxed max-w-2xl mx-auto mb-20">
               {t.about.desc}<br/><br/>
               <span className="text-white font-medium">{t.about.subDesc}</span>
             </p>

             <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14">
               {toolStack.map((tool) => (
                 <motion.div key={tool.name} whileHover={{ scale: 1.2, y: -5 }} className="flex flex-col items-center justify-center cursor-default">
                   <img src={tool.src} alt={tool.name} className="w-12 h-12 md:w-16 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                 </motion.div>
               ))}
             </div>
           </div>
      </motion.section>

      {/* --- PORTFOLIO --- */}
      <section id="portfolio" className="min-h-screen flex flex-col justify-center py-20 px-6"> 
        <div className="max-w-6xl mx-auto w-full z-10">
           <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-4">
              <h2 className="text-3xl font-bold text-white">{t.portfolio.title}</h2>
              <span className="hidden md:block text-slate-500 font-mono text-xs">v.2026</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div whileHover={{ y: -5 }} onClick={() => window.open('https://github.com/murillo44/parking-management-system')} className="group relative bg-[#0A0A0A]/60 border border-white/10 rounded-sm overflow-hidden hover:border-cyan-500/40 transition-all duration-300 h-[400px] flex flex-col justify-end p-8 cursor-pointer">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-all mix-blend-overlay"></div>
                  <div className="relative z-20">
                    <div className="flex gap-2 mb-4"><span className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase border border-cyan-500/20 px-2 py-1">{t.portfolio.p1.tag}</span></div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{t.portfolio.p1.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-sm">{t.portfolio.p1.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-cyan-500 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      <span>{t.portfolio.p1.linkText}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                  </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} onClick={() => window.open('https://github.com/murillo44/adonet-crud-students')} className="group relative bg-[#0A0A0A]/60 border border-white/10 rounded-sm overflow-hidden hover:border-orange-500/40 transition-all duration-300 h-[400px] flex flex-col justify-end p-8 cursor-pointer">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-all mix-blend-overlay"></div>
                  <div className="relative z-20">
                    <div className="flex gap-2 mb-4"><span className="text-orange-400 text-[10px] font-bold tracking-widest uppercase border border-orange-500/20 px-2 py-1">{t.portfolio.p2.tag}</span></div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{t.portfolio.p2.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-sm">{t.portfolio.p2.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-orange-500 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      <span>{t.portfolio.p2.linkText}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                  </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <footer id="contact" className="min-h-[70vh] flex flex-col justify-center py-20 border-t border-white/5 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{t.contact.title}</h2>
          <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto font-mono">{t.contact.desc}</p>
          <a href="mailto:mateomurillo332@gmail.com" className="inline-block px-10 py-4 bg-white text-black text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-cyan-400 hover:scale-105 transition-all">{t.contact.btn}</a>
          <div className="flex justify-center gap-8 mt-12">
             <a href="https://github.com/murillo44" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-all transform hover:scale-110"><GithubIcon /></a>
             <a href="https://www.linkedin.com/in/mateo-murillo-/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-all transform hover:scale-110"><LinkedinIcon /></a>
             
          </div>
          <div className="mt-20 text-[10px] text-slate-700 font-mono">MATEO MURILLO © 2026. SYSTEM ONLINE.</div>
        </div>
      </footer>
    </div>
  )
}

export default App