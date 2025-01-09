# wickedstate

A plug-n-play reactive library for building web applications.

## Installation

### Using CDN

Using a CDN is the easiest way to get started with the library. You can include the following script tag in your HTML file to get started:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Wicked App</title>
</head>
<body>
<div *state="{ count: 0 }">
    <h1 *text="count"></h1>
    <button *on[click]="count++" type="button">Increment</button>
    <button *on[click]="count--" type="button">Decrement</button>
</div>
<script type="module">
    import { render } from 'https://esm.sh/wickedstate@0.1.0';

    render(document.body).then(() => {
        console.log('App is ready');
    });
</script>
</body>
</html>
```

We are using [esm.sh](https://esm.sh) CDN in the example above, you can replace it with any other CDN of your choice that supports ES Modules e.g `https://cdn.skypack.dev/wickedstate@0.1.0`.

### Using Vite

If you don't have a Vite project already, you can create a new project with the package manager of your choice using the following commands:

- NPM: `npm create vite@latest my-wicked-app -- --template vanilla-ts`
- Yarn: `yarn create vite my-wicked-app --template vanilla-ts`
- PNPM: `pnpm create vite my-wicked-app --template vanilla-ts`
- BUN: `bun create vite my-wicked-app --template vanilla-ts`
- Deno: `deno run -A npm:create-vite@latest --template vanilla-ts my-wicked-app`

You can replace `my-wicked-app` with the name of your project and also replace `vanilla-ts` with `vanilla` if you prefer JavaScript.

Then navigate to the project directory:

```bash
cd my-wicked-app
```

Then install the library using the package manager of your choice:

- NPM: `npm install wickedstate`
- Yarn: `yarn add wickedstate`
- PNPM: `pnpm add wickedstate`
- BUN: `bun add wickedstate`
- Deno: `deno add jsr:@devhammed/wickedstate`

And open `src/main.ts` in your editor and replace the content with the following:

```ts
import { render } from 'wickedstate';

render(document.body).then(() => {
  console.log('App is ready');
});
```

Then open the `index.html` file and replace the content with the following:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + TS</title>
  </head>
  <body>
    <div *state="{ count: 0 }">
        <h1 *text="count"></h1>
        <button *on[click]="count++" type="button">Increment</button>
        <button *on[click]="count--" type="button">Decrement</button>
    </div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

And then run the following command to start the development server:

```bash
npm run dev
```

Go to `http://localhost:5173` in your browser to see the app in action.

## Directives

A directive is a special HTML attribute that is recognized by the library which instructs it what to do with the element.

The syntax for a directive is `<tag *name[type].modifiers[value]="expression" />` where:

- `tag` is the HTML tag name e.g. `div`, `button`, `input`, etc.
- `name` is the name of the directive e.g. `state`, `on`, `text`, etc.
- `type` serves as an identifier for the directive, and it is optional but some directives like `on` requires it to differentiate between different events e.g `*on[click]`, `*on[submit]`, etc.
- `modifiers` are used to modify the behavior of the directive, you can repeat modifiers but not on the same directive e.g. `*on[click].once`, `*on[click].prevent`, `*on[click].once.prevent`, etc.
- `value` is the value of a modifier for the ones that requires it e.g. `*on[input].debounce[500ms]`, `*on[resize].window.debounce[300ms]`, etc.
- `expression` is the attribute value that will be evaluated as a JavaScript expression e.g. `*state="{ count: 0 }"`, `*on[click]="count++"`, etc.

You can also notice that the directive is prefixed with an asterisk `*` to differentiate it from a regular HTML attribute.

Now let's take a look at the available built-in directives:

### `state`

Declares a component and its data for a block of HTML elements.

```html
<div *state="{ count: 0 }">
    ...
</div>
```

### `on`

Listen for browser events on an element

```html
<button *on[click]="count++" type="button">Increment</button>
```

If you wish to access the native JavaScript event object from your expression, you can use `$event` magic property:

```html
<input *on[input]="console.log($event.target.value)" type="text" />
```

The `on` directive also supports the following modifiers:

#### `once`

Listen to the event only once.

```html
<button *on[click].once="count++" type="button">Increment</button>
```

#### `prevent`

Prevent the default behavior of the event.

```html
<form *on[submit].prevent="alert('Form submitted!')">
    <button type="submit">Submit</button>
</form>
```

#### `stop`

Stop the propagation of the event.

```html
<div *on[click]="alert('Div clicked!')">
    <button *on[click].stop="alert('Button clicked!')" type="button">Click Me</button>
</div>
```

#### `window`

Listen for the event on the window object.

