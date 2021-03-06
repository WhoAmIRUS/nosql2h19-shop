const express = require('express');
const router = express.Router();

const adminInitializer = require('../firebaseInitialiseApp');

const admin = adminInitializer.initialize();
const firestore = admin.firestore();


router.post('/', async (req, res) => {
  const userSnapshots = await firestore.collection('users')
     .get()

  const accounts = userSnapshots.docs.reduce((accounts, doc) => [...accounts, ...doc.data().accounts], [])
  let categories = {}

  for (const accountId of accounts) {
    const transactionsSnapshot = await firestore.collection('transactions')
       .where('accountId', '==', accountId)
       .get()

    transactionsSnapshot.forEach(doc => {
      const {category, amount} = doc.data()

      categories[category] = categories[category] ? categories[category] : 0;
      categories[category] += amount
    })
  }

  categories =  Object
     .entries(categories)
     .map(categoryItem => ({category: categoryItem[0], amount: categoryItem[1]}))

  res.json({categories});
});

module.exports = router
