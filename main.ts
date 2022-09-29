import {Computer} from "../model/computer";
import {ComputerManager} from "../service/computerManager";
import {User} from "../model/user";
import {UserManager} from "../service/userManager";
import {Service} from "../model/service";
import {ServiceManager} from "../service/serviceManager";
import {OrderDetail} from "../model/orderDetail";
import {OrderDetailManager} from "../service/orderDetailManager";

let input = require('readline-sync');
// import fs from 'fs'
//
// fs.readFile('../money.json', 'utf-8', (err, data) => {
//     const result = JSON.parse(data)
//     console.log(result)
// })
//
// const data = {money: [{'01/09/2022': 1000000}]}

// fs.writeFile('../money.json', JSON.stringify(data) , (err) => {
//     if (err) console.log(err)
//     console.log('Done')
// })

class Main {
    computerManager: ComputerManager = new ComputerManager();
    userManager: UserManager = new UserManager();
    serviceManager: ServiceManager = new ServiceManager()
    orderDetailManager: OrderDetailManager = new OrderDetailManager();

    mainMenu() {
        let usernameLogin = "";
        let passwordLogin = "";

        console.log("----------Login----------")
        usernameLogin = input.question("Ten Dang Nhap: ")
        passwordLogin = input.question("Mat Khau: ")
        if (usernameLogin == 'admin' && passwordLogin == 'admin') {
            console.log("dang nhap thanh cong!")
            this.menuAdmin()
        } else {
            console.log("nhap sai tai khoan hoac mat khau!")
        }
    }

    menuAdmin() {
        let menu = `----------Admin----------\n1.Quan ly nguoi dung\n2.Quan ly may tinh\n0.Dang xuat`
        let choice: number;
        do {
            console.log(menu);
            choice = +input.question("nhap lua chon: ");
            switch (choice) {
                case 1:
                    this.menuUserManager()
                    break;
                case 2:
                    this.menuComputerManager()
                    break;
                case 0:
                    this.mainMenu()
                    break;
                default:
                    console.log("khong co lua chon, moi nhap lai!")
            }
        } while (choice != 0)
    }

    menuUserManager() {
        let menu = `----------User Management----------\n1.Them moi nguoi dung\n2.Chinh sua tai khoan nguoi dung\n3.Xoa tai khoan nguoi dung\n4.Danh sach tat ca tai khoan nguoi dung\n0.Thoat`
        let choice: number;
        do {
            console.log(menu)
            choice = +input.question("nhap lua chon cua ban: ");
            switch (choice) {
                case 1:
                    this.addUser()
                    break;
                case 2:
                    this.editUser()
                    break;
                case 3:
                    this.removeUser()
                    break;
                case 4:
                    this.showListUser()
                    break;
                case 0:
                    this.menuAdmin()
                    break;
                default:
                    console.log("khong co lua chon, moi nhap lai!")
            }
        } while (choice != 0)
    }

    addUser() {
        console.log("----------Them Tai Khoan----------")
        let usernameRegex = /^[a-z0-9_-]{5,15}$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        let username = input.question("nhap ten dang nhap moi: ");
        let password = input.question("nhap mat khau moi: ");

        let user = new User(username, password);
        this.userManager.add(user);
    }

    showListUser() {
        console.log("----------Danh sach tai khoan----------")
        this.userManager.findAll()
    }

    editUser() {
        this.showListUser()
        let id = +input.question("nhap so thu tu tai khoan muon sua: ")
        let username = input.question("nhap ten dang nhap moi: ");
        let password = input.question("nhap mat khau moi: ");
        let user = new User(username, password);
        this.userManager.edit(id, user)
        console.log("Chinh sua tai khoan thanh cong!")
    }

    removeUser() {
        this.showListUser()
        let id = +input.question("nhap so thu tu tai khoan muon xoa: ");
        for (let i = 0; i < this.userManager.listUser.length; i++) {
            if ((i + 1) == id) {
                let menu = `----------Xoa tai khoan----------\n1.Co\n2.Khong\n0.Thoat`
                let choice: number;
                do {
                    console.log(menu)
                    choice = +input.question("nhap lua chon cua ban: ");
                    switch (choice) {
                        case 1:
                            this.userManager.listUser.splice(id - 1, 1)
                            console.log("Xoa thanh cong!")
                            break;
                        case 2:
                            this.removeUser()
                            break;
                        case 0:
                            this.menuUserManager()
                            break;
                    }
                } while (choice != 0)
            }
        }
    }

