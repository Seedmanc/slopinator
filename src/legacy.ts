declare const Phaser: any;

const W = 960, H = 640;
const TAU = Math.PI * 2;

enum Theme { ANIME = 0, REALISTIC = 1, GENERAL = 2 }

interface ThemeInfo { name: string; icon: string; color: number; hex: string; }
const THEMES: ThemeInfo[] = [
  { name: 'ANIME',     icon: '🎌', color: 0xff5fa2, hex: '#ff5fa2' },
  { name: 'REALISTIC', icon: '📷', color: 0x4fc3f7, hex: '#4fc3f7' },
  { name: 'GENERAL',   icon: '🌐', color: 0xffd54f, hex: '#ffd54f' },
];
const AMMO_NAMES = ['ANIME', 'REALISTIC', 'GENERAL', 'LoRA'];

const SITE_NAMES: string[][] = [
  ['sakurapix.art', 'weeblagoon.net', 'moeboard.io'],
  ['photorealm.com', 'realstock.io', 'lensdump.net'],
  ['clipdump.org', 'feedfire.net', 'pixscroll.com'],
];

const SLOT_POS: { x: number; y: number }[] = [];
{
  const xs = [8, 36, 64], ys = [20, 48];
  for (const yy of ys) for (const xx of xs) SLOT_POS.push({ x: xx - 48, y: yy - 38 });
}
const PALETTE = [0xff5fa2, 0x4fc3f7, 0xffd54f, 0x9b6bff, 0x5fffb0, 0xff9f43];

function normAng(a: number): number { a = a % TAU; if (a < 0) a += TAU; return a; }
function angDist(a: number, b: number): number { let d = normAng(b - a); if (d > Math.PI) d = TAU - d; return d; }

/* ---------------- SFX (tiny webaudio synth) ---------------- */
let AC: any = null;
function sfx(kind: string) {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    AC = AC || new Ctx();
    if (AC.state === 'suspended') AC.resume();
    const t0 = AC.currentTime;
    const o = AC.createOscillator(), g = AC.createGain();
    o.connect(g); g.connect(AC.destination);
    let dur = 0.1, peak = 0.05;
    switch (kind) {
      case 'shoot':   o.type='square';   o.frequency.setValueAtTime(760,t0); o.frequency.exponentialRampToValueAtTime(380,t0+0.06); dur=0.06; peak=0.025; break;
      case 'hit':     o.type='triangle'; o.frequency.setValueAtTime(240,t0); o.frequency.exponentialRampToValueAtTime(120,t0+0.08); dur=0.09; break;
      case 'clank':   o.type='square';   o.frequency.setValueAtTime(140,t0); dur=0.05; peak=0.045; break;
      case 'like':    o.type='sine';     o.frequency.setValueAtTime(660,t0); o.frequency.exponentialRampToValueAtTime(1180,t0+0.1); dur=0.12; break;
      case 'hurt':    o.type='sawtooth'; o.frequency.setValueAtTime(180,t0); o.frequency.exponentialRampToValueAtTime(70,t0+0.18); dur=0.2; peak=0.06; break;
      case 'boom':    o.type='sawtooth'; o.frequency.setValueAtTime(120,t0); o.frequency.exponentialRampToValueAtTime(30,t0+0.4); dur=0.45; peak=0.09; break;
      case 'cash':    o.type='sine';     o.frequency.setValueAtTime(980,t0); o.frequency.setValueAtTime(1320,t0+0.07); dur=0.14; peak=0.04; break;
      case 'captcha': o.type='square';   o.frequency.setValueAtTime(520,t0); o.frequency.setValueAtTime(392,t0+0.12); dur=0.25; break;
      case 'lock':    o.type='sine';     o.frequency.setValueAtTime(523,t0); o.frequency.setValueAtTime(659,t0+0.08); o.frequency.setValueAtTime(784,t0+0.16); dur=0.28; peak=0.06; break;
      case 'train':   o.type='sine';     o.frequency.setValueAtTime(220,t0); o.frequency.exponentialRampToValueAtTime(880,t0+0.5); dur=0.55; break;
    }
    g.gain.setValueAtTime(peak, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.start(t0); o.stop(t0 + dur + 0.02);
  } catch (e) {}
}

