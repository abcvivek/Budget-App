// Budget Control module

var budgetController = (function () {

    //Function constuctor to create similar kind of objects.

    var expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    // To add method to the constructor class using INHERITANCE

    expense.prototype.calcPer = function (totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else
            this.percentage = -1;
    };

    expense.prototype.getPer = function () {
        return this.percentage;
    };

    var income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Function to calculate the total of Expenses and Income

    var total = function (type) {

        var sum = 0;

        data.listItems[type].forEach(function (cur) {

            sum = sum + cur.value;

        });

        data.totals[type] = sum;
    };
  
    //data structure implementation

    var data = {
        listItems : {
            income : [],
            expense : []
        },
        totals : {
            income : 0,
            expense : 0
        },

        budget: 0,
        percentage : -1
    }

    //Public functions

    return {

        // Function to add Item in Data Structure

        addItem: function (type, desc, val) {
            var newItem, Id;

            //to generate unique id in both arrays
            if (data.listItems[type].length > 0)
                Id = data.listItems[type][data.listItems[type].length - 1].id + 1;
            else Id = 0;

            // Creating new Item

            if (type === 'income')
                newItem = new income(Id, desc, val);
            else if (type === 'expense')
                newItem = new expense(Id, desc, val);

            //pushing new item to datastructure

            data.listItems[type].push(newItem);

            return newItem;
        },

        // Function for adding the percentages to each expense value

        updatePercentage: function () {

            data.listItems.expense.forEach(function (cur) {
                cur.calcPer(data.totals.income);
            });
        },

        // Function to get Percentage of each Expenses

        getPercentage: function () {

            var per = data.listItems.expense.map(function (cur) {
                return cur.getPer();
            });

            return per;
        },

        // FUnction to delete an Item from Data Structures

        deleteItem: function (type,id) {

            var ids, idsIndex;

            ids = data.listItems[type].map(function(cur) {

                return cur.id;
            });

            idsIndex = ids.indexOf(id);

            if (idsIndex !== -1)
                data.listItems[type].splice(idsIndex, 1);

        },

        // Function to calculate whole budget

        calculateBudget: function () {

            // calculate income and expense total

            total('income');
            total('expense');

            // Total Budget

            data.budget = data.totals.income - data.totals.expense;

            // To Calculate the percentage

            if (data.budget > 0)
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            else data.percentage = -1;
           
        },

        // Function to return all data using a object

        getData: function () {
            return {
                income: data.totals.income,
                expense: data.totals.expense,
                budget: data.budget,
                percentage: data.percentage
            };
        },
    };




})();


// UI Control Module

