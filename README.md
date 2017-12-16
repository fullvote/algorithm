# Full Vote - Algorithm

### What is FullVote? What problem is it solving? How?

[Website](www.fullvote.org) | [Repo](www.fullvote.org)


## Installation

This module is distributed via [npm][https://www.npmjs.com/] which is bundled
with [node][https://nodejs.org] and should be installed as one of your
project's `dependencies`:

```
npm install --save fullvote
```

> If used in the browser, most bundlers respect the `browser` property in
> package.json and will include the transpiled/minified version in the built
> `lib/algorithm/index.js`. NOTE: Depends on the babel
> [polyfill](https://babeljs.io/docs/usage/polyfill/)


## Usage

```
const { getWinner } = require('fullvote');
// OR
// import { getWinner} from 'fullvote';

const ballots = [
 ['bush', 'cruz'],
 ['rubio', 'cruz'],
 ['cruz', 'rubio'],
 ['cruz', 'bush'],
 ['trump'],
 ['trump'],
 ['trump']
];
const winner = getWinner(ballots);
/*
  {
    success: true,
    names: [ 'cruz' ],
    received: 4,
    total: 7,
    percentage: 57.14
  }
*/
```

## Usage outside of Javascript

See the fullvote [service](https://github.com/fullvote/fullvote-service).
