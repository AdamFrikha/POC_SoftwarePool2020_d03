const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class MyDB {
    constructor(data) {
        this.data = data;
    }

    async save(path) {
        let db = JSON.stringify(this.data, null, ' ');
        return fs.writeFile(path, db);
    }

    static async load(path) {
        let file = await fs.readFile(path);
        file = JSON.parse(file.toString());
        return new MyDB(file);
    }

    createUser(firstname, lastname) {
        let ID_tmp = uuidv4();
        if (!this.data.user)
            this.data.user = [];
        if (!this.data.user.ID)
            this.data.user.ID = [];
        const existing_user = this.data.user.some(user => lastname === user.lastname && firstname === user.firstname);
        const existing_ID = this.data.user.ID.some(user => ID_tmp === user.ID);
        if (existing_user) {
            console.log("user already existing");
            return
        }
        while (existing_ID) {
            ID_tmp = uuidv4();
        }
        this.data.user.push({ "firstname": firstname, "lastname": lastname, "ID": ID_tmp });
    }

    getUser(eyedi) {
        const find_ID = this.data.user.find(function (user) {
            return user.ID === eyedi;
        });
        console.log(find_ID);
    }

    updateUser(id, firstname, lastname) {
        const find_ID = this.data.user.find(function (user) {
            return user.ID === id;
        });
        find_ID.firstname = firstname;
        find_ID.lastname = lastname;
        console.log(find_ID);
    }

    deleteUser(id) {
        const find_ID = this.data.user.findIndex(function (user) {
            return user.ID === id;
        });
        this.data.user.splice(find_ID, 1);
    }

    createAccount(owner, initialBalance) {
        if (!this.data.account)
            this.data.account = [];
        const existing = this.data.account.some(user => owner === user.account);
        if (existing)  {
            console.log("account already existing");
            return
        }
            this.data.account.push({ "ID": owner, "Balance": initialBalance });
    }

    getAccount(id) {
        const find_ID = this.data.account.find(function (user) {
            return user.ID === id;
        });
        console.log(find_ID);
    }
    
    creditAccount(id, amount) {
        const find_ID = this.data.account.find(function (user) {
            return user.ID === id;
        });
        find_ID.Balance += amount;
        console.log(find_ID)
    }
    withdrawAccount(id, amount) {
        const find_ID = this.data.account.find(function (user) {
            return user.ID === id;
        });
        find_ID.Balance -= amount;
        console.log(find_ID)
    }
}

async function main() {
    const a = await MyDB.load('./db.json');
    a.createUser("Mossaab", "Elayoubi")
    //a.createAccount("ec2b3876-bc07-42d2-ae2b-3d1daee7fcb4", 100000000);
    a.save('./db.json');
}

main();