var UIController = (function () {

    // Complete Dom Strings Object for DOM Manipulation

    var DOMStrings = {

        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budget: '.budget__value',
        income: '.budget__income--value',
        expense: '.budget__expenses--value',
        percentage: '.budget__expenses--percentage',
        container: '.container',
        expensePercentage: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var numberFormat = function (number , type) {

        var integer, numberSplit,decimal;

        number = Math.abs(number);

        number = number.toFixed(2);

        numberSplit = number.split('.');

        integer = numberSplit[0];

        if (integer.length > 3 && integer.length <= 5) {
            integer = integer.substr(0, integer.length - 3) + ',' + integer.substr(integer.length - 3, 3);
        }

        else if (integer.length > 5) {
            integer = integer.substr(0, integer.length - 5) + ',' + integer.substr(integer.length - 5, 2) + ',' + integer.substr(integer.length - 3,3);
        }

        decimal = numberSplit[1];

        return (type === 'income' ? '+' : '-') + ' ' + integer + '.' + decimal;

    };

    var nodeForEach = function (lists, callback) {

        for (var i = 0; i < lists.length; i++)
            callback(lists[i], i)
    };

    // Public functions

    return {

        // Function to get User Input

        getInput: function () {
            return {

                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)

            };
        },

        // Function to add an Item to UI 

        addItem: function (obj, type) {

            var html,newHtml,element;

            if (type === 'income') {

                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description"><strong>%desc%</strong></div><div class="right clearfix"><div class="item__value"><strong>%value%</strong></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            else if (type === 'expense') {

                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description"><strong>%desc%</strong></div><div class="right clearfix"><div class="item__value"><strong>%value%</strong></div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.description);
            newHtml = newHtml.replace('%value%', numberFormat(obj.value,type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        // Function to show percentage of each expense in UI

        displayPercentage: function (percentages) {

            var fieldArray = document.querySelectorAll(DOMStrings.expensePercentage);
             

            // Use of first function for moving in nodes

            nodeForEach(fieldArray, function (cur, index) {

                if (percentages[index] > 0)
                    cur.textContent = percentages[index] + '%';
                else
                    cur.textContent = '---';
            });
        },

        // Function to delete an item from UI

        deleteItem: function (id) {
            var ele = document.getElementById(id);

            ele.parentNode.removeChild(ele);
        },

        // Function to clear all the input fields

        clearFields: function () {

            document.querySelector(DOMStrings.inputDescription).value = "";

            document.querySelector(DOMStrings.inputValue).value = "";

            // Focus method for better UX

            document.querySelector(DOMStrings.inputType).focus();

        },

        // Function for Displaying whole Budget

        addBudget: function (b) {
            if (b.budget >= 0)
                document.querySelector(DOMStrings.budget).innerHTML = '<strong>' + numberFormat(b.budget, 'income') + '</strong>';
            else
                document.querySelector(DOMStrings.budget).innerHTML = '<strong>' + numberFormat(b.budget, 'expense') + '</strong>';

            document.querySelector(DOMStrings.income).textContent = numberFormat(b.income, 'income');
            document.querySelector(DOMStrings.expense).textContent = numberFormat(b.expense, 'expense');

            if (b.percentage > 0)
                document.querySelector(DOMStrings.percentage).innerHTML = b.percentage + '%';
            else
                document.querySelector(DOMStrings.percentage).innerHTML = '---';
        },

        displayDate: function () {

            var date, month, year, months;

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            date = new Date();
            month = date.getMonth();
            year = date.getFullYear();

            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        colorChange: function () {

            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue);

            nodeForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputButton).classList.toggle('red');
        },

        // Returning function for controll module 

        getDomStrings: function () {
            return DOMStrings;
        }
    };
   

})();

// General Control Module

var controller = (function (budgetctrl, uictrl) {


    // Setup Function

    var setupEventListener = function () {

        var DOM = uictrl.getDomStrings();

        // Event Listener for Button

        document.querySelector(DOM.inputButton).addEventListener('click', addItem);

        // Event Listener for Enter

        document.addEventListener('keypress', function (e) {

            if (e.keyCode === 13 || e.which === 13)
                addItem();

        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', uictrl.colorChange);

    }

    var updateBudget = function () {

        budgetctrl.calculateBudget();

        var budget = budgetctrl.getData();

        uictrl.addBudget(budget);
    }

    var addItem = function () {

        // 1.get the input from the form.

        var input = uictrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2.update the budget and income/expense

            var newItem = budgetctrl.addItem(input.type, input.description, input.value);

            // 3.update UI.

            uictrl.addItem(newItem, input.type);

            uictrl.clearFields();

            // 4.Calculate the Budget

            updateBudget();

            // 5.Calculate Percentage

            updatePercentage();
            

        }


    }

    var updatePercentage = function () {

        // 1.Claculate Pecentage

        budgetctrl.updatePercentage();

        // 2.get the percentage from budget controller

        var percentages = budgetctrl.getPercentage();

        // 3.Update the UI

        uictrl.displayPercentage(percentages);
    }

    var ctrlDeleteItem = function (event) {

        var rowId, splitRowId, type, id;

        // DOM Traversal

        rowId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (rowId) {
            splitRowId = rowId.split('-');
            type = splitRowId[0];
            id = parseInt(splitRowId[1]);
        }

        // 1. Remove from Data Sttructure from Budget Control Module

        budgetctrl.deleteItem(type, id);

        // 2.Remove row from UI

        uictrl.deleteItem(rowId);

        // 3.Update the budget after deleting

        updateBudget();

        // 4.Update Percentage

        updatePercentage();

    }

    // Public functions 

    return {

        // Initialisation Function

        init: function () {

            uictrl.displayDate();
            uictrl.addBudget({

                income: 0,
                expense: 0,
                budget: 0,
                percentage: -1

            });

            // Function call to set the screen

            setupEventListener();
        } 
    };

    

})(budgetController, UIController);

// Calling of Initalise Function

controller.init();
