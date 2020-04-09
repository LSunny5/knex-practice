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



//A function that takes one parameter for daysAgo which will be a number representing a number of days.
//This function will query the shopping_list table using Knex methods and select the rows which have a date_added that is greater than the daysAgo.


//get the total cost for each category


//A function that takes no parameters
//The function will query the shopping_list table using Knex methods and select the rows grouped by their category and showing the total price for each category.