```html
<input type="search" *on[keydown].esc.window="console.log('Escape key pressed!')"/>
```

#### `document`

Listen for the event on the document object.

```html
<input type="search" *on[keydown].esc.document="console.log('Escape key pressed!')"/>
```

#### `self`

Listen for the event only if the event was dispatched from the element itself.

```html
<button type="button" *on[click].self="alert('Div clicked!')">
    Click Me
    
    <img src="https://placekitten.com/200/300" alt="Kitten" />
</button>
```

With the `self` modifier, the alert will only be triggered if the button itself is clicked and not the image inside the button.

#### `debounce`/`throttle`

Debounce or throttle the event listener.

```html
<input type="search" *on[input].debounce[500ms]="console.log($event.target.value)"/>

<input type="search" *on[input].throttle[500ms]="console.log($event.target.value)"/>
```

The `debounce` modifier will wait for the specified time before executing the expression while the `throttle` modifier will execute the expression at most once every specified time.

For the duration, the time can be specified in milliseconds `ms` or seconds `s` or minutes `m` e.g. `500ms`, `1s`, `2m`, etc.

#### `passive`

You can add `.passive` to your listeners to not block scroll performance when on touch devices.

```html
<div *on[scroll].passive="console.log('Scrolling...')">
    ...
</div>
```

#### `capture`

Execute the event listener during the capture phase of the event.

```html
<div *on[click].capture="console.log('Capturing...')">
    ...
</div>
```

#### `away`

Listen for the event if it was dispatched outside the element.

```html
<div *state="{ open: false }" *on[click].away="open = false">
    <button *on[click]="open = ! open" type="button">Toggle</button>
    <div *show="open">This is a dropdown</div>
</div>
```

#### Keyboard Modifiers

You can also use the following keyboard modifiers to tweak your keyboard event listeners:

- `.esc` - Escape key
- `.enter` - Enter key
- `.space` - Space key
- `.tab` - Tab key
- `.meta` - Meta/Command/Windows/Super key (aliased to `cmd`, `super`)
- `.ctrl` - Control key
- `.alt` - Alt key
- `.shift` - Shift key
- `.backspace` - Backspace key
- `.delete` - Delete key
- `.caps` - Caps Lock key
- `.slash` - Slash key
- `.period` - Period/Dot/Full Stop key
- `.equal` - Equal/Plus key
- `.comma` - Comma key
- `.up` - Up arrow key
- `.down` - Down arrow key
- `.left` - Left arrow key
- `.right` - Right arrow key

### `text`

Sets the text content of an element.

```html
<h1 *text="count"></h1>
```

### `html`

Sets the inner HTML of an element (this directive is very dangerous and should only be used with trusted input).

```html
<div *html="post.content"></div>
```

### `show`

Toggle the visibility of an element based on the truthiness of an expression.

```html
<div *state="{ open: false}">
    <div *show="open">This is a hidden content</div>
    <button *on[click]="open = !open" type="button">Toggle</button>
</div>
```

### `ref`

Reference elements directly by their specified keys using the `$refs` magic property.

```html
<button data-text="Copy Me" *ref="copyButton" *on[click]="navigator.clipboard.writeText($refs.copyButton.dataset.text)">
    Copy
</button>
```

### `if`

Conditionally render an element based on the truthiness of an expression.

```html
<div *state="{ loggedIn: false }">
    <template *if="loggedIn">
        <div>Welcome back!</div>
    </template>
    <template *if="! loggedIn">
        <div>Please login to continue</div>
    </template>
    <button *on[click]="loggedIn = !loggedIn" type="button" *text="loggedIn ? 'Logout' : 'Login'"></button>
</div>
```

NOTE: `*if` MUST be declared on a `<template>` element and that `<template>` element MUST contain only one root element.

### `for`

Loop over an array or object and render a template for each item.

```html
<template *for="post in posts">
  <h2 *text="post.title"></h2>
</template>
```

You can also get the index of the current item by using the following syntax:

```html
<template *for="(post, index) in posts">
  <h2 *text="index + 1 + '. ' + post.title"></h2>
</template>
```

It is also important to specify a unique key for each item in the list to help the library keep track of the items and update the DOM efficiently. You can do this by adding a colon `:` after the `in` keyword followed by the key expression.

```html
<template *for="post in posts : post.id">
  <h2 *text="post.title"></h2>
</template>
```

NOTE: `*for` MUST be declared on a `<template>` element and that `<template>` element MUST contain only one root element.

### `model`

Two-way data binding for form elements.

```html
<input *model="name" type="text" />
<p *text="name"></p>
```
