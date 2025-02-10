import { Component, ElementRef, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

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
  private commandBuffer: string = '';

  ngOnInit(): void {
    this.initializeTerminal();
  }

  private initializeTerminal(): void {
    this.terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: { background: '#1e1e1e', foreground: '#ffffff' }
    });

    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.open(this.terminalDiv.nativeElement);
    this.fitAddon.fit();

    this.terminal.writeln('Welcome to xterm.js in Angular!');
    this.terminal.write('$ '); // Display prompt

    // Listen for user input
    this.terminal.onData((data) => this.handleInput(data));

    window.addEventListener('resize', () => this.fitAddon.fit());
  }

  private handleInput(data: string): void {
    // Handle Enter key (user submits input)
    if (data === '\r') {
      this.terminal.writeln(''); // Move to new line
      console.log('User Input:', this.commandBuffer); // Log input to console
      this.terminal.writeln(`You typed: ${this.commandBuffer}`); // Echo input
      this.commandBuffer = ''; // Clear input buffer
      this.terminal.write('$ '); // Display prompt again
      return;
    }

    // Handle Backspace
    if (data === '\x7f') {
      if (this.commandBuffer.length > 0) {
        this.commandBuffer = this.commandBuffer.slice(0, -1);
        this.terminal.write('\b \b'); // Erase last character visually
      }
      return;
    }

    // Append character to command buffer
    this.commandBuffer += data;
    this.terminal.write(data); // Show input in terminal
  }

  ngOnDestroy(): void {
    this.terminal.dispose();
  }
}
