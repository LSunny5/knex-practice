//methods for CRUD: get, insert, update and delete
const ShoppingListService = {

    //get all items
    getAllItems(knex) {
        return knex.select('*').from('shopping_list');
    },

    //insert item
    insertItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },

    //get by Id
    getById(knex, id) {
        return knex.from('shopping_list').select('*').where('id', id).first();
    },

    //delete item
    deleteItem(knex, id) {
        return knex('shopping_list')
            .where({ id })
            .delete();
    },

    //update item
    updateItem(knex, id, newItemFields) {
        return knex('shopping_list').where({ id }).update(newItemFields);
    },
};

module.exports = ShoppingListService;