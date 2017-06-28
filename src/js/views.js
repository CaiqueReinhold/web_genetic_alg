import * as params from './params';
import {Population} from './population';

export class MainView {

    constructor() {
        this.settings = new SettingsView();
        this.route_view = new RouteView();
        this.$out = $('.output');
        $('#btn_run').on('click', this.run.bind(this));
    }

    run() {
        $('#btn_run').addClass('disabled');
        let pop = Population.init();
        for (let i = 0; i < params.GENERATION_COUNT; i++) {
            pop = pop.evolve();
        }
        let best_fit = pop.best_individual;
        this.route_view.render(best_fit.genes);
        this.$out.html('Best fit: ' + best_fit.fitness + '<br>' + best_fit.genes.join(', '));
        $('#btn_run').removeClass('disabled');
    }

}

export class SettingsView {

    constructor() {
        $('select').material_select();
        $('#generation_count').val(params.GENERATION_COUNT);
        $('#generation_count').on('keyup', this.generation_count.bind(this));
        $('#population_size').val(params.POPULATION_SIZE);
        $('#population_size').on('keyup', this.population_size.bind(this));
        $('#tournament_count').val(params.TOURNAMENT_COUNT);
        $('#tournament_count').on('keyup', this.tournament_count.bind(this));
        $('#elite_retain').val(params.ELITE_RETAIN);
        $('#elite_retain').on('keyup', this.elite_retain.bind(this));
        $('#mutation_rate').val(params.MUTATION_RATE * 100);
        $('#mutation_rate').on('keyup', this.mutation_rate.bind(this));
        $('#mutation_type').on('change', this.mutation_type.bind(this));
        $('#nn_fill_count').val(params.NN_FILL_COUNT);
        $('#nn_fill_count').on('keyup', this.nn_fill_count.bind(this));
        $('#permutations').val(params.LOCAL_SEARCH_PERM);
        $('#permutations').on('keyup', this.local_search_perm.bind(this));
        $('#n_cities').val(params.CITIES.length);
        $('#n_cities').on('keyup', this.cities.bind(this));
    }

    generation_count(e) {
        params.GENERATION_COUNT = parseInt(e.target.value);
    }

    population_size(e) {
        params.POPULATION_SIZE = parseInt(e.target.value);
    }

    tournament_count(e) {
        params.TOURNAMENT_COUNT = parseInt(e.target.value);
    }

    elite_retain(e) {
        params.ELITE_RETAIN = parseInt(e.target.value);
    }

    mutation_type(e) {
        params.MUTATION_TYPE = parseInt(e.target.value);
    }

    mutation_rate(e) {
        params.MUTATION_RATE = parseInt(e.target.value) / 100;
    }

    nn_fill_count(e) {
        params.NN_FILL_COUNT = parseInt(e.target.value);
    }

    local_search_perm(e) {
        params.LOCAL_SEARCH_PERM = parseInt(e.target.value);
    }

    cities(e) {
        let n_cities = parseInt(e.target.value);
        params.CITIES = [];
        for (let i = 0; i < n_cities; i++) {
            params.CITIES.push({
                'x': Math.floor(Math.random() * 100),
                'y': Math.floor(Math.random() * 100)
            });
        }
    }
}

export class RouteView {

    constructor() {
        this.$el = $('svg');
        this.size = $('.svg-container').width();
        if (this.size > 800) {
            this.size = 800;
        }
        this.$el.width(this.size);
        this.$el.height(this.size);
        let size = this.size;
        $('svg')[0].setAttribute('viewBox', `0 0 ${size} ${size}`);
        this.render();
    }

    render(genes) {
        this.$el.html('');

        if (genes) {
            for (let i = 1; i < genes.length; i++) {
                let $line = $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).
                    attr('x1', params.CITIES[genes[i]].x * this.size / 100).
                    attr('y1', params.CITIES[genes[i]].y * this.size / 100).
                    attr('x2', params.CITIES[genes[i - 1]].x * this.size / 100).
                    attr('y2', params.CITIES[genes[i - 1]].y * this.size / 100).
                    attr('stroke-width', '1').
                    attr('stroke', '#26a69a');

                this.$el.append($line);
            }

            let $line = $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).
                attr('x1', params.CITIES[genes[0]].x * this.size / 100).
                attr('y1', params.CITIES[genes[0]].y * this.size / 100).
                attr('x2', params.CITIES[genes[genes.length - 1]].x * this.size / 100).
                attr('y2', params.CITIES[genes[genes.length - 1]].y * this.size / 100).
                attr('stroke-width', '1').
                attr('stroke', '#26a69a');
            this.$el.append($line);
        }

        for (let i = 0; i < params.CITIES.length; i++) {
            let $circle = $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).
                attr('cx', params.CITIES[i].x * this.size / 100).
                attr('cy', params.CITIES[i].y * this.size / 100).
                attr('r', '5');
            this.$el.append($circle);

            let $label = $(document.createElementNS('http://www.w3.org/2000/svg', 'text')).
                attr('x', (params.CITIES[i].x * this.size / 100) - 5).
                attr('y', (params.CITIES[i].y * this.size / 100) - 10).
                attr('font-size', '10').
                text(i.toString());
            this.$el.append($label);
        }
    }

}