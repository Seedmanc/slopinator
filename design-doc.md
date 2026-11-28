# [Working Title] — The Slopinator.
### Design Document v0.3

---

## 1. Concept

A top-down, satirical roguelite shooter, Space Invaders-type. The player controls a robot/AI image-generation program (styled after tools like Forge). The "world" is a stylized map of the internet; targets are websites representing social platforms (X, Facebook, anime boorus, etc).
The player's goal is to saturate sites with AI-generated images until they're overwhelmed, while managing incoming backlash and choosing the right generative model (ammo) for each target.

**Core fantasy:** you're an AI image bot flooding the internet, and the internet fights back.

---

## 2. Genre & Structure

- Top-down twin-stick-style shooter
- Roguelite: runs end via death or a deliberate extraction decision; upgrades persist  between runs (genre TBD, maybe not roguelite)
- Multiple targets live simultaneously

---

## 3. Core Loop

1. Player at the bottom of screen, at the top there are several live "website platform" targets at once. Player's HP is named "Ego".
2. Each site requires a matching ammo/model type to saturate efficiently; wrong type  = slow/no progress + a retaliation "dislike" burst, filling alertness meter. Completing  alertness spawns moderation shield around site, resetting alertness.
3. Sites shoot back — bad reactions to dodge, good reactions (e.g. "likes") to  collect as a resource (healing, when hp=100% extra likes convert to XP), incentivizing risk.
4. Some sites are shielded by a rotating defense ring with gaps (representing  moderation team shifts) — the player must aim through the gaps, forcing movement  and timing rather than static fire. Hitting the shield raises alertness again, at 100% it launches a homing captcha projectile at the player forcing it to solve it, wasting time and locking controls. Failing captcha 3 times bans you from that website, rendering it invulnerable to further attacks.
5. A global "AI acceptance/outrage" meter rises as sites are saturated. Crossing a threshold unlocks a capstone boss encounter.
6. (undecided) At any point past a certain threshold, the player can **extract** (bank progress and  end the run safely) or **push toward the boss** for a much larger payout at real risk.
7. Between runs: spend earned currencies on persistent upgrades; configure a pre-run loadout within a shared resource budget (webui-themed settings like batch size, overclocking, etc. that cost VRAM and PSU wattage).
8. Two resources, money and XP, first is spent on hardware upgrades like getting a better GPU, second on software and skills like installing flash attention. Need to decide how each is earned (reward good aiming and proper model choices with XP, reward what with money, boss fights maybe or general accuracy). Maybe make money only earnable by beating bosses.

---

## 4. Core Mechanics

### 4.1 Ammo / Model Matching
- Ammo types represent image-generation models (e.g. Realistic, Anime, Base model).
- Each platform is more vulnerable to one type; correct ammo saturates fast, wrong  ammo saturates none and triggers negative reaction, raising alertness. Base does a bit of both as a middle ground.
- Switching ammo types has a time cost (cooldown), so switching is a real decision, not  a free reflex — this cost is the central tension of the moment-to-moment loop. Upgrade from HDD to SSD to speed up switching. When still on HDD, make movement jerky and stuttering during switching, representing HDD stutters on Windows.
- Can choose batch size from 1 to 4, representing the amount of shots fired simultaneously. Larger batch size reduces fire rate but overall DPS increases given the amount of projectiles. Poorly aimed potshots are risky. Max batch should be limited by VRAM resource.

### 4.2 Site / Targets
- Multiple sites live on the map simultaneously — pressure comes from triage (dividing attention across several sources).
- Rotating shields with gaps on some sites, representing moderation coverage, forcing repositioning to land shots.
- Saturating a target removes it (with a reward burst) rather than ending the run —  the run continues fluidly into the next wave until the global meter meets threshold.
- (undecided) Over time, more sites spawn/escalate (the content "goes viral"), acting as the run's natural difficulty/pressure ramp? Need to think of alternatives.
- if not enough global outrage is achieved with current wave (poor performance of player/bans), another is spawned until there is enoughm increasing overall run time and decreasing speed rewards

### 4.3 Reactions & Enemies
- Bad reactions: projectiles from sites, must be dodged, damage player's ego. Fly in a ballistic trajectory aiming at player.
- Good reactions ("likes"): a collectible resource that spawns in reaction to properly chosen model shots, heal player, gain score. Fly in random directions towards the bottom, requiring active collecting.
- Hitting the moderation shield too often makes it send a homing "captcha" projectile that upon hitting the player forces it to solve a minigame, wasting time. Repeated fails at solving "bans" the player from attacking that website, reducing maximum total score. Maybe add unlockable countermeasures to be launched to avoid captcha projectile (reference the meme "i'm behind 7 proxies")

