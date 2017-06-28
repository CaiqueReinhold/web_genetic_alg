import {POPULATION_SIZE, ELITE_RETAIN, TOURNAMENT_COUNT,
        NN_FILL_COUNT, CITIES} from './params';
import {Individual} from './individual';

export class Population {

    constructor() {
        this.individuals = new Array();
    }

    add_individual(indv) {
        this.individuals.push(indv);
    }

    evolve() {
        let new_pop = new Population();

        if (ELITE_RETAIN > 0) {
            for (let i = 0; i < ELITE_RETAIN; i++) {
                new_pop.add_individual(this.individuals[i]);
            }
        }

        while(new_pop.individuals.length < POPULATION_SIZE) {
            let indv1 = this.select();
            let indv2 = this.select();

            new_pop.add_individual(indv1.crossover(indv2));
        }
        new_pop.sort();
        new_pop.individuals[0].local_search();

        return new_pop;
    }

    select() {
        let idx = Math.floor(Math.random() * this.individuals.length);
        let selected = this.individuals[idx];

        for (let i = 0; i < TOURNAMENT_COUNT; i++) {
            idx = Math.floor(Math.random() * this.individuals.length);
            if (selected.fitness < this.individuals[idx]) {
                selected = this.individuals[idx];
            }
        }

        return selected;
    }

    get best_individual() {
        return this.individuals[0];
    }

    sort() {
        this.individuals.sort((a, b) => a.fitness - b.fitness);
    }

    static init() {
        let pop = new Population();

        for (let i = 0; i < NN_FILL_COUNT; i++) {
            let start = Math.floor(Math.random() * CITIES.length);
            pop.add_individual(Individual.greedy_individual(start));
        }

        while (pop.individuals.length < POPULATION_SIZE) {
            pop.add_individual(Individual.random_individual());
        }
        pop.sort();

        return pop;
    }

}