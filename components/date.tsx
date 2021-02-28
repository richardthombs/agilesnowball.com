export default function FriendlyDate({ date }) {
	return (
		<span>{date.toLocaleDateString()}</span>
	);
}
