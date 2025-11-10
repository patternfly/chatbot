# PatternFly ChatBot

This PatternFly extension library provides components based on PatternFly 6 that can be used to build chatbots.

---

## Install
  
To use the chatbot extension in your project, run

```
npm install @patternfly/chatbot --save
```

Make sure to add the CSS imports as the last import in your index file. The extension is intended to override certain PatternFly component styles. However, if it's not the last import, you may not see these.

```
import '@patternfly/chatbot/dist/css/main.css';
```

If you are using React 17, ChatBot currently has a dependency on [react-markdown](https://github.com/remarkjs/react-markdown) that relies on React 18 and 19. There is an older version of react-markdown (8.0.7) that supports 17, but it does not have support for 19. You should be able to add `"react"` and `"react-dom"` of the appropriate version to the `overrides` section of your `package.json` file if you need to use ChatBot with 17.

## Contribution guide

### AI-assisted development guidelines

Please reference [PatternFly's AI-assisted development guidelines](https://github.com/patternfly/.github/blob/main/CONTRIBUTING.md) if you'd like to contribute code generated using AI.

### To add a new assistant sub-component:

1. create a folder in `src/` matching its name (for example `src/MyComponent`)
2. to the new folder add a new `.tsx` file named after the component (for example `src/MyComponent/MyComponent.tsx`)
3. to the same folder include an `index.ts` which will export the component as a default and then all necessary interfaces
4. if this file structure is not met, your component won't be exposed correctly

#### Example component:

```
import type { FunctionComponent } from 'react';
import { Text } from '@patternfly/react-core';

// do not forget to export your component's interface
// always place the component's interface above the component itself in the code
export interface MyComponentProps {
  text: String;


// do not use the named export of your component, just a default one
const MyComponent: FunctionComponent<MyComponentProps> = () => {

  return (
    <Text>
      This is my new component
    </Text>
  );
};

export default MyComponent;
```

#### Index file example:

```
export { default } from './MyComponent';
export * from './MyComponent';
```

#### Component directory structure example:

```
src
|- MyComponent
   |- index.ts
   |- MyComponent.tsx
```

### Component's API rules:

- prop names comply with PatternFly components naming standards (`variant`, `onClick`, `position`, etc.)
- the API is maximally simplified and all props are provided with a description
- it is built on top of existing PatternFly types without prop omitting
- it is well documented using the PatternFly documentation (`/packages/module/patternfly-docs/content/extensions/chatbot/examples/MyComponent/MyComponent.md`) with examples of all possible use cases (`packages/module/patternfly-docs/content/extensions/chatbot/examples/MyComponent/MyComponent[...]Example.tsx`)

#### Component API definition example:

```
// when possible, extend available PatternFly types
export interface MyComponentProps extends ButtonProps {
    customLabel: Boolean
};

export const MyComponent: FunctionComponent<MyComponentProps> = ({ customLabel, ...props }) => ( ... );
```

#### Markdown file example:

Note: You'll need to add any imports required in a component usage file example like MyComponentExample.tsx, below, here as well.

````
---
section: extensions
subsection: ChatBot
id: MyComponent
propComponents: ['MyComponent']
---

import MyComponent from "@patternfly/chatbot/dist/dynamic/MyComponent";

## Component usage

MyComponent has been created to demo contributing to this repository.

### MyComponent component example label

```js file="./MyComponentExample.tsx"```

````

#### Component usage file example: (`MyComponentExample.tsx`)

Note: You'll need to add any imports required here in the parent folder's markdown file as well.

```
import type { FunctionComponent } from 'react';

const MyComponentExample: FunctionComponent = () => (
  <MyComponent customLabel="My label">
);

export default BatteryLowExample;
```

### Sub-components:

When adding a component for which it is advantageous to divide it into several sub-components make sure:

- component and all its sub-components are located in separate files and directories straight under the `src/` folder
- sub-components are exported and documented separately from their parent
- parent component should provide a way to pass props to all its sub-components

The aim is to enable the user of our "complex" component to use either complete or take advantage of its sub-components and manage their composition independently.

### Testing:

When adding/making changes to a component, always make sure your code is tested:

- use React Testing Library for unit testing
- add unit tests to a `[ComponentName].test.tsx` file to your component's directory
- make sure all the core functionality is covered using Cypress component or E2E tests
- add component tests to `cypress/component/[ComponentName].cy.tsx` file and E2E tests to `cypress/e2e/[ComponentName].spec.cy.ts`
- add `ouiaId` to component props definition with a default value of the component name (for subcomponents, let's use `ComponentName-element-specification` naming convention e.g. `ouiaId="VirtualAssistant-send-button"`)

### Styling:

- for styling always use CSS
- new classNames should be named in camelCase starting with the name of a given component and following with more details clarifying its purpose/component's subsection to which the class is applied (`actionMenu`, `actionMenuDropdown`, `actionMenuDropdownToggle`, etc.)
- do not use `pf-v6-u-XXX` classes, use CSS variables in a custom class instead (styles for the utility classes are not bundled with the standard patternfly.css - it would require the consumer to import also addons.css)

---

## Building for production

- run `npm install`
- run `npm run build`

## Development

- run `npm install`
- run `npm run build`
- run `npm run start` to build and start the development server

## Testing and Linting

- run `npm run test` to run the tests
- run `npm run lint` to run the linter

## A11y testing

- run `npm run build:docs` followed by `npm run serve:docs`, then run `npm run test:a11y` in a new terminal window to run our accessibility tests. Once the accessibility tests have finished running you can run
- `npm run serve:a11y` to locally view the generated report

## Generating screenshots

From root folder:

```sh
npm install
npm run build
cd packages/module
npm run docs:build
npm run docs:serve
```

Open a new terminal tab while serving; make sure you are in package/module folder:

```sh
npm run docs:screenshots
```

These files will not be picked up by git; you'll have to look for them and add them manually.
