import {MUTATION_RATE, MUTATION_TYPE, CITIES, LOCAL_SEARCH_PERM} from './params';

const M_TYPE_SINGLE_GENE = 1;
const M_TYPE_SUB_ROUTE = 2;

var total = 0;
var mutated = 0;

export class Individual {

    constructor(genes, mutate=true) {
        this.genes = genes;

        if (mutate && Math.random() <= MUTATION_RATE) {
            this.mutate();
        }

        this._fitness = this.eval();
    }

    eval() {
        let fit = 0;
        let n_cities = CITIES.length;

        fit += Individual.euclidean_distance(
            CITIES[this.genes[0]], CITIES[this.genes[n_cities - 1]]
        )

        for (let i = 1; i < n_cities; i++) {
            fit += Individual.euclidean_distance(
                CITIES[this.genes[i - 1]], CITIES[this.genes[i]]
            )
        }

        return fit;
    }

    get fitness() {
        return this._fitness;
    }

    mutate() {
        switch (MUTATION_TYPE) {
            case M_TYPE_SINGLE_GENE:
                this.single_gene_mutation()
                break;
            case M_TYPE_SUB_ROUTE:
                this.sub_route_mutation()
                break;
        }
    }

    single_gene_mutation() {
        let idx1 = Math.floor(Math.random() * this.genes.length);
        let idx2 = Math.floor(Math.random() * this.genes.length);
        let tmp = this.genes[idx1];
        this.genes[idx1] = this.genes[idx2];
        this.genes[idx2] = tmp;
    }

    sub_route_mutation() {
        let idx1 = Math.floor(Math.random() * this.genes.length);
        let idx2 = Math.floor(Math.random() * this.genes.length);

        if (idx1 > idx2) {
            let tmp = idx1;
            idx1 = idx2;
            idx2 = idx1;
        }

        for (let i = 0; i < parseInt((idx2 - idx1) / 2); i++) {
            let tmp = this.genes[idx1 + i];
            this.genes[idx1 + i] = this.genes[idx2 - i];
            this.genes[idx2 - i] = tmp;
        }
    }

    crossover(mate) {
        let idx1 = Math.floor(Math.random() * this.genes.length);
        let idx2 = Math.floor(Math.random() * this.genes.length);

        if (idx1 > idx2) {
            let tmp = idx1;
            idx1 = idx2;
            idx2 = idx1;
        }

        let new_genes = new Array(this.genes.length);

        for (let i = idx1; i <= idx2; i++) {
            new_genes[i] = this.genes[i];
        }

        for (let i = 0, tmp = 0; i < this.genes.length; i++) {
            if (tmp == idx1) {
                tmp = idx2 + 1;
            }

            let flag = true;
            for (let j = idx1; j <= idx2; j++) {
                if(mate.genes[i] == new_genes[j]) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                new_genes[tmp++] = mate.genes[i];
            }
        }

        return new Individual(new_genes);
    }

    local_search() {
        let best_fit = this.fitness;
        for (let i = 0; i < LOCAL_SEARCH_PERM; i++) {
            let idx1 = Math.floor(Math.random() * this.genes.length);
            let idx2 = Math.floor(Math.random() * this.genes.length);

            let tmp = this.genes[idx1];
            this.genes[idx1] = this.genes[idx2];
            this.genes[idx2] = tmp;

            let curr_fit = this.eval();
            if (curr_fit < best_fit) {
                best_fit = curr_fit;
            } else {
                let tmp = this.genes[idx1];
                this.genes[idx1] = this.genes[idx2];
                this.genes[idx2] = tmp;
            }
        }
        this._fitness = best_fit;
    }

    static euclidean_distance(c1, c2) {
        return Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2));
    }

    static random_individual() {
        let n_cities = CITIES.length;
        let genes = new Array(n_cities);

        for (let i = 0; i < n_cities; i++) {
            genes[i] = i;
        }

        for (let i = n_cities - 1; i > 0; i--) {
            let idx = Math.floor(Math.random() * n_cities);

            let tmp = genes[i];
            genes[i] = genes[idx];
            genes[idx] = tmp;
        }

        return new Individual(genes, false);
    }

    static greedy_individual(start) {
        let genes = new Array(CITIES.length);

        for (let i = 0; i < CITIES.length; i++) {
            genes[i] = i;
        }
        genes[0] = start;
        genes[start] = 0;

        for (let i = 0; i < CITIES.length - 1; i++) {
            let best = Infinity, idx = 0;
            for (let j = i + 1; j < CITIES.length; j++) {
                let distance = Individual.euclidean_distance(CITIES[genes[i]],
                                                             CITIES[genes[j]]);
                if (distance < best) {
                    idx = j;
                    best = distance;
                }
            }

            let tmp = genes[i + 1];
            genes[i + 1] = genes[idx];
            genes[idx] = tmp;
        }

        return new Individual(genes, false);
    }

}

window.Individual = Individual;