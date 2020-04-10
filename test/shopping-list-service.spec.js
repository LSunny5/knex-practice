const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`Shopping list service object`, function () {
    let db;
    let testItems = [
        {
            id: 1,
            name: 'First test item!',
            date_added: new Date('2020-01-01T18:15:15Z'),
            price: '32.00',
            category: 'Main'
        },
        {
            id: 2,
            name: 'First test item!',
            date_added: new Date('2020-03-15T15:25:30Z'),
            price: '3.50',
            category: 'Snack'
        },
        {
            id: 3,
            name: 'First test item!',
            date_added: new Date('2020-06-30T12:00:00Z'),
            price: '8.99',
            category: 'Lunch'
        },
        {
            id: 4,
            name: 'Big breakfast',
            date_added: new Date('2020-09-09T06:30:30Z'),
            price: '6.00',
            category: 'Breakfast'
        },
    ];

    before('setup db', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
    });

    // Before all tests run and after each individual test, empty the shopping list table
    before('clean db before', () => db('shopping_list').truncate());
    afterEach('clean db after', () => db('shopping_list').truncate());
    after('destroy db connection', () => db.destroy());

    context('Given shopping_list has data', () => {
        beforeEach('insert test items', () => {
            return db.into('shopping_list').insert(testItems);
        });

        it(`getAllItems() gets all items from 'shopping_list' table`, () => {
            const expectedItems = testItems.map(item => ({
                ...item,
                checked: false,
            }));
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(expectedItems);
                });
        });

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const idToGet = 3;
            const thirdItem = testItems[idToGet - 1];
            return ShoppingListService.getById(db, idToGet)
                .then(actual => {
                    expect(actual).to.eql({
                        id: idToGet,
                        name: thirdItem.name,
                        date_added: thirdItem.date_added,
                        price: thirdItem.price,
                        category: thirdItem.category,
                        checked: false,
                    });
                });
        });

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const idToDelete = 3;
            return ShoppingListService.deleteItem(db, idToDelete)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    // copy the test items array without the removed item
                    const expected = testItems
                        .filter(item => item.id !== idToDelete)
                        .map(item => ({
                            ...item,
                            checked: false,
                        }));
                    expect(allItems).to.eql(expected);
                });
        });

        it(`updateItem() updates an item in the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3;
            const newItemData = {
                name: 'updated title',
                price: '99.99',
                date_added: new Date(),
                checked: true,
            };
            const originalItem = testItems[idOfItemToUpdate - 1];
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...originalItem,
                        ...newItemData,
                    });
                });
        });
    });

    //No Data
    context('Given shopping_list has no data', () => {
        it('getAllItems() returns an empty array', () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                });
        });

        it(`insertItem() inserts an item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Chips',
                price: '2.45',
                date_added: new Date('2020-04-10T00:00:00.000Z'),
                checked: true,
                category: 'Snack',
            };
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category,
                    });
                });
        });

        it('getById should return undefined', () => {
            return ShoppingListService
                .getById(db, 999)
                .then(item => expect(item).to.be.undefined);
        });

        it('delete should return 0 items affected', () => {
            return ShoppingListService
                .deleteItem(db, 999)
                .then(itemsAffected => expect(itemsAffected).to.eq(0));
        });

        it('update should return 0 rows affected', () => {
            return ShoppingListService
                .updateItem(db, 999, { name: 'unknown' })
                .then(itemAffected => expect(itemAffected).to.eq(0));
        }); 
    });
});