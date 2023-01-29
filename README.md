# bjj-viz (the name is a WIP)

Bjj-viz is a typescript project that provides a JSON interface for creating directed graphs using [graphviz](https://www.npmjs.com/package/graphviz). The graph nodes contain a name, can be created with certain colors, and additional comments. Its immediate application is meant for creating flow charts of specific scenarios for Brazilian Jiu Jitsu.

## Dependencies

Node.js (version 16.0.0+)
yarn (version 1.22.0+)

## Usage

**To compile**
```
$ yarn install
$ yarn build
```

**To run**
```
$ yarn start <input file>.json <output file>.svg
```
NOTE: input file must have a `.json` suffix, and the output file must have a `.svg` suffix.

Example:

```
yarn start docs/example.json docs/example.svg

```

**To test**
```
$ yarn test
```

Maintainer hello@katliu.me

## Model
A `Scenario` is a series of `Positions`, much like in Brazilian Jiu Jitsu. For each position, there are the following fields:

* `id`: Unique identifier of a single position. Not necessarily meant to be exposed to user.
* `type:` Whether or not the position is one done from the you or your opponent. Accepted values: `NORMAL | COUNTER`.
* `name`: Human-readable name for the position. Not required to be unique.
* `details`: (Optional) Additional details for the specific move
* `next`: (Optional) Array of integers signaling the next positions for the scenario.
* `parent`: Optional for the first position, but always points to the previous for any other position.

