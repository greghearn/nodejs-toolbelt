'use strict';

class Hello {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `Hello ${this.name}`;
  }
}

module.exports.getRandomString = () => 'abc123';

module.exports = Hello;
