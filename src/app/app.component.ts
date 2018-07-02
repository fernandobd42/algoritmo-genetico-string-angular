import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';

    cromossomos = [];
    fraseObjetivo = 'Digite uma frase aleatoria contento apenas letras';
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzéíú ';
    achou = false;
    geracao = 0;
    taxaMutacao = 0.25;
    tamanho = 0;
    populacao = 1000;
    resultado = '';
    vetor: any = [];

    constructor() {}

    ngOnInit() {

    }

    iniciar = () => {
        let pontoCorte, novoFilho1, novoFilho2;
        this.cromossomos = [];
        this.resultado = '';
        this.tamanho = this.fraseObjetivo.length;
        this.achou = false;
        this.geracao = 0;

        this.gerandoPopulacao();

        while (!this.achou) {
            let count = 0;
            let mutados = 0;
            this.geracao++;

            const vetorOrdenado = this.cromossomos.sort(this.compare);
            const vetoresSorteio: any = [];
            for (let i = 0; i < (this.populacao * 0.60); i++) {
                vetoresSorteio.push(vetorOrdenado[i]);
            }

            const totalDeveMutar = (this.populacao / 2) * this.taxaMutacao;

            // Cruzamento
            for (let i = 0; i < (this.populacao / 2); i++) {
                const pos1 = Math.floor(Math.random() * (this.populacao * 0.60));
                let pos2, igual = true;
                while (igual) {
                    pos2 = Math.floor(Math.random() * (this.populacao * 0.60));
                    if (pos2 !== pos1) {
                        igual = false;
                    }
                }

                const filho1 = vetoresSorteio[pos1].string;
                const filho2 = vetoresSorteio[pos2].string;

                pontoCorte = Math.floor(Math.random() * (this.tamanho - 1) + 1);
                novoFilho1 = filho1.substr(0, pontoCorte) + filho2.substr(pontoCorte);
                novoFilho2 = filho2.substr(0, pontoCorte) + filho1.substr(pontoCorte);

                // Mutação
                if (mutados < totalDeveMutar) {
                    const pontoMutacao1 = Math.floor(Math.random() * (this.tamanho - 1));
                    const pontoMutacao2 = Math.floor(Math.random() * (this.tamanho - 1));

                    novoFilho1 = novoFilho1.substr(0, pontoMutacao1 - 1) + this.possible.charAt(Math.floor(Math.random() * this.possible.length)) + novoFilho1.substr(pontoMutacao1);
                    novoFilho2 = novoFilho2.substr(0, pontoMutacao2 - 1) + this.possible.charAt(Math.floor(Math.random() * this.possible.length)) + novoFilho2.substr(pontoMutacao2);
                    mutados++;
                }

                this.vetor = [];
                this.vetor.string = novoFilho1;
                this.vetor.distancia = this.calcularFitness(novoFilho1, this.fraseObjetivo);
                this.cromossomos[count] = this.vetor;
                count++;
                this.vetor.string = novoFilho2;
                this.vetor.distancia = this.calcularFitness(novoFilho2, this.fraseObjetivo);
                this.cromossomos[count] = this.vetor;
                count++;

            }

            for (let i = (this.populacao * 0.80); i < this.populacao; i++) {
                this.cromossomos[i] = vetorOrdenado[i];
            }

            this.cromossomos.forEach(value => {
                console.log('geracao: ', this.geracao);
                console.log('distancia: ', value.distancia);
                console.log('string de busca: ', value.string);
                console.log('string almejada: ', this.fraseObjetivo);
                console.log('----------------------------------------------------------------------');
                if (!this.achou) {
                    if (value.distancia === 0) {
                        this.achou = true;
                        this.resultado = value.string;
                        return true;
                    }
                }
            });
        }
    }

    gerandoPopulacao = () => {
        for (let i = 0; i < this.populacao; i++) {
            let string = '';
            for (let j = 0; j < this.tamanho; j++) {
                string += this.possible.charAt(Math.floor(Math.random() * this.possible.length));
            }
            // tslint:disable-next-line:prefer-const
            this.vetor = [];
            this.vetor.string = string;
            this.vetor.distancia = this.calcularFitness(string, this.fraseObjetivo);
            this.cromossomos[i] = this.vetor;
        }
    }

    calcularFitness = (string, fraseObjetivo) => {
        let distancia = 0;
        for (let i = 0; i < this.tamanho; i++) {
            if (string[i] !== fraseObjetivo[i]) {
                distancia++;
            }
        }
        return distancia;
    }

    compare = (a, b) => {
        if (a['distancia'] < b['distancia']) {
            return -1;
        }
        if (a['distancia'] > b['distancia']) {
            return 1;
        }
        return 0;
    }
}
