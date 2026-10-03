let AC: any = null;
export function sfx(kind: string) {
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
    }
    g.gain.setValueAtTime(peak, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.start(t0); o.stop(t0 + dur + 0.02);
  } catch (e) {}
}
