class GameSimulation {
    constructor() {
        this.clientCanvas = document.getElementById('clientCanvas');
        this.serverCanvas = document.getElementById('serverCanvas');
        this.clientCtx = this.clientCanvas.getContext('2d');
        this.serverCtx = this.serverCanvas.getContext('2d');
        
        // Canvas boyutlarını ayarla
        this.resizeCanvases();
        window.addEventListener('resize', () => this.resizeCanvases());

        // Oyun durumu
        this.clientState = {
            x: 50,
            y: 50,
            inputSequence: 0
        };
        
        this.serverState = {
            x: 50,
            y: 50,
            lastProcessedSequence: 0
        };

        this.inputBuffer = [];
        this.serverQueue = [];
        this.networkLatency = 100; // ms
        this.tickRate = 50; // ms

        // Kontroller
        this.setupControls();
        
        // UI elemanları
        this.clientPositionEl = document.getElementById('clientPosition');
        this.serverPositionEl = document.getElementById('serverPosition');
        this.inputSequenceEl = document.getElementById('inputSequence');
        this.lastProcessedSequenceEl = document.getElementById('lastProcessedSequence');
    }

    resizeCanvases() {
        [this.clientCanvas, this.serverCanvas].forEach(canvas => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;

            const speed = 5;
            let input = null;

            switch(e.key) {
                case 'ArrowLeft':
                    input = { dx: -speed, dy: 0 };
                    break;
                case 'ArrowRight':
                    input = { dx: speed, dy: 0 };
                    break;
                case 'ArrowUp':
                    input = { dx: 0, dy: -speed };
                    break;
                case 'ArrowDown':
                    input = { dx: 0, dy: speed };
                    break;
            }

            if (input) {
                this.processClientInput(input);
            }
        });

        document.getElementById('startSimulation').addEventListener('click', () => {
            if (!this.isRunning) {
                this.start();
            } else {
                this.stop();
            }
        });

        document.getElementById('addLatency').addEventListener('click', () => {
            this.networkLatency += 100;
        });
    }

    processClientInput(input) {
        this.clientState.inputSequence++;
        
        // Client-side prediction
        this.clientState.x += input.dx;
        this.clientState.y += input.dy;

        // Input buffer'a ekle
        this.inputBuffer.push({
            sequence: this.clientState.inputSequence,
            input: input,
            timestamp: Date.now()
        });

        // Server'a gönder (simüle et)
        setTimeout(() => {
            this.serverQueue.push({
                sequence: this.clientState.inputSequence,
                input: input
            });
        }, this.networkLatency);
    }

    serverTick() {
        // Server input queue'yu işle
        while (this.serverQueue.length > 0) {
            const input = this.serverQueue.shift();
            this.serverState.x += input.input.dx;
            this.serverState.y += input.input.dy;
            this.serverState.lastProcessedSequence = input.sequence;

            // Server state'i client'a gönder (simüle et)
            setTimeout(() => {
                this.reconcileClient(this.serverState);
            }, this.networkLatency);
        }
    }

    reconcileClient(serverState) {
        // Server reconciliation
        if (serverState.lastProcessedSequence < this.clientState.inputSequence) {
            // Reapply inputs that haven't been processed by the server yet
            this.clientState.x = serverState.x;
            this.clientState.y = serverState.y;

            const unprocessedInputs = this.inputBuffer.filter(
                input => input.sequence > serverState.lastProcessedSequence
            );
            unprocessedInputs.forEach(input => {
                this.clientState.x += input.input.dx;
                this.clientState.y += input.input.dy;
            });
            console.log("server State");
            console.log(serverState.lastProcessedSequence, serverState.x, serverState.y);

            console.log("client State");
            console.log(this.clientState.inputSequence, this.clientState.x, this.clientState.y);
        }

        // Clean up old inputs
        this.inputBuffer = this.inputBuffer.filter(
            input => input.sequence > serverState.lastProcessedSequence
        );
    }

    render() {
        // Client render
        this.clientCtx.clearRect(0, 0, this.clientCanvas.width, this.clientCanvas.height);
        this.clientCtx.fillStyle = 'red';
        this.clientCtx.fillRect(this.clientState.x, this.clientState.y, 20, 20);

        // Server render
        this.serverCtx.clearRect(0, 0, this.serverCanvas.width, this.serverCanvas.height);
        this.serverCtx.fillStyle = 'red';
        this.serverCtx.fillRect(this.serverState.x, this.serverState.y, 20, 20);

        // Update UI
        this.clientPositionEl.textContent = `x: ${Math.round(this.clientState.x)}, y: ${Math.round(this.clientState.y)}`;
        this.serverPositionEl.textContent = `x: ${Math.round(this.serverState.x)}, y: ${Math.round(this.serverState.y)}`;
        this.inputSequenceEl.textContent = this.clientState.inputSequence;
        this.lastProcessedSequenceEl.textContent = this.serverState.lastProcessedSequence;
    }

    start() {
        this.isRunning = true;
        document.getElementById('startSimulation').textContent = 'Simülasyonu Durdur';
        
        this.serverInterval = setInterval(() => this.serverTick(), this.tickRate);
        this.renderInterval = setInterval(() => this.render(), 1000 / 60);
    }

    stop() {
        this.isRunning = false;
        document.getElementById('startSimulation').textContent = 'Simülasyonu Başlat';
        
        clearInterval(this.serverInterval);
        clearInterval(this.renderInterval);
    }
}

// Simülasyonu başlat
const game = new GameSimulation(); 