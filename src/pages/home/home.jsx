import { useState, useEffect } from 'react';
import { projectDB } from '../../firebase/config';
import RecipeList from '../../components/recipe-list';

const Home = () => {
	const [data, setData] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		setIsPending(true);

		projectDB
			.collection('recipes')
			.get()
			.then((snapshot) => {
				if (snapshot.empty) {
					setError('There are currently no recipes to load');
					setIsPending(false);
				} else {
					let results = [];
					snapshot.docs.forEach((doc) => {
						results.push({ id: doc.id, ...doc.data() });
					});

					setData(results);
					setIsPending(false);
				}
			})
			.catch((err) => {
				setError(err.message);
				setIsPending(false);
			});
	}, []);

	return (
		<div className="home">
			{error && <p className="error">{error}</p>}

			{isPending && <p className="loading">Loading...</p>}

			{data && <RecipeList recipes={data} />}
		</div>
	);
};

export default Home;
