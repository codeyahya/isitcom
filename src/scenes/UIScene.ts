import Phaser from 'phaser';
import { DIALOGUES } from '../data/dialogues';
import { INITIAL_MISSIONS } from '../data/missions';
import { DialogueData, MissionStep } from '../game/types';
import { SoundSystem } from '../systems/SoundSystem';
import { SaveSystem } from '../systems/SaveSystem';

export class UIScene extends Phaser.Scene {
  private missions: MissionStep[] = [...INITIAL_MISSIONS];
  private currentMissionIdx: number = 0;

  private dialogueBox!: Phaser.GameObjects.Container;
  private dialogueSpeaker!: Phaser.GameObjects.Text;
  private dialogueContent!: Phaser.GameObjects.Text;
  private dialogueNextPrompt!: Phaser.GameObjects.Text;
  private currentDialogue: DialogueData | null = null;
  private currentDialogueIndex: number = 0;
  private isDialogueActive: boolean = false;

  private missionContainer!: Phaser.GameObjects.Container;
  private missionTitleText!: Phaser.GameObjects.Text;
  private missionDescText!: Phaser.GameObjects.Text;
  private missionRows: Phaser.GameObjects.Text[] = [];

  private zoneBannerText!: Phaser.GameObjects.Text;
  private interactionPromptText!: Phaser.GameObjects.Text;

  private pauseMenuContainer!: Phaser.GameObjects.Container;
  private endModalContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    this.loadSavedProgress();
    this.createHUD();
    this.createDialogueUI();
    this.createPauseMenu();
    this.createEndModal();
    this.setupKeyboardEvents();

