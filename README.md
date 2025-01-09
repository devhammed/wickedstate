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
