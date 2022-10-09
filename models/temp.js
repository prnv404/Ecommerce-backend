import { MongoClient } from 'mongodb'
import { ObjectId } from 'mongodb'

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
	{
		$match: {
			product: new ObjectId('634151140693f4210753e86d'),
		},
	},
	{
		$group: {
			_id: null,
			averageRating: {
				$avg: '$rating',
			},
			numOfReviews: {
				$sum: 1,
			},
		},
	},
]

const client = await MongoClient.connect(
	'mongodb+srv://pranav:7ygZu9CDnr2xUKTN@cluster0.hbisyns.mongodb.net/test',
	{ useNewUrlParser: true, useUnifiedTopology: true }
)
const coll = client.db('ecommerce').collection('reviews')
const cursor = coll.aggregate(agg)
const result = await cursor.toArray()
await client.close()