/* ---------------- textures (all procedural) ---------------- */
function makeTextures(sc: any) {
  const g = sc.add.graphics();
  // player rig
  g.clear();
  g.fillStyle(0x232a3d, 1); g.fillRoundedRect(4, 6, 32, 28, 6);
  g.fillStyle(0x3fd0ff, 1); g.fillRect(8, 10, 10, 6);
  g.fillStyle(0xffd54f, 1); g.fillCircle(30, 14, 3);
  g.fillStyle(0x141926, 1); g.fillRoundedRect(10, 26, 8, 8, 2); g.fillRoundedRect(22, 26, 8, 8, 2);
  g.lineStyle(2, 0x3fd0ff, 0.8); g.strokeRoundedRect(4, 6, 32, 28, 6);
  g.generateTexture('player', 40, 40);
  // barrel
  g.clear(); g.fillStyle(0x9fb4d8, 1); g.fillRect(0, 2, 26, 6); g.fillStyle(0x3fd0ff, 1); g.fillRect(22, 1, 8, 8);
  g.generateTexture('barrel', 30, 10);
  // ammo bullets
  g.clear(); g.fillStyle(0xff5fa2,1); g.fillCircle(9,9,7); g.fillStyle(0xffffff,0.9); g.fillCircle(9,9,3); g.generateTexture('b0',18,18);
  g.clear(); g.fillStyle(0x0d1322,1); g.fillRect(1,1,14,14); g.fillStyle(0x4fc3f7,1); g.fillRect(3,3,10,10); g.fillStyle(0xffffff,1); g.fillCircle(6,6,2); g.generateTexture('b1',16,16);
  g.clear(); g.fillStyle(0xffd54f,1); g.fillCircle(8,8,6); g.lineStyle(1,0x7a5f10,1); g.strokeCircle(8,8,6); g.generateTexture('b2',16,16);
  g.clear(); g.fillStyle(0xc77dff,0.35); g.fillCircle(11,11,10); g.fillStyle(0xc77dff,1); g.fillCircle(11,11,6); g.fillStyle(0xffffff,0.9); g.fillCircle(11,11,2.5); g.generateTexture('b3',22,22);
  // generic enemy bullet
  g.clear(); g.fillStyle(0xff4d4d,1); g.fillCircle(7,7,6); g.lineStyle(1,0x661111,1); g.strokeCircle(7,7,6); g.generateTexture('eb',14,14);
  // boss bullet
  g.clear(); g.fillStyle(0xff7b3d,1); g.fillCircle(8,8,7); g.fillStyle(0x3d1505,1); g.fillCircle(8,8,3); g.generateTexture('bossb',16,16);
  // spark
  g.clear(); g.fillStyle(0xffffff,1); g.fillCircle(4,4,4); g.generateTexture('spark',8,8);
  // fans
  g.clear(); g.fillStyle(0xffffff,1); g.fillCircle(8,8,8); g.generateTexture('fan',16,16);
}

/* ---------------- small helpers / rng ---------------- */
function randRange(min: number, max: number) { return min + Math.random() * (max - min); }

