import {data, render} from 'wickedstate';

data('counter', () => ({
    count: 0,
    nextId: 1,
    history: [],
    increment() {
        this.history = [...this.history, { id: this.nextId, text: 'Increment: ' + this.count }];
        this.count++;
        this.nextId++;
    },
    decrement() {
        this.history = [...this.history, { id: this.nextId, text: 'Decrement: ' + this.count }];
        this.count--;
        this.nextId++;
    },
    reset() {
        this.count = 0;
        this.nextId = 1;
        this.history = [];
    },
}));

render(document.body).then(() => {
    console.log('We are ready to be wicked!');
});
