export default function FriendlyDate({ date }) {
	let str = date as string;
	if (str.startsWith('"')) str = str.substr(1, str.length - 2);

	let d = new Date(str);
	return (
		<span>{d.toLocaleDateString()}</span>
	);
}
