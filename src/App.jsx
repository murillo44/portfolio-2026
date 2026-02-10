import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

// --- COMPONENTE 1: TIPEADO ROTATIVO (Frase Completa) ---
const TypewriterRotating = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Parpadeo del cursor
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  // Lógica de tipeo y borrado
  useEffect(() => {
    // Si terminó de escribir la frase completa
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2500); // Espera un poco más para que se lea bien
      return;
    }

    // Si terminó de borrar todo
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    // Velocidad de tipeo
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1)); // Borra de a uno, escribe de a uno
    }, reverse ? 30 : 50); // Borra rápido (30ms), escribe normal (50ms)

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="font-mono text-cyan-400 text-xl md:text-2xl h-8 block">
      {`${texts[index].substring(0, subIndex)}`}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} text-white ml-1`}>|</span>
    </span>
  );
};

// --- COMPONENTE 2: TIPEADO DE PÁRRAFO (Cursor persistente) ---
const TypewriterParagraph = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [blink, setBlink] = useState(true);

  // Parpadeo del cursor (siempre activo)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Inicio retrasado
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, 1500); // Empieza después que el título
    return () => clearTimeout(startTimeout);
  }, []);

  // Lógica de escritura
  useEffect(() => {
    if (!started) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 20); // Velocidad rápida para que no aburra
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, started]);

  return (
    <span className="inline-block">
      {displayedText}
      {/* El cursor SIEMPRE está ahí, parpadeando al final */}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} text-cyan-400 font-bold ml-1`}>|</span>
    </span>
  );
};

// --- COMPONENTE 3: LLUVIA DE CÓDIGO (MATRIX RAIN) - GLOBAL ---
const MatrixRain = () => {
  const streams = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => { // Un poco más de lluvia
      const len = Math.floor(Math.random() * 20) + 10;
      let content = "";
      const chars = "10AFZNPQR79X"; 
      for (let j = 0; j < len; j++) {
        content += chars[Math.floor(Math.random() * chars.length)] + "\n";
      }
      return {
        id: i,
        x: Math.random() * 100, 
        delay: Math.random() * -10, 
        duration: Math.random() * 10 + 10, 
        fontSize: Math.random() * 12 + 10, 
        content: content
      };
    });
  }, []);

  return (
    <div className="fixed top-0 right-0 w-full h-full pointer-events-none select-none overflow-hidden z-0">
      <div 
        className="absolute inset-0 z-10"
        style={{
           background: 'linear-gradient(to right, #030303 30%, transparent 100%)' 
        }}
      ></div>
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          initial={{ y: -1000 }}
          animate={{ y: "110vh" }}
          transition={{
            duration: stream.duration,
            repeat: Infinity,
            delay: stream.delay,
            ease: "linear",
          }}
          style={{ left: `${stream.x}%`, fontSize: `${stream.fontSize}px` }}
          className="absolute top-0 text-cyan-500/30 whitespace-pre text-center leading-none flex flex-col"
        >
            {stream.content.split('\n').map((char, idx) => (
                <span key={idx} className={Math.random() > 0.95 ? 'text-white/70 text-shadow-cyan' : ''}>{char}</span>
            ))}
        </motion.div>
      ))}
    </div>
  );
};


