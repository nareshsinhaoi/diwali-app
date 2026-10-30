import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { 
  Flame, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Gift, 
  MapPin, 
  Home, 
  Bomb, 
  Trophy, 
  UserCheck, 
  Leaf, 
  RotateCcw, 
  Share2, 
  PartyPopper,
  Zap,
  Info,
  ChevronRight,
  Heart
} from 'lucide-react';

// ==========================================
// FIREBASE INITIALIZATION (SAFE FALLBACKS)
// ==========================================
let app, auth, db, appId;
try {
  const firebaseConfig = typeof __firebase_config !== 'undefined' 
    ? JSON.parse(__firebase_config)
    : {
        apiKey: "demo-key",
        authDomain: "demo.firebaseapp.com",
        projectId: "demo-project",
        storageBucket: "demo.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:demo"
      };
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  appId = typeof __app_id !== 'undefined' ? __app_id : 'diwali-fest-app';
} catch (e) {
  console.warn("Firebase initialization skipped or mocked fallback mode:", e);
}

// ==========================================
// WEB AUDIO API SOUND GENERATOR SYNTHESIZER
// ==========================================
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playDiyaLighting() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playFountainSizzle(duration = 1.2) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // White noise for fountain sizzle
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  playChakriWhistle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, this.ctx.currentTime + 0.8);
    osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
  }

  playRocketLaunch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);

    setTimeout(() => this.playExplosion(), 600);
  }

  playExplosion() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  playLadiChain() {
    if (this.muted) return;
    let count = 0;
    const interval = setInterval(() => {
      this.playPop();
      count++;
      if (count >= 15) clearInterval(interval);
    }, 70);
  }

  playGiftTaDa() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = this.ctx.currentTime + idx * 0.12;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }
}

const audioFX = new SoundEffects();

// ==========================================
// CITIES DATA FOR LIGHT UP INDIA MAP
// ==========================================
const CITIES = [
  { id: 'delhi', name: 'Delhi NCR', x: 42, y: 32, tagline: 'Dilwalon ki Dilli', defaultCount: 1420 },
  { id: 'mumbai', name: 'Mumbai', x: 25, y: 62, tagline: 'Aamchi Mumbai Sparkles', defaultCount: 1980 },
  { id: 'bengaluru', name: 'Bengaluru', x: 38, y: 78, tagline: 'Techies Lighting Diya Code', defaultCount: 1650 },
  { id: 'kolkata', name: 'Kolkata', x: 74, y: 48, tagline: 'City of Joy & Lights', defaultCount: 1120 },
  { id: 'chennai', name: 'Chennai', x: 48, y: 82, tagline: 'Vanakkam & Bright Lights', defaultCount: 890 },
  { id: 'hyderabad', name: 'Hyderabad', x: 42, y: 62, tagline: 'Biryani & Sparkling Lights', defaultCount: 1310 },
  { id: 'ahmedabad', name: 'Ahmedabad', x: 22, y: 48, tagline: 'Garba Beats & Bright Diyas', defaultCount: 970 },
  { id: 'jaipur', name: 'Jaipur', x: 32, y: 38, tagline: 'Pink City Golden Glow', defaultCount: 750 },
  { id: 'pune', name: 'Pune', x: 29, y: 66, tagline: 'Puneri Festive Dhamaka', defaultCount: 840 },
  { id: 'lucknow', name: 'Lucknow', x: 52, y: 36, tagline: 'Muskuraiye Aap Lucknow Me Hain', defaultCount: 920 },
];

// Funny Commentaries & Badges
const DIYA_LEVELS = [
  { count: 0, title: "Unlit Novice 🕯️", desc: "Click diyas below to start your celebration!" },
  { count: 5, title: "Ghee Novice 🧈", desc: "Aisi roshni ki Padosi bhi bolenge 'Suno Ji, Dekho!'" },
  { count: 12, title: "Master Illuminator ✨", desc: "Laxmi Ji just added your house to priority Google Maps!" },
  { count: 25, title: "Brighter Than Your Future! 🌟", desc: "Even NASA satellite zoomed in to check your house glow!" },
  { count: 50, title: "Supreme Diya Emperor 👑🎇", desc: "Your house is visible from Mars! Gold coins incoming!" }
];