    this.events.on('show_dialogue', this.startDialogue, this);
    this.events.on('set_zone_name', this.updateZoneBanner, this);
    this.events.on('mission_trigger', this.triggerMissionStep, this);
    this.events.on('show_prompt', this.showPrompt, this);
    this.events.on('hide_prompt', this.hidePrompt, this);
  }

  private loadSavedProgress() {
    const saved = SaveSystem.load();
    saved.completedMissions.forEach(id => {
      const m = this.missions.find(step => step.id === id);
      if (m) m.completed = true;
    });
    this.currentMissionIdx = saved.currentMissionIndex || 0;
  }

  private saveCurrentProgress() {
    const completed = this.missions.filter(m => m.completed).map(m => m.id);
    SaveSystem.save({
      version: 1,
      completedMissions: completed,
      visitedServices: completed,
      currentMissionIndex: this.currentMissionIdx,
      soundEnabled: SoundSystem.getInstance().enabled
    });
  }

  private createHUD() {
    // Bandeau nom de la zone
    this.zoneBannerText = this.add.text(20, 16, 'ISITCOM - Esplanade Extérieure', {
      fontSize: '16px',
      color: '#f8fafc',
      backgroundColor: '#1e293bee',
      padding: { x: 10, y: 6 }
    }).setDepth(100);

    // Traqueur de Mission en haut à droite
    this.missionContainer = this.add.container(472, 16).setDepth(100);
    const mBg = this.add.rectangle(0, 0, 316, 148, 0x0f172a, 0.94).setOrigin(0, 0);
    mBg.setStrokeStyle(2, 0x3b82f6);

    const mHeader = this.add.text(12, 8, 'OBJECTIF EN COURS :', {
      fontSize: '12px',
      color: '#93c5fd',
      fontStyle: 'bold'
    });
    this.missionTitleText = this.add.text(12, 26, '', { fontSize: '12px', color: '#fbbf24' });
    this.missionDescText = this.add.text(12, 42, '', {
      fontSize: '10px', color: '#cbd5e1', wordWrap: { width: 292 }
    });

    this.missionContainer.add([mBg, mHeader, this.missionTitleText, this.missionDescText]);
    this.missions.slice(0, 4).forEach((_, index) => {
      const row = this.add.text(12, 62 + index * 19, '', {
        fontSize: '10px', color: '#e2e8f0', fontStyle: 'bold'
      });
      this.missionRows.push(row);
      this.missionContainer.add(row);
    });
    this.renderMissionBoard();

    // Invite contextuelle d'interaction
    this.interactionPromptText = this.add.text(400, 520, '', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#1d4ed8ee',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setDepth(150).setVisible(false);

    // Bouton Pause en haut
    const pauseBtn = this.add.text(420, 16, 'PAUSE', {
      fontSize: '13px',
      color: '#ffffff',
      backgroundColor: '#334155',
      padding: { x: 8, y: 6 }
    }).setInteractive({ useHandCursor: true }).setDepth(100);

    pauseBtn.on('pointerdown', () => this.togglePauseMenu());
  }

  private createDialogueUI() {
    this.dialogueBox = this.add.container(80, 420).setDepth(200).setVisible(false);
    const bg = this.add.rectangle(0, 0, 640, 140, 0x090d16, 0.96).setOrigin(0, 0);
    bg.setStrokeStyle(3, 0x60a5fa);

    this.dialogueSpeaker = this.add.text(24, 14, '', {
      fontSize: '16px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });

    this.dialogueContent = this.add.text(24, 46, '', {
      fontSize: '14px',
      color: '#f8fafc',
      wordWrap: { width: 590 },
      lineSpacing: 6
    });

    this.dialogueNextPrompt = this.add.text(610, 115, 'Suivant ▶ [ESPACE / ENTRÉE / CLIC]', {
      fontSize: '11px',
      color: '#fbbf24'
    }).setOrigin(1, 0);

    bg.setInteractive();
    bg.on('pointerdown', () => this.advanceDialogue());

    this.dialogueBox.add([bg, this.dialogueSpeaker, this.dialogueContent, this.dialogueNextPrompt]);
  }

  public startDialogue(dialogueId: string) {
    const dlg = DIALOGUES[dialogueId];
    if (!dlg) return;

    this.currentDialogue = dlg;
    this.currentDialogueIndex = 0;
    this.isDialogueActive = true;
    this.dialogueBox.setVisible(true);
    this.renderCurrentDialogueLine();

    // Arrêter le joueur pendant la discussion
    const activeGameScene = this.scene.manager.getScenes(true).find(s => s !== this);
    if (activeGameScene && (activeGameScene as unknown as { pausePlayerMovement: () => void }).pausePlayerMovement) {
      (activeGameScene as unknown as { pausePlayerMovement: () => void }).pausePlayerMovement();
    }
  }

  private renderCurrentDialogueLine() {
    if (!this.currentDialogue) return;
    const line = this.currentDialogue.lines[this.currentDialogueIndex];
    this.dialogueSpeaker.setText(line.speaker);
    this.dialogueContent.setText(line.text);
    SoundSystem.getInstance().playBlip();
  }

  public advanceDialogue() {
    if (!this.isDialogueActive || !this.currentDialogue) return;

    this.currentDialogueIndex++;
    if (this.currentDialogueIndex < this.currentDialogue.lines.length) {
      this.renderCurrentDialogueLine();
    } else {
      this.closeDialogue();
    }
  }

  private closeDialogue() {
    const lastDlgId = this.currentDialogue?.id;
    this.isDialogueActive = false;
    this.dialogueBox.setVisible(false);
    this.currentDialogue = null;

    const activeGameScene = this.scene.manager.getScenes(true).find(s => s !== this);
    if (activeGameScene && (activeGameScene as unknown as { resumePlayerMovement: () => void }).resumePlayerMovement) {
      (activeGameScene as unknown as { resumePlayerMovement: () => void }).resumePlayerMovement();
    }

    if (lastDlgId === 'welcome_student') {
      this.triggerMissionStep('parler_etudiant');
    } else if (lastDlgId === 'service_etudiant') {
      this.triggerMissionStep('parler_resp_etudiant');
    }
  }

  public triggerMissionStep(missionId: string) {
    const step = this.missions.find(m => m.id === missionId);
    if (step && !step.completed) {
      step.completed = true;
      SoundSystem.getInstance().playSuccess();

      // Notification visuelle
      this.showToast(`Objectif accompli : ${step.title}`);

      // Avancement à l'étape suivante non terminée
      const nextIdx = this.missions.findIndex(m => !m.completed);
      if (nextIdx !== -1) {
        this.currentMissionIdx = nextIdx;
      } else {
        this.currentMissionIdx = this.missions.length - 1;
        this.showEndModal();
      }

      this.renderMissionBoard(true);
      this.saveCurrentProgress();
    }
  }

  private renderMissionBoard(animate = false) {
    const active = this.missions[this.currentMissionIdx] ?? this.missions[this.missions.length - 1];
    this.missionTitleText.setText(`En cours : ${active.title}`);
    this.missionDescText.setText(active.hint);
    this.missionRows.forEach((row, index) => {
      const mission = this.missions[index];
      if (!mission) {
        row.setVisible(false);
        return;
      }
      row.setVisible(true)
        .setText(`${mission.completed ? '✓' : '○'} ${mission.title}`)
        .setColor(mission.completed ? '#86efac' : mission === active ? '#fbbf24' : '#e2e8f0')
        .setAlpha(mission.completed ? 0.72 : 1);
    });
    if (animate) {
      this.missionContainer.setScale(1.04);
      this.tweens.add({ targets: this.missionContainer, scale: 1, duration: 220, ease: 'Back.Out' });
    }
  }

  private showToast(msg: string) {
    const toast = this.add.text(400, 90, msg, {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#15803d',
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5).setDepth(300);

    this.tweens.add({
      targets: toast,
      y: 70,
      alpha: 0,
      duration: 3200,
      onComplete: () => toast.destroy()
    });
  }

  public updateZoneBanner(zoneName: string) {
    this.zoneBannerText.setText(zoneName);
  }

  public showPrompt(msg: string) {
    if (this.isDialogueActive) return;
    this.interactionPromptText.setText(msg).setVisible(true);
  }

  public hidePrompt() {
    this.interactionPromptText.setVisible(false);
  }

  private setupKeyboardEvents() {
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.isDialogueActive) this.advanceDialogue();
    });
    this.input.keyboard?.on('keydown-ENTER', () => {
      if (this.isDialogueActive) this.advanceDialogue();
    });
    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.isDialogueActive) {
        this.closeDialogue();
      } else {
        this.togglePauseMenu();
      }
    });
  }

  private createPauseMenu() {
    this.pauseMenuContainer = this.add.container(200, 100).setDepth(500).setVisible(false);
    const bg = this.add.rectangle(0, 0, 400, 380, 0x0f172a, 0.98).setOrigin(0, 0);
    bg.setStrokeStyle(3, 0x3b82f6);

    const title = this.add.text(200, 30, 'PAUSE / COMMANDES', {
      fontSize: '20px',
      color: '#60a5fa',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const controlsGuide = this.add.text(200, 120,
      'COMMANDES :\n\n' +
      '• Se déplacer : Flèches / ZQSD / WASD\n' +
      '• Déplacement Souris : Clic gauche sur le sol\n' +
      '• Interagir : Touche [E], [Entrée] ou Clic\n' +
      '• Continuer Dialogue : [Espace], [Entrée] ou Clic\n' +
      '• Menu Pause : Touche [Échap]',
      {
        fontSize: '13px',
        color: '#f8fafc',
        align: 'center',
        lineSpacing: 6
      }
    ).setOrigin(0.5);

    const resumeBtn = this.createButton(200, 240, 'Reprendre la partie', () => this.togglePauseMenu());
    const resetBtn = this.createButton(200, 290, 'Réinitialiser la progression', () => {
      if (window.confirm('Voulez-vous vraiment réinitialiser vos missions à l\'ISITCOM ?')) {
        SaveSystem.reset();
        window.location.reload();
      }
    });

    this.pauseMenuContainer.add([bg, title, controlsGuide, resumeBtn, resetBtn]);
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): Phaser.GameObjects.Container {
    const btn = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 260, 36, 0x1d4ed8).setOrigin(0.5);
    const text = this.add.text(0, 0, label, { fontSize: '13px', color: '#ffffff' }).setOrigin(0.5);

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', () => {
      SoundSystem.getInstance().playBlip();
      onClick();
    });
    bg.on('pointerover', () => bg.setFillStyle(0x2563eb));
    bg.on('pointerout', () => bg.setFillStyle(0x1d4ed8));

    btn.add([bg, text]);
    return btn;
  }

  private togglePauseMenu() {
    const visible = !this.pauseMenuContainer.visible;
    this.pauseMenuContainer.setVisible(visible);
  }

  private createEndModal() {
    this.endModalContainer = this.add.container(150, 120).setDepth(600).setVisible(false);
    const bg = this.add.rectangle(0, 0, 500, 340, 0x090d16, 0.98).setOrigin(0, 0);
    bg.setStrokeStyle(3, 0xf59e0b);

    const title = this.add.text(250, 40, 'FÉLICITATIONS !', {
      fontSize: '22px',
      color: '#fbbf24',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const desc = this.add.text(250, 140,
      'Vous avez découvert avec succès tous les services\n' +
      'essentiels du campus ISITCOM Sousse !\n\n' +
      '✔ Service Étudiant\n' +
      '✔ Service Administratif\n' +
      '✔ Service Pédagogique\n' +
      '✔ Service Technique\n\n' +
      'Vous êtes fin prêt(e) pour votre rentrée universitaire !',
      {
        fontSize: '14px',
        color: '#f8fafc',
        align: 'center',
        lineSpacing: 6
      }
    ).setOrigin(0.5);

    const continueBtn = this.createButton(250, 280, 'Continuer d\'explorer le campus', () => {
      this.endModalContainer.setVisible(false);
    });

    this.endModalContainer.add([bg, title, desc, continueBtn]);
  }

  public showEndModal() {
    this.endModalContainer.setVisible(true);
    SoundSystem.getInstance().playSuccess();
  }
}