function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-[#030303] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* FONDO GLOBAL FIJO */}
      <MatrixRain />

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#030303]/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6 md:py-8'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
          
          <div onClick={() => scrollToSection('home')} className="text-white font-bold tracking-tight text-lg cursor-pointer z-20 hover:opacity-80 transition-opacity">
            Mateo<span className="text-cyan-400">.M</span>
          </div>
          
          {/* Menú Centrado */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex gap-10 text-[12px] font-medium tracking-widest text-slate-400 uppercase">
            {['Home', 'About', 'Portfolio', 'Contact'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase())} 
                className="hover:text-white transition-colors relative group py-1"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Redes Sociales */}
          <div className="hidden md:flex gap-6 items-center z-20">
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
        </div>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="min-h-screen flex flex-col justify-center px-6 relative z-10 pt-10">
        
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-20"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/10 bg-white/5 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Open to work</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[0.95]">
              MATEO <br/>
              MURILLO.
            </motion.h1>

            {/* Efecto tipeado rotativo (Incluye "I am a...") */}
            <motion.div variants={itemVariants} className="mb-8 min-h-[40px] flex items-center">
              <TypewriterRotating texts={[
                "I am a Systems Engineering Student.", 
                "I am a .NET Developer.", 
                "I am a Cybersecurity Enthusiast."
              ]} />
            </motion.div>

            {/* Efecto tipeado estático para el párrafo completo */}
            <motion.div variants={itemVariants} className="text-slate-400 leading-relaxed max-w-lg mb-10 text-base md:text-lg bg-[#030303]/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-2 md:p-0 rounded min-h-[80px]">
              <TypewriterParagraph 
                text="Estudiante de 4to año de Ingeniería en Sistemas. Fusiono el desarrollo backend robusto con la seguridad de redes." 
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <motion.button 
              onClick={() => window.open('/cv.pdf', '_blank')} // <--- Asegurate que tenga la /
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-black text-xs font-bold tracking-widest uppercase rounded hover:bg-cyan-50 transition-colors"
>
              Download CV
              </motion.button>  
              <motion.button 
                onClick={() => scrollToSection('portfolio')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border border-white/20 text-white text-xs font-bold tracking-widest uppercase rounded hover:bg-white/10 transition-colors backdrop-blur-sm bg-black/30"
              >
                View Projects
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Columna derecha libre */}
          <div></div>
          
        </div>
      </section>

      {/* --- SECCIONES SIGUIENTES --- */}
      
      {/* ABOUT */}
      <motion.section id="about" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="min-h-screen flex flex-col justify-center border-t border-white/5 px-6 relative z-10">
           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
             <div className="md:col-span-2"><motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold text-white leading-tight">Mi Enfoque <br/><span className="text-cyan-400">Técnico.</span></motion.h2></div>
             <div className="md:col-span-3 space-y-8"><motion.div variants={itemVariants} className="text-slate-400 leading-relaxed text-lg md:text-xl space-y-6 font-light bg-[#030303]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5"><p>Mi formación universitaria me da la estructura lógica, y mi curiosidad autodidacta me mantiene al día con tecnologías como <strong>.NET 8</strong> y protocolos de seguridad modernos.</p><p>Me especializo en construir soluciones robustas con <strong>.NET y SQL Server</strong>, aplicando principios de seguridad de redes <strong>(Cisco)</strong> para garantizar infraestructuras resilientes.</p></motion.div></div>
           </div>
      </motion.section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="min-h-screen flex flex-col justify-center py-20 border-t border-white/5 px-6 relative z-10"> 
        <div className="max-w-6xl mx-auto w-full">
           <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-16 border-b border-white/5 pb-4">Selected Projects</motion.h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div whileHover={{ y: -5 }} className="group bg-[#0A0A0A]/90 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:border-cyan-900/30 transition-all duration-500">
                  <div className="flex justify-between items-start mb-8"><div className="p-3 bg-white/5 rounded-xl"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg" className="w-8 h-8" /></div><span className="text-[10px] font-bold tracking-widest text-slate-500 border border-white/10 px-3 py-1 rounded-full">2025</span></div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Sistema de Gestión Integral</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">Backend robusto desarrollado en .NET Core. Implementa arquitectura en capas, Entity Framework y optimización de bases de datos SQL Server.</p>
                  <div className="flex gap-3 text-[10px] text-cyan-400 font-bold tracking-wider uppercase"><span>.NET Core</span><span>•</span><span>SQL Server</span></div>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="group bg-[#0A0A0A]/90 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:border-cyan-900/30 transition-all duration-500">
                  <div className="flex justify-between items-start mb-8"><div className="p-3 bg-white/5 rounded-xl"><img src="/cisco.png" className="w-8 h-8 object-contain invert" /></div><span className="text-[10px] font-bold tracking-widest text-slate-500 border border-white/10 px-3 py-1 rounded-full">ACADEMIC</span></div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Defensa de Red Crítica</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">Simulación de infraestructura segura. Configuración de routing OSPF, ACLs para segmentación y hardening de dispositivos.</p>
                  <div className="flex gap-3 text-[10px] text-cyan-400 font-bold tracking-wider uppercase"><span>CyberOps</span><span>•</span><span>Packet Tracer</span></div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="min-h-[60vh] flex flex-col justify-center border-t border-white/5 bg-[#080808] relative z-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Conectamos?</h2>
          <p className="text-slate-400 mb-10">Estoy buscando activamente oportunidades para comenzar mi carrera profesional.</    p>
          <a href="mailto:tuemail@gmail.com" className="inline-block px-10 py-4 bg-white text-black font-bold tracking-widest uppercase rounded hover:bg-cyan-400 hover:scale-105 transition-all">Enviar Email</a>
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-600"><span>BUENOS AIRES, ARGENTINA</span><span>© 2026 MATEO MURILLO</span></div>
        </motion.div>
      </footer>
    </div>
  )
}

export default App