const LUCKY_GIFTS = [
  { title: "1,00,00,000 Virtual Soan Papdi Boxes! 🎁", desc: "Congratulations! You can now re-gift these to 500 relatives instantly!" },
  { title: "Laxmi Ji Approved 200% Appraisal! 💰", desc: "Boss won't give it, but Laxmi Ji's blessings are guaranteed!" },
  { title: "Unlimited Gujiya & Kaju Katli Pass! 🥮", desc: "0 Calories, 100% Pure Happiness & Sweetness!" },
  { title: "Zero Green Crackers Pollution Award! 🌿🌍", desc: "You saved 10,000 trees & 500 cute street doggies today!" },
  { title: "Lifetime Exemption from Relatives' 'Marriage When?' Question! 💍", desc: "The ultimate Diwali miracle coupon!" }
];

const FUNNY_QUOTES = [
  "Bura na mano, Diwali hai! 🪔",
  "Soan Papdi circulation is currently at 99.8% nationwide! 📦",
  "No noise, only pure festive joy! 🎆",
  "Eco-friendly Diwali: Planet happy, Doggo happy, You happy! 🐶✨",
  "Roshni itni ki Google Dark Mode off ho jaye! 🕶️"
];

// MAIN COMPONENT
export default function App() {
  // State variables
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'city', 'crackers', 'gift'
  const [user, setUser] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [savedUser, setSavedUser] = useState({ name: '', mobile: '' });

  // Counter States
  const [homeDiyasLit, setHomeDiyasLit] = useState(0);
  const [totalCrackersBurst, setTotalCrackersBurst] = useState(0);
  const [cityDiyas, setCityDiyas] = useState(() => {
    const initial = {};
    CITIES.forEach(c => initial[c.id] = c.defaultCount);
    return initial;
  });

  // Home Diyas matrix (12 diyas on floor/courtyard)
  const [diyaMatrix, setDiyaMatrix] = useState([
    { id: 1, lit: false, color: '#f59e0b' },
    { id: 2, lit: false, color: '#ef4444' },
    { id: 3, lit: false, color: '#ec4899' },
    { id: 4, lit: false, color: '#8b5cf6' },
    { id: 5, lit: false, color: '#10b981' },
    { id: 6, lit: false, color: '#f59e0b' },
    { id: 7, lit: false, color: '#3b82f6' },
    { id: 8, lit: false, color: '#f43f5e' },
    { id: 9, lit: false, color: '#84cc16' },
    { id: 10, lit: false, color: '#a855f7' },
    { id: 11, lit: false, color: '#eab308' },
    { id: 12, lit: false, color: '#06b6d4' },
  ]);

  // Crackers interaction state
  const [activeCracker, setActiveCracker] = useState(null);
  const [crackerCommentary, setCrackerCommentary] = useState("Pick a safe virtual cracker to burst!");

  // Lucky gift scratch card state
  const [isGiftRevealed, setIsGiftRevealed] = useState(false);
  const [wonGift, setWonGift] = useState(null);

  // Canvas ref for fireworks particles
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  // Floating banner joke index
  const [quoteIdx, setQuoteIdx] = useState(0);

  // ==========================================
  // INITIAL LOAD & FIREBASE AUTH & PERSISTENCE
  // ==========================================
  useEffect(() => {
    // Load local storage initial state if available
    const localName = localStorage.getItem('diwali_user_name');
    const localMobile = localStorage.getItem('diwali_user_mobile');
    const localDiyas = parseInt(localStorage.getItem('diwali_home_diyas') || '0', 10);
    const localCrackers = parseInt(localStorage.getItem('diwali_crackers_burst') || '0', 10);

    if (localName) setSavedUser(prev => ({ ...prev, name: localName }));
    if (localMobile) setSavedUser(prev => ({ ...prev, mobile: localMobile }));
    if (localDiyas) setHomeDiyasLit(localDiyas);
    if (localCrackers) setTotalCrackersBurst(localCrackers);

    if (!localName) {
      setShowRegisterModal(true);
    }

    // Firebase initialization with graceful permission handling
    if (auth) {
      const initAuth = async () => {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (e) {
          // Silent fallback to avoid unhandled permission error log spam
        }
      };
      initAuth();

      const unsubscribe = onAuthStateChanged(auth, (usr) => {
        setUser(usr);
      });
      return () => unsubscribe();
    }
  }, []);

  // Sync to Firestore if authenticated with permission error boundary
  useEffect(() => {
    if (!user || !db) return;

    const publicDocRef = doc(db, 'artifacts', appId, 'public', 'diwali_community_stats');

    // Subscribe to live community statistics with safe error handler
    const unsubscribe = onSnapshot(
      publicDocRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.cityDiyas) {
            setCityDiyas(prev => ({ ...prev, ...data.cityDiyas }));
          }
        } else {
          // Initialize public doc safely
          const initCityObj = {};
          CITIES.forEach(c => initCityObj[c.id] = c.defaultCount);
          setDoc(publicDocRef, { cityDiyas: initCityObj, totalDiyas: 12500, totalCrackers: 8900 }).catch(() => {
            // Permission denied fallback silently
          });
        }
      }, 
      (_err) => {
        // Suppress repeated permission error console logs gracefully
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Quote rotation banner interval
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % FUNNY_QUOTES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // FIREWORKS CANVAS ANIMATION ENGINE
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.25)'; // slight trail fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity || 0.04;
        p.alpha -= p.decay || 0.015;
        p.size = Math.max(0, p.size * 0.98);

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Spawn spark particle burst in Canvas
  const createExplosion = (x, y, count = 50, colors = ['#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#10b981', '#facc15']) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particlesRef.current.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.01,
        gravity: 0.06
      });
    }
  };

  // Sparkler trail generator
  const handleSparklerMove = (e) => {
    if (activeCracker !== 'phuljhari') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    audioFX.playFountainSizzle(0.1);
    createExplosion(x, y, 5, ['#fde047', '#f97316', '#ffffff']);
  };

  // ==========================================
  // EVENT HANDLERS & ACTIONS
  // ==========================================

  // Save User Profile
  const handleSaveUser = (e) => {
    if (e) e.preventDefault();
    if (!userName.trim()) return;

    const profile = { name: userName, mobile: userMobile || 'N/A' };
    setSavedUser(profile);
    localStorage.setItem('diwali_user_name', userName);
    localStorage.setItem('diwali_user_mobile', userMobile);
    setShowRegisterModal(false);

    // Save to Firestore private collection safely
    if (user && db) {
      const userRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'info');
      setDoc(userRef, profile, { merge: true }).catch(() => {
        // Fallback silently if rules reject
      });
    }
  };

  // Toggle audio mute
  const handleToggleSound = () => {
    const muted = audioFX.toggleMute();
    setIsMuted(muted);
  };

  // Light Diya at Home
  const handleDiyaClick = (id) => {
    audioFX.playDiyaLighting();

    setDiyaMatrix(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, lit: !d.lit };
      }
      return d;
    }));

    const newLitCount = homeDiyasLit + 1;
    setHomeDiyasLit(newLitCount);
    localStorage.setItem('diwali_home_diyas', newLitCount.toString());

    // Update community count in Firestore with permission error catch
    if (user && db) {
      const publicRef = doc(db, 'artifacts', appId, 'public', 'diwali_community_stats');
      updateDoc(publicRef, {
        totalDiyas: increment(1)
      }).catch(() => {
        // Fallback silently if update permission fails
      });
    }

    // Trigger floating fireworks effect on canvas
    const canvas = canvasRef.current;
    if (canvas) {
      createExplosion(Math.random() * canvas.width, Math.random() * canvas.height * 0.5, 20);
    }
  };

  // Light All Diyas instantly
  const handleLightAllDiyas = () => {
    audioFX.playDiyaLighting();
    setDiyaMatrix(prev => prev.map(d => ({ ...d, lit: true })));
    const added = diyaMatrix.filter(d => !d.lit).length;
    const newCount = homeDiyasLit + (added || 12);
    setHomeDiyasLit(newCount);
    localStorage.setItem('diwali_home_diyas', newCount.toString());
  };

  // Send Virtual Diya to City
  const handleSendCityDiya = (cityId, cityName) => {
    audioFX.playDiyaLighting();

    setCityDiyas(prev => ({
      ...prev,
      [cityId]: (prev[cityId] || 0) + 1
    }));

    // Firestore Sync safely
    if (user && db) {
      const publicRef = doc(db, 'artifacts', appId, 'public', 'diwali_community_stats');
      updateDoc(publicRef, {
        [`cityDiyas.${cityId}`]: increment(1)
      }).catch(() => {
        // Silently handle permission error
      });
    }

    // Sparkle Canvas Effect near city top center
    const canvas = canvasRef.current;
    if (canvas) {
      createExplosion(canvas.width / 2, canvas.height / 3, 35, ['#f59e0b', '#fbbf24', '#ffffff']);
    }
  };

  // Burst Cracker
  const handleBurstCracker = (type) => {
    setActiveCracker(type);
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 500;
    const height = canvas ? canvas.height : 400;

    const newBurstCount = totalCrackersBurst + 1;
    setTotalCrackersBurst(newBurstCount);
    localStorage.setItem('diwali_crackers_burst', newBurstCount.toString());

    // Sync total crackers to Firestore safely
    if (user && db) {
      const publicRef = doc(db, 'artifacts', appId, 'public', 'diwali_community_stats');
      updateDoc(publicRef, {
        totalCrackers: increment(1)
      }).catch(() => {
        // Silently handle permission error
      });
    }

    switch (type) {
      case 'anar':
        audioFX.playFountainSizzle(1.8);
        setCrackerCommentary("✨ Anar fountain shooting high! Safe & 100% Zero Pollution!");
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            createExplosion(width / 2, height * 0.7, 40, ['#f59e0b', '#fbbf24', '#f97316', '#ffffff']);
          }, i * 200);
        }
        break;

      case 'chakri':
        audioFX.playChakriWhistle();
        setCrackerCommentary("🌀 Ghoom ghoom ke sar chakkar aa gaya! Chakri is spinning wildly!");
        let angle = 0;
        const interval = setInterval(() => {
          angle += 0.5;
          const cx = width / 2 + Math.cos(angle) * 40;
          const cy = height / 2 + Math.sin(angle) * 40;
          createExplosion(cx, cy, 15, ['#eab308', '#ec4899', '#3b82f6']);
        }, 100);
        setTimeout(() => clearInterval(interval), 1500);
        break;

      case 'rocket':
        audioFX.playRocketLaunch();
        setCrackerCommentary("🚀 Zooming into outer space! NASA satellite confirmed contact!");
        setTimeout(() => {
          createExplosion(width * 0.5, height * 0.25, 80, ['#ef4444', '#f59e0b', '#8b5cf6', '#10b981', '#ffffff']);
        }, 600);
        break;

      case 'ladi':
        audioFX.playLadiChain();
        setCrackerCommentary("🧨 Rapid Pop-Pop-Pop! 10,000 eco crackers bursting harmlessly!");
        for (let i = 0; i < 15; i++) {
          setTimeout(() => {
            const rx = width * 0.3 + Math.random() * (width * 0.4);
            const ry = height * 0.4 + Math.random() * (height * 0.4);
            createExplosion(rx, ry, 25, ['#ef4444', '#facc15', '#ffffff']);
          }, i * 100);
        }
        break;

      case 'phuljhari':
        audioFX.playFountainSizzle(0.5);
        setCrackerCommentary("✨ Move your finger/mouse on the dark canvas above for magical sparkle trail!");
        createExplosion(width / 2, height / 2, 30, ['#fde047', '#38bdf8', '#f43f5e']);
        break;

      default:
        break;
    }
  };

  // Reveal Lucky Gift
  const handleRevealGift = () => {
    audioFX.playGiftTaDa();
    const randomGift = LUCKY_GIFTS[Math.floor(Math.random() * LUCKY_GIFTS.length)];
    setWonGift(randomGift);
    setIsGiftRevealed(true);

    const canvas = canvasRef.current;
    if (canvas) {
      createExplosion(canvas.width / 2, canvas.height / 3, 100);
    }
  };

  // Calculate current diya level badge
  const currentDiyaBadge = DIYA_LEVELS.slice().reverse().find(lvl => homeDiyasLit >= lvl.count) || DIYA_LEVELS[0];

  // Calculated combined total community count
  const totalCityDiyasCount = Object.values(cityDiyas).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 font-sans relative overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      
      {/* BACKGROUND CANVAS FOR SPARKS & FIREWORKS */}
      <canvas 
        ref={canvasRef}
        onMouseMove={handleSparklerMove}
        onTouchMove={(e) => {
          if (e.touches[0]) handleSparklerMove(e.touches[0]);
        }}
        className="fixed inset-0 w-full h-full pointer-events-auto z-0 opacity-80"
      />

      {/* FESTIVE BACKGROUND DECORATIONS (HANGING TORAN & GRADIENTS) */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/30 via-slate-950 to-slate-950" />
      
      {/* HANGING TORAN / MARIGOLD FLOWER DECORATION */}
      <div className="fixed top-0 inset-x-0 h-8 z-10 flex justify-between items-center px-2 pointer-events-none opacity-90 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className={`w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-amber-500' : 'bg-orange-600'} shadow-sm shadow-orange-400`} />
            <div className="w-0.5 h-3 bg-green-700" />
          </div>
        ))}
      </div>

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-20 flex flex-col min-h-screen">
        
        {/* HEADER SECTION */}
        <header className="text-center my-4 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-semibold tracking-wide shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Eco-Friendly Shubh Deepawali Festival 2026</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 drop-shadow-md">
            Shubh Diwali Dhamaka 🪔✨
          </h1>

          <p className="text-xs sm:text-sm text-amber-200/80 max-w-lg mx-auto font-medium">
            Spread Virtual Light, Burst 0-Pollution Crackers & Win Hilarious Lucky Festive Gifts!
          </p>

          {/* FLOATING BANNER JOKE */}
          <div className="bg-amber-950/40 border border-amber-500/20 rounded-xl py-2 px-4 max-w-md mx-auto text-center text-xs text-amber-300 flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm">
            <Zap className="w-4 h-4 text-yellow-400 shrink-0 animate-bounce" />
            <span className="italic font-medium">{FUNNY_QUOTES[quoteIdx]}</span>
          </div>

          {/* USER WELCOME BAR & AUDIO TOGGLE */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-xl backdrop-blur-md mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-sm shadow">
                {savedUser.name ? savedUser.name.charAt(0).toUpperCase() : '🎆'}
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400">Welcome Bhakt/Guest</p>
                <p className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1">
                  {savedUser.name || 'Anonymous Diwali Guest'}
                  <button 
                    onClick={() => setShowRegisterModal(true)}
                    className="text-[10px] text-amber-400/80 hover:text-amber-300 underline ml-1"
                  >
                    (Edit)
                  </button>
                </p>
              </div>
            </div>

            {/* QUICK STATS IN HEADER */}
            <div className="flex items-center gap-3 text-xs">
              <div className="bg-slate-950/60 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-amber-200 font-bold">{homeDiyasLit} Lit</span>
              </div>
              <div className="bg-slate-950/60 px-3 py-1.5 rounded-xl border border-orange-500/20 flex items-center gap-1.5">
                <Bomb className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-orange-200 font-bold">{totalCrackersBurst} Burst</span>
              </div>
            </div>

            {/* AUDIO SOUND TOGGLE BUTTON */}
            <button
              onClick={handleToggleSound}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isMuted 
                  ? 'bg-rose-950/50 border-rose-800 text-rose-300 hover:bg-rose-900/60' 
                  : 'bg-emerald-950/50 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
              }`}
              title="Toggle Audio Sound Effects"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
            </button>
          </div>
        </header>

        {/* NAVIGATION TAB BAR */}
        <nav className="grid grid-cols-4 gap-1 sm:gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl my-4 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Home Diya</span>
          </button>

          <button
            onClick={() => setActiveTab('city')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'city'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Light India</span>
          </button>

          <button
            onClick={() => setActiveTab('crackers')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'crackers'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/50'
            }`}
          >
            <Bomb className="w-4 h-4 shrink-0" />
            <span>Pataka Zone</span>
          </button>

          <button
            onClick={() => setActiveTab('gift')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 relative ${
              activeTab === 'gift'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/50'
            }`}
          >
            <Gift className="w-4 h-4 shrink-0" />
            <span>Lucky Gift 🎁</span>
            {!isGiftRevealed && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>
        </nav>

        {/* TAB 1: LIGHT A DIYA AT HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* BADGE & LEVEL STATUS CARD */}
            <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Trophy className="w-3.5 h-3.5" /> Current Diya Master Status
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-200">
                    {currentDiyaBadge.title}
                  </h2>
                  <p className="text-xs text-amber-100/70 italic">
                    "{currentDiyaBadge.desc}"
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center px-4 py-2 bg-slate-950/80 rounded-2xl border border-amber-500/30">
                    <div className="text-2xl font-black text-amber-400">{homeDiyasLit}</div>
                    <div className="text-[10px] text-amber-200/60 uppercase tracking-wider font-semibold">Total Diyas Lit</div>
                  </div>

                  <button
                    onClick={handleLightAllDiyas}
                    className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Flame className="w-4 h-4 fill-slate-950" />
                    <span>Light All Instant 🪔</span>
                  </button>
                </div>
              </div>
            </div>

            {/* INTERACTIVE COURTYARD SCENE */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md text-center space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Your House Courtyard (Click Any Diya to Light Up)
                </h3>
                <span className="text-xs text-slate-400">12 Decorative Diyas</span>
              </div>

              {/* DIYAS GRID */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 py-4">
                {diyaMatrix.map((diya) => (
                  <button
                    key={diya.id}
                    onClick={() => handleDiyaClick(diya.id)}
                    className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 active:scale-90 ${
                      diya.lit 
                        ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/20' 
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* FLAME & SPARKLE ANIMATION */}
                    <div className="relative h-12 flex items-end justify-center mb-1">
                      {diya.lit ? (
                        <div className="relative flex flex-col items-center">
                          {/* Outer Glow aura */}
                          <div className="absolute -top-3 w-8 h-8 rounded-full bg-amber-400/30 blur-md animate-ping" />
                          
                          {/* Animated Flickering Flame */}
                          <div className="w-4 h-8 bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-200 rounded-full animate-bounce shadow-lg shadow-amber-500/80 transform origin-bottom" style={{ animationDuration: `${0.4 + (diya.id % 3) * 0.1}s` }} />
                          
                          {/* Smoke/Sparkle particle dot */}
                          <div className="absolute -top-2 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-2 h-4 bg-slate-700 rounded-t-sm" />
                      )}
                    </div>

                    {/* TRADITIONAL EARTHEN CLAY DIYA BASE */}
                    <div className="w-14 h-6 bg-gradient-to-r from-amber-800 via-orange-900 to-amber-900 rounded-b-full border-t border-amber-600/40 shadow-inner flex items-center justify-center">
                      <div className="w-8 h-1 bg-amber-700/50 rounded-full" />
                    </div>

                    <span className="text-[10px] font-medium text-slate-400 mt-2 group-hover:text-amber-300">
                      {diya.lit ? 'Lit Sparkle ✨' : 'Click to Light'}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-amber-200/60 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                💡 <span className="font-semibold text-amber-300">Fun Fact:</span> Lighting virtual diyas burns zero oil, generates 0 smoke, and makes Laxmi Ji super happy!
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: LIGHT UP THE CITY (INDIA MAP) */}
        {activeTab === 'city' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    Light Up India Metro Cities 🇮🇳
                  </h2>
                  <p className="text-xs text-slate-400">
                    Send virtual diyas to major metro cities & view total community illumination!
                  </p>
                </div>

                <div className="bg-amber-950/60 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs text-amber-200 font-bold">
                  Community Diyas: {totalCityDiyasCount.toLocaleString()} 🪔
                </div>
              </div>

              {/* SIMULATED METRO CITIES MAP GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {CITIES.map((city) => {
                  const count = cityDiyas[city.id] || city.defaultCount;
                  return (
                    <div
                      key={city.id}
                      className="bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all hover:bg-slate-900/90 flex flex-col justify-between space-y-3 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                            {city.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 italic">{city.tagline}</p>
                        </div>

                        <div className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs px-2.5 py-1 rounded-lg font-bold">
                          {count.toLocaleString()} 🪔
                        </div>
                      </div>

                      <button
                        onClick={() => handleSendCityDiya(city.id, city.name)}
                        className="w-full py-2 bg-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-slate-950 text-amber-300 border border-slate-700 hover:border-transparent rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Send Diya to {city.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VIRTUAL CRACKERS PATAKA ZONE */}
        {activeTab === 'crackers' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-orange-400 flex items-center gap-2">
                    <Bomb className="w-5 h-5 text-amber-400" />
                    Safe & Hilarious Virtual Pataka Zone 🎆
                  </h2>
                  <p className="text-xs text-slate-400">
                    Burst 100% eco-friendly virtual crackers with funny sound synthesis!
                  </p>
                </div>

                <div className="bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>AQI Saved: 100% Clean Air 🌍</span>
                </div>
              </div>

              {/* CRACKER COMMENTARY BANNER */}
              <div className="bg-gradient-to-r from-orange-950/40 via-slate-950 to-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-center">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                  Live Fireworks Announcer 🎙️
                </span>
                <p className="text-sm font-bold text-amber-100 italic">
                  "{crackerCommentary}"
                </p>
              </div>

              {/* CRACKERS SELECTION MENU */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                
                {/* 1. ANAR FOUNTAIN */}
                <button
                  onClick={() => handleBurstCracker('anar')}
                  className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center justify-between text-center space-y-2 group transition-all active:scale-95"
                >
                  <div className="text-3xl group-hover:scale-125 transition-transform">🌋</div>
                  <div>
                    <h3 className="text-xs font-bold text-amber-300">Anar Fountain</h3>
                    <p className="text-[10px] text-slate-400">Sparkling Golden Shower</p>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">Burst! 🎇</span>
                </button>

                {/* 2. CHAKRI */}
                <button
                  onClick={() => handleBurstCracker('chakri')}
                  className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center justify-between text-center space-y-2 group transition-all active:scale-95"
                >
                  <div className="text-3xl group-hover:rotate-180 transition-transform duration-500">🌀</div>
                  <div>
                    <h3 className="text-xs font-bold text-amber-300">Ground Chakri</h3>
                    <p className="text-[10px] text-slate-400">Dizzy Spinning Light</p>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">Spin! 🌀</span>
                </button>

                {/* 3. SKY ROCKET */}
                <button
                  onClick={() => handleBurstCracker('rocket')}
                  className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center justify-between text-center space-y-2 group transition-all active:scale-95"
                >
                  <div className="text-3xl group-hover:-translate-y-2 transition-transform">🚀</div>
                  <div>
                    <h3 className="text-xs font-bold text-amber-300">Sky Rocket</h3>
                    <p className="text-[10px] text-slate-400">NASA Satellite Burst</p>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">Launch! 🚀</span>
                </button>

                {/* 4. LADI CHAIN */}
                <button
                  onClick={() => handleBurstCracker('ladi')}
                  className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center justify-between text-center space-y-2 group transition-all active:scale-95"
                >
                  <div className="text-3xl group-hover:scale-110 transition-transform">🧨</div>
                  <div>
                    <h3 className="text-xs font-bold text-amber-300">10,000 Ladi</h3>
                    <p className="text-[10px] text-slate-400">Non-stop Pop Chain</p>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">Pop! 💥</span>
                </button>

                {/* 5. PHULJHARI SPARKLER */}
                <button
                  onClick={() => handleBurstCracker('phuljhari')}
                  className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center justify-between text-center space-y-2 group transition-all active:scale-95 col-span-2 sm:col-span-1"
                >
                  <div className="text-3xl group-hover:animate-pulse">✨</div>
                  <div>
                    <h3 className="text-xs font-bold text-amber-300">Magic Sparkler</h3>
                    <p className="text-[10px] text-slate-400">Touch/Mouse Trail</p>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">Sparkle! ✨</span>
                </button>

              </div>

              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Total Crackers Burst by You: <strong className="text-amber-300">{totalCrackersBurst}</strong></span>
                <span className="text-[11px] text-emerald-400">Zero Burn Injury Guaranteed! 👍</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LUCKY GIFT SURPRISE */}
        {activeTab === 'gift' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center max-w-xl mx-auto space-y-6">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold">
                <Gift className="w-4 h-4 text-orange-400" />
                <span>Grand Diwali Festive Surprise</span>
              </div>

              {!isGiftRevealed ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-amber-200">
                      Claim Your Diwali Lucky Gift Box! 🎁
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Tap the surprise Diwali box below to scratch & reveal your special fortune!
                    </p>
                  </div>

                  {/* UNOPENED GIFT BOX BUTTON */}
                  <div className="py-6">
                    <button
                      onClick={handleRevealGift}
                      className="group relative inline-flex flex-col items-center justify-center p-8 bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 rounded-3xl shadow-2xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <Gift className="w-20 h-20 text-slate-950 animate-bounce" />
                      <span className="mt-4 px-4 py-2 bg-slate-950 text-amber-300 text-xs font-black rounded-xl border border-amber-400/40 shadow">
                        TAP TO UNBOX LUCKY GIFT 🎉
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                /* REVEALED GIFT SCREEN */
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-6 bg-gradient-to-br from-amber-950/60 via-slate-900 to-amber-950/80 border-2 border-amber-400 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
                    <PartyPopper className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                    
                    <span className="inline-block text-xs font-bold text-amber-400 tracking-widest uppercase">
                      Official Diwali Certificate 🏆
                    </span>

                    <h2 className="text-xl sm:text-2xl font-black text-amber-300">
                      {wonGift?.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-amber-100/80 italic bg-slate-950/60 p-4 rounded-xl border border-amber-500/20">
                      "{wonGift?.desc}"
                    </p>

                    <p className="text-[11px] text-amber-400/70 font-semibold pt-2">
                      Congratulations! You are eligible for a Lucky Diwali Gift! 🎁
                    </p>
                  </div>

                  <button
                    onClick={() => setIsGiftRevealed(false)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Another Lucky Box 🎁</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* LIVE CELEBRATION COUNTER DASHBOARD */}
        <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Total Community Diyas Lit</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              {(totalCityDiyasCount + homeDiyasLit).toLocaleString()} 🪔
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Eco Crackers Burst</div>
            <div className="text-xl sm:text-2xl font-black text-orange-400 mt-1">
              {totalCrackersBurst.toLocaleString()} 🎆
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Carbon Footprint</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              0.00% Zero 🌍
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-center py-6 text-xs text-slate-500 space-y-1 mt-auto">
          <p>Wishing You & Your Family A Very Happy, Safe & Prosperous Diwali! 🪔✨</p>
          <p className="text-[10px] text-slate-600">Created with Love & Festive Joy • Zero Real Firecrackers Used</p>
        </footer>

      </div>

      {/* USER REGISTRATION MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-fadeIn">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-orange-500/20">
                🪔
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200">
                Welcome to Diwali Fest!
              </h2>
              <p className="text-xs text-slate-300 italic">
                "Enter details so Laxmi Ji knows where to send gold coins!" 💰✨
              </p>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Your Full Name / Nickname
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-amber-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={userMobile}
                  onChange={(e) => setUserMobile(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-amber-100 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-95"
              >
                Start Celebration & Light Diyas 🪔
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}