    menuComputerManager() {
        let menu = `----------Computer Management----------\n1.Hien thi danh sach may\n2.Them mot may moi\n3.Sua thong tin may\n4.Xoa mot may khoi danh sach\n5.Dich vu\n6.Chinh sua tien gio choi\n7.Doanh thu\n0.Thoat`
        let choice: number;
        do {
            console.log(menu);
            choice = +input.question("nhap lua chon cua ban: ");
            switch (choice) {
                case 1:
                    this.menuListComputer()
                    break;
                case 2:
                    this.addComputer()
                    break;
                case 3:
                    this.editComputer()
                    break;
                case 4:
                    this.menuRemoveComputer()
                    break;
                case 5:
                    this.menuService()
                    break;
                case 6:
                    this.editPriceNet()
                    break;
                case 7:
                    this.menuTurnoverNet()
                    break;
                case 0:
                    this.menuAdmin()
                    break;
                default:
                    console.log("khong co lua chon, moi nhap lai!")
            }
        } while (choice != 0)
    }

    menuListComputer() {
        let menu = `----------List Computer----------\n1.Xem danh sach tat ca may tinh\n2.Xem danh sach may tinh hoat dong\n3.Xem danh sach may tinh khong hoat dong\n0.Thoat`
        let choice: number;
        do {
            console.log(menu);
            choice = +input.question("nhap lua chon cua ban: ");
            switch (choice) {
                case 1:
                    console.log("----------List All Computer----------")
                    this.computerManager.findAll()
                    break;
                case 2:
                    if (this.computerManager.findComputerOnline().length == 0) {
                        console.log("khong co may tinh hoat dong!")

                    } else {
                        this.menuChoiceComputerOnline()
                    }
                    break;
                case 3:
                    if (this.computerManager.findComputerOffline().length == 0) {
                        console.log("tat ca may tinh dang hoat dong!")

                    } else {
                        this.menuTurnOnComputer()
                    }
                    break;
                case 0:
                    this.menuComputerManager()
                    break;
                default:
                    console.log("khong co lua chon, moi nhap lai!")
            }
        } while (choice != 0)
    }

    menuTurnOnComputer() {
        let menu = `----------Turn On Computer----------\n1.Chon may can bat\n0.Thoat`
        let choice: number;
        do {
            console.log(menu);
            choice = +input.question("nhap lua chon cua ban: ");
            switch (choice) {
                case 1:
                    this.turnOnComputer()
                    break;
                case 0:
                    this.menuListComputer()
                    break;
                default:
                    console.log("khong co lua chon, moi nhap lai!")
            }
        } while (choice != 0)
    }

    turnOnComputer() {
        let listComputerOff = this.computerManager.findComputerOffline()
        console.log("----------Turn On Computer----------")
        let id = +input.question("nhap id may can bat: ");
        for (let i = 0; i < listComputerOff.length; i++) {
            if (i + 1 == id) {
                listComputerOff[i].status = true
                console.log("Bat may tinh thanh cong!")
            }
        }
    }

    menuChoiceComputerOnline() {
        let menu = `----------Computer----------\n1.Chon may tinh\n0.Thoat`
        let choice: number;
        do {
            console.log(menu);
            choice = +input.question("nhap lua chon cua ban: ");
            switch (choice) {
                case 1:
                    console.log("----------Computer----------")
                    this.choiceComputerOnline()
                    break;
                case 0:
                    this.menuListComputer()
                    break;
                default:
                    console.log("khong co lua chon, moi nhap lai!")
            }
        } while (choice != 0)
    }

    choiceComputerOnline() {
        this.computerManager.findComputerOnline()
        let id = +input.question("nhap so thu tu may tinh: ");
        this.computerManager.findComputerById(id)
        this.menuOrderAndBill()
    }

