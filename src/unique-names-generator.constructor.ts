/* eslint-disable @typescript-eslint/no-this-alias */
// Copyright (c) 2018-2022 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { getFromSeed } from './seed';

type Style = 'lowerCase' | 'upperCase' | 'capital';

export interface Config {
  dictionaries: string[][];
  separator?: string;
  length?: number;
  style?: Style;
  seed?: number | string;
  random?: boolean;
}

export class UniqueNamesGenerator {
  private dictionaries: string[][];
  private length: number;
  private separator: string;
  private style: Style;
  private seed: number | string;
  private random: boolean;

  constructor(config: Config) {
    const { length, separator, dictionaries, style, seed, random } = config;

    this.dictionaries = dictionaries;
    this.separator = separator;
    this.length = length;
    this.style = style;
    this.seed = seed;
    this.random = random;
  }

  private shuffle(array: string[][]) {
    let currentIndex = array.length;
    let randomIndex: number;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  public generate(): string {
    if (!this.dictionaries) {
      throw new Error(
        'Cannot find any dictionary. Please provide at least one, or leave ' +
          'the "dictionary" field empty in the config object',
      );
    }

    if (this.length <= 0) {
      throw new Error('Invalid length provided');
    }

    if (this.length > this.dictionaries.length) {
      throw new Error(
        'The length cannot be bigger than the number of dictionaries.\n' +
          `Length provided: ${this.length}. Number of dictionaries provided: ${this.dictionaries.length}`,
      );
    }

    let seed = this.seed;
    const dictionaryArray = this.random
      ? this.shuffle(this.dictionaries).slice(0, this.length)
      : [...this.dictionaries.slice(0, this.length)];

    return dictionaryArray.reduce((acc: string, curr: string[]) => {
      let randomFloat: number;
      if (seed) {
        randomFloat = getFromSeed(seed);
        seed = randomFloat * 4294967296;
      } else {
        randomFloat = Math.random();
      }
      const rnd = Math.floor(randomFloat * curr.length);

      let word = curr[rnd] || '';
      if (this.style === 'lowerCase') {
        word = word.toLowerCase();
      } else if (this.style === 'capital') {
        const [firstLetter, ...rest] = word.split('');
        word = firstLetter.toUpperCase() + rest.join('');
      } else if (this.style === 'upperCase') {
        word = word.toUpperCase();
      }

      return acc ? `${acc}${this.separator}${word}` : `${word}`;
    }, '');
  }
}
