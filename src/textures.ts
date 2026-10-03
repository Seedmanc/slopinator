export function makeTextures(sc: any) {
  const g = sc.add.graphics();
  g.clear();
  g.fillStyle(0x232a3d, 1); g.fillRoundedRect(4, 6, 32, 28, 6);
  g.fillStyle(0x3fd0ff, 1); g.fillRect(8, 10, 10, 6);
  g.fillStyle(0xffd54f, 1); g.fillCircle(30, 14, 3);
  g.fillStyle(0x141926, 1); g.fillRoundedRect(10, 26, 8, 8, 2); g.fillRoundedRect(22, 26, 8, 8, 2);
  g.lineStyle(2, 0x3fd0ff, 0.8); g.strokeRoundedRect(4, 6, 32, 28, 6);
  g.generateTexture('player', 40, 40);
}
