import Phaser from 'phaser';
import { SHEETS } from '../data/art';

export class DevTileBrowserScene extends Phaser.Scene {
  private list = Object.values(SHEETS);
  private idx = 0;

  constructor() { super('DevTileBrowserScene'); }

  create() {
    this.cameras.main.setBackgroundColor(0x1e2430);
    this.render();
    this.input.keyboard!.on('keydown-LEFT',  () => { this.idx = (this.idx + this.list.length - 1) % this.list.length; this.render(); });
    this.input.keyboard!.on('keydown-RIGHT', () => { this.idx = (this.idx + 1) % this.list.length; this.render(); });
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      const t = this.children.list.find(ch => ch.getData && ch.getData('tile')
        && Phaser.Geom.Rectangle.Contains(ch.getData('rect'), p.x, p.y));
      if (t) {
        const { sheet, c, r } = t.getData('tile');
        const msg = `${sheet}: f('${sheet === 'urban' ? 'urban' : sheet === 'mi_room' ? 'miRoom' : 'miFurn'}', ${c}, ${r})`;
        console.log(msg);
        navigator.clipboard?.writeText(`${c}, ${r}`).catch(() => {});
      }
    });
  }

  private render() {
    this.children.removeAll();
    const s = this.list[this.idx];
    const tex = this.textures.get(s.key).getSourceImage() as HTMLImageElement;
    const rows = Math.floor(tex.height / 16);
    const scale = Math.min(2, 780 / (s.cols * 16), 560 / (rows * 16));
    const ox = (800 - s.cols * 16 * scale) / 2;
    const oy = 30;

    this.add.text(400, 10, `← →  ${s.key}  (${s.cols}×${rows}) — cliquez une tuile pour copier c,r`, { fontSize: '12px', color: '#93c5fd' }).setOrigin(0.5, 0);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < s.cols; c++) {
        const x = ox + c * 16 * scale, y = oy + r * 16 * scale;
        const img = this.add.image(x + 8 * scale, y + 8 * scale, s.key, r * s.cols + c).setScale(scale);
        img.setData('tile', { sheet: s.key, c, r });
        img.setData('rect', new Phaser.Geom.Rectangle(x, y, 16 * scale, 16 * scale));
        if (scale >= 1.5) this.add.text(x + 2, y + 2, `${c},${r}`, { fontSize: '7px', color: '#f59e0b' });
      }
    }
  }
}