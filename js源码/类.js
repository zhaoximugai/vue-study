
class Person {
    age=18
    constructor(name) {
        this.name = name
    }

    say() {
        console.log(this.name+'，您好，我是drop');
    }
}
let p = new Person('人')
p.say()
console.log(p);


