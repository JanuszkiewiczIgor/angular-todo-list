import { Component, OnInit } from '@angular/core';

interface IItem {
  todo: string,
  date: string,
  done: boolean
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = "todo-list";

  today = new Date().toISOString().slice(0, 10);

  items: IItem[] = [];
  items_list: IItem[] = [];

  help(): void {
    console.log(`Aby dodać item do listy należy:\n1. Podać jego treść\n2. Podać datę wygaśnięcia itemu\n3. Kliknąć przycisk "Add Item"\n\n\nPrzycisk "Clear List" czyści całą liste itemów\n\n\nNa liście itemy zostają przekreślone jeśli ich określona data wygaśnięcia minie. (przy załadowaniu strony)\n\nKliknięcie na item na liście:\n1. Za pierwszym kliknięciem, stan itemu jest taki sam jakby data wygasnęła.\n2. Za drugim kliknięciem, item zostaje usunięty.`);
  }

  sortList(value: string): void {
    switch(value) {
      default:
        break;

      case "1":
        this.items_list = this.items;
        break;

      case "2":
        this.items_list = [];
        for(let i = 0; i < this.items.length; i++) {
          if(this.items[i].done) continue;
          this.items_list.push(this.items[i]);
        }
        break;

      case "3":
        this.items_list = [];
        for(let i = 0; i < this.items.length; i++) {
          if(!this.items[i].done) continue;
          this.items_list.push(this.items[i]);
        }
        break;
    }
  }

  devButton(): void {
    console.log(this.items == this.items_list);
    this.loadItems();
  }

  changingTodosStatus(): void {
    for(let i = 0; i < this.items.length; i++) {
      if(Date.parse(this.items[i].date) < Date.parse(this.today)) {
        this.items[i].done = true;
      }
    }
  }

  loadItems(): void {
    let todos: string = localStorage.getItem("todos")??"[]";
    let todos_array: IItem[] = JSON.parse(todos);
    this.items = todos_array;
    this.changingTodosStatus();
  }

  itemsArrayToString(): string {
    let items_string: string = "[";

    for(let i = 0; i < this.items.length; i++) {
      if(i == this.items.length - 1){
        items_string += `${JSON.stringify(this.items[i])}`;
        continue;
      }
      items_string += `${JSON.stringify(this.items[i])}, `;
    }

    items_string += "]";

    return items_string;
  }

  saveItems(): void {
    localStorage.setItem("todos", `${this.itemsArrayToString()}`);
  }

  addItem(todo: string, date: string): void {
    this.itemsArrayToString();
    if(todo == "" || date == "") return;
    let item: IItem = {
      "todo" : todo,
      "date" : date,
      "done" : false
    };
    this.items.push(item);
    this.saveItems();
    this.items_list = this.items;
  }

  deleteItem(index: number): void {
    if(this.items[index].done) {
      this.items.splice(index, 1);
      this.saveItems();
      return;
    }
    this.items[index].done = true;
    this.saveItems();
    this.items_list = this.items;
  }

  clearList(): void {
    this.items = [];
    this.saveItems();
    this.items_list = this.items;
  }

  ngOnInit(): void {
    this.loadItems();
    this.items_list = this.items;
  }
}
