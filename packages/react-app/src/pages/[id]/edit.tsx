import Error400 from '../400';

const EditBounty = (): JSX.Element => {
	// const router = useRouter();
	// const { id, key } = router.query;
	// const { data: bounty, error } = useSWR(
	// 	id ? `/api/bounties/${id}?key=${key}` : null,
	// 	fetcher
	// );

	// if (error) return <p>Failed to load</p>;
	// if (!bounty) return <p>Loading...</p>;

	return (
		<>
			<Error400 />
			{/* <Form bountyForm={bounty} /> */}
		</>
	);
};

export default EditBounty;