    menuOrderAndBill() {
        let menu = `----------Bill and Order----------\n1.Tinh tien may\n2.Chon dich vu\n0.Thoat`
        let choice: number;
        do {
            console.log(menu);
            choice = +input.question("nhap lua chon cua ban: ");
            switch (choice) {
                case 1:
                    console.log("----------Bill----------");
                    this.totalBill()
                    break;
                case 2:
                    console.log("----------Order Service----------")
                    this.buyService()
                    break;
                case 0:
                    this.computerManager.findComputerOnline()
                    break;
                default:
                    console.log("khong co lua chon, moi nhap lai!")
            }
        } while (choice != 0)
    }

    buyService() {
        let idOrder = +input.question("nhap id hoa don: ");
        this.showListService()
        let idService = +input.question("nhap id san pham: ");
        let service = this.serviceManager.findServiceById(idService);
        console.log(service)
        let amount = +input.question("nhap so luong muon mua: ");
        let choiceService = new Service(service.id, service.name, amount, service.price * amount);
        for (let i = 0; i < this.serviceManager.listService.length; i++) {
            if (this.serviceManager.listService[i].id == service.id) {
                this.serviceManager.listService[i].quantity = this.serviceManager.listService[i].quantity - amount;
            }
        }
        let orderDetail = new OrderDetail(idOrder);
        orderDetail.add(choiceService);
        this.orderDetailManager.add(orderDetail)
        console.log("Mua thanh cong!")
        return orderDetail.totalMoneyOrder(idOrder)
    }

    totalBill() {
        let id = +input.question("nhap id may tinh tinh tien: ")
        let totalService = this.orderDetailManager.findOrderById(id).totalMoneyOrder(id);
        let totalTimeNet = this.computerManager.totalTimeNet(id);
        console.log("Tong tien dich vu: " + totalService, "Tong tien thoi gian: " + totalTimeNet)
        let totalBill = totalService + totalTimeNet;
        console.log("Tong hoa don: " + totalBill)
    }

    addComputer() {
        console.log("----------Add New Computer----------")
        let id = +input.question("nhap id may tinh moi: ");
        let check = true;
        for (let i = 0; i < this.computerManager.listComputer.length; i++) {
            if (id == this.computerManager.listComputer[i].id) {
                console.log("id da ton tai!")
                check = false;
                break;
            }
        }
        if (check) {
            let t = new Date()
            let newComputer = new Computer(id, false, t);
            this.computerManager.add(newComputer);
            console.log("Them thanh cong may tinh moi!")
        }
    }

    editComputer() {
        this.computerManager.findAll()
        let id = +input.question("nhap id may tinh can sua: ");
        let check = false
        for (let i = 0; i < this.computerManager.listComputer.length; i++) {
            if (id == this.computerManager.listComputer[i].id) {
                check = true
            }
        }
        if (check) {
            let newId = +input.question("nhap so id moi cho may: ");
            let t = new Date()
            let newComputer = new Computer(newId, false, t)
            this.computerManager.edit(id, newComputer);
            console.log("Sua thong tin may thanh cong!")
        } else {
            console.log("khong ton tai id may!")
        }

    }

    menuRemoveComputer() {
        let menu = `----------Remove Computer----------\n1.Chon may xoa\n0.Thoat`
        let choice: number;
        do {
            console.log(menu);
            choice = +input.question("nhap lua chon cua ban: ");
            switch (choice) {
                case 1:
                    console.log("----------Remove Computer----------")
                    this.menuChoiceComputerRemove()
                    break;
                case 0:
                    this.menuComputerManager()
                    break;
                default:
                    console.log("khong co lua chon, moi nhap lai!")
            }
        } while (choice != 0)
    }

    menuChoiceComputerRemove() {
        let menu = `1.Xac nhan\n0.Khong`
        let choice: number;
        this.computerManager.findAll();
        let id = +input.question("nhap id may can xoa: ");
        let check = false
        for (let i = 0; i < this.computerManager.listComputer.length; i++) {
            if (id == this.computerManager.listComputer[i].id) {
                check = true
            }
        }
        if (check) {
            do {
                console.log(menu);
                let endLoop = false
                choice = +input.question("nhap mua chon cua ban: ");
                switch (choice) {
                    case 1:
                        this.computerManager.remove(id)
                        console.log("Xoa may tinh thanh cong!")
                        endLoop = true
                        break;
                    case 0:
                        this.menuRemoveComputer()
                        break;
                    default:
                        console.log("khong co lua chon, moi nhap lai!")
                }
                if (endLoop) break;
            } while (choice != 0);
        } else {
            console.log("khong ton tai id may!")
        }

    }

