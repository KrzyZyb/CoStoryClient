import {Component, ElementRef, OnInit, ViewChild, OnDestroy, ViewEncapsulation} from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, OnDestroy {
  @ViewChild('terminal', { static: true }) terminalDiv!: ElementRef;
  private terminal!: Terminal;
  private fitAddon!: FitAddon;

  ngOnInit(): void {
    this.initializeTerminal();
  }

  private initializeTerminal(): void {
    this.terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: { background: '#1e1e1e' }
    });

    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);

    this.terminal.open(this.terminalDiv.nativeElement);
    this.fitAddon.fit();

    this.terminal.writeln('Welcome to xterm.js in Angular!');
    // const attachAddon = new AttachAddon(webSocket); TODO: Integrate with websocket

    window.addEventListener('resize', () => this.fitAddon.fit());
  }

  ngOnDestroy(): void {
    this.terminal.dispose();
  }
}
