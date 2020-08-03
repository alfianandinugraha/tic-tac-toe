// dasar matrik utama game
let layoutGame = [ [ 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0 ] ];

// X atau x = player
// O atu o = opponents

// digunakan untuk menaruh 'nomor' element HTML yang sudah diisi oleh player / opponent
// jadi nantinya ketika opponent mendapatkan nomor yang sama seperti nomor yang sudah dipilih player maka akan gagal
let filledElement = [];

class Check {
    constructor(arr) {
        this.arr = arr;
    }

    // ngecek apakah ada satu baris horizontal / vertikal yang sama dan berderet
    coordinate() {
        let count = {
            horizontal: {
                x: 0,
                o: 0
            },
            vertical: {
                x: 0,
                o: 0
            }
        };

        // pengecekan logis
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr[i].length; j++) {
                if (
                    count.horizontal.x === 4 ||
                    count.vertical.x === 4 ||
                    count.horizontal.o === 4 ||
                    count.vertical.o === 4
                ) {
                    break;
                }

                this.arr[i][j] === 'x' ? count.horizontal.x++ : (count.horizontal.x = 0);
                this.arr[i][j] === 'o' ? count.horizontal.o++ : (count.horizontal.o = 0);

                this.arr[j][i] === 'x' ? count.vertical.x++ : (count.vertical.x = 0);
                this.arr[j][i] === 'o' ? count.vertical.o++ : (count.vertical.o = 0);
            }

            if (count.horizontal.x === 4 || count.vertical.x === 4) return 'x';
            if (count.horizontal.o === 4 || count.vertical.o === 4) return 'o';

            count = {
                horizontal: {
                    x: 0,
                    o: 0
                },
                vertical: {
                    x: 0,
                    o: 0
                }
            };
        }

        return false;
    }

    // ngecek untuk bagian diagonal
    diagonal() {
        let count = {
            diagonal1: {
                x: 0,
                o: 0
            },
            diagonal2: {
                x: 0,
                o: 0
            }
        };

        for (let i = 0; i < this.arr.length; i++) {
            if (
                count.diagonal1.x === 4 ||
                count.diagonal2.x === 4 ||
                count.diagonal1.o === 4 ||
                count.diagonal2.o === 4
            )
                break;

            this.arr[i][i] === 'x' ? count.diagonal1.x++ : (count.diagonal1.x = 0);
            this.arr[i][i] === 'o' ? count.diagonal1.o++ : (count.diagonal1.o = 0);

            this.arr[i][this.arr.length - i - 2] === 'x' ? count.diagonal2.x++ : (count.diagonal2.x = 0);
            this.arr[i][this.arr.length - i - 2] === 'o' ? count.diagonal2.o++ : (count.diagonal2.o = 0);
        }

        if (count.diagonal1.x === 4 || count.diagonal2.x === 4) return 'x';
        if (count.diagonal1.o === 4 || count.diagonal2.o === 4) return 'o';

        return false;
    }

    // menentukan pemenang dari array
    setWinner() {
        if (this.coordinate() === 'x' || this.diagonal() === 'x') return 'x';
        if (this.coordinate() === 'o' || this.diagonal() === 'o') return 'o';
        return false;
    }
}

class Layout {
    constructor() {
        this.containerElement = document.querySelector('.container');
    }

    popUpMessage(status) {
        let popUp = document.createElement('div');
        popUp.classList.add('pop-up');
        let message = '';

        status == 'win'
            ? (message = 'Selamat, kamu berhasil mengalahkan virus corona')
            : (message = 'Yah, kamu belum berhasil. Coba kembali untuk meraih kemenangan dan akhiri pandemi ini!');

        popUp.innerHTML = `
            <div class="pop-up-message">
                ${message}
            </div>
            <div class="button-section">
                <div class="button-message">
                    <button id="close-alert">Ok</button>
                </div>
                <div class="button-message">
                    <button id="play-again">Main Lagi</button>
                </div>
            </div>
        `;

        return popUp;
    }

    // fungsi untuk mengambil posisi sebuah element html berdasarkan matrik
    cellPosition(element, position) {
        return position == 'row' ? element.dataset.row : element.dataset.column;
    }

    // button untuk menutup alert / pemberitahuan
    closeAlert() {
        let popUpElement = document.querySelector('.pop-up');
        popUpElement.addEventListener('click', () => popUpElement.remove());
    }

    // method untuk mancing bermain lagi
    playAgain() {
        let playAgainButton = document.getElementById('play-again');
        playAgainButton.addEventListener('click', () => location.reload());
    }

    // setiap element HTML yang nanti nya menjadi cell
    render() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let cellElement = document.createElement('div');
                cellElement.dataset.row = i;
                cellElement.dataset.column = j;
                cellElement.classList.add('cell-item');
                cellElement.innerHTML = `[${i} ${j}]`;

                this.containerElement.appendChild(cellElement);
            }
        }
    }
}

class Game extends Layout {
    constructor() {
        super();
        this.currentPlayer = '';
        this.isGameStop = false;
    }

    // method untuk generate angka acak dari 0 sampai 25
    bot() {
        return Math.floor(Math.random() * 25);
    }

    // Method utama untuk player agar bisa mengklik
    event() {
        let getMatrixElement = document.getElementsByClassName('cell-item');

        for (let i = 0; i < getMatrixElement.length; i++) {
            getMatrixElement[i].addEventListener('click', () => {
                if (this.isGameStop) return;
                if (getMatrixElement[i].dataset.value) return;

                // Set gambar dalam elemen yang dipilih player
                getMatrixElement[i].innerHTML = `<img src="./asset/media/player.png">`;

                // Menambahkan data set
                getMatrixElement[i].dataset.value = 'x';

                let rowElement = this.cellPosition(getMatrixElement[i], 'row');
                let columnElement = this.cellPosition(getMatrixElement[i], 'column');

                layoutGame[rowElement][columnElement] = 'x';
                filledElement.push(i);

                setTimeout(() => {
                    let indexBot = this.bot();

                    // ngecek apakah indexBot ada di dalam filled element
                    while (filledElement.includes(indexBot)) {
                        // jika ada maka akan digenerate nilai indexBot yang baru
                        indexBot = this.bot();
                    }

                    filledElement.push(indexBot);

                    getMatrixElement[indexBot].dataset.value = 'o';
                    getMatrixElement[indexBot].innerHTML = `<img src="./asset/media/opponent.png">`;

                    let randomRowElement = this.cellPosition(getMatrixElement[indexBot], 'row');
                    let randomColumnElement = this.cellPosition(getMatrixElement[indexBot], 'column');

                    // memasukan cell bot berdasarkan element HTML nya
                    layoutGame[randomRowElement][randomColumnElement] = 'o';

                    // melalukan checking pada sebuah array
                    let checkWinner = new Check(layoutGame);

                    // jika salah satu ada yang menang maka game akan berhenti dan harus reload untuk bermain lagi
                    if (checkWinner.setWinner()) this.isGameStop = true;

                    if (checkWinner.setWinner() === 'x') {
                        this.containerElement.insertAdjacentElement('afterend', this.popUpMessage('win'));
                        this.playAgain();
                        this.closeAlert();
                    }

                    if (checkWinner.setWinner() === 'o') {
                        this.containerElement.insertAdjacentElement('afterend', this.popUpMessage('lose'));
                        this.playAgain();
                        this.closeAlert();
                    }
                }, 500);
            });
        }
    }

    run() {
        this.render();
        this.event();
    }
}

new Game().run();