### (undecided) 4.4 Run Ending — Escalation & Extraction
- A global meter tracks cumulative spread/outrage across the map.
- Crossing a threshold unlocks the capstone boss or extraction choice.
- Player chooses: extract now (bank current run rewards safely) or push into the boss  (bigger reward, real risk of losing the run's earnings on death). 

---

## 5. Boss Fight — "The Artist"

A capstone encounter representing an anti-AI artist/community, structurally different from the regular platform targets.

- **HP = commission revenue.** Standard ammo does nothing — the artist has a personal  style that generic bullets can't match.
- Has boss attacks (including a telegraphed heavy "pencil" strike that sends player ricocheting off the walls); his fans surround and heal the boss or throw insults at player.
- **Three-phase player cycle of fighting the boss:**
  1. **Vacuum phase** — alt-fire switches to a LoRA-training vortex that sucks in image samples the artist throws. Mixed in are junk/corrupted samples that should be avoided (elaborate?) — this phase deliberately mirrors the main game's "choose correctly" mechanic rather than being a separate minigame. Should also choose proper base model given hints at artist's style (elaborate?).
  2. **Lora training** - weapons disable, player is forced to dodge and endure (slow down movement?). Better quality dataset shortens time or increases trained model damage?
  3. **Trained-strike phase** — a LoRA trained on the captured dataset produces tailored shots that damage the boss. Dataset quality (ratio of valid to junk samples captured) scales strike damage, so a rough vacuum phase costs time rather than failing the run outright.
- **Fan cloud:** lightweight, non-physics "fans" surrounding the boss. Followers fans, not a handheld fan thing!
  - Healers restore boss HP over time by "requesting commissions".
  - Hecklers throw insult projectiles at the player.
  - Distinct silhouettes so players can triage them at a glance.
- **Latent Inversion Bomb (player superitem):** thrown item with a radius; fans caught in  range latch onto it instead of acting; after a fuse, it detonates, removing the latched fans. Two kinds, one against healers, another against hecklers? References the memes where a real image is posed online as generated, causing anti-ai crowd to find "typical ai problems" in it, or the opposite where real-looking AI image is posted as an example of "real art being better than AI" and revealed to be the opposite later, causing much shame and confusion. Need to put more reference to online meta.
- Need to decide how to introduce the vortex weapon before the boss, so it doesn't come off as a surprise. Maybe add vacuum during regular run to collect likes easier and call it "fishing for compliments". Need to make references to memes and online jargon.
- Defeating boss yields large money rewards, named as "money saved on commissions".

---

## 6. Economy & Progression

### 6.1 Two Currencies
- **Money (throughput-based or only from bosses?):** earned from volume — total output, sites saturated (TBD, since a finished run would always yield a fixed amount of money under these conditions, so long as no bans were earned?). Funds **hardware** upgrades (GPU speed, storage type affecting model-switch time, PSU, ISP upgrade for faster bullet travel speed).
- **XP / software points (skill-based):** earned from precision moments — clean shield-gap shots, correct ammo calls, clean vacuum captures, near-hit dodges (grazing like touhou). Funds **software**  upgrades (e.g. Flash Attention — faster shooting/training), skills like countering common insults/dislikes and throwing off captcha. Should maybe add a minigame when enabling flash attention to reflect on the hoops you have to go through to compile it yourself.
- Rationale: sourcing the two currencies from genuinely different play behaviors (not just recoloring the same drop) creates two viable playstyles — high-volume vs. high-precision — rather than one dominant strategy.
- (undecided) Hardware purchases should, where possible, unlock new *loadout options* rather than only passive stat bumps, so shop progression expands run-build diversity instead of running on a parallel track.

### 6.2 Pre-Run Loadout
- Configuration options mirror real AI image-gen settings: max batch size (slow multi-shot derp gun vs fast single-shot sniper — "shotgun vs SMG"), overclocking (higher output rate, risk of a  stun-inducing "crash"), etc. Game SFX would also introduce realistic ventilation noise from PC coolers revving up and coil whine under stress with tone depending on batch size. Current batch size is changeable during gameplay by a hotkey.
- These draw from a shared budget (e.g. "PSU wattage" / "VRAM"), so loadout choices trade off against each other rather than being free toggles — this is what makes the pre-run screen a real decision instead of a checklist.

---

## 7. Technical Architecture Principles

- **Engine split:**  Phaser 4 for in-run gameplay (canvas, physics, sprites); angular DOM overlays for meta screens (menu, shop, loadout, settings). Should I delegate everything UI-related to Angular and avoid using phaser for it at all? Feels counterintuitive.
- **Config-driven content:** ammo types, site types, and (later) upgrades are data tables, not hardcoded per-class logic — adding content means adding a row, not new code. Currently only 3 types + lora for artist.
- **Event-driven decoupling:** entities emit events (e.g. `site:saturated`, `bomb:detonated`) rather than calling into each other directly; a scene-level listener wires effects. Keeps entity classes ignorant of each other.
- **State machines**  for anything with distinct behavior modes — enemy AI, and especially the boss's phases and player ranged/vacuum/trained-strike cycle — instead of scattered conditionals.
- **Lightweight aggregate entities** (e.g. the fan cloud) as plain-data arrays with a shared sprite pool, rather than one heavyweight GameObject per instance, when many instances need position/state but not full physics bodies each. 

---

## 8. Development Plan

| Slice | Goal | Scope |
|---|---|---|
| **0 — Core loop proof** | Validate ammo-matching tension is fun | Player movement/shoot, 3 ammo types with switch cost, 3 sites (one per ammo type), mismatch penalty + reaction burst - done|
| **1 — Shields & multi-target** | Validate spatial/triage pressure | Add rotating shield-gap mechanic; many sites live simultaneously or add random movement to sites; captcha punishment maybe for next slice only? |
| **2 — Escalation & extraction** | Validate the complete run arc | Global spread meter, site spawn ramp, extract-vs-push decision point?; no boss yet |
| **3 — Boss: The Artist** | Validate the capstone boss fight | Boss phase state machine, fan cloud, vacuum mechanic, inversion bomb (later?), the hardest part is animating the boss|
| **4 — Economy & meta layer** | Validate the between-run loop | Two-currency tracking, shop (hardware/software upgrades), pre-run loadout budget screen |
| **5 — Content & polish** | Expand breadth | More ammo/site types (doubtful), more unlocks, additional enemies?, audio, automate balance tuning (how?), add intermediate bosses like big single websites composed of many subsites like reddit. |
Make website names semi-procedurally generated, drawing two halves from a pool of topic-relevant words, like moe,booru,chan for anime, etc. Mix and match.

Each slice should be played and evaluated before starting the next — the goal is to validate a design assumption with each one, not just add features in sequence. Need to decide proper architecture as early as slice 0 so that adding complicated tech in slices 3-5 would be easier in future (IMPORTANT).

---

## 9. Open Areas for Further Development (undecided)

- **Dataset quality formula** for the boss vacuum phase — exact ratio/weighting of valid vs. junk samples, and how strongly it should scale trained-strike damage.
- **Mismatch reaction tuning** — does every wrong-ammo hit trigger a retaliation burst, or is it chance/cooldown-based (alertness based)? Needs playtesting; too punitive will feel bad once multiple sites are live at once.
- **Full pre-run settings list** — max batch size and overclock are defined; what else belongs in the shared VRAM/PSU budget pool? 
- Add "quality" attribute to player shots affected by loadout params like sampler or flash attention toggle. Speed/quality tradeoff, lower quality shots raise alertness faster (produces "slop"). Maybe have it affect the speed of projectiles instead of fire rate? Or tie speed to hardware "internet connection" upgrade?
- **Introducing the vacuum mechanic before the boss** — whether a smaller "capture, don't shoot" enemy type should appear earlier in a run so the boss's alt-fire mode isn't a first-time surprise. Or just use vacuum to collect likes.
- **Difficulty pacing** — rate of site spawn escalation, and how it should scale across a single run vs. across meta-progression.  
- **Art direction** — visual language for the "internet" map, platform sites, and the artist boss; currently unspecified. Use vector graphics instead of bitmap assets so AI detection can't be applied to them.
- **Persistence** — how upgrades, unlocks, and run history are saved (local storage), not yet decided.
- More references to memes and online jargon wherever possible, especially 4chan-style.
- **Difficulty choice** In the beginning select from 3 difficulty levels named after years: 2022 as easy, only SD1.5 era models available, fast fire rate, 2024 medium with SDXL and slower shooting, 2026 is hard mode with Flux 2 models and slow charged shots requiring good aim instead of "spray and pray", higher alertness rise representing current backlash against AI online. Rename upgrades accordingly so Flash attention versions correspond to ones available at the time.
