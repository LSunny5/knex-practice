const ArticlesService = require('../src/articles-service')
const knex = require('knex')

//failing test
describe(`Articles service object`, function () {
    /* it(`should run the tests`, () => {
       expect(true).to.eql(false)*/
    let db
    let testArticles = [
        {
            id: 1,
            date_published: new Date('2029-01-22T16:28:32.615Z'),
            title: 'First test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
        },
        {
            id: 2,
            date_published: new Date('2100-05-22T16:28:32.615Z'),
            title: 'Second test post!',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
        },
        {
            id: 3,
            date_published: new Date('1919-12-22T16:28:32.615Z'),
            title: 'Third test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
        },
    ];


    before('setup db', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
    });

    // Before all tests run and after each individual test, empty the
    // blogful_articles table
    before('clean db', () => db('blogful_articles').truncate());
    afterEach('clean db', () => db('blogful_articles').truncate());

    //remove to check for empty array
    /*  before(() => {
         return db
             .into('blogful_articles')
             .insert(testArticles)
     }) */

    after('destroy db connection', () => db.destroy());
    //  })

    /*************************************************************/
    describe(`getAllArticles()`, () => {
        it('returns an empty array', () => {
            return ArticlesService
                .getAllArticles(db)
                .then(articles => expect(articles).to.eql([]));
        });

        // Whenever we set a context with data present, we should always include
        // a beforeEach() hook within the context that takes care of adding the
        // appropriate data to our table
        context(`Given 'blogful_articles' has data`, () => {
            //before(() => {
            beforeEach('insert test articles', () => {
                db('blogful_articles')
                    .insert(testArticles)

                it('returns all test articles', () => {
                    return ArticlesService
                        .getAllArticles(db)
                        .then(articles => expect(articles).to.eql(testArticles));
                });

                //return db
                //   .into('blogful_articles')
                //  .insert(testArticles)
            });
        });
    });

    //it(`resolves all articles from 'blogful_articles' table`, () => {
    // test that ArticlesService.getAllArticles gets data from table
    //it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
    //   return ArticlesService.getAllArticles(db)
    //      .then(actual => {
    //expect(actual).to.eql(testArticles)
    //          expect(actual).to.eql(testArticles.map(article => ({
    //             ...article,
    ///           date_published: new Date(article.date_published)
    //      })))
    // })
    //})

    // context(`Given 'blogful_articles' has no data`, () => {
    //    it(`getAllArticles() resolves an empty array`, () => {
    //       return ArticlesService.getAllArticles(db)
    //         .then(actual => {
    //            expect(actual).to.eql([])
    //      })
    //  })
    //})

    /*************************************************************/
    describe('insertArticle()', () => {
        //checking adding articles
        it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, () => {
            const newArticle = {
                title: 'Test new title',
                content: 'Test new content',
                date_published: new Date('2020-01-01T00:00:00.000Z'),
            }
            return ArticlesService.insertArticle(db, newArticle)
                //update to assert that method resolves the newly created artcle with incremented ID
                //the ID should be 1 as the table is empty
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        title: newArticle.title,
                        content: newArticle.content,
                        date_published: new Date(newArticle.date_published),
                    });
                });
        });

        it('throws not-null constraint error if title not provided', () => {
            // Subject for the test does not contain a `title` field, so we
            // expect the database to prevent the record to be added      
            const newArticle = {
                content: 'Test new content',
                date_published: new Date('2020-01-01T00:00:00.000Z'),
            };

            // The .then() method on a promise can optionally take a second argument:
            // The first callback occurs if the promise is resolved, which we've been
            // using for all our promise chains. The second occurs if promise is 
            // rejected. In the following test, we EXPECT the promise to be rejected 
            // as the database should throw an error due to the NOT NULL constraint 
            return ArticlesService
                .insertArticle(db, newArticle)
                .then(
                    () => expect.fail('db should throw error'),
                    err => expect(err.message).to.include('not-null')
                );
        });
    });

    /*************************************************************/
    describe('getById()', () => {
        it('should return undefined', () => {
            return ArticlesService
                .getById(db, 999)
                .then(article => expect(article).to.be.undefined);
        });

        context('with data present', () => {
            before('insert articles', () =>
                db('blogful_articles')
                    .insert(testArticles)
            );

            it('should return existing article', () => {
                const expectedArticleId = 3;
                const expectedArticle = testArticles.find(a => a.id === expectedArticleId);
                return ArticlesService.getById(db, expectedArticleId)
                    .then(actual => expect(actual).to.eql(expectedArticle));
            });
        });
    });

    ///        it(`getById() resolves an article by id from 'blogful_articles' table`, () => {
    //         const thirdId = 3
    //       const thirdTestArticle = testArticles[thirdId - 1]
    //      return ArticlesService.getById(db, thirdId)
    //      .then(actual => {
    //         expect(actual).to.eql({
    //          id: thirdId,
    //      title: thirdTestArticle.title,
    //      content: thirdTestArticle.content,
    //  date_published: thirdTestArticle.date_published,
    //})
    //})
    // })

    /*************************************************************/
    describe('deleteArticle()', () => {
        it('should return 0 rows affected', () => {
            return ArticlesService
                .deleteArticle(db, 999)
                .then(rowsAffected => expect(rowsAffected).to.eq(0));
        });

        context('with data present', () => {
            before('insert articles', () =>
                db('blogful_articles')
                    .insert(testArticles)
            );

            it('should return 1 row affected and record is removed from db', () => {
                const deletedArticleId = 1;

                return ArticlesService
                    .deleteArticle(db, deletedArticleId)
                    .then(rowsAffected => {
                        expect(rowsAffected).to.eq(1);
                        return db('blogful_articles').select('*');
                    })
                    .then(actual => {
                        // copy testArticles array with id 1 filtered out
                        const expected = testArticles.filter(a => a.id !== deletedArticleId);
                        expect(actual).to.eql(expected);
                    });
            });
        });
    });




    //       it(`deleteArticle() removes an article by id from 'blogful_articles' table`, () => {
    //           const articleId = 3
    //         return ArticlesService.deleteArticle(db, articleId)
    //           .then(() => ArticlesService.getAllArticles(db))
    //         .then(allArticles => {
    //           // copy the test articles array without the "deleted" article
    //         const expected = testArticles.filter(article => article.id !== articleId)
    //       expect(allArticles).to.eql(expected)
    ///     })
    //})
    
    
    /*************************************************************/
    describe('updateArticle()', () => {
        it('should return 0 rows affected', () => {
            return ArticlesService
                .updateArticle(db, 999, { title: 'new title!' })
                .then(rowsAffected => expect(rowsAffected).to.eq(0));
        });

        context('with data present', () => {
            before('insert articles', () =>
                db('blogful_articles')
                    .insert(testArticles)
            );

            it('should successfully update an article', () => {
                const updatedArticleId = 1;
                const testArticle = testArticles.find(a => a.id === updatedArticleId);
                // make copy of testArticle in db, overwriting with newly updated field value
                const updatedArticle = { ...testArticle, title: 'New title!' };

                return ArticlesService
                    .updateArticle(db, updatedArticleId, updatedArticle)
                    .then(rowsAffected => {
                        expect(rowsAffected).to.eq(1)
                        return db('blogful_articles').select('*').where({ id: updatedArticleId }).first();
                    })
                    .then(article => {
                        expect(article).to.eql(updatedArticle);
                    });
            });
        });




        // it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
        ///    const idOfArticleToUpdate = 3
        //  const newArticleData = {
        //        title: 'updated title',
        //       content: 'updated content',
        //      date_published: new Date(),
        // }
        ///    return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
        //      .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
        //     .then(article => {
        //        expect(article).to.eql({
        //           id: idOfArticleToUpdate,
        //          ...newArticleData,
        //     })
        //})
        //})
    })
})