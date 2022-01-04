export class EachPerson {
    public name: string;
    public amount: number;
    
    constructor(name: string,amount: number) {
        this.name=name[0].toUpperCase()+name.substr(1).toLowerCase();
        this.amount=amount;
    }

    getName(): string {
        return this.name;
    }

    setAmount(amount: number) {
        this.amount = this.amount + amount;
    }
}