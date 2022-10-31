let nullvote = [...new Array(20)].map(() => 0);
let vote0 = [...new Array(20)].map(() => 0);
let vote1 = [...new Array(20)].map(() => 0);
let vote2 = [...new Array(20)].map(() => 0);
let vote3 = [...new Array(20)].map(() => 0);
let vote4 = [...new Array(20)].map(() => 0);
vote0[0] = 1
vote1[0] = 1
vote2[1] = 3
vote3[2] = 4
vote4[2] = 1

console.log(`vote0 ${vote0}`);
console.log(`vote1 ${vote1}`);
console.log(`vote2 ${vote2}`);
console.log(`vote3 ${vote3}`);
console.log(`vote4 ${vote4}`);

let votes = [...new Array(1024)].map(() => nullvote);
votes[0] = vote0;
votes[1] = vote1;
votes[2] = vote2;
votes[3] = vote3;
votes[4] = vote4;

votes = votes.concat();
console.log(`votes ${votes}`);
console.log(`votes length ${votes.length}`);

let result = [2, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

console.log(`result ${result}`);
console.log(`result length ${result.length}`);