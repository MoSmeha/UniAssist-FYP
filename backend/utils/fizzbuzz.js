for (let i = 0; i < 101; i++) {
  let word = "";
  if (i % 3) {
    word === "fizz";
  } else if (i % 5) {
    word === "buzz";
  } else if (i % 5 && i % 3) {
    word === "fizzbuzz";
  } else {
    word === "";
  }
  console.log(`${i} - ${word}`);
}
const test = 15 % 5;
console.log(test);
let hello = true ? test === false : false;
console.log(hello);
