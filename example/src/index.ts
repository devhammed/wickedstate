import {data, render} from 'wickedstate';

data('counter', () => ({
    count: 0,
    history: [],
    increment() {
        this.history = [...this.history, 'Increment: ' + this.count];
        this.count++;
    },
    decrement() {
        this.history = [...this.history, 'Decrement: ' + this.count];
        this.count--;
    },
    reset() {
        this.count = 0;
        this.history = [];
    },
}));

render(document.body).then(() => {
    console.log('We are ready to be wicked!');
});