/* ---------------- Site class ---------------- */
class Site {
  game: any; theme: Theme; x: number; y: number; hasShield: boolean; alive = true; done = false;
  bodyR = 36; shieldR = 56; shieldRot = 0; gaps: number[] = []; gapHalf = 0.6; alertness = 0; fill = 0; shieldOpen = 0;
  constructor(g: any, theme: Theme, x: number, y: number, hasShield: boolean) {
    this.game = g; this.theme = theme; this.x = x; this.y = y; this.hasShield = hasShield;
    this.g = g.add.graphics().setDepth(2);
  }
  g: any;
  update(dt: number) {
    if (!this.alive) return;
    if (this.hasShield) {
      this.shieldRot += dt * 0.0013;
      // slowly shrink open gaps when not attacked
      if (this.alertness <= 0) this.gaps = this.gaps.map(a => a * 0.98);
    }
    // fill logic
    if (this.fill >= 100) { this.fill = 100; this.alive = false; this.done = true; }
    this.draw();
  }
  draw() {
    const g = this.g; g.clear();
    // body
    g.fillStyle(0x0f1a2a, 1); g.fillCircle(this.x, this.y, this.bodyR);
    g.lineStyle(3, 0x2f587d, 1); g.strokeCircle(this.x, this.y, this.bodyR + 4);
    // progress arc
    const a = Math.PI * 2 * (this.fill / 100);
    if (this.fill > 0) { g.lineStyle(4, 0x5fffb0, 1); g.beginPath(); g.arc(this.x, this.y, this.bodyR + 8, -Math.PI/2, -Math.PI/2 + a); g.strokePath(); }
    // shield
    if (this.hasShield) {
      g.lineStyle(2, 0x9fb4d8, 0.6);
      g.strokeCircle(this.x, this.y, this.shieldR);
      // draw gaps
      for (const gp of this.gaps) {
        g.lineStyle(6, 0xffd54f, 1);
        const ang = gp + this.shieldRot;
        g.beginPath(); g.arc(this.x, this.y, this.shieldR, ang - this.gapHalf, ang + this.gapHalf); g.strokePath();
      }
    }
    // small icon
    g.fillStyle(THEMES[this.theme].color, 1); g.fillCircle(this.x - 8, this.y - 8, 6);
  }
  applyHit(ammo: number) {
    if (!this.alive) return;
    if (this.hasShield) {
      // check gaps
      const la = normAng(Math.atan2(this.game.py - this.y, this.game.px - this.x) - this.shieldRot);
      let inGap = false;
      for (const gp of this.gaps) { if (angDist(gp, la) < this.gapHalf) { inGap = true; break; } }
      if (!inGap) { this.game.popup(this.x, this.y, 'SHIELD BLOCKED', '#ff7b7b'); sfx('clank'); return; }
    }
    // match logic
    if (ammo === 3) { this.fill += 6 + Math.random() * 8; this.game.popup(this.x, this.y, 'LoRA SAMPLE +', '#c77dff'); return; }
    if (ammo === this.theme) { this.fill += 12 + Math.random() * 8; this.game.popup(this.x, this.y, '+MATCH', '#9be8ff'); sfx('like'); }
    else { this.fill += 4 + Math.random() * 6; this.game.popup(this.x, this.y, 'MISMATCH', '#ff9f9f'); sfx('hurt'); }
    if (this.fill >= 100) { this.fill = 100; this.alive = false; this.game.popup(this.x, this.y, 'SITE CONVERTED', '#7cfc9e'); sfx('cash'); }
  }
}

/* ---------------- MenuScene ---------------- */
class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'Menu' }); }
  create() {
    const txt = this.add.text(W/2, H*0.42, 'OVERSATURATE', { fontFamily: 'monospace', fontSize: '36px', color: '#ffd54f' }).setOrigin(0.5).setStroke('#000', 6);
    const btn = this.add.text(W/2, H*0.6, 'PLAY', { fontFamily: 'monospace', fontSize: '20px', color: '#bfeaff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.start('Game'));
  }
}

/* ---------------- GameScene (large) ---------------- */
class GameScene extends Phaser.Scene {
  // many fields
  constructor() { super({ key: 'Game' }); }
  preload() {}
  create() {
    // minimal initialization: generate textures and UI
    makeTextures(this);
    this.px = W/2; this.py = H - 80; this.pSpr = null as any; this.barrel = null as any;
    this.buildHUD(); this.buildInput(); this.spawnSites();
    this.toast('FLOOD EVERY SITE TO 100%');
  }
  // placeholder methods to keep compile
  buildHUD() { }
  buildInput() { }
  spawnSites() { }
  toast(msg: string) { console.log(msg); }
}

export function startLegacy() {
  const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: W,
    height: H,
    backgroundColor: '#070a14',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [MenuScene, GameScene]
  };
  new Phaser.Game(config);
}
