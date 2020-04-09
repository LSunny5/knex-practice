require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})

//get all items that contain text
function searchName(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log('Search results:  ', { searchTerm })
            console.log(result)
        })
}

searchName('izz');
//returns one result


//get all items paginated
function paginateItems(pageNumber) {
    const limit = 6
    const offset = limit * (pageNumber - 1)
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(limit)
        .offset(offset)
        .then(result => {
            console.log('Paginate items:  ', pageNumber)
            console.log(result)
        })
}

paginateItems(3)
//6 results for paginateItems


//get all items added after date
function itemsAddedAfterDays(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
        )
        .then(results => {
            console.log('Items added after', daysAgo, 'days ago:  ')
            console.log(results)
        })
}

itemsAddedAfterDays(2)
//4 results returned for Items added after date


//get the total cost for each category
function costCategory() {
    knexInstance
        .select('category')
        .from('shopping_list')
        .groupBy('category')
        .sum('price AS total')
        .then(result => {
            console.log('Total price in each category:  ')
            console.log(result)
        })
}

costCategory()
//lunch - 15.80, main - 76.37, snack - 21.89, breakfast - 20.63