    menuService() {
        let menu = `----------Menu Service----------\n1.Them dich vu\n2.Sua dich vu\n3.Xoa dich vu\n4.Danh sach dich vu\n0.Thoat`
        let choice: number;
        do {
            console.log(menu);
            choice = +input.question("nhap lua chon cua ban: ")
            switch (choice) {
                case 1:
                    this.addService()
                    break;
                case 2:
                    this.editService()
                    break;
                case 3:
                    this.removeService()
                    break;
                case 4:
                    this.showListService()
                    break;
                case 0:
                    this.menuComputerManager()
                    break;
                default:
                    console.log("khong co lua chon, moi nhap lai!")
            }
        } while (choice != 0)
    }

    addService() {
        console.log("----------Add Service----------")
        let id = +input.question("nhap id dich vu moi: ");
        let check = true;
        for (let i = 0; i < this.serviceManager.listService.length; i++) {
            if (id == this.serviceManager.listService[i].id) {
                console.log("id da ton tai!");
                check = false;
                break
            }
        }
        if (check) {
            let name = input.question("nhap ten dich vu moi: ");
            let quantity = +input.question("nhap so luong dich vu moi: ");
            let price = +input.question("nhap gia dich vu moi: ");
            let newService = new Service(id, name, quantity, price);
            this.serviceManager.add(newService)
        }

    }

    editService() {
        console.log("----------Edit Service----------")
        this.showListService()
        let id = +input.question("nhap id dich vu can sua: ");
        let check = false;
        for (let i = 0; i < this.serviceManager.listService.length; i++) {
            if (id == this.serviceManager.listService[i].id) {
                check = true;
            }
        }
        if (check) {
            let index = this.serviceManager.findById(id)
            let name = input.question("nhap ten dich vu moi: ");
            let quantity = +input.question("nhap so luong dich vu moi: ");
            let price = +input.question("nhap gia dich vu moi: ");
            this.serviceManager.listService[index] = new Service(id, name, quantity, price)
            console.log("Sua thanh cong dich vu!")
        } else {
            console.log("khong ton tai id dich vu!")
        }

    }

    removeService() {
        console.log("----------Remove Service----------")
        this.showListService()
        let id = +input.question("nhap id dich vu muon xoa: ");
        let check = false;
        for (let i = 0; i < this.serviceManager.listService.length; i++) {
            if (id == this.serviceManager.listService[i].id) {
                check = true;
            }
        }
        if (check) {
            this.orderDetailManager.remove(id);
            console.log("Xoa dich vu thanh cong!")
        } else {
            console.log("khong ton tai id dich vu!")

        }

    }

    showListService() {
        console.log("----------List Service----------")
        this.serviceManager.findAll()
    }

    editPriceNet() {
        let price = +input.question("nhap so tien 1 gio choi moi: ");
        this.computerManager.editPriceNet(price);
        console.log("Chinh sua thanh cong!")
    }

    menuTurnoverNet() {
        let menu = `----------List Turnover----------\n1.Doanh thu ngay\n2.Doanh thu thang\n3.Tong doanh thu\n0.Thoat`
        let choice: number;
        do {
            console.log(menu);
            choice = +input.question("nhap lua chon cua ban: ");
            switch (choice) {
                case 1:
                    this.totalMoneyDay()
                    break;
                case 2:
                    this.totalMoneyMonth()
                    break;
                case 3:
                    this.totalMoneyAll()
                    break;
                case 0:
                    this.menuComputerManager()
                    break;
                default:
                    console.log("khong co lua chon, moi nhap lai!")
            }
        } while (choice != 0)
    }

    totalMoneyDay(){

    }

    totalMoneyMonth(){

    }

    totalMoneyAll(){

    }
}

let main = new Main()
main.mainMenu()