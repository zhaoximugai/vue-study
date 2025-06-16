//保存不定长参数
// function sum(...args) {
//     nums.push(...args)
//     if (nums.length >= 5) {
//         const res = nums.slice(0, 5).reduce((p, v) => p + v, 0)
//         nums = []
//         return res
//     } else {
//         return sum
//     }
// }
function sumMax(num) {
    let nums = []
    return function sum(...args) {
        nums.push(...args)
        if (nums.length >= num) {
            const res = nums.slice(0, num).reduce((p, v) => p + v, 0)
            nums = []
            return res
        } else {
            return sum
        }
    }
}
let sum = sumMax(3)
let res = sum(1, 2, 3,5)
console.log(res);
